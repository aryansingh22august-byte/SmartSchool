import { useEffect, useState } from 'react';
import api from '../../../app/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STATUSES = { present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', 'half-day': 'bg-amber-100 text-amber-700', 'on-leave': 'bg-blue-100 text-blue-700' };

function PayrollPage() {
  const today = new Date();
  const [month, setMonth] = useState(MONTHS[today.getMonth()]);
  const [year, setYear] = useState(today.getFullYear());
  const [slips, setSlips] = useState([]);
  const [staff, setStaff] = useState([]);
  const [salaryInputs, setSalaryInputs] = useState({});
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('slips'); // 'slips' | 'attendance'
  const [attendanceDate, setAttendanceDate] = useState(today.toISOString().split('T')[0]);
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);

  useEffect(() => {
    api.get('/staff').then(res => {
      const staffList = res.data.staff || [];
      setStaff(staffList);
      const inputs = {};
      staffList.forEach(s => { inputs[s.id] = { base_salary: '', present_days: '', deductions: 0, bonuses: 0 }; });
      setSalaryInputs(inputs);
      const att = {};
      staffList.forEach(s => { att[s.id] = 'present'; });
      setAttendanceStatuses(att);
    });
    fetchSlips();
  }, [month, year]);

  const fetchSlips = async () => {
    const res = await api.get(`/payroll?month=${month}&year=${year}`);
    setSlips(res.data.slips || []);
  };

  const handleGeneratePayroll = async () => {
    setGenerating(true); setMessage('');
    const slipData = staff.map(s => ({
      staff_id: s.id,
      base_salary: parseFloat(salaryInputs[s.id]?.base_salary || 0),
      present_days: parseInt(salaryInputs[s.id]?.present_days || 26),
      deductions: parseFloat(salaryInputs[s.id]?.deductions || 0),
      bonuses: parseFloat(salaryInputs[s.id]?.bonuses || 0),
    })).filter(s => s.base_salary > 0);

    try {
      await api.post('/payroll', { month, year, slips: slipData });
      setMessage(`Payroll generated for ${slipData.length} staff members.`);
      fetchSlips();
    } catch { setMessage('Failed to generate payroll.'); }
    finally { setGenerating(false); }
  };

  const markPaid = async (id) => {
    await api.patch(`/payroll/${id}/mark-paid`);
    fetchSlips();
  };

  const saveAttendance = async () => {
    setSavingAttendance(true);
    const records = staff.map(s => ({ staff_id: s.id, status: attendanceStatuses[s.id] || 'present' }));
    await api.post('/payroll/staff-attendance', { date: attendanceDate, records });
    setSavingAttendance(false);
    setMessage('Staff attendance saved!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-violet-50 rounded-md p-6">
        <h2 className="text-2xl font-semibold text-violet-900">Payroll & HR</h2>
        <p className="mt-1 text-sm text-violet-700">Generate salary slips and manage daily staff attendance.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {['slips', 'generate', 'attendance'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-violet-600 text-violet-700' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'slips' ? 'Salary Slips' : t === 'generate' ? 'Generate Payroll' : 'Staff Attendance'}
          </button>
        ))}
      </div>

      {/* Month/Year Selector */}
      {tab !== 'attendance' && (
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Month</label>
            <select value={month} onChange={e => setMonth(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Year</label>
            <input type="number" value={year} onChange={e => setYear(e.target.value)} min="2020" max="2030"
              className="w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" />
          </div>
        </div>
      )}

      {message && <p className="text-sm text-green-700 bg-green-50 rounded-md px-4 py-2">{message}</p>}

      {/* Salary Slips Tab */}
      {tab === 'slips' && (
        <div className="bg-white rounded-md overflow-hidden">
          <div className="px-6 py-4 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Salary Slips — {month} {year}</h3>
          </div>
          {slips.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No slips generated yet. Go to "Generate Payroll" tab.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                <tr>
                  {['Staff', 'Base Salary', 'Present Days', 'Deductions', 'Bonuses', 'Net Salary', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {slips.map(slip => (
                  <tr key={slip.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{slip.staff_name}</td>
                    <td className="px-4 py-3 text-slate-700">₹{Number(slip.base_salary).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">{slip.present_days}/{slip.total_working_days}</td>
                    <td className="px-4 py-3 text-red-600">-₹{slip.deductions}</td>
                    <td className="px-4 py-3 text-green-600">+₹{slip.bonuses}</td>
                    <td className="px-4 py-3 font-bold text-violet-700">₹{Number(slip.net_salary).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${slip.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {slip.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {slip.status !== 'paid' && (
                        <button onClick={() => markPaid(slip.id)}
                          className="text-xs font-semibold text-violet-600 hover:underline">Mark Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Generate Payroll Tab */}
      {tab === 'generate' && (
        <div className="bg-white rounded-md p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Generate Payroll — {month} {year}</h3>
          <table className="min-w-full divide-y divide-slate-100 text-sm mb-4">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Staff Member</th>
                <th className="px-4 py-3 text-left">Base Salary (₹)</th>
                <th className="px-4 py-3 text-left">Present Days</th>
                <th className="px-4 py-3 text-left">Deductions (₹)</th>
                <th className="px-4 py-3 text-left">Bonuses (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staff.map(s => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}<br /><span className="text-xs text-slate-400">{s.role}</span></td>
                  {['base_salary', 'present_days', 'deductions', 'bonuses'].map(field => (
                    <td key={field} className="px-4 py-3">
                      <input type="number" min="0" placeholder={field === 'present_days' ? '26' : '0'}
                        value={salaryInputs[s.id]?.[field] ?? ''}
                        onChange={e => setSalaryInputs(prev => ({ ...prev, [s.id]: { ...prev[s.id], [field]: e.target.value } }))}
                        className="w-28 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleGeneratePayroll} disabled={generating}
            className="rounded-md bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
            {generating ? 'Generating…' : `Generate Payroll for ${month} ${year}`}
          </button>
        </div>
      )}

      {/* Staff Attendance Tab */}
      {tab === 'attendance' && (
        <div className="bg-white rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Daily Staff Attendance</h3>
            <div className="flex items-center gap-3">
              <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
              <button onClick={saveAttendance} disabled={savingAttendance}
                className="rounded-md bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
                {savingAttendance ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Staff Member</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staff.map(s => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-500">{s.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {['present', 'absent', 'half-day', 'on-leave'].map(st => (
                        <button key={st} onClick={() => setAttendanceStatuses(prev => ({ ...prev, [s.id]: st }))}
                          className={`rounded-md px-3 py-1 text-xs font-semibold capitalize ${attendanceStatuses[s.id] === st ? STATUSES[st] : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PayrollPage;
