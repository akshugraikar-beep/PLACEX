import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileText, Download, Send, Plus, Trash2, Eye, CheckCircle,
  Building2, User, Calendar, Briefcase, DollarSign, MapPin, ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Default template ──────────────────────────────────────────────────────────
const DEFAULT = {
  companyName: "PlaceX Technologies Pvt. Ltd.",
  companyAddress: "123 Tech Park, Bangalore – 560001, Karnataka, India",
  candidateName: "",
  candidateAddress: "",
  position: "",
  department: "",
  joiningDate: "",
  salary: "",
  location: "",
  probation: "3 months",
  reportingManager: "",
  hrName: "",
  hrDesignation: "HR Manager",
  additionalClauses: [],
};

const inputCls =
  "w-full px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 transition hr-text-primary";
const inputStyle = {
  background: "var(--hr-input-bg)",
  border: "var(--hr-input-border)",
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold hr-text-muted mb-1 uppercase tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

// ── Offer Letter Page ─────────────────────────────────────────────────────────
const OfferLetterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT);
  const [preview, setPreview] = useState(false);
  const [sent, setSent] = useState(false);
  const printRef = useRef();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const addClause = () =>
    setForm((f) => ({ ...f, additionalClauses: [...f.additionalClauses, ""] }));

  const updateClause = (i, val) =>
    setForm((f) => {
      const c = [...f.additionalClauses];
      c[i] = val;
      return { ...f, additionalClauses: c };
    });

  const removeClause = (i) =>
    setForm((f) => ({
      ...f,
      additionalClauses: f.additionalClauses.filter((_, idx) => idx !== i),
    }));

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Offer Letter – ${form.candidateName}</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 60px; color: #111; line-height: 1.8; }
        h1 { font-size: 22px; text-align: center; }
        h2 { font-size: 16px; }
        p, li { font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        td { padding: 8px 12px; border: 1px solid #ccc; font-size: 14px; }
        td:first-child { font-weight: bold; width: 40%; }
        .sig { margin-top: 60px; display: flex; justify-content: space-between; }
        .sig div { text-align: center; width: 40%; }
        .sig p { border-top: 1px solid #333; padding-top: 8px; margin-top: 40px; font-size: 12px; }
      </style></head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });

  // ── Preview HTML ─────────────────────────────────────────────────────────
  const LetterPreview = () => (
    <div ref={printRef} style={{ fontFamily: "Georgia, serif", lineHeight: 1.8, color: "#111" }}>
      <h1 style={{ textAlign: "center", fontSize: 20, marginBottom: 4 }}>OFFER LETTER</h1>
      <p style={{ textAlign: "center", fontSize: 13, color: "#555" }}>Confidential</p>
      <hr style={{ margin: "16px 0" }} />

      <p><strong>Date:</strong> {today}</p>
      <p><strong>To,</strong><br />
        {form.candidateName || "[Candidate Name]"}<br />
        {form.candidateAddress || "[Candidate Address]"}
      </p>

      <p><strong>Subject:</strong> Offer of Employment – {form.position || "[Position]"}</p>
      <p>Dear <strong>{form.candidateName || "[Candidate Name]"}</strong>,</p>

      <p>
        We are pleased to offer you the position of <strong>{form.position || "[Position]"}</strong>
        {form.department ? ` in the <strong>${form.department}</strong> department` : ""}
        at <strong>{form.companyName}</strong>. We were impressed with your profile and are confident
        that you will be a valuable addition to our team.
      </p>

      <h2 style={{ fontSize: 15, marginTop: 24 }}>Terms & Conditions of Employment</h2>
      <table>
        <tbody>
          {[
            ["Position / Designation", form.position || "–"],
            ["Department", form.department || "–"],
            ["Date of Joining", form.joiningDate || "–"],
            ["Work Location", form.location || "–"],
            ["CTC (Per Annum)", form.salary ? `₹ ${form.salary}` : "–"],
            ["Probation Period", form.probation],
            ["Reporting Manager", form.reportingManager || "–"],
          ].map(([k, v]) => (
            <tr key={k}>
              <td>{k}</td>
              <td dangerouslySetInnerHTML={{ __html: v }} />
            </tr>
          ))}
        </tbody>
      </table>

      {form.additionalClauses.length > 0 && (
        <>
          <h2 style={{ fontSize: 15 }}>Additional Terms</h2>
          <ul>
            {form.additionalClauses.map((c, i) => c && <li key={i}>{c}</li>)}
          </ul>
        </>
      )}

      <p>
        Please note that this offer is contingent upon satisfactory verification of your
        credentials, background checks, and the submission of all required documents on
        or before your date of joining.
      </p>
      <p>
        Kindly sign and return a copy of this letter as your acceptance of the offer on or
        before <strong>{form.joiningDate || "[Joining Date]"}</strong>.
      </p>
      <p>We look forward to welcoming you to <strong>{form.companyName}</strong>. For any queries, feel free to reach out to us.</p>

      <div className="sig" style={{ display: "flex", justifyContent: "space-between", marginTop: 60 }}>
        <div style={{ textAlign: "center", width: "42%" }}>
          <p style={{ borderTop: "1px solid #333", paddingTop: 8, marginTop: 50, fontSize: 13 }}>
            {form.hrName || "Authorised Signatory"}<br />
            <em>{form.hrDesignation}</em><br />
            {form.companyName}
          </p>
        </div>
        <div style={{ textAlign: "center", width: "42%" }}>
          <p style={{ borderTop: "1px solid #333", paddingTop: 8, marginTop: 50, fontSize: 13 }}>
            {form.candidateName || "Candidate Signature"}<br />
            <em>Acceptance</em>
          </p>
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="hr-page" style={{ minHeight: "100vh" }}>
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm hr-text-secondary hover:text-violet-400 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold hr-text-primary flex items-center gap-2">
              <FileText className="w-6 h-6 text-violet-400" /> Offer Letter Generator
            </h1>
            <p className="hr-text-secondary text-sm mt-1">
              Generate and download professional offer letters instantly
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => { setPreview(false); setSent(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${!preview ? "text-white" : "hr-text-secondary"}`}
              style={!preview ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)" } : { background: "var(--hr-input-bg)", border: "var(--hr-input-border)" }}>
              <FileText className="w-4 h-4" /> Form
            </button>
            <button onClick={() => setPreview(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${preview ? "text-white" : "hr-text-secondary"}`}
              style={preview ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)" } : { background: "var(--hr-input-bg)", border: "var(--hr-input-border)" }}>
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition"
              style={{ background: "linear-gradient(135deg,#059669,#047857)", boxShadow: "0 0 12px rgba(5,150,105,0.35)" }}>
              <Download className="w-4 h-4" /> Download / Print
            </button>
            <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 12px rgba(124,58,237,0.35)" }}>
              {sent ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {sent ? "Sent!" : "Send"}
            </button>
          </div>
        </div>
      </motion.div>

      {!preview ? (
        /* ── FORM ── */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Company Details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="hr-card p-6">
            <h3 className="font-semibold hr-text-primary text-sm mb-5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-violet-400" /> Company Details
            </h3>
            <div className="space-y-4">
              <Field label="Company Name">
                <input className={inputCls} style={inputStyle} value={form.companyName}
                  onChange={e => set("companyName", e.target.value)} />
              </Field>
              <Field label="Company Address">
                <textarea rows={2} className={inputCls} style={inputStyle} value={form.companyAddress}
                  onChange={e => set("companyAddress", e.target.value)} />
              </Field>
              <Field label="HR Name (Signatory)">
                <input className={inputCls} style={inputStyle} value={form.hrName}
                  onChange={e => set("hrName", e.target.value)} placeholder="e.g. Priya Sharma" />
              </Field>
              <Field label="HR Designation">
                <input className={inputCls} style={inputStyle} value={form.hrDesignation}
                  onChange={e => set("hrDesignation", e.target.value)} />
              </Field>
            </div>
          </motion.div>

          {/* Candidate Details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="hr-card p-6">
            <h3 className="font-semibold hr-text-primary text-sm mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" /> Candidate Details
            </h3>
            <div className="space-y-4">
              <Field label="Full Name">
                <input className={inputCls} style={inputStyle} value={form.candidateName}
                  onChange={e => set("candidateName", e.target.value)} placeholder="e.g. Rahul Sharma" />
              </Field>
              <Field label="Address">
                <textarea rows={2} className={inputCls} style={inputStyle} value={form.candidateAddress}
                  onChange={e => set("candidateAddress", e.target.value)} placeholder="Full residential address" />
              </Field>
            </div>
          </motion.div>

          {/* Job Details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="hr-card p-6">
            <h3 className="font-semibold hr-text-primary text-sm mb-5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-violet-400" /> Job Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Position / Designation">
                <input className={inputCls} style={inputStyle} value={form.position}
                  onChange={e => set("position", e.target.value)} placeholder="e.g. Software Engineer" />
              </Field>
              <Field label="Department">
                <input className={inputCls} style={inputStyle} value={form.department}
                  onChange={e => set("department", e.target.value)} placeholder="e.g. Engineering" />
              </Field>
              <Field label="Date of Joining">
                <input type="date" className={inputCls} style={inputStyle} value={form.joiningDate}
                  onChange={e => set("joiningDate", e.target.value)} />
              </Field>
              <Field label="Work Location">
                <input className={inputCls} style={inputStyle} value={form.location}
                  onChange={e => set("location", e.target.value)} placeholder="e.g. Bangalore" />
              </Field>
              <Field label="Reporting Manager">
                <input className={inputCls} style={inputStyle} value={form.reportingManager}
                  onChange={e => set("reportingManager", e.target.value)} placeholder="e.g. Anita Nair" />
              </Field>
              <Field label="Probation Period">
                <input className={inputCls} style={inputStyle} value={form.probation}
                  onChange={e => set("probation", e.target.value)} />
              </Field>
            </div>
          </motion.div>

          {/* Compensation & Clauses */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="hr-card p-6">
            <h3 className="font-semibold hr-text-primary text-sm mb-5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-violet-400" /> Compensation & Additional Clauses
            </h3>
            <div className="space-y-4">
              <Field label="CTC Per Annum (₹)">
                <input className={inputCls} style={inputStyle} value={form.salary}
                  onChange={e => set("salary", e.target.value)} placeholder="e.g. 6,00,000" />
              </Field>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold hr-text-muted uppercase tracking-wide">
                    Additional Clauses
                  </label>
                  <button onClick={addClause}
                    className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition">
                    <Plus className="w-3.5 h-3.5" /> Add Clause
                  </button>
                </div>
                {form.additionalClauses.length === 0 && (
                  <p className="text-xs hr-text-muted italic">No additional clauses added.</p>
                )}
                {form.additionalClauses.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input className={`${inputCls} flex-1`} style={inputStyle} value={c}
                      onChange={e => updateClause(i, e.target.value)}
                      placeholder={`Clause ${i + 1}…`} />
                    <button onClick={() => removeClause(i)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 transition flex-shrink-0"
                      style={{ background: "rgba(239,68,68,0.1)" }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* ── PREVIEW ── */
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="hr-card p-8 md:p-12 max-w-3xl mx-auto" style={{ background: "white", color: "#111" }}>
          <LetterPreview />
        </motion.div>
      )}

      {/* Hidden print version */}
      {!preview && (
        <div style={{ display: "none" }}>
          <div ref={printRef}><LetterPreview /></div>
        </div>
      )}
    </div>
  );
};

export default OfferLetterPage;
