import { useEffect, useState } from 'react';

export interface CountdownParts {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function diffToParts(target: Date): CountdownParts {
  const totalSecs = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  return {
    days: Math.floor(totalSecs / 86400),
    hours: Math.floor((totalSecs % 86400) / 3600),
    mins: Math.floor((totalSecs % 3600) / 60),
    secs: totalSecs % 60,
  };
}

export function useCountdown(target: Date): CountdownParts {
  const [parts, setParts] = useState(() => diffToParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(diffToParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}
