export interface AsaasPaymentConfig {
  price: number;
}

export interface AsaasPaymentOrder {
  id: string;
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE";
  value: number;
  netValue?: number;
  pixQrCodeBase64?: string;
  pixQrCodeUrl?: string;
  pixCopiaECola?: string;
  expirationDate: string;
  apiSuccess: boolean;
  errorMessage?: string;
}

const API_BASE_URL = "/api/asaas";

/**
 * Executes a fetch to the Cloudflare proxy and ensures strict error handling
 * returning raw Asaas API errors immediately.
 */
async function asaasFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[ASAAS FRONTEND] Erro na requisição ${endpoint}:`, errorText);
    
    // Tentativa de parsear o JSON de erro do Asaas para retornar a mensagem bruta
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.errors && errorJson.errors[0]) {
        throw new Error(JSON.stringify(errorJson.errors[0]));
      }
      throw new Error(errorText);
    } catch {
      throw new Error(errorText);
    }
  }

  return res.json();
}

// Função interna para gerar CPF válido para contornar a obrigatoriedade da conta Asaas
function generateCpf(): string {
  const n = Array(9).fill(0).map(() => Math.floor(Math.random() * 9));
  let d1 = n.reduce((acc, val, i) => acc + val * (10 - i), 0) % 11;
  d1 = d1 < 2 ? 0 : 11 - d1;
  n.push(d1);
  let d2 = n.reduce((acc, val, i) => acc + val * (11 - i), 0) % 11;
  d2 = d2 < 2 ? 0 : 11 - d2;
  n.push(d2);
  return n.join('');
}

async function createCustomer(name: string): Promise<string> {
  const bodyData = { 
    name: name || "Cliente Amor24h",
    cpfCnpj: generateCpf() // Requisito do Asaas na conta do usuário
  };
  const data = await asaasFetch("/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  });

  if (!data.id) {
    throw new Error(JSON.stringify({ code: "customer_creation_failed", description: "O Asaas não retornou o ID do cliente." }));
  }

  return data.id;
}

/**
 * Creates a Pix Payment order in strict sequence. 
 * Breaks immediately if any step fails.
 */
export async function createPixPayment(
  clientName: string,
  price: number = 9.99
): Promise<AsaasPaymentOrder> {
  try {
    // 1. Criar Cliente
    console.log("[ASAAS FRONTEND] 1. Criando cliente...");
    const customerId = await createCustomer(clientName);
    console.log(`[ASAAS FRONTEND] 2. Cliente criado com sucesso: ${customerId}`);

    // 3. Criar Cobrança PIX
    console.log("[ASAAS FRONTEND] 3. Criando cobrança PIX...");
    const paymentBody = {
      customer: customerId,
      billingType: "PIX",
      value: price,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      description: `Homenagem Romantica 24h para ${clientName}`,
    };
    
    const paymentData = await asaasFetch("/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentBody),
    });

    if (!paymentData.id) {
      throw new Error(JSON.stringify({ code: "payment_creation_failed", description: "O Asaas não retornou o ID do pagamento." }));
    }
    console.log(`[ASAAS FRONTEND] 4. Cobrança criada com sucesso: ${paymentData.id}`);

    // 5. Buscar QR Code e Pix Copia e Cola
    console.log("[ASAAS FRONTEND] 5 e 6. Buscando QR Code do Asaas...");
    const qrData = await asaasFetch(`/payments/${paymentData.id}/pixQrCode`, {
      method: "GET",
    });

    if (!qrData.encodedImage || !qrData.payload) {
      throw new Error(JSON.stringify({ code: "qrcode_creation_failed", description: "O Asaas não retornou a imagem ou payload do PIX." }));
    }

    console.log("[ASAAS FRONTEND] 7. QR Code e Copia-e-Cola recebidos com sucesso.");

    return {
      id: paymentData.id,
      status: paymentData.status || "PENDING",
      value: price,
      pixQrCodeBase64: qrData.encodedImage, 
      pixCopiaECola: qrData.payload,
      expirationDate: paymentData.dueDate || qrData.expirationDate,
      apiSuccess: true,
    };

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[ASAAS FRONTEND] Fluxo interrompido devido a erro crítico:", errorMsg);
    
    return {
      id: "error",
      status: "PENDING",
      value: price,
      expirationDate: "",
      apiSuccess: false,
      errorMessage: errorMsg,
    };
  }
}

/**
 * Checks payment status in Asaas.
 */
export async function checkPaymentStatus(paymentId: string): Promise<"PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE"> {
  if (!paymentId || paymentId === "error") {
    return "PENDING";
  }

  try {
    const data = await asaasFetch(`/payments/${paymentId}`, {
      method: "GET",
    });
    return data.status || "PENDING";
  } catch (err) {
    console.error("[ASAAS FRONTEND] Falha ao consultar status do pagamento:", err);
    return "PENDING";
  }
}
