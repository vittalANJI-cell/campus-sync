import React from 'react';
import {
  LayoutDashboard, CalendarDays, Clock, Building2,
  AlertTriangle, Settings, Zap, Menu, X, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const navItems = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, color: '#818cf8' },
  { id: 'events',     label: 'Events',      icon: CalendarDays,    color: '#34d399' },
  { id: 'schedule',   label: 'Schedule',    icon: Clock,           color: '#38bdf8' },
  { id: 'resources',  label: 'Resources',   icon: Building2,       color: '#c084fc' },
  { id: 'conflicts',  label: 'Conflicts',   icon: AlertTriangle,   color: '#f87171' },
  { id: 'settings',   label: 'Settings',    icon: Settings,        color: '#94a3b8' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }) {
  const { stats } = useApp();

  return (
    <aside className={`
      fixed top-0 left-0 h-full flex flex-col z-30
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-64'}
    `}
      style={{
        background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1526 40%, #0a1020 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Ambient orbs */}
      <div className="orb w-32 h-32 top-10 -left-10 pulse-glow"
        style={{ background: 'rgba(99,102,241,0.12)' }} />
      <div className="orb w-24 h-24 bottom-40 -right-8 pulse-glow"
        style={{ background: 'rgba(168,85,247,0.08)', animationDelay: '1.5s' }} />

      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 relative z-10 ${collapsed ? 'justify-center' : ''}`}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
          <Zap size={17} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold text-base leading-tight text-white tracking-wide"
              style={{ letterSpacing: '0.02em' }}>CampusSync</div>
            <div className="text-[10px] leading-tight" style={{ color: '#6366f1' }}>
              Smart Scheduling AI
            </div>
          </div>
        )}
        <button onClick={onToggle}
          className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-white/5 text-slate-500 hover:text-white"
          style={{ flexShrink: 0 }}>
          {collapsed ? <Menu size={15} /> : <X size={15} />}
        </button>
      </div>

      {/* Nav label */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-2 relative z-10">
          <span className="text-[10px] font-semibold tracking-widest uppercase"
            style={{ color: '#334155' }}>Navigation</span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto relative z-10 pb-4">
        {navItems.map(({ id, label, icon: Icon, color }) => {
          const isActive = activePage === id;
          const hasBadge = id === 'conflicts' && stats.conflictCount > 0;

          return (
            <button key={id} onClick={() => onNavigate(id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 relative group
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}
              `}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
                boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.2)',
              } : {}}
            >
              {/* Hover bg */}
              {!isActive && (
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(255,255,255,0.03)' }} />
              )}

              {/* Icon container */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all`}
                style={isActive
                  ? { background: `${color}22`, boxShadow: `0 0 12px ${color}33` }
                  : { background: 'rgba(255,255,255,0.03)' }}>
                <Icon size={16} style={{ color: isActive ? color : '#64748b' }} />
              </div>

              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{label}</span>
                  {hasBadge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center text-white"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>
                      {stats.conflictCount}
                    </span>
                  )}
                </>
              )}

              {/* Active right bar */}
              {isActive && <div className="nav-active-bar" />}

              {/* Collapsed tooltip */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>A</div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Administrator</div>
              <div className="text-[10px]" style={{ color: '#475569' }}>admin@college.edu</div>
            </div>
            <Sparkles size={12} style={{ color: '#6366f1', flexShrink: 0 }} />
          </div>
        </div>
      )}
    </aside>
  );
}
