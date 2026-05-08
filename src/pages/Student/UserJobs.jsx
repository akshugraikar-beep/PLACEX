import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  CalendarDays,
  BadgeCheck,
  Search,
  X,
  Upload,
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  CheckCircle,
} from "lucide-react";

const dummyJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Spark",
    logo: "https://logo.clearbit.com/github.com",
    location: "Remote",
    type: "Full-time",
    experience: "0-1 years",
    posted: "2 days ago",
    skills: ["React", "JavaScript", "Tailwind CSS"],
    salary: "₹6 - ₹8 LPA",
  },
  {
    id: 2,
    title: "React Developer Intern",
    company: "CodeWave",
    logo: "https://logo.clearbit.com/vercel.com",
    location: "Bangalore",
    type: "Internship",
    experience: "Fresher",
    posted: "4 days ago",
    skills: ["React", "HTML", "CSS"],
    salary: "₹15K/month",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignHive",
    logo: "https://logo.clearbit.com/figma.com",
    location: "Delhi",
    type: "Freelance",
    experience: "1-2 years",
    posted: "1 week ago",
    skills: ["Figma", "Adobe XD", "UX"],
    salary: "₹20K/project",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "TechCorp",
    logo: "https://logo.clearbit.com/docker.com",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
    posted: "3 days ago",
    skills: ["Node.js", "MongoDB", "API"],
    salary: "₹10 - ₹12 LPA",
  },
  {
    id: 5,
    title: "AI Research Intern",
    company: "FutureTech",
    logo: "https://logo.clearbit.com/openai.com",
    location: "Remote",
    type: "Internship",
    experience: "Fresher",
    posted: "Today",
    skills: ["Python", "TensorFlow", "AI"],
    salary: "₹25K/month",
  },
];

