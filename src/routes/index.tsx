import { createFileRoute } from "@tanstack/react-router";
import { CreatorForm } from "../components/CreatorForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amor24h — Crie um Site Romântico para o seu Amor (Válido por 24 Horas)" },
      {
        name: "description",
        content:
          "Crie uma homenagem romântica personalizada para o seu amor com fotos, música e contador. Link exclusivo válido por 24 horas.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Banner */}
      <div className="bg-wine py-2.5 px-4 text-center text-xs font-serif uppercase tracking-widest text-gold shadow-md">
        ✨ PLATAFORMA DE HOMENAGENS · CRIE O PRESENTE PERFEITO COM LINK DE 24 HORAS
      </div>

      {/* Header */}
      <header className="border-b border-wine/10 bg-card/60 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌹</span>
            <span className="font-serif text-xl font-bold text-wine">Amor24h</span>
          </div>
          <a
            href="#criar"
            className="rounded-full bg-rose px-5 py-2 text-xs font-semibold uppercase tracking-wider text-rose-foreground shadow-md transition-transform hover:scale-105"
          >
            Criar Homenagem
          </a>
        </div>
      </header>

      {/* Main Creator Form Section - Clean focus right on the form */}
      <section id="criar" className="px-6 py-10">
        <CreatorForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-wine/10 bg-wine px-6 py-12 text-center text-wine-foreground">
        <p className="font-serif text-2xl font-bold">Amor24h</p>
        <p className="mt-2 text-xs text-wine-foreground/80">
          Crie momentos inesquecíveis em poucos minutos.
        </p>
        <p className="mt-6 text-[10px] uppercase tracking-widest text-wine-foreground/50">
          © {new Date().getFullYear()} Amor24h · Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
