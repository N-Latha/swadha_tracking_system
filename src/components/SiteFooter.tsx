import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { SwadhaLogo } from './SwadhaLogo';

export function SiteFooter() {
  return (
    <footer className="bg-swadha-dark text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <SwadhaLogo className="h-14 w-auto mb-4" />
          <p className="text-white/70 text-sm leading-relaxed">
            Transforming lives of underprivileged youngsters by providing access to education.
          </p>
          <a href="mailto:info@swfn.org" className="mt-4 inline-flex items-center gap-2 text-swadha-green text-sm font-medium">
            <Mail className="w-4 h-4" />
            info@swfn.org
          </a>
        </div>

        <div>
          <h3 className="text-swadha-orange font-heading font-semibold tracking-widest text-sm mb-4">MENU</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/student/login" className="hover:text-white">Student Portal</Link></li>
            <li><Link to="/admin/login" className="hover:text-white">Admin Portal</Link></li>
            <li><a href="https://swfn.org/what-we-do/" target="_blank" rel="noreferrer" className="hover:text-white">What we do</a></li>
            <li><a href="https://swfn.org/about-us/" target="_blank" rel="noreferrer" className="hover:text-white">About us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-swadha-orange font-heading font-semibold tracking-widest text-sm mb-4">HEAD OFFICE</h3>
          <p className="text-sm text-white/80 leading-relaxed flex gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-swadha-green" />
            5041, 4th Floor, Tower 5, One Bangalore West, 1 Rajkumar Road, Rajaji Nagar, Bangalore 560010
          </p>
        </div>

        <div>
          <h3 className="text-swadha-orange font-heading font-semibold tracking-widest text-sm mb-4">FIELD OFFICES</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li>Housing Board Colony, Ananthapuramu 515001</li>
            <li>GSO Complex, S S Puram, Tumkuru 572102</li>
            <li>c/o Kate hospital, Pratapnagar, Nagpur 440022</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="max-w-6xl mx-auto px-4 py-4 text-xs text-white/50">
          Copyright © {new Date().getFullYear()} Swadha Foundation. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
