import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
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
import './fonts';
import {BEBAS, BARLOW, MONO} from './fonts';
import {StrikePanelLogo, StrikePanelWordmark} from './logo';

// ─── palette ────────────────────────────────────────────────
const CYAN  = '#00D4F0';
const RED   = '#ef4444';
const AMBER = '#f59e0b';
const GREEN = '#10b981';
const TEXT  = '#eef0f8';
const MUTED = '#7a85a0';
const BG    = '#0b0d14';

const C  = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fi = (f: number, r: number[], o: number[]) => interpolate(f, r, o, C);

// ─── composition constants ───────────────────────────────────
export const TRAILER_FPS    = 30;
export const TRAILER_FRAMES = 900; // 30 s

// Scene windows
const S1  = {from: 0,   dur: 90};   // 0–3 s    Pre-dawn arrival
const S2  = {from: 90,  dur: 150};  // 3–8 s    The problem
const S3  = {from: 240, dur: 180};  // 8–14 s   The reveal
const S4A = {from: 420, dur: 120};  // 14–18 s  Readiness grid
const S4B = {from: 540, dur: 120};  // 18–22 s  Fight countdown
const S5  = {from: 660, dur: 150};  // 22–27 s  Why it matters
const S6  = {from: 810, dur: 90};   // 27–30 s  Logo CTA

// ════════════════════════════════════════════════════════════
// CINEMATIC VIDEO BACKGROUND
// ════════════════════════════════════════════════════════════
interface CinematicBgProps {
  src: string;
  rate?: number;
  brightness?: number;
  saturate?: number;
  contrast?: number;
  tint?: string;
  panDir?: 'left' | 'right' | 'up' | 'none';
  zoom?: 'in' | 'out' | 'none';
  startFrom?: number;
}

const CinematicBg: React.FC<CinematicBgProps> = ({
  src,
  rate = 0.55,
  brightness = 0.22,
  saturate = 0.40,
  contrast = 1.12,
  tint = 'rgba(5,10,20,0.55)',
  panDir = 'left',
  zoom = 'in',
  startFrom = 0,
}) => {
  const f = useCurrentFrame();
  const {durationInFrames: dur} = useVideoConfig();

  const scale = zoom === 'in'  ? fi(f, [0, dur], [1.0, 1.09])
              : zoom === 'out' ? fi(f, [0, dur], [1.09, 1.0])
              : 1.04;

  const tx = panDir === 'left'  ? fi(f, [0, dur], [0, -18])
           : panDir === 'right' ? fi(f, [0, dur], [0,  18])
           : 0;
  const ty = panDir === 'up'    ? fi(f, [0, dur], [0, -18]) : 0;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0}}>
      <div style={{
        position: 'absolute', inset: -40,
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        willChange: 'transform',
      }}>
        <Video
          src={staticFile(src)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: `brightness(${brightness}) saturate(${saturate}) contrast(${contrast})`,
          }}
          playbackRate={rate}
          muted
          loop
          startFrom={startFrom}
        />
      </div>
      {/* Brand colour wash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: tint,
        pointerEvents: 'none',
      }}/>
      {/* Top-to-bottom cinematic burn */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(5,8,16,0.55) 0%, transparent 30%, transparent 65%, rgba(5,8,16,0.75) 100%)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// APP UI — HEADER BAR
