import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

// GET /api/marks?examId=xxx  — view marks for an exam
router.get('/', authorizeRole('super-admin', 'admin', 'teacher', 'student', 'parent'), async (req, res) => {
  const { examId, studentId } = req.query;

  if (isMock()) {
    return res.json({
      marks: [
        { id: 'm-1', student_name: 'Riya Sharma', subject: 'Math', marks_obtained: 87, total_marks: 100, grade_letter: 'A' },
        { id: 'm-2', student_name: 'Riya Sharma', subject: 'Science', marks_obtained: 92, total_marks: 100, grade_letter: 'A+' }
      ]
    });
  }

  let sql = `
    SELECT em.id, s.name AS student_name, em.student_id, em.subject,
           em.marks_obtained, em.total_marks, em.grade_letter, em.created_at
    FROM exam_marks em
    JOIN students s ON em.student_id = s.id
    WHERE em.school_id = $1
  `;
  const params = [req.user.school_id];

  if (examId) { sql += ` AND em.exam_id = $${params.length + 1}`; params.push(examId); }
  if (studentId) { sql += ` AND em.student_id = $${params.length + 1}`; params.push(studentId); }
  sql += ' ORDER BY s.name, em.subject';

  const result = await query(sql, params);
  res.json({ marks: result.rows });
});

// POST /api/marks — save/update a student's mark for a subject in an exam
// Body: { exam_id, student_id, subject, marks_obtained, total_marks }
router.post('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { exam_id, student_id, subject, marks_obtained, total_marks = 100 } = req.body;
  if (!exam_id || !student_id || !subject || marks_obtained === undefined) {
    return res.status(400).json({ message: 'exam_id, student_id, subject, and marks_obtained are required.' });
  }

  // Auto-calculate grade letter
  const pct = (marks_obtained / total_marks) * 100;
  const grade_letter = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';

  const id = `mk-${uuid().slice(0, 8)}`;
  const result = await query(
    `INSERT INTO exam_marks (id, school_id, exam_id, student_id, subject, marks_obtained, total_marks, grade_letter, graded_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (exam_id, student_id, subject)
     DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained, total_marks = EXCLUDED.total_marks,
                   grade_letter = EXCLUDED.grade_letter, graded_by = EXCLUDED.graded_by
     RETURNING *`,
    [id, req.user.school_id, exam_id, student_id, subject, marks_obtained, total_marks, grade_letter, req.user.sub]
  );
  res.status(201).json({ mark: result.rows[0] });
});

// POST /api/marks/bulk — bulk submit marks for multiple students
router.post('/bulk', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { exam_id, subject, total_marks = 100, records } = req.body;
  if (!exam_id || !subject || !Array.isArray(records)) {
    return res.status(400).json({ message: 'exam_id, subject, and records[] are required.' });
  }
  const saved = [];
  for (const rec of records) {
    const { student_id, marks_obtained } = rec;
    if (!student_id || marks_obtained === undefined) continue;
    const pct = (marks_obtained / total_marks) * 100;
    const grade_letter = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';
    const id = `mk-${uuid().slice(0, 8)}`;
    const r = await query(
      `INSERT INTO exam_marks (id, school_id, exam_id, student_id, subject, marks_obtained, total_marks, grade_letter, graded_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (exam_id, student_id, subject)
       DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained, grade_letter = EXCLUDED.grade_letter, graded_by = EXCLUDED.graded_by
       RETURNING *`,
      [id, req.user.school_id, exam_id, student_id, subject, marks_obtained, total_marks, grade_letter, req.user.sub]
    );
    saved.push(r.rows[0]);
  }
  res.json({ saved, count: saved.length });
});

export default router;
