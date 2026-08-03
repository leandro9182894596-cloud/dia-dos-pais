export function ExpiredPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="mx-auto max-w-lg rounded-3xl bg-card p-8 text-center shadow-2xl border border-wine/20 sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-wine/10 text-4xl text-wine">
          ⏳
        </div>

        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Homenagem Expirada
        </h1>

        <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
          Esta homenagem especial foi configurada com duração de <span className="font-semibold text-rose">24 horas</span> e o seu tempo de exibição foi concluído.
        </p>

        <div className="mt-8 rounded-2xl bg-secondary/40 p-4 font-serif text-sm text-foreground/80">
          ✨ Quer criar uma nova homenagem personalizada para o seu parceiro(a)?
        </div>

        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-rose px-8 py-4 font-serif text-sm font-semibold uppercase tracking-widest text-rose-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Criar Nova Homenagem
        </a>
      </div>
    </main>
  );
}
