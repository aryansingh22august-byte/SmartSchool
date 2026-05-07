import { Navigate, useLocation } from 'react-router-dom';
import { parseJwt } from '../utils/auth.js';

function RoleRoute({ allowedRoles = [], allowedPermissions = [], children }) {
  const location = useLocation();
  const token = localStorage.getItem('school_erp_token');
  const payload = parseJwt(token);

  if (!token || !payload) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedPermissions.length > 0) {
    const userPermissions = payload.permissions || [];
    const hasPermission = allowedPermissions.some((permission) => userPermissions.includes(permission));
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

export default RoleRoute;
