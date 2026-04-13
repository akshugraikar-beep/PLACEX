import React, { useState, useEffect, useRef } from "react";
import { pythonChallenges } from "../../data/pythonChallenges";
import {
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Trophy,
  Play,
  RefreshCw,
  Flame,
  ChevronRight,
  Lock,
} from "lucide-react";

// ----------------------------------------------------------------
// Helper – pick 2 questions for the current "section/day"
// Sections rotate every 24 hours. After 25 sections (50 qs),
// the cycle repeats. User can also manually go to next section.
// ----------------------------------------------------------------
function getTodaySection() {
  const SECTION_KEY = "PlaceX_daily_challenge_section";
  const DATE_KEY = "PlaceX_daily_challenge_date";

  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(DATE_KEY);
  let section = parseInt(localStorage.getItem(SECTION_KEY) || "0", 10);

  if (savedDate !== today) {
    // New day → advance section (cycle through 25 sections of 2 questions)
    section = (section + 1) % 25;
    localStorage.setItem(SECTION_KEY, String(section));
    localStorage.setItem(DATE_KEY, today);
  }

  return section;
}

function getSectionQuestions(section) {
  const start = (section % 25) * 2;
  return [pythonChallenges[start], pythonChallenges[start + 1]];
}

function normalize(str) {
  return str.replace(/\s+/g, " ").trim().toLowerCase();
}

function checkAnswer(userCode, challenge) {
  const ua = normalize(userCode);
  const ea = normalize(challenge.answer_code);
  const eo = normalize(challenge.expected_output);
  // Exact match
  if (ua === ea) return true;
  // Contains expected output as a literal
  if (ua.includes(eo)) return true;
  // Structural similarity – share ≥60% tokens
  const uTokens = new Set(ua.split(/\W+/).filter(Boolean));
  const eTokens = ea.split(/\W+/).filter(Boolean);
  const matches = eTokens.filter((t) => uTokens.has(t)).length;
  return eTokens.length > 0 && matches / eTokens.length >= 0.6;
}

// ----------------------------------------------------------------
// Timer component
// ----------------------------------------------------------------
function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
  const timerRef = useRef(null);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    timerRef.current = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [remaining, onExpire]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const pct = (remaining / seconds) * 100;
  const color =
    remaining > 90
      ? "from-emerald-500 to-teal-500"
      : remaining > 40
      ? "from-yellow-400 to-orange-400"
      : "from-red-500 to-rose-500";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke="url(#timerGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 0.9s linear" }}
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={remaining > 90 ? "#10b981" : remaining > 40 ? "#facc15" : "#ef4444"} />
              <stop offset="100%" stopColor={remaining > 90 ? "#14b8a6" : remaining > 40 ? "#f97316" : "#f43f5e"} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {mins}:{secs}
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Time Left</span>
    </div>
  );
}

