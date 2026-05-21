import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDailyLimit } from "../../hooks/useDailyLimit";
import { addScore } from "../../hooks/useScoring";
import { useTabWarning } from "../../hooks/useTabWarning";
import TabWarningOverlay from "../../components/TabWarningOverlay";
import Header from '../../components/Header'; 
import Footer from "../../components/Footer";
import {
  Upload,
  Mic,
  MicOff,
  Calendar,
  FileText,
  Brain,
  Star,
  Clock,
  ChevronRight,
  RotateCcw,
  Copy,
  Trash2,
  User,
  Bot,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader,
  Plus,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";

// ===== Question Bank =====
const TECHNICAL_QUESTIONS = [
  { question: "What programming languages are you most comfortable with?", keywords: ["programming","languages","experience","projects","usage","code","work","use","build"] },
  { question: "Explain object-oriented programming concepts.", keywords: ["oop","encapsulation","inheritance","polymorphism","abstraction","concept","class","object","basic"] },
  { question: "What is the difference between frontend and backend development?", keywords: ["frontend","backend","client","server","ui","logic","design","data","work"] },
  { question: "How do you optimize website performance?", keywords: ["performance","optimization","lazy loading","caching","minify","speed","fast","load","improve"] },
  { question: "What is version control and why is it important?", keywords: ["version control","git","collaboration","tracking","changes","code","save","history","team"] },
  { question: "Describe your experience with REST APIs.", keywords: ["api","rest","http","request","response","json","data","connect","server"] },
  { question: "What is responsive design?", keywords: ["responsive","media queries","mobile","flexible","layout","screen","device","fit"] },
  { question: "How do you handle tight deadlines?", keywords: ["deadline","time","plan","priority","focus","manage","work","complete"] },
  { question: "Explain the concept of asynchronous programming.", keywords: ["async","await","promise","callback","non-blocking","wait","process","task"] },
  { question: "What is database normalization?", keywords: ["database","normalization","tables","relations","data","organize","structure"] },
  { question: "What is your favorite programming language and why?", keywords: ["language", "like", "use", "easy", "experience", "work"] },
  { question: "Explain how the internet works.", keywords: ["internet", "network", "server", "client", "data", "request"] },
  { question: "What is HTML and its role?", keywords: ["html", "structure", "web", "page", "content", "design"] },
  { question: "What is CSS used for?", keywords: ["css", "style", "design", "layout", "color", "page"] },
  { question: "What is JavaScript used for?", keywords: ["javascript", "logic", "function", "dynamic", "web", "interaction"] },
  { question: "What is a variable in programming?", keywords: ["variable", "store", "data", "value", "memory", "use"] },
  { question: "What is a function?", keywords: ["function", "code", "task", "reuse", "execute", "logic"] },
  { question: "What is a loop?", keywords: ["loop", "repeat", "iteration", "code", "run", "times"] },
  { question: "What is an array?", keywords: ["array", "list", "data", "multiple", "store", "values"] },
  { question: "What is an object in JavaScript?", keywords: ["object", "key", "value", "data", "store", "structure"] },
  { question: "What is Git and why do we use it?", keywords: ["git", "version", "code", "track", "changes", "team"] },
  { question: "What is debugging?", keywords: ["debug", "error", "fix", "problem", "code", "issue"] },
  { question: "What is a server?", keywords: ["server", "data", "request", "response", "client", "system"] },
  { question: "What is a database?", keywords: ["database", "data", "store", "manage", "information", "system"] },
  { question: "What is an API?", keywords: ["api", "connect", "data", "request", "response", "service"] },
  { question: "What is JSON?", keywords: ["json", "data", "format", "key", "value", "structure"] },
  { question: "What is the DOM?", keywords: ["dom", "document", "html", "structure", "web", "tree"] },
  { question: "What is event handling in JavaScript?", keywords: ["event", "click", "user", "action", "handle", "function"] },
  { question: "What is local storage?", keywords: ["local storage", "browser", "data", "save", "store", "client"] },
  { question: "What is a framework?", keywords: ["framework", "tools", "structure", "development", "code", "build"] },
  { question: "What is software development?", keywords: ["software", "development", "build", "application", "code"] },
  { question: "What is testing in software?", keywords: ["testing", "check", "error", "quality", "code"] },
  { question: "What is deployment?", keywords: ["deployment", "release", "server", "host", "application"] },
  { question: "What is a bug?", keywords: ["bug", "error", "issue", "problem", "fix"] },
  { question: "What is agile methodology?", keywords: ["agile", "process", "team", "iteration", "development"] },
  { question: "What is a sprint in agile?", keywords: ["sprint", "task", "time", "work", "iteration"] }
];

const BEHAVIORAL_QUESTIONS = [
  { question: "Describe a time you showed leadership skills.", keywords: ["leadership","team","lead","responsibility","manage","guide","support"] },
  { question: "Tell me about a time you handled a conflict at work.", keywords: ["conflict","problem","team","solve","communication","handle","situation"] },
  { question: "Describe a situation where you had to make a tough decision.", keywords: ["decision","difficult","choice","problem","result","handle","thinking"] },
  { question: "How do you handle failure in your career?", keywords: ["failure","learn","improve","mistake","growth","experience"] },
  { question: "Tell me about a time you worked under pressure.", keywords: ["pressure","stress","deadline","work","manage","complete"] },
  { question: "Describe a time you went beyond your responsibilities.", keywords: ["extra","effort","responsibility","work","help","initiative"] },
  { question: "Tell me about a time you had to learn something quickly.", keywords: ["learn","quick","adapt","new","skill","practice","improve"] },
  { question: "How do you prioritize tasks when everything is important?", keywords: ["priority","tasks","time","plan","manage","important"] },
  { question: "Describe a situation where you failed to meet expectations.", keywords: ["failure","expectation","learn","improve","mistake"] },
  { question: "Tell me about a time you worked with a difficult person.", keywords: ["difficult","team","communication","handle","work","solve"] },
  { question: "How do you handle feedback from seniors?", keywords: ["feedback","improve","learn","accept","grow"] },
  { question: "Describe your biggest achievement.", keywords: ["achievement","success","goal","result","work","proud"] },
  { question: "What would you do if you disagree with your manager?", keywords: ["disagree","manager","respect","communication","handle"] },
  { question: "How do you stay motivated during repetitive tasks?", keywords: ["motivation","focus","task","work","discipline","goal"] },
  { question: "Tell me about a time you had to adapt to change.", keywords: ["adapt","change","new","learn","flexible","adjust"] },
  { question: "How do you handle a situation when you don't know something?", keywords: ["learn", "ask", "research", "improve", "try", "understand"] },
  { question: "Tell me about a time you helped someone.", keywords: ["help", "team", "support", "work", "situation", "result"] },
  { question: "How do you react to failure?", keywords: ["failure", "learn", "improve", "experience", "grow"] },
  { question: "How do you stay organized?", keywords: ["organize", "plan", "schedule", "task", "manage", "time"] },
  { question: "What do you do in your free time?", keywords: ["free time", "hobby", "learn", "activity", "interest"] },
  { question: "What is your biggest strength?", keywords: ["strength", "skill", "good", "work", "ability"] },
  { question: "What is your biggest weakness?", keywords: ["weakness", "improve", "learn", "working", "growth"] },
  { question: "How do you handle multiple tasks?", keywords: ["tasks", "manage", "time", "priority", "plan"] },
  { question: "How do you communicate in a team?", keywords: ["communication", "team", "talk", "share", "work"] },
  { question: "What is your goal in life?", keywords: ["goal", "future", "career", "growth", "achieve"] },
  { question: "What is teamwork?", keywords: ["team", "work", "together", "collaboration", "support"] },
  { question: "What is problem-solving?", keywords: ["problem", "solve", "logic", "approach", "solution"] },
  { question: "What is time management?", keywords: ["time", "manage", "plan", "schedule", "task"] },
  { question: "Why do you want to become a software developer?", keywords: ["developer", "interest", "learn", "build", "career", "passion"] }
];

// ===== Scoring Engine =====
const COMMON_KEYWORDS = ["work","learn","use","build","create","experience","help","team","project","time"];

function cleanText(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function detectNegative(answer) {
  const negatives = [
    "i dont know",
    "i don't know",
    "dont know",
    "no idea",
    "not sure",
    "i guess",
    "maybe",
    "i am not sure",
    "not really know",
    "no knowledge"
  ];

  return negatives.some(phrase => answer.includes(phrase));
}

function lengthScore(answer) {
  const words = answer.split(/\s+/).filter(Boolean).length;
  if (words < 5)  return 0;
  if (words < 15) return 3;
  if (words < 30) return 6;
  return 10;
}

function keywordScore(answer, keywords) {
  let score = 0;
  const allKeywords = [...keywords, ...COMMON_KEYWORDS];
  allKeywords.forEach(word => { if (answer.includes(word)) score += 1.5; });
  return Math.min(score, 10);
}

const TELL_ME_ABOUT_YOURSELF_QUESTION = {
  question: "Tell me about yourself.",
  keywords: ["name","background","education","skills","experience","project","learn","goal","career","interest","work","developer","study","college","student","course","basic","knowledge","training","practice","build","future"]
};

function scoreTellMeAboutYourself(answer) {
  const clean = answer.toLowerCase();

  // ❌ Step 1: Negative check (hard fail)
  const negatives = ["i dont know", "i don't know", "no idea", "not sure"];
  if (negatives.some(n => clean.includes(n))) {
    return { score: 0, feedback: "You should confidently introduce yourself." };
  }

  let score = 0;

  // ✅ Step 2: Section-based scoring
  if (clean.includes("my name") || clean.includes("i am") || clean.includes("currently") || clean.includes("pursuing")) score += 2;
  if (clean.includes("education") || clean.includes("student") || clean.includes("college") || clean.includes("study")) score += 2;
  if (clean.includes("skill") || clean.includes("technology") || clean.includes("java") || clean.includes("javascript") || clean.includes("react")) score += 2;
  if (clean.includes("project") || clean.includes("experience") || clean.includes("built") || clean.includes("developed")) score += 2;
  if (clean.includes("goal") || clean.includes("career") || clean.includes("future")) score += 2;

  // 📏 Step 3: Length bonus
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  if (wordCount > 30) score += 1;
  if (wordCount > 60) score += 1;

  // ⚠️ Step 4: Weak words penalty
  const weakWords = ["maybe", "i guess", "not sure", "probably"];
  if (weakWords.some(w => clean.includes(w))) score -= 2;

  // 🏆 Final score limit
  score = Math.max(0, Math.min(10, score));

  let feedback = "";
  if (score <= 3) feedback = "Very weak introduction.";
  else if (score <= 6) feedback = "Good but missing some details.";
  else if (score <= 8) feedback = "Strong answer.";
  else feedback = "Excellent introduction!";

  return { score, feedback };
}

function generateFeedback(score) {
  if (score <= 3) return "Poor answer. Try to explain your point more clearly with examples.";
  if (score <= 6) return "Average answer. Add more details and specific examples.";
  if (score <= 8) return "Good answer! A bit more depth would make it excellent.";
  return "Excellent answer! Well-structured and detailed.";
}

function scoreAnswer(answer, questionObj) {
  if (questionObj.question === TELL_ME_ABOUT_YOURSELF_QUESTION.question) {
    return scoreTellMeAboutYourself(answer);
  }

  const cleanAnswer = cleanText(answer);

  // 🚫 Hard fail
  if (!cleanAnswer || detectNegative(cleanAnswer)) {
    return {
      score: 0,
      feedback: "You should try to answer instead of saying you don't know."
    };
  }

  const k = keywordScore(cleanAnswer, questionObj.keywords);
  const l = lengthScore(cleanAnswer);

  let score = (k * 0.6) + (l * 0.4);

  // 🔥 Smart Detection (Hesitation penalty)
  const weakWords = ["maybe", "i think", "probably"];
  if (weakWords.some(w => cleanAnswer.includes(w))) {
    score -= 1; // small penalty
  }

  score = Math.min(10, Math.max(0, Math.round(score)));

  return {
    score,
    feedback: generateFeedback(score)
  };
}

function pickRandomQuestions(count = 5) {
  const MAX_HISTORY = 64; // Keep track of the last 64 asked questions

  let history = [];
  try {
    history = JSON.parse(localStorage.getItem('aiInterviewHistory')) || [];
  } catch (e) {
    history = [];
  }

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  // Filter out recent questions
  let availableTech = TECHNICAL_QUESTIONS.filter(q => !history.includes(q.question));
  let availableBehav = BEHAVIORAL_QUESTIONS.filter(q => !history.includes(q.question));

  // Determine dynamic mix ratio based on question bank sizes, minus 1 for the fixed question
  const dynamicCount = count > 1 ? count - 1 : 0;
  const totalBankSize = TECHNICAL_QUESTIONS.length + BEHAVIORAL_QUESTIONS.length;
  const techRatio = TECHNICAL_QUESTIONS.length / totalBankSize;
  const techCount = Math.round(dynamicCount * techRatio);
  const behavCount = dynamicCount - techCount;

  // Fallback to all questions if not enough unique questions left
  if (availableTech.length < techCount) availableTech = TECHNICAL_QUESTIONS;
  if (availableBehav.length < behavCount) availableBehav = BEHAVIORAL_QUESTIONS;

  const tech = shuffle(availableTech).slice(0, techCount);
  const behav = shuffle(availableBehav).slice(0, behavCount);
  
  // Question 1 is always 'Tell me about yourself', rest is shuffled
  const selected = [TELL_ME_ABOUT_YOURSELF_QUESTION, ...shuffle([...tech, ...behav])];

  // Update history (don't add the fixed question to history so it doesn't break repeating logic)
  const newHistory = [...history, ...selected.slice(1).map(q => q.question)];
  if (newHistory.length > MAX_HISTORY) {
    newHistory.splice(0, newHistory.length - MAX_HISTORY);
  }
  localStorage.setItem('aiInterviewHistory', JSON.stringify(newHistory));

  return selected;
}

// ===== Theme Context =====
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ===== Theme Toggle Button =====
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-500" />
      ) : (
        <Moon className="w-6 h-6 text-gray-600" />
      )}
    </button>
  );
};

