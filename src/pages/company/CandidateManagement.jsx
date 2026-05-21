import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InterviewScheduleModal from '../../components/InterviewScheduleModal';

import {
  Search, Filter, Star, Eye, ChevronDown, X,
  Brain, MessageSquare, Shield, Zap, CheckCircle, XCircle,
  BookOpen, Briefcase, GraduationCap, Phone, Mail
} from 'lucide-react';

const CANDIDATES = [
  { id: 1, name: 'Arjun Sharma', role: 'Frontend Developer', college: 'IIT Bombay', branch: 'CSE', cgpa: 9.1, exp: 'Fresher', skills: ['React','JS','Tailwind'], aiScore: 94, comm: 88, tech: 96, conf: 91, status: 'Shortlisted', email: 'arjun@email.com', phone: '+91 9876543210', cheating: false },
  { id: 2, name: 'Priya Patel', role: 'Full Stack', college: 'BITS Pilani', branch: 'IT', cgpa: 8.8, exp: '1 year', skills: ['Node.js','React','MongoDB'], aiScore: 91, comm: 92, tech: 89, conf: 87, status: 'Interview', email: 'priya@email.com', phone: '+91 9876543211', cheating: false },
  { id: 3, name: 'Rohan Kumar', role: 'Backend Developer', college: 'NIT Trichy', branch: 'CSE', cgpa: 8.5, exp: 'Fresher', skills: ['Java','Spring Boot','SQL'], aiScore: 88, comm: 84, tech: 93, conf: 80, status: 'Shortlisted', email: 'rohan@email.com', phone: '+91 9876543212', cheating: false },
  { id: 4, name: 'Sneha Gupta', role: 'Data Scientist', college: 'IIT Delhi', branch: 'Mathematics', cgpa: 9.3, exp: 'Intern', skills: ['Python','ML','TensorFlow'], aiScore: 86, comm: 90, tech: 85, conf: 78, status: 'Pending', email: 'sneha@email.com', phone: '+91 9876543213', cheating: false },
  { id: 5, name: 'Vikram Singh', role: 'DevOps Engineer', college: 'VIT Vellore', branch: 'CSE', cgpa: 7.9, exp: '1 year', skills: ['Docker','Kubernetes','AWS'], aiScore: 79, comm: 75, tech: 83, conf: 74, status: 'Pending', email: 'vikram@email.com', phone: '+91 9876543214', cheating: true },
  { id: 6, name: 'Kavya Reddy', role: 'UI/UX Designer', college: 'IIIT Hyderabad', branch: 'Design', cgpa: 8.2, exp: 'Fresher', skills: ['Figma','XD','CSS'], aiScore: 82, comm: 87, tech: 78, conf: 85, status: 'Hired', email: 'kavya@email.com', phone: '+91 9876543215', cheating: false },
  { id: 7, name: 'Aman Verma', role: 'Android Dev', college: 'DTU Delhi', branch: 'IT', cgpa: 8.0, exp: 'Fresher', skills: ['Kotlin','Android','Firebase'], aiScore: 75, comm: 70, tech: 80, conf: 72, status: 'Rejected', email: 'aman@email.com', phone: '+91 9876543216', cheating: false },
  { id: 8, name: 'Ritika Joshi', role: 'Frontend Developer', college: 'Pune University', branch: 'CSE', cgpa: 7.6, exp: 'Fresher', skills: ['React','Vue','CSS'], aiScore: 71, comm: 80, tech: 68, conf: 69, status: 'Pending', email: 'ritika@email.com', phone: '+91 9876543217', cheating: false },
];

