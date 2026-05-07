import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

// GET /api/classes — list classes for this school (teachers see only their own)
router.get('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  if (isMock()) {
    return res.json({ classes: [{ id: 'cls-1', name: 'Class 7A', grade: '7', section: 'A', class_teacher_id: 'teacher-1' }] });
  }
  const isTeacher = req.user.role === 'teacher';
  const sql = isTeacher
    ? 'SELECT c.*, u.name AS teacher_name FROM classes c LEFT JOIN users u ON c.class_teacher_id = u.id WHERE c.school_id = $1 AND c.class_teacher_id = $2 ORDER BY c.grade, c.section'
    : 'SELECT c.*, u.name AS teacher_name FROM classes c LEFT JOIN users u ON c.class_teacher_id = u.id WHERE c.school_id = $1 ORDER BY c.grade, c.section';
  const params = isTeacher ? [req.user.school_id, req.user.sub] : [req.user.school_id];
  const result = await query(sql, params);
  res.json({ classes: result.rows });
});

// POST /api/classes — admin creates a class
router.post('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { name, grade, section, class_teacher_id } = req.body;
  if (!name || !grade || !section) return res.status(400).json({ message: 'name, grade, and section are required.' });
  const id = `cls-${uuid().slice(0, 8)}`;
  const result = await query(
    'INSERT INTO classes (id, school_id, name, grade, section, class_teacher_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [id, req.user.school_id, name, grade, section, class_teacher_id || null]
  );
  res.status(201).json({ class: result.rows[0] });
});

// GET /api/classes/:classId/students — list students in this class
router.get('/:classId/students', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const result = await query(
    'SELECT id, name, grade, section, status FROM students WHERE school_id = $1 AND grade = (SELECT grade FROM classes WHERE id = $2) AND section = (SELECT section FROM classes WHERE id = $2) ORDER BY name',
    [req.user.school_id, req.params.classId]
  );
  res.json({ students: result.rows });
});

export default router;
