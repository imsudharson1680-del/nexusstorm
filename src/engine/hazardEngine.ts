import { InfrastructureNode, CycloneScenario } from '../types';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function updateNodesWithScenario(nodes: InfrastructureNode[], scenario: CycloneScenario): InfrastructureNode[] {
  return nodes.map(node => {
    const distToCenter = calculateDistanceKm(
      node.lat,
      node.lng,
      scenario.cycloneCenter.lat,
      scenario.cycloneCenter.lng
    );

    // Hazard field attenuation based on radial distance from storm eye
    // Close to eye radius -> maximum wind shear and torrential rain
    const eyeFactor = Math.max(0, 1 - Math.abs(distToCenter - scenario.eyeRadiusKm) / 45);
    const stormSurgeInundationRisk = Math.max(0, Math.min(100, ((scenario.stormSurgeMeters * 1.5 - node.elevationMeters) / 3.0) * 100));

    // Dynamic exposure score based on proximity and coastal proximity
    const baseProximityExposure = Math.max(20, Math.min(100, Math.round(
      (1 - Math.min(distToCenter, 40) / 40) * 60 + 
      (1 - Math.min(node.distanceToCoastKm, 5) / 5) * 40
    )));

    // Scale by scenario severity
    const scenarioScale = scenario.hazardIndex / 78; // baseline 78
    const dynamicExposure = Math.min(100, Math.max(20, Math.round(baseProximityExposure * scenarioScale)));

    // Recompute composite risk
    // Hazard contribution (31%), Exposure (24%), Vulnerability (19%), Dependency (26%)
    const rawRisk = 
      (scenario.hazardIndex * 0.31) + 
      (dynamicExposure * 0.24) + 
      (node.vulnerability * 0.19) + 
      (node.dependency * 0.26);

    const riskIndex = Math.min(100, Math.max(10, Math.round(rawRisk)));

    // Determine primary driver
    let primaryDriver = 'Network dependency';
    if (scenario.hazardIndex > 85 && dynamicExposure > 85) {
      primaryDriver = 'Direct cyclone eyewall & storm surge inundation';
    } else if (node.dependency > 85) {
      primaryDriver = 'High downstream service dependency';
    } else if (node.vulnerability > 80) {
      primaryDriver = 'Structural fragility & low elevation floodplain';
    } else if (dynamicExposure > 80) {
      primaryDriver = 'Extreme coastal wind & surge exposure';
    }

    return {
      ...node,
      exposure: dynamicExposure,
      riskIndex,
      hazardContribution: Math.round((scenario.hazardIndex * 0.31 / rawRisk) * 100),
      exposureContribution: Math.round((dynamicExposure * 0.24 / rawRisk) * 100),
      vulnerabilityContribution: Math.round((node.vulnerability * 0.19 / rawRisk) * 100),
      dependencyContribution: Math.round((node.dependency * 0.26 / rawRisk) * 100),
      primaryDriver
    };
  });
}
