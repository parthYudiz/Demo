import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, Scale, CheckCircle2, Download, Mail, Building2, User, Sparkles } from 'lucide-react';
import { PlayRecord, GameSettings } from '../types';

interface ResultOverlayProps {
  record: PlayRecord | null;
  settings: GameSettings;
  onReset: () => void;
  onSavePlaintiffWinner?: (name: string, lawFirm: string, email: string) => void;
  onExportXLSX?: () => void;
}

export const ResultOverlay: React.FC<ResultOverlayProps> = ({
  record,
  settings,
  onReset,
  onSavePlaintiffWinner,
  onExportXLSX,
}) => {
  if (!record) return null;

  const isWin = record.result === 'PERFECT_WIN';
  const isNear = record.result === 'NEAR_MISS';

  const [winnerName, setWinnerName] = useState('');
  const [lawFirm, setLawFirm] = useState('');
  const [email, setEmail] = useState('');
  const [savedWinner, setSavedWinner] = useState(false);
  const [showWinnerForm, setShowWinnerForm] = useState(isWin); // Automatically open for winners
  const [countdown, setCountdown] = useState(settings.autoResetDelaySec);

  // Calculate dynamic "ONLY .0X AWAY!" for Near Miss
  const scoreNum = parseFloat(record.formattedScore);
  const awayDist = Math.abs(scoreNum - 0.93).toFixed(2);
  const awayFormatted = awayDist.startsWith('0.') ? awayDist.slice(1) : awayDist; // e.g. ".02"

  // Dramatic multi-burst confetti for 9-3 PLAINTIFF VERDICT
  useEffect(() => {
    if (isWin) {
      const duration = 3.8 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = ['#FFD700', '#C8102E', '#FFFFFF', '#F59E0B', '#10B981'];

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 30,
          angle: 60,
          spread: 65,
          origin: { x: 0, y: 0.7 },
          colors,
          zIndex: 9999,
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 65,
          origin: { x: 1, y: 0.7 },
          colors,
          zIndex: 9999,
        });
      }, 250);

      return () => clearInterval(interval);
    } else if (isNear) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#D4AF37', '#FFFFFF', '#C8102E'],
        zIndex: 9999,
      });
    }
  }, [record, isWin, isNear]);

  // Fast auto-reset countdown timer ONLY for non-winners or after winner completes
  useEffect(() => {
    if (isWin && !savedWinner) return; // Do not auto-reset while winner is entering details
    setCountdown(settings.autoResetDelaySec);
    if (settings.autoResetDelaySec <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const autoResetTimeout = setTimeout(() => {
      onReset();
    }, settings.autoResetDelaySec * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(autoResetTimeout);
    };
  }, [record, settings.autoResetDelaySec, onReset, isWin, savedWinner]);

  const handleWinnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (winnerName.trim() && onSavePlaintiffWinner) {
      onSavePlaintiffWinner(
        winnerName.trim(),
        lawFirm.trim() || 'Trial Attorney',
        email.trim() || ''
      );
      setSavedWinner(true);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className={`w-full max-w-lg bg-zinc-950 border-2 rounded-3xl p-5 sm:p-7 text-center shadow-2xl relative overflow-hidden my-auto ${
        isWin
          ? 'border-amber-400 glow-gold ring-4 ring-amber-500/25'
          : isNear
          ? 'border-amber-500/70 shadow-amber-950/40'
          : 'border-zinc-800 shadow-zinc-950'
      }`}>
        {/* Ambient glow behind card */}
        <div className={`absolute -top-24 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isWin ? 'bg-amber-500/30' : isNear ? 'bg-amber-600/15' : 'bg-red-600/10'
        }`} />

        {/* Top Icon Banner */}
        <div className="relative z-10 flex flex-col items-center">
          {isWin && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-1 shadow-2xl mb-2 sm:mb-3 animate-bounce">
              <div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center">
                <Trophy className="w-9 h-9 sm:w-10 sm:h-10 text-amber-300" />
              </div>
            </div>
          )}

          {isNear && (
            <div className="w-14 h-14 rounded-full bg-amber-950/80 border-2 border-amber-500/80 flex items-center justify-center mb-2.5">
              <Award className="w-7 h-7 text-amber-400" />
            </div>
          )}

          {!isWin && !isNear && (
            <div className="w-14 h-14 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-2.5">
              <Scale className="w-7 h-7 text-zinc-400" />
            </div>
          )}

          {/* MAIN RESULT HEADLINE */}
          <h3 className={`font-serif-heading font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-wider uppercase leading-tight ${
            isWin
              ? 'text-gold-metallic glow-gold-text'
              : isNear
              ? 'text-amber-300'
              : 'text-zinc-200'
          }`}>
            {isWin && '9-3 PLAINTIFF VERDICT — WINNER!'}
            {isNear && 'SO CLOSE!'}
            {!isWin && !isNear && 'DEFENSE VERDICT — TRY AGAIN'}
          </h3>

          {/* Subtitle / Fun Tagline */}
          <div className="mt-1">
            {isWin && (
              <p className="text-amber-200 font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ★ EXACT 0.93 HIT! CLAIM YOUR GRAND PRIZE! ★
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </p>
            )}
            {isNear && (
              <p className="text-amber-400 font-bold text-base sm:text-lg font-timer tracking-wide">
                ONLY {awayFormatted} AWAY!
              </p>
            )}
            {!isWin && !isNear && (
              <p className="text-zinc-400 text-xs font-medium">
                Aim for 0.93 to deliver a Plaintiff Verdict.
              </p>
            )}
          </div>

          {/* TIME DISPLAY CONTAINER (Pure number e.g. 0.95 or 0.93) */}
          <div className="my-3 sm:my-4 bg-zinc-900/95 border border-zinc-800 rounded-2xl px-6 py-2.5 flex flex-col items-center justify-center w-full max-w-xs shadow-inner">
            <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-widest">
              YOUR TIME
            </span>
            <span className={`font-timer font-black text-5xl sm:text-6xl tracking-tight my-0.5 ${
              isWin ? 'text-amber-300 glow-gold-text' : isNear ? 'text-amber-400' : 'text-zinc-100'
            }`}>
              {record.formattedScore}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
              TARGET: 0.93
            </span>
          </div>

          {/* WINNER DETAILS POP-UP REGISTRATION (Name, Law Firm, Email ID & XLSX Export) */}
          {isWin && (
            <div className="w-full mb-3 text-left">
              {!savedWinner ? (
                <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/60 rounded-2xl p-4 sm:p-5 shadow-xl relative">
                  <div className="flex items-center justify-between mb-3 border-b border-amber-500/30 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center">
                        <Trophy className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-serif-heading font-extrabold text-amber-300 uppercase tracking-wide">
                        WINNER REGISTRATION & PRIZE LOG
                      </span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/40">
                      0.93 VERDICT
                    </span>
                  </div>

                  <form onSubmit={handleWinnerSubmit} className="space-y-2.5">
                    {/* 1. Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-amber-400" />
                        Attorney / Winner Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={winnerName}
                        onChange={(e) => setWinnerName(e.target.value)}
                        placeholder="e.g. Johnathan Miller, Esq."
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 transition-all focus:outline-none focus:ring-1 focus:ring-amber-400"
                        autoFocus
                      />
                    </div>

                    {/* 2. Law Firm */}
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-amber-400" />
                        Law Firm / Organization
                      </label>
                      <input
                        type="text"
                        value={lawFirm}
                        onChange={(e) => setLawFirm(e.target.value)}
                        placeholder="e.g. Miller & Partners Trial Attorneys"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 transition-all focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    {/* 3. Email ID */}
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-amber-400" />
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. attorney@millerlawfirm.com"
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 transition-all focus:outline-none focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    {/* Form Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl cursor-pointer shadow-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
                      >
                        <CheckCircle2 className="w-4 h-4 text-zinc-950" />
                        Save Winner to Roster
                      </button>

                      {onExportXLSX && (
                        <button
                          type="button"
                          onClick={() => {
                            if (winnerName.trim() && onSavePlaintiffWinner) {
                              onSavePlaintiffWinner(
                                winnerName.trim(),
                                lawFirm.trim() || 'Trial Attorney',
                                email.trim() || ''
                              );
                              setSavedWinner(true);
                            }
                            onExportXLSX();
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider shrink-0"
                          title="Save and download Excel spreadsheet"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Export .XLSX
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-emerald-950/60 border-2 border-emerald-500/70 rounded-2xl p-4 text-center shadow-lg animate-fadeIn">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-zinc-950 mx-auto flex items-center justify-center mb-2 font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-300 text-sm sm:text-base">
                    Winner Saved Successfully!
                  </h4>
                  <p className="text-zinc-300 text-xs mt-1">
                    <strong className="text-white">{winnerName}</strong> ({lawFirm || 'Trial Attorney'}) • {email || 'Email Saved'}
                  </p>
                  <p className="text-[11px] text-emerald-400/80 mt-1 font-mono">
                    Recorded in Today's 9-3 Plaintiff Roster
                  </p>

                  {onExportXLSX && (
                    <button
                      onClick={onExportXLSX}
                      className="mt-3 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer transition-colors uppercase tracking-wider"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Updated Excel (.xlsx)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Reset Button & Auto Timer */}
          <div className="w-full flex flex-col items-center gap-2 mt-1">
            <button
              onClick={onReset}
              id="btn-play-again"
              className={`w-full max-w-sm flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xl ${
                isWin
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 glow-gold'
                  : 'bg-red-600 hover:bg-red-500 text-white glow-red'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              PRESS BUTTON TO PLAY AGAIN
            </button>

            {(!isWin || savedWinner) && settings.autoResetDelaySec > 0 && (
              <p className="text-[11px] text-zinc-400 font-mono">
                Auto-resetting for next player in <span className="text-amber-400 font-bold">{countdown}s</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


