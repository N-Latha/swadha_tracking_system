import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    src: '/slides/slide-1.jpg',
    title: 'Talent is Universal',
    subtitle: 'Opportunities should be too',
  },
  {
    src: '/slides/slide-2.jpg',
    title: 'Higher Education is a basic right',
    subtitle: 'Every child should be entitled to it',
  },
  {
    src: '/slides/slide-4.jpg',
    title: 'Education is a battle against poverty',
    subtitle: 'That we should fight together',
  },
  {
    src: '/slides/slide-5.jpg',
    title: 'Select the deserving',
    subtitle: 'Educate. Enhance. Employ.',
  },
  {
    src: '/slides/slide-6.jpg',
    title: 'Common machines. Shared futures.',
    subtitle: 'Fair access to computers at every Swadha centre',
  },
  {
    src: '/hero.jpg',
    title: 'From classroom to career',
    subtitle: 'Tracking usage so every student gets their turn',
  },
];

export function HeroCarousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="relative h-[520px] md:h-[620px] overflow-hidden bg-swadha-dark">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src + i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={slide.src}
            alt=""
            key={i === index ? `${slide.src}-active` : slide.src}
            className={`absolute inset-0 w-full h-full object-cover ${i === index ? 'hero-kenburns' : 'scale-105'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-swadha-dark/80 via-swadha-dark/50 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-swadha-orange leading-tight max-w-2xl">
          {SLIDES[index].title}
        </h1>
        <p className="mt-4 text-swadha-green font-semibold tracking-[0.12em] uppercase text-sm md:text-base max-w-xl">
          {SLIDES[index].subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/student/login')}
            className="bg-swadha-orange hover:bg-swadha-orangeDark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors"
          >
            Student check-in
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="bg-white text-swadha-dark hover:bg-swadha-light text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors"
          >
            Know more
          </button>
        </div>
      </div>

      <button
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 text-white flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 text-white flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-swadha-orange' : 'w-2.5 bg-white/60'}`}
          />
        ))}
      </div>
    </section>
  );
}

const MARQUEE = [
  '/slides/slide-1.jpg',
  '/slides/slide-2.jpg',
  '/slides/slide-4.jpg',
  '/slides/slide-5.jpg',
  '/slides/slide-6.jpg',
  '/slides/slide-7.jpg',
  '/slides/slide-8.png',
  '/hero.jpg',
  '/hero-alt.jpg',
];

export function PhotoMarquee() {
  const photos = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden bg-white border-y border-black/5 py-4">
      <div className="photo-marquee flex w-max gap-4">
        {photos.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt="Swadha Foundation"
            className="h-36 md:h-44 w-56 md:w-72 object-cover rounded-sm shrink-0"
          />
        ))}
      </div>
    </div>
  );
}
