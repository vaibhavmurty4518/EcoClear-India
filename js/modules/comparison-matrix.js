/**
 * EcoClear India — Same-Site Multi-Industry Comparison Matrix
 * Visually proves the core differentiator: the exact same land produces fundamentally 
 * different risk profiles depending on the industrial sector profile.
 */

import { INDUSTRY_PROFILES } from "../data/industry-profiles.js";
import { evaluateSiteRisk } from "./risk-engine.js";

/**
 * Evaluates multiple industrial sectors at the exact same geographic location.
 */
export function compareIndustriesAtSite(spatialAnalysis, capacity = 1000, industryKeys = ["chemical", "steel", "cement", "nuclear", "solar", "pharmaceutical"]) {
  const comparisonResults = [];

  industryKeys.forEach(indKey => {
    const profile = INDUSTRY_PROFILES[indKey];
    if (!profile) return;

    // Use default industry capacity scaled if capacity was passed
    const indCapacity = profile.defaultCapacity;
    const risk = evaluateSiteRisk(indKey, spatialAnalysis, indCapacity);

    comparisonResults.push({
      industryKey: indKey,
      name: profile.name,
      icon: profile.icon,
      cpcbCategory: profile.cpcbCategory,
      overallScore: risk.finalScore,
      riskLevel: risk.riskLevel,
      factors: {
        air: risk.factorResults.air ? risk.factorResults.air.score : 50,
        water: risk.factorResults.water ? risk.factorResults.water.score : 50,
        population: risk.factorResults.population ? risk.factorResults.population.score : 50,
        biodiversity: risk.factorResults.biodiversity ? risk.factorResults.biodiversity.score : 50,
        waste: risk.factorResults.waste ? risk.factorResults.waste.score : 50,
        agriculture: risk.factorResults.agriculture ? risk.factorResults.agriculture.score : 50,
        energy: risk.factorResults.energy ? risk.factorResults.energy.score : 50,
        safety: risk.factorResults.safety ? risk.factorResults.safety.score : null
      },
      topConcern: risk.topConcerns[0] ? `${risk.topConcerns[0].label} (${risk.topConcerns[0].score}/100)` : "Standard Baseline",
      primaryLimitation: indKey === "nuclear" 
        ? "Rigorous demographic sterilized zones (5 km) and AERB siting code compliance"
        : indKey === "chemical"
        ? "High hazardous waste generation and sensitive waterbody proximity"
        : indKey === "thermal"
        ? "Massive atmospheric SOx/PM load and freshwater cooling withdrawal"
        : indKey === "solar"
        ? "Extensive land acreage footprint and transmission bird diverters"
        : "Standard sector environmental safeguards"
    });
  });

  return comparisonResults;
}
