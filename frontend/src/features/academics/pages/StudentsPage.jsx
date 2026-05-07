import { useEffect, useState, useMemo } from 'react';
import api from '../../../app/api';

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ 
    name: '', grade: '', section: '', status: 'Active',
    roll_number: '', date_of_birth: '', gender: '', guardian_name: '', contact_number: '', address: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      setNewStudent({ 
        name: '', grade: '', section: '', status: 'Active',
        roll_number: '', date_of_birth: '', gender: '', guardian_name: '', contact_number: '', address: ''
      });
      setIsFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student.');
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (s.roll_number || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter ? s.grade === gradeFilter : true;
      return matchesSearch && matchesGrade;
    });
  }, [students, searchQuery, gradeFilter]);

  const uniqueGrades = useMemo(() => [...new Set(students.map(s => s.grade))], [students]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Student Directory</h2>
          <p className="mt-2 text-sm text-slate-500">Manage comprehensive student profiles and academic records.</p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="floating-action-button px-6 py-3 text-sm font-semibold">
          {isFormOpen ? 'Close Form' : '+ Add Student'}
        </button>
      </div>

      {isFormOpen && (
        <div className="rounded-3xl bg-white p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">New Student Registration</h3>
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <input name="name" value={newStudent.name} onChange={handleChange} className="minimal-input mt-1" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Roll Number</label>
              <input name="roll_number" value={newStudent.roll_number} onChange={handleChange} className="minimal-input mt-1" />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date of Birth</label>
              <input type="date" name="date_of_birth" value={newStudent.date_of_birth} onChange={handleChange} className="minimal-input mt-1" />
            </div>
            
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Grade</label>
              <input name="grade" value={newStudent.grade} onChange={handleChange} className="minimal-input mt-1" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Section</label>
              <input name="section" value={newStudent.section} onChange={handleChange} className="minimal-input mt-1" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Gender</label>
              <select name="gender" value={newStudent.gender} onChange={handleChange} className="minimal-input mt-1">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Guardian Name</label>
              <input name="guardian_name" value={newStudent.guardian_name} onChange={handleChange} className="minimal-input mt-1" />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Number</label>
              <input name="contact_number" value={newStudent.contact_number} onChange={handleChange} className="minimal-input mt-1" />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Address</label>
              <input name="address" value={newStudent.address} onChange={handleChange} className="minimal-input mt-1" />
            </div>
            
            <div className="md:col-span-3 flex justify-end">
              <button type="submit" className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">Register Student</button>
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
              placeholder="Search by name or roll number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-800 focus:outline-none"
            />
          </div>
          <div className="w-full sm:w-auto">
            <select 
              value={gradeFilter} 
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full sm:w-48 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-800 focus:outline-none"
            >
              <option value="">All Grades</option>
              {uniqueGrades.map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr>
                <th className="table-header">Roll No.</th>
                <th className="table-header">Student Profile</th>
                <th className="table-header">Class</th>
                <th className="table-header">Guardian Info</th>
                <th className="table-header text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No students found.</td></tr>
              ) : (
                filteredStudents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 text-slate-600 font-medium">{item.roll_number || '—'}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.gender} • DOB: {item.date_of_birth ? new Date(item.date_of_birth).toLocaleDateString() : '—'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">Grade {item.grade}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Section {item.section}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-slate-900">{item.guardian_name || '—'}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.contact_number}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
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

export default StudentsPage;
