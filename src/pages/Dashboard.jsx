import React from 'react';
import {
  CalendarDays, CheckCircle2, Clock, Building2,
  AlertTriangle, Zap, TrendingUp, ArrowRight, Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';
import {
  IllustrationSchedule, IllustrationCampus,
  IllustrationChart, IllustrationRocket
} from '../components/Illustrations.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatTime } from '../services/scheduler.js';

export default function Dashboard({ onNavigate }) {
  const { events, resources, stats, conflicts, runGenerateSchedule, isGenerating, scheduleStats } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events
    .filter(e => e.date === today)
    .sort((a, b) => (a.assignedStartTime || a.startTime).localeCompare(b.assignedStartTime || b.startTime));

  const roomMap = Object.fromEntries(resources.map(r => [r.id, r]));

  const typeCount = {};
  for (const r of resources) {
    if (!typeCount[r.type]) typeCount[r.type] = { total: 0, inUse: 0 };
    typeCount[r.type].total++;
    if (events.some(e => e.assignedRoom === r.id)) typeCount[r.type].inUse++;
  }

  return (
    <div className="space-y-6">

      {/* ── Hero Banner ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl p-7"
        style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 40%, #24243e 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
        }}>
        {/* Background orbs */}
        <div className="orb w-72 h-72 -top-20 -right-10" style={{ background: 'rgba(99,102,241,0.12)' }} />
        <div className="orb w-48 h-48 top-10 right-40 pulse-glow" style={{ background: 'rgba(168,85,247,0.08)' }} />
        <div className="orb w-56 h-56 -bottom-20 left-1/3" style={{ background: 'rgba(56,189,248,0.06)' }} />

        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
                <Sparkles size={11} /> AI-Powered Scheduling
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2 leading-tight">
              Welcome to{' '}
              <span className="gradient-text">CampusSync</span>
            </h2>
            <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
              Intelligent college event &amp; resource scheduling. Detect conflicts, optimize rooms, and generate conflict-free timetables instantly.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={runGenerateSchedule} disabled={isGenerating}
                className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <Zap size={15} />
                {isGenerating ? 'Generating...' : 'Generate Smart Schedule'}
              </button>
              <button onClick={() => onNavigate('events')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                View Events <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 3D Illustrations cluster */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <div className="float-anim">
              <IllustrationSchedule className="w-36 h-36" />
            </div>
            <div className="float-slow">
              <IllustrationCampus className="w-40 h-40" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Events"     value={stats.total}              icon={CalendarDays}  color="indigo" />
        <StatCard title="Scheduled"        value={stats.scheduled}          icon={CheckCircle2}  color="green"  />
        <StatCard title="Pending"          value={stats.pending}            icon={Clock}         color="amber"  />
        <StatCard title="Unscheduled"      value={stats.unscheduled}        icon={AlertTriangle} color="red"    />
        <StatCard title="Resources"        value={stats.availableResources} icon={Building2}     color="purple" />
        <StatCard title="Conflicts"        value={stats.conflictCount}      icon={AlertTriangle} color={stats.conflictCount > 0 ? 'red' : 'teal'} />
      </div>

      {/* ── Main content row ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Today's Timeline */}
        <div className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Today's Schedule</h3>
              <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button onClick={() => onNavigate('schedule')}
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: '#6366f1' }}>
              View all <ArrowRight size={12} />
            </button>
          </div>

          {todayEvents.length === 0 ? (
            <div className="text-center py-12">
              <IllustrationRocket className="w-20 h-20 mx-auto mb-3 float-slow opacity-70" />
              <p className="text-sm font-medium text-white mb-1">No events scheduled yet</p>
              <p className="text-xs mb-4" style={{ color: '#475569' }}>Generate a schedule to get started</p>
              <button onClick={runGenerateSchedule} disabled={isGenerating}
                className="btn-glow inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                <Zap size={13} /> Generate Now
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((ev, idx) => {
                const room = roomMap[ev.assignedRoom];
                const time = ev.assignedStartTime || ev.startTime;
                const dotColor = {
                  Scheduled: '#22c55e', Pending: '#f59e0b',
                  Conflict: '#ef4444', Unscheduled: '#ef4444'
                }[ev.status] || '#64748b';
                return (
                  <div key={ev.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <div className="w-1.5 h-10 rounded-full flex-shrink-0"
                      style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}80` }} />
                    <div className="w-20 flex-shrink-0">
                      <span className="text-xs font-mono font-semibold" style={{ color: '#818cf8' }}>
                        {formatTime(time)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{ev.name}</p>
                      <p className="text-xs truncate" style={{ color: '#475569' }}>
                        {room ? room.name : ev.roomType} · {ev.participants} participants
                      </p>
                    </div>
                    <Badge label={ev.status} size="xs" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Schedule Run Summary */}
          {scheduleStats ? (
            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', backdropFilter: 'blur(12px)' }}>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Zap size={14} style={{ color: '#818cf8' }} /> Last Schedule Run
              </h3>
              <div className="space-y-2.5 mb-4">
                <SRow label="Total"      value={scheduleStats.total}         />
                <SRow label="Scheduled"  value={scheduleStats.scheduled}     color="#22c55e" />
                <SRow label="Conflicts"  value={scheduleStats.conflictCount} color={scheduleStats.conflictCount > 0 ? '#ef4444' : '#22c55e'} />
                <SRow label="Unscheduled" value={scheduleStats.unscheduled}  color={scheduleStats.unscheduled > 0 ? '#ef4444' : '#94a3b8'} />
              </div>
              {/* Utilization */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: '#64748b' }}>Resource Utilization</span>
                  <span className="font-bold" style={{ color: '#818cf8' }}>{scheduleStats.utilization}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${scheduleStats.utilization}%`,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      boxShadow: '0 0 8px rgba(99,102,241,0.5)',
                    }} />
                </div>
              </div>
              {/* Mini chart */}
              <div className="mt-4 opacity-60">
                <IllustrationChart className="w-full h-16" />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-5 text-center"
              style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
              <IllustrationRocket className="w-24 h-24 mx-auto float-slow" />
              <p className="text-xs mt-2 font-medium text-white">No schedule generated yet</p>
              <p className="text-[11px] mt-1" style={{ color: '#475569' }}>Click Generate Smart Schedule</p>
            </div>
          )}

          {/* Resource Overview */}
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Building2 size={13} style={{ color: '#c084fc' }} /> Resources
            </h3>
            <div className="space-y-2">
              {Object.entries(typeCount).map(([type, { total, inUse }]) => {
                const freeRatio = (total - inUse) / total;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#94a3b8' }}>{type}</span>
                      <span className="font-semibold" style={{ color: freeRatio > 0.5 ? '#22c55e' : '#f59e0b' }}>
                        {total - inUse}/{total}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: `${((total - inUse) / total) * 100}%`,
                          background: freeRatio > 0.5 ? '#22c55e' : '#f59e0b',
                        }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => onNavigate('resources')}
              className="flex items-center gap-1 text-xs font-medium mt-3 transition-colors"
              style={{ color: '#6366f1' }}>
              Manage resources <ArrowRight size={11} />
            </button>
          </div>

          {/* Conflicts alert */}
          {conflicts.length > 0 && (
            <div className="rounded-2xl p-4"
              style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#f87171' }}>
                <AlertTriangle size={13} /> {conflicts.length} Active Conflict{conflicts.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-1.5">
                {conflicts.slice(0, 3).map(c => (
                  <div key={c.id} className="text-xs p-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.12)', color: '#fca5a5' }}>
                    <span className="font-semibold">{c.eventName}</span>
                    <span className="block opacity-70">{c.type}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate('conflicts')}
                className="flex items-center gap-1 text-xs font-medium mt-2" style={{ color: '#f87171' }}>
                Resolve now <ArrowRight size={11} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function SRow({ label, value, color = '#94a3b8' }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span style={{ color: '#64748b' }}>{label}</span>
      <span className="font-bold" style={{ color }}>{value}</span>
    </div>
  );
}
