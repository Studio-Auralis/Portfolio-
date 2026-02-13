import { useCallback, useRef } from 'react';

const MAX_MESSAGES = 10;
const WINDOW_MS = 60_000;

export function useRateLimit() {
  const timestamps = useRef<number[]>([]);

  const checkLimit = useCallback((): boolean => {
    const now = Date.now();
    timestamps.current = timestamps.current.filter(
      (t) => now - t < WINDOW_MS
    );
    if (timestamps.current.length >= MAX_MESSAGES) {
      return false;
    }
    timestamps.current.push(now);
    return true;
  }, []);

  return { checkLimit };
}
