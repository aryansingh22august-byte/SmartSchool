import { useEffect, useState } from 'react';
import api from '../api';

function FeesPage() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    api.get('/fees').then((res) => setFees(res.data.fees));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Fees Management</h2>
        <p className="mt-2 text-sm text-slate-500">Track collections, dues, and student payments.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fees.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">{item.id}</td>
                <td className="px-4 py-4">{item.student}</td>
                <td className="px-4 py-4">${item.amount}</td>
                <td className="px-4 py-4">${item.paid}</td>
                <td className="px-4 py-4">${item.amount - item.paid}</td>
                <td className="px-4 py-4">{item.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeesPage;
