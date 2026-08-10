import React from 'react';
import { HelpCircle, Gift } from 'lucide-react';

interface BoothStandSignProps {
  prizeTitle: string;
}

export const BoothStandSign: React.FC<BoothStandSignProps> = ({ prizeTitle }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-3 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Tabletop Sign: How To Play */}
      <div className="bg-zinc-950/90 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-3.5 shadow-lg backdrop-blur-sm">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 text-xs">
          <div className="font-serif-heading font-bold text-amber-300 text-sm tracking-wide uppercase">
            HOW TO PLAY (3 EASY STEPS)
          </div>
          <div className="flex items-center gap-3 mt-1 text-zinc-300 font-medium">
            <span><strong className="text-amber-400">1.</strong> TAP START</span>
            <span>→</span>
            <span><strong className="text-amber-400">2.</strong> TAP STOP</span>
            <span>→</span>
            <span><strong className="text-amber-400">3.</strong> LAND ON 0.93s!</span>
          </div>
        </div>
      </div>

      {/* Right Tabletop Sign: Prize Callout */}
      <div className="bg-zinc-950/90 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-3.5 shadow-lg backdrop-blur-sm">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 text-xs">
          <div className="font-serif-heading font-bold text-amber-300 text-sm tracking-wide uppercase">
            GRAND PRIZE
          </div>
          <div className="text-zinc-300 font-semibold truncate mt-0.5">
            {prizeTitle || 'Land on 0.93s to Win the Grand Prize!'}
          </div>
        </div>
      </div>
    </div>
  );
};
