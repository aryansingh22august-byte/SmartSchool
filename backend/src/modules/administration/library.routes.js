import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';
import { writeAuditLog } from '../../core/audit.js';

const router = Router();
router.use(authenticate);

// GET /api/library/books
router.get('/books', authorizeRole('super-admin', 'admin', 'teacher', 'student', 'parent'), async (req, res) => {
  if (isMock()) {
    return res.json({ books: [
      { id: 'bk-1', title: 'Mathematics Class 10', author: 'NCERT', category: 'Textbook', total_copies: 30, available_copies: 18 },
      { id: 'bk-2', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Biography', total_copies: 10, available_copies: 6 },
      { id: 'bk-3', title: 'The Great Indian Novel', author: 'Shashi Tharoor', category: 'Fiction', total_copies: 5, available_copies: 5 }
    ]});
  }
  const result = await query(
    'SELECT * FROM library_books WHERE school_id = $1 ORDER BY title ASC',
    [req.user.school_id]
  );
  res.json({ books: result.rows });
});

// POST /api/library/books — add a new book
router.post('/books', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { title, author, isbn, category, total_copies = 1 } = req.body;
  if (!title || !author) return res.status(400).json({ message: 'title and author are required.' });
  const id = `bk-${uuid().slice(0, 8)}`;
  const result = await query(
    `INSERT INTO library_books (id, school_id, title, author, isbn, category, total_copies, available_copies, added_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$8) RETURNING *`,
    [id, req.user.school_id, title, author, isbn || null, category || null, total_copies, req.user.sub]
  );
  await writeAuditLog(req, 'CREATE', 'library_books', id, null, result.rows[0]);
  res.status(201).json({ book: result.rows[0] });
});

// GET /api/library/issues — all active issues
router.get('/issues', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  if (isMock()) {
    return res.json({ issues: [
      { id: 'iss-1', book_title: 'Wings of Fire', borrower_name: 'Riya Sharma', borrower_type: 'student', issued_on: '2026-05-01', due_date: '2026-05-15', status: 'issued' }
    ]});
  }
  const result = await query(
    `SELECT li.*, lb.title AS book_title, lb.author
     FROM library_issues li JOIN library_books lb ON li.book_id = lb.id
     WHERE li.school_id = $1 ORDER BY li.issued_on DESC`,
    [req.user.school_id]
  );
  res.json({ issues: result.rows });
});

// POST /api/library/issues — issue a book
router.post('/issues', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { book_id, borrower_id, borrower_type, borrower_name, due_date } = req.body;
  if (!book_id || !borrower_id || !borrower_type || !borrower_name || !due_date) {
    return res.status(400).json({ message: 'book_id, borrower_id, borrower_type, borrower_name, due_date are required.' });
  }

  // Check availability
  const bookRes = await query('SELECT available_copies FROM library_books WHERE id=$1 AND school_id=$2', [book_id, req.user.school_id]);
  if (!bookRes.rows.length) return res.status(404).json({ message: 'Book not found.' });
  if (bookRes.rows[0].available_copies < 1) return res.status(400).json({ message: 'No copies available.' });

  const id = `iss-${uuid().slice(0, 8)}`;
  const [issueResult] = await Promise.all([
    query(
      `INSERT INTO library_issues (id, school_id, book_id, borrower_id, borrower_type, borrower_name, due_date, issued_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, req.user.school_id, book_id, borrower_id, borrower_type, borrower_name, due_date, req.user.sub]
    ),
    query('UPDATE library_books SET available_copies = available_copies - 1 WHERE id=$1', [book_id])
  ]);

  await writeAuditLog(req, 'ISSUE', 'library_issues', id, null, { book_id, borrower_name });
  res.status(201).json({ issue: issueResult.rows[0] });
});

// PATCH /api/library/issues/:id/return — return a book
router.patch('/issues/:id/return', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const issueRes = await query('SELECT * FROM library_issues WHERE id=$1 AND school_id=$2', [req.params.id, req.user.school_id]);
  if (!issueRes.rows.length) return res.status(404).json({ message: 'Issue record not found.' });
  if (issueRes.rows[0].status === 'returned') return res.status(400).json({ message: 'Already returned.' });

  await Promise.all([
    query(`UPDATE library_issues SET status='returned', returned_on=CURRENT_DATE WHERE id=$1`, [req.params.id]),
    query('UPDATE library_books SET available_copies = available_copies + 1 WHERE id=$1', [issueRes.rows[0].book_id])
  ]);

  await writeAuditLog(req, 'RETURN', 'library_issues', req.params.id);
  res.json({ message: 'Book returned successfully.' });
});

export default router;
