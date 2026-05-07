import { useEffect, useState, useMemo } from 'react';
import api from '../../../app/api';

function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0 = Table, 1-4 = Wizard

  // --- WIZARD FORM STATE (Frontend Mock for now) ---
  const [formData, setFormData] = useState({
    studentName: '', dob: '', gender: '', category: '', bloodGroup: '', aadhar: '',
    address: '', previousSchool: '', fatherName: '', fatherOcc: '', fatherPhone: '',
    motherName: '', motherOcc: '', motherPhone: '', emergencyName: '', emergencyRel: '', emergencyPhone: ''
  });

  useEffect(() => {
    api.get('/admissions').then((res) => setAdmissions(res.data.admissions));
  }, []);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleCancel = () => setCurrentStep(0);

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((a) => {
      const matchesSearch = a.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (a.previous_school || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? a.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [admissions, searchQuery, statusFilter]);

  const uniqueStatuses = useMemo(() => [...new Set(admissions.map(a => a.status))], [admissions]);

  // --- WIZARD RENDERERS ---

  const renderTabs = () => {
    const tabs = [
      { id: 1, label: 'STUDENT INFO', icon: '👤' },
      { id: 2, label: 'PARENT DETAILS', icon: '👥' },
      { id: 3, label: 'DOCUMENTS', icon: '📄' },
      { id: 4, label: 'REVIEW & PAY', icon: '💳' }
    ];
    return (
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap bg-white rounded-t-3xl shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentStep(tab.id)}
            className={`flex items-center gap-2 px-8 py-4 text-xs font-bold tracking-widest uppercase transition-colors flex-1 justify-center
              ${currentStep === tab.id 
                ? 'border-b-2 border-[#FF2D55] text-[#FF2D55] bg-pink-50/30' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <span className="opacity-70">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>
    );
  };

  const renderBottomBar = () => (
    <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-200 p-4 shadow-xl z-50 flex justify-between items-center px-8">
      {currentStep > 1 ? (
        <button onClick={handlePrev} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors">
          &larr; Back to {currentStep === 2 ? 'Student Info' : currentStep === 3 ? 'Parent Details' : 'Documents'}
        </button>
      ) : <div></div>}
      
      <div className="flex gap-4">
        <button onClick={handleCancel} className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors">
          Cancel
        </button>
        <button onClick={currentStep === 4 ? handleCancel : handleNext} className="px-6 py-2.5 rounded-xl bg-[#00C2A0] text-white font-bold text-sm hover:bg-teal-500 transition-colors flex items-center gap-2 shadow-lg shadow-teal-200">
          {currentStep === 4 ? 'Authorize Payment' : 'Save and Continue'} &rarr;
        </button>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <p className="text-[#FF2D55] text-[10px] font-bold tracking-[0.2em] uppercase">Step 01 of 04</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Student Details</h2>
        <p className="text-slate-500 text-sm mt-2">Enter the applicant's primary personal and academic information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00C2A0] flex items-center justify-center text-xl">👤</div>
              <h3 className="text-xl font-bold text-slate-900">Student Details</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Full Name *</label>
                <input type="text" placeholder="Enter student's legal name" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-[#00C2A0]" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Date of Birth *</label>
                  <input type="date" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-[#00C2A0]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Gender *</label>
                  <select className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-[#00C2A0]">
                    <option>Select gender</option>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Category *</label>
                  <select className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-[#00C2A0]">
                    <option>Select category</option>
                    <option>General</option><option>OBC</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Blood Group</label>
                  <select className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-[#00C2A0]">
                    <option>Optional</option>
                    <option>O+</option><option>A+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Aadhar Card No / Govt ID *</label>
                <input type="text" placeholder="XXXX-XXXX-XXXX" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-[#00C2A0]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
             <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00C2A0] flex items-center justify-center text-xl">📍</div>
              <h3 className="text-xl font-bold text-slate-900">Residential Address</h3>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Street Address & Area *</label>
              <textarea placeholder="Enter complete home address" rows="3" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0 focus:ring-2 focus:ring-[#00C2A0]"></textarea>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">🎓 Academics</h3>
            <div>
              <label className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase">Previous School</label>
              <input type="text" placeholder="Name of last institution" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-2 border-0 text-sm" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-[#00C2A0] transition-colors cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-2xl text-slate-400 mb-4">📷</div>
            <h4 className="text-sm font-bold text-slate-900">Upload Student Photo</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">Max size 2MB. JPEG or PNG</p>
            <span className="text-[#00C2A0] font-bold text-xs tracking-widest uppercase">BROWSE FILES</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <p className="text-[#FF2D55] text-[10px] font-bold tracking-[0.2em] uppercase">Step 02 of 04</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Parent Details</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl">Please provide accurate information for both parents or legal guardians. This data is critical for administrative and emergency communications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Father */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-50 text-[#00C2A0] flex items-center justify-center text-sm">👨</span> Father's Information
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Full Name</label>
              <input type="text" placeholder="Enter father's full name" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0" />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Occupation</label>
              <input type="text" placeholder="Current profession" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0" />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Mobile Number</label>
              <div className="flex mt-1">
                <span className="bg-slate-100 px-4 py-3 rounded-l-xl text-slate-500 font-semibold border-r border-white">+91</span>
                <input type="tel" placeholder="10-digit mobile number" className="minimal-input w-full bg-slate-50 rounded-r-xl px-4 py-3 border-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Mother */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-pink-50 text-[#FF2D55] flex items-center justify-center text-sm">👩</span> Mother's Information
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Full Name</label>
              <input type="text" placeholder="Enter mother's full name" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0" />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Occupation</label>
              <input type="text" placeholder="Current profession" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0" />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Mobile Number</label>
              <div className="flex mt-1">
                <span className="bg-slate-100 px-4 py-3 rounded-l-xl text-slate-500 font-semibold border-r border-white">+91</span>
                <input type="tel" placeholder="10-digit mobile number" className="minimal-input w-full bg-slate-50 rounded-r-xl px-4 py-3 border-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
            <span className="text-[#FF2D55] text-xl">✱</span> Emergency Contact
          </h3>
          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">Required</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Contact Name</label>
            <input type="text" placeholder="Primary emergency contact" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0" />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Relationship</label>
            <select className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0">
              <option>Select relationship</option>
              <option>Uncle/Aunt</option><option>Grandparent</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Emergency Phone</label>
            <input type="tel" placeholder="Active mobile number" className="minimal-input mt-1 w-full bg-slate-50 rounded-xl px-4 py-3 border-0" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <p className="text-[#FF2D55] text-[10px] font-bold tracking-[0.2em] uppercase">Step 03 of 04</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Document Upload</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Submission Guide</h3>
            <ul className="space-y-3 text-sm text-slate-600 mb-6">
              <li className="flex items-start gap-2"><span className="text-[#00C2A0]">✓</span> Accepted formats: PDF, JPG, or PNG only.</li>
              <li className="flex items-start gap-2"><span className="text-[#00C2A0]">✓</span> Maximum file size: 5MB per document.</li>
              <li className="flex items-start gap-2"><span className="text-[#00C2A0]">✓</span> Ensure documents are clearly legible.</li>
            </ul>
            <div className="bg-teal-50 text-teal-800 p-4 rounded-xl text-xs leading-relaxed">
              Need assistance? Reach out to the admission desk at help@edutrace.edu or use the support icon in the top navigation.
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-sm relative h-48 bg-gradient-to-br from-pink-500 to-amber-500">
             <div className="absolute inset-0 bg-black/20"></div>
             <div className="absolute bottom-4 left-4 text-white font-bold text-sm">Secure Portal Encryption Active</div>
          </div>
        </div>

        {/* Right Cards */}
        <div className="lg:col-span-8 space-y-6">
          {[
            { title: 'Birth Certificate', desc: 'Official proof of birth issued by the municipality.', req: true },
            { title: 'Previous Marksheet', desc: 'Grade card from the last academic year completed.', req: true },
            { title: 'Transfer Certificate', desc: 'TC from previous school (if applicable).', req: false }
          ].map(doc => (
            <div key={doc.title} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{doc.desc}</p>
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md ${doc.req ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                  {doc.req ? '● REQUIRED' : 'OPTIONAL'}
                </span>
              </div>
              
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-pink-300 transition-colors cursor-pointer bg-slate-50/50">
                <span className="text-3xl mb-2 text-slate-300">☁️</span>
                <p className="text-sm font-semibold text-slate-600">Drag and drop file here or <span className="text-[#FF2D55]">browse</span></p>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">PDF, PNG, JPG (Max 5MB)</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <p className="text-[#FF2D55] text-[10px] font-bold tracking-[0.2em] uppercase">Step 04 of 04</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Final Review</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl">Please verify all the information before proceeding to the payment gateway. Once submitted, some fields may require school administration approval for changes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Cards */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex gap-6 relative">
          <div className="absolute top-6 right-6 text-[#FF2D55] cursor-pointer">✏️</div>
          <div className="w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
             <img src="https://i.pravatar.cc/200?img=11" alt="Student" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Aryan Sharma</h3>
            <p className="text-sm font-bold text-[#00C2A0] mt-1">Grade 9 • Science Stream</p>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Date of Birth</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">12 May 2010</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Gender</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">Male</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Blood Group</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">O Positive</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Nationality</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">Indian</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative">
          <div className="absolute top-6 right-6 text-[#FF2D55] cursor-pointer">✏️</div>
          <h3 className="text-lg font-bold text-slate-900 mb-6">Guardian Contact</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="mt-1 text-[#00C2A0]">👤</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Vikram Sharma (Father)</p>
                <p className="text-xs text-slate-500">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-[#00C2A0]">👤</div>
              <div>
                <p className="text-sm font-bold text-slate-800">Priya Sharma (Mother)</p>
                <p className="text-xs text-slate-500">+91 98765 01234</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Residential Address</p>
            <p className="text-xs text-slate-700 leading-relaxed">402, Green Valley Apartments, Sector 15,<br/>Gurgaon, Haryana - 122001</p>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Documents</h3>
          {[
            { name: 'Birth Certificate', status: '✓' },
            { name: 'Previous Report Card', status: '✓' },
            { name: 'Transfer Certificate', status: '✓' }
          ].map(doc => (
            <div key={doc.name} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-50 text-[#00C2A0] flex items-center justify-center text-xs font-bold">{doc.status}</div>
                <span className="text-sm font-semibold text-slate-800">{doc.name}</span>
              </div>
              <span className="text-slate-400 cursor-pointer hover:text-slate-600">👁️</span>
            </div>
          ))}
        </div>

        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
          <div className="flex-1 py-2">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Fee Breakdown</h3>
            <div className="space-y-4 text-sm font-medium text-slate-500">
              <div className="flex justify-between"><span>Admission Processing Fee</span><span className="font-bold text-slate-800">₹ 5,000.00</span></div>
              <div className="flex justify-between"><span>Security Deposit (Refundable)</span><span className="font-bold text-slate-800">₹ 15,000.00</span></div>
              <div className="flex justify-between"><span>Academic Kit & ERP Access</span><span className="font-bold text-slate-800">₹ 2,500.00</span></div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-[#FF2D55] uppercase mb-1">Total Payable</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">₹ 22,500.00</p>
              </div>
              <p className="text-[10px] text-slate-400 italic text-right max-w-[80px]">Includes applicable taxes</p>
            </div>
          </div>

          <div className="w-full md:w-64 rounded-2xl bg-gradient-to-br from-pink-400 to-[#FF2D55] p-6 text-white flex flex-col justify-center items-center text-center shadow-xl shadow-pink-200">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-4">💳</div>
            <h4 className="font-bold text-lg mb-2">Secure Checkout</h4>
            <p className="text-[10px] text-white/80 font-medium mb-6 leading-relaxed">Pay via Credit Card, UPI, or Net Banking. Encrypted SSL connection.</p>
            <button className="w-full bg-white text-[#FF2D55] font-bold py-3 rounded-xl hover:bg-pink-50 transition-colors shadow-lg">
              Authorize Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- DASHBOARD TABLE RENDERER ---
  if (currentStep === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Admissions Portal</h2>
            <p className="mt-2 text-sm font-semibold tracking-widest text-slate-500 uppercase">Review pending applications</p>
          </div>
          <button onClick={() => setCurrentStep(1)} className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg">
            + New Application
          </button>
        </div>

        <div className="rounded-3xl bg-white shadow-sm overflow-hidden border border-slate-100">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="flex-1 w-full relative">
              <input 
                type="text" 
                placeholder="Search by student name or previous school..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-[#00C2A0] focus:outline-none"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-[#00C2A0] focus:outline-none"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr>
                  <th className="table-header">Application ID</th>
                  <th className="table-header">Applicant Details</th>
                  <th className="table-header">Academic Details</th>
                  <th className="table-header">Contact Info</th>
                  <th className="table-header text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdmissions.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">No applications found.</td></tr>
                ) : (
                  filteredAdmissions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4 text-slate-400 font-bold tracking-widest text-[10px]">{item.id}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900">{item.student}</div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">Applied: {item.admissionDate ? new Date(item.admissionDate).toLocaleDateString() : '—'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 text-xs">Grade {item.grade}</div>
                        <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5" title={item.previous_school}>Prev: {item.previous_school ? (item.previous_school.length > 20 ? item.previous_school.substring(0, 20) + '...' : item.previous_school) : '—'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-700 font-semibold text-xs">{item.parent_email || '—'}</div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">{item.parent_phone || '—'}</div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] tracking-widest uppercase font-bold 
                          ${item.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                            item.status === 'Accepted' ? 'bg-[#00C2A0]/20 text-teal-800' : 
                            item.status === 'Rejected' ? 'bg-[#FF2D55]/20 text-[#FF2D55]' : 'bg-slate-100 text-slate-800'}`}>
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

  // --- MAIN WIZARD RENDER ---
  return (
    <div className="min-h-screen pb-32">
      {renderTabs()}
      <div className="mt-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
      {renderBottomBar()}
    </div>
  );
}

export default AdmissionsPage;
