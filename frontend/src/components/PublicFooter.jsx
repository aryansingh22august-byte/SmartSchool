import { Link } from 'react-router-dom';

function PublicFooter() {
  return (
    <footer className="border-t border-slate-200/10 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">Smart School</p>
          <p className="mt-2 max-w-md text-sm text-slate-400">A full-featured ERP for schools with modern role-based workflows and mobile-ready access.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/pricing" className="hover:text-white">Pricing</Link>
          <Link to="/faq" className="hover:text-white">FAQ</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
