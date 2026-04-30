import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import AdmissionsPage from './pages/AdmissionsPage';
import FeesPage from './pages/FeesPage';
import TimetablePage from './pages/TimetablePage';
import ExamsPage from './pages/ExamsPage';
import AttendancePage from './pages/AttendancePage';
import MessagesPage from './pages/MessagesPage';
import StaffPage from './pages/StaffPage';
import StudentsPage from './pages/StudentsPage';
import LeavesPage from './pages/LeavesPage';
import TransferCertificatePage from './pages/TransferCertificatePage';
import ProfilePage from './pages/ProfilePage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RoleRoute from './components/RoleRoute';

function App() {
  const token = localStorage.getItem('school_erp_token');

  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher', 'student', 'parent']}><DashboardPage /></RoleRoute>} />
        <Route path="admissions" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><AdmissionsPage /></RoleRoute>} />
        <Route path="fees" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher']}><FeesPage /></RoleRoute>} />
        <Route path="timetable" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher', 'student', 'parent']}><TimetablePage /></RoleRoute>} />
        <Route path="exams" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher', 'student', 'parent']}><ExamsPage /></RoleRoute>} />
        <Route path="attendance" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher']}><AttendancePage /></RoleRoute>} />
        <Route path="messages" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher']}><MessagesPage /></RoleRoute>} />
        <Route path="staff" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><StaffPage /></RoleRoute>} />
        <Route path="students" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher']}><StudentsPage /></RoleRoute>} />
        <Route path="users" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><UsersPage /></RoleRoute>} />
        <Route path="roles" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><RolesPage /></RoleRoute>} />
        <Route path="leaves" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><LeavesPage /></RoleRoute>} />
        <Route path="tc" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><TransferCertificatePage /></RoleRoute>} />
        <Route path="profile" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher', 'student', 'parent']}><ProfilePage /></RoleRoute>} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
