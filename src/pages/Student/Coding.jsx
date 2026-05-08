import React, { useState, useCallback, useEffect, useRef } from "react";
import { getTodayKey } from "../../hooks/useDailyLimit";
import { addScore } from "../../hooks/useScoring";
import ResponsiveLayout from "../../components/Coding/ResponsiveLayout";
import SidebarProblemList from "../../components/Coding/SidebarProblemList";
import ProblemDescription from "../../components/Coding/ProblemDescription";
import CodingEditor from "../../components/Coding/CodingEditor";
import CodingActions from "../../components/Coding/CodingActions";
import { pythonChallenges } from "../../data/pythonChallenges";
import {
  Sun, Moon, CheckCircle, Users, TrendingUp, Target, Clock, Flame, Trophy, Award,
} from "lucide-react";

// ─── Convert the 50-question simple format → full problem format ──────────────
function convertChallenge(ch, offset = 100) {
  return {
    id: ch.id + offset,
    title: ch.question,
    difficulty: ch.difficulty || "Easy",
    solved: false,
    likes: 0,
    acceptance: 82,
    category: ch.category,
    timeSpent: "~3 min",
    description: ch.question + ".",
    examples: [
      { input: "(write your code)", output: ch.expected_output, explanation: `Expected output: ${ch.expected_output}` },
    ],
    constraints: [`Expected output: ${ch.expected_output}`],
    hints: ["Think about which Python built-ins can help.", "Check the expected output carefully."],
    starterCode: `# Write your Python solution here\n`,
    expected_output: ch.expected_output,
    answer_code: ch.answer_code,
  };
}

const CONVERTED = pythonChallenges.map(ch => convertChallenge(ch));


