import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ROLE_OPTIONS = ['Super Admin', 'School Admin', 'Teacher', 'Student', 'Parent'];

function LandingPage() {
  const [contact, setContact] = useState({ fullName: '', email: '', schoolName: '', role: 'School Admin', message: '' });
  const [status, setStatus] = useState({ success: '', error: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ success: '', error: '' });
    setSubmitting(true);

    try {
      await api.post('/contact', contact);
      setStatus({ success: 'Thanks! Your request has been submitted. We will reach out shortly.', error: '' });
      setContact({ fullName: '', email: '', schoolName: '', role: 'School Admin', message: '' });
    } catch (err) {
      setStatus({ success: '', error: err.response?.data?.message || 'Unable to send your request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.45),transparent_45%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl lg:max-w-xl">
            <p className="mb-4 inline-flex rounded-full bg-slate-700/70 px-4 py-2 text-sm font-medium text-sky-300">
              Empower every school role with one system
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Smart School ERP for modern schools, mobile-ready and role-aware.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-200 sm:text-xl">
              Manage admissions, fees, attendance, exams, and communication from one secure platform designed for admins, teachers, parents, and students.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Request a Demo
              </Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Explore Features
              </a>
            </div>
          </div>

          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/95 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-10">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Connect with Smart School</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Start your onboarding request</h2>
              <p className="mt-2 text-sm text-slate-600">Fill your details and our team will contact you with pricing and setup help.</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  name="fullName"
                  value={contact.fullName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">School Name</label>
                <input
                  name="schoolName"
                  value={contact.schoolName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Your Role</label>
                <select
                  name="role"
                  value={contact.role}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  name="message"
                  value={contact.message}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
              {status.success && <p className="text-sm text-green-600">{status.success}</p>}
              {status.error && <p className="text-sm text-red-600">{status.error}</p>}
            </form>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">Platform Features</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">All the tools your school needs in one responsive system.</h2>
          <p className="mt-4 text-slate-600">From admissions to parent communication, Smart School combines every core workflow into a mobile-ready ERP experience.</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: 'Role-based access & security',
              description: 'Control admin, teacher, student, and parent access with precise role permissions and a secure login experience.'
            },
            {
              icon: (
                <svg className="h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.588m-9.268 5.14a9.094 9.094 0 003.741.479 2.998 2.998 0 005.682-2.72M7.963 5.874a11.959 11.959 0 01-3.741.479 3 3 0 00-4.682 2.72 11.945 11.945 0 013.741 3.198m9.268-5.14A5.971 5.971 0 0012 5.874m0 0a5.995 5.995 0 00-5.874 3.198" />
                </svg>
              ),
              title: 'Admissions & student management',
              description: 'Track inquiries, enroll students, and manage student profiles from one dashboard.'
            },
            {
              icon: (
                <svg className="h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-3h6m-6 3a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              ),
              title: 'Fees, attendance & exams',
              description: 'Handle billing, attendance records, and exam reports with easy-to-use workflows.'
            }
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                {item.icon}
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="why" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-8 w-8 text-sky-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 16.5h3" />
                  </svg>
                ),
                title: 'Mobile ready dashboards',
                detail: 'Access schedules, attendance, and messages from any mobile device with responsive layouts.'
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-sky-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15" />
                  </svg>
                ),
                title: 'Quick teacher workflows',
                detail: 'Teachers can manage classes, submit attendance, and update grades seamlessly on the go.'
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-sky-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.588m-9.268 5.14a9.094 9.094 0 003.741.479 2.998 2.998 0 005.682-2.72M7.963 5.874a11.959 11.959 0 01-3.741.479 3 3 0 00-4.682 2.72 11.945 11.945 0 013.741 3.198m9.268-5.14A5.971 5.971 0 0012 5.874m0 0a5.995 5.995 0 00-5.874 3.198" />
                  </svg>
                ),
                title: 'Parent connectivity',
                detail: 'Parents can review student progress, attendance, and exam results from a compact mobile view.'
              }
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-slate-800 p-8 shadow-lg shadow-slate-950/20">
                <div className="flex items-center gap-4">
                  {item.icon}
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Why Smart School</h3>
            <p className="mt-4 text-slate-600">A unified education ERP with fast setup, secure role access, and mobile-first usability for schools of every size.</p>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Trusted by school teams</h3>
            <p className="mt-4 text-slate-600">Designed for administrators, teachers, parents, and students to collaborate through every academic process.</p>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Complete data visibility</h3>
            <p className="mt-4 text-slate-600">Consolidated insights on fees, attendance, exams, and messages help your school stay organized and proactive.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
