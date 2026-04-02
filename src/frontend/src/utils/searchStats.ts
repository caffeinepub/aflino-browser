const STORAGE_KEY = "aflino_search_stats";
const HISTORY_KEY = "aflino_search_history";

interface SearchStats {
  date: string; // YYYY-MM-DD
  counts: number[]; // 24 elements, one per hour
  lastUpdated: number;
}

interface DailyRecord {
  date: string;
  counts: number[];
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadStats(): SearchStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: SearchStats = JSON.parse(raw);
      if (
        parsed.date === todayStr() &&
        Array.isArray(parsed.counts) &&
        parsed.counts.length === 24
      ) {
        return parsed;
      }
      // Day has changed — archive yesterday before resetting
      if (parsed.date && parsed.date !== todayStr()) {
        archiveDailyRecord(parsed.date, parsed.counts);
      }
    }
  } catch {
    // ignore
  }
  return {
    date: todayStr(),
    counts: new Array(24).fill(0),
    lastUpdated: Date.now(),
  };
}

function saveStats(stats: SearchStats): void {
  stats.lastUpdated = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function archiveDailyRecord(date: string, counts: number[]): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: DailyRecord[] = raw ? JSON.parse(raw) : [];
    const exists = history.find((r) => r.date === date);
    if (!exists) {
      history.push({ date, counts });
      // Keep last 90 days
      const sorted = history.sort((a, b) => a.date.localeCompare(b.date));
      const trimmed = sorted.slice(-90);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    }
  } catch {
    // ignore
  }
}

export function incrementSearchCount(): void {
  const stats = loadStats();
  const hour = new Date().getHours();
  stats.counts[hour] = (stats.counts[hour] || 0) + 1;
  saveStats(stats);
}

export function getSearchStats(): SearchStats {
  return loadStats();
}

export function getTodayTotal(): number {
  const stats = loadStats();
  return stats.counts.reduce((sum, n) => sum + n, 0);
}

export function getLast24HourCounts(): number[] {
  const stats = loadStats();
  const currentHour = new Date().getHours();
  const result: number[] = new Array(24).fill(0);
  for (let i = 0; i < 24; i++) {
    const hourIndex = (currentHour - 23 + i + 24) % 24;
    result[i] = stats.counts[hourIndex] || 0;
  }
  return result;
}

export function getHistoricalRecords(): DailyRecord[] {
  try {
    const today = loadStats();
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: DailyRecord[] = raw ? JSON.parse(raw) : [];
    // Include today
    const existing = history.find((r) => r.date === today.date);
    if (!existing) {
      return [...history, { date: today.date, counts: today.counts }].sort(
        (a, b) => a.date.localeCompare(b.date),
      );
    }
    return history.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function getRecordsInRange(
  startDate: string,
  endDate: string,
): DailyRecord[] {
  const records = getHistoricalRecords();
  return records.filter((r) => r.date >= startDate && r.date <= endDate);
}

/**
 * Returns chart data points for a given date range.
 * - Single day (start === end): returns 24 hourly counts for the sparkline.
 * - Multi-day: returns one daily total per day (sum of 24 hourly buckets).
 */
export function getCountsForRange(
  startDate: string,
  endDate: string,
): number[] {
  if (startDate === endDate) {
    // Single day — return 24 hourly counts
    const today = todayStr();
    if (startDate === today) {
      return getLast24HourCounts();
    }
    const records = getHistoricalRecords();
    const record = records.find((r) => r.date === startDate);
    return record ? [...record.counts] : new Array(24).fill(0);
  }

  // Multi-day — return one total per day
  const records = getRecordsInRange(startDate, endDate);
  // Build a map for quick lookup
  const map: Record<string, number> = {};
  for (const r of records) {
    map[r.date] = r.counts.reduce((sum, n) => sum + n, 0);
  }

  // Enumerate every date in range (inclusive)
  const result: number[] = [];
  const cursor = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  while (cursor <= end) {
    const dateKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    result.push(map[dateKey] ?? 0);
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}
