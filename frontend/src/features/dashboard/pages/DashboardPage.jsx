import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import api from '../../../app/api';

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then((response) => setDashboard(response.data))
      .catch(() => setError('Unable to load dashboard data.'));
  }, []);

  const isSuperAdmin = dashboard?.user?.role === 'super-admin';

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-6">
        <h2 className="text-2xl font-semibold text-blue-900">Dashboard Overview</h2>
        <p className="mt-2 text-sm text-blue-700">
          {isSuperAdmin ? 'Platform-wide SaaS analytics.' : 'School-wide analytics and performance.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {dashboard?.metrics?.map((metric, idx) => {
          // alternate solid light colors
          const colors = ['bg-indigo-50', 'bg-green-50', 'bg-amber-50', 'bg-rose-50'];
          const textColors = ['text-indigo-900', 'text-green-900', 'text-amber-900', 'text-rose-900'];
          const labelColors = ['text-indigo-600', 'text-green-600', 'text-amber-600', 'text-rose-600'];
          const colorBg = colors[idx % colors.length];
          const colorText = textColors[idx % textColors.length];
          const colorLabel = labelColors[idx % labelColors.length];

          return (
            <div key={metric.label} className={`rounded-md ${colorBg} p-6`}>
              <p className={`text-sm font-medium ${colorLabel}`}>{metric.label}</p>
              <p className={`mt-4 text-3xl font-semibold ${colorText}`}>{metric.value}</p>
              <p className={`mt-2 text-sm ${colorLabel}`}>{metric.detail}</p>
            </div>
          );
        })}
      </div>

      {dashboard?.chartData && dashboard.chartData.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {isSuperAdmin ? (
            <>
              <div className="bg-slate-50 rounded-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Trend</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboard.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '4px' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-50 rounded-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Schools Growth</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '4px' }} />
                      <Bar dataKey="schools" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-50 rounded-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Attendance Trend</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboard.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '4px' }} />
                      <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-50 rounded-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Fees Collection</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '4px' }} />
                      <Bar dataKey="fees" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default DashboardPage;
