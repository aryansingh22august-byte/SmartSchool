import { useState } from 'react';

function AttendancePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Interactive Attendance State (P, A, L)
  const [attendanceMap, setAttendanceMap] = useState({
    'STU-2024-001': 'P',
    'STU-2024-005': 'L',
    'STU-2024-012': 'A',
  });

  const students = [
    { id: 'STU-2024-001', name: 'Arjun Mehta', avatar: 'https://i.pravatar.cc/150?img=11', punch: '08:45 AM' },
    { id: 'STU-2024-005', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?img=5', punch: '09:12 AM' },
    { id: 'STU-2024-012', name: "Liam O'Conner", avatar: 'https://i.pravatar.cc/150?img=12', punch: '---' },
  ];

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveLog = () => {
    setIsSaving(true);
    setSaveMessage('');
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Log saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* --- TOP ROW: KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Today's Attendance */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-[#00C2A0] uppercase mb-2">Today's Attendance</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">94.2%</h2>
            <span className="text-[#00C2A0] text-[10px] font-bold mb-1">↗ +1.2%</span>
          </div>
        </div>

        {/* Staff On-Duty */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Staff On-Duty</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">48/52</h2>
            <span className="text-slate-400 text-[9px] font-bold tracking-widest uppercase mb-1">Active Shifts</span>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-amber-500 uppercase mb-2">Leave Requests</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-amber-500 tracking-tight">08</h2>
            <span className="text-amber-500 text-[9px] font-bold tracking-widest uppercase mb-1">Pending</span>
          </div>
        </div>

        {/* Defaulters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase mb-2">Defaulters</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">12</h2>
            <span className="text-[#FF2D55] text-[9px] font-bold tracking-widest uppercase mb-1">Action Required</span>
          </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: CLASS ATTENDANCE LIST --- */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Class Attendance: 10-A (Mathematics)</h3>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">Instructor: Dr. Elias Vance | Period 3</p>
          </div>
          <div className="flex items-center gap-3">
            {saveMessage && <span className="text-[10px] font-bold text-[#FF2D55] tracking-widest uppercase animate-pulse">{saveMessage}</span>}
            <button className="border border-[#00C2A0] text-[#00C2A0] text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1">
              ◎ Biometric Synced
            </button>
            <button 
              onClick={handleSaveLog}
              disabled={isSaving}
              className="bg-[#FF2D55] text-white text-[9px] font-bold tracking-widest uppercase px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200 disabled:opacity-50"
            >
              {isSaving ? 'Processing...' : 'Save Log'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest w-32">Student ID</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Student Name</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center w-40">Status</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center w-32">Punch In</th>
                <th className="pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => {
                const status = attendanceMap[student.id];
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-[#00C2A0] text-xs tracking-wide">#{student.id}</td>
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                         <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-slate-800 text-xs">{student.name}</span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                        <button 
                          onClick={() => handleStatusChange(student.id, 'P')}
                          className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${status === 'P' ? 'bg-[#00C2A0] text-white shadow-sm' : 'text-slate-400 hover:bg-slate-200'}`}
                        >
                          P
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'A')}
                          className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${status === 'A' ? 'bg-[#FF2D55] text-white shadow-sm' : 'text-slate-400 hover:bg-slate-200'}`}
                        >
                          A
                        </button>
                        <button 
                          onClick={() => handleStatusChange(student.id, 'L')}
                          className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${status === 'L' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-200'}`}
                        >
                          L
                        </button>
                      </div>
                    </td>
                    <td className="py-3 text-center text-xs text-slate-500 font-medium">{student.punch}</td>
                    <td className="py-3 text-right text-slate-400 cursor-pointer hover:text-slate-800 font-bold text-lg">⋮</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- BOTTOM SECTION: TRENDS CHART --- */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-bold text-slate-800">Monthly Attendance Trends</h3>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00C2A0]"></span> Students
            </span>
            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF2D55]"></span> Staff
            </span>
          </div>
        </div>

        {/* Mock Chart CSS Grid */}
        <div className="h-40 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
          {/* Week 1 */}
          <div className="flex-1 flex gap-1 items-end justify-center h-full">
            <div className="w-full max-w-[24px] bg-[#00C2A0]/20 rounded-t-sm h-[70%] border-t-2 border-[#00C2A0]"></div>
            <div className="w-full max-w-[24px] bg-[#00C2A0]/20 rounded-t-sm h-[75%] border-t-2 border-[#00C2A0]"></div>
          </div>
          {/* Week 2 */}
          <div className="flex-1 flex gap-1 items-end justify-center h-full">
            <div className="w-full max-w-[24px] bg-teal-50 rounded-t-sm h-[85%] border-t-2 border-[#00C2A0]"></div>
            <div className="w-full max-w-[24px] bg-pink-50 rounded-t-sm h-[95%] border-t-2 border-[#FF2D55]"></div>
            <div className="w-full max-w-[24px] bg-teal-50 rounded-t-sm h-[80%] border-t-2 border-[#00C2A0]"></div>
          </div>
          {/* Week 3 */}
          <div className="flex-1 flex gap-1 items-end justify-center h-full">
            <div className="w-full max-w-[24px] bg-teal-50 rounded-t-sm h-[82%] border-t-2 border-[#00C2A0]"></div>
            <div className="w-full max-w-[24px] bg-pink-50 rounded-t-sm h-[88%] border-t-2 border-[#FF2D55]"></div>
            <div className="w-full max-w-[24px] bg-[#00C2A0]/20 rounded-t-sm h-[60%] border-t-2 border-[#00C2A0]"></div>
          </div>
          {/* Week 4 */}
          <div className="flex-1 flex gap-1 items-end justify-center h-full">
            <div className="w-full max-w-[24px] bg-teal-50 rounded-t-sm h-[70%] border-t-2 border-[#00C2A0]"></div>
            <div className="w-full max-w-[24px] bg-[#00C2A0]/20 rounded-t-sm h-[78%] border-t-2 border-[#00C2A0]"></div>
            <div className="w-full max-w-[24px] bg-[#00C2A0]/20 rounded-t-sm h-[72%] border-t-2 border-[#00C2A0]"></div>
          </div>
        </div>
        
        {/* X-Axis Labels */}
        <div className="flex justify-between mt-3 text-[8px] font-bold text-slate-400 tracking-widest uppercase px-6">
          <span>WK 01</span>
          <span>WK 02</span>
          <span>WK 03</span>
          <span>WK 04</span>
        </div>
      </div>

    </div>
  );
}

export default AttendancePage;
