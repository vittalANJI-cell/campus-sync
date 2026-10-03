import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Zap, Shield } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import { IllustrationConflict } from '../components/Illustrations.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatTime } from '../services/scheduler.js';

export default function Conflicts() {
  const { conflicts, events, resources, rescheduleEvent, runGenerateSchedule, isGenerating } = useApp();
  const [expanded, setExpanded] = useState(null);
  const [resolvedIds, setResolvedIds] = useState(new Set());

  const active   = conflicts.filter(c => !resolvedIds.has(c.id));
  const resolved = conflicts.filter(c =>  resolvedIds.has(c.id));
  const sorted   = [...active].sort((a,b) => ({High:0,Medium:1,Low:2}[a.severity]??3) - ({High:0,Medium:1,Low:2}[b.severity]??3));

  function handleUseSuggestion(conflict, suggestion) {
    rescheduleEvent(conflict.eventId, suggestion);
    setResolvedIds(prev => new Set([...prev, conflict.id]));
  }

  const cardStyle = { background:'rgba(15,23,42,0.7)', border:'1px solid rgba(255,255,255,0.05)', backdropFilter:'blur(12px)' };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Active Conflicts', value:active.length,   bg:'rgba(220,38,38,0.08)',  border:'rgba(220,38,38,0.2)',   color:'#f87171'  },
          { label:'Resolved',         value:resolved.length, bg:'rgba(5,150,105,0.08)',  border:'rgba(5,150,105,0.2)',   color:'#34d399'  },
          { label:'High Severity',    value:active.filter(c=>c.severity==='High').length, bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.2)', color:'#fbbf24' },
        ].map(card => (
          <div key={card.label} className="rounded-2xl p-5"
            style={{ background: card.bg, border: `1px solid ${card.border}` }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: card.color, opacity: 0.8 }}>{card.label}</p>
            <p className="text-3xl font-extrabold" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {conflicts.length === 0 && (
        <div className="rounded-2xl p-12 text-center" style={cardStyle}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.2)' }}>
            <Shield size={28} style={{ color: '#34d399' }} />
          </div>
          <p className="text-base font-bold text-white mb-1">No conflicts detected</p>
          <p className="text-sm mb-5" style={{ color: '#475569' }}>Generate a schedule to check for conflicts.</p>
          <button onClick={runGenerateSchedule} disabled={isGenerating}
            className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Zap size={14} /> Generate Schedule
          </button>
        </div>
      )}

      {/* Active conflicts */}
      {sorted.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.15)' }}>
              <AlertTriangle size={15} style={{ color: '#f87171' }} />
            </div>
            <h2 className="text-sm font-bold text-white">Active Conflicts</h2>
            <div className="ml-auto flex items-center gap-2">
              <IllustrationConflict className="w-10 h-10 opacity-60" />
            </div>
          </div>

          {/* Column headers */}
          <div className="grid gap-3 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ gridTemplateColumns:'40px 1fr 160px 160px 160px 90px 80px', background:'rgba(255,255,255,0.01)', borderBottom:'1px solid rgba(255,255,255,0.03)', color:'#334155' }}>
            <div>#</div><div>Event</div><div>Type</div><div>Resource</div><div>Time</div><div>Severity</div><div></div>
          </div>

          <div>
            {sorted.map((c, idx) => {
              const isOpen = expanded === c.id;
              return (
                <div key={c.id}>
                  <div className="grid gap-3 px-5 py-4 items-center transition-colors"
                    style={{ gridTemplateColumns:'40px 1fr 160px 160px 160px 90px 80px', borderBottom:'1px solid rgba(255,255,255,0.03)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="text-xs font-mono" style={{ color: '#334155' }}>#{String(idx+1).padStart(3,'0')}</div>
                    <div>
                      <p className="text-sm font-bold text-white truncate">{c.eventName}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#475569' }}>{c.message}</p>
                    </div>
                    <div><Badge label={c.type} size="xs" /></div>
                    <div className="text-xs truncate" style={{ color: '#64748b' }}>{c.resource}</div>
                    <div className="text-xs font-mono" style={{ color: '#64748b' }}>{c.time}</div>
                    <div><Badge label={c.severity} size="xs" /></div>
                    <div className="flex justify-end">
                      <button onClick={() => setExpanded(isOpen ? null : c.id)}
                        className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors"
                        style={{ color: '#818cf8', background: 'rgba(99,102,241,0.1)' }}>
                        Fix {isOpen ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mx-5 mb-4 rounded-2xl p-4"
                      style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.15)' }}>
                      <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: '#fbbf24' }}>
                        <AlertTriangle size={12} /> Suggested Alternatives for "{c.eventName}"
                      </p>
                      {c.suggestions?.length > 0 ? c.suggestions.map((sug, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3 mb-2"
                          style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                          <div>
                            <p className="text-sm font-bold text-white">✓ {sug.roomName}</p>
                            <p className="text-xs" style={{ color: '#64748b' }}>{formatTime(sug.startTime)} – {formatTime(sug.endTime)}</p>
                          </div>
                          <button onClick={() => handleUseSuggestion(c, sug)}
                            className="btn-glow text-xs font-bold px-4 py-2 rounded-xl text-white"
                            style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                            Use This Slot
                          </button>
                        </div>
                      )) : (
                        <p className="text-xs" style={{ color: '#92400e' }}>No alternatives available. Add more resources.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background:'rgba(5,150,105,0.05)', border:'1px solid rgba(5,150,105,0.15)' }}>
          <div className="px-5 py-4" style={{ borderBottom:'1px solid rgba(5,150,105,0.1)' }}>
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color:'#34d399' }}>
              <CheckCircle size={14}/> Resolved ({resolved.length})
            </h2>
          </div>
          {resolved.map(c => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3 opacity-60"
              style={{ borderBottom:'1px solid rgba(255,255,255,0.02)' }}>
              <CheckCircle size={13} style={{ color:'#34d399', flexShrink:0 }}/>
              <p className="text-sm text-white line-through">{c.eventName}</p>
              <Badge label={c.type} size="xs" />
              <span className="text-xs ml-auto font-semibold" style={{ color:'#34d399' }}>Resolved</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
