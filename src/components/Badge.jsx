import React from 'react';

const variants = {
  Scheduled:        'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Pending:          'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Unscheduled:      'bg-red-500/15 text-red-400 border-red-500/20',
  Conflict:         'bg-red-500/15 text-red-400 border-red-500/20',
  Cancelled:        'bg-slate-500/15 text-slate-400 border-slate-500/20',
  Available:        'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Unavailable:      'bg-red-500/15 text-red-400 border-red-500/20',
  High:             'bg-red-500/15 text-red-400 border-red-500/20',
  Medium:           'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Low:              'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Workshop:         'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  Seminar:          'bg-violet-500/15 text-violet-400 border-violet-500/20',
  Examination:      'bg-red-500/15 text-red-400 border-red-500/20',
  'Technical Event':'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'Cultural Event': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  Meeting:          'bg-slate-500/15 text-slate-400 border-slate-500/20',
  Competition:      'bg-orange-500/15 text-orange-400 border-orange-500/20',
  Training:         'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Classroom:        'bg-sky-500/15 text-sky-400 border-sky-500/20',
  'Seminar Hall':   'bg-violet-500/15 text-violet-400 border-violet-500/20',
  'Computer Lab':   'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'Science Lab':    'bg-lime-500/15 text-lime-400 border-lime-500/20',
  Auditorium:       'bg-rose-500/15 text-rose-400 border-rose-500/20',
  'Room Conflict':  'bg-red-500/15 text-red-400 border-red-500/20',
  'Capacity Conflict':'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Equipment Conflict':'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
};

export default function Badge({ label, size = 'sm' }) {
  const cls = variants[label] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';
  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${sizeClass} ${cls} whitespace-nowrap`}>
      {label}
    </span>
  );
}
