import React, { useState } from 'react';
import { Clock, Users, MapPin, Wrench, Calendar, Edit, RefreshCw, Trash2 } from 'lucide-react';
import Modal from './Modal.jsx';
import Badge from './Badge.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatTime, buildSuggestions } from '../services/scheduler.js';

export default function EventDetailsModal({ event, onClose, onEdit }) {
  const { resources, events, rescheduleEvent, deleteEvent } = useApp();
  const [showReschedule, setShowReschedule] = useState(false);

  if (!event) return null;

  const room = resources.find(r => r.id === event.assignedRoom);
  const assignedOthers = events.filter(e => e.id !== event.id && e.assignedRoom && e.assignedStartTime);
  const suggestions = buildSuggestions(event, resources, assignedOthers);

  const endTime = event.assignedStartTime
    ? (() => {
        const [h, m] = event.assignedStartTime.split(':').map(Number);
        const endMin = h * 60 + m + event.duration * 60;
        return `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
      })()
    : null;

  return (
    <Modal open={!!event} onClose={onClose} title="Event Details" size="md">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">{event.name}</h3>
            <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{event.organizer}</p>
          </div>
          <Badge label={event.status} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoRow icon={Calendar} label="Date"     value={event.date} />
          <InfoRow icon={Clock}    label="Start"    value={event.assignedStartTime ? formatTime(event.assignedStartTime) : formatTime(event.startTime) + ' (pref)'} />
          {endTime && <InfoRow icon={Clock} label="End" value={formatTime(endTime)} />}
          <InfoRow icon={Clock}    label="Duration" value={`${event.duration}h`} />
          <InfoRow icon={Users}    label="Participants" value={event.participants} />
          <InfoRow icon={MapPin}   label="Room Type"    value={event.roomType} />
        </div>

        {/* Assigned room */}
        {room && (
          <div className="rounded-xl p-3"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#818cf8' }}>Assigned Location</p>
            <p className="text-sm font-bold text-white">{room.name}</p>
            <p className="text-xs" style={{ color: '#64748b' }}>Capacity: {room.capacity} · {room.equipment.join(', ')}</p>
          </div>
        )}

        {/* Equipment */}
        {event.equipment.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: '#64748b' }}>
              <Wrench size={11} /> Equipment
            </p>
            <div className="flex flex-wrap gap-1.5">
              {event.equipment.map(eq => (
                <span key={eq} className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Badge label={event.type} />
          <Badge label={event.priority} />
        </div>

        {/* Reschedule suggestions */}
        {showReschedule && (
          <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-sm font-bold mb-2" style={{ color: '#fbbf24' }}>Available Alternatives</p>
            {suggestions.length === 0 ? (
              <p className="text-xs" style={{ color: '#92400e' }}>No alternatives available right now.</p>
            ) : suggestions.map((sug, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 mb-1.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xs text-white">{sug.label}</span>
                <button onClick={() => { rescheduleEvent(event.id, sug); onClose(); }}
                  className="text-xs font-semibold px-2 py-1 rounded-lg text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  Use
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Edit size={12} /> Edit
          </button>
          <button onClick={() => setShowReschedule(p => !p)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors"
            style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
            <RefreshCw size={12} /> Reschedule
          </button>
          <button onClick={() => { if(confirm(`Delete "${event.name}"?`)) { deleteEvent(event.id); onClose(); } }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ml-auto"
            style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.2)' }}>
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={13} style={{ color: '#475569', marginTop: 2, flexShrink: 0 }} />
      <div>
        <p className="text-[10px] uppercase tracking-wider" style={{ color: '#334155' }}>{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
