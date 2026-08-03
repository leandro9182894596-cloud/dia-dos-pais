import { useState } from "react";



interface ShareModalProps {
  url: string;
  partnerName: string;
  onClose: () => void;
}

export function ShareModal({ url, partnerName, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
    } catch {
      // fallback if clipboard API fails
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappMessage = encodeURIComponent(
    `Fiz uma homenagem especial para você, ${partnerName}! 🏅\nAcesse antes que expire em 24 horas:\n${url}`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-gold/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl font-bold cursor-pointer"
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose/10 text-3xl">
            🏅
          </div>

          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Homenagem para o Pai Está Pronta!
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            O link exclusivo para <strong className="text-rose">{partnerName}</strong> foi gerado com sucesso.
          </p>

          <div className="my-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-700 dark:text-amber-300 font-medium">
            ⏳ <strong>Atenção:</strong> Este link tem validade estrita de <strong>24 horas</strong>. Após esse período o conteúdo será removido automaticamente.
          </div>
        </div>

        <div className="mt-6 space-y-4 font-serif">
          {/* Link Box */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Link Direto da Homenagem:
            </label>

            <div className="flex items-center gap-2 rounded-2xl bg-secondary p-2 border border-border">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full bg-transparent px-3 text-xs font-mono text-foreground focus:outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-xl bg-rose px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-foreground hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                {copied ? "Copiado! ✓" : "Copiar"}
              </button>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
          >
            <span>💬</span> Compartilhar no WhatsApp para o Pai
          </a>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose bg-rose/10 px-5 py-3 text-sm font-semibold text-rose transition-colors hover:bg-rose/20"
          >
            👁 Visualizar Homenagem
          </a>
        </div>
      </div>
    </div>
  );
}
