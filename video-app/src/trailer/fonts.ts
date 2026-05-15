import {continueRender, delayRender, staticFile} from 'remotion';

const handle = delayRender('Loading fonts');

(async () => {
  const faces = [
    new FontFace('Bebas Neue', `url("${staticFile('fonts/BebasNeue-400.woff2')}")`, {weight: '400', style: 'normal'}),
    new FontFace('Barlow Condensed', `url("${staticFile('fonts/BarlowCondensed-400.woff2')}")`, {weight: '400', style: 'normal'}),
    new FontFace('Barlow Condensed', `url("${staticFile('fonts/BarlowCondensed-600.woff2')}")`, {weight: '600', style: 'normal'}),
    new FontFace('Barlow Condensed', `url("${staticFile('fonts/BarlowCondensed-700.woff2')}")`, {weight: '700', style: 'normal'}),
    new FontFace('DM Mono', `url("${staticFile('fonts/DMMono-400.woff2')}")`, {weight: '400', style: 'normal'}),
  ];
  const loaded = await Promise.all(faces.map((f) => f.load()));
  loaded.forEach((f) => document.fonts.add(f));
  continueRender(handle);
})();

export const BEBAS   = "'Bebas Neue', Impact, sans-serif";
export const BARLOW  = "'Barlow Condensed', Arial Narrow, sans-serif";
export const MONO    = "'DM Mono', 'Courier New', monospace";
