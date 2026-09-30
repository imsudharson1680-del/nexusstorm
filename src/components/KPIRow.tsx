import React from 'react';
import { CycloneScenario, CascadeSimulationResult } from '../types';
import { Wind, Network, AlertOctagon, Zap, ShieldCheck } from 'lucide-react';

interface KPIRowProps {
  scenario: CycloneScenario;
  simulationResult: CascadeSimulationResult | null;
  totalAssetsCount: number;
  criticalNodesCount: number;
}

export const KPIRow: React.FC<KPIRowProps> = ({
  scenario,
  simulationResult,
  totalAssetsCount,
  criticalNodesCount
}) => {
  const isCascadeActive = !!simulationResult;
  const cascadeRiskLevel = simulationResult ? simulationResult.cascadeRiskLevel : 'HIGH';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 my-3">
      {/* KPI 1: HAZARD INDEX */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-lg p-3 hover:border-[#38BDF8]/40 transition-colors relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
          <span className="font-mono tracking-wider font-semibold">HAZARD INDEX</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0B1220] border border-[#1E3A5F] text-[#38BDF8]">
            MODELLED
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-[#F8FAFC]">
            {scenario.hazardIndex}
          </span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            scenario.hazardLevel === 'CRITICAL' 
              ? 'text-[#EF4444] bg-[#EF4444]/15 border border-[#EF4444]/40'
              : scenario.hazardLevel === 'HIGH'
              ? 'text-[#F59E0B] bg-[#F59E0B]/15 border border-[#F59E0B]/40'
              : 'text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/40'
          }`}>
            {scenario.hazardLevel}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-[#94A3B8] flex items-center gap-1">
          <Wind className="w-3 h-3 text-[#38BDF8]" />
          <span>{scenario.windSpeedKmh} km/h wind &bull; {scenario.stormSurgeMeters}m surge</span>
        </div>
      </div>

      {/* KPI 2: ASSETS MONITORED */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-lg p-3 hover:border-[#38BDF8]/40 transition-colors relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
          <span className="font-mono tracking-wider font-semibold">ASSETS MONITORED</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0B1220] border border-[#1E3A5F] text-[#94A3B8]">
            SIMULATED
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-[#38BDF8]">
            {totalAssetsCount}
          </span>
          <span className="text-xs font-mono text-[#94A3B8]">
            7 SECTOR TYPES
          </span>
        </div>
        <div className="mt-1 text-[11px] text-[#94A3B8] flex items-center gap-1">
          <Network className="w-3 h-3 text-[#22D3EE]" />
          <span>Power, Roads, Hospital, Water</span>
        </div>
      </div>

      {/* KPI 3: CRITICAL NODES */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-lg p-3 hover:border-[#EF4444]/40 transition-colors relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
          <span className="font-mono tracking-wider font-semibold">CRITICAL NODES</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0B1220] border border-[#1E3A5F] text-[#EF4444]">
            MODELLED
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-[#EF4444]">
            {criticalNodesCount}
          </span>
          <span className="text-xs font-mono font-bold text-[#EF4444] px-1.5 py-0.5 rounded bg-[#EF4444]/10">
            ROOT RISK
          </span>
        </div>
        <div className="mt-1 text-[11px] text-[#94A3B8] flex items-center gap-1">
          <AlertOctagon className="w-3 h-3 text-[#EF4444]" />
          <span>Substation Alpha, Bridge Delta, Hosp B</span>
        </div>
      </div>

      {/* KPI 4: CASCADE RISK */}
      <div className={`border rounded-lg p-3 transition-colors relative overflow-hidden group ${
        isCascadeActive 
          ? 'bg-[#152238] border-[#EF4444]/60 shadow-glow-critical' 
          : 'bg-[#101A2B] border-[#1E3A5F] hover:border-[#F59E0B]/40'
      }`}>
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
          <span className="font-mono tracking-wider font-semibold">CASCADE RISK</span>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
            isCascadeActive ? 'bg-[#EF4444]/20 text-[#EF4444] animate-pulse font-bold' : 'bg-[#0B1220] text-[#F59E0B]'
          }`}>
            {isCascadeActive ? 'PROPAGATING' : 'SIMULATED'}
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className={`text-2xl lg:text-3xl font-extrabold font-mono ${
            cascadeRiskLevel === 'CRITICAL' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
          }`}>
            {cascadeRiskLevel}
          </span>
          {isCascadeActive && (
            <span className="text-xs font-mono text-[#EF4444] font-bold">
              +{simulationResult?.downstreamImpactCount} IMPACTED
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-[#94A3B8] flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#F59E0B]" />
          <span>{isCascadeActive ? 'Downstream lifelines tripping' : '3 Cascades within 4 hops'}</span>
        </div>
      </div>

      {/* KPI 5: NETWORK EXPOSURE */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-lg p-3 hover:border-[#38BDF8]/40 transition-colors relative overflow-hidden group col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
          <span className="font-mono tracking-wider font-semibold">NETWORK EXPOSURE</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0B1220] border border-[#1E3A5F] text-[#38BDF8]">
            MODELLED
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono text-[#F8FAFC]">
            ELEVATED
          </span>
          <span className="text-xs font-mono text-[#38BDF8]">
            84% REACH
          </span>
        </div>
        <div className="mt-1 text-[11px] text-[#94A3B8] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
          <span>Priority action plan ready</span>
        </div>
      </div>
    </div>
  );
};
