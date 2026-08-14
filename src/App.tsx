import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameSettings, GameStats, PlayRecord, ResultCategory } from './types';
import {
  loadSettings,
  saveSettings,
  loadStats,
  saveStats,
  recordPlay,
  exportStatsCSV,
  exportStatsXLSX,
  addPlaintiffWinner,
  removePlaintiffWinner,
  DEFAULT_STATS,
} from './utils/storage';
import { soundEngine } from './utils/audio';

import { HeaderBar } from './components/HeaderBar';
import { GaugeDisplay } from './components/GaugeDisplay';
import { ArcadeButton } from './components/ArcadeButton';
import { ResultOverlay } from './components/ResultOverlay';
import { SettingsModal } from './components/SettingsModal';
import { LeaderboardDrawer } from './components/LeaderboardDrawer';
import { BoothStandSign } from './components/BoothStandSign';
import { PlaintiffVerdictsTicker } from './components/PlaintiffVerdictsTicker';

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<GameStats>(loadStats);

  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [elapsedTime, setElapsedTime] = useState<number>(0.00);
  const [currentRecord, setCurrentRecord] = useState<PlayRecord | null>(null);

  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Timing refs
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTriggerTimeRef = useRef<number>(0);

  // Save settings helper
  const handleSaveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Reset to Idle
  const resetToIdle = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setGameState('IDLE');
    setElapsedTime(0.00);
    setCurrentRecord(null);
  }, []);

  // Evaluate Result
  const evaluateResult = useCallback((score: number) => {
    const formattedScore = score.toFixed(2); // "0.93"
    const numericFormatted = parseFloat(formattedScore);
    const diff = score - settings.targetTime;

    let resultCat: ResultCategory = 'DEFENSE_VERDICT';
    if (Math.abs(score - settings.targetTime) <= settings.perfectTolerance || numericFormatted === 0.93) {
      resultCat = 'PERFECT_WIN';
    } else if (score >= settings.nearMissLow && score <= settings.nearMissHigh) {
      resultCat = 'NEAR_MISS';
    } else {
      resultCat = 'DEFENSE_VERDICT';
    }

    if (settings.soundEnabled) {
      if (resultCat === 'PERFECT_WIN') soundEngine.playWinFanfare(settings.masterVolume);
      else if (resultCat === 'NEAR_MISS') soundEngine.playNearMissSound(settings.masterVolume);
      else soundEngine.playDefenseSound(settings.masterVolume);
    }

    const newRecord: PlayRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      score,
      formattedScore,
      diff,
      result: resultCat,
    };

    setCurrentRecord(newRecord);
    setStats((prevStats) => recordPlay(newRecord, prevStats));

    setTimeout(() => {
      setGameState('RESULT');
    }, 150);
  }, [settings]);

  // Start Timer
  const startTimer = useCallback(() => {
    if (settings.soundEnabled) {
      soundEngine.playStartSound(settings.masterVolume);
    }
    startTimeRef.current = performance.now();
    setGameState('RUNNING');

    const tick = () => {
      const now = performance.now();
      const currentElapsed = (now - startTimeRef.current) / 1000;
      setElapsedTime(currentElapsed);

      // Auto stop if time exceeds 2.5 seconds to prevent run-away
      if (currentElapsed > 2.5) {
        cancelAnimationFrame(animFrameRef.current!);
        evaluateResult(currentElapsed);
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [settings, evaluateResult]);

  // Stop Timer
  const stopTimer = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    const finalNow = performance.now();
    const finalElapsed = (finalNow - startTimeRef.current) / 1000;
    setElapsedTime(finalElapsed);
    setGameState('STOPPED');

    evaluateResult(finalElapsed);
  }, [evaluateResult]);

  // Main Primary Action Trigger Handler
  const handleTrigger = useCallback(() => {
    const now = Date.now();
    // 150ms debounce threshold
    if (now - lastTriggerTimeRef.current < 150) return;
    lastTriggerTimeRef.current = now;

    if (gameState === 'IDLE') {
      startTimer();
    } else if (gameState === 'RUNNING') {
      stopTimer();
    } else if (gameState === 'RESULT') {
      resetToIdle();
    }
  }, [gameState, startTimer, stopTimer, resetToIdle]);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field or modal is open
      if (isSettingsOpen || isLeaderboardOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Hotkeys for admin controls
      if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
        setIsSettingsOpen(true);
        return;
      }
      if (e.key === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (isLeaderboardOpen) setIsLeaderboardOpen(false);
        return;
      }

      // Check trigger key match
      let isMatch = false;
      if (settings.triggerKey === 'Space' && (e.code === 'Space' || e.key === ' ')) isMatch = true;
      else if (settings.triggerKey === 'Enter' && e.key === 'Enter') isMatch = true;
      else if (settings.triggerKey === 'Digit1' && (e.key === '1' || e.code === 'Digit1')) isMatch = true;
      else if (settings.triggerKey === 'AnyKey') isMatch = true;

      if (isMatch) {
        e.preventDefault();
        handleTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.triggerKey, gameState, handleTrigger, isSettingsOpen, isLeaderboardOpen]);

  // Save Plaintiff Winner
  const handleSavePlaintiffWinner = (name: string, lawFirm: string, email: string) => {
    setStats((prevStats) =>
      addPlaintiffWinner(
        {
          name,
          lawFirm,
          email,
          timeFormatted: '0.93',
        },
        prevStats
      )
    );
  };

  // Remove Plaintiff Winner
  const handleRemoveWinner = (winnerId: string) => {
    setStats((prevStats) => removePlaintiffWinner(winnerId, prevStats));
  };

  // Sound toggle helper
  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    handleSaveSettings(updated);
  };

  // Orientation toggle helper
  const handleToggleOrientation = () => {
    const updated: GameSettings = {
      ...settings,
      orientation: settings.orientation === 'landscape' ? 'portrait' : 'landscape',
    };
    handleSaveSettings(updated);
  };

  // Fullscreen helper
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Clear Stats helper
  const handleClearStats = () => {
    if (confirm('Are you sure you want to clear today\'s play history?')) {
      setStats(DEFAULT_STATS);
      saveStats(DEFAULT_STATS);
    }
  };

  return (
    <div className={`min-h-screen bg-courtroom-pattern text-zinc-100 flex flex-col justify-between relative overflow-hidden ${
      settings.hideCursor ? 'cursor-none-kiosk' : ''
    }`}>
      {/* Top Bar Header */}
      <HeaderBar
        settings={settings}
        stats={stats}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleOrientation={handleToggleOrientation}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Today's Plaintiff Verdicts Marquee / Ticker */}
      <PlaintiffVerdictsTicker
        winners={stats.plaintiffWinners || []}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* Main Display Stage View (Adapts to Landscape / Portrait) */}
      <main className={`flex-1 flex flex-col items-center justify-center py-2 px-2 w-full transition-all ${
        settings.orientation === 'portrait' ? 'max-w-lg mx-auto border-x border-amber-500/20 py-6' : 'max-w-6xl mx-auto'
      }`}>
        {/* Tabletop Instruction Signage */}
        <BoothStandSign prizeTitle={settings.prizeTitle} />

        {/* Central 0.93 Circular Timer Arc Gauge */}
        <GaugeDisplay
          gameState={gameState}
          elapsedTime={elapsedTime}
          settings={settings}
        />

        {/* 3D Physical USB Arcade Button Mockup */}
        <ArcadeButton
          gameState={gameState}
          onPress={handleTrigger}
          triggerKey={settings.triggerKey}
        />
      </main>

      {/* Bottom Footer Banner */}
      <footer className="w-full bg-black/90 border-t border-zinc-800/80 px-4 py-2 text-center text-xs text-zinc-400 relative z-20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-zinc-300">Coalition Court Reporters • Las Vegas Booth Kiosk</span>
        </div>
        <div className="text-[11px] font-mono text-zinc-400">
          Target: <strong className="text-amber-400">0.93</strong> • Press [Space / Enter] or Tap Red Button
        </div>
      </footer>

      {/* Result Overlay Banner */}
      {gameState === 'RESULT' && (
        <ResultOverlay
          record={currentRecord}
          settings={settings}
          onReset={resetToIdle}
          onSavePlaintiffWinner={handleSavePlaintiffWinner}
          onExportXLSX={() => exportStatsXLSX(stats)}
        />
      )}

      {/* Admin Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        stats={stats}
        onSaveSettings={handleSaveSettings}
        onExportCSV={() => exportStatsCSV(stats)}
        onExportXLSX={() => exportStatsXLSX(stats)}
        onClearStats={handleClearStats}
      />

      {/* Leaderboard Drawer */}
      <LeaderboardDrawer
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        stats={stats}
        onExportCSV={() => exportStatsCSV(stats)}
        onExportXLSX={() => exportStatsXLSX(stats)}
        onAddWinner={handleSavePlaintiffWinner}
        onRemoveWinner={handleRemoveWinner}
      />
    </div>
  );
}

