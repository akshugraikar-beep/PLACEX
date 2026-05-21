import React from "react";
import ReactDOM from "react-dom";
import { AlertTriangle, XCircle, Eye } from "lucide-react";

/**
 * Props:
 *   showWarning  - whether the warning modal is currently visible
 *   warningCount - number of violations so far
 *   maxWarnings  - max before termination
 *   terminated   - session has been terminated
 *   onDismiss    - close warning and resume
 *   onTerminate  - exit the test entirely
 */
const TabWarningOverlay = ({ showWarning, warningCount, maxWarnings = 3, terminated, onDismiss, onTerminate }) => {
  // Only render when there is something to show
  if (!showWarning && !terminated) return null;

  const content = (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 999999 }}
      className="flex items-center justify-center bg-black/75 backdrop-blur-sm"
    >
      <div
        className={`w-full max-w-md mx-4 rounded-3xl shadow-2xl overflow-hidden border ${
          terminated ? "border-red-500" : "border-yellow-400"
        }`}
      >
        {/* Top colour strip */}
        <div className={`h-2 w-full ${terminated ? "bg-red-500" : "bg-gradient-to-r from-yellow-400 to-orange-500"}`} />

        <div className={`p-8 text-center ${terminated ? "bg-red-950" : "bg-gray-900"}`}>
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${terminated ? "bg-red-500/20" : "bg-yellow-400/10"}`}>
            {terminated
              ? <XCircle className="w-10 h-10 text-red-400" />
              : <AlertTriangle className="w-10 h-10 text-yellow-400" />
            }
          </div>

          {terminated ? (
            /* ── TERMINATED STATE ── */
            <>
              <h2 className="text-2xl font-extrabold text-red-400 mb-2">Test Terminated</h2>
              <p className="text-gray-300 text-sm mb-6">
                You switched tabs / left the window{" "}
                <strong className="text-red-400">{maxWarnings} times</strong>.
                Your session has been ended due to suspicious activity.
              </p>
              <button
                type="button"
                onPointerDown={(e) => { e.stopPropagation(); onTerminate(); }}
                className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all cursor-pointer select-none"
              >
                Exit Test
              </button>
            </>
          ) : (
            /* ── WARNING STATE ── */
            <>
              <h2 className="text-2xl font-extrabold text-yellow-400 mb-2">
                ⚠️ Tab Switch Detected!
              </h2>
              <p className="text-gray-300 text-sm mb-2">
                Switching tabs, minimizing, or leaving the window is{" "}
                <strong className="text-yellow-300">not allowed</strong> during the test.
              </p>

              {/* Violation dots */}
              <div className="flex justify-center gap-2 my-5">
                {Array.from({ length: maxWarnings }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      i < warningCount
                        ? "bg-yellow-400 border-yellow-400 text-gray-900"
                        : "bg-transparent border-gray-600 text-gray-500"
                    }`}
                  >
                    {i < warningCount ? "!" : i + 1}
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-400 mb-2">
                Warning <strong className="text-yellow-300">{warningCount}</strong> of {maxWarnings}.{" "}
                {warningCount < maxWarnings
                  ? `${maxWarnings - warningCount} more violation${maxWarnings - warningCount > 1 ? "s" : ""} will terminate the test.`
                  : "This is your last warning!"}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
                <Eye className="w-3.5 h-3.5" /> Your activity is being monitored
              </div>

              <button
                type="button"
                onPointerDown={(e) => { e.stopPropagation(); onDismiss(); }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold transition-all hover:scale-[1.02] cursor-pointer select-none"
              >
                Resume Test
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default TabWarningOverlay;
