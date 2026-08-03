export async function onRequest(context: { request: Request; params: { path?: string[] } }) {
  const url = new URL(context.request.url);
  const pathArray = context.params.path || [];
  const targetPath = pathArray.join("/");
  const targetUrl = `https://www.asaas.com/api/v3/${targetPath}${url.search}`;

  const modifiedHeaders = new Headers(context.request.headers);
  modifiedHeaders.set("Host", "www.asaas.com");

  if (context.request.method === "OPTIONS") {
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
    const isBodyAllowed = !["GET", "HEAD"].includes(context.request.method);
    const body = isBodyAllowed ? await context.request.arrayBuffer() : undefined;

    const response = await fetch(targetUrl, {
      method: context.request.method,
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
    return new Response(JSON.stringify({ error: "Cloudflare Edge Proxy Error", details: errorMsg }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
