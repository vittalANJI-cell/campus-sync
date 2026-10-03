import React, { useState, useEffect } from 'react';
import { EVENT_TYPES, ROOM_TYPES, EQUIPMENT_OPTIONS, PRIORITY_LEVELS, TIME_SLOTS } from '../data/sampleData.js';

const emptyForm = {
  name: '', organizer: '', participants: '',
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00', duration: 1,
  type: 'Workshop', roomType: 'Classroom',
  equipment: [], priority: 'Medium',
};

export default function EventForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => { setForm(initial || emptyForm); setErrors({}); }, [initial]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Event name is required.';
    if (!form.organizer.trim()) e.organizer = 'Organizer is required.';
    const p = parseInt(form.participants);
    if (!form.participants || isNaN(p) || p <= 0) e.participants = 'Must be a positive number.';
    if (!form.date) e.date = 'Date is required.';
    const d = parseInt(form.duration);
    if (!form.duration || isNaN(d) || d <= 0) e.duration = 'Must be > 0.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, participants: parseInt(form.participants), duration: parseInt(form.duration) });
  }

  function toggleEquipment(eq) {
    setForm(p => ({
      ...p,
      equipment: p.equipment.includes(eq) ? p.equipment.filter(x => x !== eq) : [...p.equipment, eq],
    }));
  }

  const labelCls = "block text-xs font-semibold mb-1.5 uppercase tracking-wider";
  const inputCls = "input-dark" + " w-full";
  const errCls   = "input-dark w-full" + " !border-red-500/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label className={labelCls} style={{ color: '#94a3b8' }}>Event Name *</label>
          <input className={errors.name ? errCls : inputCls} value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. AI Workshop" />
          {errors.name && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.name}</p>}
        </div>

        <div>
          <label className={labelCls} style={{ color: '#94a3b8' }}>Organizer *</label>
          <input className={errors.organizer ? errCls : inputCls} value={form.organizer}
            onChange={e => setForm(p => ({ ...p, organizer: e.target.value }))} placeholder="e.g. Dr. Sharma" />
          {errors.organizer && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.organizer}</p>}
        </div>

        <div>
          <label className={labelCls} style={{ color: '#94a3b8' }}>Participants *</label>
          <input type="number" min="1" className={errors.participants ? errCls : inputCls} value={form.participants}
            onChange={e => setForm(p => ({ ...p, participants: e.target.value }))} placeholder="45" />
          {errors.participants && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.participants}</p>}
        </div>

        <div>
          <label className={labelCls} style={{ color: '#94a3b8' }}>Date *</label>
          <input type="date" className={inputCls} value={form.date}
            onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
        </div>

        <div>
          <label className={labelCls} style={{ color: '#94a3b8' }}>Start Time</label>
          <select className={inputCls} value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls} style={{ color: '#94a3b8' }}>Duration (hours) *</label>
          <input type="number" min="1" max="8" className={errors.duration ? errCls : inputCls} value={form.duration}
            onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
          {errors.duration && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.duration}</p>}
        </div>

        <div>
          <label className={labelCls} style={{ color: '#94a3b8' }}>Event Type</label>
          <select className={inputCls} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls} style={{ color: '#94a3b8' }}>Room Type *</label>
          <select className={inputCls} value={form.roomType} onChange={e => setForm(p => ({ ...p, roomType: e.target.value }))}>
            {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls} style={{ color: '#94a3b8' }}>Priority</label>
          <div className="flex gap-2">
            {PRIORITY_LEVELS.map(pl => (
              <button key={pl} type="button"
                onClick={() => setForm(p => ({ ...p, priority: pl }))}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all border"
                style={form.priority === pl
                  ? { background: pl === 'High' ? 'rgba(220,38,38,0.2)' : pl === 'Medium' ? 'rgba(217,119,6,0.2)' : 'rgba(37,99,235,0.2)',
                      color: pl === 'High' ? '#f87171' : pl === 'Medium' ? '#fbbf24' : '#60a5fa',
                      borderColor: pl === 'High' ? '#ef4444' : pl === 'Medium' ? '#f59e0b' : '#3b82f6' }
                  : { background: 'rgba(255,255,255,0.02)', color: '#475569', borderColor: 'rgba(255,255,255,0.06)' }
                }>
                {pl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div>
        <label className={labelCls} style={{ color: '#94a3b8' }}>Required Equipment</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map(eq => (
            <button key={eq} type="button" onClick={() => toggleEquipment(eq)}
              className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
              style={form.equipment.includes(eq)
                ? { background: 'rgba(99,102,241,0.2)', color: '#818cf8', borderColor: 'rgba(99,102,241,0.4)' }
                : { background: 'rgba(255,255,255,0.02)', color: '#64748b', borderColor: 'rgba(255,255,255,0.06)' }
              }>
              {eq}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button type="button" onClick={onCancel}
          className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
          Cancel
        </button>
        <button type="submit"
          className="btn-glow flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          {initial?.id ? 'Save Changes' : 'Add Event'}
        </button>
      </div>
    </form>
  );
}
