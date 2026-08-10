import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, CheckCircle2, AlertCircle, Scale } from 'lucide-react';
import { PlayRecord, GameSettings } from '../types';

interface ResultOverlayProps {
  record: PlayRecord | null;
  settings: GameSettings;
  onReset: () => void;
  onSavePlayerName: (recordId: string, name: string) => void;
}

export const ResultOverlay: React.FC<ResultOverlayProps> = ({
  record,
  settings,
  onReset,
  onSavePlayerName,
}) => {
  if (!record) return null;

  const [playerName, setPlayerName] = useState('');
  const [savedName, setSavedName] = useState(false);
  const [countdown, setCountdown] = useState(settings.autoResetDelaySec);

  const isWin = record.result === 'PERFECT_WIN';
  const isNear = record.result === 'NEAR_MISS';
  const isLow = record.result === 'TOO_LOW';
  const isHigh = record.result === 'TOO_HIGH';

  // Confetti trigger for PERFECT_WIN or NEAR_MISS
  useEffect(() => {
    if (isWin) {
      // Golden confetti burst
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#FFD700', '#C8102E', '#FFFFFF', '#D4AF37'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#FFD700', '#C8102E', '#FFFFFF', '#D4AF37'],
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else if (isNear) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#FFFFFF'],
      });
    }
  }, [record, isWin, isNear]);

  // Auto-reset countdown timer
  useEffect(() => {
    setCountdown(settings.autoResetDelaySec);
    if (settings.autoResetDelaySec <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [record, settings.autoResetDelaySec, onReset]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onSavePlayerName(record.id, playerName.trim());
      setSavedName(true);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className={`w-full max-w-xl bg-zinc-950 border-2 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden ${
        isWin
          ? 'border-amber-400 glow-gold'
          : isNear
          ? 'border-amber-500/80 shadow-amber-900/40'
          : 'border-red-800/80 shadow-red-950/80'
      }`}>
        {/* Background glow burst */}
        <div className={`absolute -top-24 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isWin ? 'bg-amber-500/20' : isNear ? 'bg-amber-600/10' : 'bg-red-600/15'
        }`} />

        {/* Top Header Icon & Result Banner */}
        <div className="relative z-10 flex flex-col items-center">
          {isWin && (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-1 shadow-xl mb-3 animate-bounce">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-300" />
              </div>
            </div>
          )}

          {isNear && (
            <div className="w-16 h-16 rounded-full bg-amber-950 border-2 border-amber-500 flex items-center justify-center mb-3">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
          )}

          {(isLow || isHigh) && (
            <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-red-800 flex items-center justify-center mb-3">
              <Scale className="w-8 h-8 text-red-500" />
            </div>
          )}

          <h3 className={`font-serif-heading font-extrabold text-2xl sm:text-4xl tracking-wider uppercase ${
            isWin ? 'text-gold-metallic glow-gold-text' : isNear ? 'text-amber-300' : 'text-red-500'
          }`}>
            {isWin && 'PERFECT 9-3 PLAINTIFF VERDICT!'}
            {isNear && 'SO CLOSE! RUNNER UP!'}
            {isLow && 'DEFENSE VERDICT (TOO LOW)'}
            {isHigh && 'MISTRIAL (TOO HIGH)'}
          </h3>

          <p className="text-zinc-300 text-sm sm:text-base font-medium mt-1">
            {isWin && 'You landed on EXACTLY 0.93 seconds! Claim your Grand Prize!'}
            {isNear && `You landed on ${record.formattedScore}s — almost perfect!`}
            {isLow && `You landed on ${record.formattedScore}s — stopped before 0.93s.`}
            {isHigh && `You landed on ${record.formattedScore}s — exceeded 0.93s target.`}
          </p>

          {/* EXACT TIME HIGHLIGHT */}
          <div className="my-6 bg-zinc-900/90 border border-zinc-800 rounded-xl px-8 py-4 flex flex-col items-center justify-center w-full max-w-sm">
            <span className="text-xs text-zinc-400 uppercase font-mono tracking-widest">FINAL TIME RECORDED</span>
            <span className={`font-timer font-black text-5xl sm:text-6xl tracking-tight my-1 ${
              isWin ? 'text-amber-300' : isNear ? 'text-amber-400' : 'text-zinc-100'
            }`}>
              {record.formattedScore}s
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Variance: {record.diff > 0 ? `+${record.diff.toFixed(3)}s` : `${record.diff.toFixed(3)}s`} from 0.93s
            </span>
          </div>

          {/* Winner Name Badge Entry Form for Convention Staff */}
          {(isWin || isNear) && !savedName && (
            <form onSubmit={handleNameSubmit} className="w-full max-w-sm mb-4">
              <label className="block text-xs text-amber-300 font-semibold mb-1 text-left uppercase">
                Attorney / Attendee Badge Name:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter name (e.g. Sarah Connor, Esq.)"
                  className="flex-1 bg-zinc-900 border border-amber-500/60 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  Save Badge
                </button>
              </div>
            </form>
          )}

          {savedName && (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-4 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              Badge Name Recorded: {playerName}
            </div>
          )}

          {/* Auto Reset Progress Bar & Button */}
          <div className="w-full mt-2 flex flex-col items-center gap-3">
            <button
              onClick={onReset}
              id="btn-play-again"
              className={`w-full max-w-sm flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base tracking-wider uppercase transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg ${
                isWin
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 glow-gold'
                  : 'bg-red-600 hover:bg-red-500 text-white glow-red'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              PRESS BUTTON OR TAP TO TRY AGAIN
            </button>

            {settings.autoResetDelaySec > 0 && (
              <p className="text-xs text-zinc-400 font-mono">
                Auto resetting screen in <span className="text-amber-400 font-bold">{countdown}s</span>...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
