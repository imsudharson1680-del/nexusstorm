import React from 'react';
import { 
  InfrastructureNode, 
  DependencyEdge, 
  CascadeSimulationResult 
} from '../../types';
import { 
  Flame, 
  ShieldAlert, 
  ArrowDownRight, 
  ArrowUpRight, 
  Zap, 
  AlertCircle, 
  Gauge, 
  Share2, 
  FileText,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { getRiskColorClass } from '../../engine/riskEngine';

interface IntelligencePanelProps {
  selectedNode: InfrastructureNode | null;
  allNodes: InfrastructureNode[];
  allEdges: DependencyEdge[];
  onTriggerSimulation: (nodeId: string) => void;
  simulationResult: CascadeSimulationResult | null;
  onSelectNode: (node: InfrastructureNode) => void;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  selectedNode,
  allNodes,
  allEdges,
  onTriggerSimulation,
  simulationResult,
  onSelectNode
}) => {
  if (!selectedNode) {
    return (
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-6 text-center flex flex-col items-center justify-center min-h-[500px]">
        <ShieldAlert className="w-12 h-12 text-[#94A3B8]/40 mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-[#F8FAFC]">No Asset Selected</h3>
        <p className="text-xs text-[#94A3B8] max-w-xs mt-1">
          Select an infrastructure pin on the map or choose an asset from the list to inspect its exposure, vulnerability, and cascade dependencies.
        </p>
      </div>
    );
  }

  const isFailedInCascade = simulationResult?.steps.some(
    s => s.nodeId === selectedNode.id && s.status === 'FAILED'
  );
  const isImpactedInCascade = simulationResult?.steps.some(
    s => s.nodeId === selectedNode.id && s.status === 'IMPACTED'
  );

  const riskLevel = selectedNode.riskIndex >= 85 ? 'CRITICAL' : selectedNode.riskIndex >= 70 ? 'HIGH' : selectedNode.riskIndex >= 40 ? 'MODERATE' : 'LOW';
  const riskColors = getRiskColorClass(riskLevel);

  const downstreamNodes = allNodes.filter(n => selectedNode.downstreamIds.includes(n.id));
  const upstreamNodes = allNodes.filter(n => selectedNode.upstreamIds.includes(n.id));

  return (
    <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-4 lg:p-5 flex flex-col gap-4 shadow-xl">
      {/* Node Header & Code */}
      <div className="border-b border-[#1E3A5F] pb-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#152238] border border-[#38BDF8]/40 text-[#38BDF8] font-bold">
            {selectedNode.code} &bull; {selectedNode.type}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            isFailedInCascade
              ? 'bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] animate-pulse'
              : isImpactedInCascade
              ? 'bg-[#F59E0B]/20 border border-[#F59E0B] text-[#F59E0B]'
              : 'bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E]'
          }`}>
            {isFailedInCascade ? 'FAILED (SIMULATED)' : isImpactedInCascade ? 'IMPACTED (DOWNSTREAM)' : 'OPERATIONAL'}
          </span>
        </div>

        <h2 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
          {selectedNode.name}
        </h2>
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#94A3B8] mt-1">
          <span>LAT: {selectedNode.lat.toFixed(3)}°N</span>
          <span>LNG: {selectedNode.lng.toFixed(3)}°E</span>
          <span>ELEV: {selectedNode.elevationMeters}m</span>
          <span>COAST: {selectedNode.distanceToCoastKm}km</span>
        </div>
      </div>

      {/* Hero Simulation Button */}
      <div className="bg-[#0B1220] p-3 rounded-lg border border-[#1E3A5F]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[#94A3B8]">WHAT-IF SCENARIO:</span>
          <span className="text-[10px] font-mono text-[#EF4444] font-semibold">HERO SIMULATION</span>
        </div>
        <button
          onClick={() => onTriggerSimulation(selectedNode.id)}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#EF4444] via-[#DC2626] to-[#B91C1C] hover:brightness-110 active:scale-[0.98] transition-all text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-glow-critical border border-[#EF4444]/60"
        >
          <Flame className="w-4 h-4 animate-bounce" />
          <span>SIMULATE FAILURE</span>
        </button>
        <p className="text-[10px] text-[#94A3B8] text-center mt-1.5 font-mono">
          &ldquo;What happens if this critical node fails?&rdquo;
        </p>
      </div>

      {/* Prototype Risk Index Score Box */}
      <div className={`p-3.5 rounded-lg border ${riskColors.border} ${riskColors.bg}`}>
        <div className="flex items-center justify-between text-xs font-mono mb-1">
          <span className="font-semibold text-[#94A3B8]">PROTOTYPE RISK INDEX</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0B1220] text-[#94A3B8]">0–100 SCALE</span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${riskColors.text}`}>
              {selectedNode.riskIndex}
            </span>
            <span className="text-xs font-mono text-[#94A3B8]">/ 100</span>
          </div>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${riskColors.bg} ${riskColors.text} border ${riskColors.border}`}>
            {riskLevel} RISK
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-[#050A12] h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              riskLevel === 'CRITICAL' ? 'bg-[#EF4444]' : riskLevel === 'HIGH' ? 'bg-[#F59E0B]' : 'bg-[#38BDF8]'
            }`}
            style={{ width: `${selectedNode.riskIndex}%` }}
          ></div>
        </div>
      </div>

      {/* Four Core Diagnostic Meters */}
      <div className="space-y-2.5">
        {/* 1. EXPOSURE */}
        <div className="bg-[#0B1220] p-2.5 rounded-lg border border-[#1E3A5F]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-[#94A3B8]">EXPOSURE</span>
            <span className="font-mono font-bold text-[#F8FAFC]">{selectedNode.exposure} / 100</span>
          </div>
          <div className="w-full bg-[#101A2B] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-[#38BDF8] rounded-full" style={{ width: `${selectedNode.exposure}%` }}></div>
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">
            {selectedNode.exposure >= 75 ? 'HIGH' : selectedNode.exposure >= 45 ? 'MODERATE' : 'LOW'} hazard exposure in coastal track
          </p>
        </div>

        {/* 2. VULNERABILITY */}
        <div className="bg-[#0B1220] p-2.5 rounded-lg border border-[#1E3A5F]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-[#94A3B8]">VULNERABILITY</span>
            <span className="font-mono font-bold text-[#F8FAFC]">{selectedNode.vulnerability} / 100</span>
          </div>
          <div className="w-full bg-[#101A2B] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${selectedNode.vulnerability}%` }}></div>
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">
            Low-lying critical asset with high service fragility
          </p>
        </div>

        {/* 3. NETWORK DEPENDENCY */}
        <div className="bg-[#0B1220] p-2.5 rounded-lg border border-[#1E3A5F]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-[#22D3EE] font-bold">NETWORK DEPENDENCY</span>
            <span className="font-mono font-bold text-[#22D3EE]">{selectedNode.dependency} / 100</span>
          </div>
          <div className="w-full bg-[#101A2B] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-[#22D3EE] rounded-full shadow-glow-cyan" style={{ width: `${selectedNode.dependency}%` }}></div>
          </div>
          <p className="text-[10px] text-[#22D3EE]/90 mt-1 font-mono">
            Multiple downstream critical services depend on this node
          </p>
        </div>

        {/* 4. CRITICALITY */}
        <div className="bg-[#0B1220] p-2.5 rounded-lg border border-[#1E3A5F]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-[#EF4444] font-semibold">NETWORK CRITICALITY</span>
            <span className="font-mono font-bold text-[#EF4444]">{selectedNode.criticality} / 100</span>
          </div>
          <div className="w-full bg-[#101A2B] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${selectedNode.criticality}%` }}></div>
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">
            Prototype Network Criticality (Hazard + Vuln + Dependency + Reach)
          </p>
        </div>
      </div>

      {/* WHY IS THIS ASSET HIGH RISK? (Required Master Prompt Card) */}
      <div className="bg-[#0B1220] border border-[#1E3A5F] rounded-lg p-3 font-mono text-xs space-y-2">
        <div className="text-[11px] font-bold text-[#F8FAFC] tracking-wider border-b border-[#1E3A5F] pb-1 flex items-center justify-between">
          <span>WHY IS THIS ASSET HIGH RISK?</span>
          <span className="text-[9px] text-[#38BDF8]">DEMO MODE</span>
        </div>

        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between text-[#94A3B8]">
            <span>Hazard contribution</span>
            <span className="text-[#F8FAFC] font-bold">{selectedNode.hazardContribution}%</span>
          </div>
          <div className="flex justify-between text-[#94A3B8]">
            <span>Exposure contribution</span>
            <span className="text-[#F8FAFC] font-bold">{selectedNode.exposureContribution}%</span>
          </div>
          <div className="flex justify-between text-[#94A3B8]">
            <span>Vulnerability contribution</span>
            <span className="text-[#F8FAFC] font-bold">{selectedNode.vulnerabilityContribution}%</span>
          </div>
          <div className="flex justify-between text-[#22D3EE]">
            <span>Network dependency</span>
            <span className="font-bold">{selectedNode.dependencyContribution}%</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1E3A5F]/60 text-[11px]">
          <div className="text-[#94A3B8]">PRIMARY DRIVER:</div>
          <div className="text-[#38BDF8] font-bold">{selectedNode.primaryDriver}</div>
        </div>

        <div className="text-[11px]">
          <div className="text-[#94A3B8] mb-1">DOWNSTREAM SERVICES:</div>
          <div className="flex flex-wrap gap-1">
            {downstreamNodes.length > 0 ? (
              downstreamNodes.map(n => (
                <button
                  key={n.id}
                  onClick={() => onSelectNode(n)}
                  className="px-2 py-0.5 rounded bg-[#101A2B] border border-[#1E3A5F] hover:border-[#38BDF8] text-[10px] text-[#F8FAFC] transition-colors"
                >
                  {n.code} &bull; {n.name.split(' ')[0]}
                </button>
              ))
            ) : (
              <span className="text-[#94A3B8] italic text-[10px]">No direct downstream lifelines</span>
            )}
          </div>
        </div>

        <div className="pt-1.5 border-t border-[#1E3A5F]/60 flex items-center justify-between text-[10px] text-[#94A3B8]">
          <span>MODEL STATUS:</span>
          <span className="text-[#38BDF8]">Prototype / Simulation</span>
        </div>

        <div className="text-[10px] text-[#94A3B8] bg-[#101A2B] p-2 rounded border border-[#1E3A5F]">
          <span className="text-[#F8FAFC] font-bold">WHY THIS MATTERS: </span>
          Failure of this node may propagate through connected infrastructure lifelines.
        </div>
      </div>
    </div>
  );
};
