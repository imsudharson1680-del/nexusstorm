import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowRight, Activity, Cpu, Network } from 'lucide-react';

interface IntroSplashProps {
  onEnter: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onEnter }) => {
  const [initStage, setInitStage] = useState<number>(0);

  const initMessages = [
    'INITIALIZING HAZARD ENGINE (ATMOSPHERIC RADAR)...',
    'INITIALIZING INFRASTRUCTURE TOPOLOGICAL GRAPH...',
    'INITIALIZING CASCADE PROPAGATION SIMULATOR...',
    'SYSTEM READY — COMMAND CENTER ONLINE'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setInitStage(1), 500);
    const timer2 = setTimeout(() => setInitStage(2), 1000);
    const timer3 = setTimeout(() => setInitStage(3), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#050A12] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Background ambient circular rings */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-[#1E3A5F]/40 animate-ping opacity-20 pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full border border-[#38BDF8]/20 animate-pulse-slow pointer-events-none"></div>

      <div className="max-w-xl w-full space-y-6 relative z-10">
        {/* Brand Logo */}
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#101A2B] to-[#152238] border border-[#38BDF8]/50 shadow-glow-sky">
          <ShieldAlert className="w-12 h-12 text-[#38BDF8] animate-pulse" />
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-extrabold font-mono tracking-wider text-[#F8FAFC]">
            NEXUS<span className="text-[#38BDF8]">STORM</span>
          </h1>
          <p className="text-xs uppercase tracking-widest font-mono text-[#94A3B8]">
            CRITICAL INFRASTRUCTURE CASCADE INTELLIGENCE PLATFORM
          </p>
          <p className="text-sm font-medium text-[#38BDF8] italic pt-1">
            &ldquo;Predict the cascade. Protect the critical link.&rdquo;
          </p>
        </div>

        {/* Telemetry Initialization Progress */}
        <div className="bg-[#0B1220] border border-[#1E3A5F] rounded-xl p-4 font-mono text-xs text-left space-y-2">
          {initMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2.5 transition-opacity duration-300 ${
                idx <= initStage ? 'opacity-100 text-[#F8FAFC]' : 'opacity-25 text-[#94A3B8]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                idx <= initStage ? 'bg-[#38BDF8] shadow-glow-sky' : 'bg-[#1E3A5F]'
              }`} />
              <span className={idx === 3 && initStage >= 3 ? 'text-[#22C55E] font-bold' : ''}>
                {msg}
              </span>
            </div>
          ))}
        </div>

        {/* Enter Button */}
        <div>
          <button
            onClick={onEnter}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white font-mono text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-glow-sky flex items-center gap-2.5 mx-auto border border-[#38BDF8]/40"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
