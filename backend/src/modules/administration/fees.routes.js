import { Router } from 'express';
import { query, isMock } from '../../core/db.js';
import authenticate from '../../core/middleware/auth.js';
import { authorizeRole } from '../../core/middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin', 'admin', 'teacher'), async (req, res) => {
  if (isMock()) {
    const { fees } = await import('../data/mockData.js');
    return res.json({ fees });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const result = await query(
    `SELECT id, student_name AS student, amount, paid, due_date AS "dueDate" FROM fees ${schoolFilter} ORDER BY due_date ASC`, 
    req.user.role === 'super-admin' ? [] : [req.user.school_id]
  );
  res.json({ fees: result.rows });
});

router.post('/pay', authorizeRole('super-admin', 'admin'), async (req, res) => {
  const { id, amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Payment amount must be a positive number.' });
  }

  if (isMock()) {
    const { fees } = await import('../data/mockData.js');
    const fee = fees.find((item) => item.id === id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    fee.paid += amount;
    return res.json({ fee });
  }

  const schoolCondition = req.user.role === 'super-admin' ? '' : 'AND school_id = $2';
  const params = req.user.role === 'super-admin' ? [id, amount] : [id, req.user.school_id, amount];
  const result = await query(
    `UPDATE fees SET paid = paid + $${params.length} WHERE id = $1 ${schoolCondition} RETURNING id, student_name AS student, amount, paid, due_date AS "dueDate"`,
    params
  );

  if (!result.rows.length) return res.status(404).json({ message: 'Fee record not found' });
  res.json({ fee: result.rows[0] });
});

export default router;
