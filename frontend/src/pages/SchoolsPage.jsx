import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SchoolsPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', domain: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schools');
      setSchools(response.data.schools || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load schools.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name) {
      setError('School name is required.');
      return;
    }

    try {
      const response = await api.post('/schools', formData);
      setSchools((prev) => [...prev, response.data.school]);
      setFormData({ name: '', domain: '' });
      setShowForm(false);
      setSuccess('School created successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create school.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">School Accounts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add School'}
        </button>
      </div>

      {success && (
        <div className="rounded-md bg-green-100 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-100 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-md bg-blue-50 p-8">
          <h2 className="text-xl font-semibold text-blue-900">Create New School Account</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-blue-900">School Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border-0 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., St. John's Academy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900">Domain (optional)</label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border-0 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., stjohns.edu"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create School
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-slate-600">Loading schools...</div>
      ) : schools.length === 0 ? (
        <div className="rounded-md bg-slate-100 p-8 text-center">
          <p className="text-slate-600">No schools created yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {schools.map((school, index) => {
            const colors = ['bg-indigo-50', 'bg-sky-50', 'bg-emerald-50'];
            const colorBg = colors[index % colors.length];
            return (
              <div key={school.id} className={`rounded-md ${colorBg} p-8`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{school.name}</h3>
                    {school.domain && <p className="mt-1 text-sm text-slate-700">Domain: {school.domain}</p>}
                    <p className="mt-2 text-sm text-slate-600">Created: {new Date(school.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/users?schoolId=${school.id}`)}
                      className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                    >
                      Manage Users
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/schools/${school.id}`)}
                      className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SchoolsPage;
