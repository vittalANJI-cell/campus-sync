import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Grid3x3, List, Zap, Clock } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import EventDetailsModal from '../components/EventDetailsModal.jsx';
import { IllustrationSchedule } from '../components/Illustrations.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatTime, timeToMinutes } from '../services/scheduler.js';

const DISPLAY_HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

const eventColors = {
  Scheduled:   { bg: 'rgba(99,102,241,0.2)', border: 'rgba(99,102,241,0.5)', text: '#a5b4fc' },
  Pending:     { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#fcd34d' },
  Conflict:    { bg: 'rgba(220,38,38,0.15)',  border: 'rgba(220,38,38,0.5)',  text: '#fca5a5' },
  Unscheduled: { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', text: '#94a3b8' },
};

export default function Schedule() {
  const { events, resources, runGenerateSchedule, isGenerating } = useApp();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterRoom, setFilterRoom] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewingEvent, setViewingEvent] = useState(null);

  const roomMap = Object.fromEntries(resources.map(r => [r.id, r]));

  const dayEvents = useMemo(() => events.filter(e => {
    const md = e.date === selectedDate;
    const mr = !filterRoom || e.assignedRoom === filterRoom;
    const mt = !filterType || e.type === filterType;
    return md && mr && mt;
  }), [events, selectedDate, filterRoom, filterType]);

  const scheduledEvents = dayEvents.filter(e => e.assignedRoom && e.assignedStartTime);

  const activeRooms = useMemo(() => {
    const ids = new Set(scheduledEvents.map(e => e.assignedRoom));
    return resources.filter(r => ids.has(r.id));
  }, [scheduledEvents, resources]);

  const adjDate = (delta) => {
    const d = new Date(selectedDate); d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  function getEventAt(roomId, hour) {
    const hm = timeToMinutes(hour);
    return scheduledEvents.find(e => {
      if (e.assignedRoom !== roomId) return false;
      const s = timeToMinutes(e.assignedStartTime);
      return hm >= s && hm < s + e.duration * 60;
    });
  }

  const cardStyle = { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' };
  const selectCls = "input-dark text-xs";

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date */}
        <div className="flex items-center gap-1 rounded-xl overflow-hidden"
          style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => adjDate(-1)} className="p-2 transition-colors hover:bg-white/5" style={{ color: '#475569' }}>
            <ChevronLeft size={15} />
          </button>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="text-sm font-semibold text-white bg-transparent border-0 outline-none px-1" />
          <button onClick={() => adjDate(1)} className="p-2 transition-colors hover:bg-white/5" style={{ color: '#475569' }}>
            <ChevronRight size={15} />
          </button>
        </div>

        <select className={selectCls} value={filterRoom} onChange={e => setFilterRoom(e.target.value)}>
          <option value="">All Rooms</option>
          {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select className={selectCls} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {['Workshop','Seminar','Examination','Technical Event','Meeting','Competition','Training','Cultural Event'].map(t =>
            <option key={t}>{t}</option>)}
        </select>

        {/* View toggle */}
        <div className="flex gap-1 rounded-xl p-1 ml-auto"
          style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {[{ mode:'grid', Icon: Grid3x3 }, { mode:'list', Icon: List }].map(({ mode, Icon }) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className="p-2 rounded-lg transition-all"
              style={viewMode === mode
                ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white' }
                : { color: '#475569' }}>
              <Icon size={14} />
            </button>
          ))}
        </div>

        <button onClick={runGenerateSchedule} disabled={isGenerating}
          className="btn-glow flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Zap size={14} /> Generate
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: `${scheduledEvents.length} Scheduled`, style: { background:'rgba(99,102,241,0.12)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.2)' } },
          { label: `${dayEvents.filter(e=>e.status==='Pending').length} Pending`, style: { background:'rgba(245,158,11,0.12)', color:'#fbbf24', border:'1px solid rgba(245,158,11,0.2)' } },
          ...(dayEvents.filter(e=>e.status==='Conflict').length > 0
            ? [{ label:`${dayEvents.filter(e=>e.status==='Conflict').length} Conflicts`, style: { background:'rgba(220,38,38,0.12)', color:'#f87171', border:'1px solid rgba(220,38,38,0.2)' } }]
            : []),
        ].map((chip, i) => (
          <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={chip.style}>{chip.label}</span>
        ))}
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          {activeRooms.length === 0 ? (
            <EmptySchedule onGenerate={runGenerateSchedule} isGenerating={isGenerating} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <th className="sticky left-0 z-10 w-20 px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider"
                      style={{ background: 'rgba(15,23,42,0.95)', color: '#334155', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                      TIME
                    </th>
                    {activeRooms.map(r => (
                      <th key={r.id} className="px-3 py-3 text-left min-w-[180px]"
                        style={{ borderRight: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                        <div className="text-xs font-bold text-white">{r.name}</div>
                        <div className="text-[10px]" style={{ color: '#334155' }}>{r.type} · {r.capacity}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DISPLAY_HOURS.map((hour, hi) => (
                    <tr key={hour} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td className="sticky left-0 z-10 px-3 py-1 align-top pt-3"
                        style={{ background: 'rgba(15,23,42,0.95)', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                        <span className="text-[11px] font-mono font-semibold" style={{ color: '#334155' }}>
                          {formatTime(hour)}
                        </span>
                      </td>
                      {activeRooms.map(room => {
                        const event = getEventAt(room.id, hour);
                        if (!event) return (
                          <td key={room.id} className="h-12"
                            style={{ borderRight: '1px solid rgba(255,255,255,0.02)' }} />
                        );
                        if (event.assignedStartTime !== hour) return (
                          <td key={room.id} style={{ borderRight: '1px solid rgba(255,255,255,0.02)', padding: 0 }}>
                            <div className="h-12 w-full flex items-center pl-2"
                              style={{ background: 'rgba(99,102,241,0.06)', borderLeft: '2px solid rgba(99,102,241,0.3)' }}>
                              <span className="text-[10px]" style={{ color: '#334155' }}>cont'd</span>
                            </div>
                          </td>
                        );
                        const c = eventColors[event.status] || eventColors.Scheduled;
                        return (
                          <td key={room.id} className="p-1.5 align-top"
                            style={{ borderRight: '1px solid rgba(255,255,255,0.02)' }}>
                            <button onClick={() => setViewingEvent(event)}
                              className="w-full text-left rounded-xl p-2 text-xs transition-all hover:brightness-125"
                              style={{
                                background: c.bg, border: `1px solid ${c.border}`,
                                minHeight: `${event.duration * 48}px`,
                              }}>
                              <div className="font-bold truncate" style={{ color: c.text }}>{event.name}</div>
                              <div className="mt-0.5 opacity-70" style={{ color: c.text }}>
                                {formatTime(event.assignedStartTime)} · {event.participants}p
                              </div>
                              <div className="mt-1"><Badge label={event.status} size="xs" /></div>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          {dayEvents.length === 0 ? (
            <EmptySchedule onGenerate={runGenerateSchedule} isGenerating={isGenerating} />
          ) : (
            <div>
              {[...dayEvents].sort((a,b) => (a.assignedStartTime||a.startTime).localeCompare(b.assignedStartTime||b.startTime))
                .map(ev => {
                  const room = roomMap[ev.assignedRoom];
                  const time = ev.assignedStartTime || ev.startTime;
                  const eMin = timeToMinutes(time) + ev.duration * 60;
                  const endT = `${String(Math.floor(eMin/60)).padStart(2,'0')}:${String(eMin%60).padStart(2,'0')}`;
                  const dotColor = { Scheduled:'#6366f1', Pending:'#f59e0b', Conflict:'#ef4444' }[ev.status] || '#475569';
                  return (
                    <button key={ev.id} onClick={() => setViewingEvent(ev)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div className="w-24 text-right flex-shrink-0">
                        <div className="text-sm font-mono font-bold" style={{ color: '#818cf8' }}>{formatTime(time)}</div>
                        <div className="text-[11px]" style={{ color: '#334155' }}>{formatTime(endT)}</div>
                      </div>
                      <div className="w-1 h-10 rounded-full flex-shrink-0"
                        style={{ background: dotColor, boxShadow: `0 0 8px ${dotColor}80` }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{ev.name}</p>
                        <p className="text-xs truncate" style={{ color: '#475569' }}>
                          {room?.name || ev.roomType} · {ev.organizer} · {ev.participants}p
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Badge label={ev.type} size="xs" />
                        <Badge label={ev.status} size="xs" />
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      )}

      <EventDetailsModal event={viewingEvent} onClose={() => setViewingEvent(null)} onEdit={() => setViewingEvent(null)} />
    </div>
  );
}

function EmptySchedule({ onGenerate, isGenerating }) {
  return (
    <div className="text-center py-16 px-4">
      <IllustrationSchedule className="w-28 h-28 mx-auto mb-4 float-anim opacity-60" />
      <p className="text-sm font-bold text-white mb-1">No schedule generated yet</p>
      <p className="text-xs mb-5" style={{ color: '#475569' }}>Click the button below to auto-assign rooms and time slots.</p>
      <button onClick={onGenerate} disabled={isGenerating}
        className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
        <Zap size={14} /> Generate Smart Schedule
      </button>
    </div>
  );
}
