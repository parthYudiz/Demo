import React, { useState } from 'react';
import { X, Volume2, Key, Sliders, Database, Download, Trash2, Monitor, Trophy } from 'lucide-react';
import { GameSettings, GameStats } from '../types';
import { soundEngine } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  stats: GameStats;
  onSaveSettings: (newSettings: GameSettings) => void;
  onExportCSV: () => void;
  onClearStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  stats,
  onSaveSettings,
  onExportCSV,
  onClearStats,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<GameSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'GAME' | 'AUDIO' | 'INPUT' | 'KIOSK' | 'STATS'>('GAME');

  const handleChange = (key: keyof GameSettings, value: unknown) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onSaveSettings(updated);
  };

  const handleTestSound = (type: 'win' | 'near' | 'tick' | 'start') => {
    if (type === 'win') soundEngine.playWinFanfare(form.masterVolume);
    if (type === 'near') soundEngine.playNearMissSound(form.masterVolume);
    if (type === 'tick') soundEngine.playTickSound(form.masterVolume);
    if (type === 'start') soundEngine.playStartSound(form.masterVolume);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-zinc-200">
        {/* Top Title Bar */}
        <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-heading font-bold text-lg text-white">
              ADMIN & BOOTH KIOSK SETTINGS
            </h3>
          </div>
          <button
            onClick={onClose}
            id="btn-close-settings"
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('GAME')}
            className={`px-4 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'GAME'
                ? 'border-amber-400 text-amber-300 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Trophy className="w-4 h-4" /> Game Rules & Ranges
          </button>
          <button
            onClick={() => setActiveTab('AUDIO')}
            className={`px-4 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'AUDIO'
                ? 'border-amber-400 text-amber-300 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Volume2 className="w-4 h-4" /> Audio & FX
          </button>
          <button
            onClick={() => setActiveTab('INPUT')}
            className={`px-4 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'INPUT'
                ? 'border-amber-400 text-amber-300 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-4 h-4" /> USB Hardware Input
          </button>
          <button
            onClick={() => setActiveTab('KIOSK')}
            className={`px-4 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'KIOSK'
                ? 'border-amber-400 text-amber-300 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-4 h-4" /> Kiosk & TV Display
          </button>
          <button
            onClick={() => setActiveTab('STATS')}
            className={`px-4 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'STATS'
                ? 'border-amber-400 text-amber-300 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4" /> Booth Stats & Export
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto text-sm">
          {/* TAB 1: GAME RULES */}
          {activeTab === 'GAME' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                    Target Time (Seconds):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.targetTime}
                    onChange={(e) => handleChange('targetTime', parseFloat(e.target.value) || 0.93)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-base font-bold"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">Default 0.93 represents the 9-3 Plaintiff Verdict.</p>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                    Auto-Reset Delay (Seconds):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={form.autoResetDelaySec}
                    onChange={(e) => handleChange('autoResetDelaySec', parseInt(e.target.value) || 4)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-base font-bold"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">Seconds before screen resets automatically for next player.</p>
                </div>
              </div>

              <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="font-bold text-zinc-200 uppercase text-xs tracking-wider">Tolerance & Difficulty Ranges:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Near Miss Lower Bound (s):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.nearMissLow}
                      onChange={(e) => handleChange('nearMissLow', parseFloat(e.target.value) || 0.90)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Near Miss Upper Bound (s):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.nearMissHigh}
                      onChange={(e) => handleChange('nearMissHigh', parseFloat(e.target.value) || 0.96)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-3">
                <label className="block text-xs font-bold text-amber-400 uppercase mb-1">Grand Prize Header Subtitle:</label>
                <input
                  type="text"
                  value={form.prizeTitle}
                  onChange={(e) => handleChange('prizeTitle', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-medium"
                  placeholder="e.g. Win a Bottle of Fine Bourbon!"
                />
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO */}
          {activeTab === 'AUDIO' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                <div>
                  <div className="font-bold text-white text-sm">Sound Effects & Fanfare</div>
                  <div className="text-xs text-zinc-400">Play procedural audio on start, win, near-miss, and reset.</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.soundEnabled}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-amber-400 uppercase">
                  Master Audio Volume ({Math.round(form.masterVolume * 100)}%):
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={form.masterVolume}
                  onChange={(e) => handleChange('masterVolume', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="font-bold text-xs text-zinc-300 uppercase">Test Sound Effects (Web Audio API):</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleTestSound('start')}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 rounded-lg text-xs cursor-pointer"
                  >
                    Start Sweep
                  </button>
                  <button
                    onClick={() => handleTestSound('tick')}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 rounded-lg text-xs cursor-pointer"
                  >
                    Tick Click
                  </button>
                  <button
                    onClick={() => handleTestSound('near')}
                    className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold py-2 rounded-lg text-xs cursor-pointer"
                  >
                    Near Miss
                  </button>
                  <button
                    onClick={() => handleTestSound('win')}
                    className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold py-2 rounded-lg text-xs cursor-pointer"
                  >
                    Win Fanfare
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USB HARDWARE INPUT */}
          {activeTab === 'INPUT' && (
            <div className="space-y-4">
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-amber-400 uppercase">
                  USB Hardware Button Mapped Key:
                </label>
                <select
                  value={form.triggerKey}
                  onChange={(e) => handleChange('triggerKey', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono font-bold"
                >
                  <option value="Space">Spacebar (Default USB Arcade Standard)</option>
                  <option value="Enter">Enter Key</option>
                  <option value="Digit1">Key '1' (Keypad Encoder)</option>
                  <option value="AnyKey">Any Keyboard Key Press</option>
                </select>
                <p className="text-xs text-zinc-400 mt-1">
                  Most USB arcade buttons emulate a standard keyboard Spacebar or Enter key. Select your USB encoder's signal key.
                </p>
              </div>

              <div className="flex items-center justify-between bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                <div>
                  <div className="font-bold text-white text-sm">Allow Screen Touch/Mouse Click</div>
                  <div className="text-xs text-zinc-400">Allow attendees to tap on-screen button if touchscreen monitor is present.</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.allowTouchTrigger}
                  onChange={(e) => handleChange('allowTouchTrigger', e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 4: KIOSK & TV DISPLAY */}
          {activeTab === 'KIOSK' && (
            <div className="space-y-4">
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-amber-400 uppercase">
                  TV Display Orientation Mode:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleChange('orientation', 'landscape')}
                    className={`py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                      form.orientation === 'landscape'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    16:9 Landscape Mode
                  </button>
                  <button
                    onClick={() => handleChange('orientation', 'portrait')}
                    className={`py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                      form.orientation === 'portrait'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    9:16 Vertical Portrait
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                <div>
                  <div className="font-bold text-white text-sm">Hide Mouse Cursor in Kiosk Mode</div>
                  <div className="text-xs text-zinc-400">Keeps the display clean on the 43" booth TV screen.</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.hideCursor}
                  onChange={(e) => handleChange('hideCursor', e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 5: BOOTH STATS */}
          {activeTab === 'STATS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800">
                  <div className="text-xs text-zinc-400 font-mono uppercase">Total Plays</div>
                  <div className="text-2xl font-black text-white">{stats.totalPlays}</div>
                </div>
                <div className="bg-zinc-900/90 p-4 rounded-xl border border-amber-500/50">
                  <div className="text-xs text-amber-400 font-mono uppercase">Winners</div>
                  <div className="text-2xl font-black text-amber-300">{stats.totalWins}</div>
                </div>
                <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800">
                  <div className="text-xs text-zinc-400 font-mono uppercase">Near Misses</div>
                  <div className="text-2xl font-black text-zinc-200">{stats.totalNearMisses}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onExportCSV}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs uppercase"
                >
                  <Download className="w-4 h-4" /> Export Plays to CSV
                </button>
                <button
                  onClick={onClearStats}
                  className="bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs uppercase"
                >
                  <Trash2 className="w-4 h-4" /> Clear History
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-900 px-6 py-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-2 rounded-lg text-xs uppercase tracking-wider cursor-pointer"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
