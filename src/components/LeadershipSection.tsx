import React, { useState } from 'react';
import { Linkedin, Award, UserCheck, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface Leader {
  id: string;
  name: string;
  role: string;
  aka?: string;
  description: string;
  images: string[];
  linkedin?: string;
  badgeTone: string;
  avatarBg: string;
  accentColor: string;
  initials: string;
}

const LEADERS: Leader[] = [
  {
    id: 'rajesh',
    name: 'Rajesh Mandyam',
    role: 'Managing Trustee',
    description: 'Guiding the foundation’s vision, operations, and student outreach across rural colleges.',
    images: [
      '/team/rajesh-mandyam.png',
      '/team/rajesh-mandyam.jpg',
      'https://svpindia.org/wp-content/uploads/2021/12/Rajesh-Mandyam-Swadha.png'
    ],
    badgeTone: 'bg-orange-50 text-swadha-orange border-orange-200',
    avatarBg: 'from-amber-600 to-orange-700',
    accentColor: 'border-t-swadha-orange',
    initials: 'RM'
  },
  {
    id: 'ramnarayanan',
    name: 'Ramnarayanan Srinivasan',
    role: 'Trustee',
    description: 'Leading operational rollout and institutional partnerships. 30+ yrs in IT (Infosys) & former scientist at ISRO.',
    images: [
      '/team/ramnarayanan-srinivasan.png',
      '/team/ramnarayanan-srinivasan.jpg'
    ],
    badgeTone: 'bg-green-50 text-swadha-greenDark border-green-200',
    avatarBg: 'from-emerald-600 to-teal-800',
    accentColor: 'border-t-swadha-green',
    initials: 'RS'
  },
  {
    id: 'ravi',
    name: 'Ravi Subramanian',
    role: 'Skilling Director',
    aka: 'Subramanian Sir',
    description: 'Heading technical skilling courses, computer lab readiness, and career mentoring for all Swadha students.',
    images: [
      '/team/ravi-subramanian.png',
      '/team/ravi-subramanian.jpg'
    ],
    linkedin: 'https://in.linkedin.com/in/ravisub',
    badgeTone: 'bg-blue-50 text-swadha-blue border-blue-200',
    avatarBg: 'from-blue-600 to-indigo-800',
    accentColor: 'border-t-swadha-blue',
    initials: 'RS'
  }
];

function LeaderPhoto({ leader }: { leader: Leader }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgIndex < leader.images.length - 1) {
      setImgIndex(imgIndex + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError || leader.images.length === 0) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${leader.avatarBg} text-white p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl font-heading font-extrabold shadow-inner mb-3">
            {leader.initials}
          </div>
          <p className="font-heading font-bold text-lg text-white drop-shadow-sm">{leader.name}</p>
          <p className="text-xs text-white/80 font-medium uppercase tracking-wider mt-1">{leader.role}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={leader.images[imgIndex]}
      alt={leader.name}
      onError={handleError}
      className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500 ease-out"
    />
  );
}

export function LeadershipSection() {
  return (
    <section className="bg-white py-16 md:py-24 border-t border-black/5 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#F26F2B_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-swadha-orange px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-[0.18em] mb-3">
            <Sparkles className="w-3 h-3" />
            Leadership & Guidance
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-swadha-dark mb-3">
            Our Mentors & Trustees
          </h2>
          <p className="text-swadha-gray text-sm md:text-base leading-relaxed">
            The dedicated leaders empowering rural students with digital access, hands-on skilling courses, and career mentorship.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {LEADERS.map((leader, index) => (
            <div
              key={leader.id}
              className={`group relative bg-white border border-black/10 rounded-sm p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2.5 flex flex-col justify-between border-t-4 ${leader.accentColor}`}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Photo Container with animated border and hover zoom */}
              <div className="relative mb-5 overflow-hidden rounded-sm bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center shadow-inner">
                <LeaderPhoto leader={leader} />

                {/* Floating Role Tag on Photo */}
                {leader.aka && (
                  <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1.5 border border-white/20">
                    <Award className="w-3.5 h-3.5 text-swadha-orange" />
                    <span>{leader.aka}</span>
                  </div>
                )}
              </div>

              {/* Leader Info */}
              <div className="text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-swadha-dark group-hover:text-swadha-orange transition-colors">
                    {leader.name}
                  </h3>

                  <div className="mt-1.5 mb-3.5">
                    <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${leader.badgeTone} shadow-xs`}>
                      {leader.role}
                    </span>
                  </div>

                  <p className="text-xs text-swadha-gray leading-relaxed mb-4">
                    {leader.description}
                  </p>
                </div>

                {/* LinkedIn / Organization Link */}
                {leader.linkedin ? (
                  <div className="mt-3 pt-3.5 border-t border-slate-100">
                    <a
                      href={leader.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-[#0A66C2] bg-blue-50/70 hover:bg-[#0A66C2] hover:text-white rounded-sm transition-all duration-300 shadow-xs group/link"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>Connect on LinkedIn</span>
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
                    </a>
                  </div>
                ) : (
                  <div className="mt-3 pt-3.5 border-t border-slate-100">
                    <span className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold py-2">
                      <ShieldCheck className="w-4 h-4 text-swadha-green" />
                      <span>Swadha Foundation</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
