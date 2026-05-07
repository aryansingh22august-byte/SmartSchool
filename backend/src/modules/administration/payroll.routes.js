import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';
import { writeAuditLog } from '../../core/audit.js';

const router = Router();
router.use(authenticate);

// GET /api/payroll?month=May&year=2026
router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { month, year } = req.query;
  if (isMock()) {
    return res.json({ slips: [
      { id: 'pay-1', staff_name: 'Mr. R. Verma', month: 'May', year: 2026, base_salary: 45000, present_days: 24, total_working_days: 26, deductions: 500, bonuses: 1000, net_salary: 42038.46, status: 'pending' },
      { id: 'pay-2', staff_name: 'Ms. A. Khan', month: 'May', year: 2026, base_salary: 38000, present_days: 26, total_working_days: 26, deductions: 0, bonuses: 0, net_salary: 38000, status: 'paid' }
    ]});
  }

  const filters = ['p.school_id = $1'];
  const params = [req.user.school_id];
  let idx = 2;
  if (month) { filters.push(`p.month = $${idx++}`); params.push(month); }
  if (year) { filters.push(`p.year = $${idx++}`); params.push(parseInt(year)); }

  const result = await query(
    `SELECT p.*, s.name AS staff_name, s.role AS staff_role
     FROM payroll p JOIN staff s ON p.staff_id = s.id
     WHERE ${filters.join(' AND ')} ORDER BY s.name`,
    params
  );
  res.json({ slips: result.rows });
});

// POST /api/payroll — generate salary slips for a month
router.post('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { month, year, slips } = req.body;
  if (!month || !year || !Array.isArray(slips)) {
    return res.status(400).json({ message: 'month, year, and slips[] are required.' });
  }

  const saved = [];
  for (const slip of slips) {
    const { staff_id, base_salary, present_days, total_working_days = 26, deductions = 0, bonuses = 0 } = slip;
    if (!staff_id || base_salary === undefined) continue;
    const id = `pay-${uuid().slice(0, 8)}`;
    const r = await query(
      `INSERT INTO payroll (id, school_id, staff_id, month, year, base_salary, present_days, total_working_days, deductions, bonuses)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (staff_id, month, year)
       DO UPDATE SET base_salary=EXCLUDED.base_salary, present_days=EXCLUDED.present_days,
                     deductions=EXCLUDED.deductions, bonuses=EXCLUDED.bonuses
       RETURNING *`,
      [id, req.user.school_id, staff_id, month, year, base_salary, present_days, total_working_days, deductions, bonuses]
    );
    saved.push(r.rows[0]);
  }

  await writeAuditLog(req, 'GENERATE', 'payroll', null, null, { month, year, count: saved.length });
  res.json({ saved, count: saved.length });
});

// PATCH /api/payroll/:id/mark-paid — mark a slip as paid
router.patch('/:id/mark-paid', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const result = await query(
    `UPDATE payroll SET status='paid', paid_on=CURRENT_DATE WHERE id=$1 AND school_id=$2 RETURNING *`,
    [req.params.id, req.user.school_id]
  );
  if (!result.rows.length) return res.status(404).json({ message: 'Slip not found.' });
  await writeAuditLog(req, 'MARK_PAID', 'payroll', req.params.id);
  res.json({ slip: result.rows[0] });
});

// GET /api/payroll/staff-attendance?month=May&year=2026
router.get('/staff-attendance', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { month, year } = req.query;
  if (isMock()) {
    return res.json({ records: [
      { staff_id: 'staff-1', staff_name: 'Mr. R. Verma', present: 24, absent: 1, half_day: 1, on_leave: 0 }
    ]});
  }
  const result = await query(
    `SELECT sa.staff_id, s.name AS staff_name,
       COUNT(*) FILTER (WHERE sa.status='present') AS present,
       COUNT(*) FILTER (WHERE sa.status='absent') AS absent,
       COUNT(*) FILTER (WHERE sa.status='half-day') AS half_day,
       COUNT(*) FILTER (WHERE sa.status='on-leave') AS on_leave
     FROM staff_attendance sa JOIN staff s ON sa.staff_id = s.id
     WHERE sa.school_id = $1 AND TO_CHAR(sa.date,'Mon') = $2 AND EXTRACT(YEAR FROM sa.date) = $3
     GROUP BY sa.staff_id, s.name ORDER BY s.name`,
    [req.user.school_id, month, parseInt(year)]
  );
  res.json({ records: result.rows });
});

// POST /api/payroll/staff-attendance — bulk mark daily staff attendance
router.post('/staff-attendance', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { date, records } = req.body;
  if (!date || !Array.isArray(records)) return res.status(400).json({ message: 'date and records[] required.' });

  const saved = [];
  for (const rec of records) {
    const { staff_id, status } = rec;
    if (!staff_id || !status) continue;
    const id = `sa-${uuid().slice(0, 8)}`;
    const r = await query(
      `INSERT INTO staff_attendance (id, school_id, staff_id, date, status, marked_by)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (staff_id, date) DO UPDATE SET status=EXCLUDED.status, marked_by=EXCLUDED.marked_by
       RETURNING *`,
      [id, req.user.school_id, staff_id, date, status, req.user.sub]
    );
    saved.push(r.rows[0]);
  }
  res.json({ saved, count: saved.length });
});

export default router;
