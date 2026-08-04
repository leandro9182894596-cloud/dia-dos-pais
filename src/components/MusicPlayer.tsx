import { useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  musicUrl?: string;
  autoPlayTrigger?: boolean;
}

const DEFAULT_MUSIC_URL = "/musica-romantica.mp3";

export function MusicPlayer({ musicUrl, autoPlayTrigger }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const activeSrc = musicUrl || DEFAULT_MUSIC_URL;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
  }, []);

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
