import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadBarlow} from '@remotion/google-fonts/BarlowCondensed';
import {
  FilmGrain,
  Vignette,
  AmbientGlow,
  CyanSweepLine,
  LightFlash,
  DataLines,
  Scanlines,
  CornerDecor,
} from './effects';

const {fontFamily: BEBAS} = loadBebas();
const {fontFamily: BARLOW} = loadBarlow();

// ─── palette ───────────────────────────────────────────────
const CYAN   = '#00D4F0';
const RED    = '#ef4444';
const AMBER  = '#f59e0b';
const GREEN  = '#10b981';
const TEXT   = '#eef0f8';
const MUTED  = '#7a85a0';

const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fi = (f: number, range: number[], out: number[]) => interpolate(f, range, out, C);

// ─── FPS / durations ───────────────────────────────────────
export const TRAILER_FPS = 30;
export const TRAILER_FRAMES = 900; // 30 s

// Scene windows (start, duration)
const S1 = {from: 0,   dur: 90};   // 0–3 s    Pre-dawn
const S2 = {from: 90,  dur: 150};  // 3–8 s    The problem
const S3 = {from: 240, dur: 180};  // 8–14 s   The reveal
const S4A = {from: 420, dur: 120}; // 14–18 s  Readiness grid
const S4B = {from: 540, dur: 120}; // 18–22 s  Fight countdown
const S5 = {from: 660, dur: 150};  // 22–27 s  Money shot
const S6 = {from: 810, dur: 90};   // 27–30 s  Logo / CTA

// ══════════════════════════════════════════════════════════
// SCENE 1 — PRE-DAWN
// ══════════════════════════════════════════════════════════
const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const beat = (Math.sin((f / 8) * Math.PI) + 1) / 2;
  const op   = fi(f, [5, 22, 70, 88], [0, 1, 1, 0]);
  const subY = fi(f, [15, 30], [16, 0]);

  return (
    <AbsoluteFill style={{background: '#05070b'}}>
      <Img src={staticFile("frames/bg-s1.jpg")} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.12, filter: 'brightness(0.4) saturate(0.3)',
      }} />
      <AmbientGlow color={`rgba(239,68,68,${beat * 0.14})`} x={50} y={115} rx={120} ry={55}/>
      <AmbientGlow color='rgba(0,212,240,0.05)' x={50} y={-5} rx={70} ry={30}/>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: op,
      }}>
        {/* Giant timestamp */}
        <div style={{
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontSize: 164, color: TEXT,
          letterSpacing: '0.04em', lineHeight: 1,
          textShadow: '0 0 80px rgba(255,255,255,0.07)',
        }}>
          05:47
        </div>

        {/* A.M. label */}
        <div style={{
          fontFamily: BARLOW,
          fontSize: 20, fontWeight: 700,
          letterSpacing: '0.75em', textTransform: 'uppercase',
          color: MUTED, marginTop: 14,
          transform: `translateY(${subY}px)`,
        }}>
          A.M.
        </div>

        {/* Divider */}
        <div style={{
          width: 48, height: 1, margin: '28px auto',
          background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
          boxShadow: '0 0 12px rgba(0,212,240,0.6)',
        }}/>

        {/* Caption */}
        <div style={{
          fontFamily: BARLOW,
          fontSize: 19, fontWeight: 400,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(0,212,240,0.5)',
          transform: `translateY(${subY}px)`,
        }}>
          THE QUESTIONS HAVEN'T SLEPT
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════
// SCENE 2 — THE PROBLEM
// ══════════════════════════════════════════════════════════
const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lineOp = fi(f, [8, 22, 105, 130], [0, 1, 1, 0]);
  const lineY  = fi(f, [8, 22], [24, 0]);

  const numSp  = spring({frame: f - 18, fps, config: {damping: 8, stiffness: 200, mass: 0.35}});
  const numOp  = fi(f, [18, 28, 110, 132], [0, 1, 1, 0]);

  const q1Op   = fi(f, [52, 68, 118, 140], [0, 1, 1, 0]);
  const q1Y    = fi(f, [52, 68], [20, 0]);
  const q2Op   = fi(f, [70, 85, 118, 140], [0, 1, 1, 0]);
  const q2Y    = fi(f, [70, 85], [20, 0]);

  const redGlow = fi(f, [0, 80], [0.04, 0.20]);

  return (
    <AbsoluteFill style={{background: '#070910'}}>
      <AmbientGlow color={`rgba(239,68,68,${redGlow})`} x={50} y={118} rx={110} ry={55}/>
      <AmbientGlow color='rgba(0,212,240,0.04)' x={10} y={15} rx={60} ry={35}/>
      <DataLines opacity={0.6}/>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 64px',
      }}>
        {/* "Your gym has" */}
        <div style={{
          fontFamily: BARLOW, fontSize: 30, fontWeight: 400,
          color: MUTED, letterSpacing: '0.2em', textTransform: 'uppercase',
          opacity: lineOp, transform: `translateY(${lineY}px)`,
        }}>
          Your gym has
        </div>

        {/* "12" giant */}
        <div style={{
          fontFamily: BEBAS,
          fontSize: 260, color: TEXT, lineHeight: 0.8,
          textShadow: '0 0 120px rgba(255,255,255,0.05)',
          opacity: numOp,
          transform: `scale(${0.55 + numSp * 0.45})`,
          transformOrigin: 'center',
        }}>
          12
        </div>

        {/* "FIGHTERS" */}
        <div style={{
          fontFamily: BEBAS,
          fontSize: 76, color: CYAN,
          letterSpacing: '0.22em', lineHeight: 1,
          textShadow: `0 0 50px rgba(0,212,240,0.55)`,
          opacity: numOp, marginTop: -6,
        }}>
          FIGHTERS
        </div>

        <div style={{height: 40}}/>

        {/* Question 1 */}
        <div style={{
          fontFamily: BARLOW, fontSize: 40, fontWeight: 600,
          color: 'rgba(238,240,248,0.88)',
          letterSpacing: '0.07em', textTransform: 'uppercase',
          opacity: q1Op, transform: `translateY(${q1Y}px)`,
          textAlign: 'center',
        }}>
          Who's ready to push?
        </div>

        {/* Question 2 */}
        <div style={{
          fontFamily: BARLOW, fontSize: 40, fontWeight: 600,
          color: AMBER,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          opacity: q2Op, transform: `translateY(${q2Y}px)`,
          textAlign: 'center', marginTop: 10,
        }}>
          Who needs protecting?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════
