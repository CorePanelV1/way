export const config = { runtime: 'edge' };

const TRADITIONS = {
  arabic: { coord: '23°N 45°E', region: 'Arabia',           instruction: 'authentic Arabic/Islamic proverb — quote in Arabic script' },
  zen:    { coord: '35°N 135°E', region: 'Kyoto',            instruction: 'authentic Japanese Zen saying — quote MUST be written in Japanese characters (kanji/hiragana), never romanized' },
  stoic:  { coord: '41°N 12°E',  region: 'Rome',             instruction: 'authentic Stoic quote — Greek, Latin, or English if originally so' },
  ubuntu: { coord: '26°S 28°E',  region: 'Sub-Saharan Africa', instruction: 'authentic Ubuntu/African wisdom — indigenous language or English' },
};

function buildSystem(traditions, mode) {
  const deepField = mode === 'deep'
    ? `"narrative": "4 sentences: what the philosopher was facing when they wrote this, why this quote survived millennia, how it mirrors exactly what this person shared, and one image or metaphor that makes the wisdom visceral and personal",`
    : '';

  const blocks = traditions.map(t => {
    const c = TRADITIONS[t];
    return `  "${t}": {
    "quote": "${c.instruction}",
    "translation": "faithful English translation (repeat quote if already English)",
    "concept": "concept name in 1-4 words",
    "context": "2 sentences — why this wisdom meets them exactly here, not generic",
    "practice": "one concrete action they can take before tonight",
    ${deepField}
    "coordinate": "${c.coord}",
    "region": "${c.region}"
  }`;
  }).join(',\n');

  return `You are WAY — a cultural wisdom oracle. Someone has shared how they feel. Respond with wisdom bearings that are genuinely tailored to what they said.

Rules:
- Quotes must be AUTHENTIC — real proverbs or sayings from that tradition, never invented
- Original-language quotes must be in the actual script of that culture
- Context and practice must feel personal to what they shared — not generic
- Respond ONLY with the JSON object below. No preamble, no explanation.

{
  "summary": "3-5 word poetic summary of their emotional state",
${blocks}
}`;
}

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  let feeling, traditions, mode;
  try {
    const body = await req.json();
    feeling = body.feeling?.trim();
    const validKeys = Object.keys(TRADITIONS);
    traditions = Array.isArray(body.traditions) && body.traditions.length
      ? body.traditions.filter(t => validKeys.includes(t))
      : validKeys;
    if (!traditions.length) traditions = validKeys;
    mode = body.mode === 'deep' ? 'deep' : 'standard';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });
  }

  if (!feeling || feeling.length < 3) {
    return new Response(JSON.stringify({ error: 'Share how you feel — even a few words.' }), { status: 400, headers });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured. Set GROQ_API_KEY in Vercel.' }), { status: 500, headers });
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: buildSystem(traditions, mode) },
          { role: 'user', content: feeling },
        ],
        max_tokens: mode === 'deep' ? 3500 : 2000,
        temperature: 0.9,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Groq error:', err);
      let reason = 'Wisdom generation failed.';
      try { const p = JSON.parse(err); const m = p?.error?.message || p?.error?.code; if (m) reason = `Groq: ${m}`; } catch {}
      return new Response(JSON.stringify({ error: reason }), { status: 502, headers });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return new Response(JSON.stringify({ error: 'Could not parse wisdom. Try again.' }), { status: 500, headers });

    const wisdom = JSON.parse(match[0]);
    return new Response(JSON.stringify(wisdom), { status: 200, headers });
  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500, headers });
  }
}
