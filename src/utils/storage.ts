import * as XLSX from 'xlsx';
import { GameSettings, GameStats, PlayRecord, PlaintiffWinner } from '../types';

const SETTINGS_KEY = 'coalition_93_verdict_settings';
const STATS_KEY = 'coalition_93_verdict_stats';

export const DEFAULT_SETTINGS: GameSettings = {
  targetTime: 0.93,
  perfectTolerance: 0.005, // 0.925 to 0.935 counts as perfect 0.93
  nearMissLow: 0.90,
  nearMissHigh: 0.96,
  autoResetDelaySec: 3.5,
  soundEnabled: true,
  masterVolume: 0.85,
  triggerKey: 'Space',
  allowTouchTrigger: true,
  orientation: 'landscape',
  kioskMode: false,
  hideCursor: false,
  boothName: 'Coalition Court Reporters',
  prizeTitle: 'Official 9-3 Plaintiff Verdict Prize',
};

export const INITIAL_WINNERS: PlaintiffWinner[] = [
  {
    id: 'w-1',
    name: 'David Sterling',
    lawFirm: 'Sterling & Partners Law',
    email: 'd.sterling@sterlinglaw.com',
    timeFormatted: '0.93',
    timestamp: 'Today 10:15 AM',
    date: new Date().toLocaleDateString(),
  },
  {
    id: 'w-2',
    name: 'Jessica Vance',
    lawFirm: 'Pacific Trial Attorneys',
    email: 'jvance@pacifictriallaw.com',
    timeFormatted: '0.93',
    timestamp: 'Today 11:42 AM',
    date: new Date().toLocaleDateString(),
  },
];

export const DEFAULT_STATS: GameStats = {
  totalPlays: 0,
  totalWins: 2,
  totalNearMisses: 0,
  bestAttempt: 0.93,
  recentHistory: [],
  plaintiffWinners: INITIAL_WINNERS,
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
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_STATS,
        ...parsed,
        plaintiffWinners: parsed.plaintiffWinners && parsed.plaintiffWinners.length > 0
          ? parsed.plaintiffWinners
          : INITIAL_WINNERS,
      };
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
    recentHistory: [record, ...stats.recentHistory].slice(0, 100),
    plaintiffWinners: stats.plaintiffWinners || [],
  };

  saveStats(updatedStats);
  return updatedStats;
}

export function addPlaintiffWinner(
  winner: Omit<PlaintiffWinner, 'id' | 'timestamp'> & { timestamp?: string; date?: string },
  stats: GameStats
): GameStats {
  const newWinner: PlaintiffWinner = {
    ...winner,
    id: `winner-${Date.now()}`,
    timestamp: winner.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: winner.date || new Date().toLocaleDateString(),
  };

  const updatedStats: GameStats = {
    ...stats,
    totalWins: (stats.totalWins || 0) + 1,
    plaintiffWinners: [newWinner, ...(stats.plaintiffWinners || [])],
  };

  saveStats(updatedStats);
  return updatedStats;
}

export function removePlaintiffWinner(winnerId: string, stats: GameStats): GameStats {
  const updatedStats: GameStats = {
    ...stats,
    plaintiffWinners: (stats.plaintiffWinners || []).filter((w) => w.id !== winnerId),
  };

  saveStats(updatedStats);
  return updatedStats;
}

/**
 * Export full event data to real Excel (.xlsx) file with styled worksheets
 */
export function exportStatsXLSX(stats: GameStats): void {
  const workbook = XLSX.utils.book_new();

  // 1. Sheet 1: 0.93 Plaintiff Winners (High Priority for Lead Gen & Prize Fulfillment)
  const winnersData = (stats.plaintiffWinners || []).map((w, idx) => ({
    '#': idx + 1,
    'Attorney / Winner Name': w.name || 'Anonymous',
    'Law Firm / Organization': w.lawFirm || 'Trial Law Firm',
    'Email Address': w.email || 'N/A',
    'Phone / Notes': w.phone || '',
    'Score Result': '0.93 (Plaintiff Verdict)',
    'Time Recorded': w.timestamp,
    'Date': w.date || new Date().toLocaleDateString(),
  }));

  const winnersSheet = winnersData.length > 0 
    ? XLSX.utils.json_to_sheet(winnersData)
    : XLSX.utils.aoa_to_sheet([['No winners recorded yet.']]);

  // Set column widths for sheet 1
  winnersSheet['!cols'] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 30 },
    { wch: 32 },
    { wch: 18 },
    { wch: 26 },
    { wch: 16 },
    { wch: 14 },
  ];

  XLSX.utils.book_append_sheet(workbook, winnersSheet, '0.93 Plaintiff Winners');

  // 2. Sheet 2: All Booth Play Attempts
  const playsData = stats.recentHistory.map((rec, idx) => ({
    'Attempt #': stats.recentHistory.length - idx,
    'Timestamp': rec.timestamp,
    'Formatted Score': rec.formattedScore,
    'Exact Seconds': Number(rec.score.toFixed(4)),
    'Verdict Result': rec.result === 'PERFECT_WIN' ? '9-3 PLAINTIFF WINNER' : rec.result === 'NEAR_MISS' ? 'NEAR MISS' : 'DEFENSE VERDICT',
    'Player Name': rec.playerName || '',
    'Law Firm': rec.lawFirm || '',
    'Email Address': rec.email || '',
  }));

  if (playsData.length > 0) {
    const playsSheet = XLSX.utils.json_to_sheet(playsData);
    playsSheet['!cols'] = [
      { wch: 10 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 24 },
      { wch: 22 },
      { wch: 26 },
      { wch: 30 },
    ];
    XLSX.utils.book_append_sheet(workbook, playsSheet, 'All Play Records');
  }

  // 3. Sheet 3: Event Executive Summary
  const summaryData = [
    { 'Metric': 'Event Name', 'Value': 'Coalition Court Reporters 9-3 Verdict Challenge' },
    { 'Metric': 'Export Date & Time', 'Value': new Date().toLocaleString() },
    { 'Metric': 'Total Game Attempts', 'Value': stats.totalPlays },
    { 'Metric': 'Total 0.93 Plaintiff Winners', 'Value': stats.plaintiffWinners?.length || stats.totalWins },
    { 'Metric': 'Near Misses (0.90 - 0.96)', 'Value': stats.totalNearMisses },
    { 'Metric': 'Target Time', 'Value': '0.93 seconds' },
    { 'Metric': 'Best Attempt Recorded', 'Value': stats.bestAttempt !== null ? `${stats.bestAttempt.toFixed(3)}s` : 'N/A' },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 30 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

  // Trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Coalition_93_Plaintiff_Winners_${dateStr}.xlsx`);
}

export function exportStatsCSV(stats: GameStats): void {
  if (!stats.recentHistory.length && !stats.plaintiffWinners.length) {
    alert('No game records to export.');
    return;
  }

  const headers = ['Timestamp', 'Score (Formatted)', 'Exact Score (s)', 'Result', 'Player Name', 'Law Firm', 'Email ID'];
  const rows = stats.recentHistory.map((rec) => [
    `"${rec.timestamp}"`,
    `"${rec.formattedScore}"`,
    rec.score.toFixed(4),
    `"${rec.result}"`,
    `"${rec.playerName || 'Anonymous'}"`,
    `"${rec.lawFirm || ''}"`,
    `"${rec.email || ''}"`,
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


