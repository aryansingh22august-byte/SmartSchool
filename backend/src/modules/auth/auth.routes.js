import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query, isMock } from '../../core/db.js';
import { roles as roleDefinitions } from '../../core/data/roles.js';
import { validate } from '../../core/middleware/validate.js';
import authenticate from '../../core/middleware/auth.js';

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

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let user;

    if (isMock()) {
      user = users.find((entry) => entry.username === username || entry.email === username);
    } else {
      const result = await query('SELECT u.id, u.school_id, u.username, u.password_hash, u.role, u.name, u.email, r.permissions FROM users u LEFT JOIN roles r ON u.role = r.id WHERE username = $1 OR email = $1', [username]);
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    return res.json({ success: true, user: payload, token }); // Keeping token in response temporarily for frontend fallback
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return res.json({ success: true });
});

router.get('/me', authenticate, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
