import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import EventForm from '../components/EventForm.jsx';
import EventDetailsModal from '../components/EventDetailsModal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatTime } from '../services/scheduler.js';
import { EVENT_TYPES } from '../data/sampleData.js';

export default function Events() {
  const { events, resources, addEvent, updateEvent, deleteEvent } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);

  const filtered = useMemo(() => events.filter(e => {
    const ms = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.organizer.toLowerCase().includes(search.toLowerCase());
    const mt = !filterType || e.type === filterType;
    const ms2 = !filterStatus || e.status === filterStatus;
    return ms && mt && ms2;
  }), [events, search, filterType, filterStatus]);

  const roomMap = Object.fromEntries(resources.map(r => [r.id, r]));

  const selectCls = "input-dark text-xs";

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            className="input-dark pl-9"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className={selectCls} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className={selectCls} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {['Pending','Scheduled','Conflict','Unscheduled'].map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowAddModal(true)}
          className="btn-glow flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Plus size={14} /> Add Event
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['Event Name','Organizer','Type','Participants','Room Type','Date & Time','Duration','Priority','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: '#334155', background: 'rgba(255,255,255,0.02)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-sm" style={{ color: '#334155' }}>
                    No events found.{' '}
                    <button onClick={() => setShowAddModal(true)} style={{ color: '#6366f1' }} className="hover:underline">Add one →</button>
                  </td>
                </tr>
              ) : filtered.map(ev => {
                const room = roomMap[ev.assignedRoom];
                return (
                  <tr key={ev.id} className="group transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white whitespace-nowrap">{ev.name}</div>
                      {ev.equipment.length > 0 && (
                        <div className="text-[11px] truncate max-w-[180px]" style={{ color: '#334155' }}>{ev.equipment.join(', ')}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#64748b' }}>{ev.organizer}</td>
                    <td className="px-4 py-3"><Badge label={ev.type} size="xs" /></td>
                    <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{ev.participants}</td>
                    <td className="px-4 py-3"><Badge label={ev.roomType} size="xs" /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div style={{ color: '#94a3b8' }}>{ev.date}</div>
                      <div className="text-[11px]" style={{ color: ev.assignedStartTime ? '#34d399' : '#475569' }}>
                        {ev.assignedStartTime ? `✓ ${formatTime(ev.assignedStartTime)}` : `Pref: ${formatTime(ev.startTime)}`}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#94a3b8' }}>{ev.duration}h</td>
                    <td className="px-4 py-3"><Badge label={ev.priority} size="xs" /></td>
                    <td className="px-4 py-3"><Badge label={ev.status} size="xs" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[
                          { icon: Eye,   action: () => setViewingEvent(ev),  color: '#818cf8' },
                          { icon: Edit,  action: () => setEditingEvent(ev),  color: '#fbbf24' },
                          { icon: Trash2,action: () => { if(confirm(`Delete "${ev.name}"?`)) deleteEvent(ev.id); }, color: '#f87171' },
                        ].map(({ icon: Icon, action, color }, i) => (
                          <button key={i} onClick={action}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#475569' }}
                            onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = `${color}15`; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}>
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.03)', color: '#334155' }}>
            Showing {filtered.length} of {events.length} events
          </div>
        )}
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Event" size="lg">
        <EventForm onSubmit={d => { addEvent(d); setShowAddModal(false); }} onCancel={() => setShowAddModal(false)} />
      </Modal>
      <Modal open={!!editingEvent} onClose={() => setEditingEvent(null)} title="Edit Event" size="lg">
        <EventForm initial={editingEvent} onSubmit={d => { updateEvent(editingEvent.id, d); setEditingEvent(null); }} onCancel={() => setEditingEvent(null)} />
      </Modal>
      <EventDetailsModal event={viewingEvent} onClose={() => setViewingEvent(null)} onEdit={() => { setEditingEvent(viewingEvent); setViewingEvent(null); }} />
    </div>
  );
}