// SCENE 3 — THE REVEAL
// ══════════════════════════════════════════════════════════
const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Flash on entry
  const flashOp = fi(f, [0, 4, 14], [0.8, 0.8, 0]);

  // Logo "STRIKE" slides in from left, "PANEL" from right
  const strikeSp = spring({frame: f - 8,  fps, config: {damping: 14, stiffness: 120, mass: 0.5}});
  const panelSp  = spring({frame: f - 14, fps, config: {damping: 14, stiffness: 120, mass: 0.5}});
  const strikeX  = fi(f, [8, 8], [-200, -200]) * (1 - strikeSp);
  const panelX   = fi(f, [14, 14], [200, 200]) * (1 - panelSp);
  const logoOp   = fi(f, [8, 20, 165, 180], [0, 1, 1, 0]);

  // Cyan glow builds
  const glowStr  = fi(f, [20, 60], [0, 0.22]);

  // Sweep line: travels bottom→top between f=50 and f=100
  const sweepProgress = fi(f, [50, 100], [0, 1]);
  const sweepY = `${100 - sweepProgress * 100}%`;

  // "TRAINING INTELLIGENCE" tracks in
  const tagOp   = fi(f, [80, 100, 165, 180], [0, 1, 1, 0]);
  const tagLS   = fi(f, [80, 110], [0.8, 0.18]);

  // App mockup panel
  const mockOp  = fi(f, [110, 135, 165, 180], [0, 1, 1, 0]);
  const mockY   = fi(f, [110, 135], [40, 0]);

  const superscriptOp = fi(f, [20, 35], [0, 1]);

  return (
    <AbsoluteFill style={{background: '#0b0d14'}}>
      <Img src={staticFile("frames/bg-s3.jpg")} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.12, filter: 'brightness(0.4) saturate(0.3)',
      }} />
      <AmbientGlow color={`rgba(0,212,240,${glowStr})`} x={50} y={40} rx={90} ry={60}/>
      <AmbientGlow color='rgba(139,92,246,0.06)' x={80} y={90} rx={60} ry={40}/>
      <DataLines opacity={0.8}/>
      <LightFlash intensity={flashOp}/>

      {/* Sweep line */}
      <CyanSweepLine progress={sweepProgress} top={sweepY}/>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Logo */}
        <div style={{opacity: logoOp, position: 'relative', textAlign: 'center'}}>
          <div style={{
            fontFamily: BEBAS,
            fontSize: 130, lineHeight: 0.88,
            letterSpacing: '0.08em',
            color: TEXT,
            textShadow: `0 0 60px rgba(0,212,240,0.25)`,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0,
          }}>
            <span style={{transform: `translateX(${strikeX}px)`, display: 'inline-block'}}>
              STRIKE
            </span>
            <span style={{
              transform: `translateX(${panelX}px)`,
              display: 'inline-block', color: CYAN,
              textShadow: `0 0 40px rgba(0,212,240,0.7)`,
            }}>
              PANEL
            </span>
            <span style={{
              fontFamily: BARLOW, fontSize: 32, fontWeight: 700,
              color: CYAN, lineHeight: 1, marginTop: 12, marginLeft: 3,
              opacity: superscriptOp,
              textShadow: `0 0 20px rgba(0,212,240,0.8)`,
            }}>
              ™
            </span>
          </div>

          {/* Glow bar under logo */}
          <div style={{
            height: 1, width: '80%', margin: '16px auto 0',
            background: `linear-gradient(90deg, transparent, ${CYAN}, rgba(139,92,246,0.8), transparent)`,
            boxShadow: '0 0 12px rgba(0,212,240,0.5)',
          }}/>
        </div>

        {/* TRAINING INTELLIGENCE */}
        <div style={{
          fontFamily: BARLOW, fontSize: 26, fontWeight: 700,
          letterSpacing: `${tagLS}em`, textTransform: 'uppercase',
          color: 'rgba(0,212,240,0.8)', marginTop: 18,
          opacity: tagOp,
        }}>
          TRAINING INTELLIGENCE
        </div>

        {/* App mockup mini-panel */}
        <div style={{
          marginTop: 48,
          opacity: mockOp,
          transform: `translateY(${mockY}px)`,
          width: 360,
        }}>
          <AppMiniPanel/>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Inline app mockup
