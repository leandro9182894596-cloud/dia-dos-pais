import { useEffect, useState } from "react";
import { getTimeRemainingParts } from "../lib/storage";

interface ExpirationBannerProps {
  createdAt: number;
  onExpire?: () => void;
}

export function ExpirationBanner({ createdAt, onExpire }: ExpirationBannerProps) {
  const EXPIRATION_MS = 24 * 60 * 60 * 1000;
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    Math.max(0, EXPIRATION_MS - (Date.now() - createdAt))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, EXPIRATION_MS - (Date.now() - createdAt));
      setRemainingMs(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [createdAt, onExpire]);

  const { hours, minutes, seconds } = getTimeRemainingParts(remainingMs);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="sticky top-0 z-40 flex items-center justify-center bg-wine/90 px-4 py-2 text-center text-xs font-medium uppercase tracking-widest text-gold shadow-md backdrop-blur-md">
      <span className="mr-2">⏱ Homenagem Válida por 24h · Tempo Restante:</span>
      <span className="font-mono text-sm font-bold text-cream">
        {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
      </span>
    </div>
  );
}
