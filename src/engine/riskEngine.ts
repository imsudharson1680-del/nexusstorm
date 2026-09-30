import { InfrastructureNode } from '../types';

export function getRiskLevel(score: number): 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
  if (score >= 85) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MODERATE';
  return 'LOW';
}

export function getRiskColorClass(level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'): { text: string; bg: string; border: string; glow: string } {
  switch (level) {
    case 'CRITICAL':
      return {
        text: 'text-[#EF4444]',
        bg: 'bg-[#EF4444]/15',
        border: 'border-[#EF4444]/40',
        glow: 'shadow-glow-critical'
      };
    case 'HIGH':
      return {
        text: 'text-[#F59E0B]',
        bg: 'bg-[#F59E0B]/15',
        border: 'border-[#F59E0B]/40',
        glow: 'shadow-glow-warning'
      };
    case 'MODERATE':
      return {
        text: 'text-[#38BDF8]',
        bg: 'bg-[#38BDF8]/15',
        border: 'border-[#38BDF8]/40',
        glow: 'shadow-glow-sky'
      };
    case 'LOW':
    default:
      return {
        text: 'text-[#22C55E]',
        bg: 'bg-[#22C55E]/15',
        border: 'border-[#22C55E]/40',
        glow: 'shadow-glow-safe'
      };
  }
}

export interface RiskMatrixCell {
  exposureBand: 'LOW' | 'MODERATE' | 'HIGH';
  vulnerabilityBand: 'LOW' | 'MODERATE' | 'HIGH';
  nodeCount: number;
  nodeIds: string[];
}

export function generateRiskMatrix(nodes: InfrastructureNode[]): RiskMatrixCell[] {
  const getBand = (val: number): 'LOW' | 'MODERATE' | 'HIGH' => {
    if (val >= 75) return 'HIGH';
    if (val >= 50) return 'MODERATE';
    return 'LOW';
  };

  const bands: ('LOW' | 'MODERATE' | 'HIGH')[] = ['HIGH', 'MODERATE', 'LOW'];
  const cells: RiskMatrixCell[] = [];

  for (const exp of bands) {
    for (const vuln of bands) {
      const matchingNodes = nodes.filter(
        n => getBand(n.exposure) === exp && getBand(n.vulnerability) === vuln
      );
      cells.push({
        exposureBand: exp,
        vulnerabilityBand: vuln,
        nodeCount: matchingNodes.length,
        nodeIds: matchingNodes.map(n => n.id)
      });
    }
  }

  return cells;
}
