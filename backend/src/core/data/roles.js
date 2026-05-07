export const roles = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access across all schools.',
    permissions: ['manage_all', 'manage_users', 'manage_schools', 'view_reports']
  },
  {
    id: 'admin',
    name: 'School Admin',
    description: 'Manage school operations, admissions, fees, staff, and students.',
    permissions: ['view_reports', 'manage_admissions', 'manage_fees', 'manage_staff', 'manage_students', 'manage_timetable', 'manage_attendance']
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'View student data, attendance, timetable and exam schedules.',
    permissions: ['view_students', 'manage_attendance', 'view_timetable', 'view_exams', 'send_messages']
  },
  {
    id: 'student',
    name: 'Student',
    description: 'View personal profile, timetable, and exam results.',
    permissions: ['view_own_profile', 'view_timetable', 'view_exams']
  },
  {
    id: 'parent',
    name: 'Parent',
    description: 'View linked student progress and attendance.',
    permissions: ['view_child_profile', 'view_child_attendance', 'view_child_exams']
  }
];
