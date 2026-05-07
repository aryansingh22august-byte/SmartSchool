import { useEffect, useState } from 'react';
import api from '../../../app/api';

function TimetablePage() {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    api.get('/timetable').then((res) => setTimetable(res.data.timetable));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Timetable</h2>
        <p className="mt-2 text-sm text-slate-500">View the school timetable and class schedule.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ul className="space-y-4">
          {timetable.map((item) => (
            <li key={`${item.day}-${item.subject}`} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.subject}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.day}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Teacher: {item.teacher}</p>
              <p className="mt-1 text-sm text-slate-600">Time: {item.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TimetablePage;
