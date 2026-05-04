import { useState } from 'react';
import api from '../api';

const ROLE_OPTIONS = ['Super Admin', 'School Admin', 'Teacher', 'Student', 'Parent'];

function ContactPage() {
  const [form, setForm] = useState({ fullName: '', email: '', schoolName: '', role: 'School Admin', message: '' });
  const [status, setStatus] = useState({ success: '', error: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ success: '', error: '' });
    setSubmitting(true);

    try {
      await api.post('/contact', form);
      setStatus({ success: 'Your request has been submitted. We will contact you soon.', error: '' });
      setForm({ fullName: '', email: '', schoolName: '', role: 'School Admin', message: '' });
    } catch (err) {
      setStatus({ success: '', error: err.response?.data?.message || 'Unable to submit request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[32px] bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-semibold text-slate-900">Contact Smart School</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Send us your details and we will help you set up the right plan for your school.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[32px] bg-white p-10 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">School Name</label>
                <input
                  name="schoolName"
                  value={form.schoolName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Your Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
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
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              {status.success && <p className="text-sm text-green-600">{status.success}</p>}
              {status.error && <p className="text-sm text-red-600">{status.error}</p>}
            </form>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Get in touch</h2>
            <p className="mt-4 text-slate-600">Have questions about implementation, pricing, or user roles? Our team is ready to help.</p>
            <div className="mt-8 space-y-6 text-slate-700">
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p>support@smartschool.local</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Location</p>
                <p>Online school management platform</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Response time</p>
                <p>Usually within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
