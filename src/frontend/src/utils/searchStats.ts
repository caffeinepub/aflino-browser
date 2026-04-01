const STORAGE_KEY = "aflino_search_stats";

interface SearchStats {
  date: string; // YYYY-MM-DD
  counts: number[]; // 24 elements, one per hour
  lastUpdated: number;
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
  // Return a 24-element array representing the last 24 hours
  // Index 0 = 24 hours ago, index 23 = current hour
  const currentHour = new Date().getHours();
  const result: number[] = new Array(24).fill(0);
  for (let i = 0; i < 24; i++) {
    const hourIndex = (currentHour - 23 + i + 24) % 24;
    result[i] = stats.counts[hourIndex] || 0;
  }
  return result;
}
