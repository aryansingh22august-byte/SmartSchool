import { Router } from 'express';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    const { leaves } = await import('../data/mockData.js');
    return res.json({ leaves });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, type, name, duration, status FROM leaves ${schoolFilter} ORDER BY created_at DESC`,
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );
  res.json({ leaves: result.rows });
});

router.post('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { type, name, duration } = req.body;
  if (!type || !name || !duration) {
    return res.status(400).json({ message: 'Type, name, and duration are required.' });
  }

  if (isMock()) {
    const { leaves } = await import('../data/mockData.js');
    const record = { id: `L${Date.now()}`, type, name, duration, status: 'Pending' };
    leaves.push(record);
    return res.status(201).json({ leave: record });
  }

  const id = `L${Date.now()}`;
  const result = await query(
    'INSERT INTO leaves (id, school_id, type, name, duration, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, type, name, duration, status',
    [id, req.user.school_id, type, name, duration, 'Pending']
  );
  res.status(201).json({ leave: result.rows[0] });
});

export default router;
