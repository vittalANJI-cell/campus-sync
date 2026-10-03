import React, { useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Building2, Monitor, FlaskConical, Presentation } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Modal from '../components/Modal.jsx';
import { IllustrationCampus } from '../components/Illustrations.jsx';
import { useApp } from '../context/AppContext.jsx';
import { ROOM_TYPES, EQUIPMENT_OPTIONS } from '../data/sampleData.js';

function ResourceForm({ initial, onSubmit, onCancel }) {
  const empty = { name: '', type: 'Classroom', capacity: '', equipment: [], available: true };
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.capacity || isNaN(parseInt(form.capacity)) || parseInt(form.capacity) <= 0) e.capacity = 'Enter a positive number.';
    return e;
  }
  function handleSubmit(ev) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, capacity: parseInt(form.capacity) });
  }
  function toggleEq(eq) {
    setForm(p => ({ ...p, equipment: p.equipment.includes(eq) ? p.equipment.filter(x => x !== eq) : [...p.equipment, eq] }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#94a3b8' }}>Name *</label>
          <input className="input-dark" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Computer Lab 3" />
          {errors.name && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#94a3b8' }}>Type</label>
          <select className="input-dark" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
            {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#94a3b8' }}>Capacity *</label>
          <input type="number" min="1" className="input-dark" value={form.capacity}
            onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} placeholder="50" />
          {errors.capacity && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.capacity}</p>}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#94a3b8' }}>Equipment</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map(eq => (
            <button key={eq} type="button" onClick={() => toggleEq(eq)}
              className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
              style={form.equipment.includes(eq)
                ? { background: 'rgba(99,102,241,0.2)', color: '#818cf8', borderColor: 'rgba(99,102,241,0.4)' }
                : { background: 'rgba(255,255,255,0.02)', color: '#64748b', borderColor: 'rgba(255,255,255,0.06)' }
              }>{eq}</button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setForm(p => ({ ...p, available: !p.available }))}>
          {form.available ? <ToggleRight size={24} style={{ color: '#22c55e' }} /> : <ToggleLeft size={24} style={{ color: '#475569' }} />}
        </button>
        <span className="text-sm font-medium" style={{ color: form.available ? '#22c55e' : '#475569' }}>
          {form.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
          Cancel
        </button>
        <button type="submit"
          className="btn-glow flex-1 py-2.5 text-sm font-semibold rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          {initial?.id ? 'Save' : 'Add Resource'}
        </button>
      </div>
    </form>
  );
}

const typeIcon = { Classroom: Building2, 'Computer Lab': Monitor, 'Science Lab': FlaskConical, 'Seminar Hall': Presentation, Auditorium: Presentation };
const typeGradient = {
  Classroom:    'linear-gradient(135deg,#1e3a5f,#2563eb)',
  'Computer Lab':'linear-gradient(135deg,#0e4a5f,#0891b2)',
  'Science Lab': 'linear-gradient(135deg,#1a3a1f,#16a34a)',
  'Seminar Hall':'linear-gradient(135deg,#2e1065,#7c3aed)',
  Auditorium:    'linear-gradient(135deg,#4c0519,#be123c)',
};

export default function Resources() {
  const { resources, addResource, updateResource, deleteResource, toggleResourceAvailability } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeType, setActiveType] = useState('All');

  const types = ['All', ...ROOM_TYPES];
  const filtered = activeType === 'All' ? resources : resources.filter(r => r.type === activeType);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {types.map(t => {
            const cnt = t === 'All' ? resources.length : resources.filter(r => r.type === t).length;
            return (
              <button key={t} onClick={() => setActiveType(t)}
                className="whitespace-nowrap text-xs px-3 py-2 rounded-xl font-semibold transition-all"
                style={activeType === t
                  ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }
                }>
                {t} <span className="ml-1 opacity-60">({cnt})</span>
              </button>
            );
          })}
        </div>
        <button onClick={() => setShowAdd(true)}
          className="btn-glow flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <Plus size={14} /> Add Resource
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ROOM_TYPES.map(type => {
          const subset = resources.filter(r => r.type === type);
          const avail = subset.filter(r => r.available).length;
          return (
            <div key={type} className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#475569' }}>{type}</p>
              <p className="text-xl font-extrabold text-white">{avail}
                <span className="text-sm font-normal" style={{ color: '#334155' }}>/{subset.length}</span>
              </p>
              <p className="text-[10px]" style={{ color: '#334155' }}>free</p>
            </div>
          );
        })}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(r => {
          const Icon = typeIcon[r.type] || Building2;
          const grad = typeGradient[r.type] || typeGradient.Classroom;
          return (
            <div key={r.id} className="card-3d rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: `1px solid ${r.available ? 'rgba(255,255,255,0.06)' : 'rgba(220,38,38,0.2)'}`,
                opacity: r.available ? 1 : 0.7,
              }}>
              {/* Card header with gradient */}
              <div className="relative h-20 flex items-end p-3 overflow-hidden"
                style={{ background: grad }}>
                <div className="orb w-24 h-24 -top-8 -right-8 opacity-30" style={{ background: 'rgba(255,255,255,0.2)', filter: 'blur(20px)' }} />
                <div className="relative z-10 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{r.name}</p>
                    <p className="text-[10px] text-white/60">{r.type}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge label={r.available ? 'Available' : 'Unavailable'} size="xs" />
                </div>
              </div>

              {/* Card body */}
              <div className="p-3 space-y-3">
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#475569' }}>Capacity</span>
                  <span className="font-bold text-white">{r.capacity} seats</span>
                </div>

                {r.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {r.equipment.map(eq => (
                      <span key={eq} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.04)' }}>
                        {eq}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-1.5 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <button onClick={() => toggleResourceAvailability(r.id)}
                    className="flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = r.available ? '#f87171' : '#34d399'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}>
                    {r.available ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                    {r.available ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => setEditing(r)}
                    className="flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fbbf24'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                    <Edit size={11} /> Edit
                  </button>
                  <button onClick={() => { if(confirm(`Delete ${r.name}?`)) deleteResource(r.id); }}
                    className="ml-auto flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-lg font-medium transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Resource" size="md">
        <ResourceForm onSubmit={d => { addResource(d); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Resource" size="md">
        <ResourceForm initial={editing} onSubmit={d => { updateResource(editing.id, d); setEditing(null); }} onCancel={() => setEditing(null)} />
      </Modal>
    </div>
  );
}
