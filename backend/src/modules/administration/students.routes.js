import { Router } from 'express';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  if (isMock()) {
    const { students } = await import('../data/mockData.js');
    return res.json({ students });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, name, grade, section, status FROM students ${schoolFilter} ORDER BY name ASC`,
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );
  res.json({ students: result.rows });
});

export default router;
