import React from "react";
import { Play, Save, RotateCcw, Upload, HelpCircle } from "lucide-react";

const CodingActions = ({ runCode, resetCode, saveCode, isRunning, code, runLabel = "Run Code", disabled = false }) => (
  <div className={`bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors flex-shrink-0 ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <button
          id="run-code-btn"
          onClick={runCode}
          disabled={isRunning || !code?.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {runLabel}
            </>
          )}
        </button>

        <button
          id="save-code-btn"
          onClick={saveCode}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        <button
          id="reset-code-btn"
          onClick={resetCode}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
          title="Reset to starter code"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          title="Submit Solution"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          title="Get Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default CodingActions;
