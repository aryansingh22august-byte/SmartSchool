import { useEffect, useState } from 'react';
import api from '../api';

function LeavesPage() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    api.get('/leaves').then((res) => setLeaves(res.data.leaves));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Leave Requests</h2>
        <p className="mt-2 text-sm text-slate-500">Approve or review student and staff leave applications.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ul className="space-y-4">
          {leaves.map((item) => (
            <li key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Type: {item.type}</p>
              <p className="mt-1 text-sm text-slate-600">Duration: {item.duration}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeavesPage;
