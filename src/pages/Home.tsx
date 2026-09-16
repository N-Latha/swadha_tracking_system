import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Power, PlayCircle } from 'lucide-react';
import { HeroCarousel, PhotoMarquee } from '../components/HeroCarousel';
import { Button, Modal } from '../components/ui';
import { Session } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

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
  }, []);

  const handleConfirmEndSession = () => {
    setIsEndModalOpen(false);
    navigate('/student/condition');
  };

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

          {/* Active Session Alert Banner for Students */}
          {activeSession && (
            <div className="bg-white border-2 border-emerald-500 rounded-sm shadow-lg p-6 max-w-4xl mx-auto mb-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    Active Session in Progress
                  </div>
                  <h3 className="font-heading text-xl font-bold text-swadha-dark">
                    Machine: <span className="text-emerald-700">{activeSession.machineId}</span> &bull; Student: <span className="text-swadha-dark">{activeSession.studentId}</span>
                  </h3>
                  <p className="text-sm text-swadha-gray">
                    Purpose: <span className="capitalize font-medium text-slate-700">{activeSession.purpose.replace('_', ' ').toLowerCase()}</span> &bull; Started at {new Date(activeSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <Button
                    onClick={() => navigate('/student/session')}
                    className="flex-1 md:flex-initial bg-swadha-green hover:bg-swadha-greenDark text-white gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Resume Session
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsEndModalOpen(true)}
                    className="flex-1 md:flex-initial gap-2"
                  >
                    <Power className="w-4 h-4" />
                    End Session
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 shadow-md hover:shadow-lg border-t-4 border-t-swadha-green transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-full bg-green-50 text-swadha-greenDark flex items-center justify-center mb-5">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-xl font-bold text-swadha-dark">Student Portal</h3>
                  {activeSession && (
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      In Session
                    </span>
                  )}
                </div>
                <p className="text-sm text-swadha-gray leading-relaxed mb-6">
                  {activeSession
                    ? `You have an active session running on ${activeSession.machineId}. You can resume tracking or end your session.`
                    : 'Log machine usage, track your session time, and report issues when a computer needs attention.'}
                </p>
              </div>

              {activeSession ? (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => navigate('/student/session')}
                    className="inline-flex items-center gap-1.5 bg-swadha-orange hover:bg-swadha-orangeDark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    Resume Session
                  </button>
                  <button
                    onClick={() => setIsEndModalOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors"
                  >
                    <Power className="w-3.5 h-3.5" />
                    End Session
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => navigate('/student/login')}
                    className="inline-flex bg-swadha-orange hover:bg-swadha-orangeDark text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors"
                  >
                    Student Check-in
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-8 shadow-md hover:shadow-lg border-t-4 border-t-swadha-orange transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-full bg-orange-50 text-swadha-orange flex items-center justify-center mb-5">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-swadha-dark mb-2">Admin Portal</h3>
                <p className="text-sm text-swadha-gray leading-relaxed mb-6">
                  Manage machines, view live sessions, resolve issues, and review usage analytics across the lab.
                </p>
              </div>
              <div>
                <button
                  onClick={() => navigate('/admin/login')}
                  className="inline-flex bg-swadha-orange hover:bg-swadha-orangeDark text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors"
                >
                  Admin Check-in
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal for Ending Session */}
      <Modal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        title="End Machine Session?"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to end your active session on <strong className="text-slate-900">{activeSession?.machineId}</strong>?
          You will be directed to confirm machine condition before completing.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setIsEndModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmEndSession} className="gap-2">
            <Power className="w-4 h-4" />
            End Session
          </Button>
        </div>
      </Modal>

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
