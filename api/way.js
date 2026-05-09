// Vercel Edge Function — WAY wisdom generator (Gemini)
export const config = { runtime: 'edge' };

const SYSTEM = `You are WAY — a cultural wisdom oracle. Someone has shared how they feel. Respond with four wisdom bearings, each genuinely tailored to what they said.

Rules:
- Quotes must be AUTHENTIC — real proverbs or sayings from that tradition, not invented
- Original-language quotes must be in the actual script of that culture
- Context must feel personal to what they shared, not generic
- Practice must be one concrete action they can take today, not advice
- Respond ONLY with the JSON object below, no preamble, no explanation

{
  "summary": "3-5 word poetic summary of their emotional state",
  "arabic": {
    "quote": "authentic quote in Arabic script",
    "translation": "faithful English translation",
    "concept": "concept name in 1-4 words",
    "context": "2 sentences on why this wisdom meets them here",
    "practice": "one immediate concrete action",
    "coordinate": "23°N 45°E",
    "region": "Arabia"
  },
  "zen": {
    "quote": "authentic Japanese Zen quote in Japanese",
    "translation": "faithful English translation",
    "concept": "concept name in 1-4 words",
    "context": "2 sentences on why this wisdom meets them here",
    "practice": "one immediate concrete action",
    "coordinate": "35°N 135°E",
    "region": "Kyoto"
  },
  "stoic": {
    "quote": "authentic Stoic quote — Greek, Latin, or English if originally so",
    "translation": "faithful English translation (or same if already English)",
    "concept": "concept name in 1-4 words",
    "context": "2 sentences on why this wisdom meets them here",
    "practice": "one immediate concrete action",
    "coordinate": "41°N 12°E",
    "region": "Rome"
  },
  "ubuntu": {
    "quote": "authentic Ubuntu/African wisdom — indigenous language or English",
    "translation": "faithful English translation",
    "concept": "concept name in 1-4 words",
    "context": "2 sentences on why this wisdom meets them here",
    "practice": "one immediate concrete action",
    "coordinate": "26°S 28°E",
    "region": "Sub-Saharan Africa"
  }
}`;

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  let feeling;
  try {
    const body = await req.json();
    feeling = body.feeling?.trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });
  }

  if (!feeling || feeling.length < 3) {
    return new Response(JSON.stringify({ error: 'Share how you feel — even a few words.' }), { status: 400, headers });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured. Set GROQ_API_KEY in your environment variables.' }), { status: 500, headers });
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: feeling },
        ],
        max_tokens: 2000,
        temperature: 0.9,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Groq error:', err);
      let reason = 'Wisdom generation failed.';
      try {
        const parsed = JSON.parse(err);
        const msg = parsed?.error?.message || parsed?.error?.code;
        if (msg) reason = `Groq: ${msg}`;
      } catch {}
      return new Response(JSON.stringify({ error: reason }), { status: 502, headers });
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return new Response(JSON.stringify({ error: 'Could not parse wisdom. Try again.' }), { status: 500, headers });
    }

    const wisdom = JSON.parse(match[0]);
    return new Response(JSON.stringify(wisdom), { status: 200, headers });
  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500, headers });
  }
}
