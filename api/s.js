// /s share links: serves real OpenGraph tags (quote as title, per-tradition
// image) so WhatsApp/X/iMessage previews show actual content, then sends
// human visitors straight to the client-rendered card at /s.html.
export const config = { runtime: 'edge' };

const TRADITIONS = ['arabic','zen','stoic','ubuntu','sufi','taoist','vedic','celtic','nordic','confucian'];

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export default function handler(req) {
  const url = new URL(req.url);
  const d = url.searchParams.get('d') || '';

  let k = 'arabic', q = '', t = '';
  try {
    const bytes = atob(d);
    const json = decodeURIComponent(
      Array.from(bytes, c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
    const p = JSON.parse(json);
    if (TRADITIONS.includes(p.k)) k = p.k;
    q = String(p.q || '').slice(0, 200);
    t = String(p.t || '').slice(0, 200);
  } catch {}

  const label = k.charAt(0).toUpperCase() + k.slice(1);
  const title = q ? `“${q}” — ${label} wisdom on WAY` : 'WAY — Find Your Bearing';
  const desc  = t || 'Ancient wisdom for exactly where you are. Ten traditions, one a week.';
  const dest  = '/s.html' + (d ? '?d=' + encodeURIComponent(d) : '');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="${url.origin}/og-${k}.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="${url.origin}/og-${k}.png"/>
<meta name="robots" content="noindex"/>
<meta http-equiv="refresh" content="0;url=${esc(dest)}"/>
</head>
<body style="background:#0a0608">
<script>location.replace(${JSON.stringify(dest)});</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
