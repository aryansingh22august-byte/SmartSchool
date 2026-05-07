import { useEffect, useState } from 'react';
import api from '../../../app/api';

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/roles')
      .then((response) => setRoles(response.data.roles))
      .catch(() => setError('Unable to load role definitions.'));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Role Management</h2>
        <p className="mt-2 text-sm text-slate-500">View role definitions and permissions for each user type.</p>
      </div>

      {roles.map((role) => (
        <div key={role.id} className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{role.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{role.description}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{role.id}</span>
          </div>
          <div className="mt-4 space-y-2 text-slate-600">
            <p className="font-medium text-slate-800">Permissions</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {role.permissions.map((permission) => (
                <li key={permission} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default RolesPage;
