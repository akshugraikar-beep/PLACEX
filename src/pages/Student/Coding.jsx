import React, { useState, useCallback, useEffect, useRef } from "react";
import { addScore } from "../../hooks/useScoring";
import ProblemDescription from "../../components/Coding/ProblemDescription";
import CodingEditor from "../../components/Coding/CodingEditor";
import CodingActions from "../../components/Coding/CodingActions";
import { pythonChallenges } from "../../data/pythonChallenges";
import { useTabWarning } from "../../hooks/useTabWarning";
import TabWarningOverlay from "../../components/TabWarningOverlay";
import {
  CheckCircle, Clock, Trophy, Award, Sun, Moon,
} from "lucide-react";

// ─── Convert the pythonChallenges simple format → full problem format ──────────
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
      {
        input: "(write your code)",
        output: ch.expected_output,
        explanation: `Expected output: ${ch.expected_output}`,
      },
    ],
    constraints: [`Expected output: ${ch.expected_output}`],
    hints: [
      "Think about which Python built-ins can help.",
      "Check the expected output carefully.",
    ],
    starterCode: `# Write your Python solution here\n`,
    expected_output: ch.expected_output,
    answer_code: ch.answer_code,
  };
}

const CONVERTED = pythonChallenges.map((ch) => convertChallenge(ch));

