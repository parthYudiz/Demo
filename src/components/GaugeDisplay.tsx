import React from 'react';
import { GameState, GameSettings } from '../types';
import { Target, Zap } from 'lucide-react';

interface GaugeDisplayProps {
  gameState: GameState;
  elapsedTime: number; // e.g. 0.9321
  settings: GameSettings;
}

// Polar coordinate helper for SVG paths
function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

// Generate SVG arc path from startAngle to endAngle (clockwise)
function createArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle <= startAngle) return '';
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? '1' : '0';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export const GaugeDisplay: React.FC<GaugeDisplayProps> = ({
  gameState,
  elapsedTime,
  settings,
}) => {
  // Format numeric output cleanly (e.g. "0.95" or "0.93")
  const displayFormatted = elapsedTime.toFixed(2);

  // Gauge scale: 0.00s to 2.00s over a 240° sweep (from 150° bottom-left to 390°/30° bottom-right)
  const maxGaugeTime = 2.00;
  const clampedTime = Math.min(Math.max(elapsedTime, 0), maxGaugeTime);
  const startAngle = 150;
  const sweepAngle = 240;
  const currentAngle = startAngle + (clampedTime / maxGaugeTime) * sweepAngle;

  const radius = 138;
  const cx = 180;
  const cy = 180;

  // Determine current active zone highlight for feedback
  const isTargetZone = elapsedTime >= settings.nearMissLow && elapsedTime <= settings.nearMissHigh;
  const isExactWin = Math.abs(elapsedTime - settings.targetTime) <= settings.perfectTolerance || displayFormatted === '0.93';

  // Generate 41 perimeter LED ticks along the exact 240° arc (uniform arcade track)
  const totalTicks = 41;
  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    const frac = i / (totalTicks - 1);
    const tickAngle = startAngle + frac * sweepAngle;
    const tickTime = frac * maxGaugeTime;
    const isMajor = i % 5 === 0;
    const isLit = clampedTime >= tickTime && gameState !== 'IDLE';
    return { tickAngle, tickTime, isMajor, isLit };
  });

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 py-1 relative select-none">
      {/* Dynamic Background Light Beam Effects */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none transition-all duration-300 ${
        isExactWin
          ? 'bg-amber-400/30 scale-125 animate-pulse'
          : isTargetZone
          ? 'bg-amber-500/20 scale-110'
          : gameState === 'RUNNING'
          ? 'bg-red-600/20 scale-105'
          : 'bg-red-950/15'
      }`} />

      {/* Subtle Coalition Court Reporters Branding */}
      <div className="flex items-center justify-center gap-2 mb-1 opacity-85 hover:opacity-100 transition-opacity">
        <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white font-serif-heading text-xs font-black shadow-md border border-red-400/30">
          C
        </div>
        <span className="text-[11px] md:text-xs font-bold tracking-widest text-zinc-300 uppercase font-serif-heading">
          COALITION COURT REPORTERS
        </span>
      </div>

      {/* Top Main Heading */}
      <div className="text-center mb-1.5 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-red-950/80 via-zinc-900 to-amber-950/80 border border-amber-500/30 mb-1 shadow-inner">
          <Target className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="text-[11px] font-extrabold tracking-widest text-amber-300 font-serif-heading uppercase">
            ARCADE REACTION ARENA
          </span>
          <Zap className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h2 className="font-serif-heading font-black text-3xl md:text-5xl lg:text-6xl text-gold-metallic tracking-wider drop-shadow-lg leading-tight">
          9-3 VERDICT CHALLENGE
        </h2>
        <p className="text-xs md:text-sm text-zinc-300 tracking-widest font-semibold uppercase mt-0.5">
          {gameState === 'IDLE' && 'HIT EXACTLY 0.93 TO WIN A PLAINTIFF VERDICT'}
          {gameState === 'RUNNING' && 'TIMING ACTIVE... HIT BUTTON TO STOP!'}
          {gameState === 'STOPPED' && 'VERDICT RECORDED!'}
          {gameState === 'RESULT' && 'FINAL VERDICT'}
        </p>
      </div>

      {/* Main Circular Gauge Display Frame */}
      <div className="relative w-[310px] h-[310px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] flex items-center justify-center my-1 z-10">
        {/* Outer Arcade Chrome & LED Chassis */}
        <div className={`absolute inset-0 rounded-full border-4 p-2 transition-all duration-300 shadow-2xl flex items-center justify-center ${
          isExactWin
            ? 'border-amber-400 glow-gold bg-gradient-to-b from-amber-950/90 via-zinc-950 to-black'
            : isTargetZone
            ? 'border-amber-500/80 shadow-amber-900/50 bg-zinc-950'
            : gameState === 'RUNNING'
            ? 'border-red-600/90 glow-red bg-zinc-950'
            : 'border-zinc-800 bg-zinc-950 shadow-black'
        }`}>
          {/* Inner Carbon Texture Bezel */}
          <div className="w-full h-full rounded-full border-2 border-zinc-700/60 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black relative overflow-hidden flex items-center justify-center">
            {/* Subtle radial grid lines */}
            <div className="absolute inset-0 bg-courtroom-pattern opacity-60 pointer-events-none" />
          </div>
        </div>

        {/* Pure SVG Arc Gauge, Ticks, Target Marker & Real-Time Moving Needle */}
        <svg className="w-full h-full relative z-10" viewBox="0 0 360 360">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="needleGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Base Full Outer Track Arc (from 150° to 390°) */}
          <path
            d={createArc(cx, cy, radius, startAngle, startAngle + sweepAngle)}
            fill="none"
            stroke="#18181b"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d={createArc(cx, cy, radius, startAngle, startAngle + sweepAngle)}
            fill="none"
            stroke="#27272a"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* 2. Dynamic Progress Sweep Arc (Grows in real time as seconds count up) */}
          {clampedTime > 0.01 && (
            <path
              d={createArc(cx, cy, radius, startAngle, currentAngle)}
              fill="none"
              stroke={isExactWin ? '#FFD700' : isTargetZone ? '#F59E0B' : 'url(#gaugeGradient)'}
              strokeWidth="16"
              strokeLinecap="round"
              filter={isExactWin ? 'url(#goldGlow)' : undefined}
            />
          )}

          {/* 3. Perimeter LED Ticks (Uniform track with no pre-highlighted target) */}
          {ticks.map((tick, idx) => (
            <g key={idx} transform={`rotate(${tick.tickAngle}, ${cx}, ${cy})`}>
              <line
                x1={cx + radius + 14}
                y1={cy}
                x2={cx + radius + (tick.isMajor ? 6 : 9)}
                y2={cy}
                stroke={
                  tick.isLit
                    ? '#EF4444'
                    : '#3F3F46'
                }
                strokeWidth={tick.isMajor ? 2.5 : 1.5}
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* 5. DYNAMIC MOVING NEEDLE / POINTER (Moves in real time from 0.00s and resets on reset) */}
          <g
            transform={`rotate(${currentAngle}, ${cx}, ${cy})`}
            filter="url(#needleGlow)"
          >
            {/* Pulsing ring when hitting exact win */}
            {isExactWin && (
              <circle
                cx={cx + radius}
                cy={cy}
                r="12"
                fill="#FFD700"
                opacity="0.6"
                className="animate-ping"
              />
            )}

            {/* Inward-pointing Arrow Head */}
            <polygon
              points={`${cx + radius - 16},${cy} ${cx + radius - 2},${cy - 7} ${cx + radius - 2},${cy + 7}`}
              fill={isExactWin ? '#FFD700' : isTargetZone ? '#F59E0B' : '#EF4444'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />

            {/* Needle Stem & Center Luminous Node */}
            <line
              x1={cx + radius - 12}
              y1={cy}
              x2={cx + radius + 16}
              y2={cy}
              stroke={isExactWin ? '#FFD700' : isTargetZone ? '#F59E0B' : '#FFFFFF'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx={cx + radius}
              cy={cy}
              r="5"
              fill={isExactWin ? '#FFFFFF' : '#EF4444'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        {/* Center Digital Display Container */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
          {/* Status Badge */}
          <div className="mb-0.5">
            {gameState === 'IDLE' && (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold tracking-widest text-amber-300 uppercase bg-amber-950/80 border border-amber-500/60 px-4 py-1 rounded-full shadow-lg animate-pulse-glow">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                PRESS BUTTON TO PLAY
              </span>
            )}
            {gameState === 'RUNNING' && (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold tracking-widest text-white uppercase bg-red-600 border border-red-400 px-4 py-1 rounded-full shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
                TIMING ACTIVE...
              </span>
            )}
            {(gameState === 'STOPPED' || gameState === 'RESULT') && (
              <span className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-widest uppercase px-4 py-1 rounded-full shadow-lg ${
                isExactWin
                  ? 'bg-amber-400 text-zinc-950 glow-gold animate-bounce'
                  : isTargetZone
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              }`}>
                {isExactWin ? '★ 9-3 WINNER! ★' : isTargetZone ? '⚡ SO CLOSE! ⚡' : 'RECORDED'}
              </span>
            )}
          </div>

          {/* MAIN TIMER NUMBER DISPLAY - High contrast large digits */}
          <div className="relative my-0.5">
            <div className={`font-timer font-black text-6xl sm:text-7xl md:text-8xl tracking-tight leading-none ${
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
          </div>

          {/* Bottom Target Label Badge */}
          <div className="inline-flex items-center gap-1 bg-zinc-900/90 border border-zinc-700/80 px-3 py-0.5 rounded-full mt-1">
            <span className="text-[10px] sm:text-xs text-zinc-400 font-mono uppercase tracking-wider">
              TARGET:
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-400 font-timer">
              0.93
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Center Gamified Action Banner */}
      <div className={`mt-2 py-2 px-6 rounded-2xl border text-center transition-all duration-300 shadow-xl z-10 ${
        isExactWin
          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 border-amber-200 text-zinc-950 font-black text-sm sm:text-base tracking-wider glow-gold'
          : isTargetZone
          ? 'bg-amber-950/80 border-amber-500/70 text-amber-300 font-bold text-xs sm:text-sm tracking-wide'
          : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 font-semibold text-xs sm:text-sm tracking-wider'
      }`}>
        <span className="font-serif-heading uppercase tracking-wider">
          {isExactWin
            ? '★ 9-3 PLAINTIFF VERDICT — CLAIM GRAND PRIZE! ★'
            : 'LAND ON 0.93 FOR A PLAINTIFF VERDICT'}
        </span>
      </div>
    </div>
  );
};



