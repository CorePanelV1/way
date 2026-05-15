import React from 'react';
import {useCurrentFrame} from 'remotion';

export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <filter id='g'>
      <feTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' seed='${seed}' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#g)'/>
  </svg>`;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      opacity,
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundSize: '300px',
      mixBlendMode: 'overlay',
      pointerEvents: 'none',
    }}/>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.88}) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 90,
    background: `radial-gradient(ellipse 72% 72% at 50% 50%, transparent 35%, rgba(0,0,0,${strength}) 100%)`,
    pointerEvents: 'none',
  }}/>
);

export const Scanlines: React.FC<{opacity?: number}> = ({opacity = 0.025}) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 85,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
    opacity,
    pointerEvents: 'none',
  }}/>
);

export const AmbientGlow: React.FC<{
  color: string;
  x?: number; y?: number;
  rx?: number; ry?: number;
  opacity?: number;
}> = ({color, x = 50, y = 50, rx = 70, ry = 50, opacity = 1}) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 2,
    background: `radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%, ${color}, transparent)`,
    opacity,
    pointerEvents: 'none',
  }}/>
);

export const CyanSweepLine: React.FC<{progress: number; top?: string}> = ({progress, top = '50%'}) => (
  <div style={{
    position: 'absolute', left: 0, top, zIndex: 50,
    width: `${Math.min(progress, 1) * 100}%`,
    height: 1,
    background: 'linear-gradient(90deg, transparent 0%, #00D4F0 60%, rgba(0,212,240,0.2) 100%)',
    boxShadow: '0 0 10px rgba(0,212,240,0.9), 0 0 30px rgba(0,212,240,0.4)',
    pointerEvents: 'none',
  }}/>
);

export const LightFlash: React.FC<{intensity: number}> = ({intensity}) => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 200,
    background: `rgba(0,212,240,${intensity * 0.35})`,
    pointerEvents: 'none',
  }}/>
);

export const DataLines: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const f = useCurrentFrame();
  const configs = [
    {baseY: 0.18, speed: 0.0012, alpha: 0.07},
    {baseY: 0.42, speed: 0.0009, alpha: 0.05},
    {baseY: 0.65, speed: 0.0014, alpha: 0.06},
    {baseY: 0.83, speed: 0.0008, alpha: 0.04},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', opacity}}>
      {configs.map(({baseY, speed, alpha}, i) => {
        const y = ((baseY + f * speed) % 1) * 100;
        return (
          <div key={i} style={{
            position: 'absolute', top: `${y}%`, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent 0%, rgba(0,212,240,${alpha}) 20%, rgba(0,212,240,${alpha * 1.8}) 50%, rgba(0,212,240,${alpha}) 80%, transparent 100%)`,
          }}/>
        );
      })}
    </div>
  );
};

export const CornerDecor: React.FC<{opacity?: number}> = ({opacity = 0.3}) => (
  <div style={{position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', opacity}}>
    {/* Top-left */}
    <div style={{position: 'absolute', top: 48, left: 40, width: 28, height: 28,
      borderTop: '1px solid rgba(0,212,240,0.5)', borderLeft: '1px solid rgba(0,212,240,0.5)'}}/>
    {/* Top-right */}
    <div style={{position: 'absolute', top: 48, right: 40, width: 28, height: 28,
      borderTop: '1px solid rgba(0,212,240,0.5)', borderRight: '1px solid rgba(0,212,240,0.5)'}}/>
    {/* Bottom-left */}
    <div style={{position: 'absolute', bottom: 48, left: 40, width: 28, height: 28,
      borderBottom: '1px solid rgba(0,212,240,0.5)', borderLeft: '1px solid rgba(0,212,240,0.5)'}}/>
    {/* Bottom-right */}
    <div style={{position: 'absolute', bottom: 48, right: 40, width: 28, height: 28,
      borderBottom: '1px solid rgba(0,212,240,0.5)', borderRight: '1px solid rgba(0,212,240,0.5)'}}/>
  </div>
);
