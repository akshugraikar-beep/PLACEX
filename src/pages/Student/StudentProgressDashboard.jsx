import React, { useState, useEffect } from "react";
import { Search, BarChart3, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getScoreSnapshot } from "../../hooks/useScoring";

// ── Real classmates ────────────────────────────────────────────────────────────
const PEERS = [
  { id: 1,  name: "Vikas Naik",    email: "vikas.naik@placex.dev",    progress: 75,  status: "In Progress" },
  { id: 2,  name: "Shailesh Naik", email: "shailesh.naik@placex.dev", progress: 100, status: "Completed"   },
  { id: 3,  name: "Aryan Nayak",   email: "aryan.nayak@placex.dev",   progress: 40,  status: "In Progress" },
  { id: 4,  name: "Dev Nayak",     email: "dev.nayak@placex.dev",     progress: 0,   status: "Not Started" },
  { id: 5,  name: "Prajwal",       email: "prajwal@placex.dev",       progress: 90,  status: "In Progress" },
  { id: 6,  name: "Aakash",        email: "aakash@placex.dev",        progress: 100, status: "Completed"   },
  { id: 7,  name: "Prateek",       email: "prateek@placex.dev",       progress: 65,  status: "In Progress" },
  { id: 8,  name: "Sanjana",       email: "sanjana@placex.dev",       progress: 55,  status: "In Progress" },
  { id: 9,  name: "Bindu",         email: "bindu@placex.dev",         progress: 0,   status: "Not Started" },
  { id: 10, name: "Divya",         email: "divya@placex.dev",         progress: 80,  status: "In Progress" },
  { id: 11, name: "Ananya",        email: "ananya@placex.dev",        progress: 100, status: "Completed"   },
  { id: 12, name: "Kiran",         email: "kiran@placex.dev",         progress: 30,  status: "In Progress" },
];

// ── Card component (exact original style) ──────────────────────────────────────
const StudentProgressCard = ({ student }) => {
  const progressColor =
    student.status === "Completed"
      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
      : student.progress > 0
      ? "bg-gradient-to-r from-sky-500 to-blue-400"
      : "bg-gradient-to-r from-gray-300 to-gray-200";

  const statusColor =
    student.status === "Completed"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200"
      : student.status === "In Progress"
      ? "bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-200"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";

  const isYou = student.isYou;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white w-64 dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col gap-4 justify-between border cursor-pointer group mb-6 hover:scale-[1.035] overflow-hidden ${
        isYou
          ? "border-purple-400 dark:border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900"
          : "border-gray-100 dark:border-slate-700"
      }`}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-300 via-blue-200 to-transparent dark:from-purple-900 dark:via-blue-900 dark:to-transparent rounded-full blur-2xl opacity-50 pointer-events-none z-0" />
      <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-gradient-to-tr from-emerald-200 via-purple-100 to-transparent dark:from-emerald-900 dark:via-purple-900 dark:to-transparent rounded-full blur-2xl opacity-40 pointer-events-none z-0" />

      {/* Avatar & Info */}
      <div className="flex items-center gap-5 z-10 relative">
        <div className={`flex items-center justify-center h-12 w-12 rounded-full shadow-lg group-hover:scale-110 transition-transform border-2 border-white dark:border-slate-800 ${
          isYou
            ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            : "bg-gradient-to-br from-blue-200 to-purple-300 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-300"
        }`}>
          {isYou
            ? <span className="text-xs font-bold">YOU</span>
            : <UserCircle size={38} />
          }
        </div>
        <div className="flex flex-col">
          <h3 className={`text-lg font-semibold leading-tight truncate drop-shadow ${
            isYou ? "text-purple-700 dark:text-purple-300" : "text-gray-900 dark:text-white"
          }`}>
            {student.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
            {student.email}
          </p>
        </div>
      </div>

      {/* Progress & Status */}
      <div className="flex flex-col gap-2 z-10 relative">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-3 py-[0.35rem] rounded-full ${statusColor} shadow-sm`}>
            {student.status}
          </span>
          <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
            {student.progress}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-slate-600 overflow-hidden shadow-inner relative">
          <div
            style={{ width: `${student.progress}%` }}
            className={`h-full ${progressColor} transition-all duration-500`}
          />
          <div className="absolute left-0 top-0 h-full w-full pointer-events-none">
            <div className="h-full w-1/3 bg-white/30 dark:bg-white/10 rounded-full blur-sm" />
          </div>
        </div>
      </div>

      {/* You badge */}
      {isYou && (
        <div className="z-10 relative text-center">
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-700">
            ⭐ Your Progress
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const StudentProgressDashboard = () => {
  const [scoreData, setScoreData] = useState(() => getScoreSnapshot());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Live-update your score every 3s
  useEffect(() => {
    const refresh = () => setScoreData(getScoreSnapshot());
    window.addEventListener("storage", refresh);
    const t = setInterval(refresh, 3000);
    return () => { window.removeEventListener("storage", refresh); clearInterval(t); };
  }, []);

  // Compute "You" card progress from live score (max 700 XP baseline)
  const youProgress = Math.min(Math.round((scoreData.totalPoints / 700) * 100), 100);
  const youStatus = youProgress >= 100 ? "Completed" : youProgress > 0 ? "In Progress" : "Not Started";

  const STATUS_ORDER = { "Completed": 0, "In Progress": 1, "Not Started": 2 };

  const allStudents = [
    ...PEERS,
    {
      id: 999,
      name: "You",
      email: `${scoreData.totalPoints} XP earned`,
      progress: youProgress,
      status: youStatus,
      isYou: true,
    },
  ].sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (statusDiff !== 0) return statusDiff;
    return b.progress - a.progress; // higher % first within same status
  });

  const filtered = allStudents.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="relative p-6 min-h-screen overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 absolute inset-0" />
        <div className="absolute top-[-80px] left-[-120px] w-[320px] h-[320px] bg-gradient-to-br from-purple-300 via-blue-200 to-transparent dark:from-purple-900 dark:via-blue-900 dark:to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-[-100px] right-[-120px] w-[280px] h-[280px] bg-gradient-to-tr from-emerald-200 via-purple-100 to-transparent dark:from-emerald-900 dark:via-purple-900 dark:to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-purple-100 via-blue-100 to-emerald-100 dark:from-purple-950 dark:via-blue-950 dark:to-emerald-950 rounded-3xl blur-[120px] opacity-20" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BarChart3 size={32} className="text-purple-600 dark:text-purple-400 mr-3 drop-shadow-lg" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow">
              Student Progress Tracker
            </h1>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="block w-full md:w-48 pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {filtered.map(student => (
              <StudentProgressCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 text-center text-gray-600 dark:text-slate-400">
            <p>No students match your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressDashboard;
