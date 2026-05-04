function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Terms of Service</h1>
        <p className="mt-6 text-slate-600">These terms govern the use of Smart School. By using the platform, you agree to follow the policies and use the system responsibly.</p>

        <section className="mt-10 space-y-8 text-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">User Responsibilities</h2>
            <p className="mt-3 leading-7">Users must provide accurate information and use the platform only for legitimate school-related activities.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Account Access</h2>
            <p className="mt-3 leading-7">School admins, teachers, students, and parents are responsible for the security of their login credentials.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Content Use</h2>
            <p className="mt-3 leading-7">Content entered into the system should comply with school policies and applicable laws. Unauthorized or harmful content is not permitted.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Limitations</h2>
            <p className="mt-3 leading-7">Smart School is provided as-is. We are not liable for indirect damages, and we may update the service to improve security and functionality.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TermsPage;
