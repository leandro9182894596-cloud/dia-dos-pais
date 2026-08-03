import { useEffect, useState } from "react";
import {
  createPixPayment,
  checkPaymentStatus,
  type AsaasPaymentOrder,
} from "../lib/asaas";

interface PaymentModalProps {
  clientName: string;
  partnerName: string;
  price?: number;
  onPaymentApproved: () => void;
  onClose: () => void;
}

export function PaymentModal({
  clientName,
  partnerName,
  price = 5.99,
  onPaymentApproved,
  onClose,
}: PaymentModalProps) {
  const [order, setOrder] = useState<AsaasPaymentOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [statusText, setStatusText] = useState("Aguardando confirmação do Pix...");

  useEffect(() => {
    let isMounted = true;

    async function initPayment() {
      setLoading(true);
      const newOrder = await createPixPayment(clientName, price);
      if (isMounted) {
        setOrder(newOrder);
        setLoading(false);
        if (newOrder.apiSuccess) {
          setStatusText("Aguardando confirmação do Pix pela API do Asaas...");
        } else {
          setStatusText(`Erro: ${newOrder.errorMessage || "Falha ao gerar PIX."}`);
        }
      }
    }

    initPayment();

    return () => {
      isMounted = false;
    };
  }, [clientName, price]);

  // Automatic Polling for Asaas API orders
  useEffect(() => {
    if (!order || !order.id || order.id === "error" || !order.apiSuccess) return;

    const pollingInterval = setInterval(async () => {
      const status = await checkPaymentStatus(order.id);
      if (status === "RECEIVED" || status === "CONFIRMED") {
        clearInterval(pollingInterval);
        setStatusText("✓ Pagamento Confirmado pela API do Asaas!");
        setTimeout(() => onPaymentApproved(), 500);
      }
    }, 2500);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [order, onPaymentApproved]);

  const handleCopyPixPayload = () => {
    const payload = order?.pixCopiaECola || "";
    if (!payload) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payload);
      } else {
        const input = document.createElement("input");
        input.value = payload;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
    } catch (e) {
      console.error(e);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const qrImageSrc = order?.pixQrCodeBase64
    ? `data:image/png;base64,${order.pixQrCodeBase64}`
    : order?.pixQrCodeUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fade-in pointer-events-auto overflow-y-auto py-10">
      <div className="relative w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-gold/40 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl font-bold cursor-pointer"
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose/10 text-3xl">
            💳
          </div>

          <span className="inline-block rounded-full bg-gold/15 px-3 py-1 font-serif text-[11px] font-semibold uppercase tracking-widest text-gold border border-gold/30 mb-2">
            Pagamento Seguro via Pix (R$ {price.toFixed(2).replace(".", ",")})
          </span>

          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Liberar Link da Homenagem
          </h2>

          <p className="mt-1.5 text-xs text-muted-foreground">
            Efetue o Pix para publicar o site exclusivo de 24 horas para{" "}
            <strong className="text-rose">{partnerName}</strong>.
          </p>

          {/* Price Badge */}
          <div className="my-4 inline-flex items-baseline gap-1 rounded-2xl bg-wine px-6 py-2.5 text-white shadow-lg border border-gold/30">
            <span className="text-xs text-gold uppercase font-serif">Valor Total:</span>
            <span className="font-serif text-3xl font-extrabold text-gold">
              R$ {price.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-rose border-t-transparent" />
            <p className="text-xs text-muted-foreground font-serif">Gerando PIX via Asaas...</p>
          </div>
        ) : !order?.apiSuccess ? (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-center">
            <p className="text-sm font-bold text-red-500 mb-2">❌ Falha ao gerar o PIX</p>
            <p className="text-xs text-muted-foreground break-all">
              {order?.errorMessage || "Erro desconhecido."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 font-serif">
            {/* Live QR Code image rendering */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 border border-border shadow-inner">
              {qrImageSrc ? (
                <img
                  src={qrImageSrc}
                  alt="QR Code Pix"
                  className="h-52 w-52 rounded-xl border border-border shadow-md object-contain bg-white p-2"
                />
              ) : (
                <div className="flex h-52 w-52 items-center justify-center bg-gray-100 rounded-xl">
                  <span className="text-xs text-muted-foreground">Gerando QR Code...</span>
                </div>
              )}

              <p className="mt-3 text-center text-xs font-semibold text-gray-700">
                Abra o app do seu banco e escaneie o QR Code acima
              </p>
            </div>

            {/* Pix Copia e Cola */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">
                Pix Copia e Cola Oficial (R$ {price.toFixed(2).replace(".", ",")}):
              </label>

              <div className="flex items-center gap-2 rounded-2xl bg-background p-2 border border-input shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={order?.pixCopiaECola || ""}
                  className="w-full bg-transparent px-3 text-xs font-mono text-foreground focus:outline-none select-all truncate font-semibold"
                />
                <button
                  type="button"
                  onClick={handleCopyPixPayload}
                  className="shrink-0 rounded-xl bg-wine px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold hover:bg-wine/90 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  {copied ? "Copiado! ✓" : "Copiar Pix"}
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-rose/10 border border-rose/30 p-4 text-rose shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="h-3 w-3 rounded-full bg-rose animate-ping" />
                <span>{statusText}</span>
              </div>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                A liberação do link ocorrerá automaticamente quando a API confirmar o recebimento do Pix.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
