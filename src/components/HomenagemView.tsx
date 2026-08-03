import { useEffect, useState } from "react";
import { GiftReveal } from "./GiftReveal";
import { MusicPlayer } from "./MusicPlayer";
import { ExpirationBanner } from "./ExpirationBanner";
import { ExpiredPage } from "./ExpiredPage";
import { isHomenagemExpired, type HomenagemData } from "../lib/storage";

interface HomenagemViewProps {
  data: HomenagemData;
  isPreview?: boolean;
}

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeElapsed(from: Date): TimeElapsed {
  const now = new Date();
  const diff = Math.max(0, now.getTime() - from.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function LifeCounter({ startDateStr }: { startDateStr: string }) {
  const startDate = new Date(startDateStr);
  const [elapsed, setElapsed] = useState<TimeElapsed | null>(null);

  useEffect(() => {
    setElapsed(getTimeElapsed(startDate));
    const interval = setInterval(() => {
      setElapsed(getTimeElapsed(startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDateStr]);

  if (!elapsed) {
    return (
      <div className="flex items-center justify-center py-6">
        <span className="text-cream/60 font-serif text-lg">Calculando tempo...</span>
      </div>
    );
  }

  const units = [
    { value: elapsed.days, label: "dias" },
    { value: elapsed.hours, label: "horas" },
    { value: elapsed.minutes, label: "minutos" },
    { value: elapsed.seconds, label: "segundos" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center rounded-2xl bg-cream/20 p-4 backdrop-blur-sm shadow-md border border-gold/20"
        >
          <span className="font-serif text-3xl font-semibold text-gold sm:text-4xl drop-shadow-md">
            {pad(unit.value)}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-cream/80">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HomenagemView({ data, isPreview = false }: HomenagemViewProps) {
  const [expired, setExpired] = useState(() => (!isPreview ? isHomenagemExpired(data.createdAt) : false));
  const [startMusic, setStartMusic] = useState(false);

  if (expired) {
    return <ExpiredPage />;
  }

  const heroPhoto = data.photos[0]?.src || "/placeholder.jpg";

  const formattedDate = new Date(data.startDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-background">
      {!isPreview && (
        <>
          <ExpirationBanner createdAt={data.createdAt} onExpire={() => setExpired(true)} />
          <GiftReveal
            partnerName={data.partnerName}
            photos={data.photos}
            onOpenGift={() => setStartMusic(true)}
          />
          <MusicPlayer musicUrl={data.musicUrl} autoPlayTrigger={startMusic} />
        </>
      )}

      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroPhoto}
            alt={`${data.clientName} e ${data.partnerName}`}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wine/70 via-wine/40 to-background" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
          <p className="mb-4 font-serif text-sm font-medium uppercase tracking-[0.3em] text-cream/90">
            🏅 Uma homenagem especial para
          </p>
          <h1 className="font-serif text-5xl font-semibold text-cream sm:text-7xl md:text-8xl drop-shadow-md">
            {data.partnerName}
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic text-cream/80">
            de {data.clientName}
          </p>
          <p className="mx-auto mt-3 max-w-xl font-serif text-xl italic text-cream/90 sm:text-2xl">
            Nascido em {formattedDate} — cada dia ao seu lado é um presente inestimável.
          </p>

          {/* Contador de vida */}
          <div className="mx-auto mt-6 max-w-xl">
            <p className="mb-4 text-xs uppercase tracking-widest text-cream/60 font-medium">
              Tempo de vida juntos
            </p>
            <LifeCounter startDateStr={data.startDate} />
          </div>
        </div>
      </section>

      {/* Carta para o Pai */}
      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <div className="relative rounded-3xl bg-card p-8 shadow-xl shadow-wine/5 sm:p-12 border border-wine/10">
          <div className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-rose text-rose-foreground text-2xl shadow-md">
            🏅
          </div>

          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Carta para o Meu Pai
          </h2>

          <div className="space-y-6 font-serif text-lg leading-relaxed text-foreground/90 sm:text-xl whitespace-pre-line">
            <p className="font-bold text-wine text-2xl">{data.partnerName},</p>
            <p>{data.letterBody}</p>

            <p className="text-right font-serif text-2xl italic text-rose pt-6">
              Com todo o meu amor,
              <br />
              <span className="font-semibold">{data.clientName}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Galeria de Momentos */}
      {data.photos.length > 0 && (
        <section className="bg-secondary/30 px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Memórias Inesquecíveis
              </p>
              <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
                Momentos com o Pai
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Cada foto guarda um pedacinho da nossa história juntos.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.photos.map((foto) => (
                <figure
                  key={foto.id || foto.src}
                  className="group overflow-hidden rounded-2xl bg-card shadow-md transition-transform duration-500 hover:-translate-y-1 border border-border"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={foto.src}
                      alt={foto.caption}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="p-5 text-center font-serif text-foreground/80">
                    <p className="font-semibold text-wine text-lg">{foto.caption}</p>
                    {foto.mensagem && (
                      <p className="mt-2 text-sm italic text-muted-foreground leading-relaxed">
                        "{foto.mensagem}"
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-wine px-6 py-14 text-center text-wine-foreground">
        <span className="text-4xl">🏅</span>
        <p className="font-serif text-2xl font-semibold sm:text-3xl mt-4">
          Para <span className="text-gold">{data.partnerName}</span>
        </p>
        <p className="mx-auto mt-3 max-w-md font-serif text-wine-foreground/80">
          "Um pai não é apenas alguém que te dá a vida — é quem te ensina a vivê-la."
        </p>
        <p className="mt-3 font-serif text-sm text-wine-foreground/60 italic">
          Com amor de {data.clientName}
        </p>
        <p className="mt-8 text-xs uppercase tracking-widest text-wine-foreground/50">
          Homenagem com Validade de 24 Horas · Feito com ❤️ para o Dia dos Pais
        </p>
      </footer>
    </main>
  );
}
