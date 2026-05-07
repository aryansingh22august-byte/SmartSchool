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
router.post('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { name, grade, section, status } = req.body;
  if (!name || !grade || !section) {
    return res.status(400).json({ message: 'Name, grade, and section are required.' });
  }

  if (isMock()) {
    const student = { id: `STU${Date.now()}`, name, grade, section, status: status || 'Active' };
    return res.status(201).json({ student });
  }

  const id = `STU${Date.now()}`;
  const result = await query(
    'INSERT INTO students (id, school_id, name, grade, section, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, grade, section, status',
    [id, req.user.school_id, name, grade, section, status || 'Active']
  );

  res.status(201).json({ student: result.rows[0] });
});

export default router;
