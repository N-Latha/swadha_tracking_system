import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock } from 'lucide-react';
import { HeroCarousel, PhotoMarquee } from '../components/HeroCarousel';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <HeroCarousel />
      <PhotoMarquee />

      <section className="bg-white py-8 border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { src: '/icons/select.png', label: 'Select', detail: 'the deserving' },
            { src: '/icons/educate.png', label: 'Educate', detail: 'with access' },
            { src: '/icons/enhance.png', label: 'Enhance', detail: 'skills & confidence' },
            { src: '/icons/employ.png', label: 'Employ', detail: 'for brighter futures' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 py-2">
              <img src={item.src} alt="" className="w-16 h-16 object-contain" />
              <h3 className="font-heading font-bold text-swadha-dark uppercase tracking-wide text-sm">{item.label}</h3>
              <p className="text-xs text-swadha-gray">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-swadha-light py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-swadha-orange font-semibold tracking-[0.18em] uppercase text-xs text-center mb-2">Access</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-swadha-dark text-center mb-3">
            Machine Usage Portals
          </h2>
          <p className="text-center text-swadha-gray max-w-2xl mx-auto mb-10">
            Students check in to start a session. Administrators monitor machines, issues, and usage across centres.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/student/login')}
              className="text-left bg-white p-8 shadow-md hover:shadow-lg border-t-4 border-t-swadha-green transition-shadow group"
            >
              <div className="w-14 h-14 rounded-full bg-green-50 text-swadha-greenDark flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-swadha-dark mb-2">Student Portal</h3>
              <p className="text-sm text-swadha-gray leading-relaxed mb-6">
                Log machine usage, track your session time, and report issues when a computer needs attention.
              </p>
              <span className="inline-flex bg-swadha-orange text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm">
                Know more
              </span>
            </button>

            <button
              onClick={() => navigate('/admin/login')}
              className="text-left bg-white p-8 shadow-md hover:shadow-lg border-t-4 border-t-swadha-orange transition-shadow group"
            >
              <div className="w-14 h-14 rounded-full bg-orange-50 text-swadha-orange flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-swadha-dark mb-2">Admin Portal</h3>
              <p className="text-sm text-swadha-gray leading-relaxed mb-6">
                Manage machines, view live sessions, resolve issues, and review usage analytics across the lab.
              </p>
              <span className="inline-flex bg-swadha-orange text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm">
                Know more
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-swadha-orange font-semibold tracking-[0.18em] uppercase text-xs text-center mb-2">Impact</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-swadha-dark mb-10">Our Success</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: '350+', t: 'Swadha-funded students have pursued graduation so far.' },
              { n: '80%', t: 'of pass-outs have found white-collared jobs.' },
              { n: '200', t: 'rural junior colleges partner with the foundation.' },
            ].map((stat) => (
              <div key={stat.n} className="text-center px-4">
                <p className="font-heading text-5xl font-bold text-swadha-orange mb-3">{stat.n}</p>
                <p className="text-swadha-gray text-sm leading-relaxed">{stat.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
