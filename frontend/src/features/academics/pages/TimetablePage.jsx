import { useEffect, useState } from 'react';
import api from '../../../app/api';

function TimetablePage() {
  const [timetable, setTimetable] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    api.get('/timetable').then((res) => setTimetable(res.data.timetable));
  }, []);

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const times = ['09:00 - 10:00', '10:00 - 11:00', '11:30 - 12:30'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Timetable Planner</h2>
          <p className="text-sm font-semibold text-slate-500 tracking-[0.2em] uppercase mt-1">Academic / Timetable Planner</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`px-4 py-2 text-xs font-bold tracking-widest rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#FF2D55] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>GRID VIEW</button>
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-xs font-bold tracking-widest rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#FF2D55] text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>LIST VIEW</button>
          <button className="px-4 py-2 text-xs font-bold tracking-widest text-[#FF2D55] bg-white border border-pink-100 rounded-lg hover:bg-pink-50 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            EXPORT PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-[#00C2A0] font-bold text-xs tracking-[0.15em] mb-4">CONFIGURATION</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Select Grade</label>
                <select className="w-full mt-1 border-b-2 border-slate-200 py-2 text-sm text-slate-700 font-semibold focus:outline-none focus:border-[#00C2A0] bg-transparent">
                  <option>GRADE 10 - SCIENCE</option>
                  <option>GRADE 10 - COMMERCE</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Class Teacher</label>
                <div className="flex items-center gap-3 mt-2 border border-slate-100 rounded-xl p-2 bg-slate-50">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=47" alt="Teacher" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">DR. ELARA VANCE</p>
                    <p className="text-[10px] text-[#FF2D55] font-semibold">Senior Faculty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800 font-bold text-xs tracking-[0.15em]">UNALLOCATED ASSETS</h3>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">DRAG & DROP</span>
            </div>
            
            <div className="space-y-3">
              <div className="border border-slate-100 rounded-xl p-3 hover:border-pink-200 transition-colors cursor-pointer bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">QUANTUM PHYSICS</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#FF2D55]"></span> Prof. Aris Thorne
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">4 / 6 hrs</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF2D55] h-full" style={{ width: '66%' }}></div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl p-3 hover:border-teal-200 transition-colors cursor-pointer bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">CYBER SECURITY</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00C2A0]"></span> Sarah Connor
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">2 / 4 hrs</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00C2A0] h-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 border border-dashed border-slate-300 text-slate-400 text-xs font-bold tracking-widest rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-colors">
              + ADD SUBJECT
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-600 font-bold text-sm tracking-[0.1em]">WEEKLY SCHEDULE <span className="text-[#00C2A0]">— SECTION A</span></h3>
            <div className="flex gap-3 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-400"></span> Core</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400"></span> Lab</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Elective</span>
            </div>
          </div>

          <div className="min-w-[600px]">
            <div className="grid grid-cols-6 border-b-2 border-slate-100 pb-2 mb-2">
              <div className="text-xs font-bold text-slate-400 text-center tracking-widest">TIME</div>
              {days.map(day => (
                <div key={day} className="text-xs font-bold text-slate-700 text-center tracking-widest">{day}</div>
              ))}
            </div>

            {times.map((time, idx) => (
              <div key={time}>
                {idx === 2 && (
                  <div className="grid grid-cols-1 border-y border-dashed border-slate-200 py-1.5 my-1.5">
                     <div className="text-[10px] text-center font-bold text-slate-400 tracking-[0.2em]">RECESS & SYSTEM MAINTENANCE</div>
                  </div>
                )}
                <div className="grid grid-cols-6 gap-2 mb-2 items-stretch min-h-[60px]">
                  <div className="flex items-center justify-center border-r border-slate-100 pr-2">
                    <div className="text-center">
                      <div className="text-xs font-bold text-[#FF2D55]">{time.split(' - ')[0]}</div>
                      <div className="text-[10px] font-semibold text-slate-400">{time.split(' - ')[1]}</div>
                    </div>
                  </div>
                  
                  {days.map(day => {
                    const cellData = timetable.find(t => t.day === day && t.time === time);
                    return (
                      <div key={day} className={`rounded-xl p-2 flex flex-col justify-between border ${cellData ? cellData.color : 'border-dashed border-slate-200 bg-slate-50/50'}`}>
                        {cellData ? (
                          <>
                            <div className="font-bold text-[11px] tracking-wide uppercase">{cellData.subject}</div>
                            <div className="text-[9px] font-semibold opacity-70">{cellData.room}</div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300 font-bold">+</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-slate-800 font-bold text-xs tracking-[0.15em] mb-4">SYLLABUS TRACKER</h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>QUANTUM MECHANICS</span>
                  <span className="text-[#00C2A0]">75%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                  <div className="bg-[#00C2A0] h-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-[9px] text-slate-400 font-semibold italic">Next: Wave-Particle Duality</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>CALCULUS III</span>
                  <span className="text-[#FF2D55]">42%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                  <div className="bg-[#FF2D55] h-full" style={{ width: '42%' }}></div>
                </div>
                <p className="text-[9px] text-slate-400 font-semibold italic">Behind Schedule: Integrals</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>NETWORK SECURITY</span>
                  <span className="text-amber-500">90%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                  <div className="bg-amber-400 h-full" style={{ width: '90%' }}></div>
                </div>
                <p className="text-[9px] text-slate-400 font-semibold italic">Final Review Stage</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
            <h3 className="text-[#FF2D55] font-bold text-xs tracking-[0.15em] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              CONFLICT ALERTS
            </h3>
            
            <div className="space-y-3">
              <div className="bg-red-50/50 border-l-2 border-[#FF2D55] p-3 rounded-r-xl">
                <h4 className="text-[11px] font-bold text-slate-800">Lab 04 Double Booking</h4>
                <p className="text-[9px] text-slate-500 mt-1">Grade 10 and Grade 12 overlapping Monday 09:00.</p>
              </div>
              <div className="bg-amber-50/50 border-l-2 border-amber-400 p-3 rounded-r-xl">
                <h4 className="text-[11px] font-bold text-slate-800">Teacher Exhaustion</h4>
                <p className="text-[9px] text-slate-500 mt-1">Prof. Aris Thorne exceeds 4 consecutive hours.</p>
              </div>
            </div>

            <button className="w-full mt-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold tracking-widest rounded-xl hover:bg-slate-100 transition-colors">
              RESOLVE ALL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimetablePage;
