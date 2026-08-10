export type GameState = 'IDLE' | 'RUNNING' | 'STOPPED' | 'RESULT';

export type ResultCategory = 'PERFECT_WIN' | 'NEAR_MISS' | 'TOO_LOW' | 'TOO_HIGH';

export interface GameSettings {
  targetTime: number; // 0.93
  perfectTolerance: number; // 0.005 -> accepts 0.925 to 0.935 as perfect 0.93 (rounds to 0.93)
  nearMissLow: number; // 0.90
  nearMissHigh: number; // 0.96
  autoResetDelaySec: number; // 4
  soundEnabled: boolean;
  masterVolume: number; // 0.0 to 1.0
  triggerKey: string; // 'Space' | 'Enter' | 'Digit1' | 'AnyKey'
  allowTouchTrigger: boolean;
  orientation: 'landscape' | 'portrait';
  kioskMode: boolean;
  hideCursor: boolean;
  boothName: string;
  prizeTitle: string;
}

export interface PlayRecord {
  id: string;
  timestamp: string;
  score: number; // exact numeric elapsed time, e.g., 0.9312
  formattedScore: string; // "0.93"
  diff: number; // e.g. 0.0012
  result: ResultCategory;
  playerName?: string;
  badgeClaimed?: boolean;
}

export interface GameStats {
  totalPlays: number;
  totalWins: number;
  totalNearMisses: number;
  bestAttempt: number | null; // closest to 0.93
  recentHistory: PlayRecord[];
}
