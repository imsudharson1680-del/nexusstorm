import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  RotateCcw, 
  Play, 
  Presentation, 
  Sliders, 
  Radio, 
  Compass, 
  Volume2, 
  VolumeX,
  Sparkles
} from 'lucide-react';
import { CycloneScenario } from '../types';

interface HeaderProps {
  scenario: CycloneScenario;
  onReset: () => void;
  onOpenPresentation: () => void;
  onOpenQuickDemo: () => void;
  isSimulating: boolean;
  hasActiveCascade: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  scenario,
  onReset,
  onOpenPresentation,
  onOpenQuickDemo,
  isSimulating,
  hasActiveCascade
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toUTCString().replace('GMT', 'UTC') + ' | ' + now.toLocaleTimeString() + ' LOCAL'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#0B1220]/95 backdrop-blur border-b border-[#1E3A5F] px-4 py-2.5 sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#101A2B] to-[#152238] border border-[#38BDF8]/40 shadow-glow-sky">
            <ShieldAlert className="w-5 h-5 text-[#38BDF8] animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EF4444]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-extrabold tracking-wider text-[#F8FAFC] font-mono flex items-center gap-2">
                NEXUS<span className="text-[#38BDF8]">STORM</span>
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-[#101A2B] border border-[#1E3A5F] text-[#94A3B8]">
                CASCADE INTELLIGENCE
              </span>
              <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                SIMULATION ACTIVE
              </span>
              {hasActiveCascade && (
                <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#EF4444]/20 border border-[#EF4444]/60 text-[#EF4444] animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping"></span>
                  ⚠ CASCADE RUNNING
                </span>
              )}
            </div>
            <p className="text-xs text-[#94A3B8] font-medium tracking-tight">
              &ldquo;Predict the cascade. Protect the critical link.&rdquo; &bull; AI-Assisted Infrastructure Cascade Platform
            </p>
          </div>
        </div>

        {/* Middle Telemetry / Scenario Indicator */}
        <div className="hidden xl:flex items-center gap-4 bg-[#101A2B]/80 px-4 py-1.5 rounded-lg border border-[#1E3A5F] text-xs font-mono">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>SCENARIO:</span>
            <span className="text-[#38BDF8] font-bold">{scenario.categoryName.split(' ')[0]} {scenario.categoryName.split(' ')[1]}</span>
          </div>
          <span className="text-[#1E3A5F]">|</span>
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <Radio className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>WINDS:</span>
            <span className="text-[#F8FAFC] font-bold">{scenario.windSpeedKmh} km/h</span>
          </div>
          <span className="text-[#1E3A5F]">|</span>
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <span>SURGE:</span>
            <span className="text-[#EF4444] font-bold">+{scenario.stormSurgeMeters}m</span>
          </div>
          <span className="text-[#1E3A5F]">|</span>
          <div className="text-[11px] text-[#94A3B8]">
            {currentTime}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenQuickDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white hover:brightness-110 active:scale-95 transition-all shadow-glow-sky border border-[#38BDF8]/40"
            title="Launch automated 90-second product demo tour"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>90s Demo Tour</span>
          </button>

          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#152238] text-[#F8FAFC] hover:bg-[#1E3A5F] active:scale-95 transition-all border border-[#1E3A5F]"
            title="Open Presentation Mode for Judges"
          >
            <Presentation className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Presentation</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#101A2B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#152238] active:scale-95 transition-all border border-[#1E3A5F]"
            title="Reset simulation to initial baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-md bg-[#101A2B] text-[#94A3B8] hover:text-[#38BDF8] border border-[#1E3A5F] transition-colors"
            title={soundEnabled ? 'Telemetry Audio Active' : 'Telemetry Audio Muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
