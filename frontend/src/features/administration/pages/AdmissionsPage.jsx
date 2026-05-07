import { useEffect, useState } from 'react';
import api from '../../../app/api';

function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [newAdmission, setNewAdmission] = useState({ student: '', grade: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/admissions').then((res) => setAdmissions(res.data.admissions));
  }, []);

  const handleChange = (e) => {
    setNewAdmission({ ...newAdmission, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/admissions', newAdmission);
      setAdmissions([res.data.admission, ...admissions]);
      setSuccess('Admission application submitted successfully.');
      setNewAdmission({ student: '', grade: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit admission.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Admissions</h2>
        <p className="mt-2 text-sm text-slate-500">Review pending applications and enrollment status.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">New Admission Application</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <input name="student" value={newAdmission.student} onChange={handleChange} placeholder="Applicant Full Name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none text-sm" required />
          </div>
          <div className="md:col-span-1">
            <input name="grade" value={newAdmission.grade} onChange={handleChange} placeholder="Grade Applying For" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none text-sm" required />
          </div>
          <div className="md:col-span-1">
            <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">Submit Application</button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Admission Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admissions.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">{item.id}</td>
                <td className="px-4 py-4">{item.student}</td>
                <td className="px-4 py-4">{item.grade}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${item.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4">{item.admissionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdmissionsPage;
