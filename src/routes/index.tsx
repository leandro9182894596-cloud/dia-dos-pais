import { createFileRoute } from "@tanstack/react-router";
import { CreatorForm } from "../components/CreatorForm";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Pai24h — Crie uma Homenagem Especial para o Dia dos Pais (Válida por 24 Horas)" },
      {
        name: "description",
        content:
          "Crie uma homenagem emocionante para o seu pai com fotos, mensagem e contador. Link exclusivo para o Dia dos Pais, válido por 24 horas.",
      },
    ],
  }),
  component: IndexPage,
}));

function IndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Banner */}
      <div className="bg-wine py-2.5 px-4 text-center text-xs font-serif uppercase tracking-widest text-gold shadow-md">
        🏅 PLATAFORMA DE HOMENAGENS · PRESENTE ESPECIAL PARA O DIA DOS PAIS · LINK DE 24 HORAS
      </div>

      {/* Header */}
      <header className="border-b border-wine/10 bg-card/60 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍👧</span>
            <span className="font-serif text-xl font-bold text-wine">Pai24h</span>
          </div>
          <a
            href="#criar"
            className="rounded-full bg-rose px-5 py-2 text-xs font-semibold uppercase tracking-wider text-rose-foreground shadow-md transition-transform hover:scale-105"
          >
            Criar Homenagem
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wine via-wine/90 to-[#1a3a5c] px-6 py-20 text-center text-white">
        {/* Decorative stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-8 left-10 text-gold/40 text-4xl animate-star-float">⭐</span>
          <span className="absolute top-16 right-16 text-gold/30 text-2xl animate-star-float" style={{ animationDelay: "1.2s" }}>★</span>
          <span className="absolute bottom-12 left-1/4 text-gold/20 text-3xl animate-star-float" style={{ animationDelay: "2.5s" }}>⭐</span>
          <span className="absolute bottom-20 right-10 text-gold/30 text-xl animate-star-float" style={{ animationDelay: "0.8s" }}>★</span>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,210,100,0.08)_0%,_transparent_70%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-6">
            🎖️ Homenagem Especial · Dia dos Pais
          </span>
          <h1 className="font-serif text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl drop-shadow-lg">
            Surpreenda o Seu Pai com uma
            <span className="block text-gold mt-1">Homenagem Inesquecível</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/80 max-w-2xl mx-auto">
            Crie um site personalizado com fotos, uma carta emocionante e um contador de tempo juntos.
            Compartilhe o link em segundos e faça o seu pai se sentir o herói que ele sempre foi.
          </p>

          {/* Feature badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { icon: "📸", label: "Até 10 fotos" },
              { icon: "💌", label: "Carta personalizada" },
              { icon: "⏱️", label: "Contador de vida juntos" },
              { icon: "🎵", label: "Música especial" },
              { icon: "📲", label: "Link via WhatsApp" },
            ].map((feat) => (
              <span
                key={feat.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-4 py-2 backdrop-blur-sm"
              >
                {feat.icon} {feat.label}
              </span>
            ))}
          </div>

          <a
            href="#criar"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-rose px-8 py-4 text-sm font-bold uppercase tracking-wider text-rose-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            🏅 Criar Homenagem para o Pai
          </a>
        </div>
      </section>

      {/* Main Creator Form Section */}
      <section id="criar" className="px-6 py-14">
        <CreatorForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-wine/10 bg-wine px-6 py-14 text-center text-wine-foreground">
        <div className="mx-auto max-w-2xl">
          <span className="text-4xl">👨‍👧</span>
          <p className="font-serif text-2xl font-bold mt-3">Pai24h</p>
          <p className="mt-3 text-sm text-wine-foreground/80 leading-relaxed">
            "Um pai é alguém que quer te segurar quando você cai, ri com você quando você ri
            e que te ama mais do que palavras podem expressar."
          </p>
          <p className="mt-8 text-[10px] uppercase tracking-widest text-wine-foreground/50">
            © {new Date().getFullYear()} Pai24h · Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
