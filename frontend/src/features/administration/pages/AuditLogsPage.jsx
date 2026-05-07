import { useEffect, useState } from 'react';
import api from '../../../app/api';

const ACTION_COLORS = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  GENERATE: 'bg-purple-100 text-purple-700',
  MARK_PAID: 'bg-teal-100 text-teal-700',
  ISSUE: 'bg-amber-100 text-amber-700',
  RETURN: 'bg-slate-100 text-slate-700',
};

function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ entity: '', from: '', to: '' });

  const fetchLogs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.entity) params.set('entity', filters.entity);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    const res = await api.get(`/audit-logs?${params.toString()}`);
    setLogs(res.data.logs || []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const entities = ['users', 'exam_marks', 'fees', 'payroll', 'library_books', 'library_issues', 'student_attendance'];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-md p-6">
        <h2 className="text-2xl font-semibold text-white">Audit Logs</h2>
        <p className="mt-1 text-sm text-slate-400">Track every action performed by users across the platform.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-md p-4">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Filter by Entity</label>
            <select value={filters.entity} onChange={e => setFilters(p => ({ ...p, entity: e.target.value }))}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="">All Entities</option>
              {entities.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">From Date</label>
            <input type="date" value={filters.from} onChange={e => setFilters(p => ({ ...p, from: e.target.value }))}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">To Date</label>
            <input type="date" value={filters.to} onChange={e => setFilters(p => ({ ...p, to: e.target.value }))}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
          <div className="flex items-end">
            <button onClick={fetchLogs}
              className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Activity Log</h3>
          <span className="text-xs text-slate-500">{logs.length} records</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading logs…</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No audit records found.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="text-slate-500 text-xs uppercase tracking-wide bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Entity</th>
                <th className="px-4 py-3 text-left">Record ID</th>
                <th className="px-4 py-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{log.user_name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ACTION_COLORS[log.action] || 'bg-slate-100 text-slate-600'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">{log.entity}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{log.entity_id || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AuditLogsPage;
