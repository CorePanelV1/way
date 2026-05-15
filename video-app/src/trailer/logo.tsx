import React from 'react';

export const StrikePanelLogo: React.FC<{size?: number; glowOpacity?: number}> = ({
  size = 90,
  glowOpacity = 0.55,
}) => (
  <div style={{
    width: size, height: size, flexShrink: 0,
    filter: `drop-shadow(0 0 ${size * 0.12}px rgba(0,212,240,${glowOpacity}))`,
  }}>
    <svg viewBox="0 0 90 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sp-orb-t" cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor="#1e2540"/>
          <stop offset="55%" stopColor="#0f1220"/>
          <stop offset="100%" stopColor="#0b0d14"/>
        </radialGradient>
      </defs>
      {/* outer circle */}
      <circle cx="45" cy="45" r="43" fill="url(#sp-orb-t)" stroke="#00D4F0" strokeWidth="1.2" strokeOpacity="0.4"/>
      {/* arc decoration */}
      <path d="M 18 22 A 32 32 0 0 1 62 12" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" strokeLinecap="round"/>
      {/* inner ring */}
      <circle cx="45" cy="45" r="29" fill="none" stroke="#00D4F0" strokeWidth="0.9" strokeOpacity="0.2"/>
      {/* cardinal lines */}
      <line x1="45" y1="2"  x2="45" y2="27" stroke="#00D4F0" strokeWidth="2.4" strokeLinecap="round"/>
      <line x1="45" y1="63" x2="45" y2="88" stroke="#00D4F0" strokeWidth="2.4" strokeLinecap="round"/>
      <line x1="2"  y1="45" x2="27" y2="45" stroke="#00D4F0" strokeWidth="2.4" strokeLinecap="round"/>
      <line x1="63" y1="45" x2="88" y2="45" stroke="#00D4F0" strokeWidth="2.4" strokeLinecap="round"/>
      {/* diagonal ticks */}
      <line x1="15" y1="15" x2="21" y2="21" stroke="#00D4F0" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
      <line x1="75" y1="75" x2="69" y2="69" stroke="#00D4F0" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
      <line x1="75" y1="15" x2="69" y2="21" stroke="#00D4F0" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
      <line x1="15" y1="75" x2="21" y2="69" stroke="#00D4F0" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
      {/* center dot */}
      <circle cx="45" cy="45" r="10" fill="#00D4F0"/>
      {/* highlight */}
      <circle cx="41" cy="41" r="3.5" fill="white" fillOpacity="0.22"/>
    </svg>
  </div>
);

export const StrikePanelWordmark: React.FC<{
  fontSize?: number;
  bebas: string;
  barlow: string;
}> = ({fontSize = 120, bebas, barlow}) => (
  <div style={{
    fontFamily: bebas,
    fontSize,
    lineHeight: 0.9,
    letterSpacing: '0.06em',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  }}>
    <span style={{color: '#eef0f8', textShadow: '0 0 60px rgba(255,255,255,0.08)'}}>
      STRIKE
    </span>
    <span style={{
      color: '#00D4F0',
      textShadow: '0 0 50px rgba(0,212,240,0.7)',
    }}>
      PANEL
    </span>
    <span style={{
      fontFamily: barlow,
      fontSize: fontSize * 0.25,
      fontWeight: 700,
      color: '#00D4F0',
      alignSelf: 'flex-start',
      marginTop: fontSize * 0.05,
      marginLeft: 4,
      textShadow: '0 0 20px rgba(0,212,240,0.8)',
    }}>
      ™
    </span>
  </div>
);
