// WAY cultures.js — weekly culture rotation utility
const CULTURES = ['arabic', 'zen', 'stoic', 'ubuntu'];
const CULTURE_META = {
  arabic: { glyph: '☽', label: 'ARABIC',  coord: '23°N 45°E',  region: 'Arabia',            color: '#8c1b35' },
  zen:    { glyph: '⛩', label: 'ZEN',     coord: '35°N 135°E', region: 'Kyoto',              color: '#1a6b58' },
  stoic:  { glyph: 'Φ',  label: 'STOIC',  coord: '41°N 12°E',  region: 'Rome',               color: '#7a4820' },
  ubuntu: { glyph: '◉', label: 'UBUNTU',  coord: '26°S 28°E',  region: 'Sub-Saharan Africa', color: '#7a3010' },
};
const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
const currentCulture = CULTURES[weekNumber % CULTURES.length];
const currentCultureMeta = CULTURE_META[currentCulture];

if (typeof module !== 'undefined') module.exports = { CULTURES, CULTURE_META, weekNumber, currentCulture, currentCultureMeta };
