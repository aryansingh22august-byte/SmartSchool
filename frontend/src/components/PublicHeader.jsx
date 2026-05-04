import { Link } from 'react-router-dom';

function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link to="/" className="text-xl font-semibold text-slate-900">Smart School</Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <Link to="/about" className="hover:text-slate-900">About</Link>
          <Link to="/pricing" className="hover:text-slate-900">Pricing</Link>
          <Link to="/faq" className="hover:text-slate-900">FAQ</Link>
          <Link to="/contact" className="hover:text-slate-900">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-2xl border border-slate-300 bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;