// ─── Simple Python Problems ───────────────────────────────────────────────────
const ALL_PROBLEMS = [
  {
    id: 1,
    title: "Hello World",
    difficulty: "Easy",
    solved: false,
    likes: 2100,
    acceptance: 98,
    category: "Basics",
    timeSpent: "~2 min",
    description: "Write a Python program that prints 'Hello, World!' to the screen.",
    examples: [
      { input: "(none)", output: "Hello, World!", explanation: "Just print the string." },
    ],
    constraints: ["Output must be exactly: Hello, World!"],
    hints: ["Use the print() function.", 'print("Hello, World!")'],
    starterCode: `# Print Hello World\n`,
    expected_output: "Hello, World!",
    answer_code: `print("Hello, World!")`,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Easy",
    solved: false,
    likes: 1800,
    acceptance: 95,
    category: "Basics",
    timeSpent: "~3 min",
    description: "Write a Python program that adds two numbers a = 10 and b = 5 and prints their sum.",
    examples: [
      { input: "a = 10, b = 5", output: "15", explanation: "10 + 5 = 15" },
    ],
    constraints: ["Use variables a and b.", "Print the result."],
    hints: ["Use the + operator.", "a = 10\nb = 5\nprint(a + b)"],
    starterCode: `# Write code here\n`,
    expected_output: "15",
    answer_code: `a = 10\nb = 5\nprint(a + b)`,
  },
  {
    id: 3,
    title: "Check Even or Odd",
    difficulty: "Medium",
    solved: false,
    likes: 1650,
    acceptance: 92,
    category: "Conditionals",
    timeSpent: "~5 min",
    description: "Given n = 4, write a Python program that prints 'Even' if n is even, otherwise prints 'Odd'.",
    examples: [
      { input: "n = 4", output: "Even", explanation: "4 % 2 == 0, so it is Even." },
    ],
    constraints: ["n = 4 (hardcoded)", "Print exactly 'Even' or 'Odd'."],
    hints: ["Use the modulo operator %.", "if n % 2 == 0: print('Even')"],
    starterCode: `# Write code here\n`,
    expected_output: "Even",
    answer_code: `n = 4\nprint('Even' if n % 2 == 0 else 'Odd')`,
  },
  {
    id: 4,
    title: "Find Maximum of Two Numbers",
    difficulty: "Medium",
    solved: false,
    likes: 1420,
    acceptance: 93,
    category: "Conditionals",
    timeSpent: "~4 min",
    description: "Given a = 8 and b = 12, print the larger of the two numbers.",
    examples: [
      { input: "a = 8, b = 12", output: "12", explanation: "12 > 8, so 12 is printed." },
    ],
    constraints: ["Use variables a = 8 and b = 12.", "Print only the larger number."],
    hints: ["Use max() or an if-else block.", "print(max(a, b))"],
    starterCode: `# Write code here\n`,
    expected_output: "12",
    answer_code: `a = 8\nb = 12\nprint(max(a, b))`,
  },
  {
    id: 5,
    title: "Reverse a String",
    difficulty: "Easy",
    solved: false,
    likes: 1550,
    acceptance: 90,
    category: "Strings",
    timeSpent: "~5 min",
    description: "Given the string s = 'hello', print it reversed.",
    examples: [
      { input: "s = 'hello'", output: "olleh", explanation: "Reversed 'hello' is 'olleh'." },
    ],
    constraints: ["s = 'hello' (hardcoded)", "Print the reversed string."],
    hints: ["Use slicing: s[::-1]", "print(s[::-1])"],
    starterCode: `# Write code here\n`,
    expected_output: "olleh",
    answer_code: `s = 'hello'\nprint(s[::-1])`,
  },
  {
    id: 6,
    title: "Count Characters in String",
    difficulty: "Easy",
    solved: false,
    likes: 1300,
    acceptance: 91,
    category: "Strings",
    timeSpent: "~4 min",
    description: "Given s = 'python', print the number of characters in the string.",
    examples: [
      { input: "s = 'python'", output: "6", explanation: "python has 6 characters." },
    ],
    constraints: ["s = 'python' (hardcoded)", "Print the length as a number."],
    hints: ["Use the len() function.", "print(len(s))"],
    starterCode: `# Write code here\n`,
    expected_output: "6",
    answer_code: `s = 'python'\nprint(len(s))`,
  },
  {
    id: 7,
    title: "Check Palindrome",
    difficulty: "Hard",
    solved: false,
    likes: 1480,
    acceptance: 89,
    category: "Strings",
    timeSpent: "~6 min",
    description: "Given s = 'madam', print True if it is a palindrome, else print False.",
    examples: [
      { input: "s = 'madam'", output: "True", explanation: "madam reversed is still madam." },
    ],
    constraints: ["s = 'madam' (hardcoded)", "Print True or False."],
    hints: ["Compare s with s[::-1].", "print(s == s[::-1])"],
    starterCode: `# Write code here\n`,
    expected_output: "True",
    answer_code: `s = 'madam'\nprint(s == s[::-1])`,
  },
  {
    id: 8,
    title: "Sum of a List",
    difficulty: "Medium",
    solved: false,
    likes: 1200,
    acceptance: 94,
    category: "Lists",
    timeSpent: "~4 min",
    description: "Given nums = [1, 2, 3, 4, 5], print the sum of all elements.",
    examples: [
      { input: "nums = [1,2,3,4,5]", output: "15", explanation: "1+2+3+4+5 = 15." },
    ],
    constraints: ["nums = [1, 2, 3, 4, 5] (hardcoded)", "Print the total sum."],
    hints: ["Use the built-in sum() function.", "print(sum(nums))"],
    starterCode: `# Write code here\n`,
    expected_output: "15",
    answer_code: `nums = [1, 2, 3, 4, 5]\nprint(sum(nums))`,
  },
  {
    id: 9,
    title: "Find Largest in List",
    difficulty: "Medium",
    solved: false,
    likes: 1100,
    acceptance: 93,
    category: "Lists",
    timeSpent: "~4 min",
    description: "Given nums = [3, 7, 1, 9, 2], print the largest number in the list.",
    examples: [
      { input: "nums = [3,7,1,9,2]", output: "9", explanation: "9 is the maximum value." },
    ],
    constraints: ["nums = [3, 7, 1, 9, 2] (hardcoded)", "Print only the largest number."],
    hints: ["Use the max() function.", "print(max(nums))"],
    starterCode: `# Write code here\n`,
    expected_output: "9",
    answer_code: `nums = [3, 7, 1, 9, 2]\nprint(max(nums))`,
  },
  {
    id: 10,
    title: "FizzBuzz (1 to 15)",
    difficulty: "Hard",
    solved: false,
    likes: 1700,
    acceptance: 85,
    category: "Loops",
    timeSpent: "~8 min",
    description: "Print numbers from 1 to 15. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for multiples of both print 'FizzBuzz'.",
    examples: [
      { input: "(none)", output: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz", explanation: "3→Fizz, 5→Buzz, 15→FizzBuzz." },
    ],
    constraints: ["Range: 1 to 15 (inclusive)", "Print each on a new line or space-separated."],
    hints: ["Use a for loop with range(1, 16).", "Check % 15 first, then % 3, then % 5."],
    starterCode: `# Write code here\n`,
    expected_output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
    answer_code: `for i in range(1, 16):\n    if i % 15 == 0:\n        print('FizzBuzz')\n    elif i % 3 == 0:\n        print('Fizz')\n    elif i % 5 == 0:\n        print('Buzz')\n    else:\n        print(i)`,
  },
  {
    id: 11,
    title: "Factorial of a Number",
    difficulty: "Medium",
    solved: false,
    likes: 1350,
    acceptance: 88,
    category: "Loops",
    timeSpent: "~6 min",
    description: "Given n = 5, calculate and print its factorial. (5! = 120)",
    examples: [
      { input: "n = 5", output: "120", explanation: "5! = 5×4×3×2×1 = 120." },
    ],
    constraints: ["n = 5 (hardcoded)", "Print only the result."],
    hints: ["Use a for loop multiplying a result variable.", "Or use math.factorial(n)."],
    starterCode: `# Write code here\n`,
    expected_output: "120",
    answer_code: `n = 5\nresult = 1\nfor i in range(1, n+1):\n    result *= i\nprint(result)`,
  },
  {
    id: 12,
    title: "Count Vowels in String",
    difficulty: "Medium",
    solved: false,
    likes: 1150,
    acceptance: 87,
    category: "Strings",
    timeSpent: "~6 min",
    description: "Given s = 'programming', count and print the number of vowels (a, e, i, o, u).",
    examples: [
      { input: "s = 'programming'", output: "3", explanation: "o, a, i are the vowels → 3." },
    ],
    constraints: ["s = 'programming'", "Count only lowercase vowels a, e, i, o, u."],
    hints: ["Loop over each character and check if it is in 'aeiou'.", "Use sum() with a generator expression."],
    starterCode: `# Write code here\n`,
    expected_output: "3",
    answer_code: `s = 'programming'\nprint(sum(1 for c in s if c in 'aeiou'))`,
  },
  {
    id: 13,
    title: "Print Even Numbers 1-20",
    difficulty: "Easy",
    solved: false,
    likes: 1050,
    acceptance: 96,
    category: "Loops",
    timeSpent: "~4 min",
    description: "Print all even numbers from 1 to 20, each on its own line.",
    examples: [
      { input: "(none)", output: "2\n4\n6\n8\n10\n12\n14\n16\n18\n20", explanation: "Every second number starting from 2." },
    ],
    constraints: ["Print numbers 2, 4, 6, ... 20, each on a new line."],
    hints: ["Use range(2, 21, 2).", "Or use range(1,21) with an if i%2==0 check."],
    starterCode: `# Write code here\n`,
    expected_output: "2\n4\n6\n8\n10\n12\n14\n16\n18\n20",
    answer_code: `for i in range(2, 21, 2):\n    print(i)`,
  },
  {
    id: 14,
    title: "Simple Interest Calculator",
    difficulty: "Medium",
    solved: false,
    likes: 980,
    acceptance: 91,
    category: "Basics",
    timeSpent: "~5 min",
    description: "Given principal = 1000, rate = 5, time = 2, calculate and print the Simple Interest. Formula: SI = (P × R × T) / 100",
    examples: [
      { input: "P=1000, R=5, T=2", output: "100.0", explanation: "(1000 × 5 × 2) / 100 = 100.0" },
    ],
    constraints: ["P=1000, R=5, T=2 (hardcoded)", "Print the result as 100.0"],
    hints: ["SI = (P * R * T) / 100", "print((principal * rate * time) / 100)"],
    starterCode: `# Write code here\n`,
    expected_output: "100.0",
    answer_code: `principal = 1000\nrate = 5\ntime = 2\nprint((principal * rate * time) / 100)`,
  },
  {
    id: 15,
    title: "Swap Two Variables",
    difficulty: "Medium",
    solved: false,
    likes: 1250,
    acceptance: 94,
    category: "Basics",
    timeSpent: "~3 min",
    description: "Given a = 5 and b = 10, swap their values and print them separated by a space. Expected: 10 5",
    examples: [
      { input: "a = 5, b = 10", output: "10 5", explanation: "After swap: a=10, b=5." },
    ],
    constraints: ["a = 5, b = 10 (hardcoded)", "Print both values after swapping, separated by space."],
    hints: ["Python allows: a, b = b, a", "print(a, b)"],
    starterCode: `# Write code here\n`,
    expected_output: "10 5",
    answer_code: `a = 5\nb = 10\na, b = b, a\nprint(a, b)`,
  },
  // ── 50 Python challenges (auto-converted) ──
  ...CONVERTED,
];


// ─── Python code validator ────────────────────────────────────────────────────
function normalize(str) {
  return str.replace(/\s+/g, " ").trim().toLowerCase();
}

function validatePythonCode(userCode, problem) {
  // Strip comments and normalize user code
  const uaNoComments = userCode.split("\n").map(l => l.split("#")[0]).join("\n");
  const parsedUa = normalize(uaNoComments);
  
  // Normalize answer code (already comments-free usually)
  const ea = normalize(problem.answer_code);

  // 1. Exact logic match (normalized, no comments)
  if (parsedUa === ea) return { passed: true, method: "exact" };

  // 2. Token-based logic check
  const uTokens = new Set(parsedUa.split(/[\s,()=\[\]"']+/).filter(Boolean));
  const eTokens = ea.split(/[\s,()=\[\]"']+/).filter(Boolean);
  
  // Requirement: Must have at least 85% of the logical tokens from the correct answer
  const matches = eTokens.filter(t => uTokens.has(t)).length;
  const similarity = eTokens.length > 0 ? matches / eTokens.length : 0;

  // Additional check: Does it contain the expected result string? (e.g. "Even" or "10")
  const eo = normalize(problem.expected_output);
  const containsOutput = parsedUa.includes(eo.toLowerCase());

  // Strict pass: Must have high similarity AND contain the output string somewhere in the logic
  if (similarity >= 0.85 && containsOutput) {
    return { passed: true, method: "logic-match" };
  }

  return { passed: false, similarity };
}

// ─── AI Analysis Loader ───────────────────────────────────────────────────────
function AnalysingLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">🤖</span>
      </div>
      <div className="text-center">
        <p className="font-semibold text-purple-600 dark:text-purple-400 text-sm">AI is analysing your answer…</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0,1,2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Result Panel ─────────────────────────────────────────────────────────────
function ResultPanel({ result, problem, isRunning }) {
  if (isRunning) return <AnalysingLoader />;

  if (!result) return (
    <div className="text-center py-12 text-gray-400 dark:text-gray-500">
      <div className="text-4xl mb-3">▶️</div>
      <p className="text-sm">Write your solution and click <strong>Run Code</strong> to check it.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Points earned — show first when correct */}
      {result.passed && (
        <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-2xl p-4 text-white flex items-center gap-3 shadow-lg">
          <Trophy className="w-9 h-9 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-lg">+5 XP Earned! 🎉</p>
            <p className="text-sm opacity-90">Problem marked as solved.</p>
          </div>
          <Award className="w-6 h-6 ml-auto opacity-80" />
        </div>
      )}

      {/* Verdict */}
      <div className={`rounded-2xl p-4 border ${
        result.passed
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
          : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {result.passed
            ? <CheckCircle className="text-emerald-500 w-5 h-5" />
            : <span className="text-red-500 text-xl">✗</span>}
          <span className={`font-bold text-sm ${
            result.passed ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
          }`}>
            {result.passed ? "Correct! Well done 🎉" : "Not quite right — try again!"}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600 dark:text-gray-400">Expected output: </span>
          <code className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-300 font-mono text-xs">
            {problem.expected_output}
          </code>
        </div>
      </div>

      {/* Sample answer (show only if wrong) */}
      {!result.passed && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Sample Answer</span>
          </div>
          <pre className="p-4 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap bg-white dark:bg-gray-900">
            {problem.answer_code}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Coding = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Hydrate solved state from localStorage (survives page refresh)
  const [problems, setProblems] = useState(() => {
    try {
      const ids = new Set(JSON.parse(localStorage.getItem("PlaceX_solved_ids") || "[]"));
      return ALL_PROBLEMS.map(p => ({ ...p, solved: ids.has(p.id) }));
    } catch { return ALL_PROBLEMS; }
  });
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [savedCode, setSavedCode] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  // Tracks problems locked this session (solved OR timed-out) so re-clicking card is blocked
  const [timedOutIds, setTimedOutIds] = useState(new Set());
  const selectedProblemRef = useRef(null); // used inside timer callback (avoids stale closure)

  // ── Daily 5-problem batch system ──────────────────────────────────────────
  // Each day shows the next 5 problems. Batch advances the next day.
  const getDailyBatchIndex = () => {
    const today = getTodayKey();
    let startDate = localStorage.getItem('PlaceX_coding_start_date');
    if (!startDate) {
      startDate = today;
      localStorage.setItem('PlaceX_coding_start_date', today);
    }
    const diff = Math.floor(
      (new Date(today) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    return diff; // 0 = day 1 (Q1-5), 1 = day 2 (Q6-10), …
  };

  const batchIndex = getDailyBatchIndex();
  const dailyBatch = ALL_PROBLEMS.slice(batchIndex * 5, batchIndex * 5 + 5);

  // Which of today's 5 have been solved this session (resets on refresh)
  // Session-only: cards unlock on refresh so the student can retry
  const [dailySolvedIds, setDailySolvedIds] = useState(() => new Set());
  const isBatchDone = dailyBatch.every(p => dailySolvedIds.has(p.id));
  // ──────────────────────────────────────────────────────────────────────────

  // Points — 5 per solved question, persisted in localStorage
  const [totalPoints, setTotalPoints] = useState(() =>
    parseInt(localStorage.getItem("PlaceX_coding_points") || "0", 10)
  );

  // Per-problem countdown timer — 3 minutes, locks editor at 0
  const TIMER_DEFAULT = 3 * 60;
  const [timeLeft, setTimeLeft] = useState(TIMER_DEFAULT);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_DEFAULT);
    setIsLocked(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsLocked(true);
          // Permanently lock this problem (timed out)
          if (selectedProblemRef.current !== null) {
            setTimedOutIds(s => new Set([...s, selectedProblemRef.current]));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Stop timer on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const timerColor = timeLeft > 60 ? "text-emerald-500" : timeLeft > 20 ? "text-yellow-500" : "text-red-500 animate-pulse";


  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["All", ...Array.from(new Set(ALL_PROBLEMS.map(p => p.category)))];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filteredProblems = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiff = !selectedDifficulty || selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchCat = !selectedCategory || selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchDiff && matchCat;
  });

  const userProgress = {
    totalSolved: problems.filter(p => p.solved).length,
    ranking: `#${problems.filter(p => p.solved).length + 1}`,
    points: totalPoints,
  };

  const handleSelectProblem = useCallback((problem) => {
    // If already solved today or timed out — show lock screen, never restart
    const alreadyLocked = dailySolvedIds.has(problem.id) || timedOutIds.has(problem.id);
    selectedProblemRef.current = problem.id;
    setSelectedProblem(problem);
    setResult(null);
    setActiveTab("description");
    if (alreadyLocked) {
      clearInterval(timerRef.current);
      setIsLocked(true);
      return;
    }
    const restored = savedCode[problem.id];
    setCode(restored || problem.starterCode || "# Write your Python solution here\n");
    startTimer();
  }, [savedCode, startTimer, dailySolvedIds, timedOutIds]);

  const handleCheckAnswer = useCallback(async () => {
    if (!selectedProblem || !code.trim() || isLocked) return;
    setIsRunning(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 5000));
    const res = validatePythonCode(code, selectedProblem);
    setResult(res);
    if (res.passed) {
      const alreadySolved = problems.find(p => p.id === selectedProblem.id)?.solved;
      if (!alreadySolved) {
        setProblems(prev => {
          const next = prev.map(p => p.id === selectedProblem.id ? { ...p, solved: true } : p);
          try {
            localStorage.setItem("PlaceX_solved_ids", JSON.stringify(next.filter(p => p.solved).map(p => p.id)));
          } catch {}
          return next;
        });
        setTotalPoints(prev => {
          const next = prev + 3;
          localStorage.setItem("PlaceX_coding_points", String(next));
          return next;
        });
        addScore('coding', 3); // 3 pts per solved coding question
        // Lock this problem for the rest of this session (session-only — resets on refresh)
        setDailySolvedIds(prev => {
          const next = new Set(prev);
          next.add(selectedProblem.id);
          return next; // NOT written to localStorage — refresh clears it
        });
        clearInterval(timerRef.current);
        setIsLocked(true); // lock permanently after solving — can't retype
      }
    }
    setIsRunning(false);
    setActiveTab("solutions");

  }, [code, selectedProblem, problems, isLocked]);


  const handleSaveCode = useCallback(() => {
    if (selectedProblem) setSavedCode(prev => ({ ...prev, [selectedProblem.id]: code }));
  }, [selectedProblem, code]);

  const handleResetCode = useCallback(() => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode || "");
      setResult(null);
    }
  }, [selectedProblem]);

  const getDiffBadge = (diff) => {
    if (diff === "Easy") return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
    if (diff === "Medium") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
    return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      {/* ── Theme Toggle ── */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsDarkMode(p => !p)}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* ── Main Layout: Daily Cards (left) + Editor (right) ── */}
      <div className="flex h-screen overflow-hidden">

        {/* ── Left Panel: Today's 5 Problems ── */}
        <div className="w-72 flex-shrink-0 border-r dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b dark:border-gray-700">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Today's Problems</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {dailySolvedIds.size} / 5 solved today
            </p>
            {/* 5-dot progress */}
            <div className="flex gap-1.5 mt-2">
              {dailyBatch.map(p => (
                <div
                  key={p.id}
                  className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                    dailySolvedIds.has(p.id) ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {isBatchDone ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
                <span className="text-4xl mb-3">🎉</span>
                <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">All done for today!</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">New problems at 12:01 AM</p>
              </div>
            ) : (
              dailyBatch.map((problem, idx) => {
                const isSolved = dailySolvedIds.has(problem.id);
                const isSelected = selectedProblem?.id === problem.id;
                return (
                  <button
                    key={problem.id}
                    onClick={() => handleSelectProblem(problem)}
                    className={`w-full text-left rounded-xl border-2 p-3 transition-all duration-200 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : isSolved
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isSolved
                          ? 'bg-emerald-500 text-white'
                          : isSelected
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {isSolved ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{problem.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            problem.difficulty === 'Easy'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                              : problem.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                          }`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-xs text-gray-400">{problem.category}</span>
                        </div>
                      </div>
                      {isSolved && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex-shrink-0">✓</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Points footer */}
          <div className="px-4 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                {totalPoints} XP total
              </span>
              <span>{problems.filter(p => p.solved).length} solved all time</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Editor / Placeholder ── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {selectedProblem ? (
            isLocked ? (
              /* ── Full Question Lock Screen ── */
              <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 h-full">
                <div className="text-center max-w-sm px-6">
                  {selectedProblem.solved ? (
                    <>
                      <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-5 text-5xl shadow-inner">
                        ✅
                      </div>
                      <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Problem Solved!</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-medium">{selectedProblem.title}</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
                        Great job! This question is now locked.<br />Select the next problem from the panel.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mx-auto mb-5 text-5xl shadow-inner">
                        🔒
                      </div>
                      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Time's Up!</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-medium">{selectedProblem.title}</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
                        The 3-minute timer has expired.<br />This question is locked — pick another one.
                      </p>
                    </>
                  )}
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-500 dark:text-gray-400">← Select a problem from the left panel</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Normal: Problem Header + Editor ── */
              <div className="flex flex-col h-full min-h-0">

                {/* Problem Header */}
                <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 pt-4 pb-0">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl font-bold dark:text-white">{selectedProblem.title}</h2>
                      <span className={`px-3 py-0.5 rounded-full text-sm font-medium ${getDiffBadge(selectedProblem.difficulty)}`}>
                        {selectedProblem.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        🐍 Python
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className={`flex items-center gap-1.5 font-mono font-bold text-base px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-700 ${timerColor}`}>
                        <Clock className="w-4 h-4" />
                        {formatTime(timeLeft)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <TrendingUp className="w-4 h-4" />
                        <span>{selectedProblem.acceptance}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    {["description", "solutions"].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-medium capitalize transition-colors border-b-2 ${
                          activeTab === tab
                            ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                            : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700"
                        }`}
                      >
                        {tab === "solutions" ? "Results" : tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Split Panel */}
                <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                  <div className="w-full md:w-1/2 border-r dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-800 p-4 md:p-5 min-h-[280px]">
                    {(activeTab === "description" && !isRunning) && <ProblemDescription problem={selectedProblem} />}
                    {(activeTab === "solutions" || isRunning) && (
                      <ResultPanel result={result} problem={selectedProblem} isRunning={isRunning} />
                    )}
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col min-h-[350px] md:min-h-0">
                    <div className="flex-1 min-h-0">
                      <CodingEditor
                        code={code}
                        onChange={val => setCode(val || "")}
                        isDarkMode={isDarkMode}
                        problem={selectedProblem}
                        language="python"
                        isEditorReady={isEditorReady}
                        onMount={(editor) => {
                          setIsEditorReady(true);
                          editor.addCommand(2048 + 52, () => {});
                          editor.addCommand(256 + 52, () => {});
                        }}
                        heading="Python Editor"
                        readOnly={false}
                      />
                    </div>
                    <CodingActions
                      code={code}
                      runCode={handleCheckAnswer}
                      resetCode={handleResetCode}
                      saveCode={handleSaveCode}
                      isRunning={isRunning}
                      runLabel="Run Code"
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
            )
          ) : (

            /* No problem selected — prompt */
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800">
              <div className="text-center max-w-xs px-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🐍
                </div>
                <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Select a Problem</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Pick one of today's 5 problems from the left panel to start coding.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coding;


