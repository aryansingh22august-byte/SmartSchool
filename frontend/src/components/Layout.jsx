import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getTokenRole } from '../utils/auth.js';
import { NAV_ITEMS } from '../data/roles.js';

function Layout() {
  const navigate = useNavigate();
  const role = getTokenRole();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-slate-900 text-slate-100">
          <div className="border-b border-slate-800 px-6 py-6 text-2xl font-semibold">Smart School</div>
          <nav className="space-y-1 px-4 py-4">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-6 py-6">
          <header className="mb-6 flex items-center justify-between rounded-3xl bg-white p-5 shadow-sm">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">School Management Console</h1>
              <p className="text-sm text-slate-500">Access school administration on a single dashboard.</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('school_erp_token');
                navigate('/');
              }}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Sign Out
            </button>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
