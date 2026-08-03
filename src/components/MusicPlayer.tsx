import { useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  musicUrl?: string;
  autoPlayTrigger?: boolean;
  ducked?: boolean;
}

const DEFAULT_MUSIC_URL = "/musica-romantica.mp3";
const NORMAL_VOLUME = 0.5;
const DUCKED_VOLUME = 0.08;
const FADE_STEPS = 20;
const FADE_INTERVAL_MS = 40;

export function MusicPlayer({ musicUrl, autoPlayTrigger, ducked }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSrc = musicUrl || DEFAULT_MUSIC_URL;

  const fadeTo = (targetVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    const start = audio.volume;
    const diff = targetVolume - start;
    let step = 0;
    fadeRef.current = setInterval(() => {
      step++;
      audio.volume = Math.min(1, Math.max(0, start + (diff * step) / FADE_STEPS));
      if (step >= FADE_STEPS && fadeRef.current) {
        clearInterval(fadeRef.current);
      }
    }, FADE_INTERVAL_MS);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = NORMAL_VOLUME;
  }, []);

  // Fade quando o narrador começa/para
  useEffect(() => {
    fadeTo(ducked ? DUCKED_VOLUME : NORMAL_VOLUME);
  }, [ducked]);

  // Whenever autoPlayTrigger becomes true (e.g. user clicked on the gift box)
  useEffect(() => {
    if (!autoPlayTrigger) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => setPlaying(true))
      .catch((err) => console.warn("Erro de reprodução de áudio:", err));
  }, [autoPlayTrigger]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={activeSrc} loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar música romântica" : "Tocar música romântica"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-rose px-4 py-3 text-rose-foreground shadow-lg shadow-wine/20 transition-transform hover:scale-105 active:scale-95"
      >
        <span className={playing ? "animate-pulse text-lg" : "text-lg"}>
          {playing ? "♪" : "♫"}
        </span>
        <span className="text-xs font-medium uppercase tracking-widest">
          {playing ? "Tocando" : "Música"}
        </span>
      </button>
    </>
  );
}
