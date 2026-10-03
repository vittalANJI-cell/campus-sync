import React from 'react';

/* ── 3D Calendar / Schedule Illustration ── */
export function IllustrationSchedule({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shadow */}
      <ellipse cx="100" cy="185" rx="55" ry="8" fill="rgba(99,102,241,0.15)" />
      {/* Back face */}
      <rect x="30" y="28" width="130" height="150" rx="16" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1.5" />
      {/* Front face */}
      <rect x="25" y="22" width="130" height="150" rx="16" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5" />
      {/* Header band */}
      <rect x="25" y="22" width="130" height="40" rx="16" fill="#4338ca" />
      <rect x="25" y="46" width="130" height="16" rx="0" fill="#4338ca" />
      {/* Calendar icon on header */}
      <rect x="55" y="32" width="70" height="22" rx="6" fill="rgba(255,255,255,0.12)" />
      <text x="90" y="47" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">SCHEDULE</text>
      {/* Grid lines */}
      {[0,1,2,3].map(r => (
        <g key={r}>
          {[0,1,2].map(c => (
            <rect key={c}
              x={36 + c * 40} y={76 + r * 26}
              width="32" height="18" rx="5"
              fill={r === 0 && c === 0 ? '#4338ca' : r === 1 && c === 1 ? '#7c3aed' : 'rgba(255,255,255,0.06)'}
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
            />
          ))}
        </g>
      ))}
      {/* Event blocks */}
      <rect x="36" y="76" width="72" height="18" rx="5" fill="#6366f1" opacity="0.9"/>
      <rect x="76" y="102" width="72" height="18" rx="5" fill="#8b5cf6" opacity="0.9"/>
      <rect x="36" y="128" width="32" height="18" rx="5" fill="#06b6d4" opacity="0.9"/>
      <rect x="116" y="154" width="32" height="18" rx="5" fill="#10b981" opacity="0.9"/>
      {/* Dots decoration */}
      <circle cx="145" cy="35" r="5" fill="rgba(255,255,255,0.3)" />
      <circle cx="157" cy="35" r="5" fill="rgba(255,255,255,0.15)" />
      {/* Floating badge */}
      <rect x="110" y="10" width="50" height="22" rx="11" fill="#10b981" />
      <text x="135" y="25" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">LIVE</text>
    </svg>
  );
}

/* ── 3D Building / Campus Illustration ── */
export function IllustrationCampus({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="100" cy="188" rx="70" ry="10" fill="rgba(99,102,241,0.12)" />
      {/* Ground */}
      <rect x="15" y="155" width="170" height="30" rx="4" fill="#1e293b" />
      {/* Main building */}
      <rect x="50" y="60" width="100" height="95" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
      {/* Building top 3d edge */}
      <polygon points="50,60 140,60 150,50 60,50" fill="#2563eb" />
      {/* Roof */}
      <rect x="60" y="42" width="80" height="10" rx="2" fill="#1d4ed8" />
      {/* Windows row 1 */}
      {[0,1,2].map(i => (
        <rect key={i} x={62 + i*28} y={75} width="18" height="22" rx="3" fill="#bfdbfe" opacity="0.8"/>
      ))}
      {/* Windows row 2 */}
      {[0,1,2].map(i => (
        <rect key={i} x={62 + i*28} y={108} width="18" height="22" rx="3"
          fill={i === 1 ? '#fde68a' : '#bfdbfe'} opacity="0.9"/>
      ))}
      {/* Door */}
      <rect x="85" y="130" width="30" height="25" rx="4" fill="#1d4ed8"/>
      <circle cx="112" cy="143" r="2.5" fill="#fde68a" />
      {/* Side building small */}
      <rect x="15" y="100" width="35" height="55" rx="3" fill="#1e2d40" stroke="#334155" strokeWidth="1"/>
      {[0,1].map(i => (
        <rect key={i} x={22} y={108 + i*22} width="12" height="14" rx="2" fill="#93c5fd" opacity="0.7"/>
      ))}
      {/* Flag */}
      <line x1="100" y1="42" x2="100" y2="22" stroke="#6366f1" strokeWidth="1.5"/>
      <polygon points="100,22 118,28 100,34" fill="#818cf8"/>
      {/* Stars/sparkles */}
      <circle cx="170" cy="30" r="2" fill="#fde68a" opacity="0.8"/>
      <circle cx="25" cy="55" r="1.5" fill="#a78bfa" opacity="0.6"/>
      <circle cx="178" cy="80" r="1.5" fill="#38bdf8" opacity="0.7"/>
    </svg>
  );
}

