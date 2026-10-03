import React from 'react';

const gradients = {
  blue:   'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
  green:  'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
  amber:  'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
  red:    'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
  purple: 'linear-gradient(135deg, #3b0764 0%, #9333ea 100%)',
  teal:   'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)',
  indigo: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)',
};

const glows = {
  blue:   'rgba(37,99,235,0.35)',
  green:  'rgba(5,150,105,0.35)',
  amber:  'rgba(217,119,6,0.35)',
  red:    'rgba(220,38,38,0.35)',
  purple: 'rgba(147,51,234,0.35)',
  teal:   'rgba(13,148,136,0.35)',
  indigo: 'rgba(99,102,241,0.35)',
};

const iconBgs = {
  blue:   'rgba(96,165,250,0.15)',
  green:  'rgba(52,211,153,0.15)',
  amber:  'rgba(251,191,36,0.15)',
  red:    'rgba(248,113,113,0.15)',
  purple: 'rgba(192,132,252,0.15)',
  teal:   'rgba(45,212,191,0.15)',
  indigo: 'rgba(129,140,248,0.15)',
};

const iconColors = {
  blue:   '#93c5fd', green: '#6ee7b7', amber: '#fcd34d',
  red:    '#fca5a5', purple: '#d8b4fe', teal: '#5eead4', indigo: '#a5b4fc',
};

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  return (
    <div className="card-3d relative overflow-hidden rounded-2xl p-5 cursor-default"
      style={{
        background: gradients[color] || gradients.blue,
        boxShadow: `0 8px 24px ${glows[color] || glows.blue}, inset 0 1px 0 rgba(255,255,255,0.1)`,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer pointer-events-none" />

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'rgba(255,255,255,0.5)' }}>{title}</p>
          <p className="text-3xl font-extrabold text-white leading-none">{value}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: iconBgs[color] || iconBgs.blue }}>
            <Icon size={21} style={{ color: iconColors[color] || '#fff' }} />
          </div>
        )}
      </div>

      {/* Bottom corner decoration */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.3)' }} />
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-5"
        style={{ background: 'rgba(255,255,255,0.3)' }} />
    </div>
  );
}
