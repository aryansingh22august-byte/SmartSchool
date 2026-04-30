import { Router } from 'express';
import { query, isMock } from '../db.js';
import authenticate from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  if (isMock()) {
    const { messages } = await import('../data/mockData.js');
    return res.json({ messages });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, sender, subject, date, status FROM messages ${schoolFilter} ORDER BY date DESC`,
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );
  res.json({ messages: result.rows });
});

router.post('/send', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  const { sender, subject, body } = req.body;
  if (!sender || !subject) {
    return res.status(400).json({ message: 'Sender and subject are required.' });
  }

  if (isMock()) {
    const { messages } = await import('../data/mockData.js');
    const record = { id: `M${Date.now()}`, sender, subject, body, date: new Date().toISOString().slice(0, 10), status: 'Sent' };
    messages.unshift(record);
    return res.status(201).json({ message: record });
  }

  const id = `M${Date.now()}`;
  const result = await query(
    'INSERT INTO messages (id, school_id, sender, subject, body, date, status) VALUES ($1, $2, $3, $4, $5, current_date, $6) RETURNING id, sender, subject, date, status',
    [id, req.user.school_id, sender, subject, body || '', 'Sent']
  );

  res.status(201).json({ message: result.rows[0] });
});

export default router;
