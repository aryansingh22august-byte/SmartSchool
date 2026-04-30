import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, isMock } from '../db.js';
import { roles as roleDefinitions } from '../data/roles.js';

const router = Router();
const users = [
  {
    id: 'admin-1',
    school_id: 'school-1',
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin', 10),
    role: 'super-admin',
    name: 'System Administrator',
    email: 'admin@smartschool.local'
  },
  {
    id: 'teacher-1',
    school_id: 'school-1',
    username: 'teacher',
    passwordHash: bcrypt.hashSync('teacher', 10),
    role: 'teacher',
    name: 'Math Teacher',
    email: 'teacher@smartschool.local'
  }
];

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let user;

  if (isMock()) {
    user = users.find((entry) => entry.username === username);
  } else {
    const result = await query('SELECT u.id, u.school_id, u.username, u.password_hash, u.role, u.name, u.email, r.permissions FROM users u LEFT JOIN roles r ON u.role = r.id WHERE username = $1', [username]);
    user = result.rows[0];
  }

  if (!user || !bcrypt.compareSync(password, user.password_hash || user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const roleMeta = roleDefinitions.find((entry) => entry.id === user.role);
  const permissions = roleMeta?.permissions || user.permissions || [];

  const payload = {
    sub: user.id,
    school_id: user.school_id,
    role: user.role,
    name: user.name,
    email: user.email,
    permissions
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '8h'
  });

  return res.json({ token });
});

export default router;
