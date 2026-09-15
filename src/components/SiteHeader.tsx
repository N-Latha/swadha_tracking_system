import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Mail, Phone, Facebook, Linkedin, Instagram, Menu, X } from 'lucide-react';
import { SwadhaLogo } from './SwadhaLogo';
import { cn } from './ui';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-sm font-semibold uppercase tracking-wide transition-colors",
    isActive ? "text-swadha-orange" : "text-swadha-dark hover:text-swadha-orange"
  );

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const adminHref = typeof window !== 'undefined' && sessionStorage.getItem('adminToken')
    ? '/admin/dashboard'
    : '/admin/login';

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

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/student/login" className={navLinkClass}>Student Portal</NavLink>
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
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/student/login" className={navLinkClass} onClick={() => setOpen(false)}>Student Portal</NavLink>
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
    </header>
  );
}
