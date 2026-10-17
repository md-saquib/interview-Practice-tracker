import { NavLink, Outlet } from 'react-router-dom';
import { APP_NAME } from '../shared/constants/index.js';
import { Briefcase, BriefcaseBusiness } from 'lucide-react'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/activities', label: 'Activities' },
];


export default function DashboardLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Navigation bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <nav
          className="w-full px-4 sm:px-6 flex items-center justify-between h-14"
          aria-label="Main navigation"
        >
          {/* Logo / App name */}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-blue-600 font-bold text-base shrink-0"
            aria-label={`${APP_NAME} – go to dashboard`}
          >
            <BriefcaseBusiness />
            <span className="hidden sm:inline truncate max-w-[160px]">{APP_NAME}</span>
            <span className="sm:hidden">IPT</span>
          </NavLink>

          {/* Nav links */}
          <ul className="flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                     ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main content area — child routes render here */}
      <main className="w-full px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