// ----------------------------------------------------------------
// Question Card
// ----------------------------------------------------------------
function QuestionCard({ index, challenge, userCode, onChange, result, submitted }) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        submitted
          ? result
            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
            : "border-red-400 bg-red-50 dark:bg-red-900/20"
          : "border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-800/80"
      } shadow-md`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
            submitted
              ? result
                ? "bg-emerald-500"
                : "bg-red-500"
              : "bg-gradient-to-br from-indigo-500 to-purple-600"
          }`}
        >
          {submitted ? (result ? <CheckCircle size={16} /> : <XCircle size={16} />) : index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">
              Question {index + 1}
            </span>
            {submitted && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  result
                    ? "bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300"
                }`}
              >
                {result ? "+5 pts ✓" : "0 pts ✗"}
              </span>
            )}
          </div>
          <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-base leading-snug">
            {challenge.question}
          </h3>
        </div>
      </div>

      {/* Hint: expected output */}
      <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium">Expected output:</span>{" "}
        <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-300">
          {challenge.expected_output}
        </code>
      </div>

      {/* Code textarea */}
      <textarea
        rows={5}
        value={userCode}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        placeholder={`# Write your Python code here...\n# Hint: ${challenge.answer_code.split("\n")[0]}`}
        className={`w-full font-mono text-sm rounded-xl p-3 border resize-none outline-none transition-all duration-200 ${
          submitted
            ? "bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border-transparent cursor-not-allowed"
            : "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        }`}
      />

      {/* Show correct answer after submission */}
      {submitted && !result && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-900 border border-emerald-300 dark:border-emerald-700 rounded-xl">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">✅ Correct Answer:</p>
          <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {challenge.answer_code}
          </pre>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Result Modal
// ----------------------------------------------------------------
function ResultModal({ points, total, onClose, onNextSection }) {
  const pct = Math.round((points / total) * 100);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-fade-in">
        <div
          className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg ${
            pct === 100
              ? "bg-gradient-to-br from-yellow-400 to-orange-400"
              : pct === 50
              ? "bg-gradient-to-br from-indigo-400 to-purple-500"
              : "bg-gradient-to-br from-red-400 to-rose-500"
          }`}
        >
          {pct === 100 ? "🏆" : pct === 50 ? "⭐" : "💪"}
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">
          {pct === 100 ? "Perfect Score!" : pct === 50 ? "Good Job!" : "Keep Practicing!"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Daily Challenge Complete</p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{points}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Points Earned</p>
          </div>
          <div className="text-3xl text-gray-300">/</div>
          <div className="text-center">
            <p className="text-4xl font-black text-gray-400">{total}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Points</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onNextSection}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
          >
            Next Section <ChevronRight size={18} />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Back to Coding
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------
const TIMER_SECONDS = 180; // 3 minutes

export default function DailyChallengeSection({ onClose }) {
  const [section, setSection] = useState(() => getTodaySection());
  const [questions, setQuestions] = useState(() => getSectionQuestions(getTodaySection()));
  const [answers, setAnswers] = useState(["", ""]);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([false, false]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // reset key

  // Load saved points from localStorage
  const [lifetimePoints, setLifetimePoints] = useState(() => {
    return parseInt(localStorage.getItem("PlaceX_coding_points") || "0", 10);
  });

  const handleStart = () => setStarted(true);

  const handleSubmit = () => {
    const r = questions.map((q, i) => checkAnswer(answers[i], q));
    const pts = r.filter(Boolean).length * 5;
    setResults(r);
    setTotalPoints(pts);
    setSubmitted(true);
    setShowModal(true);
    // Save points
    const newTotal = lifetimePoints + pts;
    setLifetimePoints(newTotal);
    localStorage.setItem("PlaceX_coding_points", String(newTotal));
  };

  const handleTimerExpire = () => {
    if (!submitted) handleSubmit();
  };

  const handleNextSection = () => {
    const nextSection = (section + 1) % 25;
    setSection(nextSection);
    setQuestions(getSectionQuestions(nextSection));
    setAnswers(["", ""]);
    setResults([false, false]);
    setSubmitted(false);
    setStarted(false);
    setShowModal(false);
    setTimerKey((k) => k + 1);
    // Update localStorage
    localStorage.setItem("PlaceX_daily_challenge_section", String(nextSection));
  };

  const sectionLabel = section + 1;
  const totalSections = 25;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950/30 dark:to-gray-900 p-4 sm:p-6">
      {showModal && (
        <ResultModal
          points={totalPoints}
          total={10}
          onClose={() => setShowModal(false)}
          onNextSection={handleNextSection}
        />
      )}

      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="text-orange-500" size={20} />
              <span className="text-sm font-bold text-orange-500 uppercase tracking-wide">Daily Challenge</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white">
              Python Practice
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Section {sectionLabel} of {totalSections} &nbsp;·&nbsp; 2 Questions &nbsp;·&nbsp; 3 Min Timer
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Lifetime points badge */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow">
              <Trophy size={14} /> {lifetimePoints} pts
            </div>
            {/* Section progress dots */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalSections, 10) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < sectionLabel % 10
                      ? "bg-indigo-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pre-start card */}
        {!started ? (
          <div className="rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-indigo-100 dark:border-indigo-800 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">🐍</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Ready for Today's Challenge?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto">
              Solve 2 Python questions in <strong>3 minutes</strong>. Each correct answer earns you <strong>5 points</strong>!
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              {[
                { icon: "❓", label: "Questions", val: "2" },
                { icon: "⏱️", label: "Time Limit", val: "3 min" },
                { icon: "⭐", label: "Max Points", val: "10 pts" },
              ].map((item) => (
                <div key={item.label} className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-300">{item.val}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
            <button
              id="daily-challenge-start-btn"
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-105"
            >
              <Play size={18} /> Start Challenge
            </button>
          </div>
        ) : (
          <>
            {/* Timer + actions bar */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-indigo-100 dark:border-indigo-800 px-5 py-3 mb-6">
              <CountdownTimer
                key={timerKey}
                seconds={TIMER_SECONDS}
                onExpire={handleTimerExpire}
              />
              <div className="flex gap-2">
                {!submitted && (
                  <button
                    id="daily-challenge-submit-btn"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    <CheckCircle size={16} /> Submit
                  </button>
                )}
                <button
                  onClick={handleNextSection}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
                >
                  <RefreshCw size={14} /> Next
                </button>
              </div>
            </div>

            {/* Question Cards */}
            <div className="flex flex-col gap-5">
              {questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  index={i}
                  challenge={q}
                  userCode={answers[i]}
                  onChange={(val) => setAnswers((prev) => { const a = [...prev]; a[i] = val; return a; })}
                  result={results[i]}
                  submitted={submitted}
                />
              ))}
            </div>

            {/* Bottom submit */}
            {!submitted && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-105"
                >
                  <CheckCircle size={18} /> Check Answers & Claim Points
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
