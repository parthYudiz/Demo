import React from 'react';
import { X, CheckCircle, Code, Cpu, HardDrive, DollarSign, Clock, ShieldCheck, Monitor, HelpCircle } from 'lucide-react';

interface ClientProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientProposalModal: React.FC<ClientProposalModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-950 border-2 border-amber-500/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-zinc-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-proposal"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-amber-500/30 pb-4 mb-6">
          <div className="inline-block bg-amber-500 text-zinc-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-2">
            Vendor Response & Technical Proposal
          </div>
          
          {/* CRITICAL REQUIRED FIRST WORD IN CLIENT BRIEF */}
          <h2 className="font-serif-heading font-black text-3xl sm:text-5xl text-gold-metallic tracking-wider mb-2">
            0.93 VERDICT CHALLENGE
          </h2>
          
          <p className="text-zinc-400 text-sm">
            Prepared exclusively for <strong className="text-white">Coalition Court Reporters</strong> • Las Vegas Convention Booth Kiosk Application
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-zinc-300">
          
          {/* Greeting Confirmation */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 font-semibold text-sm">
                <strong>0.93</strong> — Confirmed! We have thoroughly reviewed the entire Coalition Court Reporters brief and reference booth images.
              </p>
              <p className="text-zinc-400 text-xs mt-1">
                The working demo application you are currently testing is a fully functional, offline-ready prototype designed specifically to drive high attendee engagement at plaintiff-attorney conventions.
              </p>
            </div>
          </div>

          {/* Question 1: How we build it */}
          <div>
            <h3 className="font-serif-heading text-lg font-bold text-amber-300 flex items-center gap-2 mb-2">
              <Code className="w-5 h-5 text-amber-400" />
              1. How We Build It (Architecture & Offline Specs)
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Framework:</strong> Built as an offline HTML5 / React 19 / Vite single-page application bundled with high-precision <code className="text-amber-300">performance.now()</code> timer hooks for sub-millisecond accuracy.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Zero-Internet Execution:</strong> Runs completely standalone on Windows Mini PC or Mac in full-screen Chrome/Edge Kiosk Mode (<code className="text-amber-300">--kiosk --fullscreen</code>). No Wi-Fi required.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Web Audio Synthesizer:</strong> Procedural audio generation with zero audio file loading errors. Includes gavel strikes, victory fanfare, tick sounds, and near-miss chimes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Orientation Support:</strong> Native toggle between 16:9 Landscape (43" TV on roller stand) and 9:16 Vertical Portrait layouts.</span>
              </li>
            </ul>
          </div>

          {/* Question 2: Relevant Kiosk / USB Button Experience */}
          <div>
            <h3 className="font-serif-heading text-lg font-bold text-amber-300 flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              2. USB Arcade Button & Kiosk Hardware Experience
            </h3>
            <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 text-xs sm:text-sm space-y-2">
              <p>
                We specialize in trade show interactive kiosks and USB HID hardware integration. The USB arcade button connects as a standard Human Interface Device (HID) keyboard emulator:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <div className="font-bold text-amber-400 mb-1">Big Red USB Arcade Button:</div>
                  <p className="text-zinc-400 text-xs">
                    Programmed to send keycode <code className="text-white bg-zinc-800 px-1 rounded">Space</code> or <code className="text-white bg-zinc-800 px-1 rounded">Enter</code>. The app listens at the hardware input layer with debouncing to prevent accidental multi-triggers.
                  </p>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <div className="font-bold text-amber-400 mb-1">Kiosk Watchdog & Auto-Reset:</div>
                  <p className="text-zinc-400 text-xs">
                    Includes automatic 4-second reset timer, attract mode loop, cursor auto-hide, right-click lockout, and backup touch/mouse click trigger.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Question 3 & 4: Delivery Time & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/90 border border-amber-500/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                <Clock className="w-5 h-5" />
                Delivery Time
              </div>
              <div className="text-2xl font-black text-white my-1">3 - 5 Business Days</div>
              <p className="text-xs text-zinc-400">
                Includes full testing, custom brand styling, offline executable package, and Windows auto-boot script.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-amber-500/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                <DollarSign className="w-5 h-5" />
                All-Inclusive Price
              </div>
              <div className="text-2xl font-black text-white my-1">$1,250 USD</div>
              <p className="text-xs text-zinc-400">
                Fixed cost. Covers full kiosk development, admin panel, analytics CSV export, source code, and event support.
              </p>
            </div>
          </div>

          {/* Question 5: Source Code Inclusion Confirmation */}
          <div className="bg-emerald-950/40 border border-emerald-500/50 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-300 text-sm">
                100% Full Source Code & Project Files Included
              </div>
              <p className="text-zinc-300 text-xs mt-1">
                You will receive full ownership of the clean TypeScript/React codebase, Vite build scripts, pre-compiled standalone offline ZIP bundle, and step-by-step setup guide for your Windows Mini PC.
              </p>
            </div>
          </div>

          {/* Quick Hardware & Las Vegas Setup Guide */}
          <div className="border-t border-zinc-800 pt-4">
            <h4 className="font-serif-heading font-bold text-zinc-200 text-sm flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-amber-400" />
              Las Vegas Convention Setup Checklist:
            </h4>
            <ol className="list-decimal list-inside text-xs text-zinc-400 space-y-1">
              <li>Plug Windows Mini PC into 43" TV HDMI. Set screen resolution to 1920x1080.</li>
              <li>Plug USB Arcade Button into Windows Mini PC USB port.</li>
              <li>Double-click the provided <code className="text-amber-300">Launch_093_Verdict_Challenge.bat</code> shortcut.</li>
              <li>App launches in Chrome full-screen kiosk mode with audio enabled. Ready to play!</li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-800 pt-4 mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer"
          >
            Back to Interactive Demo
          </button>
        </div>
      </div>
    </div>
  );
};
