/**
 * useScoring — Shared scoring utility for PlaceX
 *
 * Points scheme:
 *   Coding   : 3 pts per solved question   (max 15/day for 5 Qs)
 *   Aptitude : 1 pt  per correct answer    (max 10/quiz × 3 sections = 30/day)
 *   Interview: 5 pts per answered question (max 25/day for 5 Qs)
 *   Max possible total / day: 70 pts
 */

const DAILY_MAX = 70; // 15 coding + 30 aptitude + 25 interview

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Public API ─────────────────────────────────────────────────────────────

/** Add points earned by a module.
 * @param {'coding'|'aptitude'|'interview'} category
 * @param {number} pts  Points to add (positive integer)
 */
export function addScore(category, pts) {
  if (!pts || pts <= 0) return;
  const today = getTodayKey();

  // 1. Cumulative all-time total
  const total = readStorage('PlaceX_score_total', 0);
  writeStorage('PlaceX_score_total', total + pts);

  // 2. Daily bucket
  const dailyKey = `PlaceX_score_daily_${today}`;
  const daily = readStorage(dailyKey, 0);
  writeStorage(dailyKey, daily + pts);

  // 3. Category breakdown (all-time)
  const breakdown = readStorage('PlaceX_score_breakdown', { coding: 0, aptitude: 0, interview: 0 });
  breakdown[category] = (breakdown[category] || 0) + pts;
  writeStorage('PlaceX_score_breakdown', breakdown);

  // 4. Daily category breakdown
  const dailyBreakKey = `PlaceX_score_daily_breakdown_${today}`;
  const dailyBreak = readStorage(dailyBreakKey, { coding: 0, aptitude: 0, interview: 0 });
  dailyBreak[category] = (dailyBreak[category] || 0) + pts;
  writeStorage(dailyBreakKey, dailyBreak);
}

/** Read all score data (no React state — plain object for snapshot reads) */
export function getScoreSnapshot() {
  const today = getTodayKey();
  const dailyKey = `PlaceX_score_daily_${today}`;
  const dailyBreakKey = `PlaceX_score_daily_breakdown_${today}`;

  const totalPoints   = readStorage('PlaceX_score_total', 0);
  const dailyPoints   = readStorage(dailyKey, 0);
  const breakdown     = readStorage('PlaceX_score_breakdown', { coding: 0, aptitude: 0, interview: 0 });
  const dailyBreakdown= readStorage(dailyBreakKey, { coding: 0, aptitude: 0, interview: 0 });

  // Progress % = today's points out of daily max (capped at 100)
  const dailyProgressPct = Math.min(Math.round((dailyPoints / DAILY_MAX) * 100), 100);

  return { totalPoints, dailyPoints, dailyProgressPct, breakdown, dailyBreakdown, DAILY_MAX };
}

export { DAILY_MAX, getTodayKey };
