import { useState } from 'react';

function StaffPage() {
  const [activeTab, setActiveTab] = useState('directory');

  const staffMembers = [
    { id: 'STF-001', name: 'Dr. Elias Vance', avatar: 'https://i.pravatar.cc/150?img=11', role: 'Head of Science', dept: 'Academic', status: 'Active', salaryBand: '$85k - $95k' },
    { id: 'STF-042', name: 'Sarah Mitchell', avatar: 'https://i.pravatar.cc/150?img=47', role: 'Logistics Coord.', dept: 'Administration', status: 'Active', salaryBand: '$55k - $65k' },
    { id: 'STF-089', name: 'Marcus Vane', avatar: 'https://i.pravatar.cc/150?img=12', role: 'Security Chief', dept: 'Support', status: 'On Leave', salaryBand: '$60k - $70k' },
    { id: 'STF-112', name: 'Prof. Aris Thorne', avatar: 'https://i.pravatar.cc/150?img=33', role: 'Senior Lecturer', dept: 'Academic', status: 'Active', salaryBand: '$75k - $85k' },
    { id: 'STF-156', name: 'Elena Rostova', avatar: 'https://i.pravatar.cc/150?img=5', role: 'Finance Director', dept: 'Administration', status: 'Active', salaryBand: '$90k - $110k' },
  ];

  return (
    <div className="space-y-6 pb-24 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">STAFF COMMAND CENTER</h1>
           <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">SuperAdmin view: Directory, Access Control, and Department Analytics.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="border-2 border-slate-200 text-slate-700 text-[10px] font-bold tracking-widest uppercase px-6 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <span>⎘</span> EXPORT REGISTRY
           </button>
           <button className="bg-[#FF2D55] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-2.5 rounded-lg hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200 flex items-center gap-2">
              <span className="text-lg leading-none">+</span> ADD NEW NODE
           </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-[#00C2A0] uppercase mb-2">Total Active Nodes</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">142</h2>
            <span className="text-[#00C2A0] text-[10px] font-bold mb-1">↗ +3 this month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Dept. Allocations</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">68%</h2>
            <span className="text-slate-400 text-[9px] font-bold tracking-widest uppercase mb-1">Academic Staff</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-amber-500 uppercase mb-2">Leave Status</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-amber-500 tracking-tight">05</h2>
            <span className="text-amber-500 text-[9px] font-bold tracking-widest uppercase mb-1">Currently Away</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase mb-2">Pending Onboarding</p>
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">02</h2>
            <span className="text-[#FF2D55] text-[9px] font-bold tracking-widest uppercase mb-1">Action Required</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[500px]">
        
        {/* TABS */}
        <div className="flex items-center gap-8 border-b border-slate-100 px-8 pt-6">
           <button 
             onClick={() => setActiveTab('directory')}
             className={`text-[11px] font-bold tracking-widest uppercase pb-4 transition-colors ${activeTab === 'directory' ? 'text-[#00C2A0] border-b-2 border-[#00C2A0]' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Staff Directory
           </button>
           <button 
             onClick={() => setActiveTab('access')}
             className={`text-[11px] font-bold tracking-widest uppercase pb-4 transition-colors ${activeTab === 'access' ? 'text-[#00C2A0] border-b-2 border-[#00C2A0]' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Access Control
           </button>
           <button 
             onClick={() => setActiveTab('analytics')}
             className={`text-[11px] font-bold tracking-widest uppercase pb-4 transition-colors ${activeTab === 'analytics' ? 'text-[#00C2A0] border-b-2 border-[#00C2A0]' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Dept Analytics
           </button>
        </div>

        {/* TAB CONTENT */}
        <div className="p-8">
          
          {/* DIRECTORY TAB */}
          {activeTab === 'directory' && (
             <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                   <thead>
                      <tr className="border-b border-slate-100">
                         <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest w-24">Node ID</th>
                         <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Profile</th>
                         <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest w-48">Role & Dept</th>
                         <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest w-32">Status</th>
                         <th className="pb-4 text-[9px] font-bold text-[#FF2D55] uppercase tracking-widest w-32">Salary Band 🔒</th>
                         <th className="pb-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right w-16">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {staffMembers.map((staff) => (
                         <tr key={staff.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="py-4 font-bold text-slate-500 text-xs tracking-wide">{staff.id}</td>
                            <td className="py-4 flex items-center gap-3">
                               <img src={staff.avatar} alt={staff.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                               <span className="font-bold text-slate-800">{staff.name}</span>
                            </td>
                            <td className="py-4">
                               <div className="flex flex-col">
                                  <span className="font-bold text-slate-700 text-xs">{staff.role}</span>
                                  <span className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">{staff.dept}</span>
                               </div>
                            </td>
                            <td className="py-4">
                               <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md ${staff.status === 'Active' ? 'bg-teal-50 text-[#00C2A0]' : 'bg-amber-50 text-amber-500'}`}>
                                  {staff.status}
                               </span>
                            </td>
                            <td className="py-4 text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                               {staff.salaryBand}
                            </td>
                            <td className="py-4 text-right text-slate-400 cursor-pointer hover:text-slate-800 font-bold text-lg">
                               <button className="px-2 py-1 bg-slate-100 rounded text-xs hover:bg-slate-200 transition-colors">Edit</button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}

          {/* ACCESS CONTROL TAB */}
          {activeTab === 'access' && (
            <div className="max-w-4xl">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <span className="text-[#00C2A0] text-lg">🛡</span> Global Permissions Registry
              </h3>
              
              <div className="space-y-4">
                 {/* Role Row 1 */}
                 <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                    <div>
                       <h4 className="text-sm font-bold text-slate-800">System Administrator (Level 5)</h4>
                       <p className="text-[10px] text-slate-500 tracking-wide mt-1">Full access to all modules, including Payroll, Access Control, and System Logs.</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">2 Nodes Assigned</span>
                       <button className="bg-slate-200 text-slate-500 text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors">Manage</button>
                    </div>
                 </div>

                 {/* Role Row 2 */}
                 <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <div>
                       <h4 className="text-sm font-bold text-slate-800">Finance Director (Level 4)</h4>
                       <p className="text-[10px] text-slate-500 tracking-wide mt-1">Access to Fee Management, Basic Payroll viewing, and Financial Reports.</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">4 Nodes Assigned</span>
                       <button className="border border-slate-200 text-slate-600 text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">Manage</button>
                    </div>
                 </div>

                 {/* Role Row 3 */}
                 <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <div>
                       <h4 className="text-sm font-bold text-slate-800">Senior Academic (Level 3)</h4>
                       <p className="text-[10px] text-slate-500 tracking-wide mt-1">Access to Exams, Attendance, Timetable, and Academic Reports.</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">28 Nodes Assigned</span>
                       <button className="border border-slate-200 text-slate-600 text-[9px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">Manage</button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <span className="text-[#FF2D55] text-lg">📊</span> Department Distribution
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Visual Mock Grid for Department distribution */}
                 <div className="md:col-span-2 h-64 border-b border-slate-100 flex items-end justify-around pb-2">
                    <div className="w-16 bg-[#00C2A0] rounded-t-sm h-[80%] relative group cursor-pointer">
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">80</span>
                    </div>
                    <div className="w-16 bg-teal-200 rounded-t-sm h-[40%] relative group cursor-pointer">
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">40</span>
                    </div>
                    <div className="w-16 bg-[#FF2D55] rounded-t-sm h-[15%] relative group cursor-pointer">
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">15</span>
                    </div>
                    <div className="w-16 bg-pink-200 rounded-t-sm h-[07%] relative group cursor-pointer">
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">7</span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-[#00C2A0]"></div>
                       <span className="text-xs font-bold text-slate-700">Academic (Teachers)</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-teal-200"></div>
                       <span className="text-xs font-bold text-slate-700">Administration</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-[#FF2D55]"></div>
                       <span className="text-xs font-bold text-slate-700">Support & Security</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                       <span className="text-xs font-bold text-slate-700">Logistics</span>
                    </div>
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default StaffPage;
