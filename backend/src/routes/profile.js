import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import { query, isMock } from '../db.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  if (isMock()) {
    return res.json({ profile: { id: req.user.sub, name: req.user.name, role: req.user.role, email: req.user.email || 'admin@smartschool.local', school_id: req.user.school_id } });
  }

  const result = await query('SELECT id, school_id, name, role, email FROM users WHERE id = $1', [req.user.sub]);
  const user = result.rows[0];
  if (!user) return res.status(404).json({ message: 'Profile not found' });

  return res.json({ profile: user });
});

export default router;
