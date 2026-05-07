import { Router } from 'express';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin', 'teacher', 'student', 'parent'), async (req, res) => {
  if (isMock()) {
    const { timetable } = await import('../data/mockData.js');
    return res.json({ timetable });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, day, subject, teacher_name AS teacher, time FROM timetable ${schoolFilter} ORDER BY day, time`, 
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );
  res.json({ timetable: result.rows });
});

export default router;
