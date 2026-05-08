import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, Calendar, CheckCircle, XCircle,
  TrendingUp, Brain, Star, Clock, ArrowRight, Activity,
  Target, Award, Zap, Eye, MessageSquare, Shield
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const hiringTrend = [
  { month: 'Jan', applications: 180, shortlisted: 60, hired: 12 },
  { month: 'Feb', applications: 220, shortlisted: 75, hired: 18 },
  { month: 'Mar', applications: 195, shortlisted: 65, hired: 15 },
  { month: 'Apr', applications: 310, shortlisted: 95, hired: 22 },
  { month: 'May', applications: 280, shortlisted: 88, hired: 20 },
  { month: 'Jun', applications: 400, shortlisted: 120, hired: 30 },
];

const skillDist = [
  { name: 'React', value: 35, color: '#7c3aed' },
  { name: 'Node.js', value: 25, color: '#4f46e5' },
  { name: 'Python', value: 20, color: '#0ea5e9' },
  { name: 'Java', value: 12, color: '#10b981' },
  { name: 'Other', value: 8, color: '#f59e0b' },
];

const topCandidates = [
  { id: 1, name: 'Arjun Sharma', role: 'Frontend Dev', college: 'IIT Bombay', aiScore: 94, status: 'Shortlisted', comm: 88, tech: 96, conf: 91 },
  { id: 2, name: 'Priya Patel', role: 'Full Stack', college: 'BITS Pilani', aiScore: 91, status: 'Interview', comm: 92, tech: 89, conf: 87 },
  { id: 3, name: 'Rohan Kumar', role: 'Backend Dev', college: 'NIT Trichy', aiScore: 88, status: 'Shortlisted', comm: 84, tech: 93, conf: 80 },
  { id: 4, name: 'Sneha Gupta', role: 'Data Science', college: 'IIT Delhi', aiScore: 86, status: 'Pending', comm: 90, tech: 85, conf: 78 },
];

const recentActivity = [
  { id: 1, type: 'application', text: 'Arjun Sharma applied for Frontend Developer', time: '2m ago', color: 'purple' },
  { id: 2, type: 'interview', text: 'AI interview completed by Priya Patel — Score: 91%', time: '15m ago', color: 'blue' },
  { id: 3, type: 'shortlist', text: 'Rohan Kumar shortlisted for Backend Developer', time: '1h ago', color: 'green' },
  { id: 4, type: 'hired', text: 'Kavya Reddy hired for UI/UX Designer role', time: '3h ago', color: 'emerald' },
  { id: 5, type: 'alert', text: 'Anti-cheating alert: Multiple faces detected for Candidate #58', time: '5h ago', color: 'red' },
];

const statCards = [
  { label: 'Total Candidates', value: '1,284', change: '+12%', icon: Users, gradient: 'from-violet-600 to-purple-700', glow: 'rgba(124,58,237,0.3)' },
  { label: 'Active Job Posts', value: '24', change: '+3', icon: Briefcase, gradient: 'from-indigo-600 to-blue-700', glow: 'rgba(79,70,229,0.3)' },
  { label: 'Interviews Scheduled', value: '48', change: 'This week', icon: Calendar, gradient: 'from-sky-500 to-cyan-600', glow: 'rgba(14,165,233,0.3)' },
  { label: 'Shortlisted', value: '156', change: '+8 today', icon: Star, gradient: 'from-amber-500 to-orange-600', glow: 'rgba(245,158,11,0.3)' },
  { label: 'Hired This Month', value: '30', change: '↑25%', icon: CheckCircle, gradient: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.3)' },
  { label: 'AI Match Accuracy', value: '87%', change: '+2%', icon: Brain, gradient: 'from-pink-600 to-rose-600', glow: 'rgba(236,72,153,0.3)' },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────
const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="relative rounded-2xl overflow-hidden cursor-pointer group hr-card"
    style={{}}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
    <div className="relative p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
          style={{ boxShadow: `0 0 20px ${stat.glow}` }}>
          <stat.icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          {stat.change}
        </span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
      <p className="text-sm text-slate-400">{stat.label}</p>
    </div>
  </motion.div>
);

const AIScoreBar = ({ label, value, color }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs text-slate-400 mb-1">
      <span>{label}</span><span className="text-white font-medium">{value}%</span>
    </div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  </div>
);

const activityIcon = { application: Users, interview: Brain, shortlist: Star, hired: CheckCircle, alert: Shield };
const activityColors = { purple: '#7c3aed', blue: '#4f46e5', green: '#10b981', emerald: '#059669', red: '#ef4444' };

