import { Router } from 'express';
import { query, isMock } from '../db.js';
import authenticate from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin', 'teacher', 'student', 'parent'), async (req, res) => {
  if (isMock()) {
    const { exams } = await import('../data/mockData.js');
    return res.json({ exams });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, name, grade, date, status FROM exams ${schoolFilter} ORDER BY date ASC`, 
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );
  res.json({ exams: result.rows });
});

export default router;
