import React from 'react';
import { cn } from './ui';

export function SwadhaLogo({ className = "h-16 w-auto" }: { className?: string }) {
  return (
    <img
      src="/swadha-logo.png"
      alt="Swadha Foundation"
      className={cn("object-contain", className)}
    />
  );
}
