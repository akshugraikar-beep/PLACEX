import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Link as LinkIcon, Mail, User, Briefcase, Sparkles, Clock, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

// ─── EmailJS Configuration ────────────────────────────────────────────────────
// 1. Sign up free at https://www.emailjs.com/
// 2. Add an Email Service (Gmail, Outlook, etc.) → copy the Service ID
// 3. Create an Email Template with these variables:
//      {{to_email}}, {{to_name}}, {{role}}, {{date_time}}, {{meet_link}}, {{notes}}
//    → copy the Template ID
// 4. Go to Account → API Keys → copy your Public Key
// 5. Replace the three placeholder strings below with your real values.
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY';

const isEmailJSConfigured =
  EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID'  &&
  EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY';

const InterviewScheduleModal = ({ isOpen, onClose, candidate, onScheduleSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidateEmail: '',
    candidateName: '',
    role: '',
    dateTime: '',
    meetLink: '',
    notes: 'Please keep your web-cam enabled. Make sure your internet connection is stable.',
  });

  // Generate a unique Jitsi Meet room name for a real public video call link
  const generateMeetLink = (candidateName = '') => {
    const safeName = candidateName
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase() || 'placify';
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `https://meet.jit.si/Placify-${safeName}-${randomSuffix}`;
  };

  useEffect(() => {
    if (candidate) {
      const defaultMeetLink = generateMeetLink(candidate.name);

      setFormData({
        candidateEmail: candidate.email || '',
        candidateName: candidate.name || '',
        role: candidate.role || '',
        dateTime: '',
        meetLink: defaultMeetLink,
        notes: 'Please keep your web-cam enabled. Make sure your internet connection is stable.',
      });
    }
  }, [candidate, isOpen]);

  if (!isOpen || !candidate) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dateTime) {
      toast.warn('Please select a date and time for the interview.');
      return;
    }

    setLoading(true);

    // Human-readable datetime string
    const formattedDate = new Date(formData.dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // ── If EmailJS is NOT configured yet, show a clear sandbox success ──────
    if (!isEmailJSConfigured) {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║     📧  INTERVIEW SCHEDULED – EmailJS Not Configured Yet     ║
╚══════════════════════════════════════════════════════════════╝
  To: ${formData.candidateEmail}
  Candidate: ${formData.candidateName}
  Role: ${formData.role}
  Time: ${formattedDate}
  Link: ${formData.meetLink}
  Notes: ${formData.notes}
`);
      toast.success(`Interview scheduled for ${formData.candidateName}! (Configure EmailJS to send real emails — see console for instructions.)`);
      if (onScheduleSuccess) {
        onScheduleSuccess({ ...candidate, scheduledDate: formData.dateTime, meetLink: formData.meetLink });
      }
      setLoading(false);
      onClose();
      return;
    }

    // ── Send via EmailJS ─────────────────────────────────────────────────────
    try {
      const templateParams = {
        to_email: formData.candidateEmail,
        to_name: formData.candidateName,
        role: formData.role,
        date_time: formattedDate,
        meet_link: formData.meetLink,
        notes: formData.notes || 'No additional notes.',
        from_name: 'Placify HR Team',
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        toast.success(`✅ Interview invitation sent to ${formData.candidateEmail}!`);
        if (onScheduleSuccess) {
          onScheduleSuccess({ ...candidate, scheduledDate: formData.dateTime, meetLink: formData.meetLink });
        }
        onClose();
      } else {
        throw new Error(`EmailJS returned status ${result.status}`);
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error(`Failed to send email: ${error?.text || error?.message || 'Unknown error'}. Check your EmailJS credentials.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-violet-500/20 bg-slate-900/90 p-6 text-slate-100 shadow-2xl shadow-violet-500/10 backdrop-blur-xl z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Schedule AI Interview</h3>
                <p className="text-xs text-slate-400">Automatic candidate email invitation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* EmailJS Status Banner */}
          {!isEmailJSConfigured && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-300">EmailJS not configured</p>
                <p className="text-xs text-amber-400/80 mt-0.5">
                  Scheduling will work but no real email will be sent.{' '}
                  <a
                    href="https://www.emailjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-amber-300 hover:text-amber-200"
                  >
                    Set up EmailJS free →
                  </a>
                </p>
              </div>
            </div>
          )}

          {isEmailJSConfigured && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-300 font-medium">EmailJS configured — email will be sent on submit</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Role */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-violet-400" /> Candidate Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-950/40 border border-slate-800 focus:border-violet-500/50 outline-none transition-all text-slate-200"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-violet-400" /> Position / Role
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-950/40 border border-slate-800 focus:border-violet-500/50 outline-none transition-all text-slate-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-violet-400" /> Candidate Email
              </label>
              <input
                type="email"
                required
                value={formData.candidateEmail}
                onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-950/40 border border-slate-800 focus:border-violet-500/50 outline-none transition-all text-slate-200"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-400" /> Select Date &amp; Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-950/40 border border-slate-800 focus:border-violet-500/50 outline-none transition-all text-slate-200 scheme-dark"
              />
            </div>

            {/* Meet Link */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-violet-400" /> Virtual Interview Link
              </label>
              <input
                type="url"
                required
                value={formData.meetLink}
                onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-950/40 border border-slate-800 focus:border-violet-500/50 outline-none transition-all text-slate-200 font-mono text-xs"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-violet-400" /> Notes for Candidate (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                placeholder="Ex: Please keep your web-cam enabled. Make sure your internet connection is stable."
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-950/40 border border-slate-800 focus:border-violet-500/50 outline-none transition-all text-slate-200 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 border border-slate-800 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 15px rgba(124,58,237,0.3)' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Schedule &amp; Notify
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InterviewScheduleModal;
