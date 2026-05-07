export const ROLE_DEFINITIONS = {
  'super-admin': {
    id: 'super-admin',
    label: 'Super Admin',
    permissions: ['manage_all', 'manage_users', 'manage_schools', 'view_reports']
  },
  admin: {
    id: 'admin',
    label: 'School Admin',
    permissions: ['view_reports', 'manage_admissions', 'manage_fees', 'manage_staff', 'manage_students', 'manage_timetable', 'manage_attendance']
  },
  teacher: {
    id: 'teacher',
    label: 'Teacher',
    permissions: ['view_students', 'manage_attendance', 'view_timetable', 'view_exams', 'send_messages']
  },
  student: {
    id: 'student',
    label: 'Student',
    permissions: ['view_own_profile', 'view_timetable', 'view_exams']
  },
  parent: {
    id: 'parent',
    label: 'Parent',
    permissions: ['view_child_profile', 'view_child_attendance', 'view_child_exams']
  }
};

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', roles: ['super-admin', 'admin', 'teacher', 'student', 'parent'] },
  { path: '/schools', label: 'School Accounts', roles: ['super-admin'] },
  { path: '/admissions', label: 'Admissions', roles: ['super-admin', 'admin'] },
  { path: '/fees', label: 'Fees', roles: ['super-admin', 'admin'] },
  { path: '/timetable', label: 'Timetable', roles: ['super-admin', 'admin', 'teacher', 'student', 'parent'] },
  { path: '/exams', label: 'Exams', roles: ['super-admin', 'admin', 'teacher', 'student', 'parent'] },
  { path: '/attendance', label: 'Attendance', roles: ['super-admin', 'admin', 'teacher'] },
  { path: '/messages', label: 'Messages', roles: ['super-admin', 'admin', 'teacher'] },
  { path: '/staff', label: 'Staff', roles: ['super-admin', 'admin'] },
  { path: '/students', label: 'Students', roles: ['super-admin', 'admin', 'teacher'] },
  { path: '/users', label: 'Users', roles: ['super-admin', 'admin'] },
  { path: '/roles', label: 'Roles', roles: ['super-admin', 'admin'] },
  { path: '/leaves', label: 'Leaves', roles: ['super-admin', 'admin'] },
  { path: '/tc', label: 'TC', roles: ['super-admin', 'admin'] },
  { path: '/profile', label: 'Profile', roles: ['super-admin', 'admin', 'teacher', 'student', 'parent'] }
];
