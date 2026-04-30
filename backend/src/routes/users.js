import { Router } from 'express';
import bcrypt from 'bcryptjs';
import authenticate from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorize.js';
import { query, isMock } from '../db.js';
import { roles as roleDefinitions } from '../data/roles.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  if (isMock()) {
    const users = [
      {
        id: 'admin-1',
        username: 'admin',
        name: 'System Administrator',
        role: 'super-admin',
        email: 'admin@smartschool.local'
      },
      {
        id: 'teacher-1',
        username: 'teacher',
        name: 'Math Teacher',
        role: 'teacher',
        email: 'teacher@smartschool.local'
      }
    ];
    return res.json({ users });
  }

  const result = await query(
    `SELECT u.id, u.username, u.name, u.email, u.role, r.name AS role_name, r.permissions FROM users u LEFT JOIN roles r ON u.role = r.id ORDER BY u.username`,
    []
  );
  res.json({ users: result.rows });
});

router.post('/', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { username, password, name, email, role, school_id } = req.body;
  if (!username || !password || !name || !email || !role) {
    return res.status(400).json({ message: 'username, password, name, email, and role are required.' });
  }

  const roleMeta = roleDefinitions.find((entry) => entry.id === role);
  if (!roleMeta) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  if (isMock()) {
    const user = {
      id: `user-${Date.now()}`,
      username,
      name,
      email,
      role
    };
    return res.status(201).json({ user });
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const id = `user-${Date.now()}`;
  const result = await query(
    'INSERT INTO users (id, school_id, username, password_hash, role, name, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, name, email, role',
    [id, school_id || req.user.school_id, username, password_hash, role, name, email]
  );

  res.status(201).json({ user: result.rows[0] });
});

router.put('/:id', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  const roleMeta = roleDefinitions.find((entry) => entry.id === role);
  if (role && !roleMeta) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  if (isMock()) {
    return res.json({ user: { id, name, email, role } });
  }

  const updateFields = [];
  const values = [];
  let index = 1;

  if (name) {
    updateFields.push(`name = $${index++}`);
    values.push(name);
  }
  if (email) {
    updateFields.push(`email = $${index++}`);
    values.push(email);
  }
  if (role) {
    updateFields.push(`role = $${index++}`);
    values.push(role);
  }
  if (password) {
    updateFields.push(`password_hash = $${index++}`);
    values.push(bcrypt.hashSync(password, 10));
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'No fields provided for update.' });
  }

  let queryText = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${index}`;
  values.push(id);

  if (req.user.role !== 'super-admin') {
    queryText += ` AND school_id = $${++index}`;
    values.push(req.user.school_id);
  }

  queryText += ' RETURNING id, username, name, email, role';

  const result = await query(queryText, values);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found or not allowed to update.' });
  }

  res.json({ user: result.rows[0] });
});

router.delete('/:id', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { id } = req.params;

  if (isMock()) {
    return res.status(204).end();
  }

  const values = [id];
  let queryText = 'DELETE FROM users WHERE id = $1';

  if (req.user.role !== 'super-admin') {
    queryText += ' AND school_id = $2';
    values.push(req.user.school_id);
  }

  const result = await query(queryText, values);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'User not found or not allowed to delete.' });
  }

  res.status(204).end();
});

export default router;
