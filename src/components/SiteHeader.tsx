import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone, Facebook, Linkedin, Instagram, Menu, X, Power, PlayCircle } from 'lucide-react';
import { SwadhaLogo } from './SwadhaLogo';
import { cn, Button, Modal } from './ui';
import { Session } from '../types';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-sm font-semibold uppercase tracking-wide transition-colors",
    isActive ? "text-swadha-orange" : "text-swadha-dark hover:text-swadha-orange"
  );

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith('/admin');
  const adminHref = typeof window !== 'undefined' && sessionStorage.getItem('adminToken')
    ? '/admin/dashboard'
    : '/admin/login';

  useEffect(() => {
    const checkSession = () => {
      try {
        const stored = sessionStorage.getItem('currentSession');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.status === 'ACTIVE') {
            setActiveSession(parsed);
            return;
          }
        }
      } catch (e) {}
      setActiveSession(null);
    };

    checkSession();
  }, [location.pathname]);

  const handleConfirmEndSession = () => {
    setShowEndModal(false);
    setOpen(false);
    navigate('/student/condition');
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-swadha-green text-white">
        <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <a href="mailto:info@swfn.org" className="inline-flex items-center gap-2 hover:opacity-90">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">info@swfn.org</span>
            </a>
            <span className="hidden sm:block w-px h-4 bg-white/40" />
            <a href="tel:+916366908474" className="inline-flex items-center gap-2 hover:opacity-90">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+91 63669 08474</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/swadhafoundation/" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:opacity-80">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/swadha-foundation/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:opacity-80">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/swadhafoundation/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:opacity-80">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-black/5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-[76px] flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <SwadhaLogo className="h-12 md:h-14 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to={activeSession ? "/student/session" : "/student/login"} className={navLinkClass}>
              {activeSession ? "Active Session" : "Student Portal"}
            </NavLink>
            <Link
              to={adminHref}
              className={cn(
                "text-sm font-semibold uppercase tracking-wide transition-colors",
                isAdmin ? "text-swadha-orange" : "text-swadha-dark hover:text-swadha-orange"
              )}
            >
              Admin
            </Link>
            <a href="https://swfn.org/about-us/" target="_blank" rel="noreferrer" className="text-sm font-semibold uppercase tracking-wide text-swadha-dark hover:text-swadha-orange">
              About us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Active Session Desktop Quick Actions */}
            {activeSession && (
              <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-300 rounded-sm px-3 py-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold text-emerald-900">
                  {activeSession.machineId} ({activeSession.studentId})
                </span>
                <Link
                  to="/student/session"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline ml-1"
                >
                  View
                </Link>
                <button
                  onClick={() => setShowEndModal(true)}
                  className="ml-2 flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm transition-colors"
                >
                  <Power className="w-3 h-3" />
                  End Session
                </button>
              </div>
            )}

            <button
              className="md:hidden text-swadha-dark p-1"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-black/5 bg-white px-4 py-4 flex flex-col gap-3">
            {activeSession && (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-sm mb-2 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Session: {activeSession.machineId}
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">Student ID: {activeSession.studentId}</div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowEndModal(true);
                  }}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-sm"
                >
                  <Power className="w-3 h-3" />
                  End Session
                </button>
              </div>
            )}
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to={activeSession ? "/student/session" : "/student/login"} className={navLinkClass} onClick={() => setOpen(false)}>
              {activeSession ? "Active Session" : "Student Portal"}
            </NavLink>
            <Link
              to={adminHref}
              onClick={() => setOpen(false)}
              className={cn(
                "text-sm font-semibold uppercase tracking-wide",
                isAdmin ? "text-swadha-orange" : "text-swadha-dark"
              )}
            >
              Admin
            </Link>
            <a href="https://swfn.org/about-us/" target="_blank" rel="noreferrer" className="text-sm font-semibold uppercase tracking-wide text-swadha-dark">
              About us
            </a>
          </nav>
        )}
      </div>

      {/* Header Confirmation Modal for Ending Session */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="End Machine Session?"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to end your active session on <strong className="text-slate-900">{activeSession?.machineId}</strong>?
          You will confirm the machine condition before exiting so another student can login.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setShowEndModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmEndSession} className="gap-2">
            <Power className="w-4 h-4" />
            End Session
          </Button>
        </div>
      </Modal>
    </header>
  );
}
