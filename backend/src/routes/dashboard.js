import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import { query, isMock } from '../db.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  if (isMock()) {
    return res.json({
      user: { id: req.user.sub, name: req.user.name, role: req.user.role },
      metrics: [
        { label: 'Total Students', value: '1,248', detail: '+12% vs last term' },
        { label: 'Total Staff', value: '86', detail: 'Stable active duty' },
        { label: 'Today Attendance', value: '94.2%', detail: '-2.1% from average' },
        { label: 'Fees Collected', value: '$84.2k', detail: '88% of monthly target' }
      ],
      announcements: [
        { title: 'Summer Term Planning', subtitle: 'Schedule created for new academic session.' },
        { title: 'Fee Reminder', subtitle: 'Notify parents about the April fee cycle.' }
      ]
    });
  }

  const schoolFilter = req.user.role === 'super-admin' ? '' : 'WHERE school_id = $1';
  const metrics = [
    { label: 'Total Students', sql: 'SELECT COUNT(*) AS count FROM students' },
    { label: 'Total Staff', sql: 'SELECT COUNT(*) AS count FROM staff' },
    { label: 'Today Attendance', sql: "SELECT percentage FROM attendance ORDER BY date DESC LIMIT 1" },
    { label: 'Fees Collected', sql: 'SELECT COALESCE(SUM(paid), 0) AS amount FROM fees' }
  ];

  const rows = await Promise.all(
    metrics.map(async (metric) => {
      const res = await query(`${metric.sql} ${schoolFilter}`, req.user.role === 'super-admin' ? [] : [req.user.school_id]);
      const value = metric.label === 'Fees Collected' ? `$${res.rows[0].amount}` : metric.label === 'Today Attendance' ? `${res.rows[0]?.percentage || '0%'} ` : `${res.rows[0]?.count || 0}`;
      return {
        label: metric.label,
        value,
        detail:
          metric.label === 'Total Students'
            ? '+12% vs last term'
            : metric.label === 'Total Staff'
            ? 'Stable active duty'
            : metric.label === 'Today Attendance'
            ? '-2.1% from average'
            : '88% of monthly target'
      };
    })
  );

  res.json({ user: { id: req.user.sub, name: req.user.name, role: req.user.role }, metrics: rows, announcements: [] });
});

export default router;