const AppMiniPanel: React.FC = () => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(24,28,40,0.95), rgba(19,22,31,0.98))',
    border: '1px solid rgba(0,212,240,0.18)',
    borderRadius: 14, padding: '18px 20px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,240,0.06)',
  }}>
    {/* header */}
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.25em', textTransform: 'uppercase',
      color: 'rgba(0,212,240,0.7)', marginBottom: 14,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <div style={{width: 5, height: 5, borderRadius: '50%', background: CYAN,
        boxShadow: '0 0 6px rgba(0,212,240,0.8)'}}/>
      MORNING BRIEF — SQUAD READINESS
    </div>

    {/* athlete rows */}
    {[
      {name: 'MARTINEZ', score: 91, color: GREEN,  label: 'READY'},
      {name: 'CHEN',     score: 74, color: AMBER,   label: 'CAUTION'},
      {name: 'RODRIGUEZ',score: 42, color: RED,     label: 'REST'},
    ].map(({name, score, color, label}) => (
      <div key={name} style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '7px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
          color: 'rgba(238,240,248,0.7)', minWidth: 80,
        }}>
          {name}
        </div>
        <div style={{flex: 1, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2}}>
          <div style={{
            width: `${score}%`, height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          }}/>
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 22, color, letterSpacing: '0.05em', minWidth: 30, textAlign: 'right',
        }}>
          {score}
        </div>
      </div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════
// SCENE 4A — READINESS GRID
// ══════════════════════════════════════════════════════════
const athletes = [
  {name: 'MARTINEZ', score: 91, status: 'READY',   color: GREEN,  delay: 4},
  {name: 'OKAFOR',   score: 88, status: 'READY',   color: GREEN,  delay: 10},
  {name: 'CHEN',     score: 74, status: 'CAUTION', color: AMBER,  delay: 16},
  {name: 'RODRIGUEZ',score: 42, status: 'REST',    color: RED,    delay: 22},
];

