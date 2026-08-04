import { useState, useEffect, useRef } from "react";

interface NarratorProps {
  text: string;
  senderName?: string;
  recipientName?: string;
}

export function Narrator({ text, senderName, recipientName }: NarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(0);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const buildScript = () => {
    const parts: string[] = [];
    if (recipientName) parts.push(`${recipientName},`);
    parts.push(text);
    if (senderName) parts.push(`Com todo o meu amor, ${senderName}.`);
    return parts.join(" ");
  };

  const startProgressTimer = (durationMs: number) => {
    startTimeRef.current = Date.now();
    estimatedDurationRef.current = durationMs;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(pct);
      if (pct >= 100 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 200);
  };

  const handlePlay = () => {
    if (!supported) return;

    if (isPaused && utteranceRef.current) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      // resume timer
      const remaining = estimatedDurationRef.current - (Date.now() - startTimeRef.current);
      startProgressTimer(remaining > 0 ? remaining : 5000);
      return;
    }

    window.speechSynthesis.cancel();
    setProgress(0);

    const script = buildScript();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = "pt-BR";
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    // Tenta usar uma voz feminina suave em pt-BR
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoice =
      voices.find((v) => v.lang === "pt-BR" && v.name.toLowerCase().includes("female")) ||
      voices.find((v) => v.lang === "pt-BR") ||
      voices.find((v) => v.lang.startsWith("pt"));
    if (ptBrVoice) utterance.voice = ptBrVoice;

    // Estimativa: ~130 palavras por minuto na velocidade 0.88
    const wordCount = script.split(/\s+/).length;
    const estimatedMs = (wordCount / (130 * 0.88)) * 60 * 1000;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      startProgressTimer(estimatedMs);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(() => setProgress(0), 1500);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    // guarda o tempo decorrido para retomar o progresso
    const elapsed = Date.now() - startTimeRef.current;
    startTimeRef.current = Date.now() - elapsed;
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  if (!supported) return null;

  return (
    <div className="mt-8 rounded-2xl border border-wine/20 bg-gradient-to-br from-wine/5 to-wine/10 p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wine text-wine-foreground shadow-md text-lg">
          🔊
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Narrador de Voz</p>
          <p className="text-xs text-muted-foreground">Ouça a carta sendo lida em voz alta</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-wine/10">
        <div
          className="h-full rounded-full bg-wine transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!isPlaying && !isPaused && (
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-2 rounded-xl bg-wine px-5 py-2.5 text-sm font-semibold text-wine-foreground shadow-md transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <span className="text-base">▶</span> Ouvir Carta
          </button>
        )}

        {isPlaying && (
          <button
            type="button"
            onClick={handlePause}
            className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-md transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <span className="text-base">⏸</span> Pausar
          </button>
        )}

        {isPaused && (
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-2 rounded-xl bg-wine px-5 py-2.5 text-sm font-semibold text-wine-foreground shadow-md transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <span className="text-base">▶</span> Continuar
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            type="button"
            onClick={handleStop}
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-95 cursor-pointer"
          >
            <span className="text-base">⏹</span> Parar
          </button>
        )}

        <span className="ml-auto text-xs text-muted-foreground italic">
          {isPlaying ? "Narrando..." : isPaused ? "Pausado" : "Pronto para narrar"}
        </span>
      </div>
    </div>
  );
}
