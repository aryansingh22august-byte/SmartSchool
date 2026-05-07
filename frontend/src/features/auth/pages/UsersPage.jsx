import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../app/api';

function UsersPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const schoolId = searchParams.get('schoolId');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', email: '', role: 'teacher' });
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', role: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const userPath = schoolId ? `/users?schoolId=${schoolId}` : '/users';
        const [usersResponse, rolesResponse] = await Promise.all([api.get(userPath), api.get('/roles')]);
        setUsers(usersResponse.data.users);
        setRoles(rolesResponse.data.roles);

        if (rolesResponse.data.roles.length > 0) {
          setNewUser((prev) => ({ ...prev, role: rolesResponse.data.roles[0].id }));
        }
      } catch (err) {
        setError('Unable to load users and roles.');
      }
    }

    loadData();
  }, [schoolId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = { ...newUser };
      if (schoolId) payload.school_id = schoolId;
      const response = await api.post('/users', payload);
      setUsers((prev) => [...prev, response.data.user]);
      setSuccess('User created successfully.');
      setNewUser({ username: '', password: '', name: '', email: '', role: newUser.role });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEditData({ name: user.name, email: user.email, role: user.role, password: '' });
    setError('');
    setSuccess('');
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditData({ name: '', email: '', role: '', password: '' });
    setError('');
    setSuccess('');
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingUser) return;
    setError('');
    setSuccess('');

    try {
      const payload = { name: editData.name, email: editData.email, role: editData.role };
      if (editData.password) payload.password = editData.password;
      const response = await api.put(`/users/${editingUser.id}`, payload);
      setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? response.data.user : user)));
      setSuccess('User updated successfully.');
      cancelEditing();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleDelete = async (userId) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSuccess('User deleted successfully.');
      if (editingUser?.id === userId) cancelEditing();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">User Administration</h2>
            <p className="mt-2 text-sm text-slate-500">Create users, edit roles, and manage access for the school.</p>
            {schoolId && <p className="mt-2 text-sm font-medium text-slate-600">Showing users for school ID: {schoolId}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Create New User</h3>
        <form className="grid gap-4 md:grid-cols-2 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              name="username"
              value={newUser.username}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              name="name"
              value={newUser.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              value={newUser.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex items-end justify-end">
            <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-700">
              Create User
            </button>
          </div>
        </form>
      </div>

      {editingUser && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Edit User</h3>
          <form className="grid gap-4 md:grid-cols-2 mt-4" onSubmit={handleUpdate}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <select
                name="role"
                value={editData.role}
                onChange={handleEditChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={editData.password}
                onChange={handleEditChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <button type="button" onClick={cancelEditing} className="rounded-2xl border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-700">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">User List</h3>
          <span className="text-sm text-slate-500">{users.length} users</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">{user.username}</td>
                  <td className="px-4 py-4">{user.name}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4">{user.role}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button type="button" onClick={() => startEditing(user)} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(user.id)} className="rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {success && <p className="text-sm text-green-600">{success}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default UsersPage;
