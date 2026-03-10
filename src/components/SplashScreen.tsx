'use client';

import { Compass } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
      {/* Animated logo */}
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl " />
        <div className="relative p-5 bg-primary rounded-2xl shadow-2xl shadow-primary/40 ">
          <Compass className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Brand name */}
      <div className="text-center space-y-1 animate-pulse">
        <h1 className="text-3xl font-black text-primary tracking-tight">Travel Buddy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading experiences&hellip;</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full origin-left animate-[progress_1.4s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes progress {
          0%   { transform: scaleX(0); transform-origin: left; }
          50%  { transform: scaleX(1); transform-origin: left; }
          51%  { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
}
