import React from 'react';
import { Bell, User, Zap, Loader2, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const pageLabels = {
  dashboard: 'Dashboard',
  events: 'Events',
  schedule: 'Schedule',
  resources: 'Resources',
  conflicts: 'Conflicts',
  settings: 'Settings',
};

const pageSubs = {
  dashboard: 'Overview of your scheduling activity',
  events:    'Manage and track all college events',
  schedule:  'View the generated timetable',
  resources: 'Manage rooms, labs and equipment',
  conflicts: 'Detect and resolve scheduling conflicts',
  settings:  'Configure application settings',
};

export default function Header({ activePage, sidebarCollapsed }) {
  const { notification, isGenerating, generatingStep, runGenerateSchedule } = useApp();

  return (
    <header className={`
      fixed top-0 right-0 h-16 z-20
      flex items-center px-6 gap-4
      transition-all duration-300
      ${sidebarCollapsed ? 'left-16' : 'left-64'}
    `}
      style={{
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white leading-tight">{pageLabels[activePage]}</h1>
        <p className="text-[11px] hidden sm:block" style={{ color: '#475569' }}>{pageSubs[activePage]}</p>
      </div>

      {/* Generating indicator */}
      {isGenerating && (
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Loader2 size={13} className="animate-spin" />
          {generatingStep}
        </div>
      )}

      {/* Generate Schedule button */}
      <button
        onClick={runGenerateSchedule}
        disabled={isGenerating}
        className="btn-glow flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}
      >
        {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
        <span className="hidden sm:inline">Generate Smart Schedule</span>
        <span className="sm:hidden">Generate</span>
      </button>

      {/* Bell */}
      <button className="relative p-2 rounded-xl transition-colors hover:bg-white/5"
        style={{ color: '#475569' }}>
        <Bell size={17} />
      </button>

      {/* Avatar */}
      <div className="flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>A</div>
        <span className="text-sm font-medium text-white hidden md:block">Admin</span>
      </div>

      {/* Toast notification */}
      {notification && (
        <div className={`
          fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium z-50 max-w-sm
        `}
          style={{
            background: notification.type === 'success' ? 'linear-gradient(135deg,#059669,#10b981)' :
                        notification.type === 'warning' ? 'linear-gradient(135deg,#d97706,#f59e0b)' :
                        notification.type === 'error'   ? 'linear-gradient(135deg,#dc2626,#ef4444)' :
                                                          'linear-gradient(135deg,#1e293b,#334155)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            animation: 'slideUp 0.3s ease',
          }}>
          {notification.type === 'success' && <CheckCircle size={16} />}
          {notification.type === 'warning' && <AlertCircle size={16} />}
          {notification.type === 'error'   && <AlertCircle size={16} />}
          {notification.type === 'info'    && <Info size={16} />}
          {notification.message}
        </div>
      )}
    </header>
  );
}
