import { useEffect, useState } from 'react';
import api from '../../../app/api';

function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [viewMarks, setViewMarks] = useState([]);

  useEffect(() => {
    api.get('/exams').then(res => setExams(res.data.exams || []));
    api.get('/students').then(res => setStudents(res.data.students || []));
  }, []);

  const loadExamMarks = async (exam) => {
    setSelectedExam(exam);
    setMessage('');
    setViewMarks([]);
    const res = await api.get(`/marks?examId=${exam.id}`);
    setViewMarks(res.data.marks || []);
    // Init marks input
    const init = {};
    students.forEach(s => { init[s.id] = ''; });
    setMarks(init);
  };

  const handleBulkSave = async () => {
    if (!selectedExam || !subject) { setMessage('Please select an exam and enter a subject.'); return; }
    setSaving(true);
    setMessage('');
    try {
      const records = students
        .filter(s => marks[s.id] !== '' && marks[s.id] !== undefined)
        .map(s => ({ student_id: s.id, marks_obtained: parseFloat(marks[s.id]) }));
      if (!records.length) { setMessage("Enter at least one student's marks."); setSaving(false); return; }
      await api.post('/marks/bulk', { exam_id: selectedExam.id, subject, total_marks: totalMarks, records });
      setMessage(`Marks saved for ${records.length} students.`);
      const res = await api.get(`/marks?examId=${selectedExam.id}`);
      setViewMarks(res.data.marks || []);
    } catch {
      setMessage('Failed to save marks.');
    } finally {
      setSaving(false);
    }
  };

  const gradeColor = (g) => ({ 'A+': 'text-green-700 bg-green-100', A: 'text-green-700 bg-green-50', B: 'text-blue-700 bg-blue-100', C: 'text-amber-700 bg-amber-100', D: 'text-orange-700 bg-orange-100', F: 'text-red-700 bg-red-100' }[g] || 'bg-slate-100 text-slate-600');

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 rounded-md p-6">
        <h2 className="text-2xl font-semibold text-indigo-900">Exams & Marks</h2>
        <p className="mt-1 text-sm text-indigo-700">Select an exam to view or submit student marks.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map(exam => (
          <button key={exam.id} onClick={() => loadExamMarks(exam)}
            className={`rounded-md p-4 text-left ${selectedExam?.id === exam.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'}`}>
            <p className="font-semibold">{exam.name}</p>
            <p className="text-sm opacity-75">Grade {exam.grade} — {exam.date}</p>
            <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${exam.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>{exam.status}</span>
          </button>
        ))}
      </div>

      {selectedExam && (
        <div className="space-y-6">
          <div className="bg-white rounded-md p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Submit Marks — {selectedExam.name}</h3>
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mathematics"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                <input type="number" value={totalMarks} onChange={e => setTotalMarks(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm" />
              </div>
            </div>
            <table className="min-w-full divide-y divide-slate-100 text-sm mb-4">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Grade</th>
                  <th className="px-4 py-3 text-left">Marks Obtained</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map(s => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-500">{s.grade}-{s.section}</td>
                    <td className="px-4 py-3">
                      <input type="number" min="0" max={totalMarks} placeholder={`/ ${totalMarks}`}
                        value={marks[s.id] ?? ''}
                        onChange={e => setMarks(prev => ({ ...prev, [s.id]: e.target.value }))}
                        className="w-24 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {message && <p className={`mb-3 text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-700'}`}>{message}</p>}
            <button onClick={handleBulkSave} disabled={saving}
              className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save All Marks'}
            </button>
          </div>

          {viewMarks.length > 0 && (
            <div className="bg-white rounded-md overflow-hidden">
              <div className="px-6 py-4 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Submitted Marks — {selectedExam.name}</h3>
              </div>
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Score</th>
                    <th className="px-4 py-3 text-left">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {viewMarks.map(m => (
                    <tr key={m.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{m.student_name}</td>
                      <td className="px-4 py-3 text-slate-600">{m.subject}</td>
                      <td className="px-4 py-3 text-slate-600">{m.marks_obtained}/{m.total_marks}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${gradeColor(m.grade_letter)}`}>{m.grade_letter}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExamsPage;
