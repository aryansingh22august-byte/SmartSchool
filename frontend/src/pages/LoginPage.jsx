import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function LoginPage() {
  const [credentials, setCredentials] = useState({ username: 'admin', password: 'admin' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('school_erp_token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <h1 className="mb-2 text-3xl font-semibold text-slate-900">Smart School ERP</h1>
        <p className="mb-8 text-slate-500">Sign in to manage admissions, fees, attendance, and more.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
              placeholder="••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-700">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Use <span className="font-semibold">admin / admin</span> to access the system.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          <Link to="/" className="font-semibold text-slate-900 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