const STATUS_COLORS = {
  Shortlisted: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  Interview:   { text: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/30' },
  Hired:       { text: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/30' },
  Rejected:    { text: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/30' },
  Pending:     { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30' },
};

const ScoreBar = ({ value, color }) => (
  <div className="h-1 bg-white/5 rounded-full overflow-hidden w-16">
    <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }}
      className="h-full rounded-full" style={{ background: color }} />
  </div>
);

const CandidateDrawer = ({ candidate, onClose, onScheduleClick }) => {
  if (!candidate) return null;

  const avatarColors = ['#7c3aed','#4f46e5','#0ea5e9','#10b981','#f59e0b','#ec4899'];
  const color = avatarColors[candidate.id % avatarColors.length];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30 }}
          className="w-full max-w-md h-full overflow-y-auto p-6"
          style={{ background: '#0d0d2b', borderLeft: '1px solid rgba(124,58,237,0.2)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Candidate Profile</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, boxShadow: `0 0 20px ${color}40` }}>
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
              <p className="text-sm text-slate-400">{candidate.role}</p>
              <div className={`mt-1 inline-flex text-xs px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[candidate.status]?.text} ${STATUS_COLORS[candidate.status]?.bg} ${STATUS_COLORS[candidate.status]?.border}`}>
                {candidate.status}
              </div>
            </div>
          </div>

          {/* AI Score Ring */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-violet-400" /> AI Score
              </span>
              <span className="text-3xl font-bold text-white">{candidate.aiScore}<span className="text-lg text-slate-400">%</span></span>
            </div>
            {[
              { label: 'Communication', value: candidate.comm, color: 'linear-gradient(90deg,#7c3aed,#a78bfa)' },
              { label: 'Technical Skills', value: candidate.tech, color: 'linear-gradient(90deg,#0ea5e9,#38bdf8)' },
              { label: 'Confidence', value: candidate.conf, color: 'linear-gradient(90deg,#10b981,#34d399)' },
            ].map(s => (
              <div key={s.label} className="mb-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{s.label}</span><span className="text-white">{s.value}%</span></div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 1 }}
                    className="h-full rounded-full" style={{ background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Anti-Cheating */}
          <div className={`rounded-xl p-3 mb-4 flex items-center gap-3 ${candidate.cheating ? 'bg-red-400/10 border border-red-400/20' : 'bg-emerald-400/10 border border-emerald-400/20'}`}>
            <Shield className={`w-4 h-4 ${candidate.cheating ? 'text-red-400' : 'text-emerald-400'}`} />
            <span className={`text-sm font-medium ${candidate.cheating ? 'text-red-400' : 'text-emerald-400'}`}>
              {candidate.cheating ? '⚠ Anti-cheating violation detected' : '✓ No cheating violations detected'}
            </span>
          </div>

          {/* Info */}
          {[
            { icon: GraduationCap, label: candidate.college, sub: `${candidate.branch} · CGPA ${candidate.cgpa}` },
            { icon: Briefcase, label: `Experience: ${candidate.exp}` },
            { icon: Mail, label: candidate.email },
            { icon: Phone, label: candidate.phone },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-start gap-3 mb-3">
              <Icon className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-slate-300">{label}</p>
                {sub && <p className="text-xs text-slate-500">{sub}</p>}
              </div>
            </div>
          ))}

          {/* Skills */}
          <div className="mb-5">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map(s => (
                <span key={s} className="text-xs px-2 py-1 rounded-lg text-violet-300" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              ✓ Shortlist
            </button>
            <button className="py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all">
              ✗ Reject
            </button>
            <button onClick={() => onScheduleClick(candidate)}
              className="col-span-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              Schedule Interview
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CandidateManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  const [minScore, setMinScore] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);


  const statuses = ['All', 'Shortlisted', 'Interview', 'Hired', 'Pending', 'Rejected'];
  const skills = ['All', 'React', 'Node.js', 'Java', 'Python', 'Kotlin', 'Figma'];

  const filtered = CANDIDATES.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.college.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchSkill = skillFilter === 'All' || c.skills.includes(skillFilter);
    const matchScore = c.aiScore >= minScore;
    return matchSearch && matchStatus && matchSkill && matchScore;
  });

  return (
    <div className="hr-page">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold hr-text-primary mb-1">Candidate Management</h1>
        <p className="hr-text-secondary text-sm">AI-scored talent pool — {CANDIDATES.length} total candidates</p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="hr-card p-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search candidates, roles, colleges..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none focus:ring-1 focus:ring-violet-500"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <button onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${showFilters ? 'text-violet-400 bg-violet-400/10 border border-violet-400/30' : 'text-slate-400 border border-white/08'}`}
            style={showFilters ? {} : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm text-slate-200 outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {statuses.map(s => <option key={s} value={s} style={{ background: '#0d0d2b' }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Skill</label>
                <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm text-slate-200 outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {skills.map(s => <option key={s} value={s} style={{ background: '#0d0d2b' }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Min AI Score: {minScore}%</label>
                <input type="range" min={0} max={100} value={minScore} onChange={e => setMinScore(+e.target.value)}
                  className="w-full accent-violet-500" />
              </div>
              <div className="flex items-end">
                <button onClick={() => { setSearch(''); setStatusFilter('All'); setSkillFilter('All'); setMinScore(0); }}
                  className="w-full py-2 rounded-xl text-xs text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all">
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${statusFilter === s ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={statusFilter === s ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 12px rgba(124,58,237,0.3)' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {s} {s === 'All' ? `(${CANDIDATES.length})` : `(${CANDIDATES.filter(c => c.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Candidate Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="hr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Candidate', 'Role / College', 'Skills', 'AI Score', 'Comm', 'Tech', 'Conf', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold hr-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const s = STATUS_COLORS[c.status] || STATUS_COLORS.Pending;
                const avatarColors = ['#7c3aed','#4f46e5','#0ea5e9','#10b981','#f59e0b','#ec4899','#ef4444','#8b5cf6'];
                const aColor = avatarColors[c.id % avatarColors.length];
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="group transition-all duration-150 cursor-pointer"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {/* Candidate */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: `linear-gradient(135deg,${aColor},${aColor}80)` }}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.exp}</p>
                        </div>
                        {c.cheating && <Shield className="w-3.5 h-3.5 text-red-400 flex-shrink-0" title="Cheating alert" />}
                      </div>
                    </td>
                    {/* Role / College */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-slate-300">{c.role}</p>
                      <p className="text-xs text-slate-500">{c.college} · {c.cgpa} CGPA</p>
                    </td>
                    {/* Skills */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 2).map(s => (
                          <span key={s} className="text-xs px-1.5 py-0.5 rounded text-violet-300" style={{ background: 'rgba(124,58,237,0.15)' }}>{s}</span>
                        ))}
                        {c.skills.length > 2 && <span className="text-xs text-slate-600">+{c.skills.length - 2}</span>}
                      </div>
                    </td>
                    {/* AI Score */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{c.aiScore}%</span>
                        <Brain className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                    </td>
                    {/* Comm */}
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-300 mb-1">{c.comm}%</div>
                      <ScoreBar value={c.comm} color="linear-gradient(90deg,#7c3aed,#a78bfa)" />
                    </td>
                    {/* Tech */}
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-300 mb-1">{c.tech}%</div>
                      <ScoreBar value={c.tech} color="linear-gradient(90deg,#0ea5e9,#38bdf8)" />
                    </td>
                    {/* Conf */}
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-300 mb-1">{c.conf}%</div>
                      <ScoreBar value={c.conf} color="linear-gradient(90deg,#10b981,#34d399)" />
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${s.text} ${s.bg} ${s.border}`}>{c.status}</span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => setSelectedCandidate(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-400/10 transition-all" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all" title="Shortlist">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-600">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No candidates match your filters.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Candidate Drawer */}
      <CandidateDrawer 
        candidate={selectedCandidate} 
        onClose={() => setSelectedCandidate(null)} 
        onScheduleClick={(c) => {
          setSelectedCandidate(null);
          setSchedulingCandidate(c);
        }}
      />

      {/* Interview Scheduling Modal */}
      <InterviewScheduleModal
        isOpen={!!schedulingCandidate}
        onClose={() => setSchedulingCandidate(null)}
        candidate={schedulingCandidate}
        onScheduleSuccess={(updatedCandidate) => {
          // Find and update candidate status locally in UI
          const found = CANDIDATES.find(x => x.id === updatedCandidate.id);
          if (found) {
            found.status = 'Interview';
          }
        }}
      />
    </div>
  );
};


export default CandidateManagement;
