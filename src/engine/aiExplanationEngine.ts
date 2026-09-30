import { InfrastructureNode, CascadeSimulationResult, AIDecisionBrief } from '../types';

export function generateAIDecisionBrief(
  selectedNode: InfrastructureNode,
  simulationResult: CascadeSimulationResult | null,
  allNodes: InfrastructureNode[]
): AIDecisionBrief {
  const nodeMap = new Map<string, InfrastructureNode>();
  allNodes.forEach(n => nodeMap.set(n.id, n));

  const downstreamNames = selectedNode.downstreamIds
    .map(id => nodeMap.get(id)?.name || id)
    .slice(0, 4);

  // Structured Decision Brief Fields
  let whyThisNode = '';
  let whatCouldHappen = '';
  let whatIsMostCritical = '';
  let whatShouldBeDone = '';

  if (selectedNode.id === 'substation-alpha') {
    whyThisNode = `${selectedNode.name} is a high-priority intervention point because it combines elevated hazard exposure (${selectedNode.exposure}/100) with severe network dependency (${selectedNode.dependency}/100). As the coastal transmission root, multiple critical municipal lifelines depend directly upon its 400kV bus.`;
    whatCouldHappen = `A simulated or physical breaker trip at Substation Alpha propagates immediately along Highway 104 (Road Charlie), de-energizing traffic controls and stormwater pumps. Within 4 hours, cascading power disruptions impact St. Jude Regional Trauma Center (Hospital Bravo) and Harbor Heights Mega Shelter (Shelter Delta), with complete loss of desalinated water pressure at Water Echo.`;
    whatIsMostCritical = `Downstream dependency amplification: while physical hazard at the substation is high, the systemic consequence to healthcare delivery and 5,000 shelter residents makes this node the single most critical vulnerability link in the coastal grid.`;
    whatShouldBeDone = `Immediate deployment of mobile flood barrier barriers around the 400kV switchgear yard, pre-staging of 2.5MW emergency diesel generators at hospital and shelter feeder boundaries, and manual verification of SCADA islanding breakers before cyclone landfall.`;
  } else if (selectedNode.id === 'road-charlie') {
    whyThisNode = `${selectedNode.name} represents a single point of failure in the regional transit network, running through a low-lying 2.1m elevation coastal floodplain directly in the projected surge corridor.`;
    whatCouldHappen = `Storm surge inundation and stormwater pump failure sever emergency ambulance transit to St. Jude Trauma Center and isolate Harbor Heights Shelter, cutting off casualty evacuations and logistical relief.`;
    whatIsMostCritical = `Loss of emergency transit access paralyzes regional healthcare operations even if hospital internal backup power systems remain operational.`;
    whatShouldBeDone = `Deploy heavy-duty dewatering pump units at low-lying underpasses, establish police-controlled contraflow lane protocols on the elevated bypass, and position high-clearance military rescue vehicles.`;
  } else if (selectedNode.id === 'hospital-bravo') {
    whyThisNode = `${selectedNode.name} is the sole Level-1 surgical and critical trauma facility in the coastal sector, exhibiting high compound vulnerability due to concurrent dependencies on electrical power, transit access, and municipal water.`;
    whatCouldHappen = `Grid outage forces reliance on emergency diesel fuel (rated for 48 hours). If access roads flood, fuel resupply, medical oxygen tankers, and emergency casualty arrivals are halted simultaneously.`;
    whatIsMostCritical = `Preserving continuous intensive care unit (ICU) life support for 120 critical patients and maintaining helicopter medevac landing pad clearance.`;
    whatShouldBeDone = `Lock down auxiliary diesel generator fuel manifolds, confirm 72-hour medical oxygen cylinder reserves, test water reservoir buffer pressurization, and activate rooftop helipad floodlights.`;
  } else {
    // Universal deterministic synthesis for any node
    whyThisNode = `${selectedNode.name} is classified as ${selectedNode.criticality >= 85 ? 'CRITICAL' : 'HIGH'} priority with a prototype risk index of ${selectedNode.riskIndex}/100. Primary operational driver: ${selectedNode.primaryDriver}.`;
    whatCouldHappen = selectedNode.downstreamIds.length > 0 
      ? `Simulated failure cascades downstream across ${selectedNode.downstreamIds.length} connected lifelines, potentially compromising ${downstreamNames.join(', ')}.`
      : `Localized service interruption affecting immediate service footprint (${selectedNode.capacityMetric || 'standard capacity'}).`;
    whatIsMostCritical = `Mitigating cascade propagation into emergency life-safety lifelines and preserving operational continuity.`;
    whatShouldBeDone = selectedNode.recommendedIntervention;
  }

  return {
    nodeId: selectedNode.id,
    nodeName: selectedNode.name,
    riskLevel: selectedNode.riskIndex >= 85 ? 'CRITICAL' : selectedNode.riskIndex >= 70 ? 'HIGH' : selectedNode.riskIndex >= 40 ? 'MODERATE' : 'LOW',
    whyThisNode,
    whatCouldHappen,
    whatIsMostCritical,
    whatShouldBeDone,
    attribution: {
      hazard: selectedNode.hazardContribution,
      exposure: selectedNode.exposureContribution,
      vulnerability: selectedNode.vulnerabilityContribution,
      dependency: selectedNode.dependencyContribution
    },
    primaryDriver: selectedNode.primaryDriver,
    downstreamServices: downstreamNames.length > 0 ? downstreamNames : ['Direct Localized Footprint'],
    isDemoMode: true,
    generatedTimestamp: new Date().toLocaleTimeString()
  };
}