// ════════════════════════════════════════════════════════════
const AppHeader: React.FC<{opacity?: number}> = ({opacity = 1}) => (
  <div style={{
    opacity,
    background: 'linear-gradient(180deg, rgba(11,13,20,0.97), rgba(13,16,24,0.93))',
    borderBottom: '1px solid rgba(0,212,240,0.15)',
    padding: '14px 22px',
    display: 'flex', alignItems: 'center', gap: 12,
  }}>
    <StrikePanelLogo size={42} glowOpacity={0.5}/>
    <div>
      <div style={{
        fontFamily: BEBAS, fontSize: 24, letterSpacing: '0.08em',
        color: TEXT, lineHeight: 1,
      }}>
        STRIKE<span style={{color: CYAN}}>PANEL</span>
        <span style={{
          fontFamily: BARLOW, fontSize: 11, fontWeight: 700,
          color: CYAN, verticalAlign: 'super', marginLeft: 2,
        }}>™</span>
      </div>
      <div style={{
        fontFamily: BARLOW, fontSize: 9, fontWeight: 700,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(122,133,160,0.65)', marginTop: 1,
      }}>
        Training Intelligence
      </div>
    </div>
    <div style={{
      marginLeft: 'auto',
      fontFamily: MONO, fontSize: 11,
      color: `rgba(0,212,240,0.55)`,
    }}>
      05:47 AM
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════
// APP UI — READINESS CARDS
// ════════════════════════════════════════════════════════════
const ATHLETES = [
  {name: 'MARTINEZ', score: 91, status: 'READY',   color: GREEN,  delay: 0},
  {name: 'OKAFOR',   score: 88, status: 'READY',   color: GREEN,  delay: 6},
  {name: 'CHEN',     score: 74, status: 'CAUTION', color: AMBER,  delay: 12},
  {name: 'RODRIGUEZ',score: 42, status: 'REST',    color: RED,    delay: 18},
];

const ReadinessCard: React.FC<typeof ATHLETES[0]> = ({name, score, status, color, delay}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp  = spring({frame: f - delay, fps, config: {damping: 11, stiffness: 130, mass: 0.45}});
  const op  = fi(f, [delay, delay + 10], [0, 1]);
  const bar = fi(f, [delay + 8, delay + 30], [0, score]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(24,28,42,0.94), rgba(19,22,33,0.97))',
      border: `1px solid ${color}30`,
      borderRadius: 12, padding: '16px 16px 14px',
      opacity: op,
      transform: `translateY(${(1 - sp) * 36}px)`,
      position: 'relative', overflow: 'hidden',
      boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px ${color}18`,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}bb, transparent)`,
      }}/>
      <div style={{
        fontFamily: BARLOW, fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: MUTED, marginBottom: 8,
      }}>{name}</div>
      <div style={{
        fontFamily: BEBAS, fontSize: 60, lineHeight: 1,
        color, letterSpacing: '0.02em',
        textShadow: `0 0 24px ${color}55`,
      }}>{Math.round(bar)}</div>
      <div style={{
        height: 4, background: 'rgba(255,255,255,0.05)',
        borderRadius: 2, overflow: 'hidden', margin: '8px 0 10px',
      }}>
        <div style={{
          width: `${bar}%`, height: '100%', borderRadius: 2,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          boxShadow: `0 0 8px ${color}66`,
        }}/>
      </div>
      <div style={{
        display: 'inline-block',
        fontFamily: BARLOW, fontSize: 9, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        padding: '3px 9px', borderRadius: 99,
        background: `${color}1a`, color, border: `1px solid ${color}30`,
      }}>{status}</div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// APP UI — FIGHT COUNTDOWN CARD
