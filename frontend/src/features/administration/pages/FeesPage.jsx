import { useEffect, useState } from 'react';
import api from '../../../app/api';

function FeesPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentTotal, setStudentTotal] = useState(null);
  const [studentServices, setStudentServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', monthly_cost: '' });
  const [savingService, setSavingService] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/fees').then(res => setFees(res.data.fees || []));
    api.get('/students').then(res => setStudents(res.data.students || []));
    api.get('/fee-services').then(res => setServices(res.data.services || []));
  }, []);

  const loadStudentFees = async (student) => {
    setSelectedStudent(student);
    setMessage('');
    try {
      const [totalRes, svcRes] = await Promise.all([
        api.get(`/fee-services/student/${student.id}/total`),
        api.get(`/fee-services/student/${student.id}`)
      ]);
      setStudentTotal(totalRes.data);
      setStudentServices(svcRes.data.services || []);
    } catch {
      setStudentTotal(null);
    }
  };

  const assignService = async (serviceId) => {
    await api.post(`/fee-services/student/${selectedStudent.id}/assign`, { service_id: serviceId });
    loadStudentFees(selectedStudent);
  };

  const removeService = async (serviceId) => {
    await api.delete(`/fee-services/student/${selectedStudent.id}/remove`, { data: { service_id: serviceId } });
    loadStudentFees(selectedStudent);
  };

  const handleCreateService = async () => {
    if (!newService.name || !newService.monthly_cost) { setMessage('Name and cost are required.'); return; }
    setSavingService(true);
    try {
      const res = await api.post('/fee-services', { ...newService, monthly_cost: parseFloat(newService.monthly_cost) });
      setServices(prev => [...prev, res.data.service]);
      setNewService({ name: '', description: '', monthly_cost: '' });
      setShowAddService(false);
      setMessage('Service created!');
    } catch { setMessage('Failed to create service.'); }
    finally { setSavingService(false); }
  };

  const pendingColor = (pending) => pending > 0 ? 'text-red-600' : 'text-green-600';

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 rounded-md p-6">
        <h2 className="text-2xl font-semibold text-amber-900">Fees Management</h2>
        <p className="mt-1 text-sm text-amber-700">Manage base fees, optional services, and student payment totals.</p>
      </div>

      {/* Services Panel */}
      <div className="bg-white rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Optional Fee Services</h3>
          <button onClick={() => setShowAddService(!showAddService)}
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            {showAddService ? 'Cancel' : '+ Add Service'}
          </button>
        </div>
        {message && <p className="mb-3 text-sm text-green-700">{message}</p>}
        {showAddService && (
          <div className="rounded-md bg-amber-50 p-4 mb-4 space-y-3">
            <input placeholder="Service Name (e.g. School Transport)" value={newService.name}
              onChange={e => setNewService(p => ({ ...p, name: e.target.value }))}
              className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm" />
            <input placeholder="Description (optional)" value={newService.description}
              onChange={e => setNewService(p => ({ ...p, description: e.target.value }))}
              className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm" />
            <input type="number" placeholder="Monthly Cost (₹)" value={newService.monthly_cost}
              onChange={e => setNewService(p => ({ ...p, monthly_cost: e.target.value }))}
              className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm" />
            <button onClick={handleCreateService} disabled={savingService}
              className="rounded-md bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50">
              {savingService ? 'Creating…' : 'Create Service'}
            </button>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(s => (
            <div key={s.id} className="rounded-md bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">{s.name}</p>
              {s.description && <p className="text-xs text-amber-700 mt-0.5">{s.description}</p>}
              <p className="mt-2 text-lg font-bold text-amber-800">₹{s.monthly_cost}<span className="text-xs font-normal">/mo</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Fee Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-md p-4 lg:col-span-1">
          <h3 className="font-semibold text-slate-800 mb-3">Students</h3>
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {students.map(s => (
              <li key={s.id}>
                <button onClick={() => loadStudentFees(s)}
                  className={`w-full text-left rounded-md px-4 py-3 text-sm ${selectedStudent?.id === s.id ? 'bg-amber-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'}`}>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs opacity-75">Grade {s.grade}-{s.section}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedStudent && (
          <div className="bg-white rounded-md p-6 lg:col-span-2 space-y-6">
            <h3 className="font-semibold text-slate-800">Fee Details — {selectedStudent.name}</h3>
            {studentTotal && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Base Fee', value: `₹${studentTotal.base_fee}`, bg: 'bg-slate-100', text: 'text-slate-800' },
                  { label: 'Services', value: `₹${studentTotal.services_total}`, bg: 'bg-amber-50', text: 'text-amber-800' },
                  { label: 'Total Due', value: `₹${studentTotal.grand_total}`, bg: 'bg-blue-50', text: 'text-blue-800' },
                  { label: 'Pending', value: `₹${studentTotal.pending}`, bg: studentTotal.pending > 0 ? 'bg-red-50' : 'bg-green-50', text: studentTotal.pending > 0 ? 'text-red-700' : 'text-green-700' }
                ].map(item => (
                  <div key={item.label} className={`rounded-md ${item.bg} p-4`}>
                    <p className={`text-sm font-medium ${item.text} opacity-70`}>{item.label}</p>
                    <p className={`mt-1 text-xl font-bold ${item.text}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Assigned Services</h4>
              {studentServices.length === 0 ? (
                <p className="text-sm text-slate-500">No services assigned.</p>
              ) : (
                <ul className="space-y-2">
                  {studentServices.map(s => (
                    <li key={s.id} className="flex items-center justify-between rounded-md bg-amber-50 px-4 py-2">
                      <span className="text-sm font-medium text-amber-900">{s.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-amber-700">₹{s.monthly_cost}/mo</span>
                        <button onClick={() => removeService(s.id)} className="text-xs text-red-600 hover:underline">Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Add a Service</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {services.filter(s => !studentServices.find(ss => ss.id === s.id)).map(s => (
                  <button key={s.id} onClick={() => assignService(s.id)}
                    className="text-left rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">₹{s.monthly_cost}/mo</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legacy Fees Table */}
      <div className="bg-white rounded-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50">
          <h3 className="font-semibold text-slate-800">All Fee Records</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Paid</th>
              <th className="px-4 py-3 text-left">Pending</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {fees.map(item => {
              const pending = item.amount - item.paid;
              return (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.student}</td>
                  <td className="px-4 py-3 text-slate-700">₹{item.amount}</td>
                  <td className="px-4 py-3 text-green-700">₹{item.paid}</td>
                  <td className={`px-4 py-3 font-semibold ${pendingColor(pending)}`}>₹{pending}</td>
                  <td className="px-4 py-3 text-slate-500">{item.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pending <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {pending <= 0 ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeesPage;
