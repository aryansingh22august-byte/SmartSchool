import { useState } from 'react';

function MessagesPage() {
  const [activeTab, setActiveTab] = useState('primary');
  const [broadcastAudience, setBroadcastAudience] = useState('guardians');
  
  return (
    <div className="space-y-6 pb-24 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">COMM-LINK HUB</h1>
           <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">Inter-modular communication & system broadcasting protocol active.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="border-2 border-slate-200 text-slate-700 text-[10px] font-bold tracking-widest uppercase px-6 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
              <span>▷</span> BROADCAST MESSAGE
           </button>
           <button className="bg-[#FF2D55] text-white text-[10px] font-bold tracking-widest uppercase px-6 py-2.5 rounded-lg hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200 flex items-center gap-2">
              <span className="text-lg leading-none">+</span> NEW ANNOUNCEMENT
           </button>
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COL 1: CHAT LIST (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-[600px]">
           {/* Tabs */}
           <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-4">
                 <button className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${activeTab === 'primary' ? 'text-[#FF2D55] border-b-2 border-[#FF2D55] pb-1' : 'text-slate-400 hover:text-slate-600'}`} onClick={() => setActiveTab('primary')}>Primary Feed</button>
                 <button className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${activeTab === 'alerts' ? 'text-[#FF2D55] border-b-2 border-[#FF2D55] pb-1' : 'text-slate-400 hover:text-slate-600'}`} onClick={() => setActiveTab('alerts')}>System Alerts</button>
                 <button className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${activeTab === 'archived' ? 'text-[#FF2D55] border-b-2 border-[#FF2D55] pb-1' : 'text-slate-400 hover:text-slate-600'}`} onClick={() => setActiveTab('archived')}>Archived</button>
              </div>
              <span className="bg-pink-100 text-[#FF2D55] text-[8px] font-bold tracking-widest px-2 py-1 rounded-md uppercase">3 New</span>
           </div>

           {/* List */}
           <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {/* Item 1 - Active */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border-l-4 border-[#FF2D55] cursor-pointer">
                 <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="text-sm font-bold text-slate-800 truncate">Sarah Mitchell</h4>
                       <span className="text-[9px] text-slate-400 font-bold">12:04</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">Regarding the upcoming tech fair...</p>
                 </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-transparent">
                 <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="text-sm font-bold text-slate-800 truncate">Prof. Aris Thorne</h4>
                       <span className="text-[9px] text-slate-400 font-bold">09:15</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">Grades for Sector 7 have been synced.</p>
                 </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-transparent">
                 <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className="text-sm font-bold text-slate-800 truncate">Marcus Vane</h4>
                       <span className="text-[9px] text-slate-400 font-bold">Yesterday</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">Payment confirmed for Semester 2.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* COL 2: ACTIVE CHAT (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden">
           {/* Chat Header */}
           <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <img src="https://i.pravatar.cc/150?img=47" alt="Sarah Mitchell" className="w-10 h-10 rounded-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00C2A0] border-2 border-white rounded-full"></div>
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center">Sarah Mitchell <span className="text-[8px] tracking-widest text-[#00C2A0] uppercase ml-2 bg-teal-50 px-2 py-0.5 rounded">Online</span></h3>
                 </div>
              </div>
              <div className="flex gap-4 text-slate-400">
                 <button className="hover:text-slate-600 transition-colors">🎦</button>
                 <button className="hover:text-slate-600 transition-colors">📞</button>
                 <button className="hover:text-slate-600 transition-colors">⋮</button>
              </div>
           </div>

           {/* Chat Messages */}
           <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-6">
              
              {/* System Message */}
              <div className="flex justify-center">
                 <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
                    🔒 Welcome to the Neon Hub secure channel. Your conversation is encrypted with Quantum-7 protocols.
                 </span>
              </div>

              {/* Received Message */}
              <div className="flex items-end gap-2 max-w-[85%]">
                 <img src="https://i.pravatar.cc/150?img=47" alt="Sarah" className="w-6 h-6 rounded-full mb-1" />
                 <div>
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm text-sm text-slate-700 leading-relaxed">
                       Hi Sarah, how can I assist you with the upcoming Robotics fair logistics today?
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-1 ml-1 block">RECEIVED 12:00</span>
                 </div>
              </div>

              {/* Sent Message */}
              <div className="flex justify-end">
                 <div className="max-w-[85%]">
                    <div className="bg-[#FF2D55] text-white p-4 rounded-2xl rounded-br-none shadow-md shadow-pink-200/50 text-sm leading-relaxed">
                       Thanks! I was wondering if the deadline for the "Neural-Net" category submission has been extended? The students are still tuning their models.
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-1 mr-1 block text-right">SENT 12:04</span>
                 </div>
              </div>
           </div>

           {/* Chat Input */}
           <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-2 pr-2">
                 <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors text-lg">📎</button>
                 <input type="text" placeholder="Type your response..." className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder-slate-400 px-2" />
                 <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors text-lg">😊</button>
                 <button className="w-10 h-10 flex items-center justify-center bg-[#00C2A0] text-white rounded-xl shadow-sm hover:bg-teal-500 transition-colors">
                    ➤
                 </button>
              </div>
           </div>
        </div>

        {/* COL 3: BROADCAST & TELEMETRY (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Omni-Broadcast Card */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6">
                 <span className="text-[#00C2A0] text-lg">⚑</span> Omni-Broadcast
              </h3>

              <div className="space-y-5">
                 <div>
                    <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mb-2 block">Target Audience</label>
                    <select 
                       value={broadcastAudience} 
                       onChange={(e) => setBroadcastAudience(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 text-sm text-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00C2A0] transition-colors appearance-none"
                    >
                       <option value="guardians">All Guardians (850 nodes)</option>
                       <option value="staff">All Staff (120 nodes)</option>
                       <option value="students">All Students (1500 nodes)</option>
                       <option value="teachers">Teaching Staff (85 nodes)</option>
                       <option value="all">Global Broadcast (All Nodes)</option>
                    </select>
                 </div>

                 <div>
                    <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mb-2 block">Channels</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button className="flex items-center justify-center gap-2 border-2 border-[#00C2A0] bg-teal-50/30 text-[#00C2A0] py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-colors">
                          <span>▣</span> WHATSAPP
                       </button>
                       <button className="flex items-center justify-center gap-2 border border-slate-200 text-slate-400 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-slate-50 transition-colors">
                          <span>□</span> EMAIL
                       </button>
                    </div>
                 </div>

                 <button className="w-full bg-[#00C2A0] text-white font-black tracking-widest uppercase py-4 rounded-xl hover:bg-teal-500 transition-colors shadow-lg shadow-teal-200 flex justify-center items-center gap-2 text-[11px] mt-2">
                    <span className="text-base">🚀</span> PUSH TO ALL NODES
                 </button>
              </div>
           </div>

           {/* Telemetry Logs */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[10px] font-bold tracking-widest text-slate-800 uppercase">Telemetry Logs</h3>
                 <span className="text-[9px] font-bold tracking-widest text-[#00C2A0] uppercase bg-teal-50 px-2 py-1 rounded">Real-Time</span>
              </div>

              <div className="space-y-4">
                 {/* Log 1 */}
                 <div className="flex items-start justify-between border-l-2 border-[#00C2A0] pl-3">
                    <div>
                       <h4 className="text-xs font-bold text-slate-700">Fee Reminder - Q3</h4>
                       <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">820/850 DELIVERED</p>
                    </div>
                    <span className="text-[#00C2A0]">✓</span>
                 </div>
                 
                 {/* Log 2 */}
                 <div className="flex items-start justify-between border-l-2 border-amber-400 pl-3">
                    <div>
                       <h4 className="text-xs font-bold text-slate-700">Lab Maintenance</h4>
                       <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">PENDING QUEUE (12)</p>
                    </div>
                    <span className="text-amber-400">⏳</span>
                 </div>

                 {/* Log 3 */}
                 <div className="flex items-start justify-between border-l-2 border-[#FF2D55] pl-3">
                    <div>
                       <h4 className="text-xs font-bold text-slate-700">Emergency Alert - Rain</h4>
                       <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">FAILED: 2 NODES</p>
                    </div>
                    <span className="text-[#FF2D55]">✕</span>
                 </div>
              </div>
           </div>

        </div>

      </div>

      {/* BOTTOM SECTION: CALENDAR & EVENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
         
         {/* Mock Calendar Card */}
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
               📅 Nov 2024
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 tracking-wider">
               <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
               <span className="text-slate-300 py-1">27</span><span className="text-slate-300 py-1">28</span><span className="text-slate-300 py-1">29</span><span className="text-slate-300 py-1">30</span>
               <span className="py-1 text-slate-600">1</span><span className="py-1 text-slate-600">2</span><span className="py-1 text-slate-600">3</span>
               <span className="py-1 text-slate-600">4</span><span className="py-1 text-slate-600">5</span><span className="py-1 text-slate-600">6</span><span className="py-1 text-slate-600">7</span><span className="py-1 text-slate-600">8</span><span className="py-1 text-slate-600">9</span><span className="py-1 text-slate-600">10</span>
               <span className="py-1 text-slate-600">11</span><span className="py-1 text-slate-600">12</span><span className="py-1 bg-[#00C2A0] text-white rounded-full">13</span><span className="py-1 text-slate-600">14</span><span className="py-1 text-slate-600">15</span><span className="py-1 text-slate-600">16</span><span className="py-1 text-slate-600">17</span>
               <span className="py-1 text-slate-600">18</span><span className="py-1 text-slate-600">19</span><span className="py-1 text-slate-600">20</span><span className="py-1 text-slate-600">21</span><span className="py-1 text-slate-600">22</span><span className="py-1 text-slate-600">23</span><span className="py-1 text-slate-600">24</span>
            </div>
         </div>

         {/* Event Card 1 */}
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
               <span className="bg-pink-100 text-[#FF2D55] text-[8px] font-bold tracking-widest px-2 py-1 rounded uppercase mb-3 inline-block">Critical Deadline</span>
               <h3 className="text-base font-black text-slate-800 leading-tight mb-2">Final Thesis Submission</h3>
               <p className="text-xs text-slate-500 leading-relaxed">All Grade 12 nodes must upload digital portfolios by midnight.</p>
            </div>
            <div className="flex items-center justify-between mt-4">
               <span className="text-[10px] font-bold text-[#FF2D55] tracking-widest uppercase flex items-center gap-1">⏱ T-Minus 12H 45M</span>
               <button className="text-[9px] font-bold tracking-widest text-slate-400 hover:text-slate-600 uppercase border-b border-slate-300 pb-0.5">Notify Students</button>
            </div>
         </div>

         {/* Event Card 2 */}
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
               <span className="bg-teal-50 text-[#00C2A0] text-[8px] font-bold tracking-widest px-2 py-1 rounded uppercase mb-3 inline-block">Academic Event</span>
               <h3 className="text-base font-black text-slate-800 leading-tight mb-2">Cyber-Robotics Expo</h3>
               <p className="text-xs text-slate-500 leading-relaxed">Annual showcase of student-built autonomous drones and AI.</p>
            </div>
            <div className="flex items-center justify-between mt-4">
               <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">📍 Main Sector Hall</span>
               <button className="text-[9px] font-bold tracking-widest text-slate-400 hover:text-slate-600 uppercase border-b border-slate-300 pb-0.5">Event Details</button>
            </div>
         </div>

         {/* Event Card 3 */}
         <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
               <span className="bg-slate-100 text-slate-500 text-[8px] font-bold tracking-widest px-2 py-1 rounded uppercase mb-3 inline-block">Holiday</span>
               <h3 className="text-base font-black text-slate-800 leading-tight mb-2">Winter Solstice Break</h3>
               <p className="text-xs text-slate-500 leading-relaxed">System wide maintenance and student recharge period.</p>
            </div>
            <div className="flex items-center justify-between mt-4">
               <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1">📅 Dec 20 - Jan 05</span>
               <button className="text-[9px] font-bold tracking-widest text-slate-400 hover:text-slate-600 uppercase border-b border-slate-300 pb-0.5">Set Reminders</button>
            </div>
         </div>

      </div>

    </div>
  );
}

export default MessagesPage;
