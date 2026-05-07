import { useEffect, useState } from 'react';
import api from '../../../app/api';

function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [legacyRecords, setLegacyRecords] = useState([]);

  useEffect(() => {
    api.get('/classes').then(res => setClasses(res.data.classes || []));
    api.get('/attendance').then(res => setLegacyRecords(res.data.attendance || []));
  }, []);

  const loadClassStudents = async (cls) => {
    setSelectedClass(cls);
    setMessage('');
    const res = await api.get(`/classes/${cls.id}/students`);
    const studs = res.data.students || [];
    setStudents(studs);
    // Load existing attendance for the selected date
    const attRes = await api.get(`/student-attendance?date=${date}&classId=${cls.id}`);
    const existing = {};
    (attRes.data.records || []).forEach(r => { existing[r.student_id] = r.status; });
    // Default all to 'present'
    studs.forEach(s => { if (!existing[s.id]) existing[s.id] = 'present'; });
    setAttendance(existing);
  };

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    if (!selectedClass) return;
    const attRes = await api.get(`/student-attendance?date=${newDate}&classId=${selectedClass.id}`);
    const existing = {};
    (attRes.data.records || []).forEach(r => { existing[r.student_id] = r.status; });
    students.forEach(s => { if (!existing[s.id]) existing[s.id] = 'present'; });
    setAttendance(existing);
  };

  const toggleStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedClass) return;
    setSaving(true);
    setMessage('');
    try {
      const records = students.map(s => ({ student_id: s.id, status: attendance[s.id] || 'present' }));
      await api.post('/student-attendance', { date, classId: selectedClass.id, records });
      setMessage('Attendance saved successfully!');
    } catch {
      setMessage('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const statusColors = { present: 'bg-green-100 text-green-800', absent: 'bg-red-100 text-red-800', late: 'bg-amber-100 text-amber-800' };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-6">
        <h2 className="text-2xl font-semibold text-blue-900">Attendance</h2>
        <p className="mt-1 text-sm text-blue-700">Select a class and mark per-student attendance.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input type="date" value={date} onChange={e => handleDateChange(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm" />
        </div>
      </div>

      {classes.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map(cls => (
            <button key={cls.id} onClick={() => loadClassStudents(cls)}
              className={`rounded-md p-4 text-left ${selectedClass?.id === cls.id ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'}`}>
              <p className="font-semibold">{cls.name}</p>
              <p className="text-sm opacity-75">Grade {cls.grade} – Section {cls.section}</p>
              {cls.teacher_name && <p className="text-xs opacity-60 mt-1">Teacher: {cls.teacher_name}</p>}
            </button>
          ))}
        </div>
      )}

      {selectedClass && students.length > 0 && (
        <div className="bg-white rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50">
            <h3 className="font-semibold text-slate-800">{selectedClass.name} — {date}</h3>
            <button onClick={handleSave} disabled={saving}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Attendance'}
            </button>
          </div>
          {message && <p className={`px-6 py-2 text-sm ${message.includes('success') ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>{message}</p>}
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="text-slate-600">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Grade / Section</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-6 py-3 text-slate-600">{s.grade} – {s.section}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {['present', 'absent', 'late'].map(st => (
                        <button key={st} onClick={() => toggleStatus(s.id, st)}
                          className={`rounded-md px-3 py-1 text-xs font-semibold capitalize ${attendance[s.id] === st ? statusColors[st] : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
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

      {legacyRecords.length > 0 && !selectedClass && (
        <div className="bg-white rounded-md p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Daily Summary Records</h3>
          <ul className="space-y-3">
            {legacyRecords.map(item => (
              <li key={item.date} className="flex items-center justify-between rounded-md bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-800">{item.date}</p>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">{item.percentage}</span>
                <p className="text-sm text-slate-500">Present: {item.present} / Absent: {item.absent}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;
