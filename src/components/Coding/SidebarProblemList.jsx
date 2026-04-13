import React from "react";
import { CheckCircle, Clock, Trophy, Star } from "lucide-react";

const SidebarProblemList = ({
  problems,
  filteredProblems,
  selectedProblem,
  setSelectedProblem,
  userProgress,
  searchTerm,
  setSearchTerm,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategory,
  setSelectedCategory,
  categories,
  difficulties,
}) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span role="img" aria-label="code">💻</span>
          </div>
          <div>
            <h1 className="text-xl dark:text-white font-bold">Code Practice</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sharpen your skills</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Problems Solved */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">{userProgress.ranking || "—"}</span>
            </div>
            <p className="text-2xl font-extrabold">{userProgress.totalSolved ?? 0}</p>
            <p className="text-xs opacity-90">Problems Solved</p>
          </div>

          {/* Points */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-3 text-white">
            <div className="flex items-center justify-between mb-1">
              <Star className="w-4 h-4" />
              <span className="text-xs font-medium">5 pts each</span>
            </div>
            <p className="text-2xl font-extrabold">{userProgress.points ?? 0}</p>
            <p className="text-xs opacity-90">Total Points</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b dark:border-gray-700 flex-shrink-0">
        <div className="relative mb-3">
          <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
          >
            {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Problem count */}
      <div className="px-4 py-2 border-b dark:border-gray-700 flex-shrink-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredProblems.length}</span> of{" "}
          <span className="font-semibold">{problems.length}</span> problems
        </p>
      </div>

      {/* Problem List — scrollable, fills remaining space with min-h-0 and flex-basis-0 to enable flex scroll */}
      <div 
        className="flex-1 overflow-y-auto scroll-smooth overscroll-contain touch-pan-y" 
        style={{ 
          WebkitOverflowScrolling: "touch", 
          flexBasis: 0,
          minHeight: 0
        }}
      >
        {filteredProblems.length === 0 ? (
          <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
            No problems match your search.
          </div>
        ) : (
          filteredProblems.map((problem, idx) => (
            <div
              key={problem.id}
              onClick={() => setSelectedProblem(problem)}
              className={`p-4 border-b dark:border-gray-700 cursor-pointer transition-colors ${
                selectedProblem?.id === problem.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5 flex-shrink-0">
                    #{idx + 1}
                  </span>
                  <h3 className="font-medium text-sm line-clamp-2 dark:text-white leading-snug">
                    {problem.title}
                  </h3>
                </div>
                {problem.solved ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                ) : (
                  <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full flex-shrink-0 ml-2 mt-0.5" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className={`px-2 py-0.5 rounded-full font-bold shadow-sm ${
                  problem.difficulty === "Easy"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}>
                  {problem.difficulty}
                </span>
                <span className="flex items-center gap-1 font-medium bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">
                  <Clock className="w-3 h-3" />
                  {problem.timeSpent || "—"}
                </span>
                {problem.solved && (
                  <span className="flex items-center gap-0.5 text-yellow-500 dark:text-yellow-400 font-extrabold">
                    <Star className="w-3 h-3" /> 5 pts
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarProblemList;
