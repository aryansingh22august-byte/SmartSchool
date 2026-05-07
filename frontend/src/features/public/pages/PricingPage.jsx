function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-[32px] bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">Pricing</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Simple plans for schools of every size.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Choose the Smart School package that fits your team, from growing primary schools to large institutions.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              name: 'Starter',
              price: '₹6999',
              description: 'For small schools that need admissions, attendance, and simple reporting. Price inclusive of GST.',
              features: ['Role-based access', 'Student management', 'Notifications']
            },
            {
              name: 'Growth',
              price: '₹12999',
              description: 'The best fit for schools that want full admin, teacher, and parent workflows. Price inclusive of GST.',
              features: ['Fees management', 'Exam reports', 'Mobile-ready dashboard']
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              description: 'Advanced setup with priority support, school partitioning, and custom onboarding.',
              features: ['Dedicated support', 'Custom roles', 'Data migration assistance']
            }
          ].map((plan) => (
            <div key={plan.name} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">{plan.name}</p>
              <p className="mt-6 text-4xl font-semibold text-slate-900">{plan.price}</p>
              <p className="mt-4 text-slate-600">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">Choose plan</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
