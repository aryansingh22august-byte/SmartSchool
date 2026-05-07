import { Router } from 'express';
import authenticate from '../../core/middleware/auth.js';
import { query, isMock } from '../../core/db.js';
import { authorizeRole } from '../../core/middleware/authorize.js';
import { roles } from '../../core/data/roles.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    const filteredRoles = req.user.role === 'super-admin' ? roles : roles.filter(r => r.id !== 'super-admin');
    return res.json({ roles: filteredRoles });
  }

  const queryText = req.user.role === 'super-admin' 
    ? 'SELECT id, name, description, permissions FROM roles ORDER BY name'
    : "SELECT id, name, description, permissions FROM roles WHERE id != 'super-admin' ORDER BY name";

  const result = await query(queryText);
  res.json({ roles: result.rows });
});

export default router;