// ===== Speech Recognition Component =====
const SpeechRecognitionComponent = ({
  transcript,
  setCurrentAnswer,
  browserSupportsSpeechRecognition,
}) => {
  const [textToCopy, setTextToCopy] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const hasSupport = SpeechRecognition && browserSupportsSpeechRecognition;

  if (!hasSupport) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-6 rounded-lg mb-6">
        <p className="text-red-600 dark:text-red-400">
          Speech recognition is not supported in this browser. Please use Chrome or Edge for speech features.
        </p>
      </div>
    );
  }

  const startListening = () => {
    try {
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setCurrentAnswer(prev => prev + " " + finalTranscript);
            setTextToCopy(prev => prev + " " + finalTranscript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };
      }

      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const clearText = () => {
    setCurrentAnswer("");
    setTextToCopy("");
  };

  return (
    <div className="bg-white dark:bg-gray-800/60 border border-purple-200 dark:border-purple-700/50 rounded-2xl mb-6 overflow-hidden shadow-lg">

      {/* Injected keyframe styles */}
      <style>{`
        @keyframes orb-ripple {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(139,92,246,0.5); }
          50%       { transform: scale(1.07); box-shadow: 0 0 0 16px rgba(139,92,246,0); }
        }
        @keyframes orb-wave-bar {
          0%, 100% { height: 6px;  }
          50%       { height: 28px; }
        }
        .orb-ripple-ring {
          position: absolute; inset: 0;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%);
          animation: orb-ripple 1.8s ease-out infinite;
          pointer-events: none;
        }
        .orb-ripple-ring:nth-child(2) { animation-delay: 0.55s; }
        .orb-ripple-ring:nth-child(3) { animation-delay: 1.1s;  }
        .orb-listening {
          animation: orb-pulse 1.4s ease-in-out infinite;
        }
        .orb-wave-bar {
          width: 4px; border-radius: 9999px;
          background: white;
          animation: orb-wave-bar 0.6s ease-in-out infinite alternate;
        }
        .orb-wave-bar:nth-child(2) { animation-delay: 0.1s; height: 18px; }
        .orb-wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .orb-wave-bar:nth-child(4) { animation-delay: 0.3s; height: 20px; }
        .orb-wave-bar:nth-child(5) { animation-delay: 0.15s; }
      `}</style>

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 dark:border-purple-800/40">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-purple-500" />
          <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm tracking-wide">
            Speech-to-Text
          </span>
        </div>
        {isListening && (
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase">Live</span>
          </div>
        )}
      </div>

      {/* Orb + transcript area */}
      <div className="flex flex-col items-center px-6 py-8 gap-6">

        {/* ===== VOICE ORB ===== */}
        <div className="relative flex items-center justify-center w-36 h-36">
          {isListening && (
            <>
              <div className="orb-ripple-ring" />
              <div className="orb-ripple-ring" />
              <div className="orb-ripple-ring" />
            </>
          )}
          <button
            id="voice-orb-btn"
            onClick={isListening ? stopListening : startListening}
            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50
              ${isListening
                ? "bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 orb-listening shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                : "bg-gradient-to-br from-purple-400 via-purple-600 to-indigo-700 hover:scale-105 shadow-[0_8px_30px_rgba(109,40,217,0.4)] dark:shadow-[0_8px_40px_rgba(139,92,246,0.35)]"
              }`}
            title={isListening ? "Click to stop" : "Click to start speaking"}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <div className="absolute top-3 left-4 w-8 h-4 bg-white/20 rounded-full blur-sm pointer-events-none" />
            {isListening ? (
              <div className="flex items-end gap-[3px] h-8">
                <div className="orb-wave-bar" style={{ height: '12px' }} />
                <div className="orb-wave-bar" />
                <div className="orb-wave-bar" style={{ height: '22px' }} />
                <div className="orb-wave-bar" />
                <div className="orb-wave-bar" style={{ height: '14px' }} />
              </div>
            ) : (
              <Mic className="w-10 h-10 text-white drop-shadow-md" />
            )}
          </button>
        </div>

        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 -mt-2">
          {isListening ? "Tap orb to stop · Speaking..." : "Tap orb to start speaking"}
        </p>


        {/* Transcript — only show when there is actual spoken text */}
        {(transcript || textToCopy) && (
          <div className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-purple-200 dark:border-purple-700/40 px-4 py-3">
            <p className="text-xs text-purple-500 dark:text-purple-400 font-medium mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Captured:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {transcript || textToCopy}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 w-full justify-center flex-wrap">
          <button
            id="speech-clear-btn"
            onClick={clearText}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            id="speech-stop-btn"
            onClick={stopListening}
            disabled={!isListening}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-red-200 dark:border-red-700/50"
          >
            <MicOff className="w-4 h-4" />
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== Section Header Component =====
const InterviewHeader = () => (
  <header className="mt-20 text-center mb-8">
    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
      AI Interview Assistant
    </h1>
    <p className="text-gray-600 dark:text-gray-300">
      Master your interviews with AI-powered practice sessions
    </p>
  </header>
);


// ===== Progress Bar Component =====
const ProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Upload Resume" },
    { number: 2, label: "Analysis" },
    { number: 3, label: "Interview" },
    { number: 4, label: "Feedback" },
    { number: 5, label: "Schedule" },
  ];
return (
  <div className="flex flex-col items-center mb-8">
    <Header />
    <InterviewHeader />

    {/* Steps block stays horizontal */}
    <div className="flex items-center space-x-4 overflow-x-auto mt-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors
                ${currentStep >= step.number
                  ? "bg-purple-600 text-white"
                  : "bg-gray-300 dark:bg-gray-600 border-1 border-purple-500 text-gray-800 dark:text-gray-200"
                }`}
            >
              {step.number}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-2" />
          )}
        </div>
      ))}
    </div>
  </div>
);
};

