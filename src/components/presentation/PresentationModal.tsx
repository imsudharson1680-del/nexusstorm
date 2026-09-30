import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  ShieldAlert, 
  Flame, 
  HelpCircle, 
  Sparkles,
  Award
} from 'lucide-react';
import { CycloneScenario, InfrastructureNode, CascadeSimulationResult } from '../../types';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: CycloneScenario;
  selectedNode: InfrastructureNode;
  simulationResult: CascadeSimulationResult | null;
  onTriggerSimulation: (nodeId: string) => void;
  onReset: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  scenario,
  selectedNode,
  simulationResult,
  onTriggerSimulation,
  onReset
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [showJudgeAnswers, setShowJudgeAnswers] = useState<boolean>(false);

  const demoSteps = [
    {
      timeRange: '0–5s',
      title: 'TITLE & VISION',
      narration: '"During a cyclone, critical infrastructure does not fail in isolation. Predict the cascade. Protect the critical link."',
      highlight: 'NEXUSSTORM: AI-Assisted Critical Infrastructure Cascade Intelligence',
      badge: 'VISION'
    },
    {
      timeRange: '5–15s',
      title: 'COMMAND CENTER & MONITORING',
      narration: '"We monitor 12 multi-sector coastal assets: power transmission, arterial transit, trauma hospitals, mega-shelters, and desalination."',
      highlight: 'Single pane of glass across multi-sector lifelines',
      badge: 'MONITORING'
    },
    {
      timeRange: '15–25s',
      title: 'CYCLONE HAZARD FIELD & EXPOSURE',
      narration: '"NEXUSSTORM combines meteorological hazard parameters (175 km/h wind, 2.4m surge) with topological infrastructure exposure."',
      highlight: 'Severe Cyclone Scenario: Hazard Index 78 / HIGH',
      badge: 'HAZARD'
    },
    {
      timeRange: '25–38s',
      title: 'CRITICAL NODE INSPECTION (SUBSTATION ALPHA)',
      narration: '"Substation Alpha has 82/100 exposure, 71/100 vulnerability, but 94/100 network dependency. Downstream lifelines rely entirely on this node."',
      highlight: 'Primary Driver: Network Dependency (26% factor contribution)',
      badge: 'DIAGNOSIS'
    },
    {
      timeRange: '38–55s',
      title: 'HERO CASCADE SIMULATION (SIMULATE FAILURE)',
      narration: '"Now we ask the question ordinary maps cannot answer: What happens if Substation Alpha fails? Watch the cascade propagate: T+00 Substation A → T+02 Road C → T+04 Hospital B → T+06 Shelter D."',
      highlight: 'Topological failure wave traveling across lifelines',
      badge: 'HERO MOMENT',
      actionTrigger: true
    },
    {
      timeRange: '55–68s',
      title: 'CASCADE ALERT & IMPACT RECOGNITION',
      narration: '"Cascade Detected! 1 direct node failure ripples into 3 downstream nodes and compromises 2 life-safety emergency services."',
      highlight: 'Downstream Impact: Highway 104 flooded, Trauma center on emergency diesel, Mega shelter isolated',
      badge: 'CASCADE ALERT'
    },
    {
      timeRange: '68–78s',
      title: 'PRIORITY ACTION ENGINE',
      narration: '"The system automatically synthesizes ranked operational orders: 01 Protect Substation Alpha, 02 Inspect Highway 104 underpasses, 03 Verify Hospital diesel reserves."',
      highlight: 'Actionable intervention protocol before landfall',
      badge: 'ACTIONS'
    },
    {
      timeRange: '78–87s',
      title: 'AI DECISION BRIEF (GEMINI REASONING)',
      narration: '"Gemini translates structured graph metrics into an executive 4-quadrant commander brief: Why this node? What could happen? What is most critical? What should be done?"',
      highlight: 'Transparent AI reasoning with multi-factor attribution',
      badge: 'GEMINI AI'
    },
    {
      timeRange: '87–90s',
      title: 'FINAL PRODUCT STATEMENT',
      narration: '"We don\'t just predict where the cyclone hits. We predict how infrastructure failure can cascade. PREDICT THE CASCADE. PROTECT THE CRITICAL LINK."',
      highlight: 'NEXUSSTORM: Disaster intelligence redefined',
      badge: 'CONCLUSION'
    }
  ];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlayingAuto && isOpen) {
      timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < demoSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlayingAuto(false);
            return prev;
          }
        });
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlayingAuto, isOpen, demoSteps.length]);

  // Trigger failure simulation when reaching hero step 4
  useEffect(() => {
    if (currentStep === 4 && !simulationResult) {
      onTriggerSimulation('substation-alpha');
    }
  }, [currentStep, simulationResult, onTriggerSimulation]);

  if (!isOpen) return null;

  const step = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-[#050A12]/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#0B1220] border-2 border-[#38BDF8] rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Top Controls */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                PRESENTATION MODE & 90s TOUR
              </span>
              <span className="text-xs font-mono text-[#94A3B8]">
                STEP {currentStep + 1} OF {demoSteps.length} &bull; {step.timeRange}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowJudgeAnswers(!showJudgeAnswers)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded bg-[#152238] border border-[#1E3A5F] text-[#F8FAFC] hover:border-[#38BDF8]"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{showJudgeAnswers ? 'Hide Judge Q&A' : 'Judge Q&A Cheat Sheet'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#152238] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Judge Q&A Popout */}
          {showJudgeAnswers && (
            <div className="mt-4 p-4 rounded-xl bg-[#101A2B] border border-[#38BDF8]/50 font-mono text-xs space-y-2.5 max-h-60 overflow-y-auto">
              <div className="font-bold text-[#38BDF8] border-b border-[#1E3A5F] pb-1">
                EXECUTIVE JUDGE QUESTIONS & ANSWERS (SECTION 61)
              </div>
              <div>
                <strong className="text-[#F8FAFC]">Q: What problem are you solving?</strong>
                <p className="text-[#94A3B8] font-sans">
                  Disaster infrastructure is interconnected. A cyclone triggers cascading service disruptions. We model dependencies before landfall.
                </p>
              </div>
              <div>
                <strong className="text-[#F8FAFC]">Q: What is different from ordinary maps?</strong>
                <p className="text-[#94A3B8] font-sans">
                  We don&apos;t just map hazard exposure. We simulate infrastructure failure propagation and identify the critical root link.
                </p>
              </div>
              <div>
                <strong className="text-[#F8FAFC]">Q: Where is AI used?</strong>
                <p className="text-[#94A3B8] font-sans">
                  AI acts as the reasoning and explanation layer after the deterministic risk and dependency engine identifies critical nodes and cascade outcomes.
                </p>
              </div>
              <div>
                <strong className="text-[#F8FAFC]">Q: Why use a graph?</strong>
                <p className="text-[#94A3B8] font-sans">
                  Infrastructure lifelines are inherently graphs. Directed graph propagation enables topological cascade tracing.
                </p>
              </div>
            </div>
          )}

          {/* Current Step Showcase */}
          <div className="py-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444]">
                {step.badge}
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                {step.title}
              </h2>
            </div>

            {/* Narration Script Quote */}
            <div className="bg-[#101A2B] border-l-4 border-l-[#38BDF8] p-4 rounded-r-xl">
              <div className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider mb-1">
                90-SECOND DEMO SCRIPT NARRATION:
              </div>
              <p className="text-sm lg:text-base text-[#F8FAFC] font-medium italic leading-relaxed">
                {step.narration}
              </p>
            </div>

            {/* Visual Highlight */}
            <div className="p-3.5 rounded-lg bg-[#152238] border border-[#1E3A5F] flex items-center justify-between font-mono text-xs">
              <span className="text-[#94A3B8]">KEY PRODUCT HIGHLIGHT:</span>
              <span className="text-[#38BDF8] font-bold">{step.highlight}</span>
            </div>
          </div>
        </div>

        {/* Step Progression Indicators & Nav Buttons */}
        <div className="pt-4 border-t border-[#1E3A5F] space-y-4">
          <div className="grid grid-cols-9 gap-1.5">
            {demoSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-[#38BDF8] shadow-glow-sky'
                    : idx < currentStep
                    ? 'bg-[#2563EB]'
                    : 'bg-[#1E3A5F]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isPlayingAuto
                    ? 'bg-[#F59E0B] text-[#050A12]'
                    : 'bg-[#152238] border border-[#1E3A5F] text-[#F8FAFC] hover:border-[#38BDF8]'
                }`}
              >
                {isPlayingAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAuto ? 'Pause Tour' : 'Auto Play'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentStep(0);
                  onReset();
                }}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white bg-[#101A2B] border border-[#1E3A5F]"
                title="Restart Tour from 0s"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#152238] text-xs font-mono text-[#F8FAFC] border border-[#1E3A5F] disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => {
                  if (currentStep < demoSteps.length - 1) {
                    setCurrentStep(s => s + 1);
                  } else {
                    onClose();
                  }
                }}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#38BDF8] text-xs font-mono text-[#050A12] font-bold hover:brightness-110 active:scale-95 transition-all shadow-glow-sky"
              >
                <span>{currentStep === demoSteps.length - 1 ? 'Finish & Explore' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
