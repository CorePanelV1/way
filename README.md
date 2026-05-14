# WAY — Where Are You?

Ancient wisdom for exactly where you are. Four traditions. One question.

**Live:** https://way-whereareyou.vercel.app

---

## Setup

1. Clone this repo
2. Deploy to Vercel (zero config — static site with one edge function)
3. Set the environment variable in Vercel dashboard:
   - `GROQ_API_KEY` — from https://console.groq.com

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key for LLaMA 3.3 70B wisdom generation |

## Pages

| URL | File | Description |
|---|---|---|
| `/` | `index.html` | Landing page — hero, scroll grid, philosophy section |
| `/way.html` | `way.html` | Main app — enter feeling, receive bearings |
| `/card` | `card.html` | Shared bearing card (loads from URL params) |
| `/about` | `about.html` | About WAY and the four traditions |
| `/today.html` | `today.html` | Today's daily bearing |

## Architecture

- Pure static HTML/CSS/JS — no framework, no build step, no bundler
- One Vercel Edge Function: `/api/way` — proxies to Groq API
- Fonts: Google Fonts (Cinzel + Cormorant Garamond)
- Animations: GSAP + ScrollTrigger + Lenis smooth scroll + Canvas API
- Sharing: TinyURL short links + Web Share API + clipboard API

## Weekly Culture Rotation

WAY auto-rotates the featured culture every Monday (week number mod 4):

| Week mod 4 | Culture | Glyph | Region |
|---|---|---|---|
| 0 | Arabic | ☽ | 23°N 45°E |
| 1 | Zen | ⛩ | 35°N 135°E |
| 2 | Stoic | Φ | 41°N 12°E |
| 3 | Ubuntu | ◉ | 26°S 28°E |

The rotation is deterministic — no config needed, no database. `Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 4`

## Local Storage Keys

| Key | Type | Description |
|---|---|---|
| `way_onboarded` | `"1"` | Whether user has completed onboarding |
| `way_lastVisit` | timestamp | Unix ms of last visit |
| `way_favs` | JSON array | Saved bearing objects |
| `way_prefs` | JSON array | Preferred tradition keys |

## Deployment

Push to `main` — Vercel auto-deploys. No build command needed.

```bash
git add .
git commit -m "your message"
git push origin main
```

## Wisdom Disclaimer

Wisdom is AI-generated using LLaMA 3.3 70B via Groq. Quotes are intended to reflect authentic traditions — always verify before citing in formal contexts.
