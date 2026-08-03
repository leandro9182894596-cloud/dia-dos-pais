import { useEffect, useRef, useState } from "react";

import musicAsset from "../assets/musica-romantica.mp3.asset.json";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;

    const tryPlay = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    tryPlay();

    const onFirstInteraction = () => {
      if (audio.paused) tryPlay();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };

    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={musicAsset.url} loop preload="auto" />
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