// ─── All problems (15 hardcoded + 50 converted = 65 total) ────────────────────
const ALL_PROBLEMS = [
  {
    id: 1, title: "Hello World", difficulty: "Easy", solved: false,
    likes: 2100, acceptance: 98, category: "Basics", timeSpent: "~2 min",
    description: "Write a Python program that prints 'Hello, World!' to the screen.",
    examples: [{ input: "(none)", output: "Hello, World!", explanation: "Just print the string." }],
    constraints: ["Output must be exactly: Hello, World!"],
    hints: ["Use the print() function.", 'print("Hello, World!")'],
    starterCode: `# Print Hello World\n`,
    expected_output: "Hello, World!",
    answer_code: `print("Hello, World!")`,
  },
  {
    id: 2, title: "Add Two Numbers", difficulty: "Easy", solved: false,
    likes: 1800, acceptance: 95, category: "Basics", timeSpent: "~3 min",
    description: "Write a Python program that adds two numbers a = 10 and b = 5 and prints their sum.",
    examples: [{ input: "a = 10, b = 5", output: "15", explanation: "10 + 5 = 15" }],
    constraints: ["Use variables a and b.", "Print the result."],
    hints: ["Use the + operator.", "a = 10\nb = 5\nprint(a + b)"],
    starterCode: `# Write code here\n`,
    expected_output: "15",
    answer_code: `a = 10\nb = 5\nprint(a + b)`,
  },
  {
    id: 3, title: "Check Even or Odd", difficulty: "Medium", solved: false,
    likes: 1650, acceptance: 92, category: "Conditionals", timeSpent: "~5 min",
    description: "Given n = 4, write a Python program that prints 'Even' if n is even, otherwise prints 'Odd'.",
    examples: [{ input: "n = 4", output: "Even", explanation: "4 % 2 == 0, so it is Even." }],
    constraints: ["n = 4 (hardcoded)", "Print exactly 'Even' or 'Odd'."],
    hints: ["Use the modulo operator %.", "if n % 2 == 0: print('Even')"],
    starterCode: `# Write code here\n`,
    expected_output: "Even",
    answer_code: `n = 4\nprint('Even' if n % 2 == 0 else 'Odd')`,
  },
  {
    id: 4, title: "Find Maximum of Two Numbers", difficulty: "Medium", solved: false,
    likes: 1420, acceptance: 93, category: "Conditionals", timeSpent: "~4 min",
    description: "Given a = 8 and b = 12, print the larger of the two numbers.",
    examples: [{ input: "a = 8, b = 12", output: "12", explanation: "12 > 8, so 12 is printed." }],
    constraints: ["Use variables a = 8 and b = 12.", "Print only the larger number."],
    hints: ["Use max() or an if-else block.", "print(max(a, b))"],
    starterCode: `# Write code here\n`,
    expected_output: "12",
    answer_code: `a = 8\nb = 12\nprint(max(a, b))`,
  },
  {
    id: 5, title: "Reverse a String", difficulty: "Easy", solved: false,
    likes: 1550, acceptance: 90, category: "Strings", timeSpent: "~5 min",
    description: "Given the string s = 'hello', print it reversed.",
    examples: [{ input: "s = 'hello'", output: "olleh", explanation: "Reversed 'hello' is 'olleh'." }],
    constraints: ["s = 'hello' (hardcoded)", "Print the reversed string."],
    hints: ["Use slicing: s[::-1]", "print(s[::-1])"],
    starterCode: `# Write code here\n`,
    expected_output: "olleh",
    answer_code: `s = 'hello'\nprint(s[::-1])`,
  },
  {
    id: 6, title: "Count Characters in String", difficulty: "Easy", solved: false,
    likes: 1300, acceptance: 91, category: "Strings", timeSpent: "~4 min",
    description: "Given s = 'python', print the number of characters in the string.",
    examples: [{ input: "s = 'python'", output: "6", explanation: "python has 6 characters." }],
    constraints: ["s = 'python' (hardcoded)", "Print the length as a number."],
    hints: ["Use the len() function.", "print(len(s))"],
    starterCode: `# Write code here\n`,
    expected_output: "6",
    answer_code: `s = 'python'\nprint(len(s))`,
  },
  {
    id: 7, title: "Check Palindrome", difficulty: "Hard", solved: false,
    likes: 1480, acceptance: 89, category: "Strings", timeSpent: "~6 min",
    description: "Given s = 'madam', print True if it is a palindrome, else print False.",
    examples: [{ input: "s = 'madam'", output: "True", explanation: "madam reversed is still madam." }],
    constraints: ["s = 'madam' (hardcoded)", "Print True or False."],
    hints: ["Compare s with s[::-1].", "print(s == s[::-1])"],
    starterCode: `# Write code here\n`,
    expected_output: "True",
    answer_code: `s = 'madam'\nprint(s == s[::-1])`,
  },
  {
    id: 8, title: "Sum of a List", difficulty: "Medium", solved: false,
    likes: 1200, acceptance: 94, category: "Lists", timeSpent: "~4 min",
    description: "Given nums = [1, 2, 3, 4, 5], print the sum of all elements.",
    examples: [{ input: "nums = [1,2,3,4,5]", output: "15", explanation: "1+2+3+4+5 = 15." }],
    constraints: ["nums = [1, 2, 3, 4, 5] (hardcoded)", "Print the total sum."],
    hints: ["Use the built-in sum() function.", "print(sum(nums))"],
    starterCode: `# Write code here\n`,
    expected_output: "15",
    answer_code: `nums = [1, 2, 3, 4, 5]\nprint(sum(nums))`,
  },
  {
    id: 9, title: "Find Largest in List", difficulty: "Medium", solved: false,
    likes: 1100, acceptance: 93, category: "Lists", timeSpent: "~4 min",
    description: "Given nums = [3, 7, 1, 9, 2], print the largest number in the list.",
    examples: [{ input: "nums = [3,7,1,9,2]", output: "9", explanation: "9 is the maximum value." }],
    constraints: ["nums = [3, 7, 1, 9, 2] (hardcoded)", "Print only the largest number."],
    hints: ["Use the max() function.", "print(max(nums))"],
    starterCode: `# Write code here\n`,
    expected_output: "9",
    answer_code: `nums = [3, 7, 1, 9, 2]\nprint(max(nums))`,
  },
  {
    id: 10, title: "FizzBuzz (1 to 15)", difficulty: "Hard", solved: false,
    likes: 1700, acceptance: 85, category: "Loops", timeSpent: "~8 min",
    description: "Print numbers from 1 to 15. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for multiples of both print 'FizzBuzz'.",
    examples: [{ input: "(none)", output: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz", explanation: "3→Fizz, 5→Buzz, 15→FizzBuzz." }],
    constraints: ["Range: 1 to 15 (inclusive)"],
    hints: ["Use a for loop with range(1, 16).", "Check % 15 first, then % 3, then % 5."],
    starterCode: `# Write code here\n`,
    expected_output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
    answer_code: `for i in range(1, 16):\n    if i % 15 == 0:\n        print('FizzBuzz')\n    elif i % 3 == 0:\n        print('Fizz')\n    elif i % 5 == 0:\n        print('Buzz')\n    else:\n        print(i)`,
  },
  {
    id: 11, title: "Factorial of a Number", difficulty: "Medium", solved: false,
    likes: 1350, acceptance: 88, category: "Loops", timeSpent: "~6 min",
    description: "Given n = 5, calculate and print its factorial. (5! = 120)",
    examples: [{ input: "n = 5", output: "120", explanation: "5! = 5×4×3×2×1 = 120." }],
    constraints: ["n = 5 (hardcoded)", "Print only the result."],
    hints: ["Use a for loop multiplying a result variable.", "Or use math.factorial(n)."],
    starterCode: `# Write code here\n`,
    expected_output: "120",
    answer_code: `n = 5\nresult = 1\nfor i in range(1, n+1):\n    result *= i\nprint(result)`,
  },
  {
    id: 12, title: "Count Vowels in String", difficulty: "Medium", solved: false,
    likes: 1150, acceptance: 87, category: "Strings", timeSpent: "~6 min",
    description: "Given s = 'programming', count and print the number of vowels (a, e, i, o, u).",
    examples: [{ input: "s = 'programming'", output: "3", explanation: "o, a, i are the vowels → 3." }],
    constraints: ["s = 'programming'", "Count only lowercase vowels a, e, i, o, u."],
    hints: ["Loop over each character and check if it is in 'aeiou'.", "Use sum() with a generator expression."],
    starterCode: `# Write code here\n`,
    expected_output: "3",
    answer_code: `s = 'programming'\nprint(sum(1 for c in s if c in 'aeiou'))`,
  },
  {
    id: 13, title: "Print Even Numbers 1-20", difficulty: "Easy", solved: false,
    likes: 1050, acceptance: 96, category: "Loops", timeSpent: "~4 min",
    description: "Print all even numbers from 1 to 20, each on its own line.",
    examples: [{ input: "(none)", output: "2\n4\n6\n8\n10\n12\n14\n16\n18\n20", explanation: "Every second number starting from 2." }],
    constraints: ["Print numbers 2, 4, 6, ... 20, each on a new line."],
    hints: ["Use range(2, 21, 2).", "Or use range(1,21) with an if i%2==0 check."],
    starterCode: `# Write code here\n`,
    expected_output: "2\n4\n6\n8\n10\n12\n14\n16\n18\n20",
    answer_code: `for i in range(2, 21, 2):\n    print(i)`,
  },
  {
    id: 14, title: "Simple Interest Calculator", difficulty: "Medium", solved: false,
    likes: 980, acceptance: 91, category: "Basics", timeSpent: "~5 min",
    description: "Given principal = 1000, rate = 5, time = 2, calculate and print the Simple Interest. Formula: SI = (P × R × T) / 100",
    examples: [{ input: "P=1000, R=5, T=2", output: "100.0", explanation: "(1000 × 5 × 2) / 100 = 100.0" }],
    constraints: ["P=1000, R=5, T=2 (hardcoded)", "Print the result as 100.0"],
    hints: ["SI = (P * R * T) / 100", "print((principal * rate * time) / 100)"],
    starterCode: `# Write code here\n`,
    expected_output: "100.0",
    answer_code: `principal = 1000\nrate = 5\ntime = 2\nprint((principal * rate * time) / 100)`,
  },
  {
    id: 15, title: "Swap Two Variables", difficulty: "Medium", solved: false,
    likes: 1250, acceptance: 94, category: "Basics", timeSpent: "~3 min",
    description: "Given a = 5 and b = 10, swap their values and print them separated by a space. Expected: 10 5",
    examples: [{ input: "a = 5, b = 10", output: "10 5", explanation: "After swap: a=10, b=5." }],
    constraints: ["a = 5, b = 10 (hardcoded)", "Print both values after swapping, separated by space."],
    hints: ["Python allows: a, b = b, a", "print(a, b)"],
    starterCode: `# Write code here\n`,
    expected_output: "10 5",
    answer_code: `a = 5\nb = 10\na, b = b, a\nprint(a, b)`,
  },
  ...CONVERTED,
];

const BATCH_SIZE = 5;
const TOTAL_BATCHES = Math.ceil(ALL_PROBLEMS.length / BATCH_SIZE);

// ─── Get a safe daily batch — wraps around so it never returns empty ───────────
function getDailyBatch() {
  try {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    let startDate = localStorage.getItem("PlaceX_coding_start_date");
    if (!startDate) {
      startDate = todayKey;
      localStorage.setItem("PlaceX_coding_start_date", todayKey);
    }
    const daysDiff = Math.max(0, Math.floor((new Date(todayKey) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
    // Use modulo so it wraps around and NEVER returns empty
    const batchIndex = daysDiff % TOTAL_BATCHES;
    const start = batchIndex * BATCH_SIZE;
    const batch = ALL_PROBLEMS.slice(start, start + BATCH_SIZE);
    // Fallback: if something goes wrong, use first 5
    return batch.length > 0 ? batch : ALL_PROBLEMS.slice(0, BATCH_SIZE);
  } catch {
    return ALL_PROBLEMS.slice(0, BATCH_SIZE);
  }
}

// ─── Python code validator ────────────────────────────────────────────────────
function normalize(str) {
  return str.replace(/\s+/g, " ").trim().toLowerCase();
}

function validatePythonCode(userCode, problem) {
  const uaNoComments = userCode.split("\n").map((l) => l.split("#")[0]).join("\n");
  const parsedUa = normalize(uaNoComments);
  const ea = normalize(problem.answer_code);

  if (parsedUa === ea) return { passed: true, method: "exact" };

  const uTokens = new Set(parsedUa.split(/[\s,()=\[\]"']+/).filter(Boolean));
  const eTokens = ea.split(/[\s,()=\[\]"']+/).filter(Boolean);
  const matches = eTokens.filter((t) => uTokens.has(t)).length;
  const similarity = eTokens.length > 0 ? matches / eTokens.length : 0;

  const eo = normalize(problem.expected_output);
  const containsOutput = parsedUa.includes(eo.toLowerCase());

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
        <div className="absolute inset-0 rounded-full border-4 border-purple-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">🤖</span>
      </div>
      <div className="text-center">
        <p className="font-semibold text-purple-600 text-sm">AI is analysing your answer…</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
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
    <div className="text-center py-12 text-gray-400">
      <div className="text-4xl mb-3">▶️</div>
      <p className="text-sm">Write your solution and click <strong>Submit Answer</strong> to check it.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {result.passed && (
        <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-2xl p-4 text-white flex items-center gap-3 shadow-lg">
          <Trophy className="w-9 h-9 flex-shrink-0" />
          <div>
            <p className="font-extrabold text-lg">+3 XP Earned! 🎉</p>
            <p className="text-sm opacity-90">Problem marked as solved.</p>
          </div>
          <Award className="w-6 h-6 ml-auto opacity-80" />
        </div>
      )}
      <div className={`rounded-2xl p-4 border ${result.passed
        ? "bg-emerald-50 border-emerald-300"
        : "bg-red-50 border-red-300"}`}>
        <div className="flex items-center gap-2 mb-2">
          {result.passed
            ? <CheckCircle className="text-emerald-500 w-5 h-5" />
            : <span className="text-red-500 text-xl">✗</span>}
          <span className={`font-bold text-sm ${result.passed ? "text-emerald-700" : "text-red-700"}`}>
            {result.passed ? "Correct! Well done 🎉" : "Not quite right — try again!"}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Expected output: </span>
          <code className="bg-white border border-gray-200 px-2 py-0.5 rounded text-indigo-600 font-mono text-xs">
            {problem.expected_output}
          </code>
        </div>
      </div>

      {!result.passed && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sample Answer</span>
          </div>
          <pre className="p-4 text-sm font-mono text-gray-800 whitespace-pre-wrap bg-white">
            {problem.answer_code}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Between-Question Card ────────────────────────────────────────────────────
function BetweenCard({ result, problem, onNext, isLast }) {
  const passed = result?.passed;
  return (
    <div className="flex items-center justify-center p-6" style={{ minHeight: "calc(100vh - 200px)" }}>
      <div className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border bg-white border-gray-100">
        <div className={`h-2 w-full ${passed ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-red-400 to-rose-400"}`} />
        <div className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-5xl shadow-lg ${passed ? "bg-emerald-50" : "bg-red-50"}`}>
            {passed ? "✅" : "❌"}
          </div>
          <h2 className={`text-2xl font-extrabold mb-1 ${passed ? "text-emerald-700" : "text-red-600"}`}>
            {passed ? "Correct! 🎉" : "Incorrect!"}
          </h2>
          <p className="text-sm mb-5 text-gray-500">{problem.title}</p>
          {passed && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold mb-5 shadow">
              <Trophy className="w-4 h-4" /> +3 XP Earned
            </div>
          )}
          <div className="rounded-xl p-4 mb-6 text-left border bg-gray-50 border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-gray-500">Expected Output</p>
            <code className="font-mono text-sm text-indigo-600">{problem.expected_output}</code>
            {!passed && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide mt-3 mb-1 text-gray-500">Sample Answer</p>
                <pre className="font-mono text-xs whitespace-pre-wrap text-gray-800">{problem.answer_code}</pre>
              </>
            )}
          </div>
          <button onClick={onNext}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all">
            {isLast ? "🏁 See Results" : "Next Question →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({ batch, answers, totalPoints, onRetry }) {
  const correct = answers.filter((a) => a.passed).length;
  const score = correct * 3;
  const pct = Math.round((correct / batch.length) * 100);
  return (
    <div className="flex items-center justify-center p-6 overflow-y-auto" style={{ minHeight: "calc(100vh - 200px)" }}>
      <div className="w-full max-w-xl py-6">
        <div className="rounded-3xl shadow-2xl overflow-hidden border mb-5 bg-white border-gray-100">
          <div className="h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 w-full" />
          <div className="p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl text-5xl">
              {pct === 100 ? "🏆" : pct >= 60 ? "🎯" : "📚"}
            </div>
            <h2 className="text-3xl font-extrabold mb-1 text-gray-900">Session Complete!</h2>
            <p className="text-sm mb-6 text-gray-500">Here is how you did today</p>
            <div className="flex justify-center gap-4 mb-6">
              {[
                { label: "Correct", value: `${correct}/${batch.length}`, color: "text-purple-600", bg: "bg-purple-50 border border-purple-100" },
                { label: "XP Earned", value: score, color: "text-indigo-600", bg: "bg-indigo-50 border border-indigo-100" },
                { label: "Accuracy", value: `${pct}%`, color: "text-blue-600", bg: "bg-blue-50 border border-blue-100" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`rounded-2xl p-4 min-w-[90px] ${bg}`}>
                  <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-xs font-medium mt-0.5 text-gray-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="w-full rounded-full h-3 mb-4 bg-gray-100">
              <div className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm bg-gray-50 border border-gray-200 text-gray-600">
              <Trophy className="w-4 h-4 text-yellow-500" /> Total XP: {totalPoints} pts
            </div>
          </div>
        </div>

        <div className="rounded-3xl shadow-lg overflow-hidden border bg-white border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-700">Question Breakdown</h3>
          </div>
          {batch.map((prob, idx) => {
            const passed = answers[idx]?.passed;
            return (
              <div key={prob.id} className="flex items-center gap-4 px-6 py-3.5 border-b last:border-0 border-gray-50 hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-gray-800">{prob.title}</p>
                  <p className="text-xs text-gray-400">{prob.difficulty} · {prob.category}</p>
                </div>
                {passed
                  ? <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">+3 XP ✓</span>
                  : <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">0 XP ✗</span>
                }
              </div>
            );
          })}
        </div>
        <button onClick={onRetry}
          className="w-full mt-4 py-3 rounded-2xl font-bold text-sm border transition-all border-gray-200 text-gray-600 hover:bg-gray-50">
          ↩ Practice Again
        </button>
      </div>
    </div>
  );
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────
function DiffBadge({ diff }) {
  const cls =
    diff === "Easy" ? "bg-green-100 text-green-700" :
    diff === "Medium" ? "bg-yellow-100 text-yellow-700" :
    "bg-red-100 text-red-700";
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{diff}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Coding = () => {
  const TIMER_DEFAULT = 3 * 60;

  // Compute daily batch once — wraps with modulo so it NEVER returns empty
  const [dailyBatch] = useState(() => getDailyBatch());

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [phase, setPhase] = useState("start"); // "start" | "coding" | "between" | "results"
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [totalPoints, setTotalPoints] = useState(() =>
    parseInt(localStorage.getItem("PlaceX_coding_points") || "0", 10)
  );
  const [timeLeft, setTimeLeft] = useState(TIMER_DEFAULT);
  const timerRef = useRef(null);

  const currentProblem = dailyBatch[currentQIndex];

  // Tab-switch detection — only active while in coding phase
  const { warningCount, showWarning, dismiss: dismissWarning, reset: resetWarning, terminated: sessionTerminated, maxWarnings } =
    useTabWarning(phase === "coding");

  // Timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_DEFAULT);
    setIsLocked(false);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); setIsLocked(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const timerColor =
    timeLeft > 60 ? "text-emerald-600" :
    timeLeft > 20 ? "text-yellow-500" :
    "text-red-500 animate-pulse";

  // Start the quiz
  const startQuiz = useCallback(() => {
    setAnswers([]);
    setCurrentQIndex(0);
    setCode(dailyBatch[0]?.starterCode || "# Write your Python solution here\n");
    setResult(null);
    setActiveTab("description");
    setIsLocked(false);
    setPhase("coding");
    startTimer();
  }, [dailyBatch, startTimer]);

  // Submit answer
  const handleCheckAnswer = useCallback(async () => {
    if (!currentProblem || !code.trim() || isLocked || isRunning) return;
    setIsRunning(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1500));
    const res = validatePythonCode(code, currentProblem);
    if (res.passed) {
      setTotalPoints((prev) => {
        const n = prev + 3;
        try { localStorage.setItem("PlaceX_coding_points", String(n)); } catch {}
        return n;
      });
      addScore("coding", 3);
      clearInterval(timerRef.current);
      setIsLocked(true);
    }
    setResult(res);
    setIsRunning(false);
    setAnswers((prev) => [...prev, { passed: res.passed }]);
    setPhase("between");
  }, [code, currentProblem, isLocked, isRunning]);

  // Next question
  const handleNext = useCallback(() => {
    const nextIdx = currentQIndex + 1;
    if (nextIdx >= dailyBatch.length) { setPhase("results"); return; }
    setCurrentQIndex(nextIdx);
    const nextP = dailyBatch[nextIdx];
    setCode(nextP.starterCode || "# Write your Python solution here\n");
    setResult(null);
    setActiveTab("description");
    setIsLocked(false);
    setPhase("coding");
    startTimer();
  }, [currentQIndex, dailyBatch, startTimer]);

  const handleRetry = () => { setPhase("start"); setAnswers([]); setCurrentQIndex(0); };

  const handleResetCode = useCallback(() => {
    if (currentProblem) { setCode(currentProblem.starterCode || ""); setResult(null); }
  }, [currentProblem]);

  const handleTerminated = useCallback(() => {
    resetWarning();
    setPhase("results");
  }, [resetWarning]);

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className={`relative transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
      style={{ minHeight: "calc(100vh - 73px)" }}>

      <TabWarningOverlay
        showWarning={showWarning}
        warningCount={warningCount}
        maxWarnings={maxWarnings}
        terminated={sessionTerminated}
        onDismiss={dismissWarning}
        onTerminate={handleTerminated}
      />

      {/* ── START SCREEN ── */}
      {phase === "start" && (
        <div className="flex items-center justify-center p-6"
          style={{ minHeight: "calc(100vh - 73px)" }}>
          <div className="w-full max-w-md">
            {/* Card */}
            <div className={`rounded-3xl shadow-2xl overflow-hidden border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
              <div className="p-8 text-center">
                {/* Icon */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-xl text-5xl">
                  🐍
                </div>
                <h1 className={`text-2xl font-extrabold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Daily Coding Challenge
                </h1>
                <p className={`text-sm mb-7 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {dailyBatch.length} Python questions · 3 min each · 3 XP per correct answer
                </p>

                {/* Question preview grid */}
                <div className="grid grid-cols-5 gap-2 mb-7">
                  {dailyBatch.map((p, i) => (
                    <div key={p.id} className={`rounded-xl p-2.5 border text-center ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                      <div className={`text-xs font-bold mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>Q{i + 1}</div>
                      <DiffBadge diff={p.difficulty} />
                    </div>
                  ))}
                </div>

                {/* XP display */}
                <div className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl mb-6 text-sm ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-indigo-50 border border-indigo-100 text-indigo-700"}`}>
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">Your Total XP: {totalPoints} pts</span>
                </div>

                {/* Start button */}
                <button
                  onClick={startQuiz}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all duration-200">
                  🚀 Start Challenge
                </button>
              </div>
            </div>

            {/* Dark mode toggle */}
            <div className="flex justify-center mt-4">
              <button onClick={() => setIsDarkMode((p) => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CODING SCREEN ── */}
      {phase === "coding" && currentProblem && (
        <div className="flex flex-col" style={{ height: "calc(100vh - 73px)" }}>
          {/* Header bar */}
          <div className={`border-b px-4 pt-3 pb-0 flex-shrink-0 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-indigo-50 text-indigo-600"}`}>
                  Q{currentQIndex + 1} / {dailyBatch.length}
                </span>
                <h2 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {currentProblem.title}
                </h2>
                <DiffBadge diff={currentProblem.difficulty} />
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">🐍 Python</span>
              </div>
              <div className={`flex items-center gap-1.5 font-mono font-bold px-3 py-1.5 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} ${timerColor}`}>
                <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
              </div>
            </div>
            {/* Progress segments */}
            <div className="flex gap-1 mb-0">
              {dailyBatch.map((_, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i < currentQIndex ? "bg-emerald-400" : i === currentQIndex ? "bg-purple-500" : isDarkMode ? "bg-gray-600" : "bg-gray-200"}`} />
              ))}
            </div>
            {/* Tabs */}
            <div className="flex gap-6 mt-1">
              {["description", "results"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Split panel */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Left: problem description / results */}
            <div className={`w-full md:w-1/2 border-r overflow-y-auto p-4 md:p-5 ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200"}`}>
              {activeTab === "description" && !isRunning && <ProblemDescription problem={currentProblem} />}
              {(activeTab === "results" || isRunning) && <ResultPanel result={result} problem={currentProblem} isRunning={isRunning} />}
            </div>
            {/* Right: editor */}
            <div className="w-full md:w-1/2 flex flex-col min-h-[350px] md:min-h-0">
              <div className="flex-1 min-h-0">
                <CodingEditor
                  code={code}
                  onChange={(val) => setCode(val || "")}
                  isDarkMode={isDarkMode}
                  problem={currentProblem}
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
                saveCode={() => {}}
                isRunning={isRunning}
                runLabel="Submit Answer"
                disabled={isLocked}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── BETWEEN CARD ── */}
      {phase === "between" && currentProblem && (
        <BetweenCard
          result={answers[answers.length - 1]}
          problem={currentProblem}
          onNext={handleNext}
          isLast={currentQIndex === dailyBatch.length - 1}
        />
      )}

      {/* ── RESULTS SCREEN ── */}
      {phase === "results" && (
        <ResultsScreen
          batch={dailyBatch}
          answers={answers}
          totalPoints={totalPoints}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

export default Coding;
