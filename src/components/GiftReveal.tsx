import { useEffect, useState } from "react";
import { MOMENTOS } from "../data/momentos";
import type { HomenagemFoto } from "../lib/storage";

const SLIDE_MS = 7000;

interface GiftRevealProps {
  partnerName?: string;
  photos?: HomenagemFoto[];
  onOpenGift?: () => void;
}

export function GiftReveal({ partnerName = "Pai", photos, onOpenGift }: GiftRevealProps) {
  const [stage, setStage] = useState<"gift" | "opening" | "slides" | "done">("gift");
  const [index, setIndex] = useState(0);

  const listaMomentos = photos && photos.length > 0 ? photos : MOMENTOS;

  useEffect(() => {
    if (stage !== "slides") return;
    const timer = setTimeout(() => {
      setIndex((i) => {
        if (i >= listaMomentos.length - 1) {
          setStage("done");
          return i;
        }
        return i + 1;
      });
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [stage, index, listaMomentos.length]);

  if (stage === "done") return null;

  const momento = listaMomentos[index] ?? listaMomentos[0]!;
  const isLast = index === listaMomentos.length - 1;

  const handleGiftClick = () => {
    if (stage !== "gift") return;
    setStage("opening");
    onOpenGift?.();

    setTimeout(() => {
      setStage("slides");
    }, 850);
  };

  const avancar = () => {
    if (isLast) setStage("done");
    else setIndex((i) => i + 1);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-b from-[#0d1f3c] via-[#132952] to-[#0a1628] px-5 py-6 font-serif text-white select-none overflow-y-auto">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-1/4 left-10 h-2 w-2 rounded-full bg-gold animate-ping" />
        <div className="absolute top-1/3 right-16 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 h-2 w-2 rounded-full bg-gold/60 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-gold/70 animate-ping" />
        <div className="absolute top-1/2 left-1/3 h-1 w-1 rounded-full bg-white/60 animate-pulse" />
        <div className="absolute top-10 right-1/3 h-2 w-2 rounded-full bg-gold/40 animate-ping" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,210,80,0.06)_0%,_transparent_70%)]" />
      </div>

      {stage === "gift" || stage === "opening" ? (
        <div className="relative z-10 flex w-full max-w-xl flex-col items-center justify-center text-center animate-fade-in py-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37] backdrop-blur-md shadow-sm">
            <span>🏅</span> Uma surpresa especial para você
          </div>

          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-lg">
            meu Pai,
          </h1>
          <p className="mt-2 font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold text-gold drop-shadow-xl leading-none">
            {partnerName}
          </p>

          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            Preparamos uma homenagem com muito carinho e amor. Toque no presente para descobrir.
          </p>

          <div className="mt-5 text-2xl text-[#D4AF37] animate-soft-bounce">
            ↓
          </div>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-[#1a3a6c]/40 via-[#D4AF37]/30 to-[#0d4080]/30 blur-3xl animate-glow-pulse" />

            <button
              type="button"
              onClick={handleGiftClick}
              disabled={stage === "opening"}
              aria-label="Abrir o presente"
              className="group relative cursor-pointer outline-none transition-transform duration-500 hover:scale-105 active:scale-95"
            >
              <div className="relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center animate-float-smooth">
                {/* Tampa do presente */}
                <div
                  className={`absolute top-0 z-20 h-16 w-56 sm:h-18 sm:w-64 rounded-xl bg-gradient-to-r from-[#1a3a6c] via-[#D4AF37]/20 to-[#0d2a56] shadow-2xl border-b-2 border-gold/40 transition-all ${
                    stage === "opening" ? "animate-lid-open" : ""
                  }`}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center text-4xl drop-shadow-md">
                    🎀
                  </div>
                  <div className="absolute top-0 left-1/2 h-full w-8 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-inner" />
                </div>

                {/* Caixa do presente */}
                <div className="absolute bottom-0 z-10 h-40 w-52 sm:h-44 sm:w-60 overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a3a6c] via-[#0f2548] to-[#061428] shadow-2xl border border-gold/30">
                  <div className="absolute top-0 left-1/2 h-full w-8 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-md" />
                  <div className="absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 bg-gradient-to-b from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-md" />
                  <div className="absolute inset-0 w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-ribbon-shine" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-gold border border-gold/40 backdrop-blur-sm">
                    <span>🏅</span> TOQUE
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white/90 shadow-lg backdrop-blur-md animate-pulse border border-white/15">
            <span>🎁</span> Clique para abrir o presente do Pai
          </div>
        </div>
      ) : (
        <div key={index} className="animate-fade-in flex w-full max-w-md flex-col items-center">
          <div className="w-full overflow-hidden rounded-3xl border border-gold/40 shadow-2xl shadow-black/70 bg-black/40">
            <img
              src={momento.src}
              alt={momento.caption}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          <p className="mt-5 font-serif text-xl font-semibold text-[#D4AF37] sm:text-2xl drop-shadow-md">
            {momento.caption}
          </p>
          {momento.mensagem && (
            <p className="mt-3 text-center font-serif text-base italic leading-relaxed text-white/90 sm:text-lg">
              {momento.mensagem}
            </p>
          )}

          <div className="mt-6 flex items-center gap-2">
            {listaMomentos.map((m, i) => (
              <span
                key={m.id || m.src || i}
                className={
                  i === index
                    ? "h-2 w-6 rounded-full bg-[#D4AF37] transition-all"
                    : "h-2 w-2 rounded-full bg-white/30 transition-all"
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={avancar}
            className="mt-6 rounded-full bg-[#1a3a6c] px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95 border border-gold/30 cursor-pointer"
          >
            {isLast ? "Ver a carta para o Pai" : "Próxima"}
          </button>

          <button
            type="button"
            onClick={() => setStage("done")}
            className="mt-3 text-xs uppercase tracking-widest text-white/50 underline-offset-4 hover:underline cursor-pointer"
          >
            Pular para a carta
          </button>
        </div>
      )}
    </div>
  );
}
