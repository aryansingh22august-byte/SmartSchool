function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[32px] bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">FAQ</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Frequently asked questions</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Answers to common questions about Smart School ERP and how to get started.</p>
        </div>

        <div className="grid gap-6">
          {[
            {
              question: 'Can teachers access the system from mobile devices?',
              answer: 'Yes, Smart School is designed to be mobile-friendly so teachers can view timetables, submit attendance, and communicate from any device.'
            },
            {
              question: 'Can parents see exam reports and attendance?',
              answer: 'Yes. Parents have a dedicated role view that shows student progress, attendance records, and exam information.'
            },
            {
              question: 'Is user access role-based?',
              answer: 'Absolutely. The platform supports super-admin, admin, teacher, student, and parent roles with permissions scoped to each profile.'
            },
            {
              question: 'Can this system handle multiple campuses?',
              answer: 'Yes, the backend is built to support school-specific data and additional campuses with a clean tenant-aware design.'
            }
          ].map((item) => (
            <div key={item.question} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{item.question}</h2>
              <p className="mt-4 text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
