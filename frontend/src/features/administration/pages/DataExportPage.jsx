import api from '../../../app/api';

const EXPORTS = [
  { key: 'students', label: 'Students', desc: 'All enrolled students with grade & section', color: 'bg-blue-50 text-blue-700', icon: '👨‍🎓' },
  { key: 'fees', label: 'Fees', desc: 'All fee records with paid, pending & due dates', color: 'bg-amber-50 text-amber-700', icon: '💰' },
  { key: 'staff', label: 'Staff', desc: 'All staff members with roles and status', color: 'bg-emerald-50 text-emerald-700', icon: '👩‍🏫' },
  { key: 'attendance', label: 'Attendance', desc: 'Daily attendance summary records', color: 'bg-violet-50 text-violet-700', icon: '📋' },
  { key: 'marks', label: 'Exam Marks', desc: 'All student marks with grade letters', color: 'bg-rose-50 text-rose-700', icon: '📝' },
  { key: 'admissions', label: 'Admissions', desc: 'Admission applications and their status', color: 'bg-sky-50 text-sky-700', icon: '🏫' },
];

function DataExportPage() {
  const handleDownload = async (key) => {
    try {
      const res = await api.get(`/export/${key}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-sky-50 rounded-md p-6">
        <h2 className="text-2xl font-semibold text-sky-900">Data Export</h2>
        <p className="mt-1 text-sm text-sky-700">
          Download your school data as CSV files. Use these for offline backups, Excel analysis, or third-party imports.
        </p>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-md p-4 text-sm text-sky-800">
        <strong>💡 Tip:</strong> All exports are scoped to your school only. Files can be opened in Microsoft Excel, Google Sheets, or any spreadsheet application.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXPORTS.map(exp => (
          <div key={exp.key} className={`rounded-md ${exp.color.split(' ')[0]} p-5 flex flex-col justify-between`}>
            <div>
              <div className="text-3xl mb-2">{exp.icon}</div>
              <h3 className={`font-semibold text-lg ${exp.color.split(' ')[1]}`}>{exp.label}</h3>
              <p className="mt-1 text-sm opacity-70">{exp.desc}</p>
            </div>
            <button
              onClick={() => handleDownload(exp.key)}
              className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-semibold bg-white hover:bg-opacity-80 ${exp.color.split(' ')[1]} border border-current border-opacity-30`}
            >
              ⬇ Download CSV
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-md p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3">Export Notes</h3>
        <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
          <li>Exports contain only live, real-time data from the database.</li>
          <li>All amounts are in the school's configured currency (₹ by default).</li>
          <li>Sensitive fields like passwords are never included in any export.</li>
          <li>Exports are audit-logged for data governance compliance.</li>
        </ul>
      </div>
    </div>
  );
}

export default DataExportPage;
