import { useEffect, useState } from 'react';
import api from '../api';

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then((response) => setDashboard(response.data))
      .catch(() => setError('Unable to load dashboard data.'));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard overview</h2>
        <p className="mt-2 text-sm text-slate-500">School-wide analytics and announcements.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {dashboard?.metrics?.map((metric) => (
          <div key={metric.label} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-500">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Announcements</h3>
          <ul className="mt-4 space-y-4 text-slate-600">
            {dashboard?.announcements?.map((item) => (
              <li key={item.title} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm">{item.subtitle}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
          <div className="mt-4 space-y-3 text-slate-600">
            <div className="rounded-2xl border border-slate-200 p-4">Manage admissions and student intake with ease.</div>
            <div className="rounded-2xl border border-slate-200 p-4">Track attendance and classroom performance daily.</div>
            <div className="rounded-2xl border border-slate-200 p-4">Generate reports, fees lists, and transfer certificates.</div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default DashboardPage;