const ReadinessCard: React.FC<{
  name: string; score: number; status: string; color: string; delay: number;
}> = ({name, score, status, color, delay}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sp  = spring({frame: f - delay, fps, config: {damping: 12, stiffness: 140, mass: 0.4}});
  const op  = fi(f, [delay, delay + 12], [0, 1]);
  const bw  = fi(f, [delay + 8, delay + 28], [0, score]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(24,28,40,0.92), rgba(19,22,31,0.96))',
      border: `1px solid ${color}28`,
      borderRadius: 14, padding: 20,
      opacity: op,
      transform: `translateY(${(1 - sp) * 40}px)`,
      boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${color}18`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.7,
      }}/>

      <div style={{
        fontFamily: BARLOW, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: MUTED, marginBottom: 12,
      }}>
        {name}
      </div>

      <div style={{
        fontFamily: BEBAS, fontSize: 72,
        color, lineHeight: 1, letterSpacing: '0.02em',
        textShadow: `0 0 30px ${color}66`,
      }}>
        {Math.round(bw)}
      </div>

      <div style={{
        height: 4, background: 'rgba(255,255,255,0.06)',
        borderRadius: 2, overflow: 'hidden', margin: '10px 0',
      }}>
        <div style={{
          width: `${bw}%`, height: '100%', borderRadius: 2,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          boxShadow: `0 0 8px ${color}66`,
        }}/>
      </div>

      <div style={{
        display: 'inline-block',
        fontFamily: BARLOW, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        padding: '3px 10px', borderRadius: 999,
        background: `${color}18`, color, border: `1px solid ${color}35`,
      }}>
        {status}
      </div>
    </div>
  );
};

const Scene4A: React.FC = () => {
  const f = useCurrentFrame();
  const titleOp = fi(f, [0, 18], [0, 1]);
  const titleY  = fi(f, [0, 18], [20, 0]);
  const cyanGlow = fi(f, [0, 60], [0.06, 0.16]);

  return (
    <AbsoluteFill style={{background: '#0b0d14', padding: '60px 40px'}}>
      <AmbientGlow color={`rgba(0,212,240,${cyanGlow})`} x={50} y={-5} rx={90} ry={40}/>
      <DataLines opacity={0.5}/>

      <div style={{
        fontFamily: BARLOW, fontSize: 15, fontWeight: 700,
        letterSpacing: '0.4em', textTransform: 'uppercase',
        color: 'rgba(0,212,240,0.6)', marginBottom: 8,
        opacity: titleOp, transform: `translateY(${titleY}px)`,
      }}>
        ⚡ MORNING BRIEF
      </div>

      <div style={{
        fontFamily: BEBAS, fontSize: 52, letterSpacing: '0.06em', color: TEXT,
        opacity: titleOp, transform: `translateY(${titleY}px)`,
        marginBottom: 28,
        textShadow: '0 0 40px rgba(255,255,255,0.06)',
      }}>
        SQUAD READINESS
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
        {athletes.map((a) => (
          <ReadinessCard key={a.name} {...a}/>
        ))}
      </div>

      {/* Bottom tag */}
      <div style={{
        marginTop: 28,
        fontFamily: BARLOW, fontSize: 12, fontWeight: 400,
        letterSpacing: '0.25em', textTransform: 'uppercase',
        color: 'rgba(122,133,160,0.5)',
        opacity: fi(f, [50, 70], [0, 1]),
      }}>
        DAILY READINESS INTELLIGENCE
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════
// SCENE 4B — FIGHT COUNTDOWN
// ══════════════════════════════════════════════════════════
const Scene4B: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const labelOp = fi(f, [0, 18], [0, 1]);
  const numSp   = spring({frame: f - 10, fps, config: {damping: 7, stiffness: 220, mass: 0.3}});
  const numOp   = fi(f, [10, 22], [0, 1]);
  const barW    = fi(f, [30, 80], [0, 68]);
  const restOp  = fi(f, [40, 60], [0, 1]);
  const pulse   = 0.14 + 0.07 * Math.abs(Math.sin(f / 10 * Math.PI));
  const redGlow = fi(f, [0, 50], [0.08, 0.24]);

  return (
    <AbsoluteFill style={{background: '#0b0d14', padding: '60px 44px'}}>
      <AmbientGlow color={`rgba(239,68,68,${redGlow})`} x={50} y={115} rx={110} ry={55}/>
      <AmbientGlow color={`rgba(239,68,68,${pulse})`} x={50} y={30} rx={70} ry={50}/>

      {/* Section label */}
      <div style={{
        fontFamily: BARLOW, fontSize: 14, fontWeight: 700,
        letterSpacing: '0.4em', textTransform: 'uppercase',
        color: 'rgba(239,68,68,0.65)', marginBottom: 8,
        opacity: labelOp,
      }}>
        🥊 FIGHT DATES
      </div>

      <div style={{
        fontFamily: BEBAS, fontSize: 48, letterSpacing: '0.05em', color: TEXT,
        opacity: labelOp, marginBottom: 28,
      }}>
        COUNTDOWN
      </div>

      {/* Fight card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(139,92,246,0.05))',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 16, padding: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
        }}/>

        {/* Countdown number */}
        <div style={{
          fontFamily: BEBAS, fontSize: 200, lineHeight: 0.82,
          color: RED,
          textShadow: `0 0 80px rgba(239,68,68,${pulse}), 0 0 160px rgba(239,68,68,0.12)`,
          opacity: numOp,
          transform: `scale(${0.55 + numSp * 0.45})`,
          transformOrigin: 'top left',
        }}>
          14
        </div>

        <div style={{
          fontFamily: BEBAS, fontSize: 36, letterSpacing: '0.2em',
          color: 'rgba(239,68,68,0.7)', marginTop: -8, opacity: numOp,
        }}>
          DAYS TO FIGHT NIGHT
        </div>

        <div style={{height: 20}}/>

        {/* Fighter name */}
        <div style={{
          fontFamily: BEBAS, fontSize: 52, color: TEXT,
          letterSpacing: '0.06em', opacity: restOp,
          textShadow: '0 0 30px rgba(255,255,255,0.07)',
        }}>
          MARCUS RODRIGUEZ
        </div>

        <div style={{
          fontFamily: BARLOW, fontSize: 13, color: MUTED,
          letterSpacing: '0.1em', marginTop: 4, opacity: restOp,
        }}>
          Welterweight · 72.1 kg → TARGET 70.3 kg
        </div>

        {/* Weight cut bar */}
        <div style={{
          height: 6, background: 'rgba(255,255,255,0.06)',
          borderRadius: 3, overflow: 'hidden', margin: '14px 0 6px',
          opacity: restOp,
        }}>
          <div style={{
            width: `${barW}%`, height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${RED}, #f87171)`,
            boxShadow: '0 0 10px rgba(239,68,68,0.5)',
            transition: 'width 0.3s',
          }}/>
        </div>

        <div style={{
          fontFamily: BARLOW, fontSize: 11, color: 'rgba(239,68,68,0.6)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          opacity: restOp,
        }}>
          WEIGHT CUT — 68% COMPLETE
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════
// SCENE 5 — MONEY SHOT
// ══════════════════════════════════════════════════════════
const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Line 1: "KNOW WHO TO PUSH."
  const l1Sp  = spring({frame: f - 4,  fps, config: {damping: 10, stiffness: 150, mass: 0.4}});
  const l1Op  = fi(f, [4, 16, 105, 120], [0, 1, 1, 0]);
  const l1X   = (1 - l1Sp) * -220;

  // Line 2: "KNOW WHO TO PROTECT."
  const l2Sp  = spring({frame: f - 18, fps, config: {damping: 10, stiffness: 150, mass: 0.4}});
  const l2Op  = fi(f, [18, 30, 105, 120], [0, 1, 1, 0]);
  const l2X   = (1 - l2Sp) * 220;

  // Separator line
  const lineOp = fi(f, [35, 50, 100, 120], [0, 1, 1, 0]);

  // Line 3: "EVERY. MORNING."
  const l3Sp   = spring({frame: f - 68, fps, config: {damping: 8, stiffness: 200, mass: 0.3}});
  const l3Op   = fi(f, [68, 82, 135, 150], [0, 1, 1, 0]);
  const l3Scale = 0.5 + l3Sp * 0.5;

  const bgGlow  = fi(f, [0, 60], [0.08, 0.22]);

  return (
    <AbsoluteFill style={{background: '#050709'}}>
      <Img src={staticFile("frames/bg-s5.jpg")} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.12, filter: 'brightness(0.4) saturate(0.3)',
      }} />
      <AmbientGlow color={`rgba(0,212,240,${bgGlow})`} x={50} y={50} rx={90} ry={70}/>
      <DataLines opacity={0.4}/>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 44px',
      }}>
        {/* Line 1 */}
        <div style={{
          fontFamily: BEBAS, fontSize: 88, lineHeight: 0.92,
          color: TEXT, letterSpacing: '0.04em',
          textShadow: '0 0 60px rgba(255,255,255,0.07)',
          opacity: l1Op, transform: `translateX(${l1X}px)`,
          alignSelf: 'flex-start',
        }}>
          KNOW WHO
        </div>
        <div style={{
          fontFamily: BEBAS, fontSize: 88, lineHeight: 0.92,
          color: CYAN, letterSpacing: '0.04em',
          textShadow: `0 0 50px rgba(0,212,240,0.6)`,
          opacity: l1Op, transform: `translateX(${l1X}px)`,
          alignSelf: 'flex-start',
        }}>
          TO PUSH.
        </div>

        {/* Divider */}
        <div style={{
          width: '100%', height: 1, margin: '20px 0',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          opacity: lineOp,
        }}/>

        {/* Line 2 */}
        <div style={{
          fontFamily: BEBAS, fontSize: 88, lineHeight: 0.92,
          color: TEXT, letterSpacing: '0.04em',
          textShadow: '0 0 60px rgba(255,255,255,0.07)',
          opacity: l2Op, transform: `translateX(${l2X}px)`,
          alignSelf: 'flex-end', textAlign: 'right',
        }}>
          KNOW WHO
        </div>
        <div style={{
          fontFamily: BEBAS, fontSize: 88, lineHeight: 0.92,
          color: AMBER, letterSpacing: '0.04em',
          textShadow: `0 0 50px rgba(245,158,11,0.6)`,
          opacity: l2Op, transform: `translateX(${l2X}px)`,
          alignSelf: 'flex-end', textAlign: 'right',
        }}>
          TO PROTECT.
        </div>

        <div style={{height: 40}}/>

        {/* Line 3 — the punch */}
        <div style={{
          fontFamily: BEBAS, fontSize: 110,
          color: TEXT, letterSpacing: '0.06em', lineHeight: 1,
          textAlign: 'center',
          textShadow: '0 0 80px rgba(255,255,255,0.1)',
          opacity: l3Op, transform: `scale(${l3Scale})`,
        }}>
          EVERY.<br/>MORNING.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════
