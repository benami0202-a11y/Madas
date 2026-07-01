import { useEffect, useRef, useState } from 'react';

/** Animates a number counting up from its previous value to `target` over `durationMs`. */
export function useAnimatedCounter(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      const current = from + (target - from) * eased;
      setValue(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}
