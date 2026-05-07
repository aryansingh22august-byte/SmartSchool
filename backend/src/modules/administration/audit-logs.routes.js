import { Router } from 'express';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

// GET /api/audit-logs — filtered by school, entity, user, date range
router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return res.json({ logs: [
      { id: 'log-1', user_name: 'System Administrator', action: 'CREATE', entity: 'users', entity_id: 'user-99', created_at: new Date().toISOString() },
      { id: 'log-2', user_name: 'Math Teacher', action: 'UPDATE', entity: 'exam_marks', entity_id: 'mk-01', created_at: new Date().toISOString() },
      { id: 'log-3', user_name: 'System Administrator', action: 'DELETE', entity: 'fees', entity_id: 'F002', created_at: new Date().toISOString() }
    ]});
  }

  const { entity, userId, from, to, limit = 100 } = req.query;
  const filters = [];
  const params = [];
  let idx = 1;

  if (req.user.role !== 'super-admin') {
    filters.push(`school_id = $${idx++}`);
    params.push(req.user.school_id);
  }
  if (entity) { filters.push(`entity = $${idx++}`); params.push(entity); }
  if (userId) { filters.push(`user_id = $${idx++}`); params.push(userId); }
  if (from) { filters.push(`created_at >= $${idx++}`); params.push(from); }
  if (to) { filters.push(`created_at <= $${idx++}`); params.push(to); }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  params.push(Math.min(parseInt(limit), 500));

  const result = await query(
    `SELECT id, user_name, action, entity, entity_id, old_value, new_value, ip_address, created_at
     FROM audit_logs ${where} ORDER BY created_at DESC LIMIT $${idx}`,
    params
  );
  res.json({ logs: result.rows, count: result.rows.length });
});

export default router;
