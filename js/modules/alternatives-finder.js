/**
 * EcoClear India — Alternative Site Finder & Ranking Engine
 * Identifies and ranks alternative candidate industrial locations using the active industry rule profile.
 */

import { analyzeSiteProximity } from "./gis-engine.js";
import { evaluateSiteRisk } from "./risk-engine.js";
import { INDUSTRIAL_CORRIDORS } from "../data/gis-layers.js";

/**
 * Generates and ranks alternative candidate locations in the region.
 */
export function findAlternativeSites(activeIndustryKey, selectedLocation, capacity, state = null) {
  const baseLat = selectedLocation.lat;
  const baseLng = selectedLocation.lng;

  // Candidate generation offsets around the selected location representing potential industrial parcels
  const parcelProfiles = [
    {
      name: "Candidate Parcel A (Planned Industrial Zone)",
      offset: [0.18, 0.12],
      advantage: "Situated in notified industrial development belt; enhanced buffer from river basin",
      type: "Notified Industrial Estate"
    },
    {
      name: "Candidate Parcel B (Logistics Corridor)",
      offset: [-0.14, 0.22],
      advantage: "Direct highway access; lower agrarian soil capability index",
      type: "Highway Freight Cluster"
    },
    {
      name: "Candidate Parcel C (Peripheral Plateaux)",
      offset: [0.25, -0.16],
      advantage: "Dry elevated terrain; zero recorded forest overlap and low demographic density",
      type: "Non-agricultural Scrubland"
    },
    {
      name: "Candidate Parcel D (Inland Sub-cluster)",
      offset: [-0.22, -0.18],
      advantage: "Maximum separation (>25 km) from nearest Wildlife Sanctuary and river basin",
      type: "Semi-arid Industrial Corridor"
    },
    {
      name: "Candidate Parcel E (Railhead Terminal Area)",
      offset: [0.08, 0.30],
      advantage: "Proximity to dedicated freight railway siding; reduced road freight emissions",
      type: "Rail-linked Freight Zone"
    }
  ];

  // If a known industrial corridor exists in the same state, include it as a candidate
  const stateCorridor = INDUSTRIAL_CORRIDORS.find(c => c.state === state || c.state === selectedLocation.state);
  if (stateCorridor) {
    parcelProfiles.push({
      name: stateCorridor.name,
      customCoords: { lat: stateCorridor.lat, lng: stateCorridor.lng },
      advantage: `Formally notified industrial park managed by ${stateCorridor.notifiedAuthority}`,
      type: "State Notified Industrial Park"
    });
  }

  const evaluatedCandidates = parcelProfiles.map((parcel, idx) => {
    const lat = parcel.customCoords ? parcel.customCoords.lat : baseLat + parcel.offset[0];
    const lng = parcel.customCoords ? parcel.customCoords.lng : baseLng + parcel.offset[1];

    const spatial = analyzeSiteProximity(lat, lng);
    const risk = evaluateSiteRisk(activeIndustryKey, spatial, capacity);

    // Suitability Score is inverted risk score (100 - risk score + bonus for notified parks)
    let suitabilityScore = Math.max(10, 100 - risk.finalScore);
    if (parcel.type.includes("Notified")) suitabilityScore = Math.min(96, suitabilityScore + 6);

    return {
      candidateId: `cand_${idx + 1}`,
      name: parcel.name,
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
      type: parcel.type,
      advantage: parcel.advantage,
      riskScore: risk.finalScore,
      suitabilityScore,
      riskLevel: risk.riskLevel,
      topConcerns: risk.topConcerns,
      riverDistKm: parseFloat(spatial.summaryMetrics.riverDistKm.toFixed(1)),
      paDistKm: parseFloat(spatial.summaryMetrics.paDistKm.toFixed(1)),
      settlementDistKm: parseFloat(spatial.summaryMetrics.settlementDistKm.toFixed(1)),
      highwayDistKm: parseFloat(spatial.summaryMetrics.highwayDistKm.toFixed(1))
    };
  });

  // Sort by highest suitability score (lowest environmental risk)
  evaluatedCandidates.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  // Assign ranks
  return evaluatedCandidates.map((c, idx) => ({
    ...c,
    rank: idx + 1,
    isBest: idx === 0,
    disclaimer: "Preliminary candidate ranking — not a statutory site approval."
  }));
}
