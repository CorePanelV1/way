export const config = { runtime: 'edge' };

// Curated fallback quotes — used when the LLM returns an empty quote field.
// Each entry is guaranteed to be in the native script of that tradition.
const FALLBACK_QUOTES = {
  arabic: [
    { quote: 'الصبر مفتاح الفرج', translation: 'Patience is the key to relief.', concept: 'Sabr' },
    { quote: 'من صبر ظفر', translation: 'He who is patient, succeeds.', concept: 'Zafar' },
    { quote: 'العلم نور', translation: 'Knowledge is light.', concept: 'Ilm' },
    { quote: 'إنما الأعمال بالنيات', translation: 'Actions are but by intentions.', concept: 'Niyyah' },
  ],
  zen: [
    { quote: '七転び八起き', translation: 'Fall seven times, rise eight.', concept: 'Nana Korobi Ya Oki' },
    { quote: '一期一会', translation: 'One time, one meeting.', concept: 'Ichi-go Ichi-e' },
    { quote: '今ここにいること', translation: 'Being here, now.', concept: 'Ima Koko' },
    { quote: '柔能く剛を制す', translation: 'Softness overcomes hardness.', concept: 'Ju' },
  ],
  stoic: [
    { quote: 'Amor fati.', translation: 'Love of fate.', concept: 'Amor Fati' },
    { quote: 'Nusquam est qui ubique est.', translation: 'One who is everywhere is nowhere.', concept: 'Ataraxia' },
    { quote: 'Dum spiro, spero.', translation: 'While I breathe, I hope.', concept: 'Spes' },
    { quote: 'Per aspera ad astra.', translation: 'Through hardship to the stars.', concept: 'Virtus' },
  ],
  ubuntu: [
    { quote: 'Umuntu ngumuntu ngabantu.', translation: 'A person is a person through other people.', concept: 'Ubuntu' },
    { quote: 'Motho ke motho ka batho.', translation: 'A person is a person through persons.', concept: 'Botho' },
    { quote: 'Umntu akalahlwa.', translation: 'A person is not thrown away.', concept: 'Isithunzi' },
  ],
  sufi: [
    { quote: 'بشنو این نی چون شکایت می‌کند', translation: 'Listen to the reed, how it tells a tale of separation.', concept: 'Ishq' },
    { quote: 'آتش عشق است کاندر نی فتاد', translation: 'The fire of love has fallen into the reed.', concept: 'Fana' },
    { quote: 'دل هر ذره را که بشکافی\nآفتابیش در میان بینی', translation: 'If you split the heart of any atom, you will find a sun within it.', concept: 'Kashf' },
  ],
  taoist: [
    { quote: '知人者智，自知者明', translation: 'Knowing others is wisdom; knowing yourself is enlightenment.', concept: 'Zhi' },
    { quote: '上善若水', translation: 'The highest good is like water.', concept: 'Wu Wei' },
    { quote: '千里之行，始於足下', translation: 'A journey of a thousand miles begins with a single step.', concept: 'Tao' },
  ],
  vedic: [
    { quote: 'योगः कर्मसु कौशलम्', translation: 'Excellence in action is yoga.', concept: 'Dharma' },
    { quote: 'तत् त्वम् असि', translation: 'Thou art that.', concept: 'Brahman' },
    { quote: 'अहिंसा परमो धर्मः', translation: 'Non-violence is the highest duty.', concept: 'Ahimsa' },
  ],
  celtic: [
    { quote: 'Is minic a bhris béal duine a shrón.', translation: 'Many a time a man\'s mouth broke his nose.', concept: 'Anam Cara' },
    { quote: 'Ní neart go cur le chéile.', translation: 'There is no strength without unity.', concept: 'Cairdeas' },
    { quote: 'Ar scáth a chéile a mhaireann na daoine.', translation: 'People live in each other\'s shelter.', concept: 'Dídean' },
  ],
  nordic: [
    { quote: 'Deyr fé, deyja frændr, deyr sjálfr it sama.', translation: 'Cattle die, kinsmen die, you yourself will die.', concept: 'Wyrd' },
    { quote: 'Vits er þörf, þeim er víða ratar.', translation: 'Wisdom is needed by those who travel widely.', concept: 'Hugr' },
    { quote: 'Ganga skal, ei sitja.', translation: 'One must walk, not sit.', concept: 'Framganga' },
  ],
  confucian: [
    { quote: '己所不欲，勿施於人', translation: 'Do not impose on others what you do not want for yourself.', concept: 'Ren' },
    { quote: '學而時習之，不亦說乎', translation: 'To learn and practice what you have learned — is this not a joy?', concept: 'Xue' },
    { quote: '知之者不如好之者，好之者不如樂之者', translation: 'To know is not as good as to love; to love is not as good as to delight in.', concept: 'Le' },
  ],
};

