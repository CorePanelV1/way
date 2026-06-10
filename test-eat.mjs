// Visual check of the video-eats hero animation at key scroll positions.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';

const MIME = {html:'text/html',js:'text/javascript',css:'text/css',jpg:'image/jpeg',png:'image/png',webp:'image/webp'};
const srv = createServer((req,res)=>{
  let p = req.url.split('?')[0]; if(p==='/') p='/index.html';
  const f = '.'+p;
  if(!existsSync(f)){ res.writeHead(404); return res.end(); }
  res.writeHead(200,{'Content-Type':MIME[p.split('.').pop()]||'application/octet-stream'});
  res.end(readFileSync(f));
}).listen(8788);

const browser = await chromium.launch();
const page = await browser.newPage({viewportSize:{width:1280,height:800}});
page.on('pageerror',e=>console.log('PAGE ERROR:',e.message));
await page.goto('http://localhost:8788/index.html',{waitUntil:'networkidle'});
await page.waitForTimeout(2500); // fonts + priority frames

const total = await page.evaluate(()=>{
  const h=document.getElementById('hero-section');
  return h.offsetHeight - window.innerHeight;
});

for(const tp of [0, 0.12, 0.30, 0.44, 0.55, 0.70, 0.84, 0.92]){
  await page.evaluate(y=>window.scrollTo(0,y), Math.round(tp*total));
  await page.waitForTimeout(900);
  await page.screenshot({path:`shot-tp${String(tp).replace('.','_')}.png`});
  console.log('shot tp='+tp);
}
await browser.close();
srv.close();
