// Server-side link shortener. Browser fetches to TinyURL/is.gd fail because
// those APIs don't send CORS headers, so the client calls this same-origin
// endpoint instead and we shorten server-to-server (no CORS in play).
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const reqUrl = new URL(req.url);
  const target = reqUrl.searchParams.get('url') || '';

  // Only shorten our own share links — never act as an open shortener proxy.
  let parsed;
  try { parsed = new URL(target); } catch {
    return new Response('invalid url', { status: 400 });
  }
  if (parsed.origin !== reqUrl.origin || !parsed.pathname.startsWith('/s')) {
    return new Response('forbidden', { status: 403 });
  }

  const providers = [
    'https://tinyurl.com/api-create.php?url=',
    'https://is.gd/create.php?format=simple&url=',
  ];
  for (const api of providers) {
    try {
      const r = await fetch(api + encodeURIComponent(target), {
        signal: AbortSignal.timeout(6000),
      });
      if (r.ok) {
        const t = (await r.text()).trim();
        if (t.startsWith('http') && t.length < target.length) {
          return new Response(t, {
            status: 200,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              // Same payload always shortens to the same link — cache hard.
              'Cache-Control': 'public, max-age=604800',
            },
          });
        }
      }
    } catch {}
  }
  // Both providers down: hand the long link back, client copies it as-is.
  return new Response(target, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