/* ── 3D Conflict / Warning Illustration ── */
export function IllustrationConflict({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="100" cy="185" rx="55" ry="8" fill="rgba(239,68,68,0.15)" />
      {/* Back shield */}
      <path d="M115 30 L160 50 L160 110 C160 140 135 165 115 175 C95 165 70 140 70 110 L70 50 Z"
        fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" transform="translate(5,5)" opacity="0.5"/>
      {/* Front shield */}
      <path d="M100 25 L150 48 L150 110 C150 142 124 168 100 178 C76 168 50 142 50 110 L50 48 Z"
        fill="#1c0505" stroke="#f87171" strokeWidth="2"/>
      {/* Shield inner glow */}
      <path d="M100 35 L140 55 L140 110 C140 136 118 158 100 168 C82 158 60 136 60 110 L60 55 Z"
        fill="#450a0a" opacity="0.6"/>
      {/* Warning symbol */}
      <path d="M100 65 L120 105 L80 105 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5"
        strokeLinejoin="round"/>
      <rect x="97" y="73" width="6" height="18" rx="3" fill="#1c0505"/>
      <circle cx="100" cy="99" r="3" fill="#1c0505"/>
      {/* Clash lines */}
      <line x1="70" y1="120" x2="88" y2="138" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="112" y1="120" x2="130" y2="138" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      {/* Corner badge */}
      <circle cx="148" cy="28" r="16" fill="#dc2626" />
      <text x="148" y="33" textAnchor="middle" fill="white" fontSize="16" fontWeight="900" fontFamily="Inter,sans-serif">!</text>
    </svg>
  );
}

/* ── 3D Rocket / Generate Illustration ── */
export function IllustrationRocket({ className = '' }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Flame */}
      <ellipse cx="70" cy="120" rx="14" ry="18" fill="#f97316" opacity="0.9"/>
      <ellipse cx="70" cy="118" rx="9" ry="14" fill="#fde68a" opacity="0.95"/>
      {/* Body */}
      <path d="M55 85 Q55 30 70 15 Q85 30 85 85 Z" fill="#6366f1"/>
      {/* Body shine */}
      <path d="M64 80 Q63 40 70 22 Q71 40 71 80 Z" fill="rgba(255,255,255,0.2)"/>
      {/* Nose cone */}
      <path d="M62 36 Q70 10 78 36 Z" fill="#818cf8"/>
      {/* Fins */}
      <path d="M55 85 L42 105 L57 92 Z" fill="#4338ca"/>
      <path d="M85 85 L98 105 L83 92 Z" fill="#4338ca"/>
      {/* Window */}
      <circle cx="70" cy="60" r="10" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5"/>
      <circle cx="70" cy="60" r="6" fill="#dbeafe" />
      <circle cx="67" cy="57" r="2" fill="white" opacity="0.7"/>
      {/* Stars */}
      <circle cx="25" cy="25" r="2" fill="#fde68a"/>
      <circle cx="115" cy="40" r="1.5" fill="#a78bfa"/>
      <circle cx="20" cy="70" r="1" fill="#38bdf8"/>
      <circle cx="118" cy="75" r="2" fill="#fde68a" opacity="0.8"/>
    </svg>
  );
}

/* ── 3D Chart bars illustration ── */
export function IllustrationChart({ className = '' }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Grid lines */}
      {[0,1,2,3].map(i => (
        <line key={i} x1="20" y1={95 - i*22} x2="145" y2={95 - i*22}
          stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      ))}
      {/* Bars with 3D effect */}
      {[
        { x:28, h:60, c1:'#6366f1', c2:'#4338ca', c3:'#3730a3' },
        { x:55, h:80, c1:'#8b5cf6', c2:'#7c3aed', c3:'#6d28d9' },
        { x:82, h:45, c1:'#06b6d4', c2:'#0891b2', c3:'#0e7490' },
        { x:109, h:70, c1:'#10b981', c2:'#059669', c3:'#047857' },
      ].map((b, i) => (
        <g key={i}>
          {/* Side face */}
          <polygon points={`${b.x+18},${95-b.h} ${b.x+24},${95-b.h-5} ${b.x+24},${95-5} ${b.x+18},${95}`} fill={b.c3}/>
          {/* Top face */}
          <polygon points={`${b.x},${95-b.h} ${b.x+18},${95-b.h} ${b.x+24},${95-b.h-5} ${b.x+6},${95-b.h-5}`} fill={b.c1} opacity="0.9"/>
          {/* Front face */}
          <rect x={b.x} y={95-b.h} width="18" height={b.h} fill={b.c2}/>
        </g>
      ))}
      {/* Axis */}
      <line x1="20" y1="18" x2="20" y2="96" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
      <line x1="20" y1="96" x2="148" y2="96" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
    </svg>
  );
}
