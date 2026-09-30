import React from 'react';
import { Layers, ArrowDown, Cpu, Sparkles, Network, Database, ShieldAlert, GitBranch } from 'lucide-react';

export const SystemArchitectureView: React.FC = () => {
  const pipelineSteps = [
    {
      title: 'LAYER 1: MULTI-MODAL DATA INGESTION',
      desc: 'Tropical Cyclone Track Telemetry + Copernicus Earth Observation + Municipal GIS Infrastructure Nodes + Multi-Sector Dependency Matrix',
      icon: <Database className="w-5 h-5 text-[#38BDF8]" />,
      tag: 'SIMULATED & GIS SOURCES'
    },
    {
      title: 'LAYER 2: PHYSICAL HAZARD ENGINE',
      desc: 'Eye-wall radius attenuation, sustained wind field shear, coastal storm surge hydrodynamics, and digital elevation model (DEM) inundation',
      icon: <Cpu className="w-5 h-5 text-[#22D3EE]" />,
      tag: 'DETERMINISTIC PHYSICS'
    },
    {
      title: 'LAYER 3: INFRASTRUCTURE RISK ENGINE',
      desc: 'Interpretable Composite Risk = Hazard (31%) × Exposure (24%) × Vulnerability (19%) × Network Dependency (26%)',
      icon: <ShieldAlert className="w-5 h-5 text-[#F59E0B]" />,
      tag: 'NORMALIZED 0-100'
    },
    {
      title: 'LAYER 4: TOPOLOGICAL DEPENDENCY GRAPH',
      desc: 'Directed graph modeling electrical power, transit access, cooling water, and SCADA telemetry interconnections across lifelines',
      icon: <Network className="w-5 h-5 text-[#38BDF8]" />,
      tag: 'DIRECTED ACYCLIC GRAPH'
    },
    {
      title: 'LAYER 5: GRAPH-BASED CASCADE SIMULATION ENGINE',
      desc: 'Time-stepped failure wave propagation (T+00 to T+08), redundancy threshold checks, and secondary service disruption modeling',
      icon: <GitBranch className="w-5 h-5 text-[#EF4444]" />,
      tag: 'HERO PROPAGATION ENGINE'
    },
    {
      title: 'LAYER 6: PRIORITY ACTION & DISPATCH PROTOCOL',
      desc: 'Translates graph betweenness centrality and cascade depth into ranked operational orders: PROTECT, INSPECT, MONITOR, VERIFY',
      icon: <Layers className="w-5 h-5 text-[#22C55E]" />,
      tag: 'DECISION LOGIC'
    },
    {
      title: 'LAYER 7: GEMINI AI EXPLANATION LAYER',
      desc: 'Converts deterministic graph outputs into structured 4-quadrant operational decision briefs: Why this node? What could happen? What is most critical? What should be done?',
      icon: <Sparkles className="w-5 h-5 text-[#A855F7]" />,
      tag: 'EXPLANATION & REASONING'
    },
    {
      title: 'LAYER 8: MISSION-CRITICAL COMMAND DASHBOARD',
      desc: 'Single-pane-of-glass coastal GIS radar, real-time node telemetry, topological graph inspection, and executive decision card',
      icon: <ShieldAlert className="w-5 h-5 text-[#38BDF8]" />,
      tag: 'DECISION INTELLIGENCE'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] font-bold">
            SYSTEM ARCHITECTURE & RESEARCH
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8]">
            SECTION 09
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
          NEXUSSTORM 8-LAYER INTELLIGENCE STACK
        </h2>
        <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
          End-to-end data pipeline from atmospheric forcing to deterministic graph cascade and Gemini explanation
        </p>
      </div>

      {/* Animated Pipeline Flow Diagram */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-6 shadow-xl space-y-4">
        {pipelineSteps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="bg-[#0B1220] p-4 rounded-xl border border-[#1E3A5F] hover:border-[#38BDF8]/50 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-[#152238] border border-[#1E3A5F]">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold font-mono text-[#F8FAFC]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] font-sans mt-0.5 max-w-2xl">
                    {step.desc}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#101A2B] border border-[#1E3A5F] text-[#38BDF8] font-semibold self-start md:self-auto">
                {step.tag}
              </span>
            </div>

            {idx < pipelineSteps.length - 1 && (
              <div className="flex justify-center text-[#38BDF8]">
                <ArrowDown className="w-4 h-4 animate-bounce opacity-60" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Advanced Research Direction: Graph Neural Networks (Section 64) */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl space-y-2.5 font-mono text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1E3A5F]">
          <Sparkles className="w-4 h-4 text-[#A855F7]" />
          <h4 className="font-bold text-[#F8FAFC]">ADVANCED AI RESEARCH DIRECTION: GRAPH NEURAL NETWORKS (GNN)</h4>
        </div>
        <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
          Future research roadmap represents infrastructure nodes as graph vertices V with dynamic external meteorological features X_v(t), dependency links as weighted directed edges E_ij, and cascade propagation as message-passing graph convolutions. This will enable learned cascading-failure probabilities trained on multi-decadal historical cyclone landfall archives.
        </p>
        <div className="text-[11px] text-[#A855F7] bg-[#0B1220] p-2.5 rounded border border-[#1E3A5F]">
          RESEARCH TRANSPARENCY: <span className="text-[#F8FAFC]">Current prototype operates on deterministic topological graph propagation. GNN integration is designated for Phase 4 research.</span>
        </div>
      </div>
    </div>
  );
};
