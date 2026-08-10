import React, { useState, useEffect } from 'react';
import { GameState } from '../types';

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
    <div className="flex flex-col items-center justify-center my-3 select-none">
      {/* Table Mount Platform Base */}
      <div className="relative group cursor-pointer" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}>
        {/* Metal Pedestal Base */}
        <div className="w-48 sm:w-56 h-12 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 rounded-2xl shadow-2xl border-t border-zinc-500/50 flex items-center justify-center relative overflow-hidden">
          {/* Bezel Ring */}
          <div className="w-36 sm:w-44 h-9 bg-zinc-900 rounded-xl border border-zinc-700 shadow-inner flex items-center justify-center" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/80" />
        </div>

        {/* 3D Dome Button Base */}
        <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <div
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-900 p-2 shadow-2xl transition-all duration-75 border-4 ${
              isPressed
                ? 'translate-y-3 scale-95 border-red-400 shadow-red-900/90'
                : 'translate-y-0 border-red-700/80 shadow-red-950/80 hover:brightness-110'
            }`}
          >
            {/* Top Glossy Dome Cap */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-red-400 via-red-600 to-red-800 flex items-center justify-center relative overflow-hidden border-2 border-red-300/40 shadow-inner">
              {/* Highlight Refraction Shine */}
              <div className="absolute top-2 left-4 w-12 h-6 sm:w-16 sm:h-8 rounded-full bg-white/30 transform -rotate-45 blur-[1px]" />

              {/* Central Action Icon / Label */}
              <div className="text-center z-10">
                <span className="font-serif-heading font-black text-white text-base sm:text-xl tracking-wider drop-shadow-md block">
                  {gameState === 'IDLE' && 'TAP TO START'}
                  {gameState === 'RUNNING' && 'TAP TO STOP!'}
                  {(gameState === 'STOPPED' || gameState === 'RESULT') && 'RESETTING'}
                </span>
                <span className="text-[10px] text-red-100/90 tracking-widest font-mono uppercase block mt-0.5">
                  [{triggerKey === 'Space' ? 'SPACEBAR' : triggerKey}]
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructional Subtext */}
      <div className="mt-8 sm:mt-10 text-center">
        <p className="text-xs sm:text-sm font-semibold text-zinc-300 tracking-wider uppercase flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
          PRESS PHYSICAL USB BUTTON OR TAP ON SCREEN
        </p>
      </div>
    </div>
  );
};
