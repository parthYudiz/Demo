import React from 'react';
import { HelpCircle, Trophy, Flame } from 'lucide-react';

interface BoothStandSignProps {
  prizeTitle: string;
}

export const BoothStandSign: React.FC<BoothStandSignProps> = ({ prizeTitle }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-2 grid grid-cols-1 md:grid-cols-2 gap-3 z-10">
      {/* Left Tabletop Sign: How To Play */}
      <div className="bg-zinc-950/90 border border-amber-500/40 rounded-2xl p-3 flex items-center gap-3 shadow-xl backdrop-blur-md hover:border-amber-400 transition-all">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/50 flex items-center justify-center shrink-0 shadow-inner">
          <HelpCircle className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-1.5 font-serif-heading font-extrabold text-amber-300 text-xs sm:text-sm tracking-wide uppercase">
            <span>HOW TO WIN 9-3</span>
            <span className="bg-red-600/90 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded">
              3 STEPS
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-zinc-300 font-semibold text-[11px] sm:text-xs">
            <span className="bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded text-amber-300">1. START</span>
            <span className="text-zinc-500">→</span>
            <span className="bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded text-amber-300">2. STOP</span>
            <span className="text-zinc-500">→</span>
            <span className="bg-amber-500/20 border border-amber-500/50 px-2 py-0.5 rounded text-amber-200 font-bold">3. HIT 0.93!</span>
          </div>
        </div>
      </div>

      {/* Right Tabletop Sign: Prize Callout */}
      <div className="bg-zinc-950/90 border border-amber-500/40 rounded-2xl p-3 flex items-center gap-3 shadow-xl backdrop-blur-md hover:border-amber-400 transition-all">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-red-600/20 to-amber-900/40 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-inner">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 text-xs overflow-hidden">
          <div className="flex items-center gap-1.5 font-serif-heading font-extrabold text-amber-300 text-xs sm:text-sm tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>GRAND PRIZE VAULT</span>
          </div>
          <div className="text-zinc-200 font-bold truncate mt-0.5 text-xs sm:text-sm">
            {prizeTitle || 'Land on 0.93 to Win the Grand Prize!'}
          </div>
        </div>
      </div>
    </div>
  );
};

