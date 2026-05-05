import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function SchoolDetailsPage() {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await api.get(`/schools/${schoolId}`);
        setSchool(response.data.school);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load school details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  if (loading) {
    return <div className="text-slate-600">Loading school details...</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  }

  if (!school) {
    return <div className="text-slate-600">School not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{school.name}</h1>
            <p className="mt-2 text-sm text-slate-500">School account details and configuration.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/users?schoolId=${school.id}`)}
            className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Manage Users for this school
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">School Name</dt>
            <dd className="mt-2 text-lg font-semibold text-slate-900">{school.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Domain</dt>
            <dd className="mt-2 text-lg font-semibold text-slate-900">{school.domain || 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Created</dt>
            <dd className="mt-2 text-lg font-semibold text-slate-900">{new Date(school.created_at).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">School ID</dt>
            <dd className="mt-2 text-lg font-semibold text-slate-900">{school.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default SchoolDetailsPage;
