import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import { query, isMock } from '../db.js';
import { authorizeRole } from '../middleware/authorize.js';
import { roles } from '../data/roles.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    return res.json({ roles });
  }

  const result = await query('SELECT id, name, description, permissions FROM roles ORDER BY name');
  res.json({ roles: result.rows });
});

export default router;
