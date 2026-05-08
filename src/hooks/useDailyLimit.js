// src/hooks/useDailyLimit.js
// Shared daily limit hook — stores progress keyed by today's date (YYYY-MM-DD local time)
// When the date changes at midnight the key changes → state auto-resets. No server needed.
import { useState, useCallback } from 'react';

export function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * @param {string} namespace  e.g. 'coding' | 'aptitude' | 'interview'
 * @param {number} limit      how many attempts allowed per day (default 5)
 */
export function useDailyLimit(namespace, limit = 5) {
  const today = getTodayKey();
  const storageKey = `PlaceX_daily_${namespace}_${today}`;

  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{"count":0,"ids":[],"extra":{}}');
    } catch {
      return { count: 0, ids: [], extra: {} };
    }
  });

  const isLocked = data.count >= limit;

  const recordAttempt = useCallback((id, extraPayload = {}) => {
    setData(prev => {
      if (prev.ids.includes(String(id))) return prev;
      const next = {
        count: prev.count + 1,
        ids: [...prev.ids, String(id)],
        extra: { ...prev.extra, ...extraPayload },
      };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [storageKey]);

  const saveExtra = useCallback((extraPayload) => {
    setData(prev => {
      const next = { ...prev, extra: { ...prev.extra, ...extraPayload } };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [storageKey]);

  return {
    countToday: data.count,
    completedIds: data.ids,
    extra: data.extra,
    recordAttempt,
    saveExtra,
    isLocked,
    today,
    limit,
  };
}
