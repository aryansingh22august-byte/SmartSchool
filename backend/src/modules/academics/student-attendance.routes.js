import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

// GET /api/student-attendance?date=YYYY-MM-DD&classId=xxx
// Teachers can mark and view per-student attendance
router.get('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { date, classId } = req.query;
  if (!date) return res.status(400).json({ message: 'date query param is required.' });

  if (isMock()) {
    return res.json({
      date,
      records: [
        { student_id: 'student-1', student_name: 'Riya Sharma', status: 'present' },
        { student_id: 'student-2', student_name: 'Ayush Singh', status: 'absent' }
      ]
    });
  }

  let sql = `
    SELECT sa.id, sa.student_id, s.name AS student_name, sa.date, sa.status, sa.class_id
    FROM student_attendance sa
    JOIN students s ON sa.student_id = s.id
    WHERE sa.school_id = $1 AND sa.date = $2
  `;
  const params = [req.user.school_id, date];

  if (classId) {
    sql += ` AND sa.class_id = $3`;
    params.push(classId);
  }
  sql += ' ORDER BY s.name ASC';

  const result = await query(sql, params);
  res.json({ date, records: result.rows });
});

// POST /api/student-attendance — bulk mark attendance for a class
// Body: { date, classId, records: [{student_id, status}] }
router.post('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { date, classId, records } = req.body;
  if (!date || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: 'date and records[] are required.' });
  }

  const saved = [];
  for (const rec of records) {
    const { student_id, status } = rec;
    if (!student_id || !status) continue;
    const id = `sa-${uuid().slice(0, 8)}`;
    const result = await query(
      `INSERT INTO student_attendance (id, school_id, student_id, class_id, date, status, marked_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (student_id, date)
       DO UPDATE SET status = EXCLUDED.status, marked_by = EXCLUDED.marked_by
       RETURNING *`,
      [id, req.user.school_id, student_id, classId || null, date, status, req.user.sub]
    );
    saved.push(result.rows[0]);
  }

  res.json({ saved, count: saved.length });
});

// GET /api/student-attendance/summary?studentId=xxx
router.get('/summary', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(400).json({ message: 'studentId is required.' });

  const result = await query(
    `SELECT
      COUNT(*) FILTER (WHERE status = 'present') AS present_count,
      COUNT(*) FILTER (WHERE status = 'absent') AS absent_count,
      COUNT(*) FILTER (WHERE status = 'late') AS late_count,
      COUNT(*) AS total_days
     FROM student_attendance
     WHERE student_id = $1 AND school_id = $2`,
    [studentId, req.user.school_id]
  );
  res.json({ summary: result.rows[0] });
});

export default router;
