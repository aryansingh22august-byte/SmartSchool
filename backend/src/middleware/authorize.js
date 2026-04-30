export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient role permissions' });
    }

    next();
  };
}

export function authorizePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const permissions = req.user.permissions || [];
    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
