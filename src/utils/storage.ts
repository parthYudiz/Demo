import { GameSettings, GameStats, PlayRecord } from '../types';

const SETTINGS_KEY = 'coalition_93_verdict_settings';
const STATS_KEY = 'coalition_93_verdict_stats';

export const DEFAULT_SETTINGS: GameSettings = {
  targetTime: 0.93,
  perfectTolerance: 0.005, // 0.925 to 0.935 counts as perfect 0.93
  nearMissLow: 0.90,
  nearMissHigh: 0.96,
  autoResetDelaySec: 4,
  soundEnabled: true,
  masterVolume: 0.8,
  triggerKey: 'Space',
  allowTouchTrigger: true,
  orientation: 'landscape',
  kioskMode: false,
  hideCursor: false,
  boothName: 'Coalition Court Reporters',
  prizeTitle: 'Grand Prize Winner!',
};

export const DEFAULT_STATS: GameStats = {
  totalPlays: 0,
  totalWins: 0,
  totalNearMisses: 0,
  bestAttempt: null,
  recentHistory: [],
};

export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadStats(): GameStats {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return DEFAULT_STATS;
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

export function recordPlay(record: PlayRecord, stats: GameStats): GameStats {
  const isWin = record.result === 'PERFECT_WIN';
  const isNear = record.result === 'NEAR_MISS';
  
  const currentBest = stats.bestAttempt;
  let newBest = currentBest;
  if (currentBest === null) {
    newBest = record.score;
  } else {
    const prevDiff = Math.abs(currentBest - 0.93);
    const newDiff = Math.abs(record.score - 0.93);
    if (newDiff < prevDiff) {
      newBest = record.score;
    }
  }

  const updatedStats: GameStats = {
    totalPlays: stats.totalPlays + 1,
    totalWins: stats.totalWins + (isWin ? 1 : 0),
    totalNearMisses: stats.totalNearMisses + (isNear ? 1 : 0),
    bestAttempt: newBest,
    recentHistory: [record, ...stats.recentHistory].slice(0, 50), // keep top 50
  };

  saveStats(updatedStats);
  return updatedStats;
}

export function exportStatsCSV(stats: GameStats): void {
  if (!stats.recentHistory.length) {
    alert('No game records to export.');
    return;
  }

  const headers = ['Timestamp', 'Score (s)', 'Formatted', 'Difference', 'Result', 'Player Name', 'Badge Claimed'];
  const rows = stats.recentHistory.map((rec) => [
    rec.timestamp,
    rec.score.toFixed(4),
    rec.formattedScore,
    rec.diff.toFixed(4),
    rec.result,
    rec.playerName || 'Anonymous',
    rec.badgeClaimed ? 'YES' : 'NO',
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `coalition_093_verdict_plays_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
