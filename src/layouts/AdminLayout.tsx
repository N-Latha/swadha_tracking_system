import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Monitor, 
  Activity, 
  AlertTriangle, 
  History, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../components/ui';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

const navItems = [
  { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Machines', path: '/admin/machines', icon: Monitor },
  { name: 'Sessions', path: '/admin/sessions', icon: Activity },
  { name: 'Issues', path: '/admin/issues', icon: AlertTriangle },
  { name: 'History', path: '/admin/usage-history', icon: History },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/admin/login', { replace: true });
  };

  const current = navItems.find((item) => location.pathname.startsWith(item.path));
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f5]">
      <SiteHeader />

      <section className="bg-swadha-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-swadha-green text-xs font-semibold uppercase tracking-[0.2em] mb-2">Staff console</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">{current?.name ?? 'Overview'}</h1>
            <p className="text-white/70 text-sm mt-1">{today} · Bangalore centre</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">Centre Admin</p>
              <p className="text-xs text-white/60">admin@swadha.edu</p>
            </div>
            <span className="w-11 h-11 rounded-full bg-swadha-orange text-white font-heading font-bold flex items-center justify-center">
              A
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-black/5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-2 md:hidden">
            <span className="text-sm font-semibold">{current?.name}</span>
            <button onClick={() => setIsMenuOpen((v) => !v)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          <nav className={cn(
            "md:flex md:gap-1",
            isMenuOpen ? "flex flex-col pb-3" : "hidden md:flex"
          )}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => cn(
                  "inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-[3px] transition-colors",
                  isActive
                    ? "border-swadha-orange text-swadha-orange"
                    : "border-transparent text-swadha-gray hover:text-swadha-dark"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
          <Outlet />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