// SCENE 6 — LOGO / CTA
// ══════════════════════════════════════════════════════════
const FloatingDot: React.FC<{x: number; startY: number; speed: number; size: number; alpha: number}> = (
  {x, startY, speed, size, alpha}
) => {
  const f = useCurrentFrame();
  const y = ((startY - f * speed) % 100 + 100) % 100;
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      width: size, height: size, borderRadius: '50%',
      background: CYAN, opacity: alpha,
      boxShadow: `0 0 ${size * 3}px rgba(0,212,240,0.6)`,
      pointerEvents: 'none',
    }}/>
  );
};

const particles = [
  {x: 12, startY: 80, speed: 0.18, size: 3, alpha: 0.55},
  {x: 28, startY: 65, speed: 0.12, size: 2, alpha: 0.40},
  {x: 45, startY: 90, speed: 0.22, size: 4, alpha: 0.35},
  {x: 62, startY: 70, speed: 0.15, size: 2, alpha: 0.50},
  {x: 78, startY: 85, speed: 0.20, size: 3, alpha: 0.45},
  {x: 90, startY: 75, speed: 0.10, size: 2, alpha: 0.30},
  {x: 35, startY: 50, speed: 0.16, size: 3, alpha: 0.40},
  {x: 55, startY: 60, speed: 0.13, size: 2, alpha: 0.35},
];

