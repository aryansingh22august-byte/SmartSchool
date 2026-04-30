import { useEffect, useState } from 'react';
import api from '../api';

function StaffPage() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    api.get('/staff').then((res) => setStaff(res.data.staff));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Staff Directory</h2>
        <p className="mt-2 text-sm text-slate-500">Manage teachers and support staff profiles.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">{item.id}</td>
                <td className="px-4 py-4">{item.name}</td>
                <td className="px-4 py-4">{item.role}</td>
                <td className="px-4 py-4">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffPage;
