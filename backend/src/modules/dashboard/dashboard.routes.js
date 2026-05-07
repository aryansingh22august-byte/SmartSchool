import { Router } from 'express';
import authenticate from '../../core/middleware/auth.js';
import { query, isMock } from '../../core/db.js';

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

  if (req.user.role === 'super-admin') {
    if (isMock()) {
      return res.json({
        user: { id: req.user.sub, name: req.user.name, role: req.user.role },
        metrics: [
          { label: 'Total Schools', value: '12', detail: '+2 this month' },
          { label: 'Total Users', value: '4,520', detail: 'Across all schools' },
          { label: 'Monthly Revenue', value: '$12,400', detail: '+15% vs last month' },
          { label: 'Active Subscriptions', value: '11', detail: '92% retention' }
        ],
        chartData: [
          { name: 'Jan', revenue: 8000, schools: 8 },
          { name: 'Feb', revenue: 9500, schools: 9 },
          { name: 'Mar', revenue: 11000, schools: 10 },
          { name: 'Apr', revenue: 12400, schools: 12 }
        ],
        announcements: []
      });
    }

    const saasMetrics = [
      { label: 'Total Schools', sql: 'SELECT COUNT(*) AS count FROM schools' },
      { label: 'Total Users', sql: 'SELECT (SELECT COUNT(*) FROM students) + (SELECT COUNT(*) FROM staff) + (SELECT COUNT(*) FROM users) AS count' },
      { label: 'Monthly Revenue', sql: 'SELECT COALESCE(SUM(monthly_price), 0) AS count FROM subscriptions WHERE status = \'active\'' },
      { label: 'Active Subscriptions', sql: 'SELECT COUNT(*) AS count FROM subscriptions WHERE status = \'active\'' }
    ];

    const rows = await Promise.all(
      saasMetrics.map(async (metric) => {
        const resObj = await query(metric.sql);
        const countValue = resObj.rows[0]?.count || 0;
        const value = metric.label === 'Monthly Revenue' ? `$${countValue}` : `${countValue}`;
        return {
          label: metric.label,
          value,
          detail: 'Live Data'
        };
      })
    );

    return res.json({
      user: { id: req.user.sub, name: req.user.name, role: req.user.role },
      metrics: rows,
      chartData: [
        { name: 'Jan', revenue: 8000, schools: 8 },
        { name: 'Feb', revenue: 9500, schools: 9 },
        { name: 'Mar', revenue: 11000, schools: 10 },
        { name: 'Apr', revenue: 12400, schools: 12 }
      ],
      announcements: []
    });
  }

  const metrics = [
    { label: 'Total Students', sql: 'SELECT COUNT(*) AS count FROM students WHERE school_id = $1' },
    { label: 'Total Staff', sql: 'SELECT COUNT(*) AS count FROM staff WHERE school_id = $1' },
    { label: 'Today Attendance', sql: "SELECT percentage FROM attendance WHERE school_id = $1 ORDER BY date DESC LIMIT 1" },
    { label: 'Fees Collected', sql: 'SELECT COALESCE(SUM(paid), 0) AS amount FROM fees WHERE school_id = $1' }
  ];

  const rows = await Promise.all(
    metrics.map(async (metric) => {
      const resObj = await query(metric.sql, [req.user.school_id]);
      const value = metric.label === 'Fees Collected' ? `$${resObj.rows[0]?.amount || 0}` : metric.label === 'Today Attendance' ? `${resObj.rows[0]?.percentage || '0%'}` : `${resObj.rows[0]?.count || 0}`;
      return {
        label: metric.label,
        value,
        detail: 'Live Data'
      };
    })
  );

  res.json({
    user: { id: req.user.sub, name: req.user.name, role: req.user.role },
    metrics: rows,
    chartData: [
      { name: 'Mon', attendance: 95, fees: 1200 },
      { name: 'Tue', attendance: 92, fees: 800 },
      { name: 'Wed', attendance: 96, fees: 1500 },
      { name: 'Thu', attendance: 91, fees: 600 },
      { name: 'Fri', attendance: 94, fees: 2100 }
    ],
    announcements: []
  });
});

export default router;
