import React, { useState, useEffect } from 'react';

interface SessionTimerProps {
  startTime: string;
}

export function SessionTimer({ startTime }: SessionTimerProps) {
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    
    // Initial calculation
    setDuration(Math.floor((Date.now() - start) / 1000));

    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [hours, minutes, seconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  return (
    <div className="text-4xl font-mono font-bold text-slate-800 tracking-wider">
      {formatDuration(duration)}
    </div>
  );
}
