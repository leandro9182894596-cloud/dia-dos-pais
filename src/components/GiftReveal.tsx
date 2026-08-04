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
    <div className="fixed inset-0 z-[60] bg-gradient-to-b from-[#0d1f3c] via-[#132952] to-[#0a1628] font-serif text-white select-none overflow-y-auto">
      {/* Scroll container com safe-area para notch/barra de navegação */}
      <div className="flex min-h-full items-center justify-center px-4 py-safe-top pb-safe-bottom" style={{ paddingTop: 'env(safe-area-inset-top, 20px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
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
          <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center animate-fade-in py-2">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] backdrop-blur-md shadow-sm">
              <span>🏅</span> Uma surpresa especial para você
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-lg">
              meu Pai,
            </h1>
            <p className="mt-1 font-serif text-5xl sm:text-7xl font-extrabold text-gold drop-shadow-xl leading-none">
              {partnerName}
            </p>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75 sm:text-base sm:max-w-md">
              Preparamos uma homenagem com muito carinho e amor. Toque no presente para descobrir.
            </p>

            <div className="mt-3 text-xl text-[#D4AF37] animate-soft-bounce">
              ↓
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-[#1a3a6c]/40 via-[#D4AF37]/30 to-[#0d4080]/30 blur-3xl animate-glow-pulse" />

              <button
                type="button"
                onClick={handleGiftClick}
                disabled={stage === "opening"}
                aria-label="Abrir o presente"
                className="group relative cursor-pointer outline-none transition-transform duration-500 hover:scale-105 active:scale-95"
              >
                {/* Tamanho do presente menor em mobile, maior em sm+ */}
                <div className="relative flex h-44 w-44 sm:h-60 sm:w-60 items-center justify-center animate-float-smooth">
                  {/* Tampa do presente */}
                  <div
                    className={`absolute top-0 z-20 h-14 w-48 sm:h-18 sm:w-64 rounded-xl bg-gradient-to-r from-[#1a3a6c] via-[#D4AF37]/20 to-[#0d2a56] shadow-2xl border-b-2 border-gold/40 transition-all ${
                      stage === "opening" ? "animate-lid-open" : ""
                    }`}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center text-3xl sm:text-4xl drop-shadow-md">
                      🎀
                    </div>
                    <div className="absolute top-0 left-1/2 h-full w-6 sm:w-8 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-inner" />
                  </div>

                  {/* Caixa do presente */}
                  <div className="absolute bottom-0 z-10 h-32 w-44 sm:h-44 sm:w-60 overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a3a6c] via-[#0f2548] to-[#061428] shadow-2xl border border-gold/30">
                    <div className="absolute top-0 left-1/2 h-full w-6 sm:w-8 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-md" />
                    <div className="absolute top-1/2 left-0 w-full h-6 sm:h-8 -translate-y-1/2 bg-gradient-to-b from-[#D4AF37] via-[#FFF3B0] to-[#D4AF37] shadow-md" />
                    <div className="absolute inset-0 w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-ribbon-shine" />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold text-gold border border-gold/40 backdrop-blur-sm">
                      <span>🏅</span> TOQUE
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90 shadow-lg backdrop-blur-md animate-pulse border border-white/15">
              <span>🎁</span> Clique para abrir o presente do Pai
            </div>
          </div>
        ) : (
          <div key={index} className="animate-fade-in relative z-10 flex w-full max-w-sm flex-col items-center py-2">
            {/* Foto com altura limitada para caber na tela */}
            <div className="w-full overflow-hidden rounded-3xl border border-gold/40 shadow-2xl shadow-black/70 bg-black/40" style={{ maxHeight: '55vh' }}>
              <img
                src={momento.src}
                alt={momento.caption}
                className="w-full h-full object-cover"
                style={{ maxHeight: '55vh' }}
              />
            </div>

            <p className="mt-4 font-serif text-lg font-semibold text-[#D4AF37] sm:text-2xl drop-shadow-md text-center">
              {momento.caption}
            </p>
            {momento.mensagem && (
              <p className="mt-2 text-center font-serif text-sm italic leading-relaxed text-white/90 sm:text-base">
                {momento.mensagem}
              </p>
            )}

            <div className="mt-4 flex items-center gap-2">
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
              className="mt-4 rounded-full bg-[#1a3a6c] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95 border border-gold/30 cursor-pointer"
            >
              {isLast ? "Ver a carta para o Pai" : "Próxima"}
            </button>

            <button
              type="button"
              onClick={() => setStage("done")}
              className="mt-2 text-xs uppercase tracking-widest text-white/50 underline-offset-4 hover:underline cursor-pointer pb-2"
            >
              Pular para a carta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
