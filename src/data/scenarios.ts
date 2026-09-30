import { CycloneScenario } from '../types';

export const PRESET_SCENARIOS: Record<string, CycloneScenario> = {
  'moderate': {
    id: 'moderate',
    name: 'SCENARIO 01: MODERATE CYCLONE',
    categoryName: 'Category 2 Tropical Cyclone (IMD Severe Cyclonic Storm)',
    description: 'Developing coastal low-pressure system generating moderate gale-force gusts and localized coastal fringe flooding.',
    windSpeedKmh: 120,
    rainfallMm: 45,
    pressureHpa: 988,
    stormSurgeMeters: 0.9,
    headingDegrees: 315,
    forwardSpeedKmh: 18,
    eyeRadiusKm: 28,
    cycloneCenter: { lat: 17.65, lng: 83.42 },
    hazardIndex: 58,
    hazardLevel: 'MODERATE'
  },
  'severe': {
    id: 'severe',
    name: 'SCENARIO 02: SEVERE CYCLONE (BASELINE)',
    categoryName: 'Category 4 Very Severe Cyclonic Storm',
    description: 'High-energy maritime cyclone tracking northwest toward Baymouth estuary with destructive eyewall winds and 2.4m storm surge.',
    windSpeedKmh: 175,
    rainfallMm: 95,
    pressureHpa: 960,
    stormSurgeMeters: 2.4,
    headingDegrees: 305,
    forwardSpeedKmh: 22,
    eyeRadiusKm: 22,
    cycloneCenter: { lat: 17.70, lng: 83.38 },
    hazardIndex: 78,
    hazardLevel: 'HIGH'
  },
  'extreme': {
    id: 'extreme',
    name: 'SCENARIO 03: EXTREME COASTAL EVENT',
    categoryName: 'Category 5 Super Cyclonic Storm',
    description: 'Catastrophic central pressure anomaly generating over 230 km/h gusts, torrential rainfall exceeding 150mm/h, and 4.2m storm tide inundating low elevation corridors.',
    windSpeedKmh: 235,
    rainfallMm: 160,
    pressureHpa: 928,
    stormSurgeMeters: 4.2,
    headingDegrees: 295,
    forwardSpeedKmh: 26,
    eyeRadiusKm: 18,
    cycloneCenter: { lat: 17.71, lng: 83.35 },
    hazardIndex: 96,
    hazardLevel: 'CRITICAL'
  }
};

export function calculateCustomHazard(wind: number, rain: number, pressure: number, surge: number): { hazardIndex: number; hazardLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' } {
  // Normalized formula based on meteorological danger scales
  // Wind: 50-250 km/h -> 0-100
  const windScore = Math.min(100, Math.max(0, ((wind - 50) / 200) * 100));
  // Rain: 10-180 mm -> 0-100
  const rainScore = Math.min(100, Math.max(0, ((rain - 10) / 170) * 100));
  // Pressure: 1010 down to 910 hPa -> 0-100
  const pressureScore = Math.min(100, Math.max(0, ((1010 - pressure) / 100) * 100));
  // Surge: 0 to 5m -> 0-100
  const surgeScore = Math.min(100, Math.max(0, (surge / 5.0) * 100));

  const compositeHazard = Math.round(
    windScore * 0.35 +
    surgeScore * 0.30 +
    rainScore * 0.20 +
    pressureScore * 0.15
  );

  let hazardLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (compositeHazard >= 85) hazardLevel = 'CRITICAL';
  else if (compositeHazard >= 70) hazardLevel = 'HIGH';
  else if (compositeHazard >= 40) hazardLevel = 'MODERATE';

  return {
    hazardIndex: compositeHazard,
    hazardLevel
  };
}
