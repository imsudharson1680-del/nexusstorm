import React, { useState } from 'react';
import { CycloneScenario, InfrastructureNode } from '../../types';
import { PRESET_SCENARIOS, calculateCustomHazard } from '../../data/scenarios';
import { 
  CloudLightning, 
  Wind, 
  Gauge, 
  Droplet, 
  Compass, 
  Navigation, 
  Sliders, 
  ShieldAlert, 
  Eye, 
  CheckCircle,
  Radio
} from 'lucide-react';

interface StormIntelligenceViewProps {
  currentScenario: CycloneScenario;
  onSelectScenario: (scenario: CycloneScenario) => void;
  nodes: InfrastructureNode[];
}

export const StormIntelligenceView: React.FC<StormIntelligenceViewProps> = ({
  currentScenario,
  onSelectScenario,
  nodes
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'compare'>('presets');

  // Custom scenario sliders state
  const [customWind, setCustomWind] = useState<number>(185);
  const [customRain, setCustomRain] = useState<number>(110);
  const [customPressure, setCustomPressure] = useState<number>(950);
  const [customSurge, setCustomSurge] = useState<number>(2.8);

  const handleApplyCustomScenario = () => {
    const { hazardIndex, hazardLevel } = calculateCustomHazard(
      customWind,
      customRain,
      customPressure,
      customSurge
    );

    const custom: CycloneScenario = {
      id: 'custom',
      name: 'CUSTOM OPERATIONAL SCENARIO',
      categoryName: `Custom Cyclone Simulation (${customWind} km/h, ${customSurge}m surge)`,
      description: 'User-calibrated storm parameters simulating tailored atmospheric and hydro-dynamic conditions.',
      windSpeedKmh: customWind,
      rainfallMm: customRain,
      pressureHpa: customPressure,
      stormSurgeMeters: customSurge,
      headingDegrees: 300,
      forwardSpeedKmh: 20,
      eyeRadiusKm: 24,
      cycloneCenter: { lat: 17.70, lng: 83.36 },
      hazardIndex,
      hazardLevel
    };

    onSelectScenario(custom);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] font-bold flex items-center gap-1.5">
              <CloudLightning className="w-3.5 h-3.5" />
              METEOROLOGICAL HAZARD RADAR
            </span>
            <span className="text-[10px] font-mono text-[#94A3B8]">
              ATMOSPHERIC & HYDRODYNAMIC FORCING
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            STORM INTELLIGENCE & SCENARIO ENGINE
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            Calibrate cyclone track, intensity parameters, and coastal surge dynamics
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#0B1220] border border-[#1E3A5F] rounded-lg p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'presets' ? 'bg-[#38BDF8] text-[#050A12] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            PRESET SCENARIOS
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'custom' ? 'bg-[#38BDF8] text-[#050A12] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            CUSTOM SCENARIO
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'compare' ? 'bg-[#38BDF8] text-[#050A12] font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            SCENARIO MATRIX
          </button>
        </div>
      </div>

      {/* Tab 1: Preset Scenarios */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.values(PRESET_SCENARIOS).map((sc) => {
            const isSelected = currentScenario.id === sc.id;
            return (
              <div
                key={sc.id}
                className={`bg-[#101A2B] border rounded-xl p-5 shadow-xl transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#38BDF8] shadow-glow-sky bg-[#152238]'
                    : 'border-[#1E3A5F] hover:border-[#38BDF8]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B1220] text-[#38BDF8] font-bold">
                      {sc.name.split(':')[0]}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      sc.hazardLevel === 'CRITICAL'
                        ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                        : sc.hazardLevel === 'HIGH'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                        : 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                    }`}>
                      INDEX {sc.hazardIndex} &bull; {sc.hazardLevel}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#F8FAFC] tracking-tight">
                    {sc.name.split(':')[1]}
                  </h3>
                  <div className="text-xs text-[#38BDF8] font-mono mt-0.5">
                    {sc.categoryName}
                  </div>

                  <p className="text-xs text-[#94A3B8] font-sans mt-2.5 leading-relaxed">
                    {sc.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#1E3A5F] font-mono text-xs">
                    <div className="bg-[#0B1220] p-2 rounded border border-[#1E3A5F]/60">
                      <div className="text-[10px] text-[#94A3B8]">WIND SPEED</div>
                      <div className="text-sm font-bold text-[#F8FAFC]">{sc.windSpeedKmh} km/h</div>
                    </div>
                    <div className="bg-[#0B1220] p-2 rounded border border-[#1E3A5F]/60">
                      <div className="text-[10px] text-[#94A3B8]">STORM SURGE</div>
                      <div className="text-sm font-bold text-[#EF4444]">+{sc.stormSurgeMeters}m</div>
                    </div>
                    <div className="bg-[#0B1220] p-2 rounded border border-[#1E3A5F]/60">
                      <div className="text-[10px] text-[#94A3B8]">PRESSURE</div>
                      <div className="text-sm font-bold text-[#F8FAFC]">{sc.pressureHpa} hPa</div>
                    </div>
                    <div className="bg-[#0B1220] p-2 rounded border border-[#1E3A5F]/60">
                      <div className="text-[10px] text-[#94A3B8]">PRECIPITATION</div>
                      <div className="text-sm font-bold text-[#22D3EE]">{sc.rainfallMm} mm/h</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <button
                    onClick={() => onSelectScenario(sc)}
                    className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-[#38BDF8] text-[#050A12] shadow-glow-sky'
                        : 'bg-[#152238] text-[#F8FAFC] hover:bg-[#1E3A5F] border border-[#1E3A5F]'
                    }`}
                  >
                    {isSelected ? '✓ ACTIVE SCENARIO' : 'LOAD SCENARIO'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Custom Scenario Sliders */}
      {activeTab === 'custom' && (
        <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-6">
            <div>
              <h3 className="text-base font-bold font-mono text-[#F8FAFC]">
                CUSTOM CYCLONE SIMULATION BUILDER
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Adjust environmental parameters to test network vulnerability under synthetic storm intensities
              </p>
            </div>
            <button
              onClick={handleApplyCustomScenario}
              className="px-5 py-2 rounded-lg bg-[#38BDF8] text-[#050A12] font-mono text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-glow-sky"
            >
              APPLY CUSTOM SCENARIO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slider 1: Wind */}
            <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-[#38BDF8]" />
                  PEAK SUSTAINED WIND (KM/H)
                </span>
                <span className="text-base font-bold text-[#F8FAFC]">{customWind} km/h</span>
              </div>
              <input
                type="range"
                min="60"
                max="260"
                step="5"
                value={customWind}
                onChange={e => setCustomWind(Number(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>60 km/h (Depression)</span>
                <span>175 km/h (Severe)</span>
                <span>260 km/h (Super Cyclone)</span>
              </div>
            </div>

            {/* Slider 2: Storm Surge */}
            <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-[#22D3EE]" />
                  STORM SURGE HEIGHT (METERS)
                </span>
                <span className="text-base font-bold text-[#EF4444]">+{customSurge} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={customSurge}
                onChange={e => setCustomSurge(Number(e.target.value))}
                className="w-full accent-[#EF4444] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>0.5m (Fringe tide)</span>
                <span>2.4m (Inundation)</span>
                <span>5.0m (Catastrophic)</span>
              </div>
            </div>

            {/* Slider 3: Central Pressure */}
            <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#F59E0B]" />
                  CENTRAL BAROMETRIC PRESSURE (HPA)
                </span>
                <span className="text-base font-bold text-[#F8FAFC]">{customPressure} hPa</span>
              </div>
              <input
                type="range"
                min="910"
                max="1005"
                step="5"
                value={customPressure}
                onChange={e => setCustomPressure(Number(e.target.value))}
                className="w-full accent-[#F59E0B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>910 hPa (Extreme)</span>
                <span>960 hPa (Severe)</span>
                <span>1005 hPa (Mild)</span>
              </div>
            </div>

            {/* Slider 4: Precipitation */}
            <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-[#38BDF8]" />
                  PEAK HOURLY PRECIPITATION (MM/H)
                </span>
                <span className="text-base font-bold text-[#22D3EE]">{customRain} mm/h</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="5"
                value={customRain}
                onChange={e => setCustomRain(Number(e.target.value))}
                className="w-full accent-[#22D3EE] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                <span>20 mm/h (Heavy)</span>
                <span>95 mm/h (Torrential)</span>
                <span>200 mm/h (Extreme Cloudburst)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Scenario Matrix Comparison (Section 45) */}
      {activeTab === 'compare' && (
        <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl">
          <div className="border-b border-[#1E3A5F] pb-3 mb-4">
            <h3 className="text-sm font-bold font-mono text-[#F8FAFC]">
              SCENARIO COMPARISON MATRIX
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Cross-scenario evaluation of hazard parameters, asset exposure, and cascade potential
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1E3A5F] text-[#94A3B8]">
                  <th className="py-2.5 px-3">EVALUATION METRIC</th>
                  <th className="py-2.5 px-3">SCENARIO 01 (MODERATE)</th>
                  <th className="py-2.5 px-3 text-[#38BDF8]">SCENARIO 02 (SEVERE BASELINE)</th>
                  <th className="py-2.5 px-3 text-[#EF4444]">SCENARIO 03 (EXTREME EVENT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]/60">
                <tr>
                  <td className="py-3 px-3 text-[#F8FAFC] font-semibold">Hazard Index</td>
                  <td className="py-3 px-3 text-[#38BDF8]">58 (Moderate)</td>
                  <td className="py-3 px-3 font-bold text-[#F59E0B]">78 (High)</td>
                  <td className="py-3 px-3 font-bold text-[#EF4444]">96 (Critical)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-[#F8FAFC] font-semibold">Winds & Surge</td>
                  <td className="py-3 px-3 text-[#94A3B8]">120 km/h &bull; 0.9m</td>
                  <td className="py-3 px-3 text-[#F8FAFC]">175 km/h &bull; 2.4m</td>
                  <td className="py-3 px-3 text-[#EF4444]">235 km/h &bull; 4.2m</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-[#F8FAFC] font-semibold">Assets in High Hazard Zone</td>
                  <td className="py-3 px-3 text-[#94A3B8]">3 of 12 Assets</td>
                  <td className="py-3 px-3 text-[#F8FAFC]">7 of 12 Assets</td>
                  <td className="py-3 px-3 text-[#EF4444]">11 of 12 Assets</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-[#F8FAFC] font-semibold">Critical Root Nodes</td>
                  <td className="py-3 px-3 text-[#94A3B8]">1 (Substation A)</td>
                  <td className="py-3 px-3 text-[#F8FAFC]">3 (Substation A, Road C, Bridge D)</td>
                  <td className="py-3 px-3 text-[#EF4444]">6 Multiple Root Breaches</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-[#F8FAFC] font-semibold">Cascade Reach Potential</td>
                  <td className="py-3 px-3 text-[#94A3B8]">2 Downstream Hops</td>
                  <td className="py-3 px-3 font-bold text-[#F59E0B]">4 Downstream Hops (Multi-service)</td>
                  <td className="py-3 px-3 font-bold text-[#EF4444]">Network-wide Grid Collapse</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-[#F8FAFC] font-semibold">Primary Priority Intervention</td>
                  <td className="py-3 px-3 text-[#94A3B8]">Drainage clearing & monitoring</td>
                  <td className="py-3 px-3 font-bold text-[#38BDF8]">Fortify Substation A & Road C</td>
                  <td className="py-3 px-3 font-bold text-[#EF4444]">Mass Mandatory Evacuation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
