import React, { useState, useEffect } from 'react';
import { 
  InfrastructureNode, 
  DependencyEdge, 
  CycloneScenario, 
  CascadeSimulationResult, 
  ActiveSection 
} from './types';
import { INITIAL_INFRASTRUCTURE_NODES, INITIAL_DEPENDENCY_EDGES } from './data/infrastructureData';
import { PRESET_SCENARIOS } from './data/scenarios';
import { updateNodesWithScenario } from './engine/hazardEngine';
import { simulateCascadePropagation } from './engine/cascadeEngine';
import { generatePriorityActions } from './engine/priorityEngine';
import { generateAIDecisionBrief } from './engine/aiExplanationEngine';

// Components
import { Header } from './components/Header';
import { KPIRow } from './components/KPIRow';
import { Navigation } from './components/Navigation';
import { HazardMap } from './components/map/HazardMap';
import { IntelligencePanel } from './components/intelligence/IntelligencePanel';
import { CascadeLabView } from './components/cascadelab/CascadeLabView';
import { DependencyGraphView } from './components/graph/DependencyGraphView';
import { PriorityActionsView } from './components/actions/PriorityActionsView';
import { AIDecisionBriefView } from './components/ai/AIDecisionBriefView';
import { StormIntelligenceView } from './components/storm/StormIntelligenceView';
import { InfrastructureListView } from './components/infrastructure/InfrastructureListView';
import { DataModelsView } from './components/data/DataModelsView';
import { SystemArchitectureView } from './components/architecture/SystemArchitectureView';
import { PresentationModal } from './components/presentation/PresentationModal';
import { IntroSplash } from './components/common/IntroSplash';