// ─── Main Component ───────────────────────────────────────────────────────────
const HRDashboard = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <div className="hr-page">

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold hr-text-primary mb-1">
              HR Intelligence{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Portal
              </span>
            </h1>
            <p className="hr-text-secondary">AI-powered hiring insights & candidate analytics</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard/company/applicants')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
            >
              <Users className="w-4 h-4" /> View Candidates
            </button>
            <button
              onClick={() => navigate('/dashboard/company/post-job')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-white/10 hover:border-violet-500/50 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <Briefcase className="w-4 h-4" /> Post Job
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Hiring Trend Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="xl:col-span-2 rounded-2xl p-6"
          style={{ background: 'rgba(15,15,30,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold hr-text-primary">Hiring Pipeline</h3>
              <p className="text-xs hr-text-muted">6-month trend</p>
            </div>
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hiringTrend}>
              <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="shortGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="hireGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="applications" stroke="#7c3aed" fill="url(#appGrad)" strokeWidth={2} name="Applications" />
              <Area type="monotone" dataKey="shortlisted" stroke="#0ea5e9" fill="url(#shortGrad)" strokeWidth={2} name="Shortlisted" />
              <Area type="monotone" dataKey="hired" stroke="#10b981" fill="url(#hireGrad)" strokeWidth={2} name="Hired" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            {[{ label: 'Applications', color: '#7c3aed' }, { label: 'Shortlisted', color: '#0ea5e9' }, { label: 'Hired', color: '#10b981' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl p-6"
          style={{ background: 'rgba(15,15,30,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold hr-text-primary">Skill Distribution</h3>
              <p className="text-xs hr-text-muted">Candidate pool</p>
            </div>
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={skillDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {skillDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {skillDist.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-400">{s.name}</span>
                </div>
                <span className="text-white font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Row 3: Top Candidates + Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Top AI-Ranked Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="xl:col-span-2 rounded-2xl p-6"
          style={{ background: 'rgba(15,15,30,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold hr-text-primary">Top AI-Ranked Candidates</h3>
              <p className="text-xs hr-text-muted">Sorted by AI match score</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/company/applicants')}
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {topCandidates.map((c, i) => (
              <motion.div
                key={c.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedCandidate(selectedCandidate?.id === c.id ? null : c)}
                className="rounded-xl p-4 cursor-pointer transition-all duration-200"
                style={{
                  background: selectedCandidate?.id === c.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                  border: selectedCandidate?.id === c.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                      style={{ background: `linear-gradient(135deg, ${['#7c3aed','#4f46e5','#0ea5e9','#10b981'][i % 4]}, ${['#4f46e5','#0ea5e9','#10b981','#7c3aed'][i % 4]})` }}>
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.role} · {c.college}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${c.status === 'Shortlisted' ? 'text-emerald-400 bg-emerald-400/10' :
                        c.status === 'Interview' ? 'text-blue-400 bg-blue-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                      {c.status}
                    </span>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{c.aiScore}%</p>
                      <p className="text-xs text-slate-500">AI Score</p>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedCandidate?.id === c.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/5"
                    >
                      <div className="grid grid-cols-3 gap-3">
                        <AIScoreBar label="Communication" value={c.comm} color="linear-gradient(90deg, #7c3aed, #a78bfa)" />
                        <AIScoreBar label="Technical" value={c.tech} color="linear-gradient(90deg, #0ea5e9, #38bdf8)" />
                        <AIScoreBar label="Confidence" value={c.conf} color="linear-gradient(90deg, #10b981, #34d399)" />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => navigate('/dashboard/company/candidate-profile')}
                          className="text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-all"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                          View Full Profile
                        </button>
                        <button className="text-xs px-3 py-1.5 rounded-lg text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 transition-all font-medium">
                          Shortlist
                        </button>
                        <button className="text-xs px-3 py-1.5 rounded-lg text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all font-medium">
                          Reject
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{ background: 'rgba(15,15,30,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold hr-text-primary">Recent Activity</h3>
              <p className="text-xs hr-text-muted">Live updates</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => {
              const Icon = activityIcon[item.type] || Activity;
              const color = activityColors[item.color];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Quick Action Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
      >
        {[
          { label: 'AI Analysis', desc: 'Behavioral & Technical', icon: Brain, color: '#7c3aed', path: '/dashboard/company/candidate-profile' },
          { label: 'Schedule Interview', desc: 'Calendar & Video', icon: Calendar, color: '#0ea5e9', path: '/dashboard/company/interviews' },
          { label: 'Post a Job', desc: 'Create new listing', icon: Briefcase, color: '#10b981', path: '/dashboard/company/post-job' },
          { label: 'Analytics', desc: 'Reports & Insights', icon: TrendingUp, color: '#f59e0b', path: '/dashboard/company/hr-analytics' },
        ].map(({ label, desc, icon: Icon, color, path }) => (
          <button key={label} onClick={() => navigate(path)}
            className="rounded-2xl p-4 text-left group transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(15,15,30,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default HRDashboard;
