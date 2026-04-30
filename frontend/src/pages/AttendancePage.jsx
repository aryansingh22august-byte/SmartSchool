import { useEffect, useState } from 'react';
import api from '../api';

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    api.get('/attendance').then((res) => setAttendance(res.data.attendance));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Attendance</h2>
        <p className="mt-2 text-sm text-slate-500">Monitor daily attendance and absence trends.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ul className="space-y-4">
          {attendance.map((item) => (
            <li key={item.date} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{item.date}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.percentage}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Present: {item.present}, Absent: {item.absent}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AttendancePage;
