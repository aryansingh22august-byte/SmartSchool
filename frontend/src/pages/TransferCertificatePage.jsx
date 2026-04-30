import { useEffect, useState } from 'react';
import api from '../api';

function TransferCertificatePage() {
  const [tcs, setTcs] = useState([]);

  useEffect(() => {
    api.get('/tc').then((res) => setTcs(res.data.tcs));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Transfer Certificates</h2>
        <p className="mt-2 text-sm text-slate-500">Generate and manage student transfer certificates.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ul className="space-y-4">
          {tcs.map((item) => (
            <li key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.student}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Grade: {item.grade}</p>
              <p className="mt-1 text-sm text-slate-600">Issued: {item.issuedDate}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TransferCertificatePage;
