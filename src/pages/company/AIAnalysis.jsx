import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, MessageSquare, Eye, Shield, Mic, TrendingUp,
  AlertTriangle, CheckCircle, Activity, Star, ChevronRight, User
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar
} from 'recharts';

const candidate = {
  name: 'Arjun Sharma',
  role: 'Frontend Developer',
  college: 'IIT Bombay',
  aiScore: 94,
  communication: 88,
  confidence: 91,
  technical: 96,
  behavior: 83,
  eyeContact: 78,
  voiceConfidence: 86,
  sentiment: 'Positive',
};

const radarData = [
  { subject: 'Communication', A: 88 },
  { subject: 'Confidence',    A: 91 },
  { subject: 'Technical',     A: 96 },
  { subject: 'Behavior',      A: 83 },
  { subject: 'Eye Contact',   A: 78 },
  { subject: 'Voice',         A: 86 },
];

const sentimentTimeline = [
  { t: '0:00', score: 65 }, { t: '0:30', score: 72 }, { t: '1:00', score: 80 },
  { t: '1:30', score: 85 }, { t: '2:00', score: 78 }, { t: '2:30', score: 88 },
  { t: '3:00', score: 91 }, { t: '3:30', score: 87 }, { t: '4:00', score: 93 },
];

const antiCheatLog = [
  { time: '00:42', event: 'Tab switch detected', severity: 'warning' },
  { time: '01:15', event: 'Normal behavior', severity: 'ok' },
  { time: '02:30', event: 'Single face confirmed', severity: 'ok' },
  { time: '03:10', event: 'No suspicious movement', severity: 'ok' },
  { time: '03:55', event: 'Eye contact maintained', severity: 'ok' },
];

const transcriptSnippets = [
  { q: 'Tell me about yourself.', a: 'I am a final year CSE student at IIT Bombay with strong skills in React and JavaScript. I have built several projects including an e-commerce platform...', score: 9 },
  { q: 'Explain OOP concepts.', a: 'OOP stands for Object Oriented Programming. It has four pillars: encapsulation, inheritance, polymorphism, and abstraction...', score: 8 },
  { q: 'How do you handle tight deadlines?', a: 'I prioritize tasks using time-blocking and always communicate proactively with the team when there are blockers...', score: 9 },
];

const MetricCard = ({ label, value, color, icon: Icon, sub }) => (
  <motion.div whileHover={{ y: -3 }}
    className="rounded-2xl p-5"
    style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span className="text-3xl font-bold text-white">{value}%</span>
    </div>
    <p className="text-sm font-medium text-slate-300">{label}</p>
    {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.2 }}
        className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
    </div>
  </motion.div>
);

