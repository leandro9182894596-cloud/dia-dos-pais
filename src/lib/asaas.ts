export interface AsaasPaymentConfig {
  apiKey?: string;
  environment: "sandbox" | "production";
  price: number; // Price in BRL (e.g., 9.90)
}

export interface AsaasPaymentOrder {
  id: string;
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE";
  value: number;
  netValue?: number;
  pixQrCodeBase64?: string;
  pixCopiaECola?: string;
  expirationDate: string;
}

const ASAAS_SANDBOX_URL = "https://sandbox.asaas.com/api/v3";
const ASAAS_PRODUCTION_URL = "https://www.asaas.com/api/v3";

/**
 * Creates a new Pix Payment for a tribute creation.
 * If API Key is not configured, generates a simulated test Pix payload
 * allowing full commercial testing before adding live Asaas production credentials.
 */
export async function createPixPayment(
  clientName: string,
  price: number = 9.90,
  apiKey?: string,
  environment: "sandbox" | "production" = "sandbox"
): Promise<AsaasPaymentOrder> {
  const baseUrl = environment === "production" ? ASAAS_PRODUCTION_URL : ASAAS_SANDBOX_URL;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      // 1. Create payment
      const res = await fetch(`${baseUrl}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: apiKey,
        },
        body: JSON.stringify({
          customer: "cus_000005527072", // Default customer or created customer
          billingType: "PIX",
          value: price,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          description: `Homenagem Romântica 24h para ${clientName}`,
        }),
      });

      if (res.ok) {
        const paymentData = await res.json();
        
        // 2. Fetch Pix QR Code
        const qrRes = await fetch(`${baseUrl}/payments/${paymentData.id}/pixQrCode`, {
          headers: { access_token: apiKey },
        });

        let qrBase64 = "";
        let copiaECola = "";
        if (qrRes.ok) {
          const qrData = await qrRes.json();
          qrBase64 = qrData.encodedImage;
          copiaECola = qrData.payload;
        }

        return {
          id: paymentData.id,
          status: paymentData.status || "PENDING",
          value: price,
          pixQrCodeBase64: qrBase64,
          pixCopiaECola: copiaECola,
          expirationDate: paymentData.dueDate,
        };
      }
    } catch (err) {
      console.warn("Erro ao conectar com API do Asaas, alternando para simulação de teste:", err);
    }
  }

  // Demo / Fallback Simulated Pix Order for Testing
  const fakeId = "pay_" + Math.random().toString(36).substring(2, 10);
  const fakeCopiaECola = `00020126580014br.gov.bcb.pix0136amor24h-${fakeId}52040000530398654049.905802BR5907AMOR24H6009SAO_PAULO62070503***6304E8A2`;

  return {
    id: fakeId,
    status: "PENDING",
    value: price,
    pixCopiaECola: fakeCopiaECola,
    expirationDate: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString("pt-BR"),
  };
}

/**
 * Checks the status of a payment in Asaas API.
 */
export async function checkPaymentStatus(
  paymentId: string,
  apiKey?: string,
  environment: "sandbox" | "production" = "sandbox"
): Promise<"PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE"> {
  if (!apiKey || paymentId.startsWith("pay_")) {
    return "PENDING";
  }

  const baseUrl = environment === "production" ? ASAAS_PRODUCTION_URL : ASAAS_SANDBOX_URL;
  try {
    const res = await fetch(`${baseUrl}/payments/${paymentId}`, {
      headers: { access_token: apiKey },
    });
    if (res.ok) {
      const data = await res.json();
      return data.status;
    }
  } catch (err) {
    console.error("Erro ao verificar status do pagamento:", err);
  }
  return "PENDING";
}
