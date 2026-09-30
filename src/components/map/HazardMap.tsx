import React, { useState, useEffect, useRef } from 'react';
import { 
  InfrastructureNode, 
  DependencyEdge, 
  CycloneScenario, 
  CascadeSimulationResult,
  InfrastructureType
} from '../../types';
import { 
  Zap, 
  Truck, 
  Building, 
  ShieldCheck, 
  Droplet, 
  Radio, 
  Anchor, 
  Flame, 
  Eye, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  AlertTriangle
} from 'lucide-react';

interface HazardMapProps {
  nodes: InfrastructureNode[];
  edges: DependencyEdge[];
  scenario: CycloneScenario;
  selectedNode: InfrastructureNode | null;
  onSelectNode: (node: InfrastructureNode) => void;
  simulationResult: CascadeSimulationResult | null;
  onTriggerSimulateNode: (nodeId: string) => void;
}

export const HazardMap: React.FC<HazardMapProps> = ({
  nodes,
  edges,
  scenario,
  selectedNode,
  onSelectNode,
  simulationResult,
  onTriggerSimulateNode
}) => {
  // Layer switcher states
  const [showBaseMap, setShowBaseMap] = useState<boolean>(true);
  const [showCycloneTrack, setShowCycloneTrack] = useState<boolean>(true);
  const [showWindExposure, setShowWindExposure] = useState<boolean>(true);
  const [showRainfall, setShowRainfall] = useState<boolean>(true);
  const [showStormSurge, setShowStormSurge] = useState<boolean>(true);
  const [showInfrastructure, setShowInfrastructure] = useState<boolean>(true);
  const [showCascade, setShowCascade] = useState<boolean>(true);
  const [showPriority, setShowPriority] = useState<boolean>(true);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  // Map viewport transform (Pan & Zoom)
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Cyclone eye rotation animation tick
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  useEffect(() => {
    const anim = setInterval(() => {
      setRotationAngle(prev => (prev + 0.6) % 360);
    }, 50);
    return () => clearInterval(anim);
  }, []);

  // Map geographic bounds to SVG coordinate box
  // Lat: 17.65 to 17.80 -> Y
  // Lng: 83.25 to 83.42 -> X
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 650;
  const minLat = 17.66;
  const maxLat = 17.80;
  const minLng = 83.26;
  const maxLng = 83.42;

  const projectToSvg = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * MAP_WIDTH;
    // Invert Y because latitude increases northward
    const y = ((maxLat - lat) / (maxLat - minLat)) * MAP_HEIGHT;
    return { x, y };
  };

  const cyclonePos = projectToSvg(scenario.cycloneCenter.lat, scenario.cycloneCenter.lng);

  // Helper to get Node Type Icon
  const getNodeIcon = (type: InfrastructureType) => {
    switch (type) {
      case 'POWER': return <Zap className="w-3.5 h-3.5" />;
      case 'ROAD': return <Truck className="w-3.5 h-3.5" />;
      case 'BRIDGE': return <span className="font-mono text-[10px] font-bold">BR</span>;
      case 'HOSPITAL': return <Building className="w-3.5 h-3.5" />;
      case 'SHELTER': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'WATER': return <Droplet className="w-3.5 h-3.5" />;
      case 'COMMUNICATION': return <Radio className="w-3.5 h-3.5" />;
      case 'PORT': return <Anchor className="w-3.5 h-3.5" />;
      case 'EMERGENCY ACCESS': return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return <Building className="w-3.5 h-3.5" />;
    }
  };

  const isNodeFailed = (nodeId: string) => {
    if (!simulationResult) return false;
    return simulationResult.steps.some(s => s.nodeId === nodeId && s.status === 'FAILED');
  };

  const isNodeImpacted = (nodeId: string) => {
    if (!simulationResult) return false;
    return simulationResult.steps.some(s => s.nodeId === nodeId && s.status === 'IMPACTED');
  };

  return (
    <div className="relative w-full h-[580px] lg:h-[640px] bg-[#050A12] border border-[#1E3A5F] rounded-xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Top Map Bar / Status */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div className="bg-[#0B1220]/90 backdrop-blur border border-[#1E3A5F] rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></div>
          <span className="text-xs font-mono text-[#F8FAFC] font-semibold">COASTAL GEOGRAPHIC RADAR</span>
          <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/30">
            BAY OF BENGAL SECTOR
          </span>
        </div>
      </div>

      {/* Layer Switcher Button & Dropdown */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1220]/90 backdrop-blur border border-[#1E3A5F] text-xs font-mono text-[#F8FAFC] hover:border-[#38BDF8]/50 shadow-lg transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>LAYERS ({[showBaseMap, showCycloneTrack, showWindExposure, showRainfall, showStormSurge, showInfrastructure, showCascade].filter(Boolean).length}/7)</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#101A2B] border border-[#1E3A5F] rounded-lg p-2.5 shadow-2xl z-40 text-xs space-y-1.5">
              <div className="text-[11px] font-mono text-[#94A3B8] uppercase px-1 pb-1 border-b border-[#1E3A5F]">
                Scientific Layers
              </div>
              <label className="flex items-center gap-2 px-1 py-1 hover:bg-[#152238] rounded cursor-pointer text-[#F8FAFC]">
                <input type="checkbox" checked={showBaseMap} onChange={e => setShowBaseMap(e.target.checked)} className="rounded accent-[#38BDF8]" />
                <span>Base Coast & Terrain</span>
              </label>
              <label className="flex items-center gap-2 px-1 py-1 hover:bg-[#152238] rounded cursor-pointer text-[#F8FAFC]">
                <input type="checkbox" checked={showCycloneTrack} onChange={e => setShowCycloneTrack(e.target.checked)} className="rounded accent-[#38BDF8]" />
                <span>Cyclone Track & Eye</span>
              </label>
              <label className="flex items-center gap-2 px-1 py-1 hover:bg-[#152238] rounded cursor-pointer text-[#F8FAFC]">
                <input type="checkbox" checked={showWindExposure} onChange={e => setShowWindExposure(e.target.checked)} className="rounded accent-[#38BDF8]" />
                <span>Wind Velocity Radii</span>
              </label>
              <label className="flex items-center gap-2 px-1 py-1 hover:bg-[#152238] rounded cursor-pointer text-[#F8FAFC]">
                <input type="checkbox" checked={showRainfall} onChange={e => setShowRainfall(e.target.checked)} className="rounded accent-[#38BDF8]" />
                <span>Rainfall Radar Inundation</span>
              </label>
              <label className="flex items-center gap-2 px-1 py-1 hover:bg-[#152238] rounded cursor-pointer text-[#F8FAFC]">
                <input type="checkbox" checked={showStormSurge} onChange={e => setShowStormSurge(e.target.checked)} className="rounded accent-[#38BDF8]" />
                <span>Storm Surge Zone (+{scenario.stormSurgeMeters}m)</span>
              </label>
              <label className="flex items-center gap-2 px-1 py-1 hover:bg-[#152238] rounded cursor-pointer text-[#F8FAFC]">
                <input type="checkbox" checked={showInfrastructure} onChange={e => setShowInfrastructure(e.target.checked)} className="rounded accent-[#38BDF8]" />
                <span>Infrastructure Nodes (12)</span>
              </label>
              <label className="flex items-center gap-2 px-1 py-1 hover:bg-[#152238] rounded cursor-pointer text-[#F8FAFC]">
                <input type="checkbox" checked={showCascade} onChange={e => setShowCascade(e.target.checked)} className="rounded accent-[#38BDF8]" />
                <span>Dependency Links & Cascade</span>
              </label>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-[#0B1220]/90 backdrop-blur border border-[#1E3A5F] rounded-lg overflow-hidden shadow-lg">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 2.2))}
            className="p-2 text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#152238] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-1.5 text-[#94A3B8]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.8))}
            className="p-2 text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#152238] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setZoom(1.0); setPan({ x: 0, y: 0 }); }}
            className="p-2 text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#152238] transition-colors border-l border-[#1E3A5F]"
            title="Reset Map View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Map SVG Viewport */}
      <div 
        className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={e => {
          setIsDragging(true);
          setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }}
        onMouseMove={e => {
          if (isDragging) {
            setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
          }
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full preserve-3d"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          <defs>
            {/* Dark ocean gradient */}
            <radialGradient id="oceanGrad" cx="70%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#0B1C33" />
              <stop offset="60%" stopColor="#081424" />
              <stop offset="100%" stopColor="#040913" />
            </radialGradient>

            {/* Land terrain gradient */}
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#101C2F" />
              <stop offset="100%" stopColor="#0E1726" />
            </linearGradient>

            {/* Storm Surge Inundation Gradient */}
            <linearGradient id="surgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#0284C7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
            </linearGradient>

            {/* Wind field radar radial */}
            <radialGradient id="windSwath" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.40" />
              <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </radialGradient>

            {/* Glowing filter for critical pins */}
            <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Marker arrow for dependencies */}
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#38BDF8" opacity="0.8" />
            </marker>
            <marker id="arrowhead-critical" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#EF4444" opacity="0.9" />
            </marker>
          </defs>

          {/* 1. Base Map: Ocean Background */}
          {showBaseMap && (
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanGrad)" />
          )}

          {/* Lat/Long Coordinate Grid lines */}
          <g opacity="0.12" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="3 4">
            <line x1="0" y1="130" x2={MAP_WIDTH} y2="130" />
            <line x1="0" y1="260" x2={MAP_WIDTH} y2="260" />
            <line x1="0" y1="390" x2={MAP_WIDTH} y2="390" />
            <line x1="0" y1="520" x2={MAP_WIDTH} y2="520" />
            <line x1="200" y1="0" x2="200" y2={MAP_HEIGHT} />
            <line x1="400" y1="0" x2="400" y2={MAP_HEIGHT} />
            <line x1="600" y1="0" x2="600" y2={MAP_HEIGHT} />
            <line x1="800" y1="0" x2="800" y2={MAP_HEIGHT} />
          </g>

          {/* 2. Landmass & Shoreline Geometry (Realistic coastal bay with headland & estuary) */}
          {showBaseMap && (
            <g>
              {/* Main Coastal Landmass Polygon */}
              <path
                d="M 0,0 L 460,0 Q 480,90 440,160 Q 400,230 460,300 Q 520,370 410,430 Q 340,480 370,550 Q 390,600 320,650 L 0,650 Z"
                fill="url(#landGrad)"
                stroke="#1E3A5F"
                strokeWidth="1.8"
              />
              
              {/* Estuary / Harbor Ingress */}
              <path
                d="M 440,160 Q 370,180 320,200 Q 280,220 290,250 Q 320,265 420,240 Q 450,235 460,300"
                fill="#091524"
                stroke="#1E3A5F"
                strokeWidth="1.2"
              />

              {/* Coastal bathymetric contour lines */}
              <path
                d="M 470,0 Q 495,90 455,160 Q 415,230 480,300 Q 540,370 430,430 Q 360,480 390,550 Q 410,600 340,650"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="0.8"
                strokeOpacity="0.25"
                strokeDasharray="4 4"
              />
              <path
                d="M 500,0 Q 525,90 485,160 Q 445,230 510,300 Q 570,370 460,430 Q 390,480 420,550 Q 440,600 370,650"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="0.6"
                strokeOpacity="0.15"
              />

              {/* Geographic Labels */}
              <text x="50" y="40" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono" opacity="0.6">
                DISTRICT MAINLAND &bull; HIGH ELEVATION SECTOR
              </text>
              <text x="360" y="270" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono" opacity="0.5">
                BAYMOUTH ESTUARY
              </text>
              <text x="750" y="610" fill="#38BDF8" fontSize="11" fontFamily="JetBrains Mono" opacity="0.5">
                BAY OF BENGAL MARITIME SECTOR
              </text>
            </g>
          )}

          {/* 3. Storm Surge Inundation Band */}
          {showStormSurge && (
            <path
              d="M 440,0 Q 465,90 425,160 Q 385,230 450,300 Q 505,370 395,430 Q 325,480 355,550 Q 375,600 305,650 L 460,650 Q 520,370 460,300 Q 400,230 460,0 Z"
              fill="url(#surgeGrad)"
              className="animate-pulse-slow"
            />
          )}

          {/* 4. Rainfall Radar Bands */}
          {showRainfall && (
            <g opacity="0.30">
              <circle
                cx={cyclonePos.x}
                cy={cyclonePos.y}
                r={240}
                fill="none"
                stroke="#22D3EE"
                strokeWidth="45"
                strokeOpacity="0.15"
                strokeDasharray="60 30"
                transform={`rotate(${-rotationAngle * 0.8} ${cyclonePos.x} ${cyclonePos.y})`}
              />
              <circle
                cx={cyclonePos.x}
                cy={cyclonePos.y}
                r={160}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="35"
                strokeOpacity="0.25"
                strokeDasharray="40 20"
                transform={`rotate(${rotationAngle * 1.2} ${cyclonePos.x} ${cyclonePos.y})`}
              />
            </g>
          )}

          {/* 5. Wind Field Velocity Radii */}
          {showWindExposure && (
            <g>
              {/* Outer Gale Radius (80 km/h) */}
              <circle
                cx={cyclonePos.x}
                cy={cyclonePos.y}
                r={260}
                fill="url(#windSwath)"
              />
              <circle
                cx={cyclonePos.x}
                cy={cyclonePos.y}
                r={260}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1"
                strokeDasharray="5 5"
                opacity="0.4"
              />
              <text x={cyclonePos.x + 190} y={cyclonePos.y - 170} fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono" opacity="0.7">
                GALE RADII: 80 KM/H
              </text>

              {/* Destructive Storm Radius (120 km/h) */}
              <circle
                cx={cyclonePos.x}
                cy={cyclonePos.y}
                r={160}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <text x={cyclonePos.x + 115} y={cyclonePos.y - 110} fill="#F59E0B" fontSize="9" fontFamily="JetBrains Mono" opacity="0.8">
                STORM CORE: 120 KM/H
              </text>

              {/* Eyewall Max Wind Radius (175+ km/h) */}
              <circle
                cx={cyclonePos.x}
                cy={cyclonePos.y}
                r={85}
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.8"
                opacity="0.8"
              />
              <text x={cyclonePos.x + 55} y={cyclonePos.y - 65} fill="#EF4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                EYEWALL: {scenario.windSpeedKmh} KM/H
              </text>
            </g>
          )}

          {/* 6. Cyclone Track & Projected Path Corridor */}
          {showCycloneTrack && (
            <g>
              {/* Uncertainty Corridor Cone */}
              <path
                d={`M ${cyclonePos.x},${cyclonePos.y} L ${cyclonePos.x - 380},${cyclonePos.y - 280} L ${cyclonePos.x - 320},${cyclonePos.y - 360} Z`}
                fill="#EF4444"
                fillOpacity="0.08"
                stroke="#EF4444"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                strokeOpacity="0.3"
              />

              {/* Historical Past Path */}
              <path
                d={`M ${cyclonePos.x + 220},${cyclonePos.y + 160} Q ${cyclonePos.x + 100},${cyclonePos.y + 90} ${cyclonePos.x},${cyclonePos.y}`}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity="0.6"
              />

              {/* Forecast Track Vector */}
              <line
                x1={cyclonePos.x}
                y1={cyclonePos.y}
                x2={cyclonePos.x - 350}
                y2={cyclonePos.y - 320}
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />

              {/* Cyclone Eye Vortex Animation */}
              <g transform={`translate(${cyclonePos.x}, ${cyclonePos.y})`}>
                {/* Rotating Spiral Arms */}
                <g transform={`rotate(${rotationAngle})`}>
                  <path
                    d="M 0,0 C 30,-20 60,-10 90,-40 C 60,-60 20,-40 0,0"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeOpacity="0.7"
                  />
                  <path
                    d="M 0,0 C -30,20 -60,10 -90,40 C -60,60 -20,40 0,0"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeOpacity="0.7"
                  />
                  <path
                    d="M 0,0 C -20,-30 -10,-60 -40,-90 C -60,-60 -40,-20 0,0"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M 0,0 C 20,30 10,60 40,90 C 60,60 40,20 0,0"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeOpacity="0.6"
                  />
                </g>

                {/* Central Eye Ring */}
                <circle r={22} fill="#050A12" stroke="#EF4444" strokeWidth="2.5" className="animate-pulse" />
                <circle r={10} fill="#EF4444" fillOpacity="0.3" />
                <circle r={3} fill="#EF4444" />

                {/* Eye Tag */}
                <text x="28" y="5" fill="#EF4444" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  EYE ({scenario.pressureHpa} hPa)
                </text>
              </g>
            </g>
          )}

          {/* 7. Dependency Edges between Infrastructure */}
          {showCascade && (
            <g>
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const p1 = projectToSvg(sourceNode.lat, sourceNode.lng);
                const p2 = projectToSvg(targetNode.lat, targetNode.lng);

                const isEdgeActiveInCascade = simulationResult?.activeEdgeIds.includes(edge.id);
                const isSelectedInvolved = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

                return (
                  <g key={edge.id}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={
                        isEdgeActiveInCascade
                          ? '#EF4444'
                          : isSelectedInvolved
                          ? '#38BDF8'
                          : '#1E3A5F'
                      }
                      strokeWidth={isEdgeActiveInCascade ? 3 : isSelectedInvolved ? 2 : 1.2}
                      strokeDasharray={isEdgeActiveInCascade ? '6 3' : 'none'}
                      strokeOpacity={isEdgeActiveInCascade ? 0.95 : isSelectedInvolved ? 0.8 : 0.4}
                      markerEnd={isEdgeActiveInCascade ? "url(#arrowhead-critical)" : "url(#arrowhead)"}
                    />

                    {/* Animated Light Flow along edge during cascade */}
                    {isEdgeActiveInCascade && (
                      <circle r="4" fill="#EF4444">
                        <animateMotion
                          path={`M ${p1.x},${p1.y} L ${p2.x},${p2.y}`}
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 8. Infrastructure Nodes Pins & Status */}
          {showInfrastructure && (
            <g>
              {nodes.map(node => {
                const pos = projectToSvg(node.lat, node.lng);
                const isSelected = selectedNode?.id === node.id;
                const isFailed = isNodeFailed(node.id);
                const isImpacted = isNodeImpacted(node.id);

                let pinColor = '#38BDF8';
                let pulseColor = 'rgba(56, 189, 248, 0.4)';
                if (isFailed) {
                  pinColor = '#EF4444';
                  pulseColor = 'rgba(239, 68, 68, 0.7)';
                } else if (isImpacted) {
                  pinColor = '#F59E0B';
                  pulseColor = 'rgba(245, 158, 11, 0.6)';
                } else if (node.riskIndex >= 85) {
                  pinColor = '#EF4444';
                  pulseColor = 'rgba(239, 68, 68, 0.5)';
                } else if (node.riskIndex >= 70) {
                  pinColor = '#F59E0B';
                  pulseColor = 'rgba(245, 158, 11, 0.4)';
                }

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(node);
                    }}
                  >
                    {/* Shockwave ripple if failed or initiating */}
                    {isFailed && (
                      <circle
                        r="32"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Outer glow ring for selected or critical */}
                    {(isSelected || node.criticality >= 90) && (
                      <circle
                        r={isSelected ? 20 : 16}
                        fill={pulseColor}
                        className="animate-pulse"
                      />
                    )}

                    {/* Main Node Base Circle */}
                    <circle
                      r="12"
                      fill="#0B1220"
                      stroke={pinColor}
                      strokeWidth={isSelected ? 2.5 : 1.8}
                      filter="url(#glow-filter)"
                    />

                    {/* Inner Node Circle */}
                    <circle
                      r="5"
                      fill={pinColor}
                    />

                    {/* Node Code Label */}
                    <text
                      x="16"
                      y="4"
                      fill={isSelected ? '#38BDF8' : '#F8FAFC'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="JetBrains Mono"
                      className="drop-shadow-md pointer-events-none"
                    >
                      {node.code}
                    </text>

                    {/* Sub-label for Critical Assets */}
                    <text
                      x="16"
                      y="16"
                      fill={pinColor}
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                      opacity="0.9"
                      className="pointer-events-none"
                    >
                      {isFailed ? 'FAILED' : isImpacted ? 'IMPACTED' : `RISK ${node.riskIndex}`}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 9. Hero Shockwave Effect from initiating node */}
          {simulationResult && (
            (() => {
              const initNode = nodes.find(n => n.id === simulationResult.initiatingNodeId);
              if (!initNode) return null;
              const pos = projectToSvg(initNode.lat, initNode.lng);
              return (
                <g transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle
                    r="60"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    className="animate-ping opacity-75"
                  />
                  <circle
                    r="100"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    className="animate-ping opacity-40"
                  />
                </g>
              );
            })()
          )}
        </svg>
      </div>

      {/* Map Bottom Legend */}
      <div className="bg-[#0B1220]/95 backdrop-blur border-t border-[#1E3A5F] px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-4 flex-wrap font-mono text-[11px] text-[#94A3B8]">
          <span className="text-[#F8FAFC] font-semibold tracking-wider">LEGEND:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
            <span>POWER / UTILITY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
            <span>ROAD / TRANSIT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
            <span>HEALTH / TRAUMA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span>MEGA SHELTER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]"></span>
            <span>STORM SURGE ZONE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping"></span>
            <span className="text-[#EF4444] font-bold">CASCADE EDGE ACTIVE</span>
          </div>
        </div>

        <div className="font-mono text-[11px] text-[#38BDF8] flex items-center gap-2">
          <span>COASTAL GIS PROJECTION</span>
          <span className="text-[#94A3B8]">&bull;</span>
          <span className="text-[#94A3B8]">SIMULATED HAZARD OVERLAY</span>
        </div>
      </div>
    </div>
  );
};
