import { useState, useRef, useCallback, memo, type ChangeEvent } from "react";
import {
  compressImage,
  saveHomenagem,
  type HomenagemFoto,
  type HomenagemData,
} from "../lib/storage";
import { ShareModal } from "./ShareModal";
import { PaymentModal } from "./PaymentModal";
import { HomenagemView } from "./HomenagemView";

const DEFAULT_LETTER = `Desde o dia em que nos conhecemos, a minha vida ganhou uma nova cor. Você chegou como quem não avisa, mas como quem estava destinado a ficar. Cada dia ao seu lado me ensina que o amor não é apenas um sentimento, é uma escolha que eu faço todos os dias — e eu escolho você.\n\nObrigado por ser minha parceira, minha amiga, minha paz e o meu maior amor. Que venham muitos mais dias, meses e anos de nós dois.`;

interface PhotoItemProps {
  foto: HomenagemFoto;
  index: number;
  onRemove: (id: string) => void;
  onCaptionChange: (id: string, caption: string) => void;
  onMensagemChange: (id: string, mensagem: string) => void;
}

const PhotoItem = memo(function PhotoItem({
  foto,
  index,
  onRemove,
  onCaptionChange,
  onMensagemChange,
}: PhotoItemProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm flex flex-col justify-between pointer-events-auto">
      <div>
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted relative">
          <img
            src={foto.src}
            alt={foto.caption}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <button
            type="button"
            onClick={() => onRemove(foto.id)}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white hover:bg-red-600 transition-colors shadow-md z-20 cursor-pointer"
          >
            ✕
          </button>
          <span className="absolute bottom-2 left-2 rounded-md bg-wine/80 px-2 py-0.5 text-[10px] text-cream font-medium">
            Foto #{index + 1}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div>
            <label htmlFor={`caption-${foto.id}`} className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Título / Legenda:
            </label>
            <input
              id={`caption-${foto.id}`}
              name={`caption-${foto.id}`}
              type="text"
              defaultValue={foto.caption}
              onBlur={(e) => onCaptionChange(foto.id, e.target.value)}
              placeholder="Ex: Nosso primeiro encontro"
              className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground font-sans focus:outline-none focus:ring-1 focus:ring-rose font-medium pointer-events-auto select-text cursor-text relative z-10"
            />
          </div>

          <div>
            <label htmlFor={`msg-${foto.id}`} className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Mensagem desta foto:
            </label>
            <textarea
              id={`msg-${foto.id}`}
              name={`msg-${foto.id}`}
              rows={2}
              defaultValue={foto.mensagem || ""}
              onBlur={(e) => onMensagemChange(foto.id, e.target.value)}
              placeholder="Escreva uma mensagem ou lembrança para esta foto..."
              className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground font-sans focus:outline-none focus:ring-1 focus:ring-rose leading-relaxed pointer-events-auto select-text cursor-text relative z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export function CreatorForm() {
  const clientNameRef = useRef<HTMLInputElement>(null);
  const partnerNameRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const letterBodyRef = useRef<HTMLTextAreaElement>(null);

  const [photos, setPhotos] = useState<HomenagemFoto[]>([]);
  const [musicUrl, setMusicUrl] = useState<string | undefined>(undefined);
  const [musicFileName, setMusicFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  // Modais de Prévia e Pagamento
  const [previewData, setPreviewData] = useState<HomenagemData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [partnerNameForShare, setPartnerNameForShare] = useState<string>("");

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 10) {
      alert("Você pode enviar no máximo 10 fotos.");
      return;
    }

    setUploading(true);
    try {
      const newPhotos: HomenagemFoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBase64 = await compressImage(file);
        newPhotos.push({
          id: Math.random().toString(36).substring(2, 9),
          src: compressedBase64,
          caption: `Nosso momento #${photos.length + i + 1}`,
          mensagem: "Um dia inesquecível ao seu lado.",
        });
      }
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 10));
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao processar as fotos.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleMusicUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMusicFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMusicUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMusic = () => {
    setMusicUrl(undefined);
    setMusicFileName(null);
  };

  const handleRemovePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleCaptionChange = useCallback((id: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  }, []);

  const handleMensagemChange = useCallback((id: string, mensagem: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, mensagem } : p))
    );
  }, []);

  const getFormData = (): Omit<HomenagemData, "id" | "createdAt"> => {
    const clientName = clientNameRef.current?.value.trim() || "Você";
    const partnerName = partnerNameRef.current?.value.trim() || "Seu Amor";
    const startDate = startDateRef.current?.value || "2025-09-06";
    const startTime = startTimeRef.current?.value || "00:00";
    const letterBody = letterBodyRef.current?.value || DEFAULT_LETTER;

    const fullStartDate = `${startDate}T${startTime}:00`;
    return {
      clientName,
      partnerName,
      startDate: fullStartDate,
      letterBody,
      photos,
      musicUrl,
    };
  };

  const handleOpenPreview = () => {
    const clientName = clientNameRef.current?.value.trim();
    const partnerName = partnerNameRef.current?.value.trim();

    if (!clientName || !partnerName) {
      alert("Por favor, informe o seu nome e o nome do seu parceiro(a) antes de visualizar.");
      return;
    }

    const payload = getFormData();
    setPreviewData({
      id: "preview-temp",
      createdAt: Date.now(),
      ...payload,
    });
  };

  // Abre a modal de checkout de pagamento do Asaas
  const handleInitiateCheckout = () => {
    const clientName = clientNameRef.current?.value.trim();
    const partnerName = partnerNameRef.current?.value.trim();

    if (!clientName || !partnerName) {
      alert("Por favor, informe o seu nome e o nome do seu parceiro(a).");
      return;
    }

    setPartnerNameForShare(partnerName);
    setPreviewData(null);
    setShowPaymentModal(true);
  };

  // Executado quando o pagamento via Asaas Pix é confirmado ou simulado
  const handlePaymentApproved = () => {
    const payload = getFormData();
    const saved = saveHomenagem(payload);

    const generatedUrl = `${window.location.origin}/homenagem/${saved.id}`;
    setCreatedUrl(generatedUrl);
    setShowPaymentModal(false);
  };

  return (
    <div className="relative z-10 mx-auto max-w-3xl rounded-3xl bg-card p-6 shadow-2xl border border-wine/10 sm:p-10 pointer-events-auto">
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full bg-rose/10 px-4 py-1.5 font-serif text-xs font-semibold uppercase tracking-widest text-rose">
          Criador de Homenagem
        </span>
        <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Monte o Site do Seu Amor
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Preencha os dados abaixo. O link gerado será exclusivo e terá validade de <strong>24 horas</strong>.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 pointer-events-auto">
        {/* Nomes */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="clientName" className="mb-1.5 block text-sm font-medium text-foreground">
              Seu Nome:
            </label>
            <input
              id="clientName"
              name="clientName"
              ref={clientNameRef}
              type="text"
              required
              autoComplete="off"
              defaultValue=""
              placeholder="Ex: Leandro"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base text-foreground font-sans shadow-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/30 pointer-events-auto select-text cursor-text relative z-10"
            />
          </div>

          <div>
            <label htmlFor="partnerName" className="mb-1.5 block text-sm font-medium text-foreground">
              Nome do Seu Amor (Parceiro/a):
            </label>
            <input
              id="partnerName"
              name="partnerName"
              ref={partnerNameRef}
              type="text"
              required
              autoComplete="off"
              defaultValue=""
              placeholder="Ex: Wanda"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base text-foreground font-sans shadow-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/30 pointer-events-auto select-text cursor-text relative z-10"
            />
          </div>
        </div>

        {/* Data do relacionamento */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="mb-1.5 block text-sm font-medium text-foreground">
              Data de Início do Relacionamento:
            </label>
            <input
              id="startDate"
              name="startDate"
              ref={startDateRef}
              type="date"
              required
              defaultValue="2025-09-06"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base text-foreground font-sans shadow-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/30 pointer-events-auto select-text cursor-text relative z-10"
            />
          </div>

          <div>
            <label htmlFor="startTime" className="mb-1.5 block text-sm font-medium text-foreground">
              Horário (Opcional):
            </label>
            <input
              id="startTime"
              name="startTime"
              ref={startTimeRef}
              type="time"
              defaultValue="00:00"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-base text-foreground font-sans shadow-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/30 pointer-events-auto select-text cursor-text relative z-10"
            />
          </div>
        </div>

        {/* Carta de Amor */}
        <div>
          <label htmlFor="letterBody" className="mb-1.5 block text-sm font-medium text-foreground">
            Sua Carta de Amor:
          </label>
          <textarea
            id="letterBody"
            name="letterBody"
            ref={letterBodyRef}
            rows={5}
            defaultValue={DEFAULT_LETTER}
            className="w-full rounded-2xl border border-input bg-background p-4 text-base leading-relaxed text-foreground font-sans shadow-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/30 pointer-events-auto select-text cursor-text relative z-10"
          />
        </div>

        {/* Upload de Música Personalizada */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Música Especial do Casal (Opcional):
          </label>
          <p className="mb-2 text-xs text-muted-foreground">
            Se deixar sem arquivo, usaremos a música romântica padrão (John Legend - All of Me).
          </p>

          {!musicFileName ? (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-input bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-secondary/40 transition-colors pointer-events-auto relative z-10">
              <span className="text-xl">🎵</span>
              <span>Escolher arquivo de áudio (MP3 / WAV / M4A)</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between rounded-2xl bg-rose/10 border border-rose/30 px-4 py-3 text-sm text-foreground">
              <div className="flex items-center gap-2 truncate">
                <span>🎵</span>
                <span className="font-semibold truncate">{musicFileName}</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveMusic}
                className="text-xs font-bold text-rose hover:underline shrink-0 ml-2 cursor-pointer"
              >
                Remover / Usar padrão
              </button>
            </div>
          )}
        </div>

        {/* Upload de Fotos (Até 10 fotos) */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Fotos dos Seus Momentos ({photos.length}/10 no máximo):
            </label>
            <span className="text-xs text-muted-foreground">
              Formato JPG/PNG/WebP
            </span>
          </div>

          {photos.length < 10 && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rose/40 bg-rose/5 p-6 text-center transition-colors hover:bg-rose/10 pointer-events-auto relative z-10">
              <span className="text-3xl mb-1">📷</span>
              <span className="text-sm font-semibold text-rose">
                {uploading ? "Carregando fotos..." : "Clique para adicionar fotos do casal"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                Selecione até {10 - photos.length} fotos extras
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={uploading}
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}

          {/* Grid de fotos adicionadas com componentes memoizados */}
          {photos.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((foto, index) => (
                <PhotoItem
                  key={foto.id}
                  foto={foto}
                  index={index}
                  onRemove={handleRemovePhoto}
                  onCaptionChange={handleCaptionChange}
                  onMensagemChange={handleMensagemChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons: Preview and Generate Link */}
        <div className="grid gap-3 sm:grid-cols-2 pt-2 font-serif">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-rose bg-rose/10 py-3.5 text-sm font-semibold uppercase tracking-wider text-rose shadow-md transition-all hover:bg-rose/20 active:scale-95 cursor-pointer pointer-events-auto relative z-10"
          >
            <span>👁</span> Pré-visualizar Homenagem
          </button>

          <button
            type="button"
            onClick={handleInitiateCheckout}
            className="flex items-center justify-center gap-2 rounded-full bg-rose py-3.5 text-sm font-semibold uppercase tracking-wider text-rose-foreground shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer pointer-events-auto relative z-10"
          >
            <span>💳</span> Gerar Link via Pix (R$ 0,10)
          </button>
        </div>
      </form>

      {/* Full-Screen Live Interactive Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 animate-fade-in pointer-events-auto">
          {/* Top Bar inside Preview Modal - z-[70] for priority controls */}
          <div className="sticky top-0 z-[70] flex items-center justify-between bg-wine/95 px-6 py-3 text-white shadow-xl backdrop-blur-md border-b border-gold/30">
            <div className="flex items-center gap-2">
              <span className="text-xl">👁</span>
              <span className="font-serif text-sm font-bold uppercase tracking-wider">
                Prévia ao Vivo da Homenagem
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/30 transition-colors cursor-pointer"
              >
                ✏️ Editar
              </button>

              <button
                type="button"
                onClick={handleInitiateCheckout}
                className="rounded-full bg-rose px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                💳 Pagar & Gerar Link (R$ 0,10)
              </button>
            </div>
          </div>

          <HomenagemView data={previewData} isPreview={false} />
        </div>
      )}

      {/* Payment Checkout Modal (Asaas Pix R$ 0,10) */}
      {showPaymentModal && (
        <PaymentModal
          clientName={clientNameRef.current?.value || "Cliente"}
          partnerName={partnerNameForShare || "Parceiro(a)"}
          price={0.10}
          onPaymentApproved={handlePaymentApproved}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Share Modal when Link is generated */}
      {createdUrl && (
        <ShareModal
          url={createdUrl}
          partnerName={partnerNameForShare || "seu parceiro"}
          onClose={() => setCreatedUrl(null)}
        />
      )}
    </div>
  );
}
