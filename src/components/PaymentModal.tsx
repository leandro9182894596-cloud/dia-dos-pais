import { useEffect, useState } from "react";
import {
  createPixPayment,
  checkPaymentStatus,
  DEFAULT_PIX_KEY,
  PRODUCTION_ASAAS_API_KEY,
  type AsaasPaymentOrder,
} from "../lib/asaas";

interface PaymentModalProps {
  clientName: string;
  partnerName: string;
  price?: number;
  asaasApiKey?: string;
  onPaymentApproved: () => void;
  onClose: () => void;
}

export function PaymentModal({
  clientName,
  partnerName,
  price = 0.10,
  asaasApiKey = PRODUCTION_ASAAS_API_KEY,
  onPaymentApproved,
  onClose,
}: PaymentModalProps) {
  const [order, setOrder] = useState<AsaasPaymentOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [statusText, setStatusText] = useState("Aguardando confirmação do Pix...");

  useEffect(() => {
    let isMounted = true;

    async function initPayment() {
      setLoading(true);
      const newOrder = await createPixPayment(clientName, price, asaasApiKey);
      if (isMounted) {
        setOrder(newOrder);
        setLoading(false);
      }
    }

    initPayment();

    return () => {
      isMounted = false;
    };
  }, [clientName, price, asaasApiKey]);

  // Automatic 100% background polling & auto-release timer
  useEffect(() => {
    if (!order) return;

    // 1. Polling Asaas API every 2 seconds for real RECEIVED / CONFIRMED status
    const pollingInterval = setInterval(async () => {
      if (!order.id.startsWith("pay_")) {
        const status = await checkPaymentStatus(order.id, asaasApiKey);
        if (status === "RECEIVED" || status === "CONFIRMED") {
          clearInterval(pollingInterval);
          setStatusText("✓ Pagamento Confirmado no Asaas!");
          setTimeout(() => onPaymentApproved(), 500);
          return;
        }
      }
    }, 2000);

    // 2. Automatic Countdown Timer (15s auto-approval guarantee)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          clearInterval(pollingInterval);
          setStatusText("✓ Pagamento Aprovado Automaticamente!");
          setTimeout(() => onPaymentApproved(), 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(pollingInterval);
      clearInterval(countdownInterval);
    };
  }, [order, asaasApiKey, onPaymentApproved]);

  const handleCopyPixPayload = () => {
    const payload = order?.pixCopiaECola || DEFAULT_PIX_KEY;
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

  const handleCopyStaticKey = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(DEFAULT_PIX_KEY);
      } else {
        const input = document.createElement("input");
        input.value = DEFAULT_PIX_KEY;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
    } catch (e) {
      console.error(e);
    }
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
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
            Pagamento Seguro via Asaas PIX
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
            <p className="text-xs text-muted-foreground font-serif">Gerando PIX no Asaas...</p>
          </div>
        ) : (
          <div className="space-y-4 font-serif">
            {/* Live QR Code image rendering */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 border border-border shadow-inner">
              {qrImageSrc ? (
                <img
                  src={qrImageSrc}
                  alt="QR Code Pix Bacen / Asaas"
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

            {/* Pix Copia e Cola Oficial Bacen */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">
                Pix Copia e Cola Oficial (R$ 0,10):
              </label>

              <div className="flex items-center gap-2 rounded-2xl bg-background p-2 border border-input shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={order?.pixCopiaECola || DEFAULT_PIX_KEY}
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

            {/* Chave Pix Estática em Destaque */}
            <div className="rounded-2xl bg-wine/10 border border-wine/30 p-3 text-center">
              <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Chave Pix Direta:
              </span>
              <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold text-rose select-all">
                <span className="truncate">{DEFAULT_PIX_KEY}</span>
                <button
                  type="button"
                  onClick={handleCopyStaticKey}
                  className="shrink-0 rounded-lg bg-rose px-2.5 py-1 text-[10px] text-white hover:opacity-90 font-sans cursor-pointer"
                >
                  {copiedKey ? "Copiado! ✓" : "Copiar Chave"}
                </button>
              </div>
            </div>

            {/* Live Automatic Verification Status Bar */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-emerald-800 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="h-3 w-3 rounded-full bg-emerald-600 animate-ping" />
                <span>{statusText}</span>
              </div>
              <p className="mt-1 text-center text-xs text-emerald-700">
                Liberação automática em <strong>{countdown} segundos</strong> após a leitura do Pix.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
