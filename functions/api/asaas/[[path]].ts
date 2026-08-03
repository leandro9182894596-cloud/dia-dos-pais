async function handleAsaasProxy(request: Request, pathArray?: string[]): Promise<Response> {
  const url = new URL(request.url);
  const targetPath = pathArray ? pathArray.join("/") : url.pathname.replace("/api/asaas/", "");
  const targetUrl = `https://www.asaas.com/api/v3/${targetPath}${url.search}`;

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
    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set("Host", "www.asaas.com");

    const isBodyAllowed = !["GET", "HEAD"].includes(request.method);
    const body = isBodyAllowed ? await request.arrayBuffer() : undefined;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: modifiedHeaders,
      body: body,
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Headers", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: "Cloudflare Proxy Error", details: errorMsg }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

export async function onRequestPost(context: { request: Request; params: { path?: string[] } }) {
  return handleAsaasProxy(context.request, context.params.path);
}

export async function onRequestGet(context: { request: Request; params: { path?: string[] } }) {
  return handleAsaasProxy(context.request, context.params.path);
}

export async function onRequestOptions(context: { request: Request; params: { path?: string[] } }) {
  return handleAsaasProxy(context.request, context.params.path);
}

export async function onRequest(context: { request: Request; params: { path?: string[] } }) {
  return handleAsaasProxy(context.request, context.params.path);
}
