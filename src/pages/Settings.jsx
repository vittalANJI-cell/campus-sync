import React, { useState } from 'react';
import { Save, RotateCcw, Download, AlertTriangle, Palette, Database, Info } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { initialEvents, initialResources } from '../data/sampleData.js';

export default function Settings() {
  const { showNotification, events, resources } = useApp();
  const [collegeName, setCollegeName] = useState(() => localStorage.getItem('cs_collegeName') || 'State Engineering College');
  const [adminEmail, setAdminEmail]   = useState(() => localStorage.getItem('cs_adminEmail') || 'admin@college.edu');
  const [workStart, setWorkStart]     = useState(() => localStorage.getItem('cs_workStart') || '08:00');
  const [workEnd, setWorkEnd]         = useState(() => localStorage.getItem('cs_workEnd') || '18:00');
  const [showConfirm, setShowConfirm] = useState(false);

  function save() {
    localStorage.setItem('cs_collegeName', collegeName);
    localStorage.setItem('cs_adminEmail', adminEmail);
    localStorage.setItem('cs_workStart', workStart);
    localStorage.setItem('cs_workEnd', workEnd);
    showNotification('Settings saved successfully.');
  }

  function reset() {
    localStorage.setItem('campussync_events', JSON.stringify(initialEvents));
    localStorage.setItem('campussync_resources', JSON.stringify(initialResources));
    localStorage.removeItem('campussync_conflicts');
    localStorage.removeItem('campussync_stats');
    showNotification('Data reset to defaults.', 'info');
    setShowConfirm(false);
    setTimeout(() => window.location.reload(), 1200);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ events, resources, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `campussync-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported.');
  }

  const inp = "input-dark w-full";
  const section = "rounded-2xl p-6 space-y-5";
  const sectionStyle = { background:'rgba(15,23,42,0.7)', border:'1px solid rgba(255,255,255,0.05)', backdropFilter:'blur(12px)' };

  return (
    <div className="max-w-2xl space-y-5">

      {/* General */}
      <div className={section} style={sectionStyle}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'rgba(99,102,241,0.15)' }}>
            <Palette size={15} style={{ color:'#818cf8' }} />
          </div>
          <h2 className="text-sm font-bold text-white">General Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#64748b' }}>College Name</label>
            <input className={inp} value={collegeName} onChange={e => setCollegeName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#64748b' }}>Admin Email</label>
            <input type="email" className={inp} value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#64748b' }}>Work Start</label>
              <input type="time" className={inp} value={workStart} onChange={e => setWorkStart(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:'#64748b' }}>Work End</label>
              <input type="time" className={inp} value={workEnd} onChange={e => setWorkEnd(e.target.value)} />
            </div>
          </div>
          <button onClick={save}
            className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Save size={14}/> Save Settings
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className={section} style={sectionStyle}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'rgba(99,102,241,0.15)' }}>
            <Database size={15} style={{ color:'#818cf8' }} />
          </div>
          <h2 className="text-sm font-bold text-white">Data Management</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <p className="text-sm font-semibold text-white">Export Data</p>
              <p className="text-xs" style={{ color:'#475569' }}>Download all events and resources as JSON</p>
            </div>
            <button onClick={exportData}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
              style={{ background:'rgba(99,102,241,0.12)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.2)' }}>
              <Download size={13}/> Export
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.15)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color:'#f87171' }}>Reset Demo Data</p>
              <p className="text-xs" style={{ color:'#7f1d1d' }}>Restore original sample data</p>
            </div>
            <button onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
              style={{ background:'rgba(220,38,38,0.12)', color:'#f87171', border:'1px solid rgba(220,38,38,0.2)' }}>
              <RotateCcw size={13}/> Reset
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className={section} style={sectionStyle}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'rgba(99,102,241,0.15)' }}>
            <Info size={15} style={{ color:'#818cf8' }} />
          </div>
          <h2 className="text-sm font-bold text-white">About CampusSync</h2>
        </div>
        <div className="space-y-2 text-sm">
          {[
            ['Version', '1.0.0'],
            ['Algorithm', 'Constraint-based scheduling with backtracking'],
            ['Storage', 'Browser localStorage'],
            ['Built with', 'React · Vite · Tailwind CSS · Lucide'],
          ].map(([k,v]) => (
            <div key={k} className="flex gap-3">
              <span className="w-28 flex-shrink-0 font-semibold" style={{ color:'#475569' }}>{k}</span>
              <span style={{ color:'#94a3b8' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm reset dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative rounded-2xl p-6 max-w-sm w-full"
            style={{ background:'linear-gradient(180deg,#0f1626,#0a1020)', border:'1px solid rgba(220,38,38,0.25)', boxShadow:'0 25px 60px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl" style={{ background:'rgba(220,38,38,0.15)' }}>
                <AlertTriangle size={18} style={{ color:'#f87171' }} />
              </div>
              <h3 className="text-base font-bold text-white">Reset Data?</h3>
            </div>
            <p className="text-sm mb-5" style={{ color:'#64748b' }}>
              This deletes all your events and resources and restores original demo data. Cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl"
                style={{ background:'rgba(255,255,255,0.04)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.06)' }}>
                Cancel
              </button>
              <button onClick={reset}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl text-white"
                style={{ background:'linear-gradient(135deg,#dc2626,#ef4444)' }}>
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
