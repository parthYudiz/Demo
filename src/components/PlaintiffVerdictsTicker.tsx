import React, { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles } from 'lucide-react';
import { PlaintiffWinner } from '../types';

interface PlaintiffVerdictsTickerProps {
  winners: PlaintiffWinner[];
  onOpenLeaderboard?: () => void;
}

export const PlaintiffVerdictsTicker: React.FC<PlaintiffVerdictsTickerProps> = ({
  winners,
  onOpenLeaderboard,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate ticker every 4.5 seconds
  useEffect(() => {
    if (!winners || winners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % winners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [winners]);

  const activeWinner = winners && winners.length > 0 ? winners[currentIndex % winners.length] : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-2">
      <div 
        onClick={onOpenLeaderboard}
        className="bg-zinc-950/90 border border-amber-500/40 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg backdrop-blur-sm cursor-pointer hover:border-amber-400 transition-all group"
      >
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="hidden sm:block">
            <span className="font-serif-heading font-black text-xs text-amber-300 tracking-wider uppercase block">
              TODAY'S PLAINTIFF VERDICTS
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              0.93 PERFECT SCORES
            </span>
          </div>
        </div>

        {/* Center Rotating Winner Callout */}
        <div className="flex-1 mx-3 overflow-hidden text-center">
          {activeWinner ? (
            <div key={activeWinner.id} className="animate-fadeIn flex items-center justify-center gap-2 truncate">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                {activeWinner.name}
              </span>
              <span className="text-zinc-500 text-xs">—</span>
              <span className="text-xs text-amber-200/90 truncate font-medium">
                {activeWinner.lawFirm}
              </span>
              <span className="hidden md:inline-block bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 shrink-0">
                0.93 Plaintiff Verdict
              </span>
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-amber-300/80 font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Be the first to deliver a 9-3 Plaintiff Verdict today!</span>
            </div>
          )}
        </div>

        {/* Right Counter / Action */}
        <div className="flex items-center gap-1.5 shrink-0 text-right">
          <span className="bg-red-600/90 text-white font-bold text-[11px] px-2 py-0.5 rounded-full shadow-sm">
            {winners?.length || 0} {winners?.length === 1 ? 'Winner' : 'Winners'}
          </span>
        </div>
      </div>
    </div>
  );
};
