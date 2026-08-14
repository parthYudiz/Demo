import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { Play, Square, RotateCcw, Sparkles } from 'lucide-react';

interface ArcadeButtonProps {
  gameState: GameState;
  onPress: () => void;
  triggerKey: string;
}

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  gameState,
  onPress,
  triggerKey,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Handle visual button press state
  const handleMouseDown = () => {
    setIsPressed(true);
    onPress();
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Keyboard shortcut visual reaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let isTrigger = false;
      if (triggerKey === 'Space' && (e.code === 'Space' || e.key === ' ')) isTrigger = true;
      else if (triggerKey === 'Enter' && e.key === 'Enter') isTrigger = true;
      else if (triggerKey === 'Digit1' && (e.key === '1' || e.code === 'Digit1')) isTrigger = true;
      else if (triggerKey === 'AnyKey' && e.key !== 'Escape' && !e.shiftKey) isTrigger = true;

      if (isTrigger && !e.repeat) {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let isTrigger = false;
      if (triggerKey === 'Space' && (e.code === 'Space' || e.key === ' ')) isTrigger = true;
      else if (triggerKey === 'Enter' && e.key === 'Enter') isTrigger = true;
      else if (triggerKey === 'Digit1' && (e.key === '1' || e.code === 'Digit1')) isTrigger = true;
      else if (triggerKey === 'AnyKey') isTrigger = true;

      if (isTrigger) {
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerKey]);

  return (
    <div className="flex flex-col items-center justify-center my-3 select-none z-10">
      {/* Table Mount Platform Base & Arcade Housing */}
      <div
        className="relative group cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {/* Pulsing Light Halo Ring around button in IDLE mode */}
        {gameState === 'IDLE' && (
          <div className="absolute -inset-4 rounded-full bg-red-600/30 blur-xl animate-button-ring pointer-events-none" />
        )}
        {gameState === 'RUNNING' && (
          <div className="absolute -inset-4 rounded-full bg-amber-500/30 blur-xl animate-pulse pointer-events-none" />
        )}

        {/* Heavy Metal Industrial Pedestal Base */}
        <div className="w-52 sm:w-64 h-14 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 rounded-3xl shadow-2xl border-t-2 border-zinc-500/60 flex items-center justify-center relative overflow-hidden ring-2 ring-black">
          {/* Gold Inlay Trim */}
          <div className="w-40 sm:w-52 h-10 bg-gradient-to-b from-zinc-900 via-black to-zinc-900 rounded-2xl border border-amber-500/30 shadow-inner flex items-center justify-center" />
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/90" />
        </div>

        {/* 3D Giant Arcade Dome Slam Button */}
        <div className="absolute -top-12 sm:-top-14 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <div
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-950 p-2.5 shadow-2xl transition-all duration-75 border-4 ${
              isPressed
                ? 'translate-y-4 scale-95 border-red-300 shadow-red-900/90'
                : 'translate-y-0 border-red-700 shadow-red-950/90 hover:brightness-110'
            }`}
          >
            {/* Glossy Translucent Dome Cap with Inner Refraction */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-red-400 via-red-600 to-red-900 flex items-center justify-center relative overflow-hidden border-2 border-red-200/50 shadow-inner">
              {/* Highlight Refraction Shine Arc */}
              <div className="absolute top-2 left-5 w-14 h-7 sm:w-18 sm:h-9 rounded-full bg-white/40 transform -rotate-45 blur-[1px]" />
              <div className="absolute bottom-2 right-5 w-10 h-5 rounded-full bg-red-300/20 transform -rotate-45 blur-sm" />

              {/* Central Action Icon & High Contrast Text */}
              <div className="text-center z-10 flex flex-col items-center justify-center">
                {gameState === 'IDLE' && (
                  <>
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white mb-0.5 drop-shadow" />
                    <span className="font-serif-heading font-black text-white text-base sm:text-xl tracking-wider drop-shadow-md leading-tight">
                      SLAM TO START
                    </span>
                  </>
                )}

                {gameState === 'RUNNING' && (
                  <>
                    <Square className="w-6 h-6 sm:w-7 sm:h-7 text-amber-200 fill-amber-200 mb-0.5 animate-pulse" />
                    <span className="font-serif-heading font-black text-white text-base sm:text-xl tracking-wider drop-shadow-md leading-tight animate-bounce">
                      HIT AT 0.93!
                    </span>
                  </>
                )}

                {(gameState === 'STOPPED' || gameState === 'RESULT') && (
                  <>
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-200 mb-0.5 animate-spin-slow" />
                    <span className="font-serif-heading font-black text-white text-sm sm:text-base tracking-wider drop-shadow-md">
                      RESETTING
                    </span>
                  </>
                )}

                <span className="text-[9px] sm:text-[10px] text-red-100 font-mono tracking-widest uppercase block mt-0.5 bg-black/40 px-2 py-0.5 rounded-full border border-red-300/30">
                  [{triggerKey === 'Space' ? 'SPACEBAR' : triggerKey}]
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Live Interaction Bar */}
      <div className="mt-9 sm:mt-11 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 px-4 py-1 rounded-full shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold text-zinc-200 tracking-wider uppercase">
            PRESS USB ARCADE BUTTON OR TAP SCREEN
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

