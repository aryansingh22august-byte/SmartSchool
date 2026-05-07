import { useEffect, useState, useMemo } from 'react';
import api from '../../../app/api';

function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [newAdmission, setNewAdmission] = useState({ 
    student: '', grade: '', previous_school: '', parent_email: '', parent_phone: '' 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      setNewAdmission({ student: '', grade: '', previous_school: '', parent_email: '', parent_phone: '' });
      setIsFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit admission.');
    }
  };

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((a) => {
      const matchesSearch = a.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (a.previous_school || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? a.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [admissions, searchQuery, statusFilter]);

  const uniqueStatuses = useMemo(() => [...new Set(admissions.map(a => a.status))], [admissions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Admissions Portal</h2>
          <p className="mt-2 text-sm text-slate-500">Review pending applications and track enrollment status.</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="floating-action-button px-6 py-3 text-sm font-semibold">
          {isFormOpen ? 'Close Form' : '+ New Application'}
        </button>
      </div>

      {isFormOpen && (
        <div className="rounded-3xl bg-white p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">New Admission Application</h3>
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Applicant Full Name</label>
              <input name="student" value={newAdmission.student} onChange={handleChange} className="minimal-input mt-1" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Grade Applying For</label>
              <input name="grade" value={newAdmission.grade} onChange={handleChange} className="minimal-input mt-1" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Previous School</label>
              <input name="previous_school" value={newAdmission.previous_school} onChange={handleChange} className="minimal-input mt-1" />
            </div>
            
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Parent Email</label>
              <input type="email" name="parent_email" value={newAdmission.parent_email} onChange={handleChange} className="minimal-input mt-1" />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Parent Phone</label>
              <input type="tel" name="parent_phone" value={newAdmission.parent_phone} onChange={handleChange} className="minimal-input mt-1" />
            </div>
            
            <div className="md:col-span-2 lg:col-span-1 flex items-end justify-end">
              <button type="submit" className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">Submit Application</button>
            </div>
          </form>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
        </div>
      )}

      <div className="rounded-3xl bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="flex-1 w-full relative">
            <input 
              type="text" 
              placeholder="Search by student name or previous school..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-800 focus:outline-none"
            />
          </div>
          <div className="w-full sm:w-auto">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-800 focus:outline-none"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr>
                <th className="table-header">Application ID</th>
                <th className="table-header">Applicant Details</th>
                <th className="table-header">Academic Details</th>
                <th className="table-header">Contact Info</th>
                <th className="table-header text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmissions.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No applications found.</td></tr>
              ) : (
                filteredAdmissions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 text-slate-600 font-medium text-xs">{item.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{item.student}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Applied: {item.admissionDate ? new Date(item.admissionDate).toLocaleDateString() : '—'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">Grade {item.grade}</div>
                      <div className="text-xs text-slate-500 mt-0.5" title={item.previous_school}>Prev: {item.previous_school ? (item.previous_school.length > 20 ? item.previous_school.substring(0, 20) + '...' : item.previous_school) : '—'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-slate-900 text-xs">{item.parent_email || '—'}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.parent_phone || '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold 
                        ${item.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                          item.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 
                          item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdmissionsPage;
