import React, { useState } from 'react';
import { 
  InfrastructureNode, 
  DependencyEdge, 
  CascadeSimulationResult, 
  InfrastructureType 
} from '../../types';
import { 
  GitFork, 
  Flame, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Zap, 
  Truck, 
  Building, 
  ShieldCheck, 
  Droplet, 
  Radio, 
  Info 
} from 'lucide-react';

interface DependencyGraphViewProps {
  nodes: InfrastructureNode[];
  edges: DependencyEdge[];
  selectedNode: InfrastructureNode;
  onSelectNode: (node: InfrastructureNode) => void;
  simulationResult: CascadeSimulationResult | null;
  onTriggerSimulation: (nodeId: string) => void;
}

export const DependencyGraphView: React.FC<DependencyGraphViewProps> = ({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
  simulationResult,
  onTriggerSimulation
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [zoom, setZoom] = useState<number>(1.0);

  // Topological Layout Tiers
  // Tier 0: Root Primary Power & Bridges
  // Tier 1: Trunk Corridors & Pumping
  // Tier 2: End-User Lifelines (Hospitals, Shelters, Port, EOC)
  const getNodeCoordinates = (nodeId: string): { x: number; y: number } => {
    const layoutMap: Record<string, { x: number; y: number }> = {
      'substation-alpha': { x: 160, y: 150 },
      'substation-beta':  { x: 160, y: 460 },
      'bridge-delta':      { x: 160, y: 300 },

      'road-charlie':      { x: 450, y: 180 },
      'road-echo':         { x: 450, y: 440 },
      'water-echo':        { x: 450, y: 310 },
      'comm-foxtrot':      { x: 450, y: 530 },

      'hospital-bravo':    { x: 800, y: 150 },
      'shelter-delta':     { x: 800, y: 270 },
      'shelter-golf':      { x: 800, y: 470 },
      'port-terminal':     { x: 800, y: 370 },
      'eoc-command':       { x: 800, y: 560 },
    };

    return layoutMap[nodeId] || { x: 400, y: 300 };
  };

  const isUpstream = (id: string) => selectedNode.upstreamIds.includes(id);
  const isDownstream = (id: string) => selectedNode.downstreamIds.includes(id);
  const isSelected = (id: string) => selectedNode.id === id;

  const isNodeFailed = (id: string) => {
    return simulationResult?.steps.some(s => s.nodeId === id && s.status === 'FAILED');
  };

  const isNodeImpacted = (id: string) => {
    return simulationResult?.steps.some(s => s.nodeId === id && s.status === 'IMPACTED');
  };

  const filteredEdges = edges.filter(e => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'POWER') return e.dependencyType === 'ELECTRICAL_POWER';
    if (selectedFilter === 'TRANSIT') return e.dependencyType === 'TRANSIT_ACCESS';
    if (selectedFilter === 'WATER') return e.dependencyType === 'COOLING_WATER';
    if (selectedFilter === 'COMM') return e.dependencyType === 'TELEMETRY';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] font-bold flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" />
              TOPOLOGICAL INTELLIGENCE
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              DIRECTED DEPENDENCY GRAPH (DAG)
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            INFRASTRUCTURE DEPENDENCY NETWORK GRAPH
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            Inter-system cascading dependencies mapped across coastal lifeline sectors
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#0B1220] border border-[#1E3A5F] rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedFilter === 'ALL' ? 'bg-[#38BDF8] text-[#050A12] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              ALL (17)
            </button>
            <button
              onClick={() => setSelectedFilter('POWER')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedFilter === 'POWER' ? 'bg-[#38BDF8] text-[#050A12] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              POWER
            </button>
            <button
              onClick={() => setSelectedFilter('TRANSIT')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedFilter === 'TRANSIT' ? 'bg-[#38BDF8] text-[#050A12] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              TRANSIT
            </button>
            <button
              onClick={() => setSelectedFilter('WATER')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedFilter === 'WATER' ? 'bg-[#38BDF8] text-[#050A12] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              WATER
            </button>
          </div>

          <button
            onClick={() => onTriggerSimulation(selectedNode.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white font-mono text-xs font-bold transition-all shadow-glow-critical"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Simulate Node Failure</span>
          </button>
        </div>
      </div>

      {/* Graph Visual Canvas */}
      <div className="bg-[#050A12] border border-[#1E3A5F] rounded-xl relative overflow-hidden shadow-2xl h-[620px] select-none">
        {/* Tier Columns Overlay Guide */}
        <div className="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-20 border-x border-[#1E3A5F]">
          <div className="border-r border-[#1E3A5F] p-4 text-[11px] font-mono text-[#38BDF8]">
            TIER 1: PRIMARY GRID & TRANSMISSION
          </div>
          <div className="border-r border-[#1E3A5F] p-4 text-[11px] font-mono text-[#22D3EE]">
            TIER 2: LIFELINE TRUNKS & BOOSTER PUMPS
          </div>
          <div className="p-4 text-[11px] font-mono text-[#22C55E]">
            TIER 3: LIFE-SAFETY ENDPOINTS & EVACUATION
          </div>
        </div>

        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <defs>
            <marker id="graph-arrow" markerWidth="7" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#38BDF8" opacity="0.8" />
            </marker>
            <marker id="graph-arrow-active" markerWidth="8" markerHeight="8" refX="28" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#EF4444" />
            </marker>
            <marker id="graph-arrow-dim" markerWidth="6" markerHeight="6" refX="28" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#1E3A5F" opacity="0.4" />
            </marker>
          </defs>

          {/* 1. Curved Directional Dependency Edges */}
          <g>
            {filteredEdges.map(edge => {
              const p1 = getNodeCoordinates(edge.source);
              const p2 = getNodeCoordinates(edge.target);

              const isCascadeActive = simulationResult?.activeEdgeIds.includes(edge.id);
              const isRelevantToSelected = 
                isSelected(edge.source) || 
                isSelected(edge.target) || 
                isDownstream(edge.target) || 
                isUpstream(edge.source);

              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              // Smooth cubic bezier curve
              const pathData = `M ${p1.x},${p1.y} C ${p1.x + dx * 0.5},${p1.y} ${p1.x + dx * 0.5},${p2.y} ${p2.x},${p2.y}`;

              let strokeColor = '#1E3A5F';
              let strokeOpacity = 0.3;
              let strokeWidth = 1.2;
              let marker = 'url(#graph-arrow-dim)';

              if (isCascadeActive) {
                strokeColor = '#EF4444';
                strokeOpacity = 0.95;
                strokeWidth = 3;
                marker = 'url(#graph-arrow-active)';
              } else if (isRelevantToSelected) {
                strokeColor = '#38BDF8';
                strokeOpacity = 0.85;
                strokeWidth = 2.2;
                marker = 'url(#graph-arrow)';
              }

              return (
                <g key={edge.id}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    strokeDasharray={isCascadeActive ? '6 3' : 'none'}
                    markerEnd={marker}
                  />

                  {/* Animated Energy Packet on active cascade link */}
                  {isCascadeActive && (
                    <circle r="4" fill="#EF4444">
                      <animateMotion
                        path={pathData}
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* 2. Interactive Graph Nodes */}
          <g>
            {nodes.map(node => {
              const pos = getNodeCoordinates(node.id);
              const selected = isSelected(node.id);
              const upstream = isUpstream(node.id);
              const downstream = isDownstream(node.id);
              const failed = isNodeFailed(node.id);
              const impacted = isNodeImpacted(node.id);

              const isDimmed = !selected && !upstream && !downstream && !failed && !impacted && selectedNode.id !== '';

              let borderColor = '#1E3A5F';
              let fillColor = '#101A2B';
              let textColor = '#94A3B8';

              if (failed) {
                borderColor = '#EF4444';
                fillColor = '#1F1218';
                textColor = '#EF4444';
              } else if (impacted) {
                borderColor = '#F59E0B';
                fillColor = '#1C1914';
                textColor = '#F59E0B';
              } else if (selected) {
                borderColor = '#38BDF8';
                fillColor = '#0F2338';
                textColor = '#38BDF8';
              } else if (downstream) {
                borderColor = '#22D3EE';
                fillColor = '#0E1F2F';
                textColor = '#22D3EE';
              } else if (upstream) {
                borderColor = '#A855F7';
                fillColor = '#1C1528';
                textColor = '#C084FC';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => onSelectNode(node)}
                  className="cursor-pointer group"
                  opacity={isDimmed ? 0.35 : 1.0}
                >
                  {/* Selection / Failure Glow Halo */}
                  {(selected || failed) && (
                    <circle
                      r="36"
                      fill="none"
                      stroke={failed ? '#EF4444' : '#38BDF8'}
                      strokeWidth={failed ? '2' : '1.5'}
                      strokeDasharray={failed ? '4 4' : 'none'}
                      className={failed ? 'animate-ping' : 'animate-pulse'}
                    />
                  )}

                  {/* Main Node Box */}
                  <rect
                    x="-65"
                    y="-24"
                    width="130"
                    height="48"
                    rx="8"
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={selected || failed ? 2.5 : 1.5}
                    className="transition-colors group-hover:stroke-[#38BDF8]"
                  />

                  {/* Node Code */}
                  <text
                    x="0"
                    y="-5"
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="11"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    {node.code}
                  </text>

                  {/* Node Sector Name */}
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="9"
                    fontFamily="Inter"
                  >
                    {node.name.split(' ')[0]} {node.name.split(' ')[1] || ''}
                  </text>

                  {/* Node State Pip */}
                  <circle
                    cx="52"
                    cy="-14"
                    r="4"
                    fill={failed ? '#EF4444' : impacted ? '#F59E0B' : '#22C55E'}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend Toolbar */}
        <div className="absolute bottom-3 left-3 right-3 bg-[#0B1220]/90 backdrop-blur border border-[#1E3A5F] rounded-lg p-2.5 flex flex-wrap items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[#F8FAFC] font-bold">TOPOLOGICAL RELATIONS:</span>
            <div className="flex items-center gap-1.5 text-[#38BDF8]">
              <span className="w-2.5 h-2.5 rounded bg-[#38BDF8]"></span>
              <span>SELECTED NODE</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#C084FC]">
              <span className="w-2.5 h-2.5 rounded bg-[#A855F7]"></span>
              <span>UPSTREAM DEPENDENCIES</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#22D3EE]">
              <span className="w-2.5 h-2.5 rounded bg-[#22D3EE]"></span>
              <span>DOWNSTREAM LIFELINES</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#EF4444]">
              <span className="w-2.5 h-2.5 rounded bg-[#EF4444] animate-pulse"></span>
              <span>FAILED / SEVERED</span>
            </div>
          </div>

          <div className="text-[#94A3B8] text-[11px]">
            <span>Click any node to trace upstream/downstream lifelines</span>
          </div>
        </div>
      </div>
    </div>
  );
};
