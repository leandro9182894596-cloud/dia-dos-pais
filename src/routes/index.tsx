import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { MusicPlayer } from "../components/MusicPlayer";
import foto01 from "../assets/foto-01.jpg.asset.json";
import foto02 from "../assets/foto-02.jpg.asset.json";
import foto03 from "../assets/foto-03.jpg.asset.json";
import foto04 from "../assets/foto-04.jpg.asset.json";
import foto05 from "../assets/foto-05.jpg.asset.json";
import foto06 from "../assets/foto-06.jpg.asset.json";
import foto07 from "../assets/foto-07.jpg.asset.json";
import fotoFamilia from "../assets/foto-familia.jpg.asset.json";

const GALERIA = [
  { src: foto03.url, alt: "Leandro e Wanda juntinhos", caption: "Nosso cantinho, nosso mundo" },
  { src: foto05.url, alt: "Leandro e Wanda em uma festa à noite", caption: "Noites que viraram lembranças" },
  { src: foto02.url, alt: "Leandro e Wanda no espelho", caption: "Sempre juntos, em cada reflexo" },
  { src: foto07.url, alt: "Selfie de Leandro e Wanda sorrindo", caption: "Sorrisos que dizem tudo" },
  { src: foto01.url, alt: "Leandro e Wanda ao ar livre", caption: "Passeios simples, felicidade enorme" },
  { src: foto04.url, alt: "Leandro abraçando Wanda", caption: "Abraço que é o meu lugar favorito" },
  { src: foto06.url, alt: "Leandro e Wanda em casa", caption: "O amor mora nos dias comuns" },
  { src: fotoFamilia.url, alt: "Foto da família reunida", caption: "A família que o nosso amor abraça" },
];


const START_DATE = new Date("2025-09-06T00:00:00");

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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leandro & Wanda — Nossa História" },
      {
        name: "description",
        content:
          "Uma carta de amor para Wanda. Nossa história começou em 06 de setembro de 2025.",
      },
      {
        property: "og:title",
        content: "Leandro & Wanda — Nossa História",
      },
      {
        property: "og:description",
        content:
          "Uma carta de amor para Wanda. Nossa história começou em 06 de setembro de 2025.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Countdown() {
  const [elapsed, setElapsed] = useState<TimeElapsed | null>(null);

  useEffect(() => {
    setElapsed(getTimeElapsed(START_DATE));
    const interval = setInterval(() => {
      setElapsed(getTimeElapsed(START_DATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!elapsed) {
    return (
      <div className="flex items-center justify-center py-6">
        <span className="text-wine/60 font-serif text-lg">Carregando...</span>
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
          className="flex flex-col items-center rounded-2xl bg-cream/60 p-4 backdrop-blur-sm"
        >
          <span className="font-serif text-3xl font-semibold text-wine sm:text-4xl">
            {pad(unit.value)}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-wine/70">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Leandro e Wanda ao pôr do sol"
            width={1920}
            height={1088}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wine/40 via-wine/20 to-background" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
          <p className="mb-4 font-serif text-sm font-medium uppercase tracking-[0.3em] text-cream/90">
            Nossa história começou em
          </p>
          <h1 className="font-serif text-5xl font-semibold text-cream sm:text-7xl md:text-8xl">
            Leandro <span className="text-gold">&</span> Wanda
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl italic text-cream/90 sm:text-2xl">
            Desde 06 de setembro de 2025, cada segundo ao seu lado é um presente.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <Countdown />
          </div>
        </div>
      </section>

      {/* Letter */}
      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <div className="relative rounded-3xl bg-card p-8 shadow-xl shadow-wine/5 sm:p-12">
          <div className="absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-rose text-rose-foreground flex items-center justify-center text-2xl">
            ♥
          </div>

          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Minha carta para você
          </h2>

          <div className="space-y-6 font-serif text-lg leading-relaxed text-foreground/90 sm:text-xl">
            <p>
              Wanda,
            </p>
            <p>
              Desde o dia <strong>06 de setembro de 2025</strong>, a minha vida ganhou uma nova cor. Você chegou como quem não avisa, mas como quem estava destinado a ficar. Cada dia ao seu lado me ensina que o amor não é apenas um sentimento, é uma escolha que eu faço todos os dias — e eu escolho você.
            </p>
            <p>
              Lembro dos nossos primeiros olhares, das primeiras conversas, daquele nervosismo gostoso de quem está descobrindo alguém especial. Hoje, olhando para trás, vejo que cada momento foi um capítulo da nossa história sendo escrito com cuidado, carinho e muita cumplicidade.
            </p>
            <p>
              Obrigado por ser minha parceira, minha amiga, minha paz e o meu maior amor. Obrigado pelos sorrisos fáceis, pelos abraços que curam e por me fazer querer ser uma pessoa melhor a cada dia.
            </p>
            <p>
              Não sei o que o futuro reserva, mas sei que quero viver cada segundo dele ao seu lado. Que venham muitos mais dias, meses e anos de nós dois.
            </p>
            <p className="text-right font-serif text-2xl italic text-rose">
              Com todo o meu amor,
              <br />
              <span className="font-semibold">Leandro</span>
            </p>
          </div>
        </div>
      </section>

      {/* Moments gallery */}
      <section className="bg-secondary/30 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 font-serif text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Memórias
            </p>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Nossos momentos
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Cada foto conta um pedacinho da nossa história. Envie as suas fotos para que eu possa substituir essas imagens pelos momentos reais de vocês.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALERIA.map((foto) => (
              <figure
                key={foto.src}
                className="group overflow-hidden rounded-2xl bg-card shadow-md transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={foto.src}
                    alt={foto.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="p-5 text-center font-serif text-foreground/80">
                  {foto.caption}
                </figcaption>
              </figure>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wine px-6 py-12 text-center text-wine-foreground">
        <p className="font-serif text-2xl font-semibold sm:text-3xl">
          Leandro <span className="text-gold">&</span> Wanda
        </p>
        <p className="mx-auto mt-3 max-w-md font-serif text-wine-foreground/80">
          "O amor não se vê, se sente. E eu sinto o seu em cada batida do meu coração."
        </p>
        <p className="mt-8 text-xs uppercase tracking-widest text-wine-foreground/60">
          Feito com amor · 06.09.2025
        </p>
      </footer>
    </main>
  );
}
