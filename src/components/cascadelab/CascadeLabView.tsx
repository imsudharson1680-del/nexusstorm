import React, { useState, useEffect } from 'react';
import { 
  InfrastructureNode, 
  DependencyEdge, 
  CascadeSimulationResult, 
  CascadeStep 
} from '../../types';
import { 
  Flame, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Zap, 
  Activity, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  Play, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';

interface CascadeLabViewProps {
  allNodes: InfrastructureNode[];
  allEdges: DependencyEdge[];
  selectedNode: InfrastructureNode;
  onSelectNode: (node: InfrastructureNode) => void;
  simulationResult: CascadeSimulationResult | null;
  onTriggerSimulation: (nodeId: string) => void;
  onReset: () => void;
  onNavigateToActions: () => void;
  onNavigateToAI: () => void;
}

export const CascadeLabView: React.FC<CascadeLabViewProps> = ({
  allNodes,
  allEdges,
  selectedNode,
  onSelectNode,
  simulationResult,
  onTriggerSimulation,
  onReset,
  onNavigateToActions,
  onNavigateToAI
}) => {
  const [animatedStepIndex, setAnimatedStepIndex] = useState<number>(-1);
  const [isSimulatingTimeline, setIsSimulatingTimeline] = useState<boolean>(false);

  // When a new simulation starts, animate steps sequentially (T+00, T+02, T+04...)
  useEffect(() => {
    if (simulationResult && simulationResult.steps.length > 0) {
      setIsSimulatingTimeline(true);
      setAnimatedStepIndex(0);

      const interval = setInterval(() => {
        setAnimatedStepIndex(prev => {
          if (prev < simulationResult.steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsSimulatingTimeline(false);
            return prev;
          }
        });
      }, 700);

      return () => clearInterval(interval);
    } else {
      setAnimatedStepIndex(-1);
      setIsSimulatingTimeline(false);
    }
  }, [simulationResult]);

  const activeSteps = simulationResult
    ? simulationResult.steps.slice(0, animatedStepIndex + 1)
    : [];

  return (
    <div className="space-y-6">
      {/* Title & Subtitle Banner */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#EF4444]/10 via-[#38BDF8]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                SIMULATION LAB 05
              </span>
              <span className="text-[10px] font-mono text-[#94A3B8]">
                HERO CASCADE ENGINE
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              CASCADE LAB
            </h1>
            <p className="text-sm text-[#38BDF8] font-mono mt-1">
              &ldquo;What happens if this critical node fails?&rdquo;
            </p>
          </div>

          {/* Quick Node Selector Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#94A3B8] mr-1">SELECT NODE:</span>
            {allNodes.slice(0, 5).map(node => (
              <button
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedNode.id === node.id
                    ? 'bg-[#38BDF8] text-[#050A12] font-bold shadow-glow-sky'
                    : 'bg-[#152238] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E3A5F]'
                }`}
              >
                {node.code}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-5 pt-4 border-t border-[#1E3A5F] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <span>SELECTED ROOT:</span>
            <span className="text-[#F8FAFC] font-bold">{selectedNode.name}</span>
            <span className="text-[#38BDF8]">({selectedNode.downstreamIds.length} downstream links)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onTriggerSimulation(selectedNode.id)}
              disabled={isSimulatingTimeline}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#EF4444] to-[#B91C1C] hover:brightness-110 active:scale-95 transition-all text-white font-mono text-xs font-bold shadow-glow-critical border border-[#EF4444]/60 disabled:opacity-50"
            >
              <Flame className="w-4 h-4 animate-bounce" />
              <span>SIMULATE FAILURE</span>
            </button>

            {simulationResult && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-lg bg-[#152238] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E3A5F] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cascade</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CASCADE ALERT BANNER (Section 29) */}
      {simulationResult && (
        <div className="bg-[#152238] border-2 border-[#EF4444] rounded-xl p-4 lg:p-5 shadow-glow-critical animate-pulse-slow">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444]">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold font-mono text-[#EF4444] tracking-wider">
                    ⚠ CASCADE DETECTED
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 font-bold">
                    PROPAGATING
                  </span>
                </div>
                <div className="text-xs font-mono text-[#F8FAFC] mt-1">
                  CRITICAL NODE: <span className="text-[#38BDF8] font-bold">{simulationResult.initiatingNodeName}</span>
                </div>
                <div className="text-xs font-mono text-[#94A3B8] mt-0.5">
                  DOWNSTREAM IMPACT: <span className="text-[#F8FAFC] font-semibold">
                    {simulationResult.steps.slice(1).map(s => s.nodeName.split(' ')[0]).join(' → ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <div className="text-[10px] text-[#94A3B8]">NETWORK STATUS</div>
                <div className="text-sm font-extrabold text-[#EF4444]">
                  {simulationResult.cascadeRiskLevel} CASCADE RISK
                </div>
              </div>
              <button
                onClick={onNavigateToActions}
                className="px-4 py-2 rounded-lg bg-[#38BDF8] text-[#050A12] font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-glow-sky"
              >
                VIEW ACTIONS →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Cascade Timeline (Section 28) + Impact Summary (Section 31) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cascade Timeline (2 cols) */}
        <div className="lg:col-span-2 bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="text-sm font-bold font-mono text-[#F8FAFC]">
                CASCADE PROPAGATION TIMELINE
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B1220] border border-[#1E3A5F] text-[#38BDF8]">
              SIMULATED PROPAGATION
            </span>
          </div>

          {activeSteps.length === 0 ? (
            <div className="py-12 text-center text-[#94A3B8] font-mono text-xs">
              <Activity className="w-10 h-10 mx-auto text-[#1E3A5F] mb-3" />
              <span>Click &quot;SIMULATE FAILURE&quot; to initiate time-stepped cascade propagation</span>
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1E3A5F]">
              {activeSteps.map((step, idx) => {
                const isInitiating = idx === 0;
                return (
                  <div
                    key={step.nodeId}
                    className={`relative p-3.5 rounded-lg border transition-all duration-300 ${
                      isInitiating
                        ? 'bg-[#152238] border-[#EF4444]/60 shadow-glow-critical'
                        : 'bg-[#0B1220] border-[#1E3A5F]'
                    }`}
                  >
                    {/* Timeline bullet on vertical line */}
                    <div className={`absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 ${
                      isInitiating
                        ? 'bg-[#EF4444] border-white animate-ping'
                        : 'bg-[#F59E0B] border-[#0B1220]'
                    }`}></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#38BDF8] px-1.5 py-0.5 rounded bg-[#101A2B]">
                          {step.timeStep}
                        </span>
                        <span className="font-bold text-sm text-[#F8FAFC]">
                          {step.nodeName}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded self-start ${
                        step.status === 'FAILED'
                          ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                          : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                      }`}>
                        {step.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#94A3B8] font-mono mt-1">
                      <span className="text-[#38BDF8]">MECHANISM:</span> {step.cause}
                    </div>

                    <div className="text-xs text-[#F8FAFC] font-sans mt-1.5 bg-[#101A2B] p-2 rounded border border-[#1E3A5F]/60">
                      {step.operationalImpact}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Impact Summary (Section 31) */}
        <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <span className="text-sm font-bold font-mono text-[#F8FAFC]">
                IMPACT SUMMARY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B1220] text-[#94A3B8]">
                SIMULATION OUTPUT
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-[#0B1220] p-3 rounded-lg border border-[#1E3A5F]">
                <div className="text-[11px] font-mono text-[#94A3B8]">DIRECT IMPACT</div>
                <div className="text-2xl font-bold font-mono text-[#EF4444]">
                  {simulationResult ? simulationResult.directImpactCount : 0} NODE
                </div>
              </div>

              <div className="bg-[#0B1220] p-3 rounded-lg border border-[#1E3A5F]">
                <div className="text-[11px] font-mono text-[#94A3B8]">DOWNSTREAM IMPACT</div>
                <div className="text-2xl font-bold font-mono text-[#F59E0B]">
                  {simulationResult ? simulationResult.downstreamImpactCount : 0} NODES
                </div>
              </div>

              <div className="bg-[#0B1220] p-3 rounded-lg border border-[#1E3A5F]">
                <div className="text-[11px] font-mono text-[#94A3B8]">CRITICAL SERVICES</div>
                <div className="text-2xl font-bold font-mono text-[#38BDF8]">
                  {simulationResult ? simulationResult.criticalServicesImpactedCount : 0} SERVICES
                </div>
              </div>

              <div className="bg-[#0B1220] p-3 rounded-lg border border-[#1E3A5F]">
                <div className="text-[11px] font-mono text-[#94A3B8]">EMERGENCY ACCESS</div>
                <div className={`text-lg font-bold font-mono ${
                  simulationResult?.emergencyAccessAtRisk ? 'text-[#EF4444]' : 'text-[#22C55E]'
                }`}>
                  {simulationResult?.emergencyAccessAtRisk ? 'AT RISK / CONGESTED' : 'CLEAR'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E3A5F] mt-4 space-y-2">
            <button
              onClick={onNavigateToActions}
              className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 transition-all text-white font-mono text-xs font-bold text-center"
            >
              PRODUCE PRIORITY ACTIONS
            </button>
            <button
              onClick={onNavigateToAI}
              className="w-full py-2 rounded-lg bg-[#152238] hover:bg-[#1E3A5F] active:scale-95 transition-all text-[#38BDF8] border border-[#38BDF8]/40 font-mono text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Gemini to Explain Cascade</span>
            </button>
          </div>
        </div>
      </div>

      {/* BEFORE / AFTER Comparison Table (Section 30) */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold font-mono text-[#F8FAFC]">
              BEFORE & AFTER SIMULATED FAILURE STATE COMPARISON
            </h2>
            <p className="text-xs text-[#94A3B8] font-sans">
              Systemic service disruption across monitored municipal sectors
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B1220] text-[#38BDF8] border border-[#1E3A5F]">
            TRANSITION AUDIT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1E3A5F] text-[#94A3B8]">
                <th className="py-2.5 px-3">INFRASTRUCTURE SECTOR</th>
                <th className="py-2.5 px-3">BASELINE (BEFORE)</th>
                <th className="py-2.5 px-3">SIMULATED (AFTER FAILURE)</th>
                <th className="py-2.5 px-3">OPERATIONAL IMPACT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/60">
              <tr>
                <td className="py-3 px-3 text-[#F8FAFC] font-bold flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>POWER GRID (Substation Alpha)</span>
                </td>
                <td className="py-3 px-3 text-[#22C55E]">NORMAL (49.98 Hz)</td>
                <td className="py-3 px-3 font-bold text-[#EF4444]">
                  {simulationResult ? 'FAILED (TRIPPED BUS)' : 'NORMAL'}
                </td>
                <td className="py-3 px-3 text-[#94A3B8] font-sans text-xs">
                  Regional 400kV high-voltage lines de-energized
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#F8FAFC] font-bold flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>COASTAL ROADWAY (Highway 104)</span>
                </td>
                <td className="py-3 px-3 text-[#22C55E]">NORMAL / OPEN</td>
                <td className="py-3 px-3 font-bold text-[#EF4444]">
                  {simulationResult ? 'IMPACTED / INUNDATED' : 'NORMAL'}
                </td>
                <td className="py-3 px-3 text-[#94A3B8] font-sans text-xs">
                  Traffic signals blacked out; underpass pumps disabled
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#F8FAFC] font-bold flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>REGIONAL TRAUMA (Hospital Bravo)</span>
                </td>
                <td className="py-3 px-3 text-[#22C55E]">NORMAL (GRID POWER)</td>
                <td className="py-3 px-3 font-bold text-[#F59E0B]">
                  {simulationResult ? 'AT RISK (DIESEL GENERATOR)' : 'NORMAL'}
                </td>
                <td className="py-3 px-3 text-[#94A3B8] font-sans text-xs">
                  Life-support on 48h emergency diesel; ambulance ingress cut
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#F8FAFC] font-bold flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>EVACUATION SHELTER (Shelter Delta)</span>
                </td>
                <td className="py-3 px-3 text-[#22C55E]">NORMAL (ACTIVE)</td>
                <td className="py-3 px-3 font-bold text-[#F59E0B]">
                  {simulationResult ? 'AT RISK (ISOLATED)' : 'NORMAL'}
                </td>
                <td className="py-3 px-3 text-[#94A3B8] font-sans text-xs">
                  Ventilation loss; relief supply road inaccessible
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#F8FAFC] font-bold flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>DESALINATION & WATER (Water Echo)</span>
                </td>
                <td className="py-3 px-3 text-[#22C55E]">NORMAL (45 MLD)</td>
                <td className="py-3 px-3 font-bold text-[#EF4444]">
                  {simulationResult ? 'FAILED (ZERO PRESSURE)' : 'NORMAL'}
                </td>
                <td className="py-3 px-3 text-[#94A3B8] font-sans text-xs">
                  Potable drinking water and hospital autoclave water severed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