// ════════════════════════════════════════════════════════════
const FightCard: React.FC<{frame: number; fps: number}> = ({frame: f, fps}) => {
  const numSp = spring({frame: f - 10, fps, config: {damping: 7, stiffness: 200, mass: 0.3}});
  const barW  = fi(f, [25, 80], [0, 68]);
  const restOp = fi(f, [35, 52], [0, 1]);
  const pulse = 0.16 + 0.08 * Math.abs(Math.sin(f / 10 * Math.PI));

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(239,68,68,0.09), rgba(139,92,246,0.06))',
      border: '1px solid rgba(239,68,68,0.28)',
      borderRadius: 14, padding: '22px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
      }}/>
      <div style={{
        fontFamily: BARLOW, fontSize: 12, fontWeight: 700,
        letterSpacing: '0.32em', textTransform: 'uppercase',
        color: 'rgba(239,68,68,0.6)', marginBottom: 4,
      }}>🥊 FIGHT DATES</div>

      <div style={{
        fontFamily: BEBAS, fontSize: 180, lineHeight: 0.82,
        color: RED,
        textShadow: `0 0 60px rgba(239,68,68,${pulse}), 0 0 120px rgba(239,68,68,0.12)`,
        transform: `scale(${0.55 + numSp * 0.45})`,
        transformOrigin: 'top left',
        opacity: fi(f, [10, 22], [0, 1]),
      }}>14</div>

      <div style={{
        fontFamily: BEBAS, fontSize: 28, letterSpacing: '0.22em',
        color: 'rgba(239,68,68,0.65)', marginTop: -4,
        opacity: fi(f, [10, 22], [0, 1]),
      }}>DAYS TO FIGHT NIGHT</div>

      <div style={{height: 16}}/>

      <div style={{opacity: restOp}}>
        <div style={{
          fontFamily: BEBAS, fontSize: 42, color: TEXT,
          letterSpacing: '0.05em',
          textShadow: '0 0 20px rgba(255,255,255,0.06)',
        }}>MARCUS RODRIGUEZ</div>
        <div style={{
          fontFamily: BARLOW, fontSize: 12, color: MUTED,
          letterSpacing: '0.1em', marginTop: 2,
        }}>Welterweight · 72.1 kg → TARGET 70.3 kg</div>
        <div style={{
          height: 5, background: 'rgba(255,255,255,0.06)',
          borderRadius: 3, overflow: 'hidden', margin: '12px 0 6px',
        }}>
          <div style={{
            width: `${barW}%`, height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${RED}, #f87171)`,
            boxShadow: '0 0 10px rgba(239,68,68,0.5)',
          }}/>
        </div>
        <div style={{
          fontFamily: BARLOW, fontSize: 10, color: 'rgba(239,68,68,0.55)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>WEIGHT CUT — 68% COMPLETE</div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// SCENE 1 — PRE-DAWN ARRIVAL
// ════════════════════════════════════════════════════════════
const Scene1: React.FC = () => {
  const f   = useCurrentFrame();
  const op  = fi(f, [6, 22, 68, 86], [0, 1, 1, 0]);
  const subY = fi(f, [14, 28], [20, 0]);
  const beat = (Math.sin(f / 9 * Math.PI) + 1) / 2;

  return (
    <AbsoluteFill>
      <CinematicBg
        src="footage/arriving-gym.mp4"
        brightness={0.18} saturate={0.35}
        tint="rgba(0,6,18,0.6)"
        panDir="up" zoom="in"
      />
      <AmbientGlow color={`rgba(0,212,240,${beat * 0.06 + 0.03})`} x={50} y={0} rx={80} ry={35}/>
      <AmbientGlow color="rgba(5,8,20,0.7)" x={50} y={115} rx={100} ry={50}/>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: op,
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 148,
          color: TEXT, letterSpacing: '0.04em', lineHeight: 1,
          textShadow: '0 0 100px rgba(255,255,255,0.06), 0 2px 0 rgba(0,0,0,0.8)',
        }}>05:47</div>

        <div style={{
          fontFamily: BARLOW, fontSize: 19, fontWeight: 700,
          letterSpacing: '0.72em', textTransform: 'uppercase',
          color: MUTED, marginTop: 14,
          transform: `translateY(${subY}px)`,
        }}>A.M.</div>

        <div style={{
          width: 44, height: 1, margin: '26px auto',
          background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
          boxShadow: '0 0 14px rgba(0,212,240,0.7)',
          transform: `translateY(${subY}px)`,
        }}/>

        <div style={{
          fontFamily: BARLOW, fontSize: 18, fontWeight: 400,
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(0,212,240,0.48)',
          transform: `translateY(${subY}px)`,
        }}>THE QUESTIONS HAVEN'T SLEPT</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// SCENE 2 — THE PROBLEM
// ════════════════════════════════════════════════════════════
const Scene2: React.FC = () => {
  const f   = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lineOp  = fi(f, [8, 22, 100, 122], [0, 1, 1, 0]);
  const lineY   = fi(f, [8, 22], [22, 0]);
  const numSp   = spring({frame: f - 20, fps, config: {damping: 8, stiffness: 190, mass: 0.35}});
  const numOp   = fi(f, [20, 30, 110, 130], [0, 1, 1, 0]);
  const q1Op    = fi(f, [55, 70, 118, 138], [0, 1, 1, 0]);
  const q1Y     = fi(f, [55, 70], [22, 0]);
  const q2Op    = fi(f, [72, 86, 118, 138], [0, 1, 1, 0]);
  const q2Y     = fi(f, [72, 86], [22, 0]);
  const redGlow = fi(f, [0, 90], [0.05, 0.24]);

  return (
    <AbsoluteFill>
      <CinematicBg
        src="footage/kickboxer-resting.mp4"
        brightness={0.16} saturate={0.30}
        tint="rgba(10,4,4,0.62)"
        panDir="right" zoom="in"
        startFrom={15}
      />
      <AmbientGlow color={`rgba(239,68,68,${redGlow})`} x={50} y={115} rx={110} ry={52}/>
      <DataLines opacity={0.5}/>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 60px',
      }}>
        <div style={{
          fontFamily: BARLOW, fontSize: 28, fontWeight: 400,
          color: MUTED, letterSpacing: '0.22em', textTransform: 'uppercase',
          opacity: lineOp, transform: `translateY(${lineY}px)`,
        }}>Your gym has</div>

        <div style={{
          fontFamily: BEBAS, fontSize: 252, color: TEXT, lineHeight: 0.8,
          textShadow: '0 0 140px rgba(255,255,255,0.04)',
          opacity: numOp,
          transform: `scale(${0.55 + numSp * 0.45})`,
          transformOrigin: 'center',
        }}>12</div>

        <div style={{
          fontFamily: BEBAS, fontSize: 70, color: CYAN,
          letterSpacing: '0.24em', lineHeight: 1,
          textShadow: `0 0 45px rgba(0,212,240,0.6)`,
          opacity: numOp, marginTop: -8,
        }}>FIGHTERS</div>

        <div style={{height: 36}}/>

        <div style={{
          fontFamily: BARLOW, fontSize: 38, fontWeight: 600,
          color: 'rgba(238,240,248,0.9)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          opacity: q1Op, transform: `translateY(${q1Y}px)`,
          textAlign: 'center',
        }}>Who's ready to push?</div>

        <div style={{
          fontFamily: BARLOW, fontSize: 38, fontWeight: 600,
          color: AMBER,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          opacity: q2Op, transform: `translateY(${q2Y}px)`,
          textAlign: 'center', marginTop: 10,
        }}>Who needs protecting?</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// SCENE 3 — THE REVEAL
// ════════════════════════════════════════════════════════════
const Scene3: React.FC = () => {
  const f   = useCurrentFrame();
  const {fps} = useVideoConfig();

  const flashOp  = fi(f, [0, 3, 12], [1, 1, 0]);
  const strikeSp = spring({frame: f - 10, fps, config: {damping: 13, stiffness: 118, mass: 0.5}});
  const panelSp  = spring({frame: f - 16, fps, config: {damping: 13, stiffness: 118, mass: 0.5}});
  const strikeX  = -220 * (1 - strikeSp);
  const panelX   =  220 * (1 - panelSp);
  const logoOp   = fi(f, [10, 22, 162, 178], [0, 1, 1, 0]);
  const iconSp   = spring({frame: f - 10, fps, config: {damping: 12, stiffness: 110, mass: 0.5}});
  const glowStr  = fi(f, [22, 65], [0, 0.26]);
  const sweepP   = fi(f, [52, 106], [0, 1]);
  const sweepY   = `${100 - sweepP * 100}%`;
  const tagOp    = fi(f, [82, 100, 162, 178], [0, 1, 1, 0]);
  const tagLS    = fi(f, [82, 115], [0.9, 0.20]);
  const mockOp   = fi(f, [112, 135, 162, 178], [0, 1, 1, 0]);
  const mockY    = fi(f, [112, 135], [44, 0]);
  const tmOp     = fi(f, [22, 36], [0, 1]);

  return (
    <AbsoluteFill>
      <CinematicBg
        src="footage/top-down-match.mp4"
        brightness={0.14} saturate={0.35}
        tint="rgba(0,8,22,0.68)"
        panDir="none" zoom="out"
      />
      <AmbientGlow color={`rgba(0,212,240,${glowStr})`} x={50} y={38} rx={85} ry={58}/>
      <AmbientGlow color="rgba(139,92,246,0.07)" x={78} y={88} rx={55} ry={38}/>
      <DataLines opacity={0.7}/>
      <CyanSweepLine progress={sweepP} top={sweepY}/>
      <LightFlash intensity={flashOp}/>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Logo block */}
        <div style={{opacity: logoOp, textAlign: 'center'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 16}}>
            {/* Icon slides up */}
            <div style={{
              transform: `translateY(${(1 - iconSp) * 44}px)`,
              marginTop: 8,
            }}>
              <StrikePanelLogo size={96} glowOpacity={Math.min(glowStr * 2, 0.7)}/>
            </div>
            {/* Wordmark slides in */}
            <div style={{fontFamily: BEBAS, fontSize: 120, lineHeight: 0.88, letterSpacing: '0.07em', display: 'flex', alignItems: 'flex-start'}}>
              <span style={{
                color: TEXT,
                textShadow: '0 0 60px rgba(255,255,255,0.07)',
                transform: `translateX(${strikeX}px)`,
                display: 'inline-block',
              }}>STRIKE</span>
              <span style={{
                color: CYAN,
                textShadow: `0 0 45px rgba(0,212,240,0.8)`,
                transform: `translateX(${panelX}px)`,
                display: 'inline-block',
              }}>PANEL</span>
              <span style={{
                fontFamily: BARLOW, fontSize: 30, fontWeight: 700,
                color: CYAN, alignSelf: 'flex-start', marginTop: 10, marginLeft: 3,
                opacity: tmOp,
                textShadow: `0 0 16px rgba(0,212,240,0.9)`,
              }}>™</span>
            </div>
          </div>

          {/* Glow bar */}
          <div style={{
            height: 1, width: '78%', margin: '14px auto 0',
            background: `linear-gradient(90deg, transparent, ${CYAN}, rgba(139,92,246,0.9), transparent)`,
            boxShadow: '0 0 14px rgba(0,212,240,0.55)',
          }}/>
        </div>

        {/* TRAINING INTELLIGENCE */}
        <div style={{
          fontFamily: BARLOW, fontSize: 22, fontWeight: 700,
          letterSpacing: `${tagLS}em`, textTransform: 'uppercase',
          color: 'rgba(0,212,240,0.78)', marginTop: 14,
          opacity: tagOp,
        }}>TRAINING INTELLIGENCE</div>

        {/* App mockup */}
        <div style={{
          marginTop: 40, width: 380,
          opacity: mockOp,
          transform: `translateY(${mockY}px)`,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(24,28,42,0.96), rgba(19,22,33,0.98))',
            border: '1px solid rgba(0,212,240,0.18)',
            borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 28px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,212,240,0.06)',
          }}>
            <AppHeader opacity={1}/>
            <div style={{padding: '14px 16px 16px'}}>
              <div style={{
                fontFamily: BARLOW, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'rgba(0,212,240,0.6)', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{width: 4, height: 4, borderRadius: '50%', background: CYAN, boxShadow: '0 0 6px rgba(0,212,240,0.8)'}}/>
                SQUAD READINESS — TODAY
              </div>
              {ATHLETES.slice(0, 3).map(({name, score, color}) => (
                <div key={name} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{fontFamily: BARLOW, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(238,240,248,0.65)', minWidth: 84}}>{name}</div>
                  <div style={{flex: 1, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2}}>
                    <div style={{width: `${score}%`, height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${color}88)`}}/>
                  </div>
                  <div style={{fontFamily: BEBAS, fontSize: 20, color, minWidth: 28, textAlign: 'right'}}>{score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// SCENE 4A — READINESS GRID
// ════════════════════════════════════════════════════════════
const Scene4A: React.FC = () => {
  const f = useCurrentFrame();
  const titleOp  = fi(f, [0, 16], [0, 1]);
  const titleY   = fi(f, [0, 16], [18, 0]);
  const cyanGlow = fi(f, [0, 70], [0.07, 0.18]);

  return (
    <AbsoluteFill>
      <CinematicBg
        src="footage/punching-bag.mp4"
        brightness={0.16} saturate={0.38}
        tint="rgba(0,6,18,0.64)"
        panDir="left" zoom="in"
      />
      <AmbientGlow color={`rgba(0,212,240,${cyanGlow})`} x={50} y={-5} rx={90} ry={38}/>
      <DataLines opacity={0.45}/>

      <AbsoluteFill style={{padding: '0 36px', paddingTop: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        {/* App header */}
        <div style={{marginBottom: 16, opacity: titleOp, transform: `translateY(${titleY}px)`}}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(24,28,42,0.97), rgba(19,22,33,0.98))',
            border: '1px solid rgba(0,212,240,0.15)',
            borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
          }}>
            <AppHeader/>
            <div style={{padding: '10px 16px 0'}}>
              <div style={{
                fontFamily: BARLOW, fontSize: 9, fontWeight: 700,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'rgba(0,212,240,0.55)', marginBottom: 10,
              }}>⚡ MORNING BRIEF — READINESS</div>
            </div>
          </div>
        </div>

        {/* Readiness grid */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
          {ATHLETES.map((a) => (
            <ReadinessCard key={a.name} {...a}/>
          ))}
        </div>

        <div style={{
          marginTop: 16,
          fontFamily: BARLOW, fontSize: 11, fontWeight: 400,
          letterSpacing: '0.26em', textTransform: 'uppercase',
          color: 'rgba(122,133,160,0.45)',
          opacity: fi(f, [48, 68], [0, 1]),
        }}>
          DAILY READINESS INTELLIGENCE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// SCENE 4B — FIGHT COUNTDOWN
// ════════════════════════════════════════════════════════════
const Scene4B: React.FC = () => {
  const f   = useCurrentFrame();
  const {fps} = useVideoConfig();
  const labelOp  = fi(f, [0, 16], [0, 1]);
  const labelY   = fi(f, [0, 16], [18, 0]);
  const redGlow  = fi(f, [0, 60], [0.08, 0.26]);

  return (
    <AbsoluteFill>
      <CinematicBg
        src="footage/intense-match.mp4"
        brightness={0.14} saturate={0.32}
        tint="rgba(20,4,4,0.65)"
        panDir="right" zoom="in"
      />
      <AmbientGlow color={`rgba(239,68,68,${redGlow})`} x={50} y={115} rx={115} ry={50}/>
      <AmbientGlow color={`rgba(239,68,68,${redGlow * 0.5})`} x={50} y={30} rx={70} ry={45}/>

      <AbsoluteFill style={{padding: '0 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{opacity: labelOp, transform: `translateY(${labelY}px)`, marginBottom: 16}}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(24,28,42,0.97), rgba(19,22,33,0.98))',
            border: '1px solid rgba(0,212,240,0.15)',
            borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.75)',
          }}>
            <AppHeader/>
          </div>
        </div>

        <div style={{opacity: fi(f, [8, 22], [0, 1]), transform: `translateY(${fi(f, [8, 22], [20, 0])}px)`}}>
          <FightCard frame={f} fps={fps}/>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// SCENE 5 — WHY IT MATTERS
// ════════════════════════════════════════════════════════════
const Scene5: React.FC = () => {
  const f   = useCurrentFrame();
  const {fps} = useVideoConfig();

  const l1Sp  = spring({frame: f - 5,  fps, config: {damping: 10, stiffness: 145, mass: 0.4}});
  const l1Op  = fi(f, [5,  18, 108, 125], [0, 1, 1, 0]);
  const l2Sp  = spring({frame: f - 20, fps, config: {damping: 10, stiffness: 145, mass: 0.4}});
  const l2Op  = fi(f, [20, 33, 108, 125], [0, 1, 1, 0]);
  const divOp = fi(f, [36, 52, 102, 122], [0, 1, 1, 0]);
  const l3Sp  = spring({frame: f - 70, fps, config: {damping: 8, stiffness: 195, mass: 0.3}});
  const l3Op  = fi(f, [70, 84, 132, 148], [0, 1, 1, 0]);
  const bgGlow = fi(f, [0, 65], [0.08, 0.22]);

  return (
    <AbsoluteFill>
      <CinematicBg
        src="footage/injured-boxer.mp4"
        brightness={0.14} saturate={0.28}
        tint="rgba(4,4,16,0.66)"
        panDir="up" zoom="out"
        startFrom={10}
      />
      <AmbientGlow color={`rgba(0,212,240,${bgGlow})`} x={50} y={50} rx={85} ry={65}/>
      <DataLines opacity={0.3}/>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 44px',
      }}>
        {/* KNOW WHO TO PUSH */}
        <div style={{
          fontFamily: BEBAS, fontSize: 84, lineHeight: 0.9,
          color: TEXT, letterSpacing: '0.04em',
          textShadow: '0 0 60px rgba(255,255,255,0.06)',
          opacity: l1Op,
          transform: `translateX(${-220 * (1 - l1Sp)}px)`,
          alignSelf: 'flex-start',
        }}>KNOW WHO</div>
        <div style={{
          fontFamily: BEBAS, fontSize: 84, lineHeight: 0.9,
          color: CYAN, letterSpacing: '0.04em',
          textShadow: `0 0 50px rgba(0,212,240,0.65)`,
          opacity: l1Op,
          transform: `translateX(${-220 * (1 - l1Sp)}px)`,
          alignSelf: 'flex-start',
        }}>TO PUSH.</div>

        {/* Divider */}
        <div style={{
          width: '100%', height: 1, margin: '18px 0',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          opacity: divOp,
        }}/>

        {/* KNOW WHO TO PROTECT */}
        <div style={{
          fontFamily: BEBAS, fontSize: 84, lineHeight: 0.9,
          color: TEXT, letterSpacing: '0.04em',
          textShadow: '0 0 60px rgba(255,255,255,0.06)',
          opacity: l2Op,
          transform: `translateX(${220 * (1 - l2Sp)}px)`,
          alignSelf: 'flex-end', textAlign: 'right',
        }}>KNOW WHO</div>
        <div style={{
          fontFamily: BEBAS, fontSize: 84, lineHeight: 0.9,
          color: AMBER, letterSpacing: '0.04em',
          textShadow: `0 0 50px rgba(245,158,11,0.65)`,
          opacity: l2Op,
          transform: `translateX(${220 * (1 - l2Sp)}px)`,
          alignSelf: 'flex-end', textAlign: 'right',
        }}>TO PROTECT.</div>

        <div style={{height: 36}}/>

        {/* EVERY. MORNING. */}
        <div style={{
          fontFamily: BEBAS, fontSize: 106,
          color: TEXT, letterSpacing: '0.06em', lineHeight: 1,
          textAlign: 'center',
          textShadow: '0 0 80px rgba(255,255,255,0.09)',
          opacity: l3Op,
          transform: `scale(${0.5 + l3Sp * 0.5})`,
        }}>EVERY.<br/>MORNING.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// SCENE 6 — LOGO CTA
// ════════════════════════════════════════════════════════════
const Particle: React.FC<{x: number; y0: number; speed: number; size: number; alpha: number}> = (
  {x, y0, speed, size, alpha}
) => {
  const f = useCurrentFrame();
  const y = ((y0 - f * speed) % 100 + 100) % 100;
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      width: size, height: size, borderRadius: '50%',
      background: CYAN, opacity: alpha,
      boxShadow: `0 0 ${size * 4}px rgba(0,212,240,0.7)`,
      pointerEvents: 'none',
    }}/>
  );
};

const PARTICLES = [
  {x: 10, y0: 82, speed: 0.19, size: 3, alpha: 0.50},
  {x: 25, y0: 67, speed: 0.13, size: 2, alpha: 0.38},
  {x: 42, y0: 88, speed: 0.22, size: 4, alpha: 0.32},
  {x: 58, y0: 72, speed: 0.16, size: 2, alpha: 0.44},
  {x: 74, y0: 85, speed: 0.21, size: 3, alpha: 0.40},
  {x: 88, y0: 77, speed: 0.11, size: 2, alpha: 0.28},
  {x: 33, y0: 55, speed: 0.17, size: 3, alpha: 0.36},
  {x: 66, y0: 62, speed: 0.14, size: 2, alpha: 0.32},
  {x: 82, y0: 46, speed: 0.18, size: 3, alpha: 0.42},
];

const Scene6: React.FC = () => {
  const f   = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoSp = spring({frame: f - 10, fps, config: {damping: 12, stiffness: 128, mass: 0.5}});
  const logoOp = fi(f, [10, 24, 76, 90], [0, 1, 1, 0]);
  const tagOp  = fi(f, [28, 44, 76, 90], [0, 1, 1, 0]);
  const urlOp  = fi(f, [42, 56, 76, 90], [0, 1, 1, 0]);
  const ptcOp  = fi(f, [18, 32], [0, 1]);
  const glow   = fi(f, [10, 45], [0, 0.32]);
  const fade   = fi(f, [76, 90], [1, 0]);

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <CinematicBg
        src="footage/arriving-gym.mp4"
        brightness={0.12} saturate={0.25}
        tint="rgba(0,6,18,0.72)"
        panDir="left" zoom="out"
        startFrom={60}
      />
      <AmbientGlow color={`rgba(0,212,240,${glow})`} x={50} y={48} rx={75} ry={60}/>
      <AmbientGlow color="rgba(139,92,246,0.09)" x={78} y={72} rx={50} ry={40}/>

      {/* Floating particles */}
      <div style={{position: 'absolute', inset: 0, opacity: ptcOp}}>
        {PARTICLES.map((p, i) => <Particle key={i} {...p}/>)}
      </div>

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          opacity: logoOp,
          transform: `scale(${0.58 + logoSp * 0.42})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <StrikePanelLogo size={130} glowOpacity={0.75}/>
          <div style={{height: 22}}/>
          <StrikePanelWordmark fontSize={108} bebas={BEBAS} barlow={BARLOW}/>
          <div style={{
            height: 1, width: '72%', margin: '16px auto',
            background: `linear-gradient(90deg, transparent, ${CYAN}, rgba(139,92,246,0.95), transparent)`,
            boxShadow: '0 0 22px rgba(0,212,240,0.45)',
          }}/>
        </div>

        <div style={{
          fontFamily: BARLOW, fontSize: 20, fontWeight: 700,
          letterSpacing: '0.48em', textTransform: 'uppercase',
          color: 'rgba(0,212,240,0.72)', marginTop: 2,
          opacity: tagOp,
        }}>TRAINING INTELLIGENCE</div>

        <div style={{
          fontFamily: MONO, fontSize: 17,
          color: 'rgba(122,133,160,0.65)',
          letterSpacing: '0.07em', marginTop: 28,
          opacity: urlOp,
        }}>strikepanel.vercel.app</div>
      </AbsoluteFill>

      <CornerDecor opacity={fi(f, [22, 42, 76, 90], [0, 0.32, 0.32, 0])}/>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════
// TRANSITION FLASHES
// ════════════════════════════════════════════════════════════
const Flashes: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = fi(f, [238, 241, 246], [0, 0.85, 0]);
  const t2 = fi(f, [418, 421, 426], [0, 0.60, 0]);
  const t3 = fi(f, [538, 541, 546], [0, 0.55, 0]);
  const t4 = fi(f, [658, 661, 666], [0, 0.90, 0]);
  const t5 = fi(f, [808, 811, 816], [0, 0.70, 0]);
  const v  = Math.max(t1, t2, t3, t4, t5);
  if (v <= 0) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 160,
      background: `rgba(0, 212, 240, ${v})`,
      pointerEvents: 'none',
    }}/>
  );
};

// ════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ════════════════════════════════════════════════════════════
export const StrikePanelTrailer: React.FC = () => (
  <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>

    <Sequence from={S1.from}  durationInFrames={S1.dur}><Scene1/></Sequence>
    <Sequence from={S2.from}  durationInFrames={S2.dur}><Scene2/></Sequence>
    <Sequence from={S3.from}  durationInFrames={S3.dur}><Scene3/></Sequence>
    <Sequence from={S4A.from} durationInFrames={S4A.dur}><Scene4A/></Sequence>
    <Sequence from={S4B.from} durationInFrames={S4B.dur}><Scene4B/></Sequence>
    <Sequence from={S5.from}  durationInFrames={S5.dur}><Scene5/></Sequence>
    <Sequence from={S6.from}  durationInFrames={S6.dur}><Scene6/></Sequence>

    <Flashes/>
    <FilmGrain opacity={0.058}/>
    <Scanlines opacity={0.020}/>
    <Vignette strength={0.86}/>
  </AbsoluteFill>
);