const AIAnalysis = () => {
  const [tab, setTab] = useState('overview');
  const tabs = [
    { id: 'overview',    label: 'Overview' },
    { id: 'behavioral',  label: 'Behavioral' },
    { id: 'technical',   label: 'Technical' },
    { id: 'anticheat',   label: 'Anti-Cheat' },
    { id: 'transcript',  label: 'Transcript' },
  ];

  return (
    <div className="hr-page">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 hr-text-muted text-sm mb-3">
          <span>Candidates</span><ChevronRight className="w-3 h-3" /><span className="hr-text-primary">AI Analysis</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold hr-text-primary">
              AI Candidate Analysis
            </h1>
            <p className="hr-text-secondary text-sm mt-1">{candidate.name} · {candidate.role} · {candidate.college}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-white">{candidate.aiScore}<span className="text-xl text-slate-400">%</span></div>
            <p className="text-xs text-violet-400 font-medium">Overall AI Score</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={tab === t.id ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.35)' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <MetricCard label="Communication" value={candidate.communication} color="#7c3aed" icon={MessageSquare} />
            <MetricCard label="Confidence"    value={candidate.confidence}    color="#4f46e5" icon={Star} />
            <MetricCard label="Technical"     value={candidate.technical}     color="#0ea5e9" icon={Brain} />
            <MetricCard label="Behavior"      value={candidate.behavior}      color="#10b981" icon={Activity} />
            <MetricCard label="Eye Contact"   value={candidate.eyeContact}    color="#f59e0b" icon={Eye} />
            <MetricCard label="Voice"         value={candidate.voiceConfidence} color="#ec4899" icon={Mic} />
          </div>

          {/* Radar + Sentiment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-base font-semibold text-white mb-4">Competency Radar</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Radar name="Score" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-base font-semibold text-white mb-1">Sentiment Timeline</h3>
              <p className="text-xs text-slate-500 mb-4">Positivity over interview duration</p>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={sentimentTimeline}>
                  <defs>
                    <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="t" stroke="#475569" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} stroke="#475569" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', color: '#fff' }} />
                  <Area type="monotone" dataKey="score" stroke="#10b981" fill="url(#sentGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── BEHAVIORAL TAB ── */}
      {tab === 'behavioral' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Facial Expression Analysis', items: [{ name: 'Confidence', val: 91 }, { name: 'Engagement', val: 87 }, { name: 'Anxiety Level', val: 22 }, { name: 'Positive Emotion', val: 85 }], color: '#7c3aed' },
            { label: 'Voice Analysis', items: [{ name: 'Voice Confidence', val: 86 }, { name: 'Clarity', val: 88 }, { name: 'Pace Control', val: 80 }, { name: 'Filler Words', val: 15 }], color: '#0ea5e9' },
            { label: 'Body Language', items: [{ name: 'Eye Contact', val: 78 }, { name: 'Posture', val: 84 }, { name: 'Gestures', val: 72 }, { name: 'Nodding', val: 90 }], color: '#10b981' },
            { label: 'Communication Style', items: [{ name: 'Clarity', val: 90 }, { name: 'Structure', val: 85 }, { name: 'Examples Used', val: 88 }, { name: 'Relevance', val: 92 }], color: '#f59e0b' },
          ].map(section => (
            <div key={section.label} className="rounded-2xl p-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-base font-semibold text-white mb-4">{section.label}</h3>
              <div className="space-y-3">
                {section.items.map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{item.name}</span>
                      <span className="text-white font-medium">{item.val}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} transition={{ duration: 1 }}
                        className="h-full rounded-full" style={{ background: `linear-gradient(90deg,${section.color},${section.color}70)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── TECHNICAL TAB ── */}
      {tab === 'technical' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-base font-semibold text-white mb-4">Skill Proficiency</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { skill: 'React', score: 96 }, { skill: 'JavaScript', score: 93 },
                { skill: 'HTML/CSS', score: 90 }, { skill: 'Node.js', score: 78 },
                { skill: 'Problem Solving', score: 88 }, { skill: 'System Design', score: 72 },
              ]} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="skill" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', color: '#fff' }} />
                <Bar dataKey="score" fill="url(#techGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="techGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ label: 'Coding Speed', val: 88 }, { label: 'Accuracy', val: 94 }, { label: 'Code Quality', val: 90 }].map(m => (
              <div key={m.label} className="rounded-2xl p-5 text-center" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-4xl font-black text-white mb-1">{m.val}%</p>
                <p className="text-sm text-slate-400">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── ANTI-CHEAT TAB ── */}
      {tab === 'anticheat' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-2xl p-5 border" style={{ background: 'rgba(251,191,36,0.05)', borderColor: 'rgba(251,191,36,0.2)' }}>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-amber-400">1 Suspicious Event Detected</p>
                <p className="text-xs text-slate-500">Minor violation — tab switch at 00:42</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Tab Switches', val: 1, warn: true },
              { label: 'Face Violations', val: 0, warn: false },
              { label: 'Mobile Usage', val: 0, warn: false },
              { label: 'Copy-Paste Events', val: 0, warn: false },
            ].map(m => (
              <div key={m.label} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(15,15,30,0.7)', border: `1px solid ${m.warn ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
                <p className={`text-4xl font-black mb-1 ${m.warn ? 'text-amber-400' : 'text-emerald-400'}`}>{m.val}</p>
                <p className="text-xs text-slate-400">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-base font-semibold text-white mb-4">Activity Log</h3>
            <div className="space-y-2">
              {antiCheatLog.map((log, i) => (
                <div key={i} className="flex items-center gap-4 py-2.5 px-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-xs text-slate-500 font-mono w-12 flex-shrink-0">{log.time}</span>
                  {log.severity === 'ok'
                    ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    : <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  <span className="text-sm text-slate-300">{log.event}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TRANSCRIPT TAB ── */}
      {tab === 'transcript' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {transcriptSnippets.map((item, i) => (
            <div key={i} className="rounded-2xl p-5" style={{ background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.3)' }}>
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-indigo-300">Q: {item.q}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <User className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">A: {item.a}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div key={j} className="w-2 h-2 rounded-full transition-all"
                      style={{ background: j < item.score ? '#7c3aed' : 'rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
                <span className="text-xs text-violet-400 font-medium">{item.score}/10</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AIAnalysis;
