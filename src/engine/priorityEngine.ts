import { InfrastructureNode, CascadeSimulationResult, PriorityAction } from '../types';

export function generatePriorityActions(
  simulationResult: CascadeSimulationResult | null,
  allNodes: InfrastructureNode[]
): PriorityAction[] {
  const nodeMap = new Map<string, InfrastructureNode>();
  allNodes.forEach(n => nodeMap.set(n.id, n));

  const actions: PriorityAction[] = [];

  if (simulationResult && simulationResult.steps.length > 0) {
    const initiatingNode = nodeMap.get(simulationResult.initiatingNodeId);

    // 01: Top Priority: Protect Initiating Node
    if (initiatingNode) {
      actions.push({
        id: `act-${initiatingNode.id}`,
        rank: 1,
        category: 'PROTECT',
        targetAssetId: initiatingNode.id,
        targetAssetName: initiatingNode.name,
        targetAssetType: initiatingNode.type,
        actionTitle: `Fortify and Island ${initiatingNode.code}`,
        rationale: `Critical initiating node with ${initiatingNode.dependency}/100 network dependency and ${simulationResult.downstreamImpactCount} downstream services at immediate risk.`,
        leadAgency: initiatingNode.type === 'POWER' ? 'State Electrical Grid Authority & Civil Defense' : 'Public Works & Disaster Response',
        urgency: 'IMMEDIATE',
        estimatedTimeToImpact: '< 2 Hours'
      });
    }

    // Process downstream steps
    const downstreamSteps = simulationResult.steps.slice(1);
    let currentRank = 2;

    for (const step of downstreamSteps) {
      const node = nodeMap.get(step.nodeId);
      if (!node) continue;

      if (node.type === 'ROAD' || node.type === 'BRIDGE') {
        actions.push({
          id: `act-${node.id}`,
          rank: currentRank++,
          category: 'INSPECT',
          targetAssetId: node.id,
          targetAssetName: node.name,
          targetAssetType: node.type,
          actionTitle: `Inspect & Clear ${node.code} Emergency Artery`,
          rationale: `Direct transit lifeline to regional medical center and emergency shelters. Dewatering pumps and contraflow required.`,
          leadAgency: 'Highway Police & Municipal Drainage Taskforce',
          urgency: 'HIGH',
          estimatedTimeToImpact: '2 - 4 Hours'
        });
      } else if (node.type === 'HOSPITAL') {
        actions.push({
          id: `act-${node.id}`,
          rank: currentRank++,
          category: 'VERIFY',
          targetAssetId: node.id,
          targetAssetName: node.name,
          targetAssetType: node.type,
          actionTitle: `Verify Auxiliary Power & Oxygen Systems at ${node.code}`,
          rationale: `Healthcare continuity essential for 750 beds and ICU. Municipal utility feed predicted to trip.`,
          leadAgency: 'Department of Health & Emergency Medical Services',
          urgency: 'IMMEDIATE',
          estimatedTimeToImpact: '< 1 Hour'
        });
      } else if (node.type === 'SHELTER') {
        actions.push({
          id: `act-${node.id}`,
          rank: currentRank++,
          category: 'VERIFY',
          targetAssetId: node.id,
          targetAssetName: node.name,
          targetAssetType: node.type,
          actionTitle: `Confirm Shelter Ingress & Generator Reserves at ${node.code}`,
          rationale: `Protects 5,000 evacuees. Vulnerable to upstream power trip and access blockage.`,
          leadAgency: 'National Disaster Management Authority & Red Cross',
          urgency: 'HIGH',
          estimatedTimeToImpact: '3 - 6 Hours'
        });
      } else if (node.type === 'WATER') {
        actions.push({
          id: `act-${node.id}`,
          rank: currentRank++,
          category: 'MONITOR',
          targetAssetId: node.id,
          targetAssetName: node.name,
          targetAssetType: node.type,
          actionTitle: `Monitor High-Pressure Pumping & Reservoir Valves at ${node.code}`,
          rationale: `Drinking water and fire fighting pressure required for hospital and municipal shelter.`,
          leadAgency: 'Municipal Water Board & Environmental Agency',
          urgency: 'ELEVATED',
          estimatedTimeToImpact: '4 - 8 Hours'
        });
      }
    }
  } else {
    // Default baseline priority interventions based on top criticality nodes
    const sortedNodes = [...allNodes].sort((a, b) => b.criticality - a.criticality);
    const top4 = sortedNodes.slice(0, 4);

    top4.forEach((node, idx) => {
      let category: 'PROTECT' | 'INSPECT' | 'MONITOR' | 'VERIFY' = 'PROTECT';
      if (node.type === 'ROAD' || node.type === 'BRIDGE') category = 'INSPECT';
      else if (node.type === 'HOSPITAL' || node.type === 'SHELTER') category = 'VERIFY';
      else if (node.type === 'WATER' || node.type === 'COMMUNICATION') category = 'MONITOR';

      actions.push({
        id: `def-act-${node.id}`,
        rank: idx + 1,
        category,
        targetAssetId: node.id,
        targetAssetName: node.name,
        targetAssetType: node.type,
        actionTitle: `${category} Key Lifeline: ${node.name}`,
        rationale: node.recommendedIntervention,
        leadAgency: 'Disaster Management Unified Incident Command',
        urgency: idx === 0 ? 'IMMEDIATE' : 'HIGH',
        estimatedTimeToImpact: `${(idx + 1) * 2} Hours`
      });
    });
  }

  return actions;
}