export const App: React.FC = () => {
  // Scenario state (Default: Severe Baseline as specified in prompt)
  const [scenario, setScenario] = useState<CycloneScenario>(PRESET_SCENARIOS['severe']);
  
  // Infrastructure nodes & edges state
  const [nodes, setNodes] = useState<InfrastructureNode[]>(() => 
    updateNodesWithScenario(INITIAL_INFRASTRUCTURE_NODES, PRESET_SCENARIOS['severe'])
  );
  const [edges, setEdges] = useState<DependencyEdge[]>(INITIAL_DEPENDENCY_EDGES);

  // Selected node (Default: Substation Alpha / hero asset)
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode>(() => 
    nodes.find(n => n.id === 'substation-alpha') || nodes[0]
  );

  // Navigation tab state
  const [activeSection, setActiveSection] = useState<ActiveSection>('command-center');

  // Simulation state
  const [simulationResult, setSimulationResult] = useState<CascadeSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Modals & Splash
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [showPresentation, setShowPresentation] = useState<boolean>(false);

  // Re-run hazard engine when scenario changes
  const handleSelectScenario = (newScenario: CycloneScenario) => {
    setScenario(newScenario);
    const updated = updateNodesWithScenario(INITIAL_INFRASTRUCTURE_NODES, newScenario);
    setNodes(updated);
    if (selectedNode) {
      const updatedSelected = updated.find(n => n.id === selectedNode.id);
      if (updatedSelected) setSelectedNode(updatedSelected);
    }
  };

  // Run Hero Cascade Simulation for a node
  const handleTriggerSimulation = (nodeId: string) => {
    setIsSimulating(true);
    const result = simulateCascadePropagation(nodeId, nodes, edges);
    setSimulationResult(result);

    // Update operational statuses of affected nodes
    setNodes(prev => prev.map(node => {
      const step = result.steps.find(s => s.nodeId === node.id);
      if (step) {
        return {
          ...node,
          status: step.status,
          statusMessage: step.operationalImpact
        };
      }
      return node;
    }));

    // Update selected node state
    const current = nodes.find(n => n.id === nodeId);
    if (current) setSelectedNode(current);

    setIsSimulating(false);
  };

  // Reset simulation to baseline operational status
  const handleReset = () => {
    setSimulationResult(null);
    setIsSimulating(false);
    const refreshed = updateNodesWithScenario(INITIAL_INFRASTRUCTURE_NODES, scenario);
    setNodes(refreshed);
    const sel = refreshed.find(n => n.id === selectedNode.id);
    if (sel) setSelectedNode(sel);
  };

  const priorityActions = generatePriorityActions(simulationResult, nodes);
  const decisionBrief = generateAIDecisionBrief(selectedNode, simulationResult, nodes);
  const criticalCount = nodes.filter(n => n.criticality >= 85).length;

  return (
    <div className="min-h-screen bg-[#050A12] text-[#F8FAFC] flex flex-col font-sans">
      {/* Optional Aerospace Intro Splash */}
      {showIntro && <IntroSplash onEnter={() => setShowIntro(false)} />}

      {/* Top Header */}
      <Header
        scenario={scenario}
        onReset={handleReset}
        onOpenPresentation={() => setShowPresentation(true)}
        onOpenQuickDemo={() => setShowPresentation(true)}
        isSimulating={isSimulating}
        hasActiveCascade={!!simulationResult}
      />

      {/* Main Navigation */}
      <Navigation
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        cascadeActive={!!simulationResult}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 lg:p-6 space-y-5">
        {/* KPI Banner always visible or prominent */}
        <KPIRow
          scenario={scenario}
          simulationResult={simulationResult}
          totalAssetsCount={nodes.length}
          criticalNodesCount={criticalCount}
        />

        {/* Section 01: COMMAND CENTER (Primary Hero View) */}
        {activeSection === 'command-center' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left / Center Map (8 cols) */}
              <div className="lg:col-span-8 flex flex-col">
                <HazardMap
                  nodes={nodes}
                  edges={edges}
                  scenario={scenario}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                  simulationResult={simulationResult}
                  onTriggerSimulateNode={handleTriggerSimulation}
                />
              </div>

              {/* Right Intelligence Panel (4 cols) */}
              <div className="lg:col-span-4 flex flex-col">
                <IntelligencePanel
                  selectedNode={selectedNode}
                  allNodes={nodes}
                  allEdges={edges}
                  onTriggerSimulation={handleTriggerSimulation}
                  simulationResult={simulationResult}
                  onSelectNode={setSelectedNode}
                />
              </div>
            </div>

            {/* Bottom Quick Timeline / Cascade Overview */}
            {simulationResult && (
              <div className="bg-[#101A2B] border border-[#EF4444]/50 rounded-xl p-4 shadow-glow-critical flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping"></span>
                  <div className="font-mono text-xs">
                    <span className="text-[#EF4444] font-bold">SIMULATION ACTIVE: </span>
                    <span className="text-[#F8FAFC]">
                      {simulationResult.initiatingNodeName} &bull; {simulationResult.downstreamImpactCount} downstream services impacted
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSection('cascade-lab')}
                    className="px-3 py-1.5 rounded-lg bg-[#EF4444] text-white text-xs font-mono font-bold hover:brightness-110 active:scale-95 transition-all"
                  >
                    OPEN CASCADE LAB →
                  </button>
                  <button
                    onClick={() => setActiveSection('priority-actions')}
                    className="px-3 py-1.5 rounded-lg bg-[#38BDF8] text-[#050A12] text-xs font-mono font-bold hover:brightness-110 active:scale-95 transition-all shadow-glow-sky"
                  >
                    PRIORITY ACTIONS →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 02: STORM INTELLIGENCE */}
        {activeSection === 'storm-intelligence' && (
          <StormIntelligenceView
            currentScenario={scenario}
            onSelectScenario={handleSelectScenario}
            nodes={nodes}
          />
        )}

        {/* Section 03: INFRASTRUCTURE */}
        {activeSection === 'infrastructure' && (
          <InfrastructureListView
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onTriggerSimulation={handleTriggerSimulation}
          />
        )}

        {/* Section 04: NETWORK GRAPH */}
        {activeSection === 'network-graph' && (
          <DependencyGraphView
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            simulationResult={simulationResult}
            onTriggerSimulation={handleTriggerSimulation}
          />
        )}

        {/* Section 05: CASCADE LAB */}
        {activeSection === 'cascade-lab' && (
          <CascadeLabView
            allNodes={nodes}
            allEdges={edges}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            simulationResult={simulationResult}
            onTriggerSimulation={handleTriggerSimulation}
            onReset={handleReset}
            onNavigateToActions={() => setActiveSection('priority-actions')}
            onNavigateToAI={() => setActiveSection('ai-explanation')}
          />
        )}

        {/* Section 06: PRIORITY ACTIONS */}
        {activeSection === 'priority-actions' && (
          <PriorityActionsView
            actions={priorityActions}
            selectedNode={selectedNode}
            simulationResult={simulationResult}
            onNavigateToAI={() => setActiveSection('ai-explanation')}
            onTriggerSimulation={handleTriggerSimulation}
          />
        )}

        {/* Section 07: AI EXPLANATION */}
        {activeSection === 'ai-explanation' && (
          <AIDecisionBriefView
            decisionBrief={decisionBrief}
            selectedNode={selectedNode}
            simulationResult={simulationResult}
            onRefreshBrief={() => {}}
          />
        )}

        {/* Section 08: DATA & MODELS */}
        {activeSection === 'data-models' && <DataModelsView />}

        {/* Section 09: SYSTEM ARCHITECTURE */}
        {activeSection === 'system-architecture' && <SystemArchitectureView />}
      </main>

      {/* Presentation Mode / 90s Tour Modal */}
      <PresentationModal
        isOpen={showPresentation}
        onClose={() => setShowPresentation(false)}
        scenario={scenario}
        selectedNode={selectedNode}
        simulationResult={simulationResult}
        onTriggerSimulation={handleTriggerSimulation}
        onReset={handleReset}
      />

      {/* Global Footer */}
      <footer className="bg-[#0B1220] border-t border-[#1E3A5F] py-3 px-6 mt-8">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#94A3B8] gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#38BDF8] font-bold">NEXUSSTORM v1.0</span>
            <span>&bull;</span>
            <span>Decision Intelligence Prototype</span>
            <span>&bull;</span>
            <span className="text-[#22C55E]">DEMO ENVIRONMENT (NO EXTERNAL API DEPENDENCY)</span>
          </div>
          <div>
            <span>&ldquo;Predict the cascade. Protect the critical link.&rdquo;</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
