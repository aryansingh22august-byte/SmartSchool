import { useState } from 'react';

function ExamsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [marks, setMarks] = useState({
    101: { theory: '85', practical: '15' },
    102: { theory: '92', practical: '18' },
    103: { theory: '78', practical: '14' },
    104: { theory: '', practical: '' }
  });

  const [grades, setGrades] = useState([
    { id: 1, letter: 'A+', range: '90% - 100%', color: 'text-[#00C2A0]' },
    { id: 2, letter: 'A', range: '80% - 89%', color: 'text-[#00C2A0]' },
    { id: 3, letter: 'B', range: '70% - 79%', color: 'text-amber-500' },
    { id: 4, letter: 'F', range: '0% - 34%', color: 'text-[#FF2D55]' }
  ]);

  const handleSaveAll = () => {
    setIsSaving(true);
    setSaveMessage('');
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Marks saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleAddGrade = () => {
    const newGrade = {
      id: Date.now(),
      letter: 'C',
      range: '50% - 69%',
      color: 'text-amber-500'
    };
    setGrades(prev => [...prev, newGrade]);
  };

  const handleMarkChange = (id, type, val) => {
    setMarks(prev => ({
      ...prev,
      [id]: { ...prev[id], [type]: val }
    }));
  };

  return (
    <div className="space-y-6 pb-24">
      {/* --- TOP ROW: HEADER & KPIS --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tight text-slate-800 flex items-center">
            EXAMINATION<span className="text-[#FF2D55] ml-1">PORTAL</span>
          </h1>
          <p className="text-[10px] tracking-widest text-slate-400 font-bold uppercase mt-1">Manage comprehensive assessment lifecycle</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-6 min-w-[200px]">
            <div>
              <p className="text-[9px] font-bold tracking-widest text-[#00C2A0] uppercase">Active Exams</p>
              <h2 className="text-3xl font-black text-slate-800">12</h2>
            </div>
            <div className="ml-auto w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#00C2A0]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-6 min-w-[200px]">
            <div>
              <p className="text-[9px] font-bold tracking-widest text-[#FF2D55] uppercase">Pending Results</p>
              <h2 className="text-3xl font-black text-slate-800">08</h2>
            </div>
            <div className="ml-auto w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2D55]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COL: Management (span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Exam Master Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold tracking-[0.1em] text-[#FF2D55] flex items-center gap-2 uppercase">
                <span className="text-lg">📅</span> Exam Master
              </h3>
              <button className="bg-[#FF2D55] text-white text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200">
                + Create New Exam
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Exam Name</th>
                    <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Type</th>
                    <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Schedule</th>
                    <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Weightage</th>
                    <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-800 text-xs">Unit Test 1 (Mathematics)</td>
                    <td className="py-4 text-center"><span className="text-[9px] font-bold text-[#00C2A0] bg-teal-50 px-2 py-0.5 rounded-full tracking-widest">INTERNAL</span></td>
                    <td className="py-4 text-center text-xs text-slate-500 font-medium">Oct 12, 2023</td>
                    <td className="py-4 text-center font-bold text-slate-800 text-xs">15%</td>
                    <td className="py-4 text-center"><span className="text-[10px] font-bold text-[#00C2A0] flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00C2A0]"></span>Completed</span></td>
                    <td className="py-4 text-right text-slate-400 cursor-pointer hover:text-slate-800">⋮</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-800 text-xs">Mid-Term Examination</td>
                    <td className="py-4 text-center"><span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full tracking-widest">SEMESTER</span></td>
                    <td className="py-4 text-center text-xs text-slate-500 font-medium">Nov 20, 2023</td>
                    <td className="py-4 text-center font-bold text-slate-800 text-xs">35%</td>
                    <td className="py-4 text-center"><span className="text-[10px] font-bold text-amber-500 flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>In-Progress</span></td>
                    <td className="py-4 text-right text-slate-400 cursor-pointer hover:text-slate-800">⋮</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-800 text-xs">Annual Finals (2024)</td>
                    <td className="py-4 text-center"><span className="text-[9px] font-bold text-[#FF2D55] bg-pink-50 px-2 py-0.5 rounded-full tracking-widest">FINAL</span></td>
                    <td className="py-4 text-center text-xs text-slate-500 font-medium">Mar 15, 2024</td>
                    <td className="py-4 text-center font-bold text-slate-800 text-xs">50%</td>
                    <td className="py-4 text-center"><span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">Draft</span></td>
                    <td className="py-4 text-right text-slate-400 cursor-pointer hover:text-slate-800">⋮</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bulk Marks Entry Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold tracking-[0.1em] text-slate-800 flex items-center gap-2 uppercase">
                <span className="text-[#00C2A0] text-lg">▦</span> Bulk Marks Entry
              </h3>
              <div className="flex gap-2 items-center">
                {saveMessage && <span className="text-[10px] font-bold text-[#00C2A0] tracking-widest uppercase mr-2 animate-pulse">{saveMessage}</span>}
                <button className="border border-slate-200 text-slate-600 text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
                  📄 Excel Upload
                </button>
                <button 
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="bg-[#00C2A0] text-white text-[9px] font-bold tracking-widest uppercase px-6 py-2 rounded-lg hover:bg-teal-500 transition-colors shadow-lg shadow-teal-200 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save All'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Class</label>
                <select className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-3 py-2 border-0 text-slate-700 text-xs font-semibold">
                  <option>Grade 10 - Section A</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Subject</label>
                <select className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-3 py-2 border-0 text-slate-700 text-xs font-semibold">
                  <option>Physics (PHY101)</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Max Marks</label>
                <input type="text" value="100" readOnly className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-3 py-2 border-0 text-slate-700 text-xs font-semibold" />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Pass %</label>
                <input type="text" value="35%" readOnly className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-3 py-2 border-0 text-slate-700 text-xs font-semibold text-center" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Roll No</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Theory</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Practical</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: 101, name: 'Alex Chen' },
                    { id: 102, name: 'Sarah Jenkins' },
                    { id: 103, name: 'Michael Ross' },
                    { id: 104, name: 'Elena Rodriguez' }
                  ].map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 text-[10px] font-bold text-slate-500">{student.id}</td>
                      <td className="py-2 font-bold text-slate-800 text-xs">{student.name}</td>
                      <td className="py-2 text-center w-24">
                        <input 
                          type="text" 
                          value={marks[student.id]?.theory || ''} 
                          onChange={(e) => handleMarkChange(student.id, 'theory', e.target.value)}
                          className="w-16 bg-white border border-slate-200 rounded-md px-2 py-1 text-center text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00C2A0] focus:ring-1 focus:ring-[#00C2A0]" 
                        />
                      </td>
                      <td className="py-2 text-center w-24">
                        <input 
                          type="text" 
                          value={marks[student.id]?.practical || ''} 
                          onChange={(e) => handleMarkChange(student.id, 'practical', e.target.value)}
                          className="w-16 bg-white border border-slate-200 rounded-md px-2 py-1 text-center text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00C2A0] focus:ring-1 focus:ring-[#00C2A0]" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* RIGHT COL: Analytics (span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Performance Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold tracking-[0.1em] text-slate-800 flex items-center gap-2 uppercase mb-6">
              <span className="text-amber-500 text-lg">📊</span> Performance
            </h3>
            
            {/* Mock Chart */}
            <div className="h-32 flex items-end justify-between gap-2 px-2 mb-4 border-b border-slate-100 pb-2">
              <div className="w-full bg-pink-200 rounded-t-md h-[40%]"></div>
              <div className="w-full bg-[#00C2A0]/30 rounded-t-md h-[80%]"></div>
              <div className="w-full bg-blue-200 rounded-t-md h-[60%]"></div>
              <div className="w-full bg-amber-200 rounded-t-md h-[70%]"></div>
              <div className="w-full bg-teal-100 rounded-t-md h-[90%]"></div>
            </div>
            <p className="text-[8px] font-bold tracking-widest text-slate-400 uppercase text-center mb-6">Subject Wise Class Average</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[8px] font-bold tracking-widest text-slate-400 uppercase mb-1">High Score</p>
                <p className="text-lg font-black text-[#00C2A0]">98/100</p>
              </div>
              <div className="bg-pink-50/50 rounded-xl p-3 border border-pink-100/50">
                <p className="text-[8px] font-bold tracking-widest text-slate-400 uppercase mb-1">Pass Rate</p>
                <p className="text-lg font-black text-[#FF2D55]">92.4%</p>
              </div>
            </div>
          </div>

          {/* Grade System Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold tracking-[0.1em] text-slate-800 flex items-center gap-2 uppercase mb-4">
              <span className="text-[#00C2A0] text-lg">⚙</span> Grade System
            </h3>

            <div className="space-y-2 mb-4">
              {grades.map(grade => (
                <div key={grade.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className={`text-sm font-black ${grade.color} w-8`}>{grade.letter}</span>
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest">{grade.range}</span>
                  <span className="text-slate-300 text-xs cursor-pointer hover:text-slate-600">✎</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddGrade}
              className="w-full border-2 border-dashed border-slate-200 text-slate-400 text-[9px] font-bold tracking-widest uppercase py-3 rounded-xl hover:border-[#00C2A0] hover:text-[#00C2A0] transition-colors"
            >
              + Add Grade Rule
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ExamsPage;
