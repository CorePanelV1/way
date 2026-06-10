// Renders buildWisdomCanvas PNG exports for all 10 traditions (+ worst-case
// long text) and live-tests shortUrl(). Saves PNGs to /tmp/cards/.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const ROOT = '/home/user/way';
const MIME = {'.html':'text/html','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.css':'text/css'};
const srv = createServer((req,res)=>{
  let p = req.url.split('?')[0]; if(p==='/') p='/index.html';
  if(p==='/api/shorten'){ res.writeHead(200,{'Content-Type':'text/plain'}); return res.end('https://tinyurl.com/way-test1'); }
  const f = join(ROOT,p);
  if(existsSync(f)){ res.writeHead(200,{'Content-Type':MIME[extname(f)]||'application/octet-stream'}); res.end(readFileSync(f)); }
  else { res.writeHead(404); res.end('nf'); }
});
await new Promise(r=>srv.listen(8787,r));

mkdirSync('/tmp/cards',{recursive:true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport:{width:1280,height:900}});
page.on('pageerror',e=>console.log('PAGEERROR:',e.message));
await page.goto('http://localhost:8787/way.html',{waitUntil:'networkidle'});

const TRADITIONS = ['arabic','zen','stoic','ubuntu','sufi','taoist','vedic','celtic','nordic','confucian'];
const SAMPLE = {
  quote: 'The wound is the place where the Light enters you, and through it all becomes whole again.',
  translation: 'What breaks you open is also what lets the light reach the parts of you that were sealed.',
  genZ: 'lowkey the stuff that breaks you is exactly how the good stuff gets in. no cap.',
  concept: 'Sabr', coordinate: '24.47°N 39.61°E', region: 'Hejaz'
};
const LONG = {
  quote: 'He who knows that enough is enough will always have enough, and he who chases more than the river can carry will drown in the very abundance he sought, for the cup that overflows wets only the table and never the throat of the one who poured it without measure or patience.',
  translation: 'Contentment is not the absence of desire but the mastery of it; the one who stops at enough keeps everything, while the one who cannot stop loses even what was already safely held in both hands.',
  genZ: 'fr fr if you already have enough and keep grinding for more you will literally fumble the whole bag, like the cup is overflowing and you are still pouring, bestie the table is soaked and you are still thirsty, that is not a flex that is a cry for help honestly.',
  concept: 'Wu Wei', coordinate: '34.5°N 110.1°E', region: 'Henan'
};

const results = [];
for (const k of TRADITIONS){
  const data = k==='taoist' ? LONG : SAMPLE;
  for (const side of ['wisdom','genz']){
    const png = await page.evaluate(async ({k,data,side})=>{
      const meta = (typeof WEEKLY_META!=='undefined'&&WEEKLY_META[k]) || {label:k,glyph:'✦',coord:'0°N 0°E',region:'—',color:'#c9a84c'};
      const fn = new Function('weeklyKey','weeklyMeta','lastWisdom','return ('+buildWisdomCanvas.toString()+')')(k, meta, {[k]:data});
      const c = await fn(side);
      return c.toDataURL('image/png');
    },{k,data,side});
    const buf = Buffer.from(png.split(',')[1],'base64');
    writeFileSync(`/tmp/cards/${k}-${side}.png`, buf);
    // Corner opacity check: decode via canvas in page
    const corners = await page.evaluate(async (dataUrl)=>{
      const img = new Image(); img.src = dataUrl; await img.decode();
      const c = document.createElement('canvas'); c.width=img.width; c.height=img.height;
      const x = c.getContext('2d'); x.drawImage(img,0,0);
      const pts = [[0,0],[img.width-1,0],[0,img.height-1],[img.width-1,img.height-1]];
      return pts.map(([px,py])=>{const d=x.getImageData(px,py,1,1).data;return {a:d[3],rgb:[d[0],d[1],d[2]]};});
    }, png);
    const transparent = corners.some(c=>c.a<255);
    results.push({k,side,transparent,corners:corners.map(c=>c.a).join(',')});
  }
}
console.log('CORNER CHECK (alpha must be 255 in all 4 corners):');
for(const r of results) console.log(`  ${r.k}-${r.side}: ${r.transparent?'❌ TRANSPARENT BLEED':'✓'} [${r.corners}]`);

// Live shortUrl test
const short = await page.evaluate(async ()=>{
  const data={zen:{quote:'Sitting quietly, doing nothing, spring comes, and the grass grows by itself.',translation:'Stillness is not idleness.',concept:'Zazen'}};
  const meta=(typeof WEEKLY_META!=='undefined'&&WEEKLY_META.zen)||{label:'Zen',coord:'35°N',region:'Kyoto'};
  const build=new Function('lastWisdom','weeklyMeta','return ('+buildShareUrl.toString()+')')(data,meta);
  const long = build('zen');
  const s = await shortUrl(long);
  return {long, longLen:long.length, short:s, shortLen:s.length, shortened: s!==long};
});
console.log('\nSHORT LINK TEST:');
console.log(`  long : ${short.longLen} chars`);
console.log(`  short: ${short.short} (${short.shortLen} chars) ${short.shortened?'✓ shortened':'❌ NOT SHORTENED (fallback to long)'}`);

await browser.close(); srv.close();
