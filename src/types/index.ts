// Core Types for NEXUSSTORM Critical Infrastructure Cascade Intelligence

export type InfrastructureType = 
  | 'POWER' 
  | 'ROAD' 
  | 'BRIDGE' 
  | 'HOSPITAL' 
  | 'SHELTER' 
  | 'WATER' 
  | 'COMMUNICATION'
  | 'PORT'
  | 'EMERGENCY ACCESS';

export type NodeOperationalStatus = 
  | 'OPERATIONAL' 
  | 'STRESSED' 
  | 'IMPACTED' 
  | 'FAILED' 
  | 'ISOLATED';

export interface InfrastructureNode {
  id: string;
  name: string;
  code: string;
  type: InfrastructureType;
  lat: number;
  lng: number;
  elevationMeters: number;
  distanceToCoastKm: number;
  
  // Risk Metrics (0-100)
  exposure: number;       // How strongly exposed to current hazard
  vulnerability: number;  // Physical fragility / flood plain / elevation
  dependency: number;     // How many critical services rely on this
  criticality: number;    // Overall network criticality index
  riskIndex: number;      // Calculated prototype risk index

  // Risk factor contributions
  hazardContribution: number;
  exposureContribution: number;
  vulnerabilityContribution: number;
  dependencyContribution: number;
  primaryDriver: string;

  // Operational State
  status: NodeOperationalStatus;
  statusMessage: string;
  redundancyBackupAvailable: boolean;
  backupFuelHours?: number;
  capacityMetric?: string;
  
  // Graph Relationships
  downstreamIds: string[]; // Nodes that depend on this node
  upstreamIds: string[];   // Nodes this node depends on
  
  description: string;
  failureConsequence: string;
  recommendedIntervention: string;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  dependencyType: 'ELECTRICAL_POWER' | 'TRANSIT_ACCESS' | 'COOLING_WATER' | 'TELEMETRY' | 'SUPPLY_CHAIN';
  dependencyWeight: number; // 0 - 1.0 (Criticality of this link)
  redundancyAvailable: boolean;
  status: 'ACTIVE' | 'PROPAGATING' | 'DISRUPTED' | 'STANDBY';
}

export interface CycloneScenario {
  id: string;
  name: string;
  categoryName: string;
  description: string;
  windSpeedKmh: number;
  rainfallMm: number;
  pressureHpa: number;
  stormSurgeMeters: number;
  headingDegrees: number;
  forwardSpeedKmh: number;
  eyeRadiusKm: number;
  cycloneCenter: { lat: number; lng: number };
  hazardIndex: number;
  hazardLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface CascadeStep {
  timeStep: string; // e.g. "T+00", "T+02", "T+04", "T+06", "T+08"
  nodeId: string;
  nodeName: string;
  nodeType: InfrastructureType;
  status: NodeOperationalStatus;
  triggerSourceNodeId?: string;
  cause: string;
  operationalImpact: string;
  affectedServices: string[];
}

export interface CascadeSimulationResult {
  initiatingNodeId: string;
  initiatingNodeName: string;
  steps: CascadeStep[];
  directImpactCount: number;
  downstreamImpactCount: number;
  criticalServicesImpactedCount: number;
  emergencyAccessAtRisk: boolean;
  cascadeRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  affectedNodeIds: string[];
  activeEdgeIds: string[];
}

export interface PriorityAction {
  id: string;
  rank: number;
  category: 'PROTECT' | 'INSPECT' | 'MONITOR' | 'VERIFY';
  targetAssetId: string;
  targetAssetName: string;
  targetAssetType: InfrastructureType;
  actionTitle: string;
  rationale: string;
  leadAgency: string;
  urgency: 'IMMEDIATE' | 'HIGH' | 'ELEVATED' | 'ROUTINE';
  estimatedTimeToImpact: string;
}

export interface AIDecisionBrief {
  nodeId: string;
  nodeName: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  whyThisNode: string;
  whatCouldHappen: string;
  whatIsMostCritical: string;
  whatShouldBeDone: string;
  attribution: {
    hazard: number;
    exposure: number;
    vulnerability: number;
    dependency: number;
  };
  primaryDriver: string;
  downstreamServices: string[];
  isDemoMode: boolean;
  generatedTimestamp: string;
}

export type ActiveSection = 
  | 'command-center'
  | 'storm-intelligence'
  | 'infrastructure'
  | 'network-graph'
  | 'cascade-lab'
  | 'priority-actions'
  | 'ai-explanation'
  | 'data-models'
  | 'system-architecture';
