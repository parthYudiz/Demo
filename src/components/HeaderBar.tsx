import React from 'react';
import { Maximize, Settings, FileText, Trophy, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { GameSettings, GameStats } from '../types';

interface HeaderBarProps {
  settings: GameSettings;
  stats: GameStats;
  onOpenSettings: () => void;
  onOpenProposal: () => void;
  onOpenLeaderboard: () => void;
  onToggleSound: () => void;
  onToggleOrientation: () => void;
  onToggleFullscreen: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  settings,
  stats,
  onOpenSettings,
  onOpenProposal,
  onOpenLeaderboard,
  onToggleSound,
  onToggleOrientation,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full bg-black/80 backdrop-blur-md border-b border-red-900/40 px-4 lg:px-8 py-3 flex items-center justify-between relative z-30">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        {/* Coalition Logo 'C' Emblem */}
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-red-800 to-black p-0.5 shadow-lg shadow-red-900/50 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center relative overflow-hidden">
            <span className="font-serif-heading font-black text-2xl text-red-500 leading-none">C</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/10 to-gold-300/20" />
          </div>
        </div>

        <div>
          <h1 className="font-serif-heading font-bold text-white text-base md:text-lg tracking-wider flex items-center gap-2">
            COALITION <span className="text-red-500 text-xs md:text-sm font-sans font-semibold tracking-normal px-1.5 py-0.5 rounded bg-red-950/80 border border-red-800/50">COURT REPORTERS</span>
          </h1>
          <p className="text-[11px] text-zinc-400 tracking-widest uppercase font-medium">
            Las Vegas Convention • Booth Challenge
          </p>
        </div>
      </div>

      {/* Center Title Badge */}
      <div className="hidden lg:flex items-center space-x-2 bg-zinc-900/90 border border-gold-500/30 px-4 py-1.5 rounded-full shadow-inner">
        <Trophy className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold text-amber-200 tracking-wider">
          THE 9-3 VERDICT CHALLENGE
        </span>
        <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
          TARGET: 0.93s
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Client Proposal Button (Highlighted in Gold) */}
        <button
          onClick={onOpenProposal}
          id="btn-client-proposal"
          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold text-xs md:text-sm px-3 py-1.5 rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          title="View 0.93 Proposal & Technical Spec"
        >
          <FileText className="w-4 h-4 text-zinc-950" />
          <span className="hidden sm:inline">Proposal & Spec</span>
        </button>

        {/* Leaderboard Button */}
        <button
          onClick={onOpenLeaderboard}
          id="btn-leaderboard"
          className="flex items-center space-x-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 text-xs md:text-sm px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer relative"
          title="Booth Play History & Winners"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline font-medium">Plays: {stats.totalPlays}</span>
          {stats.totalWins > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
              {stats.totalWins} W
            </span>
          )}
        </button>

        {/* Orientation Toggle */}
        <button
          onClick={onToggleOrientation}
          id="btn-orientation-toggle"
          className="p-1.5 md:p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
          title={`Switch Display View Mode (Current: ${settings.orientation.toUpperCase()})`}
        >
          <RotateCcw className="w-4 h-4 text-zinc-400" />
          <span className="hidden xl:inline text-[11px] font-mono uppercase">{settings.orientation}</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          id="btn-sound-toggle"
          className={`p-1.5 md:p-2 rounded-lg border transition-colors cursor-pointer ${
            settings.soundEnabled
              ? 'bg-zinc-900 border-zinc-700/60 text-amber-400'
              : 'bg-zinc-950 border-red-900/50 text-red-500 opacity-70'
          }`}
          title={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          id="btn-fullscreen"
          className="p-1.5 md:p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 rounded-lg transition-colors cursor-pointer"
          title="Toggle Fullscreen Kiosk Mode (F11)"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Settings Modal Button */}
        <button
          onClick={onOpenSettings}
          id="btn-settings"
          className="p-1.5 md:p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 rounded-lg transition-colors cursor-pointer"
          title="Admin & Kiosk Settings (Shift + S)"
        >
          <Settings className="w-4 h-4 text-zinc-300" />
        </button>
      </div>
    </header>
  );
};
