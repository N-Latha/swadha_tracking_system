import React from 'react';

export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden py-10 md:py-14">
      <div
        className="absolute inset-0 bg-cover bg-center grayscale"
        style={{ backgroundImage: "url('/hero-alt.jpg')" }}
      />
      <div className="absolute inset-0 bg-swadha-dark/75" />
      <div className="relative max-w-6xl mx-auto px-4">
        <p className="text-swadha-green font-semibold tracking-[0.18em] uppercase text-xs md:text-sm mb-3">
          Swadha Foundation
        </p>
        <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-white/85 max-w-2xl text-base md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