const TRADITIONS = {
  arabic: {
    coord: '23°N 45°E', region: 'Arabia',
    instruction: 'a well-known Arabic/Islamic proverb — quote in Arabic script first, then provide the transliteration',
    genZVoice: 'hilarious Arab bestie energy — "habibi", "wallah", "yalla", "khalas" — like a blunt khala who loves you, funny and warm, 2 sentences max',
  },
  zen: {
    coord: '35°N 135°E', region: 'Kyoto',
    instruction: 'an authentic Japanese Zen saying — MUST be in Japanese characters (kanji/hiragana), never romanized',
    genZVoice: 'deadpan Zen monk who secretly has TikTok — absurdist peaceful chaos, "no thoughts head empty", "the void said", "vibe check", 2 sentences max',
  },
  stoic: {
    coord: '41°N 12°E', region: 'Rome',
    instruction: 'a real Stoic philosopher quote — from Marcus Aurelius, Epictetus, Seneca, or Zeno — Latin or English as originally written',
    genZVoice: 'gym bro who read Marcus Aurelius once and won\'t shut up — "bro", "no cap", "it is what it is", sigma grindset but self-aware, 2 sentences max',
  },
  ubuntu: {
    coord: '26°S 28°E', region: 'Sub-Saharan Africa',
    instruction: 'an authentic Ubuntu/African proverb — include the original language (Zulu, Swahili, Xhosa, or Yoruba) if applicable',
    genZVoice: 'most wholesome community-obsessed bestie — "fr fr", "the village said", warm collective energy, 2 sentences max',
  },
  sufi: {
    coord: '35°N 51°E', region: 'Persia',
    instruction: 'an authentic Sufi/Persian mystical verse — from Rumi, Hafiz, or Omar Khayyam — quote in Persian/Farsi script first',
    genZVoice: 'mystical poet who speaks in riddles but makes it make sense — "babe the universe is literally", "your soul said", ethereal and loving, 2 sentences max',
  },
  taoist: {
    coord: '30°N 114°E', region: 'China',
    instruction: 'an authentic Taoist saying from the Tao Te Ching or Zhuangzi — quote in Traditional Chinese characters first',
    genZVoice: 'chill philosopher who just gets it — "stop fighting the river babes", "wu wei is literally", effortless energy, 2 sentences max',
  },
  vedic: {
    coord: '20°N 77°E', region: 'India',
    instruction: 'an authentic verse from the Bhagavad Gita, Upanishads, or Vedic tradition — include Sanskrit in Devanagari script',
    genZVoice: 'spiritually awakened bestie — "your dharma said", "the Gita lowkey said this", deep but accessible, 2 sentences max',
  },
  celtic: {
    coord: '53°N 8°W', region: 'Ireland',
    instruction: 'an authentic Celtic/Irish proverb — include the original Irish/Gaelic if possible',
    genZVoice: 'wise elder who grew up in the mist — poetic, earthy, slightly dramatic in the best way, "the ancestors said", 2 sentences max',
  },
  nordic: {
    coord: '60°N 11°E', region: 'Scandinavia',
    instruction: 'an authentic Norse/Viking wisdom — from the Havamal, Eddas, or Norse tradition — include Old Norse if applicable',
    genZVoice: 'Viking who somehow discovered self-improvement — "Odin said no cap", bold and direct, "your ancestors didn\'t sail through storms for this", 2 sentences max',
  },
  confucian: {
    coord: '35°N 117°E', region: 'China',
    instruction: 'an authentic Confucian saying from the Analects — include Traditional Chinese characters',
    genZVoice: 'very wise, very composed bestie who has definitely color-coded their planner — "Confucius said (and I agree)", structured but kind, 2 sentences max',
  },
};

