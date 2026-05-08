import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Target, Award, GraduationCap, BarChart2, PieChart as PieIcon
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, PieChart, Pie, Cell,
  AreaChart, Area, Legend
} from 'recharts';

const funnelData = [
  { name: 'Applications', value: 1284, fill: '#7c3aed' },
  { name: 'Screened',     value: 620,  fill: '#4f46e5' },
  { name: 'Shortlisted',  value: 156,  fill: '#0ea5e9' },
  { name: 'Interviewed',  value: 72,   fill: '#10b981' },
  { name: 'Hired',        value: 30,   fill: '#f59e0b' },
];

const collegeData = [
  { college: 'IIT Bombay', hired: 8, score: 92 },
  { college: 'BITS Pilani', hired: 6, score: 89 },
  { college: 'IIT Delhi',  hired: 5, score: 91 },
  { college: 'NIT Trichy', hired: 4, score: 85 },
  { college: 'VIT',        hired: 3, score: 78 },
  { college: 'IIIT-H',    hired: 4, score: 87 },
];

const deptData = [
  { dept: 'Engineering', openings: 12, filled: 9, pending: 3 },
  { dept: 'Design',      openings: 6,  filled: 5, pending: 1 },
  { dept: 'Data',        openings: 5,  filled: 3, pending: 2 },
  { dept: 'DevOps',      openings: 4,  filled: 4, pending: 0 },
  { dept: 'Product',     openings: 3,  filled: 2, pending: 1 },
];

const monthlyTrend = [
  { month: 'Jan', hired: 12, rejected: 45, pending: 20 },
  { month: 'Feb', hired: 18, rejected: 52, pending: 18 },
  { month: 'Mar', hired: 15, rejected: 48, pending: 22 },
  { month: 'Apr', hired: 22, rejected: 60, pending: 15 },
  { month: 'May', hired: 20, rejected: 55, pending: 19 },
  { month: 'Jun', hired: 30, rejected: 70, pending: 25 },
];

const skillGap = [
  { skill: 'System Design',    required: 80, available: 45 },
  { skill: 'Cloud/AWS',        required: 70, available: 38 },
  { skill: 'ML / AI',          required: 60, available: 30 },
  { skill: 'React',            required: 90, available: 85 },
  { skill: 'DevOps',           required: 55, available: 28 },
];

const SUCCESS_COLORS = { hired: '#10b981', rejected: '#ef4444', pending: '#f59e0b' };

const HRAnalytics = () => {
  const [activeTab, setActiveTab] = useState('funnel');
  const tabs = [
    { id: 'funnel',   label: 'Hiring Funnel', icon: Target },
    { id: 'college',  label: 'College Performance', icon: GraduationCap },
    { id: 'dept',     label: 'Department', icon: BarChart2 },
    { id: 'trend',    label: 'Monthly Trend', icon: TrendingUp },
    { id: 'skill',    label: 'Skill Gap', icon: Award },
  ];

  return (
    <div className="hr-page">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold hr-text-primary mb-1">HR Analytics & Reports</h1>
        <p className="hr-text-secondary text-sm">Deep hiring insights powered by AI</p>
      </motion.div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Offer Acceptance Rate', value: '87%', color: '#10b981' },
          { label: 'Avg. Days to Hire',     value: '14d',  color: '#7c3aed' },
          { label: 'AI Match Accuracy',     value: '87%', color: '#0ea5e9' },
          { label: 'Interview Success',     value: '42%', color: '#f59e0b' },
        ].map(k => (
          <motion.div key={k.label} whileHover={{ y: -3 }}
            className="rounded-2xl p-5 text-center"
            style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-3xl font-black mb-1" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-slate-400">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={activeTab === t.id
              ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.3)' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Funnel Tab ── */}
      {activeTab === 'funnel' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-base font-semibold text-white mb-6">Hiring Funnel</h3>
            <div className="space-y-3">
              {funnelData.map((stage, i) => {
                const pct = Math.round((stage.value / funnelData[0].value) * 100);
                return (
                  <div key={stage.name} className="group">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300 font-medium">{stage.name}</span>
                      <span className="text-white font-bold">{stage.value.toLocaleString()} <span className="text-slate-500 font-normal text-xs">({pct}%)</span></span>
                    </div>
                    <div className="h-8 bg-white/5 rounded-xl overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full rounded-xl flex items-center justify-end pr-3"
                        style={{ background: `linear-gradient(90deg, ${stage.fill}90, ${stage.fill})` }}>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conversion rates */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { from: 'Applications→Screened', rate: '48%' },
              { from: 'Screened→Shortlisted', rate: '25%' },
              { from: 'Shortlisted→Interview', rate: '46%' },
              { from: 'Interview→Hired', rate: '42%' },
            ].map(c => (
              <div key={c.from} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-2xl font-black text-violet-400 mb-1">{c.rate}</p>
                <p className="text-xs text-slate-500 leading-tight">{c.from}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── College Tab ── */}
      {activeTab === 'college' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-base font-semibold text-white mb-6">College-wise Hiring Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={collegeData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="college" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" domain={[60, 100]} stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', color: '#fff' }} />
              <Bar yAxisId="left" dataKey="hired" name="Hired" fill="#7c3aed" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar yAxisId="right" dataKey="score" name="Avg AI Score" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            {[{ label: 'Hired', color: '#7c3aed' }, { label: 'Avg AI Score', color: '#0ea5e9' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Department Tab ── */}
      {activeTab === 'dept' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-base font-semibold text-white mb-6">Department Hiring Status</h3>
          <div className="space-y-4">
            {deptData.map((d, i) => {
              const fillPct = Math.round((d.filled / d.openings) * 100);
              return (
                <div key={d.dept}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300 font-medium">{d.dept}</span>
                    <span className="text-white">{d.filled}/{d.openings} filled
                      {d.pending > 0 && <span className="text-amber-400 ml-2">· {d.pending} pending</span>}
                    </span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${fillPct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: fillPct === 100 ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#7c3aed,#4f46e5)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Monthly Trend Tab ── */}
      {activeTab === 'trend' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-base font-semibold text-white mb-6">Monthly Hiring Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              <Bar dataKey="hired" name="Hired" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* ── Skill Gap Tab ── */}
      {activeTab === 'skill' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl p-6 mb-4" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-base font-semibold text-white mb-6">Skill Gap Analysis</h3>
            <div className="space-y-5">
              {skillGap.map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium">{s.skill}</span>
                    <span className="text-xs text-slate-500">Required: {s.required}% | Available: {s.available}%</span>
                  </div>
                  <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.required}%` }} transition={{ duration: 1 }}
                      className="h-full rounded-full absolute top-0 left-0 opacity-30"
                      style={{ background: '#7c3aed' }} />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.available}%` }} transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full absolute top-0 left-0"
                      style={{ background: s.available >= s.required ? '#10b981' : 'linear-gradient(90deg,#ef4444,#f97316)' }} />
                  </div>
                  {s.available < s.required && (
                    <p className="text-xs text-red-400 mt-1">⚠ Gap of {s.required - s.available}% — hire or upskill needed</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HRAnalytics;