// ===== Resume Loading Animation Component =====
const ResumeLoadingOverlay = ({ fileName }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const loadingSteps = [
    { label: "Reading document structure...", icon: "📄" },
    { label: "Extracting skills & experience...", icon: "🔍" },
    { label: "Running AI keyword analysis...", icon: "🧠" },
    { label: "Building your interview profile...", icon: "✨" },
  ];

  useEffect(() => {
    // Cycle through step labels — no rapid setState on every tick
    const stepInterval = setInterval(() => {
      setCurrentStepIdx(prev => Math.min(prev + 1, loadingSteps.length - 1));
    }, 550);
    return () => clearInterval(stepInterval);
  }, []);

  return (
    <div className="resume-loading-overlay flex flex-col items-center py-8 px-4">
      {/* Animated document icon */}
      <div className="relative mb-6">
        <div className="w-24 h-28 bg-gradient-to-b from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-xl border-2 border-purple-300 dark:border-purple-600 flex flex-col items-center justify-start pt-3 overflow-hidden shadow-lg" style={{ position: 'relative' }}>
          {/* Fold corner */}
          <div className="absolute top-0 right-0 w-0 h-0"
            style={{ borderLeft: '14px solid transparent', borderBottom: '14px solid #a78bfa' }}>
          </div>
          {/* Scan line — uses transform:translateY now (GPU composited) */}
          <div className="resume-scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-80" />
          {/* Lines */}
          <div className="w-14 h-1.5 bg-purple-300 dark:bg-purple-600 rounded mb-2 mt-4" />
          <div className="w-12 h-1 bg-purple-200 dark:bg-purple-700 rounded mb-1.5" />
          <div className="w-14 h-1 bg-purple-200 dark:bg-purple-700 rounded mb-1.5" />
          <div className="w-10 h-1 bg-purple-200 dark:bg-purple-700 rounded mb-1.5" />
          <div className="w-14 h-1 bg-purple-200 dark:bg-purple-700 rounded" />
        </div>
        {/* Spinning ring */}
        <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" style={{ willChange: 'transform' }} />
      </div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">Analysing Your Resume</h2>
      {fileName && (
        <p className="text-sm text-purple-600 dark:text-purple-400 mb-5 truncate max-w-xs font-medium">{fileName}</p>
      )}

      {/* Progress bar — pure CSS animation, no JS state */}
      <div className="w-full max-w-sm mb-5">
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600" style={{ position: 'relative' }}>
          <div
            className="resume-loading-bar h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #8b5cf6, #a78bfa)', position: 'relative' }}
          />
        </div>
      </div>

      {/* Step list */}
      <div className="w-full max-w-sm space-y-2 mb-6">
        {loadingSteps.map((step, idx) => (
          <div
            key={idx}
            className={`resume-step-item flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-300 ${
              idx < currentStepIdx
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                : idx === currentStepIdx
                ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-600 shadow-sm'
                : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 opacity-40'
            }`}
            style={{ animationDelay: `${idx * 0.12}s` }}
          >
            <span className="text-lg">{step.icon}</span>
            <span className={`text-sm font-medium ${
              idx < currentStepIdx ? 'text-green-700 dark:text-green-300 line-through' :
              idx === currentStepIdx ? 'text-purple-700 dark:text-purple-300' :
              'text-gray-500 dark:text-gray-400'
            }`}>{step.label}</span>
            {idx < currentStepIdx && (
              <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
            )}
            {idx === currentStepIdx && (
              <div className="ml-auto flex gap-1 flex-shrink-0">
                <span className="resume-dot w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="resume-dot w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="resume-dot w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 italic">This usually takes just a moment...</p>
    </div>
  );
};

// ===== Questions Loading Animation Component =====
const QuestionsLoadingOverlay = () => {
  return (
    <div className="resume-loading-overlay flex flex-col items-center py-10 px-4">
      {/* Brain Icon with pulse */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center shadow-lg border-2 border-indigo-300 dark:border-indigo-600 relative z-10 animate-pulse">
          <Brain className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        {/* Ripples */}
        <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 animate-ping" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Generating Questions</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
        Our AI is analyzing your profile to formulate the most relevant technical and behavioral questions...
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-sm mb-8">
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600" style={{ position: 'relative' }}>
          <div
            className="resume-loading-bar h-full rounded-full"
            style={{ 
              background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #a78bfa)', 
              position: 'relative',
              animationDuration: '2.5s'
            }}
          />
        </div>
      </div>
      
      {/* Floating question cards effect */}
      <div className="flex gap-4 overflow-hidden justify-center opacity-90 h-24 items-end">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="w-16 h-20 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col p-2 space-y-2 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1.2s' }}
          >
            <div className="w-full h-2 bg-indigo-200 dark:bg-indigo-800 rounded" />
            <div className="w-3/4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== Resume Upload Component =====
const ResumeUpload = ({
  fileInputRef,
  setResumeFile,
  setResumeAnalysis,
  setCurrentStep,
  loading,
  setLoading,
}) => {
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setUploadedFileName(file.name);
    setLoading(true);

    // Simulate resume analysis
    setTimeout(() => {
      const mockAnalysis = {
        summary: "Experienced software developer with 5+ years in full-stack development",
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS"],
        experience: "5+ years",
        strengths: [
          "Technical leadership",
          "Problem-solving",
          "Team collaboration",
        ],
        suggestions: [
          "Highlight specific project outcomes",
          "Add more quantifiable metrics",
        ],
      };

      setResumeAnalysis(mockAnalysis);
      setCurrentStep(2);
      setLoading(false);
    }, 2200);
  };

  if (loading) {
    return <ResumeLoadingOverlay fileName={uploadedFileName} />;
  }

  return (
    <div className="text-center">
      {/* Upload icon with hover animation */}
      <div className="relative inline-block mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-full flex items-center justify-center shadow-md border-2 border-purple-200 dark:border-purple-700 transition-transform duration-300 hover:scale-105">
          <Upload className="w-9 h-9 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">Upload Your Resume</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-7 max-w-sm mx-auto leading-relaxed">
        Upload your resume to get personalized interview questions tailored to your background
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleResumeUpload}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-3.5 rounded-xl shadow-md hover:shadow-purple-200 dark:hover:shadow-purple-900/40 transition-all duration-300 flex items-center mx-auto font-semibold text-sm tracking-wide"
      >
        <Upload className="w-5 h-5 mr-2" />
        Choose Resume File
      </button>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
        Supported: PDF, DOC, DOCX, TXT
      </p>
    </div>
  );
};

// ===== Resume Analysis Component =====
const ResumeAnalysis = ({ resumeAnalysis, generateQuestions, loading }) => {
  if (loading) return <QuestionsLoadingOverlay />;

  return (
  <div className="max-w-3xl mx-auto">
    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border dark:border-green-700 mb-8 text-center pt-8">
      <div className="mx-auto bg-green-100 dark:bg-green-800 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-sm border border-green-200 dark:border-green-700">
        <span className="text-4xl">🚀</span>
      </div>
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
        Resume Analysis Completed Successfully
      </h2>
      <p className="text-green-700 dark:text-green-400 max-w-xl mx-auto leading-relaxed">
        Your resume has been analyzed by our AI engine. Based on your skills, experience, and profile, we are now preparing a personalized interview session for you.
      </p>
    </div>

    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 mb-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-purple-800 dark:text-purple-400 flex items-center">
        <span className="text-2xl mr-3">🧠</span> What happens next?
      </h3>
      <ul className="space-y-4 text-gray-700 dark:text-gray-300 ml-2">
        <li className="flex items-start">
          <span className="text-purple-500 mr-3 mt-1 font-bold">•</span>
          <span>You will be asked AI-generated interview questions built from our comprehensive question bank</span>
        </li>
        <li className="flex items-start">
          <span className="text-purple-500 mr-3 mt-1 font-bold">•</span>
          <span>Questions will be a mix of technical concepts and behavioral scenarios tailored to typical roles</span>
        </li>
        <li className="flex items-start">
          <span className="text-purple-500 mr-3 mt-1 font-bold">•</span>
          <span>Difficulty will adapt based on your responses, testing depth and breadth of knowledge</span>
        </li>
      </ul>
    </div>

    <div className="mb-8">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border dark:border-blue-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-blue-800 dark:text-blue-300 flex items-center">
          <span className="text-xl mr-2">🎯</span> Interview Guidelines:
        </h3>
        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> Answer honestly based on your own knowledge</li>
          <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> Do not switch tabs or use external help</li>
          <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> Ensure a stable internet connection</li>
          <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> Complete the interview in one session</li>
        </ul>
      </div>
    </div>

    <div className="text-center">
      <button
        onClick={generateQuestions}
        className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center mx-auto"
      >
        <Brain className="w-5 h-5 mr-2" />
        Generate Interview Questions
      </button>
    </div>
  </div>
);
};

// ===== Interview Session Component =====
const InterviewSession = ({
  questions,
  currentQuestionIndex,
  currentAnswer,
  setCurrentAnswer,
  transcript,
  nextQuestion,
  resetInterview,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Bot className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mock Interview Session</h2>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Current Question Display */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 rounded-lg mb-6 border-l-4 border-purple-600 dark:border-purple-400">
        <div className="flex items-start">
          <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">
              Interview Question {currentQuestionIndex + 1}:
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
              {questions[currentQuestionIndex]?.question}
            </p>
          </div>
        </div>
      </div>

      {/* Speech Recognition Interface */}
      <SpeechRecognitionComponent
        transcript={transcript}
        setCurrentAnswer={setCurrentAnswer}
        browserSupportsSpeechRecognition={true}
      />

      {/* Answer Input */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <User className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <label className="block text-lg font-medium text-gray-800 dark:text-gray-200">Your Answer:</label>
        </div>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Your answer will appear here as you speak, or you can type it manually..."
          className="w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-32 resize-vertical bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          rows={6}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={resetInterview}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Over
        </button>
        <button
          onClick={nextQuestion}
          disabled={!currentAnswer.trim()}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center"
        >
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Interview
            </>
          ) : (
            <>
              Next Question
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ===== Feedback Component =====
const Feedback = ({ feedback, loading, resetInterview, scheduleNext }) => {
  return (
 
    <div>
      
      {loading ? (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            Analyzing Your Performance
          </h2>
          <p className="text-gray-600 dark:text-gray-300">AI is evaluating your responses...</p>
        </div>
      ) : (
        feedback && (
          <>
            <div className="flex items-center mb-6">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Interview Results & Feedback
              </h2>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-r from-green-50 to-purple-50 dark:from-green-900/30 dark:to-purple-900/30 p-6 rounded-lg mb-6 border dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Overall Score
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Based on content, clarity, and structure
                  </p>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {feedback.overallScore}/10
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border dark:border-green-700">
                <h3 className="font-bold text-lg mb-3 text-green-800 dark:text-green-300 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Strengths
                </h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border dark:border-orange-700">
                <h3 className="font-bold text-lg mb-3 text-orange-800 dark:text-orange-300 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-600 dark:text-orange-400 mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question-by-Question Feedback */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8 border dark:border-gray-600">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
                Question-by-Question Analysis
              </h3>
              <div className="space-y-4">
                {feedback.questionFeedback.map((qf, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      Q{index + 1}: {qf.question}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-purple-600 dark:text-purple-400">Score: </span>
                        <span className={`font-bold text-lg ${
                          qf.score >= 7 ? 'text-green-600 dark:text-green-400' :
                          qf.score >= 5 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>{qf.score}/10</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          {qf.score >= 7 ? '✅ Good' : qf.score >= 5 ? '⚠️ Average' : '❌ Needs Work'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{qf.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={resetInterview}
                className="flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Practice Again
              </button>
              <button
                onClick={scheduleNext}
                className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Next Session
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
};

// ===== Calendar Scheduling Component =====
const CalendarScheduling = ({
  calendarEvents,
  setCalendarEvents,
  resetInterview,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionTitle, setSessionTitle] = useState("AI Interview Practice Session");

  // Generate unique ID for events
  const generateEventId = () => {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Schedule Interview locally
  const scheduleInterview = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }

    const eventDate = new Date(`${selectedDate}T${selectedTime}`);
    if (eventDate <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    const newEvent = {
      id: generateEventId(),
      title: sessionTitle,
      date: selectedDate,
      time: selectedTime,
      dateTime: eventDate.toISOString(),
      source: "local",
      description: "Scheduled via AI Interview Assistant - Practice your interview skills",
    };

    setCalendarEvents([...calendarEvents, newEvent]);
    setSelectedDate("");
    setSelectedTime("");
    setSessionTitle("AI Interview Practice Session");
    alert("✅ Interview session scheduled successfully!");
  };

  // Delete Event
  const handleDeleteEvent = (eventId) => {
    setCalendarEvents(calendarEvents.filter((event) => event.id !== eventId));
    alert("✅ Event deleted successfully!");
  };

  // Export to ICS format
  const exportToICS = (event) => {
    const startDate = new Date(event.dateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Interview Assistant//EN
BEGIN:VEVENT
UID:${event.id}@ai-interview-assistant.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate Google Calendar URL
  const getGoogleCalendarURL = (event) => {
    const startDate = new Date(event.dateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatGoogleDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: event.description,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Schedule Practice Sessions</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Schedule New Session */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border dark:border-purple-700">
          <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <Plus className="w-5 h-5 mr-2" />
            Schedule New Session
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Session Title
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                placeholder="AI Interview Practice Session"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Select Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>

            <button
              onClick={scheduleInterview}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Session
            </button>
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border dark:border-green-700">
          <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800 dark:text-gray-200">
            <CheckCircle className="w-5 h-5 mr-2" />
            Scheduled Sessions ({calendarEvents.length})
          </h3>

          {calendarEvents.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {calendarEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {event.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        📅 {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at ⏰ {event.time}
                      </p>
                      
                      {/* Export Buttons */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => exportToICS(event)}
                          className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition-colors"
                          title="Download .ics file"
                        >
                          📥 Export
                        </button>
                        <a
                          href={getGoogleCalendarURL(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors inline-flex items-center"
                          title="Add to Google Calendar"
                        >
                          📅 Google
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors p-1 ml-2"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No sessions scheduled yet</p>
              <p className="text-sm">
                Schedule your first practice session above
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-600">
        <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <Settings className="w-5 h-5 mr-2" />
          Calendar Integration Help
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">📱 Mobile Devices</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Use the "Export" button to download a calendar file that can be imported into:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• iOS Calendar (iPhone/iPad)</li>
              <li>• Android Calendar</li>
              <li>• Outlook Mobile</li>
              <li>• Any calendar app that supports .ics files</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">💻 Desktop Applications</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Compatible with popular calendar applications:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Microsoft Outlook</li>
              <li>• Apple Calendar (macOS)</li>
              <li>• Thunderbird Calendar</li>
              <li>• Google Calendar (via web)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={resetInterview}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center mx-auto"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start New Interview
        </button>
      </div>
    </div>
  );
};

// ===== Main AI Interview Assistant Component =====
const AIInterviewAssistant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('interviewCalendarEvents')) || []; }
    catch { return []; }
  });

  // ── Daily limit: 5 interview questions per day ──
  const { countToday: interviewCountToday, recordAttempt: recordInterviewAttempt, isLocked: isDailyLocked } = useDailyLimit('interview', 5);

  // Persist calendar events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('interviewCalendarEvents', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // Speech Recognition states
  const [transcript, setTranscript] = useState("");

  const fileInputRef = useRef(null);
  const contentCardRef = useRef(null);

  // Tab-switch detection — only active during live interview session (step 3)
  const { warningCount, showWarning, dismiss: dismissWarning, reset: resetWarning, terminated: sessionTerminated, maxWarnings } = useTabWarning(currentStep === 3);

  // Smooth-scroll to the content card on every step change
  useEffect(() => {
    if (contentCardRef.current) {
      setTimeout(() => {
        contentCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, [currentStep]);

  const generateQuestions = () => {
    setLoading(true);
    // Pick 5 questions: Q1 = 'Tell me about yourself' (fixed), rest random
    setTimeout(() => {
      const selected = pickRandomQuestions(5);
      setQuestions(selected);
      setCurrentStep(3);
      setLoading(false);
    }, 2800);
  };

  const nextQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(updatedAnswers);

    // Record this question attempt in the daily limit + award 5 pts
    recordInterviewAttempt(`q_${currentQuestionIndex}`);
    addScore('interview', 5); // 5 pts per answered interview question

    if (currentQuestionIndex === questions.length - 1) {
      // Interview complete — score all answers using the real scoring engine
      setLoading(true);
      setTimeout(() => {
        const allAnswers = [...updatedAnswers];

        const questionFeedback = questions.map((q, i) => {
          const result = scoreAnswer(allAnswers[i] || "", q);
          return {
            question: q.question,
            score: result.score,
            feedback: result.feedback,
          };
        });

        const totalScore = questionFeedback.reduce((sum, qf) => sum + qf.score, 0);
        const overallScore = +(totalScore / questionFeedback.length).toFixed(1);

        const strongQs = questionFeedback.filter(qf => qf.score >= 7);
        const weakQs   = questionFeedback.filter(qf => qf.score < 5);

        const strengths = strongQs.length > 0
          ? strongQs.slice(0, 3).map(qf => `Strong answer on: "${qf.question.slice(0, 50)}..."`)
          : ["Keep practicing — you can improve with more detail."];

        const improvements = weakQs.length > 0
          ? weakQs.slice(0, 3).map(qf => `Needs improvement: "${qf.question.slice(0, 50)}..."`)
          : ["Great job! Focus on adding metrics and examples to polish answers."];

        setFeedback({ overallScore, strengths, improvements, questionFeedback });
        setCurrentStep(4);
        setLoading(false);
      }, 1500);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
      setTranscript("");
    }
  };

  const resetInterview = () => {
    setCurrentStep(1);
    setResumeFile(null);
    setResumeAnalysis(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer("");
    setFeedback(null);
    setTranscript("");
  };

  const scheduleNext = () => {
    setCurrentStep(5);
  };

  return (
    <ThemeProvider>
      <TabWarningOverlay
        showWarning={showWarning}
        warningCount={warningCount}
        maxWarnings={maxWarnings}
        terminated={sessionTerminated}
        onDismiss={dismissWarning}
        onTerminate={() => { resetWarning(); setCurrentStep(4); }}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
        <ThemeToggle />
        <div className="max-w-6xl mx-auto">
      
          <ProgressBar currentStep={currentStep} />

          {/* ── Daily lock screen — shown once 5 questions are answered ── */}
          {isDailyLocked && currentStep !== 4 && currentStep !== 5 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-2xl p-10 border dark:border-gray-700 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner">
                  <span className="text-5xl">🔒</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Daily Limit Reached</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  You have completed today's <strong className="text-purple-600 dark:text-purple-400">5 interview questions</strong>.
                  Great work! Come back tomorrow morning for a fresh session.
                </p>
                <div className="flex items-center gap-2 mt-2 px-5 py-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Resets at 12:01 AM tonight</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Next Session
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div ref={contentCardRef} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-2xl p-8 border dark:border-gray-700 transition-colors duration-300">
              {currentStep === 1 && (
                <ResumeUpload
                  fileInputRef={fileInputRef}
                  setResumeFile={setResumeFile}
                  setResumeAnalysis={setResumeAnalysis}
                  setCurrentStep={setCurrentStep}
                  loading={loading}
                  setLoading={setLoading}
                />
              )}
              {currentStep === 2 && resumeAnalysis && (
                <ResumeAnalysis
                  resumeAnalysis={resumeAnalysis}
                  generateQuestions={generateQuestions}
                  loading={loading}
                />
              )}
              {currentStep === 3 && (
                <>
                  {/* Daily progress pill */}
                  <div className="flex items-center justify-end mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 text-xs font-semibold text-purple-700 dark:text-purple-300">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.min(interviewCountToday, 5)} / 5 questions answered today
                    </div>
                  </div>
                  <InterviewSession
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    currentAnswer={currentAnswer}
                    setCurrentAnswer={setCurrentAnswer}
                    transcript={transcript}
                    nextQuestion={nextQuestion}
                    resetInterview={resetInterview}
                  />
                </>
              )}
              {currentStep === 4 && (
                <Feedback
                  feedback={feedback}
                  loading={loading}
                  resetInterview={resetInterview}
                  scheduleNext={scheduleNext}
                />
              )}
              {currentStep === 5 && (
                <CalendarScheduling
                  calendarEvents={calendarEvents}
                  setCalendarEvents={setCalendarEvents}
                  resetInterview={resetInterview}
                />
              )}
            </div>
          )}
        </div>
      </div>
       <Footer />
    </ThemeProvider>
  );
};


export default AIInterviewAssistant;