const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoSp  = spring({frame: f - 8, fps, config: {damping: 12, stiffness: 130, mass: 0.5}});
  const logoOp  = fi(f, [8, 22, 78, 90], [0, 1, 1, 0]);
  const glowStr = fi(f, [8, 40], [0, 0.30]);
  const tagOp   = fi(f, [28, 44, 78, 90], [0, 1, 1, 0]);
  const urlOp   = fi(f, [40, 55, 78, 90], [0, 1, 1, 0]);
  const particleOp = fi(f, [15, 30], [0, 1]);

  const finalFade = fi(f, [78, 90], [1, 0]);

  return (
    <AbsoluteFill style={{background: '#05070b', opacity: finalFade}}>
      <AmbientGlow color={`rgba(0,212,240,${glowStr})`} x={50} y={50} rx={80} ry={60}/>
      <AmbientGlow color='rgba(139,92,246,0.08)' x={80} y={70} rx={50} ry={40}/>

      {/* Floating particles */}
      <div style={{position: 'absolute', inset: 0, opacity: particleOp}}>
        {particles.map((p, i) => <FloatingDot key={i} {...p}/>)}
      </div>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Logo */}
        <div style={{
          opacity: logoOp,
          transform: `scale(${0.6 + logoSp * 0.4})`,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: BEBAS, fontSize: 120, lineHeight: 0.9,
            letterSpacing: '0.08em', color: TEXT,
            textShadow: `0 0 60px rgba(0,212,240,0.25)`,
          }}>
            <span>STRIKE</span>
            <span style={{color: CYAN, textShadow: `0 0 50px rgba(0,212,240,0.8)`}}>PANEL</span>
            <span style={{
              fontFamily: BARLOW, fontSize: 30, fontWeight: 700,
              color: CYAN, verticalAlign: 'super',
            }}>™</span>
          </div>

          {/* Glow under logo */}
          <div style={{
            height: 1, width: '70%', margin: '14px auto',
            background: `linear-gradient(90deg, transparent, ${CYAN}, rgba(139,92,246,0.9), transparent)`,
            boxShadow: `0 0 20px rgba(0,212,240,0.4)`,
          }}/>
        </div>

        {/* TRAINING INTELLIGENCE */}
        <div style={{
          fontFamily: BARLOW, fontSize: 22, fontWeight: 700,
          letterSpacing: '0.45em', textTransform: 'uppercase',
          color: 'rgba(0,212,240,0.75)', marginTop: 4,
          opacity: tagOp,
        }}>
          TRAINING INTELLIGENCE
        </div>

        {/* URL */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 18, color: 'rgba(122,133,160,0.7)',
          letterSpacing: '0.08em', marginTop: 28,
          opacity: urlOp,
        }}>
          strikepanel.vercel.app
        </div>
      </AbsoluteFill>

      <CornerDecor opacity={fi(f, [20, 40, 78, 90], [0, 0.35, 0.35, 0])}/>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════