function buildSystem(traditions, mode, recentQuotes) {
  const blocks = traditions.map(t => {
    const c = TRADITIONS[t];
    return `  "${t}": {
    "quote": "<REQUIRED: actual original-script text — ${c.instruction}. Real, verifiable saying. NEVER an empty string.>",
    "translation": "faithful English translation (omit if quote is already in English)",
    "concept": "1-4 word concept name from that tradition",
    "context": "2 sentences: why this exact wisdom meets their specific situation — reference details from what they shared, not generic advice",
    "practice": "one concrete, doable action they can take today",
    "genZ": "<${c.genZVoice}>",
    "coordinate": "${c.coord}",
    "region": "${c.region}"
  }`;
  }).join(',\n');

  const avoidBlock = recentQuotes && recentQuotes.length
    ? `\n8. DO NOT use any of these quotes — this person has already received them:\n${recentQuotes.map(q => `   - "${q}"`).join('\n')}\n   Choose a different quote from the same tradition instead.`
    : '';

  return `You are WAY — a cultural wisdom oracle. Read carefully what this person shared about their situation, then respond with wisdom that speaks DIRECTLY to their specific words and feelings.

CRITICAL RULES:
1. Quotes must be REAL and AUTHENTIC — actual proverbs, verses, or sayings from that tradition. Never invent quotes.
2. The "quote" field MUST contain the actual original-language text in native script — this field MUST NEVER be an empty string "":
   - Arabic/Islamic → Arabic calligraphy (right-to-left, e.g. "الصبر مفتاح الفرج")
   - Japanese Zen → Japanese kanji/hiragana (e.g. "七転び八起き")
   - Chinese/Taoist/Confucian → Traditional Chinese characters (e.g. "知人者智，自知者明")
   - Sanskrit/Vedic → Devanagari script (e.g. "योगः कर्मसु कौशलम्")
   - Persian/Sufi → Farsi script (e.g. "بشنو این نی چون شکایت می‌کند")
   - Celtic/Nordic/Stoic → Latin, Old Norse, Irish Gaelic, or original English as written
   - If uncertain of the exact script, use the romanized transliteration — but NEVER leave "quote" empty.
3. "context" field MUST reference specific details from what they shared — if they mention work, a relationship, a decision, name it directly. Generic advice is FORBIDDEN.
4. "practice" must be actionable today, specific to their situation.
5. genZ field must be genuinely funny and culturally flavored — not a bland restatement.
6. Keep all fields concise — no padding, no filler.
7. Respond ONLY with the JSON object below. No preamble, no explanation, no markdown fences.${avoidBlock}

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

  let feeling, traditions, mode, recentQuotes;
  try {
    const body = await req.json();
    feeling = body.feeling?.trim();
    const validKeys = Object.keys(TRADITIONS);
    traditions = Array.isArray(body.traditions) && body.traditions.length
      ? body.traditions.filter(t => validKeys.includes(t))
      : validKeys;
    if (!traditions.length) traditions = validKeys;
    mode = body.mode === 'deep' ? 'deep' : 'standard';
    // Accept up to 10 recent quotes to avoid repeating — strings only, capped at 120 chars each
    recentQuotes = Array.isArray(body.recentQuotes)
      ? body.recentQuotes.filter(q => typeof q === 'string' && q.length > 0).map(q => q.slice(0, 120)).slice(0, 10)
      : [];
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
          { role: 'system', content: buildSystem(traditions, mode, recentQuotes) },
          { role: 'user', content: feeling },
        ],
        max_tokens: mode === 'deep' ? 3500 : 2500,
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
    // If any tradition has an empty quote, substitute from the curated list
    // Prefer entries the user hasn't seen recently
    for (const key of Object.keys(TRADITIONS)) {
      if (wisdom[key] && !wisdom[key].quote) {
        const pool = FALLBACK_QUOTES[key];
        if (pool) {
          const fresh = pool.filter(fb => !recentQuotes.includes(fb.quote));
          const fb = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length || pool.length))];
          wisdom[key].quote = fb.quote;
          if (!wisdom[key].translation) wisdom[key].translation = fb.translation;
          if (!wisdom[key].concept)     wisdom[key].concept     = fb.concept;
        }
      }
    }
    return new Response(JSON.stringify(wisdom), { status: 200, headers });
  } catch (err) {
    console.error('Handler error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), { status: 500, headers });
  }
}
