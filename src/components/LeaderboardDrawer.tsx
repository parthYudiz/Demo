import React, { useState } from 'react';
import { X, Trophy, Award, Download, Clock, Trash2, Mail, UserPlus, FileSpreadsheet, Building2, User } from 'lucide-react';
import { GameStats } from '../types';

interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onExportCSV: () => void;
  onExportXLSX: () => void;
  onAddWinner?: (name: string, lawFirm: string, email: string) => void;
  onRemoveWinner?: (winnerId: string) => void;
}

export const LeaderboardDrawer: React.FC<LeaderboardDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  onExportCSV,
  onExportXLSX,
  onAddWinner,
  onRemoveWinner,
}) => {
  if (!isOpen) return null;

  const [showAddForm, setShowAddForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualFirm, setManualFirm] = useState('');
  const [manualEmail, setManualEmail] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualName.trim() && onAddWinner) {
      onAddWinner(
        manualName.trim(),
        manualFirm.trim() || 'Trial Attorney',
        manualEmail.trim() || ''
      );
      setManualName('');
      setManualFirm('');
      setManualEmail('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-zinc-950 border-l border-amber-500/40 h-full p-5 sm:p-6 flex flex-col shadow-2xl animate-slideLeft text-zinc-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-heading font-extrabold text-base sm:text-lg text-white">
              PLAINTIFF VERDICTS ROSTER
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
        <div className="grid grid-cols-3 gap-2 my-3 text-center">
          <div className="bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase block font-mono">Total Plays</span>
            <span className="text-lg font-bold text-white">{stats.totalPlays}</span>
          </div>
          <div className="bg-zinc-900/90 p-2 rounded-xl border border-amber-500/50">
            <span className="text-[10px] text-amber-400 uppercase block font-mono">0.93 Winners</span>
            <span className="text-lg font-black text-amber-300">
              {stats.plaintiffWinners?.length || stats.totalWins}
            </span>
          </div>
          <div className="bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase block font-mono">Near Misses</span>
            <span className="text-lg font-bold text-zinc-200">{stats.totalNearMisses}</span>
          </div>
        </div>

        {/* Dual Export Buttons (Excel .xlsx & CSV) */}
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          <button
            onClick={onExportXLSX}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
            title="Download full formatted Excel spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export .XLSX
          </button>
          <button
            onClick={onExportCSV}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all"
            title="Download CSV table"
          >
            <Download className="w-4 h-4 text-amber-400" /> Export CSV
          </button>
        </div>

        {/* Quick Manual Add Toggle */}
        <div className="mb-3">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-semibold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Register Winner Manually
            </button>
          ) : (
            <form onSubmit={handleManualSubmit} className="bg-zinc-900 border border-amber-500/50 rounded-2xl p-3 text-xs space-y-2 animate-fadeIn">
              <div className="font-serif-heading font-bold text-amber-300 text-xs flex items-center justify-between">
                <span>MANUAL WINNER REGISTRATION</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-semibold mb-0.5">Attorney Name *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Attorney Name"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-semibold mb-0.5">Law Firm</label>
                <input
                  type="text"
                  value={manualFirm}
                  onChange={(e) => setManualFirm(e.target.value)}
                  placeholder="Law Firm / Org"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase font-semibold mb-0.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-1.5 rounded-lg uppercase tracking-wider"
                >
                  Save to Roster
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2 py-1.5 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Tab / Section 1: Today's Plaintiff Verdict Winners */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-serif-heading">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Today's 0.93 Plaintiff Verdicts ({stats.plaintiffWinners?.length || 0})
            </h4>

            {(!stats.plaintiffWinners || stats.plaintiffWinners.length === 0) ? (
              <div className="text-center py-4 px-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80 text-zinc-500 text-xs italic">
                No 0.93 winners recorded yet today.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.plaintiffWinners.map((winner) => (
                  <div
                    key={winner.id}
                    className="p-3 bg-gradient-to-r from-amber-950/50 to-zinc-900/80 border border-amber-500/50 rounded-2xl flex items-center justify-between shadow-sm hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-start gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                        🏆
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                          <span>{winner.name}</span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-1.5 py-0.2 rounded border border-amber-500/40">
                            0.93
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-300/90 font-medium truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-amber-400/80 shrink-0" />
                          <span>{winner.lawFirm}</span>
                        </div>
                        {winner.email && (
                          <div className="text-[10px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-zinc-500 shrink-0" />
                            <span className="text-zinc-300 font-mono">{winner.email}</span>
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          {winner.timestamp}
                        </div>
                      </div>
                    </div>

                    {onRemoveWinner && (
                      <button
                        onClick={() => onRemoveWinner(winner.id)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 rounded transition-colors shrink-0"
                        title="Remove Winner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Recent Attempts */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Recent Attempts:
            </h4>

            {stats.recentHistory.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs italic">
                No attempts logged yet.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentHistory.map((rec) => {
                  const isWin = rec.result === 'PERFECT_WIN';
                  const isNear = rec.result === 'NEAR_MISS';

                  return (
                    <div
                      key={rec.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isWin
                          ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                          : isNear
                          ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isWin ? (
                          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : isNear ? (
                          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                        )}

                        <div>
                          <div className="font-timer font-bold text-sm">
                            {rec.formattedScore}
                            {isWin && (
                              <span className="ml-2 text-[10px] bg-amber-500 text-zinc-950 font-bold px-1.5 py-0.2 rounded uppercase font-sans">
                                9-3 VERDICT
                              </span>
                            )}
                            {isNear && (
                              <span className="ml-2 text-[10px] text-amber-400 font-semibold uppercase font-sans">
                                SO CLOSE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {rec.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


