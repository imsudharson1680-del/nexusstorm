import React, { useState } from 'react';
import { InfrastructureNode, InfrastructureType } from '../../types';
import { 
  Building2, 
  Search, 
  Filter, 
  Flame, 
  ArrowRight, 
  Zap, 
  Truck, 
  Building, 
  ShieldCheck, 
  Droplet, 
  Radio, 
  Anchor, 
  AlertTriangle,
  Grid
} from 'lucide-react';
import { generateRiskMatrix } from '../../engine/riskEngine';

interface InfrastructureListViewProps {
  nodes: InfrastructureNode[];
  selectedNode: InfrastructureNode;
  onSelectNode: (node: InfrastructureNode) => void;
  onTriggerSimulation: (nodeId: string) => void;
}

export const InfrastructureListView: React.FC<InfrastructureListViewProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  onTriggerSimulation
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredNodes = nodes.filter(n => {
    const matchesSearch = 
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || n.type === selectedType;
    return matchesSearch && matchesType;
  });

  const matrixCells = generateRiskMatrix(nodes);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] font-bold">
              ASSET REGISTRY 03
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              MONITORED COASTAL LIFELINE DIRECTORY
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            CRITICAL INFRASTRUCTURE ASSETS ({nodes.length})
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            Interpretable asset vulnerability, coastal exposure, and upstream/downstream lifelines
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search assets or codes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-[#0B1220] border border-[#1E3A5F] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] w-52 font-mono"
            />
          </div>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-[#0B1220] border border-[#1E3A5F] rounded-lg px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] font-mono"
          >
            <option value="ALL">ALL SECTORS</option>
            <option value="POWER">POWER</option>
            <option value="ROAD">ROAD</option>
            <option value="BRIDGE">BRIDGE</option>
            <option value="HOSPITAL">HOSPITAL</option>
            <option value="SHELTER">SHELTER</option>
            <option value="WATER">WATER</option>
            <option value="COMMUNICATION">COMMUNICATION</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#0B1220] border-b border-[#1E3A5F] text-[#94A3B8]">
                <th className="py-3 px-4">CODE</th>
                <th className="py-3 px-4">ASSET NAME & TYPE</th>
                <th className="py-3 px-4">ELEV / COAST</th>
                <th className="py-3 px-4">EXPOSURE</th>
                <th className="py-3 px-4">VULNERABILITY</th>
                <th className="py-3 px-4">DEPENDENCY</th>
                <th className="py-3 px-4">PROTOTYPE RISK</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/50">
              {filteredNodes.map(node => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <tr
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#152238] border-l-4 border-l-[#38BDF8]' : 'hover:bg-[#0E1726]'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#38BDF8]">{node.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#F8FAFC] font-sans text-xs">{node.name}</div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">{node.type} &bull; {node.capacityMetric?.split('(')[0] || 'Operational'}</div>
                    </td>
                    <td className="py-3 px-4 text-[#94A3B8]">
                      {node.elevationMeters}m / {node.distanceToCoastKm}km
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{node.exposure}</span>
                        <div className="w-12 bg-[#050A12] h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#38BDF8]" style={{ width: `${node.exposure}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{node.vulnerability}</span>
                        <div className="w-12 bg-[#050A12] h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F59E0B]" style={{ width: `${node.vulnerability}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#22D3EE]">{node.dependency}</span>
                        <div className="w-12 bg-[#050A12] h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#22D3EE]" style={{ width: `${node.dependency}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        node.riskIndex >= 85
                          ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                          : node.riskIndex >= 70
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                          : 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                      }`}>
                        {node.riskIndex} &bull; {node.riskIndex >= 85 ? 'CRITICAL' : node.riskIndex >= 70 ? 'HIGH' : 'MODERATE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNode(node);
                          onTriggerSimulation(node.id);
                        }}
                        className="p-1.5 rounded bg-[#EF4444]/15 hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#EF4444]/40 transition-colors"
                        title="Simulate Failure for this node"
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPOSURE × VULNERABILITY RISK MATRIX (Section 46) */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl">
        <div className="border-b border-[#1E3A5F] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-bold font-mono text-[#F8FAFC]">
              EXPOSURE × VULNERABILITY MATRIX & NETWORK DEPENDENCY DECOUPLING
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] font-sans mt-0.5">
            Explains visually why an asset with moderate physical risk can have highest intervention priority due to downstream dependency reach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-[#0B1220] p-4 rounded-lg border border-[#EF4444]/50">
            <div className="text-[#EF4444] font-bold text-xs mb-1">
              HIGH EXPOSURE / HIGH VULNERABILITY (4 Assets)
            </div>
            <p className="text-[11px] text-[#94A3B8] font-sans mb-3">
              Direct physical devastation risk from combined cyclone surge and fragile design.
            </p>
            <div className="space-y-1.5 text-[11px] text-[#F8FAFC]">
              <div>&bull; Substation Alpha (SUB-01A)</div>
              <div>&bull; Highway 104 Coastal Trunk (HWY-104C)</div>
              <div>&bull; Baymouth Suspension Bridge (BRG-04D)</div>
              <div>&bull; Deepwater Logistics Port (PORT-08P)</div>
            </div>
          </div>

          <div className="bg-[#0B1220] p-4 rounded-lg border border-[#F59E0B]/50">
            <div className="text-[#F59E0B] font-bold text-xs mb-1">
              MODERATE PHYSICAL RISK / EXTREME DEPENDENCY (3 Assets)
            </div>
            <p className="text-[11px] text-[#94A3B8] font-sans mb-3">
              Protected terrain, but critical failure would cascade into immediate life-safety disruption.
            </p>
            <div className="space-y-1.5 text-[11px] text-[#F8FAFC]">
              <div>&bull; St. Jude Regional Trauma (HOSP-02B)</div>
              <div>&bull; Harbor Heights Mega Shelter (SHLT-04D)</div>
              <div>&bull; Bay Desalination & Pumping (WTR-05E)</div>
            </div>
          </div>

          <div className="bg-[#0B1220] p-4 rounded-lg border border-[#38BDF8]/50">
            <div className="text-[#38BDF8] font-bold text-xs mb-1">
              ELEVATED TERRAIN / INLAND LIFELINES (5 Assets)
            </div>
            <p className="text-[11px] text-[#94A3B8] font-sans mb-3">
              Secondary relief corridors, auxiliary telecommunication towers, and district command.
            </p>
            <div className="space-y-1.5 text-[11px] text-[#F8FAFC]">
              <div>&bull; District Emergency Operations (EOC-09E)</div>
              <div>&bull; Substation Beta (SUB-02B)</div>
              <div>&bull; Coastal Microwave Array (COM-06F)</div>
              <div>&bull; Central Arterial Bypass (RD-BY05)</div>
              <div>&bull; North Ridge Shelter (SHLT-07G)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
