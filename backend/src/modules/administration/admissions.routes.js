import { Router } from 'express';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    const { admissions } = await import('../data/mockData.js');
    return res.json({ admissions });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, student_name AS student, grade, status, admission_date AS "admissionDate", previous_school, parent_email, parent_phone FROM admissions ${schoolFilter} ORDER BY admission_date DESC`, 
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );

  res.json({ admissions: result.rows });
});

router.post('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { student, grade, previous_school, parent_email, parent_phone } = req.body;
  if (!student || !grade) {
    return res.status(400).json({ message: 'Student and grade are required.' });
  }

  if (isMock()) {
    const { admissions } = await import('../data/mockData.js');
    const record = { id: `A${Date.now()}`, student, grade, status: 'Pending', admissionDate: new Date().toISOString().slice(0, 10), previous_school, parent_email, parent_phone };
    admissions.push(record);
    return res.status(201).json({ admission: record });
  }

  const id = `A${Date.now()}`;
  const result = await query(
    'INSERT INTO admissions (id, school_id, student_name, grade, status, admission_date, previous_school, parent_email, parent_phone) VALUES ($1, $2, $3, $4, $5, current_date, $6, $7, $8) RETURNING id, student_name AS student, grade, status, admission_date AS "admissionDate", previous_school, parent_email, parent_phone',
    [id, req.user.school_id, student, grade, 'Pending', previous_school, parent_email, parent_phone]
  );

  res.status(201).json({ admission: result.rows[0] });
});

export default router;
