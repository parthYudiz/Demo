import React from 'react';
import { GameState, GameSettings } from '../types';

interface GaugeDisplayProps {
  gameState: GameState;
  elapsedTime: number; // e.g. 0.9321
  settings: GameSettings;
}

export const GaugeDisplay: React.FC<GaugeDisplayProps> = ({
  gameState,
  elapsedTime,
  settings,
}) => {
  // Format numeric output
  const displayFormatted = elapsedTime.toFixed(2);
  const msDigits = Math.floor((elapsedTime % 1) * 1000).toString().padStart(3, '0');

  // Gauge calculation: max scale 2.00 seconds
  const maxGaugeTime = 2.00;
  const clampedTime = Math.min(elapsedTime, maxGaugeTime);
  const percent = (clampedTime / maxGaugeTime) * 100;
  
  // Calculate sweep angle for SVG arc (240 degree gauge from 150 deg to 390 deg)
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * (circumference * (240 / 360));

  // Determine current active zone highlight for feedback
  const isTargetZone = elapsedTime >= 0.90 && elapsedTime <= 0.96;
  const isExactWin = Math.abs(elapsedTime - 0.93) <= settings.perfectTolerance;
  const isTooLow = elapsedTime > 0 && elapsedTime < 0.90;
  const isTooHigh = elapsedTime > 0.96;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 py-2 relative select-none">
      {/* Top Tagline */}
      <div className="text-center mb-2 md:mb-4">
        <h2 className="font-serif-heading font-extrabold text-2xl md:text-4xl lg:text-5xl text-gold-metallic tracking-wider drop-shadow-md">
          9-3 VERDICT CHALLENGE
        </h2>
        <p className="text-xs md:text-sm lg:text-base text-zinc-300 tracking-widest font-medium uppercase mt-1">
          {gameState === 'IDLE' && 'CAN YOU LAND ON EXACTLY 0.93 SECONDS?'}
          {gameState === 'RUNNING' && 'TIMING ACTIVE... HIT BUTTON TO STOP!'}
          {gameState === 'STOPPED' && 'VERDICT RECORDED!'}
          {gameState === 'RESULT' && 'FINAL VERDICT DECISION'}
        </p>
      </div>

      {/* Main Circular Gauge Display Frame */}
      <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] flex items-center justify-center my-2">
        {/* Background Outer Ring Decorative Frame */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800/80 bg-zinc-950/80 shadow-2xl flex items-center justify-center">
          <div className="absolute inset-3 rounded-full border border-red-900/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
        </div>

        {/* SVG Arc Gauge */}
        <svg className="w-full h-full transform -rotate-210 relative z-10" viewBox="0 0 360 360">
          {/* Gauge Track */}
          <circle
            cx="180"
            cy="180"
            r={radius}
            className="stroke-zinc-800"
            strokeWidth="14"
            fill="none"
            strokeDasharray={`${circumference * (240 / 360)} ${circumference * (120 / 360)}`}
            strokeLinecap="round"
          />

          {/* Defense Zone Track (<0.90) */}
          <circle
            cx="180"
            cy="180"
            r={radius}
            className="stroke-red-950/50"
            strokeWidth="14"
            fill="none"
            strokeDasharray={`${circumference * (240 / 360) * (0.90 / 2.00)} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Winner Sweet Spot Highlight (0.90 - 0.96) */}
          <circle
            cx="180"
            cy="180"
            r={radius}
            className="stroke-amber-500/80"
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${circumference * (240 / 360) * (0.06 / 2.00)} ${circumference}`}
            strokeDashoffset={-circumference * (240 / 360) * (0.90 / 2.00)}
            strokeLinecap="round"
          />

          {/* Dynamic Active Progress Arc */}
          <circle
            cx="180"
            cy="180"
            r={radius}
            className={`transition-all duration-75 ${
              isExactWin
                ? 'stroke-amber-400 drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]'
                : isTargetZone
                ? 'stroke-amber-500'
                : 'stroke-red-600'
            }`}
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${circumference * (240 / 360)} ${circumference * (120 / 360)}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />

          {/* Target Marker at 0.93s */}
          <g transform={`rotate(${(0.93 / maxGaugeTime) * 240}, 180, 180)`}>
            <line x1="180" y1="24" x2="180" y2="44" stroke="#FFD700" strokeWidth="4" />
            <polygon points="180,48 174,60 186,60" fill="#FFD700" />
          </g>
        </svg>

        {/* Center Digital Display Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6">
          {/* Top Prompt / Status */}
          <div className="mb-1">
            {gameState === 'IDLE' && (
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-amber-400 uppercase bg-amber-950/60 border border-amber-600/40 px-3 py-1 rounded-full animate-pulse-glow">
                TAP TO START
              </span>
            )}
            {gameState === 'RUNNING' && (
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-red-400 uppercase bg-red-950/80 border border-red-600/60 px-3 py-1 rounded-full animate-pulse">
                TIMING ACTIVE...
              </span>
            )}
            {(gameState === 'STOPPED' || gameState === 'RESULT') && (
              <span className={`text-xs sm:text-sm font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                isExactWin
                  ? 'bg-amber-500 text-zinc-950 glow-gold'
                  : isTargetZone
                  ? 'bg-amber-900/90 text-amber-200 border border-amber-500'
                  : 'bg-red-900/90 text-red-200 border border-red-500'
              }`}>
                {isExactWin ? 'PERFECT 0.93s!' : isTargetZone ? 'NEAR MISS!' : 'FINAL TIME'}
              </span>
            )}
          </div>

          {/* MAIN TIMER NUMBER DISPLAY */}
          <div className="relative my-1">
            <div className={`font-timer font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tighter ${
              isExactWin
                ? 'text-amber-300 glow-gold-text'
                : isTargetZone
                ? 'text-amber-400'
                : gameState === 'RUNNING'
                ? 'text-white glow-white-text'
                : 'text-zinc-100'
            }`}>
              {displayFormatted}
            </div>

            {/* Milliseconds Micro Display */}
            <div className="text-[11px] sm:text-xs font-mono text-zinc-400 tracking-wider">
              PRECISION: {displayFormatted}.{msDigits.slice(-1)}s
            </div>
          </div>

          {/* Bottom Target Label */}
          <div className="text-xs sm:text-sm text-zinc-300 font-medium tracking-widest uppercase mt-1">
            TARGET: <span className="font-bold text-amber-400">0.93 SECONDS</span>
          </div>
        </div>

        {/* Side Callout Indicators (as shown in reference booth images) */}
        {/* Left Side: TOO LOW / DEFENSE VERDICT */}
        <div className={`absolute -left-12 sm:-left-24 md:-left-32 top-1/2 transform -translate-y-1/2 flex flex-col items-end text-right transition-all duration-300 ${
          isTooLow ? 'opacity-100 scale-105' : 'opacity-60'
        }`}>
          <span className="text-[10px] sm:text-xs font-bold tracking-wider text-cyan-400 uppercase">
            TOO LOW
          </span>
          <span className="font-serif-heading font-extrabold text-xs sm:text-sm md:text-base text-cyan-300 tracking-wide">
            DEFENSE VERDICT
          </span>
          <span className="text-[10px] text-zinc-400">&lt; 0.90s</span>
        </div>

        {/* Right Side: TOO HIGH / MISTRIAL */}
        <div className={`absolute -right-12 sm:-right-24 md:-right-32 top-1/2 transform -translate-y-1/2 flex flex-col items-start text-left transition-all duration-300 ${
          isTooHigh ? 'opacity-100 scale-105' : 'opacity-60'
        }`}>
          <span className="text-[10px] sm:text-xs font-bold tracking-wider text-rose-400 uppercase">
            TOO HIGH
          </span>
          <span className="font-serif-heading font-extrabold text-xs sm:text-sm md:text-base text-rose-300 tracking-wide">
            MISTRIAL
          </span>
          <span className="text-[10px] text-zinc-400">&gt; 0.96s</span>
        </div>
      </div>

      {/* Bottom Center Highlight Banner */}
      <div className={`mt-3 py-2 px-6 rounded-xl border text-center transition-all duration-300 ${
        isExactWin
          ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border-amber-300 text-zinc-950 font-black text-sm sm:text-lg tracking-wider glow-gold'
          : isTargetZone
          ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 font-bold text-xs sm:text-sm tracking-wide'
          : 'bg-zinc-900/90 border-zinc-800 text-red-500 font-semibold text-xs sm:text-sm tracking-widest'
      }`}>
        <span className="font-serif-heading uppercase">
          ★ PERFECT 9-3 PLAINTIFF VERDICT! ★
        </span>
      </div>
    </div>
  );
};
