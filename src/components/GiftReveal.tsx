import { useEffect, useState } from "react";

import { MOMENTOS } from "../data/momentos";

const SLIDE_MS = 7000;

export function GiftReveal() {
  const [stage, setStage] = useState<"gift" | "slides" | "done">("gift");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (stage !== "slides") return;
    const timer = setTimeout(() => {
      setIndex((i) => {
        if (i >= MOMENTOS.length - 1) {
          setStage("done");
          return i;
        }
        return i + 1;
      });
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [stage, index]);

  useEffect(() => {
    document.body.style.overflow = stage === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  if (stage === "done") return null;

  const momento = MOMENTOS[index] ?? MOMENTOS[0]!;
  const isLast = index === MOMENTOS.length - 1;


  const avancar = () => {
    if (isLast) setStage("done");
    else setIndex((i) => i + 1);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-wine px-5 py-8">
      {stage === "gift" ? (
        <div className="animate-fade-in text-center">
          <p className="mb-2 font-serif text-sm uppercase tracking-[0.3em] text-cream/70">
            Para você, Wanda
          </p>
          <h1 className="mb-8 font-serif text-3xl font-semibold text-cream sm:text-4xl">
            Tem um presente esperando por você
          </h1>

          <button
            type="button"
            onClick={() => setStage("slides")}
            aria-label="Abrir o presente"
            className="group mx-auto block transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative mx-auto block h-40 w-40 animate-[pulse_2.4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
              <span className="absolute bottom-0 left-0 h-28 w-40 rounded-b-xl bg-rose shadow-2xl shadow-wine/60" />
              <span className="absolute bottom-0 left-[4.25rem] h-28 w-3 bg-gold/90" />
              <span className="absolute top-6 left-0 h-6 w-40 rounded-md bg-rose-foreground/95" />
              <span className="absolute top-6 left-[4.25rem] h-6 w-3 bg-gold" />
              <span className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl">🎀</span>
            </span>
          </button>

          <p className="mt-8 font-serif text-lg italic text-cream/80">
            Toque no presente para abrir
          </p>
        </div>
      ) : (
        <div key={index} className="animate-fade-in flex w-full max-w-md flex-col items-center">
          <div className="w-full overflow-hidden rounded-3xl border border-gold/30 shadow-2xl shadow-black/40">
            <img
              src={momento.src}
              alt={momento.alt}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          <p className="mt-5 font-serif text-xl font-semibold text-gold sm:text-2xl">
            {momento.caption}
          </p>
          <p className="mt-3 text-center font-serif text-base italic leading-relaxed text-cream/90 sm:text-lg">
            {momento.mensagem}
          </p>

          <div className="mt-6 flex items-center gap-2">
            {MOMENTOS.map((m, i) => (
              <span
                key={m.src}
                className={
                  i === index
                    ? "h-2 w-6 rounded-full bg-gold transition-all"
                    : "h-2 w-2 rounded-full bg-cream/30 transition-all"
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={avancar}
            className="mt-6 rounded-full bg-rose px-7 py-3 text-sm font-medium uppercase tracking-widest text-rose-foreground transition-transform hover:scale-105 active:scale-95"
          >
            {isLast ? "Ver nossa carta" : "Próxima"}
          </button>

          <button
            type="button"
            onClick={() => setStage("done")}
            className="mt-3 text-xs uppercase tracking-widest text-cream/50 underline-offset-4 hover:underline"
          >
            Pular
          </button>
        </div>
      )}
    </div>
  );
}
