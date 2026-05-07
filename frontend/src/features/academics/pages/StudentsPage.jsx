import { useEffect, useState } from 'react';
import api from '../../../app/api';

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', grade: '', section: '', status: 'Active' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/students').then((res) => setStudents(res.data.students));
  }, []);

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/students', newStudent);
      setStudents([res.data.student, ...students]);
      setSuccess('Student added successfully.');
      setNewStudent({ name: '', grade: '', section: '', status: 'Active' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Student Profiles</h2>
        <p className="mt-2 text-sm text-slate-500">View and manage enrolled students and class assignments.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Student</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <input name="name" value={newStudent.name} onChange={handleChange} placeholder="Full Name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none text-sm" required />
          </div>
          <div className="md:col-span-1">
            <input name="grade" value={newStudent.grade} onChange={handleChange} placeholder="Grade (e.g., 10th)" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none text-sm" required />
          </div>
          <div className="md:col-span-1">
            <input name="section" value={newStudent.section} onChange={handleChange} placeholder="Section (e.g., A)" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none text-sm" required />
          </div>
          <div className="md:col-span-1">
            <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">Add Student</button>
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
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentsPage;
