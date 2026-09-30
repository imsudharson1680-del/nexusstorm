import React from 'react';
import { Database, Globe, Cpu, CheckCircle2, Shield, AlertCircle, ArrowDown } from 'lucide-react';

export const DataModelsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] font-bold">
            DATA PROVENANCE & PIPELINE ARCHITECTURE
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8]">
            SECTION 08
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
          DATA PROVENANCE, MODELS & AUDITABILITY
        </h2>
        <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
          Strict verification standards distinguishing raw observations, derived physics models, graph simulations, and AI explanations.
        </p>
      </div>

      {/* 5-Layer Data Interpretation (Section 38) */}
      <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-bold font-mono text-[#F8FAFC] mb-4 pb-2 border-b border-[#1E3A5F]">
          FIVE-LAYER DATA INTERPRETATION LIFECYCLE
        </h3>

        <div className="space-y-4">
          {/* Layer 1 */}
          <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#38BDF8] px-2 py-0.5 rounded bg-[#101A2B]">LAYER 1</span>
                <span className="font-bold text-sm text-[#F8FAFC]">RAW ENVIRONMENTAL OBSERVATION DATA</span>
              </div>
              <p className="text-xs text-[#94A3B8] font-sans">
                Peak sustained wind (175 km/h), Precipitation rate (95 mm/h), Central pressure (960 hPa), Storm surge height (2.4m).
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#050A12] border border-[#1E3A5F] text-[#38BDF8] font-semibold self-start md:self-auto">
              SIMULATED INPUTS
            </span>
          </div>

          <div className="flex justify-center text-[#1E3A5F]">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Layer 2 */}
          <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#22D3EE] px-2 py-0.5 rounded bg-[#101A2B]">LAYER 2</span>
                <span className="font-bold text-sm text-[#F8FAFC]">DERIVED PHYSICAL FEATURES</span>
              </div>
              <p className="text-xs text-[#94A3B8] font-sans">
                Wind gradient shear, rainfall accumulation index, barometric pressure anomaly, coastal digital elevation model (DEM) surge overlap.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#050A12] border border-[#1E3A5F] text-[#22D3EE] font-semibold self-start md:self-auto">
              MODELLED
            </span>
          </div>

          <div className="flex justify-center text-[#1E3A5F]">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Layer 3 */}
          <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#F59E0B] px-2 py-0.5 rounded bg-[#101A2B]">LAYER 3</span>
                <span className="font-bold text-sm text-[#F8FAFC]">INFRASTRUCTURE HAZARD & RISK ENGINE</span>
              </div>
              <p className="text-xs text-[#94A3B8] font-sans">
                Formula: Risk = Hazard (31%) + Exposure (24%) + Vulnerability (19%) + Network Dependency (26%). Normalized to 0–100.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#050A12] border border-[#1E3A5F] text-[#F59E0B] font-semibold self-start md:self-auto">
              MODELLED PROTOTYPE
            </span>
          </div>

          <div className="flex justify-center text-[#1E3A5F]">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Layer 4 */}
          <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#EF4444] px-2 py-0.5 rounded bg-[#101A2B]">LAYER 4</span>
                <span className="font-bold text-sm text-[#F8FAFC]">GRAPH-BASED CASCADE SIMULATION</span>
              </div>
              <p className="text-xs text-[#94A3B8] font-sans">
                Topological failure propagation across directed acyclic edges: T+00 Substation A → T+02 Road C → T+04 Hospital B → T+06 Shelter D.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#050A12] border border-[#1E3A5F] text-[#EF4444] font-semibold self-start md:self-auto">
              SIMULATION OUTPUT
            </span>
          </div>

          <div className="flex justify-center text-[#1E3A5F]">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Layer 5 */}
          <div className="bg-[#0B1220] p-4 rounded-lg border border-[#1E3A5F] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#A855F7] px-2 py-0.5 rounded bg-[#101A2B]">LAYER 5</span>
                <span className="font-bold text-sm text-[#F8FAFC]">AI EXPLANATION LAYER (GEMINI / REASONING ENGINE)</span>
              </div>
              <p className="text-xs text-[#94A3B8] font-sans">
                Translates mathematical cascade graph results into high-clarity 4-quadrant operational commander briefs with attribution factors.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#050A12] border border-[#1E3A5F] text-[#A855F7] font-semibold self-start md:self-auto">
              AI EXPLANATION — DEMO MODE
            </span>
          </div>
        </div>
      </div>

      {/* Production Integration Readiness (Section 39, 40) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
        <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#38BDF8]" />
              <h4 className="font-bold text-[#F8FAFC]">EARTH OBSERVATION INTEGRATION</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B1220] text-[#38BDF8] border border-[#1E3A5F]">
              PRODUCTION TARGET
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-sans">
            Architecture configured for Google Earth Engine (GEE), Copernicus Sentinel-1 SAR flood extent mapping, and SRTM 30m digital terrain elevation.
          </p>
          <div className="text-[11px] text-[#38BDF8] bg-[#0B1220] p-2.5 rounded border border-[#1E3A5F]">
            STATUS: <span className="text-[#F8FAFC] font-semibold">EARTH OBSERVATION — PRODUCTION INTEGRATION (OFFLINE IN PROTOTYPE)</span>
          </div>
        </div>

        <div className="bg-[#101A2B] border border-[#1E3A5F] rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#22D3EE]" />
              <h4 className="font-bold text-[#F8FAFC]">METEOROLOGICAL TELEMETRY</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B1220] text-[#22D3EE] border border-[#1E3A5F]">
              PRODUCTION TARGET
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-sans">
            Designed to ingest live best-track bulletins from IMD (India Meteorological Department), JTWC, and ECMWF ensemble tropical cyclone forecasts.
          </p>
          <div className="text-[11px] text-[#22D3EE] bg-[#0B1220] p-2.5 rounded border border-[#1E3A5F]">
            STATUS: <span className="text-[#F8FAFC] font-semibold">SIMULATED HISTORICAL CALIBRATION (NO FAKE LIVE DATA)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
