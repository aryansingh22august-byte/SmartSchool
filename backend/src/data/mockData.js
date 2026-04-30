export const users = [
  {
    id: 'admin-1',
    username: 'admin',
    displayName: 'System Administrator',
    role: 'super-admin',
    email: 'admin@smartschool.local'
  },
  {
    id: 'teacher-1',
    username: 'teacher',
    displayName: 'Math Teacher',
    role: 'teacher',
    email: 'teacher@smartschool.local'
  }
];

export const dashboardData = {
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
};

export const admissions = [
  { id: 'A001', student: 'Riya Sharma', grade: '7', status: 'Accepted', admissionDate: '2026-02-14' },
  { id: 'A002', student: 'Nikhil Patel', grade: '8', status: 'Pending', admissionDate: '2026-02-20' }
];

export const fees = [
  { id: 'F001', student: 'Riya Sharma', amount: 1200, paid: 1200, dueDate: '2026-04-15' },
  { id: 'F002', student: 'Ayush Singh', amount: 950, paid: 600, dueDate: '2026-04-18' }
];

export const timetable = [
  { day: 'Monday', subject: 'Math', teacher: 'Mr. Verma', time: '09:00 - 10:00' },
  { day: 'Monday', subject: 'Science', teacher: 'Ms. Khan', time: '10:15 - 11:15' }
];

export const exams = [
  { id: 'E001', name: 'Mid-Term Exam', grade: '7', date: '2026-05-21', status: 'Scheduled' },
  { id: 'E002', name: 'Final Exam', grade: '10', date: '2026-11-12', status: 'Planning' }
];

export const attendance = [
  { date: '2026-04-29', present: 294, absent: 18, percentage: '94.2%' },
  { date: '2026-04-30', present: 286, absent: 26, percentage: '91.7%' }
];

export const messages = [
  { id: 'M001', sender: 'Principal', subject: 'Holiday Notice', date: '2026-04-28', status: 'Sent' },
  { id: 'M002', sender: 'Admin', subject: 'Fee Reminder', date: '2026-04-25', status: 'Scheduled' }
];

export const staff = [
  { id: 'S001', name: 'Mr. R. Verma', role: 'Math Teacher', status: 'Active' },
  { id: 'S002', name: 'Ms. A. Khan', role: 'Science Teacher', status: 'Active' }
];

export const students = [
  { id: 'ST001', name: 'Riya Sharma', grade: '7', section: 'A', status: 'Active' },
  { id: 'ST002', name: 'Ayush Singh', grade: '8', section: 'B', status: 'Active' }
];

export const leaves = [
  { id: 'L001', type: 'Student', name: 'Riya Sharma', duration: '3 days', status: 'Approved' },
  { id: 'L002', type: 'Staff', name: 'Ms. A. Khan', duration: '1 day', status: 'Pending' }
];

export const tcs = [
  { id: 'TC001', student: 'Nikhil Patel', grade: '8', status: 'Generated', issuedDate: '2026-03-30' }
];
