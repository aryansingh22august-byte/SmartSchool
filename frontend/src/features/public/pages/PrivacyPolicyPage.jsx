function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Privacy Policy</h1>
        <p className="mt-6 text-slate-600">Your privacy is important to us. Smart School collects only the information needed to provide a secure school management experience.</p>

        <section className="mt-10 space-y-8 text-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Information We Collect</h2>
            <p className="mt-3 leading-7">We collect details such as name, email, school, and role when you request contact or sign up for the system. Authentication tokens and session data are stored securely to protect access.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">How We Use Data</h2>
            <p className="mt-3 leading-7">Data is used to process contact requests, authenticate users, and enable role-based access for school administrators, teachers, students, and parents.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Third-Party Services</h2>
            <p className="mt-3 leading-7">We do not share personal contact details with unauthorized third parties. Any third-party services used for hosting or email are selected to maintain data security.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Security</h2>
            <p className="mt-3 leading-7">We use standard security practices such as encrypted password storage and protected API access to keep your school data safe.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
