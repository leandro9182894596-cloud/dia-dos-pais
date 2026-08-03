export default {
  async fetch(request: Request, env: { ASAAS_API_KEY?: string; ASSETS: { fetch: (req: Request) => Promise<Response> } }): Promise<Response> {
    const url = new URL(request.url);

    // Handle Asaas API Proxy Server-to-Server
    if (url.pathname.startsWith("/api/asaas/")) {
      const targetPath = url.pathname.replace("/api/asaas/", "");
      
      const isSandbox = env.ASAAS_API_KEY?.includes("$aact_test") || false;
      const baseUrl = isSandbox ? "https://sandbox.asaas.com/api/v3" : "https://www.asaas.com/api/v3";
      const targetUrl = `${baseUrl}/${targetPath}${url.search}`;

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          },
        });
      }

      try {
        const isBodyAllowed = !["GET", "HEAD"].includes(request.method);
        const body = isBodyAllowed ? await request.arrayBuffer() : undefined;

        // Build headers securely
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
        
        if (env.ASAAS_API_KEY) {
          headers.set("access_token", env.ASAAS_API_KEY);
        } else {
          console.warn("[ASAAS API PROXY] ⚠️ ASAAS_API_KEY está ausente no ambiente do Worker!");
        }

        const maskedKey = env.ASAAS_API_KEY && env.ASAAS_API_KEY.length > 20
          ? `${env.ASAAS_API_KEY.substring(0, 10)}*************${env.ASAAS_API_KEY.substring(env.ASAAS_API_KEY.length - 4)}`
          : "MISSING";

        console.log(`\n[ASAAS API WORKER LOG] ${request.method} ${targetUrl}`);
        console.log(`📌 Ambiente: ${isSandbox ? "Sandbox" : "Produção"}`);
        console.log(`📌 Cabeçalho access_token: ${maskedKey}`);

        const response = await fetch(targetUrl, {
          method: request.method,
          headers,
          body,
        });

        const responseBody = await response.text();

        console.log(`📌 Código HTTP Resposta: ${response.status}`);
        console.log(`📌 Corpo da Resposta: ${responseBody.length > 500 ? responseBody.substring(0, 500) + "..." : responseBody}\n`);

        const responseHeaders = new Headers(response.headers);
        responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.set("Access-Control-Allow-Headers", "*");
        responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        responseHeaders.set("Content-Type", "application/json");

        return new Response(responseBody, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("[ASAAS API WORKER FATAL ERROR]", errorMsg);
        return new Response(
          JSON.stringify({ error: "Cloudflare Worker Proxy Error", details: errorMsg }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // Serve static assets for Cloudflare Worker Assets
    return env.ASSETS.fetch(request);
  },
};
