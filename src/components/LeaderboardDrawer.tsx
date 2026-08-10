import React from 'react';
import { X, Trophy, Award, Download, CheckCircle, Clock } from 'lucide-react';
import { GameStats } from '../types';

interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onExportCSV: () => void;
}

export const LeaderboardDrawer: React.FC<LeaderboardDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  onExportCSV,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-zinc-950 border-l border-amber-500/40 h-full p-6 flex flex-col shadow-2xl animate-slideLeft text-zinc-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-heading font-bold text-lg text-white">
              BOOTH PLAY LOG & WINNERS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-2 my-4 text-center">
          <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase block font-mono">Total Plays</span>
            <span className="text-xl font-bold text-white">{stats.totalPlays}</span>
          </div>
          <div className="bg-zinc-900 p-2.5 rounded-lg border border-amber-500/40">
            <span className="text-[10px] text-amber-400 uppercase block font-mono">0.93 Winners</span>
            <span className="text-xl font-bold text-amber-300">{stats.totalWins}</span>
          </div>
          <div className="bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase block font-mono">Near Misses</span>
            <span className="text-xl font-bold text-zinc-200">{stats.totalNearMisses}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onExportCSV}
          className="w-full mb-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow"
        >
          <Download className="w-4 h-4" /> Export Today's Plays to CSV
        </button>

        {/* Recent Attempts List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Recent Convention Attempts:
          </h4>

          {stats.recentHistory.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs italic">
              No plays logged yet today. Press the big red button to kick off the 0.93 challenge!
            </div>
          ) : (
            stats.recentHistory.map((rec) => {
              const isWin = rec.result === 'PERFECT_WIN';
              const isNear = rec.result === 'NEAR_MISS';

              return (
                <div
                  key={rec.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isWin
                      ? 'bg-amber-950/60 border-amber-400 text-amber-200 shadow-md'
                      : isNear
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isWin ? (
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : isNear ? (
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
                    )}

                    <div>
                      <div className="font-mono font-bold text-sm">
                        {rec.formattedScore}s
                        {isWin && <span className="ml-2 text-[10px] bg-amber-500 text-zinc-950 font-bold px-1.5 py-0.5 rounded uppercase">PERFECT 0.93</span>}
                        {isNear && <span className="ml-2 text-[10px] text-amber-400 font-semibold uppercase">NEAR MISS</span>}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {rec.playerName ? `Badge: ${rec.playerName}` : 'Anonymous Attendee'} • {rec.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px] text-zinc-400">
                    {rec.diff > 0 ? `+${rec.diff.toFixed(3)}s` : `${rec.diff.toFixed(3)}s`}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
