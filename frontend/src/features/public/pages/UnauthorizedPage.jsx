import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Access Denied</h1>
        <p className="mt-4 text-slate-600">You do not have permission to access this page.</p>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
