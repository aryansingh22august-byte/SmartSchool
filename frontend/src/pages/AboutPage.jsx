import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[32px] bg-white p-10 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">About Smart School</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">A smarter ERP system built for every school role.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Smart School brings administration, teaching, student tracking, and parent communication together in one modern platform. It is designed for school leaders who want a fast, mobile-ready experience without sacrificing security or control.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Admin-first control',
              description: 'Super admins and school admins can manage users, roles, fees, and admissions from one dashboard.'
            },
            {
              title: 'Teacher productivity',
              description: 'Teachers can submit attendance, review class schedules, and communicate with parents quickly.'
            },
            {
              title: 'Parent and student access',
              description: 'Parents and students see the right information, including timetables, exam reports, and notices.'
            }
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-4 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Ready to connect with your school community?</h2>
          <p className="mt-4 text-slate-600">Create a single platform for teachers, students, parents, and staff to collaborate, track progress, and stay informed.</p>
          <Link to="/contact" className="mt-8 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
