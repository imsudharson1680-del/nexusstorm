import { InfrastructureNode, DependencyEdge, CascadeStep, CascadeSimulationResult, NodeOperationalStatus } from '../types';

export function simulateCascadePropagation(
  initiatingNodeId: string,
  allNodes: InfrastructureNode[],
  allEdges: DependencyEdge[]
): CascadeSimulationResult {
  const nodeMap = new Map<string, InfrastructureNode>();
  allNodes.forEach(n => nodeMap.set(n.id, n));

  const initiatingNode = nodeMap.get(initiatingNodeId);
  if (!initiatingNode) {
    throw new Error(`Node ${initiatingNodeId} not found`);
  }

  const steps: CascadeStep[] = [];
  const visitedNodeIds = new Set<string>();
  const activeEdgeIds: string[] = [];
  const timeStepLabels = ['T+00', 'T+02', 'T+04', 'T+06', 'T+08', 'T+10'];

  // T+00: Initiating node failure
  visitedNodeIds.add(initiatingNode.id);
  steps.push({
    timeStep: 'T+00',
    nodeId: initiatingNode.id,
    nodeName: initiatingNode.name,
    nodeType: initiatingNode.type,
    status: 'FAILED',
    cause: 'Direct simulated hazard breach / catastrophic failure',
    operationalImpact: initiatingNode.failureConsequence,
    affectedServices: [initiatingNode.type, 'Primary Utility Feed']
  });

  // Breadth-First Topological Cascade Progression
  let currentFrontier = [initiatingNode.id];
  let timeIndex = 1;

  while (currentFrontier.length > 0 && timeIndex < timeStepLabels.length) {
    const nextFrontier: string[] = [];

    for (const sourceId of currentFrontier) {
      // Find all outgoing edges from this source
      const outgoingEdges = allEdges.filter(e => e.source === sourceId);

      for (const edge of outgoingEdges) {
        if (!activeEdgeIds.includes(edge.id)) {
          activeEdgeIds.push(edge.id);
        }

        const targetNode = nodeMap.get(edge.target);
        if (targetNode && !visitedNodeIds.has(targetNode.id)) {
          visitedNodeIds.add(targetNode.id);
          nextFrontier.push(targetNode.id);

          // Determine failure status based on redundancy
          let status: NodeOperationalStatus = 'IMPACTED';
          let operationalImpact = '';

          if (targetNode.type === 'HOSPITAL') {
            status = 'IMPACTED';
            operationalImpact = targetNode.redundancyBackupAvailable
              ? `Main power severed. Emergency diesel generators started (${targetNode.backupFuelHours}h fuel reserves). Access corridor at risk.`
              : 'Loss of municipal power & water cooling. ICU life support threatened.';
          } else if (targetNode.type === 'ROAD' || targetNode.type === 'BRIDGE') {
            status = 'FAILED';
            operationalImpact = 'Traffic signaling blackout; stormwater dewatering pumps disabled. Arterial corridor submerged and blocked.';
          } else if (targetNode.type === 'SHELTER') {
            status = 'IMPACTED';
            operationalImpact = 'HVAC filtration disabled; emergency access choked by upstream transit failure.';
          } else if (targetNode.type === 'WATER') {
            status = 'FAILED';
            operationalImpact = 'High-pressure booster pumps de-energized. Treated distribution pressure dropped to 0 bar.';
          } else if (targetNode.type === 'COMMUNICATION') {
            status = 'IMPACTED';
            operationalImpact = 'Microwave array switched to 24V DC battery reserve. Telemetry telemetry latency increasing.';
          } else if (targetNode.type === 'EMERGENCY ACCESS') {
            status = 'IMPACTED';
            operationalImpact = 'District Command isolated from primary telemetry and direct road corridor.';
          } else {
            status = 'IMPACTED';
            operationalImpact = targetNode.failureConsequence;
          }

          steps.push({
            timeStep: timeStepLabels[timeIndex],
            nodeId: targetNode.id,
            nodeName: targetNode.name,
            nodeType: targetNode.type,
            status,
            triggerSourceNodeId: sourceId,
            cause: `Cascade propagation via ${edge.dependencyType.toLowerCase().replace('_', ' ')} link from ${nodeMap.get(sourceId)?.code || sourceId}`,
            operationalImpact,
            affectedServices: [targetNode.type, `${edge.dependencyType.replace('_', ' ')} Interruption`]
          });
        }
      }
    }

    currentFrontier = nextFrontier;
    timeIndex++;
  }

  // Calculate downstream summary statistics
  const directDownstreamCount = initiatingNode.downstreamIds.length;
  const totalDownstreamCount = visitedNodeIds.size - 1; // excluding initiating node

  const criticalServiceTypes = new Set(['HOSPITAL', 'SHELTER', 'EMERGENCY ACCESS', 'WATER']);
  let criticalServicesCount = 0;
  let emergencyAccessCompromised = false;

  visitedNodeIds.forEach(id => {
    const n = nodeMap.get(id);
    if (n && n.id !== initiatingNode.id) {
      if (criticalServiceTypes.has(n.type)) {
        criticalServicesCount++;
      }
      if (n.type === 'EMERGENCY ACCESS' || n.type === 'ROAD' || n.type === 'HOSPITAL') {
        emergencyAccessCompromised = true;
      }
    }
  });

  let cascadeRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (totalDownstreamCount >= 3 || criticalServicesCount >= 2) {
    cascadeRiskLevel = 'HIGH';
  }
  if (totalDownstreamCount >= 5 || (criticalServicesCount >= 2 && emergencyAccessCompromised)) {
    cascadeRiskLevel = 'CRITICAL';
  } else if (totalDownstreamCount === 1) {
    cascadeRiskLevel = 'MODERATE';
  }

  return {
    initiatingNodeId: initiatingNode.id,
    initiatingNodeName: initiatingNode.name,
    steps,
    directImpactCount: directDownstreamCount > 0 ? 1 : 0,
    downstreamImpactCount: totalDownstreamCount,
    criticalServicesImpactedCount: criticalServicesCount,
    emergencyAccessAtRisk: emergencyAccessCompromised,
    cascadeRiskLevel,
    affectedNodeIds: Array.from(visitedNodeIds),
    activeEdgeIds
  };
}
