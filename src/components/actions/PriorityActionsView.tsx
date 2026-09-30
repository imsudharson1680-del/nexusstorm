import React from 'react';
import { 
  PriorityAction, 
  InfrastructureNode, 
  CascadeSimulationResult 
} from '../../types';
import { 
  ShieldCheck, 
  Search, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Clock, 
  Download, 
  ArrowRight,
  Flame
} from 'lucide-react';

interface PriorityActionsViewProps {
  actions: PriorityAction[];
  selectedNode: InfrastructureNode;
  simulationResult: CascadeSimulationResult | null;
  onNavigateToAI: () => void;
  onTriggerSimulation: (nodeId: string) => void;
}

export const PriorityActionsView: React.FC<PriorityActionsViewProps> = ({
  actions,
  selectedNode,
  simulationResult,
  onNavigateToAI,
  onTriggerSimulation
}) => {
  const getCategoryBadge = (category: 'PROTECT' | 'INSPECT' | 'MONITOR' | 'VERIFY') => {
    switch (category) {
      case 'PROTECT':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          style: 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]'
        };
      case 'INSPECT':
        return {
          icon: <Search className="w-3.5 h-3.5" />,
          style: 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]'
        };
      case 'VERIFY':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          style: 'bg-[#38BDF8]/15 border-[#38BDF8]/40 text-[#38BDF8]'
        };
      case 'MONITOR':
      default:
        return {
          icon: <Activity className="w-3.5 h-3.5" />,
          style: 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
        };
    }
  };

  const isCascadeActive = !!simulationResult;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] font-bold">
              OPERATIONAL INTERVENTION PROTOCOL
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              {isCascadeActive ? 'DYNAMIC CASCADE SYNTHESIS' : 'BASELINE CRITICALITY SYNTHESIS'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            PRIORITY ACTION ENGINE
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            Ranked emergency resource pre-staging and infrastructure protection orders
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToAI}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#152238] border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#1E3A5F] font-mono text-xs font-semibold transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Decision Brief</span>
          </button>
        </div>
      </div>

      {/* Grid: Actions Table + Compact Emergency Decision Brief (Section 33) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranked Interventions (2 cols) */}
        <div className="lg:col-span-2 space-y-3.5">
          {actions.map((act) => {
            const badge = getCategoryBadge(act.category);
            return (
              <div
                key={act.id}
                className="bg-[#101A2B] border border-[#1E3A5F] hover:border-[#38BDF8]/50 rounded-xl p-4.5 transition-all shadow-lg relative group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold font-mono text-[#38BDF8] bg-[#0B1220] px-2.5 py-1 rounded border border-[#1E3A5F]">
                      0{act.rank}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border flex items-center gap-1.5 ${badge.style}`}>
                      {badge.icon}
                      {act.category}
                    </span>
                    <span className="text-xs font-mono text-[#94A3B8]">
                      {act.targetAssetName}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    act.urgency === 'IMMEDIATE'
                      ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 animate-pulse'
                      : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                  }`}>
                    {act.urgency}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#F8FAFC] tracking-tight pl-10">
                  {act.actionTitle}
                </h3>

                <p className="text-xs text-[#94A3B8] font-sans pl-10 mt-1">
                  <strong className="text-[#38BDF8] font-mono">Reason: </strong>
                  {act.rationale}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pl-10 mt-3 pt-2.5 border-t border-[#1E3A5F]/60 text-[11px] font-mono text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8]">LEAD AGENCY:</span>
                    <span className="text-[#F8FAFC]">{act.leadAgency}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#38BDF8]">
                    <Clock className="w-3 h-3" />
                    <span>TIMEFRAME: {act.estimatedTimeToImpact}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DECISION BRIEF CARD (Section 33 exact replica) */}
        <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#1E3A5F] pb-3">
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-widest">
                OPERATIONAL SUMMARY
              </span>
              <h3 className="text-base font-extrabold font-mono text-[#F8FAFC]">
                DECISION BRIEF
              </h3>
            </div>

            <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] font-mono text-xs space-y-3">
              <div>
                <div className="text-[10px] text-[#94A3B8]">Critical Node:</div>
                <div className="text-sm font-bold text-[#38BDF8]">
                  {simulationResult ? simulationResult.initiatingNodeName : selectedNode.name}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#94A3B8]">Modelled Risk:</div>
                <div className="text-sm font-bold text-[#EF4444]">
                  {selectedNode.riskIndex >= 85 ? 'CRITICAL' : 'HIGH'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#94A3B8]">Primary Concern:</div>
                <div className="text-xs text-[#F8FAFC] font-semibold">
                  {selectedNode.primaryDriver}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#94A3B8]">Potential Cascade:</div>
                <div className="text-xs text-[#22D3EE] font-semibold space-y-0.5 mt-0.5">
                  {simulationResult ? (
                    simulationResult.steps.slice(1).map(s => (
                      <div key={s.nodeId}>&bull; {s.nodeName}</div>
                    ))
                  ) : (
                    <>
                      <div>&bull; Highway 104 Coastal Trunk (Road C)</div>
                      <div>&bull; St. Jude Regional Trauma (Hospital B)</div>
                      <div>&bull; Harbor Heights Mega Shelter (Shelter D)</div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#94A3B8]">Recommended Intervention:</div>
                <div className="text-xs text-[#22C55E] font-semibold">
                  Protect / inspect {simulationResult ? simulationResult.initiatingNodeName.split(' ')[0] : selectedNode.name.split(' ')[0]}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E3A5F] flex items-center justify-between text-[10px] text-[#94A3B8]">
                <span>Data Mode:</span>
                <span className="text-[#38BDF8] font-bold">Simulation</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E3A5F]">
            <button
              onClick={onNavigateToAI}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-glow-sky flex items-center justify-center gap-2"
            >
              <span>OPEN AI DECISION BRIEF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
