import { useState } from 'react';

function FeesPage() {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'upi', 'card', 'cash'
  const [gradeToggle, setGradeToggle] = useState('6-12'); // '1-5', '6-12'
  const [studentSearch, setStudentSearch] = useState('ID: SCH-2024-049');
  const [liveFeed, setLiveFeed] = useState([
    { id: 1, type: 'success', text: '+₹840 Received', subtext: 'SARAH JENKINS | 14 MINS AGO', color: 'border-[#00C2A0]' },
    { id: 2, type: 'info', text: 'Receipt Generated', subtext: 'TXN-889244 | 45 MINS AGO', color: 'border-[#FF2D55]' },
    { id: 3, type: 'error', text: 'Payment Declined', subtext: 'ID: SCH-301-P | 1 HOUR AGO', color: 'border-amber-400' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuthorizePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        type: 'success',
        text: '+₹1,200 Received',
        subtext: 'ALEXANDRE VANCE | JUST NOW',
        color: 'border-[#00C2A0]'
      };
      setLiveFeed(prev => [newLog, ...prev]);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* --- TOP ROW: METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Revenue Overview</p>
          <h2 className="text-4xl font-black text-[#FF2D55] tracking-tight">₹420,850</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Total Fees Collected (Term 1)</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[#00C2A0] text-xs font-bold">+12.5% vs Last Year</span>
          </div>
          <div className="absolute top-6 right-6 opacity-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Pending Dues</p>
          <h2 className="text-4xl font-black text-amber-500 tracking-tight">₹84,120</h2>
          <div className="mt-6">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: '82%' }}></div>
            </div>
            <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-2 text-right">82% Collected</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Late Fee Penalty</p>
          <h2 className="text-4xl font-black text-red-500 tracking-tight">₹12,450</h2>
          <div className="mt-6 flex items-center gap-2">
            <span className="text-red-500 text-xs font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              48 Students penalized today
            </span>
          </div>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COL: Process Payment */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#00C2A0] mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            Process Payment
          </h3>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Student Search</label>
              <div className="relative mt-1">
                <input type="text" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="minimal-input w-full bg-slate-50 rounded-xl px-4 py-3 border-0 text-slate-700 font-semibold" />
                <span className="absolute right-4 top-3.5 text-[#00C2A0] cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
              </div>
            </div>

            {/* Found Student Card */}
            <div className="bg-teal-50/50 rounded-xl p-3 border border-[#00C2A0]/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                <img src="https://i.pravatar.cc/100?img=11" alt="Student" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Alexandre Vance</p>
                <p className="text-[10px] font-bold tracking-widest text-[#00C2A0] uppercase">Class 10 B | Roll: 042</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Installment Type</label>
              <select className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0 text-slate-700 font-semibold">
                <option>Term 2 Tuition - ₹1,200</option>
                <option>Hostel Fee - ₹2,500</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Payment Method</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {['upi', 'card', 'cash'].map(method => (
                  <button 
                    key={method} 
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors
                      ${paymentMethod === method ? 'border-[#00C2A0] bg-teal-50 text-[#00C2A0]' : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'}`}
                  >
                    <span className="text-xl">
                      {method === 'upi' ? '📱' : method === 'card' ? '💳' : '💵'}
                    </span>
                    <span className="text-[10px] font-bold tracking-widest uppercase">{method}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500">Total Payable</p>
              <p className="text-2xl font-black text-[#00C2A0]">₹1,200.00</p>
            </div>

            <button 
              onClick={handleAuthorizePayment}
              disabled={isProcessing}
              className="w-full bg-[#00C2A0] text-white font-bold py-3 rounded-xl hover:bg-teal-500 transition-colors shadow-lg shadow-teal-200 tracking-widest text-xs uppercase"
            >
              {isProcessing ? 'Processing...' : 'Authorize Payment'}
            </button>
            <div className="text-center mt-2">
              <a href="#" className="text-[10px] font-bold text-slate-400 tracking-widest uppercase hover:text-[#00C2A0]">📄 Generate Draft Receipt</a>
            </div>
          </div>
        </div>

        {/* RIGHT COL: Data Tables */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Critical Defaulters */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold tracking-[0.1em] text-red-500 flex items-center gap-2 uppercase">
                <span className="text-lg">⚠</span> Critical Defaulters
              </h3>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase cursor-pointer hover:text-slate-700">View All</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">ID</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Pending Since</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-200"></div>
                      <span className="font-bold text-slate-800 text-xs">Marcus Thorne</span>
                    </td>
                    <td className="py-3 text-center text-[10px] font-bold text-slate-500">SCH-102-A</td>
                    <td className="py-3 text-center"><span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full tracking-widest">60+ DAYS</span></td>
                    <td className="py-3 text-right font-bold text-red-500">₹3,450</td>
                    <td className="py-3 text-center text-slate-400 cursor-pointer hover:text-slate-800">✉️</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-200"></div>
                      <span className="font-bold text-slate-800 text-xs">Elena Rodriguez</span>
                    </td>
                    <td className="py-3 text-center text-[10px] font-bold text-slate-500">SCH-084-B</td>
                    <td className="py-3 text-center"><span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full tracking-widest">25 DAYS</span></td>
                    <td className="py-3 text-right font-bold text-red-500">₹820</td>
                    <td className="py-3 text-center text-slate-400 cursor-pointer hover:text-slate-800">✉️</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Fee Structure */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold tracking-[0.1em] text-slate-800 flex items-center gap-2 uppercase">
                <span className="text-[#00C2A0]">≡</span> Academic Fee Structure
              </h3>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setGradeToggle('1-5')}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-md transition-all ${gradeToggle === '1-5' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
                >Grade 1-5</button>
                <button 
                  onClick={() => setGradeToggle('6-12')}
                  className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-md transition-all ${gradeToggle === '6-12' ? 'bg-[#00C2A0] text-white shadow-sm' : 'text-slate-400'}`}
                >Grade 6-12</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fee Category</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Tuition</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Transport</th>
                    <th className="pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Hostel</th>
                    <th className="pb-2 text-[9px] font-bold text-[#00C2A0] uppercase tracking-widest text-right">Annual Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {gradeToggle === '6-12' ? (
                    <>
                      <tr>
                        <td className="py-3 font-bold text-slate-800 text-xs">Class 10 - Standard</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹4,500</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹800</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-400">N/A</td>
                        <td className="py-3 text-right text-xs font-bold text-[#00C2A0]">₹5,300</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-800 text-xs">Class 12 - Science Wing</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹5,800</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹1,200</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹2,500</td>
                        <td className="py-3 text-right text-xs font-bold text-[#00C2A0]">₹9,500</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-800 text-xs">Class 12 - Commerce</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹5,200</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹1,200</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹2,500</td>
                        <td className="py-3 text-right text-xs font-bold text-[#00C2A0]">₹8,900</td>
                      </tr>
                    </>
                  ) : (
                     <>
                      <tr>
                        <td className="py-3 font-bold text-slate-800 text-xs">Grade 1-3 - Standard</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹2,500</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹500</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-400">N/A</td>
                        <td className="py-3 text-right text-xs font-bold text-[#00C2A0]">₹3,000</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-800 text-xs">Grade 4-5 - Standard</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹3,000</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-600">₹600</td>
                        <td className="py-3 text-right text-xs font-semibold text-slate-400">N/A</td>
                        <td className="py-3 text-right text-xs font-bold text-[#00C2A0]">₹3,600</td>
                      </tr>
                     </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM FEED (FIXED) --- */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-slate-100 shadow-2xl p-4 overflow-x-auto z-40">
        <div className="flex items-center gap-4 min-w-max">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF2D55] uppercase flex items-center gap-2 mr-2">
            <span className="w-2 h-2 rounded-full bg-[#FF2D55] animate-pulse"></span> Live Feed
          </span>
          {liveFeed.map((log) => (
            <div key={log.id} className={`flex items-center gap-3 bg-slate-50 border-l-4 ${log.color} px-4 py-2 rounded-r-xl shrink-0 animate-in slide-in-from-left-4 duration-300`}>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs">
                {log.type === 'success' ? '✓' : log.type === 'error' ? '!' : '📄'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{log.text}</p>
                <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">{log.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default FeesPage;
