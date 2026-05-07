import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

// GET /api/fee-services — list all extra services for this school
router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return res.json({ services: [
      { id: 'svc-1', name: 'School Transport', description: 'Daily pick & drop', monthly_cost: 800, is_active: true },
      { id: 'svc-2', name: 'School Meals', description: 'Lunch & snacks', monthly_cost: 500, is_active: true },
      { id: 'svc-3', name: 'Library', description: 'Book lending access', monthly_cost: 150, is_active: true }
    ]});
  }
  const result = await query(
    'SELECT * FROM fee_services WHERE school_id = $1 ORDER BY name ASC',
    [req.user.school_id]
  );
  res.json({ services: result.rows });
});

// POST /api/fee-services — create a new optional service
router.post('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { name, description, monthly_cost } = req.body;
  if (!name || monthly_cost === undefined) return res.status(400).json({ message: 'name and monthly_cost are required.' });
  const id = `svc-${uuid().slice(0, 8)}`;
  const result = await query(
    'INSERT INTO fee_services (id, school_id, name, description, monthly_cost) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [id, req.user.school_id, name, description || null, monthly_cost]
  );
  res.status(201).json({ service: result.rows[0] });
});

// DELETE /api/fee-services/:id — deactivate a service
router.delete('/:id', authorizeRole('super-admin', 'admin'), async (req, res) => {
  await query('UPDATE fee_services SET is_active = false WHERE id = $1 AND school_id = $2', [req.params.id, req.user.school_id]);
  res.json({ message: 'Service deactivated.' });
});

// GET /api/fee-services/student/:studentId — get services assigned to a student
router.get('/student/:studentId', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const result = await query(
    `SELECT fs.id, fs.name, fs.monthly_cost, sfs.assigned_at
     FROM student_fee_services sfs
     JOIN fee_services fs ON sfs.service_id = fs.id
     WHERE sfs.student_id = $1 AND sfs.school_id = $2`,
    [req.params.studentId, req.user.school_id]
  );
  res.json({ services: result.rows });
});

// POST /api/fee-services/student/:studentId/assign — assign a service to a student
router.post('/student/:studentId/assign', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { service_id } = req.body;
  if (!service_id) return res.status(400).json({ message: 'service_id is required.' });
  const id = `sfs-${uuid().slice(0, 8)}`;
  await query(
    'INSERT INTO student_fee_services (id, school_id, student_id, service_id) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING',
    [id, req.user.school_id, req.params.studentId, service_id]
  );
  res.json({ message: 'Service assigned.' });
});

// DELETE /api/fee-services/student/:studentId/remove — remove a service from a student
router.delete('/student/:studentId/remove', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { service_id } = req.body;
  await query(
    'DELETE FROM student_fee_services WHERE student_id = $1 AND service_id = $2 AND school_id = $3',
    [req.params.studentId, service_id, req.user.school_id]
  );
  res.json({ message: 'Service removed.' });
});

// GET /api/fee-services/student/:studentId/total — get total fees with services
router.get('/student/:studentId/total', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return res.json({ base_fee: 1200, services_total: 1300, grand_total: 2500, paid: 1200, pending: 1300 });
  }
  // Base fee from fees table
  const feeRes = await query('SELECT amount, paid FROM fees WHERE school_id = $1 AND student_name = (SELECT name FROM students WHERE id = $2) LIMIT 1', [req.user.school_id, req.params.studentId]);
  const baseFee = parseFloat(feeRes.rows[0]?.amount || 0);
  const paid = parseFloat(feeRes.rows[0]?.paid || 0);

  // Sum of assigned services
  const svcRes = await query(
    `SELECT COALESCE(SUM(fs.monthly_cost), 0) AS services_total
     FROM student_fee_services sfs
     JOIN fee_services fs ON sfs.service_id = fs.id
     WHERE sfs.student_id = $1 AND sfs.school_id = $2 AND fs.is_active = true`,
    [req.params.studentId, req.user.school_id]
  );
  const servicesTotal = parseFloat(svcRes.rows[0]?.services_total || 0);
  const grandTotal = baseFee + servicesTotal;
  const pending = grandTotal - paid;

  res.json({ base_fee: baseFee, services_total: servicesTotal, grand_total: grandTotal, paid, pending });
});

export default router;
