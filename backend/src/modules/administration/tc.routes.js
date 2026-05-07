import { Router } from 'express';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    const { tcs } = await import('../data/mockData.js');
    return res.json({ tcs });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, student_name AS student, grade, status, issued_date AS "issuedDate" FROM transfer_certificates ${schoolFilter} ORDER BY issued_date DESC`,
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );
  res.json({ tcs: result.rows });
});

router.post('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { student, grade } = req.body;
  if (!student || !grade) {
    return res.status(400).json({ message: 'Student and grade are required.' });
  }

  if (isMock()) {
    const { tcs } = await import('../data/mockData.js');
    const record = { id: `TC${Date.now()}`, student, grade, status: 'Generated', issuedDate: new Date().toISOString().slice(0, 10) };
    tcs.push(record);
    return res.status(201).json({ tc: record });
  }

  const id = `TC${Date.now()}`;
  const result = await query(
    'INSERT INTO transfer_certificates (id, school_id, student_name, grade, status, issued_date) VALUES ($1, $2, $3, $4, $5, current_date) RETURNING id, student_name AS student, grade, status, issued_date AS "issuedDate"',
    [id, req.user.school_id, student, grade, 'Generated']
  );
  res.status(201).json({ tc: result.rows[0] });
});

export default router;