// CROSS-SCENE TRANSITION FLASH
// ══════════════════════════════════════════════════════════
const TransitionFlashes: React.FC = () => {
  const f = useCurrentFrame();
  // Flash at transition boundaries
  const t240 = fi(f, [238, 241, 244], [0, 0.7, 0]);
  const t420 = fi(f, [418, 421, 424], [0, 0.5, 0]);
  const t660 = fi(f, [658, 661, 664], [0, 0.8, 0]);

  const total = Math.max(t240, t420, t660);
  if (total <= 0) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 150,
      background: `rgba(0, 212, 240, ${total})`,
      pointerEvents: 'none',
    }}/>
  );
};

// ══════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ══════════════════════════════════════════════════════════
export const StrikePanelTrailer: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#0b0d14', overflow: 'hidden'}}>

      {/* ── Scenes ── */}
      <Sequence from={S1.from}  durationInFrames={S1.dur}>
        <Scene1/>
      </Sequence>

      <Sequence from={S2.from}  durationInFrames={S2.dur}>
        <Scene2/>
      </Sequence>

      <Sequence from={S3.from}  durationInFrames={S3.dur}>
        <Scene3/>
      </Sequence>

      <Sequence from={S4A.from} durationInFrames={S4A.dur}>
        <Scene4A/>
      </Sequence>

      <Sequence from={S4B.from} durationInFrames={S4B.dur}>
        <Scene4B/>
      </Sequence>

      <Sequence from={S5.from}  durationInFrames={S5.dur}>
        <Scene5/>
      </Sequence>

      <Sequence from={S6.from}  durationInFrames={S6.dur}>
        <Scene6/>
      </Sequence>

      {/* ── Always-on effects (on top of everything) ── */}
      <TransitionFlashes/>
      <FilmGrain opacity={0.065}/>
      <Scanlines opacity={0.022}/>
      <Vignette strength={0.84}/>
    </AbsoluteFill>
  );
};
