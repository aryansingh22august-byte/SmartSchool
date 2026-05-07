import { Router } from 'express';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

/**
 * Converts array of objects to CSV string
 */
function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    const values = headers.map(h => {
      const val = row[h] === null || row[h] === undefined ? '' : String(row[h]);
      return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
    });
    lines.push(values.join(','));
  }
  return lines.join('\n');
}

function sendCSV(res, filename, data) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(toCSV(data));
}

// GET /api/export/students
router.get('/students', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return sendCSV(res, 'students.csv', [
      { id: 'ST001', name: 'Riya Sharma', grade: '7', section: 'A', status: 'Active' }
    ]);
  }
  const result = await query(
    'SELECT id, name, grade, section, status, created_at FROM students WHERE school_id=$1 ORDER BY grade, name',
    [req.user.school_id]
  );
  sendCSV(res, 'students.csv', result.rows);
});

// GET /api/export/fees
router.get('/fees', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return sendCSV(res, 'fees.csv', [
      { id: 'F001', student: 'Riya Sharma', amount: 1200, paid: 1200, pending: 0, due_date: '2026-04-15' }
    ]);
  }
  const result = await query(
    `SELECT id, student_name AS student, amount, paid, (amount - paid) AS pending, due_date FROM fees
     WHERE school_id=$1 ORDER BY due_date`,
    [req.user.school_id]
  );
  sendCSV(res, 'fees.csv', result.rows);
});

// GET /api/export/staff
router.get('/staff', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return sendCSV(res, 'staff.csv', [
      { id: 'S001', name: 'Mr. R. Verma', role: 'Math Teacher', status: 'Active' }
    ]);
  }
  const result = await query(
    'SELECT id, name, role, status, created_at FROM staff WHERE school_id=$1 ORDER BY name',
    [req.user.school_id]
  );
  sendCSV(res, 'staff.csv', result.rows);
});

// GET /api/export/attendance
router.get('/attendance', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return sendCSV(res, 'attendance.csv', [
      { date: '2026-04-30', present: 286, absent: 26, percentage: '91.7%' }
    ]);
  }
  const result = await query(
    'SELECT date, present, absent, percentage FROM attendance WHERE school_id=$1 ORDER BY date DESC',
    [req.user.school_id]
  );
  sendCSV(res, 'attendance.csv', result.rows);
});

// GET /api/export/marks?examId=xxx
router.get('/marks', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { examId } = req.query;
  if (isMock()) {
    return sendCSV(res, 'marks.csv', [
      { student_name: 'Riya Sharma', subject: 'Math', marks_obtained: 87, total_marks: 100, grade_letter: 'A' }
    ]);
  }
  const filters = ['em.school_id=$1'];
  const params = [req.user.school_id];
  if (examId) { filters.push(`em.exam_id=$${params.length + 1}`); params.push(examId); }

  const result = await query(
    `SELECT s.name AS student_name, em.subject, em.marks_obtained, em.total_marks, em.grade_letter
     FROM exam_marks em JOIN students s ON em.student_id=s.id
     WHERE ${filters.join(' AND ')} ORDER BY s.name, em.subject`,
    params
  );
  sendCSV(res, 'marks.csv', result.rows);
});

// GET /api/export/admissions
router.get('/admissions', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return sendCSV(res, 'admissions.csv', [
      { id: 'A001', student_name: 'Nikhil Patel', grade: '8', status: 'Pending', admission_date: '2026-02-20' }
    ]);
  }
  const result = await query(
    'SELECT id, student_name, grade, status, admission_date FROM admissions WHERE school_id=$1 ORDER BY admission_date DESC',
    [req.user.school_id]
  );
  sendCSV(res, 'admissions.csv', result.rows);
});

export default router;
