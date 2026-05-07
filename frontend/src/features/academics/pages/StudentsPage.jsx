import { useEffect, useState } from 'react';
import api from '../../../app/api';

function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/students').then((res) => setStudents(res.data.students));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Student Profiles</h2>
        <p className="mt-2 text-sm text-slate-500">View enrolled students and class assignments.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">{item.id}</td>
                <td className="px-4 py-4">{item.name}</td>
                <td className="px-4 py-4">{item.grade}</td>
                <td className="px-4 py-4">{item.section}</td>
                <td className="px-4 py-4">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentsPage;
