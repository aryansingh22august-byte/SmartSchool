import { Route, Routes, Navigate } from 'react-router-dom';

// Common
import Layout from './common/components/Layout';
import PublicLayout from './common/components/PublicLayout';
import RoleRoute from './common/components/RoleRoute';

// Auth
import LoginPage from './features/auth/pages/LoginPage';
import ProfilePage from './features/auth/pages/ProfilePage';
import RolesPage from './features/auth/pages/RolesPage';
import UsersPage from './features/auth/pages/UsersPage';

// Public
import LandingPage from './features/public/pages/LandingPage';
import AboutPage from './features/public/pages/AboutPage';
import ContactPage from './features/public/pages/ContactPage';
import PricingPage from './features/public/pages/PricingPage';
import FAQPage from './features/public/pages/FAQPage';
import PrivacyPolicyPage from './features/public/pages/PrivacyPolicyPage';
import TermsPage from './features/public/pages/TermsPage';
import NotFoundPage from './features/public/pages/NotFoundPage';
import UnauthorizedPage from './features/public/pages/UnauthorizedPage';

// Dashboard
import DashboardPage from './features/dashboard/pages/DashboardPage';

// Schools
import SchoolsPage from './features/schools/pages/SchoolsPage';
import SchoolDetailsPage from './features/schools/pages/SchoolDetailsPage';

// Academics
import TimetablePage from './features/academics/pages/TimetablePage';
import ExamsPage from './features/academics/pages/ExamsPage';
import AttendancePage from './features/academics/pages/AttendancePage';
import StudentsPage from './features/academics/pages/StudentsPage';

// Administration
import AdmissionsPage from './features/administration/pages/AdmissionsPage';
import FeesPage from './features/administration/pages/FeesPage';
import StaffPage from './features/administration/pages/StaffPage';
import LeavesPage from './features/administration/pages/LeavesPage';
import TransferCertificatePage from './features/administration/pages/TransferCertificatePage';
import PayrollPage from './features/administration/pages/PayrollPage';
import LibraryPage from './features/administration/pages/LibraryPage';
import AuditLogsPage from './features/administration/pages/AuditLogsPage';
import DataExportPage from './features/administration/pages/DataExportPage';

// Communication
import MessagesPage from './features/communication/pages/MessagesPage';

function App() {
  const token = localStorage.getItem('school_erp_token');

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher', 'student', 'parent']}><DashboardPage /></RoleRoute>} />
        <Route path="schools" element={<RoleRoute allowedRoles={['super-admin']}><SchoolsPage /></RoleRoute>} />
        <Route path="schools/:schoolId" element={<RoleRoute allowedRoles={['super-admin']}><SchoolDetailsPage /></RoleRoute>} />
        <Route path="admissions" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><AdmissionsPage /></RoleRoute>} />
        <Route path="fees" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><FeesPage /></RoleRoute>} />
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
        <Route path="payroll" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><PayrollPage /></RoleRoute>} />
        <Route path="library" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher', 'student', 'parent']}><LibraryPage /></RoleRoute>} />
        <Route path="audit-logs" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><AuditLogsPage /></RoleRoute>} />
        <Route path="data-export" element={<RoleRoute allowedRoles={['super-admin', 'admin']}><DataExportPage /></RoleRoute>} />
        <Route path="profile" element={<RoleRoute allowedRoles={['super-admin', 'admin', 'teacher', 'student', 'parent']}><ProfilePage /></RoleRoute>} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