// ── Apply Modal ────────────────────────────────────────────────────────────────
const ApplyModal = ({ job, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    degree: "",
    college: "",
    passYear: "",
    skills: "",
    linkedin: "",
    coverLetter: "",
    resume: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())   errs.name   = "Full name is required";
    if (!form.email.trim())  errs.email  = "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone.trim())  errs.phone  = "Phone number is required";
    if (!form.degree.trim()) errs.degree = "Degree is required";
    if (!form.college.trim()) errs.college = "College name is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Save to localStorage (simulate submission)
    const applications = JSON.parse(localStorage.getItem("PlaceX_applications") || "[]");
    applications.push({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString(),
      applicant: { ...form, resume: form.resume?.name || null },
    });
    localStorage.setItem("PlaceX_applications", JSON.stringify(applications));
    setSubmitted(true);
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
      errors[field]
        ? "border-red-400 dark:border-red-500"
        : "border-gray-300 dark:border-gray-600"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-lg font-bold">Apply for {job.title}</h2>
            <p className="text-sm text-blue-100">{job.company} · {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              You've applied for <strong>{job.title}</strong> at <strong>{job.company}</strong>.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mb-6">We'll notify you about the next steps.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition"
            >
              Back to Jobs
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[75vh]">
            <div className="px-6 py-5 space-y-4">

              {/* Personal Info */}
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Personal Details</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Full Name *
                  </label>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Akshay Naik" className={inputClass("name")} />
                  {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email *
                  </label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@email.com" className={inputClass("email")} />
                  {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone *
                  </label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 9876543210" className={inputClass("phone")} />
                  {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                    🔗 LinkedIn Profile
                  </label>
                  <input name="linkedin" value={form.linkedin} onChange={handleChange}
                    placeholder="linkedin.com/in/you" className={inputClass("linkedin")} />
                </div>
              </div>

              {/* Education */}
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide pt-1">Education</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" /> College / University *
                  </label>
                  <input name="college" value={form.college} onChange={handleChange}
                    placeholder="VTU, Bangalore" className={inputClass("college")} />
                  {errors.college && <p className="text-red-500 text-xs mt-0.5">{errors.college}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Pass Year</label>
                  <select name="passYear" value={form.passYear} onChange={handleChange} className={inputClass("passYear")}>
                    <option value="">Year</option>
                    {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Degree *</label>
                  <input name="degree" value={form.degree} onChange={handleChange}
                    placeholder="B.E. Computer Science" className={inputClass("degree")} />
                  {errors.degree && <p className="text-red-500 text-xs mt-0.5">{errors.degree}</p>}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                  ⚡ Key Skills
                </label>
                <input name="skills" value={form.skills} onChange={handleChange}
                  placeholder="React, JavaScript, Python…" className={inputClass("skills")} />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Cover Letter
                </label>
                <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange}
                  rows={3} placeholder={`Why are you a great fit for ${job.title} at ${job.company}?`}
                  className={`${inputClass("coverLetter")} resize-none`} />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" /> Resume (PDF)
                </label>
                <label className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 cursor-pointer hover:border-blue-400 transition-colors">
                  <Upload className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {form.resume ? form.resume.name : "Click to upload resume…"}
                  </span>
                  <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t dark:border-gray-700 flex gap-3 justify-end bg-gray-50 dark:bg-gray-800/50">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Cancel
              </button>
              <button type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md transition">
                Submit Application →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const UserJobs = () => {
  const [filters, setFilters] = useState({ location: "", experience: "", type: "", search: "" });
  const [applyingJob, setApplyingJob] = useState(null); // job being applied to
  const [appliedIds, setAppliedIds] = useState(() => {
    try {
      const apps = JSON.parse(localStorage.getItem("PlaceX_applications") || "[]");
      return new Set(apps.map(a => a.jobId));
    } catch { return new Set(); }
  });

  const filteredJobs = dummyJobs.filter((job) => {
    const searchMatch = filters.search.trim() === "" ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase());
    const locationMatch   = filters.location   === "" || job.location   === filters.location;
    const experienceMatch = filters.experience === "" || job.experience === filters.experience;
    const typeMatch       = filters.type       === "" || job.type       === filters.type;
    return searchMatch && locationMatch && experienceMatch && typeMatch;
  });

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleApplySuccess = (job) => {
    setAppliedIds(prev => new Set([...prev, job.id]));
    setApplyingJob(null);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen overflow-x-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-white/80 to-fuchsia-100/60 dark:from-gray-900/80 dark:via-gray-950/80 dark:to-gray-900/80" />
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-blue-400/20 dark:bg-blue-700/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-fuchsia-400/20 dark:bg-fuchsia-700/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px] text-gray-900 dark:text-gray-100" />
      </div>

      {/* Heading */}
      <header className="px-4 sm:px-6 pt-10 sm:pt-14">
        <h1 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Recommended Jobs For You
          </span>
          <span className="ml-2">🚀</span>
        </h1>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300">
          Curated roles matching your skills and preferences
        </p>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-20 mt-8 px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/50 bg-gray-100/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4">
            <div className="col-span-1 lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-300" />
              <input type="text" placeholder="Search title or company" name="search"
                value={filters.search} onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60" />
            </div>
            {[
              { name: "location", options: ["All Locations", "Remote", "Bangalore", "Delhi"] },
              { name: "experience", options: ["All Experience Levels", "Fresher", "0-1 years", "1-2 years", "2+ years"] },
              { name: "type", options: ["All Types", "Full-time", "Internship", "Freelance"] },
            ].map(({ name, options }) => (
              <div className="relative" key={name}>
                <select name={name} value={filters[name]} onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60 appearance-none">
                  {options.map(o => (
                    <option key={o} value={o.startsWith("All") ? "" : o}>{o}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">▾</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <main className="px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const alreadyApplied = appliedIds.has(job.id);
            return (
              <article key={job.id}
                className="group relative rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ minHeight: 340 }}>

                {/* Applied badge */}
                {alreadyApplied && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-300 dark:border-emerald-700 shadow">
                    <CheckCircle className="w-3.5 h-3.5" /> Applied
                  </div>
                )}

                {/* Company Banner */}
                <div className="flex items-center gap-4 px-6 pt-6 pb-2 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                  <img src={job.logo} alt={job.company}
                    className="w-16 h-16 rounded-xl border-2 border-white dark:border-gray-700 object-contain bg-white dark:bg-gray-900 shadow-md p-2 transition-transform group-hover:scale-105"
                    loading="lazy" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      {job.title}
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-200 border border-blue-200/60">
                        {job.type}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
                      {job.company}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 py-4">
                  <div className="flex flex-wrap gap-4 mb-3 text-gray-700 dark:text-gray-300 text-sm">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /><span>{job.location}</span></div>
                    <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-emerald-600" /><span>{job.posted}</span></div>
                    <div className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-amber-600" /><span>{job.experience}</span></div>
                    <div className="flex items-center gap-2"><span className="text-rose-600">💸</span><span className="font-semibold">{job.salary}</span></div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-700/30 dark:text-blue-200 border border-blue-200/60 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => !alreadyApplied && setApplyingJob(job)}
                    disabled={alreadyApplied}
                    className={`w-full py-2.5 rounded-xl font-bold text-white transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      alreadyApplied
                        ? "bg-emerald-500 cursor-default opacity-80"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.98] group-hover:scale-105"
                    }`}
                    aria-label={`Apply for ${job.title} at ${job.company}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {alreadyApplied ? (
                        <><CheckCircle className="w-4 h-4" /> Application Submitted</>
                      ) : (
                        <>Apply Now
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Apply Modal */}
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSuccess={() => handleApplySuccess(applyingJob)}
        />
      )}
    </div>
  );
};

export default UserJobs;
