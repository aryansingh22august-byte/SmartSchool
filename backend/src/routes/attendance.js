import { Router } from 'express';
import { query, isMock } from '../db.js';
import authenticate from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  if (isMock()) {
    const { attendance } = await import('../data/mockData.js');
    return res.json({ attendance });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, date, present, absent, percentage FROM attendance ${schoolFilter} ORDER BY date DESC`,
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );
  res.json({ attendance: result.rows });
});

export default router;
