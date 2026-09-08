/**
 * EcoClear India — Environmental Impact Analyzer
 * Synthesizes 12-factor environmental impact profiles adapting industry physics to local GIS context
 */

import { IMPACT_DOMAINS } from "../data/impact-library.js";
import { INDUSTRY_PROFILES } from "../data/industry-profiles.js";

/**
 * Builds the complete 12-factor environmental impact profile for a site assessment.
 */
export function analyzeEnvironmentalImpacts(industryKey, spatialAnalysis, riskEvaluation) {
  const profile = INDUSTRY_PROFILES[industryKey] || INDUSTRY_PROFILES.steel;
  const metrics = spatialAnalysis.summaryMetrics;
  const factorResults = riskEvaluation.factorResults;

  const domainAssessments = [];

  for (const [domainKey, domainData] of Object.entries(IMPACT_DOMAINS)) {
    let riskLevel = "MODERATE";
    let score = 50;
    let triggerExplanation = "";

    // Map GIS & Risk metrics to domain
    switch (domainKey) {
      case "water":
        score = factorResults.water ? factorResults.water.score : 65;
        triggerExplanation = `Measured distance of ${metrics.riverDistKm.toFixed(1)} km to ${spatialAnalysis.nearestRiver ? spatialAnalysis.nearestRiver.name : "mapped water body"} combined with ${profile.name}'s ${profile.waterDemandIntensity} water demand.`;
        break;

      case "air":
        score = factorResults.air ? factorResults.air.score : 70;
        triggerExplanation = `Industrial atmospheric profile for ${profile.name} generating potential ${profile.keyPollutants.slice(0, 3).join(", ")} emissions within regional airshed.`;
        break;

      case "wildlife":
        score = factorResults.biodiversity ? factorResults.biodiversity.score : 60;
        triggerExplanation = metrics.paDistKm < 10.0
          ? `Site is ${metrics.paDistKm.toFixed(1)} km from ${spatialAnalysis.nearestPA ? spatialAnalysis.nearestPA.name : "Protected Area"}, within the statutory 10 km Eco-Sensitive Zone.`
          : `Nearest National Park/Sanctuary (${spatialAnalysis.nearestPA ? spatialAnalysis.nearestPA.name : "Conservation Area"}) is at ${metrics.paDistKm.toFixed(1)} km.`;
        break;

      case "population":
        score = factorResults.population ? factorResults.population.score : 55;
        triggerExplanation = `Proximity of ${metrics.settlementDistKm.toFixed(1)} km to ${spatialAnalysis.nearestSettlement ? spatialAnalysis.nearestSettlement.name : "human settlement"} creating potential demographic exposure pathways.`;
        break;

      case "forest":
        score = factorResults.forest ? factorResults.forest.score : (factorResults.biodiversity ? factorResults.biodiversity.score : 50);
        triggerExplanation = `Estimated distance of ${metrics.forestDistKm.toFixed(1)} km to recorded natural forest tracts; potential canopy fragmentation check.`;
        break;

      case "agriculture":
        score = factorResults.agriculture ? factorResults.agriculture.score : 50;
        triggerExplanation = `Proximity of ${metrics.agriDistKm.toFixed(1)} km to agricultural soils; potential non-agricultural land diversion and dust fallout.`;
        break;

      case "waste":
        score = factorResults.waste ? factorResults.waste.score : 70;
        triggerExplanation = `Project generation of major waste streams: ${profile.wasteStreams.slice(0, 3).join(", ")} requiring authorized TSDF or circular co-processing.`;
        break;

      case "biodiversity":
        score = factorResults.biodiversity ? factorResults.biodiversity.score : 60;
        triggerExplanation = `Habitat integrity evaluation based on combined forest (${metrics.forestDistKm.toFixed(1)} km) and protected area (${metrics.paDistKm.toFixed(1)} km) proximity.`;
        break;

      case "noise":
        score = Math.round((factorResults.population ? factorResults.population.score : 50) * 0.7 + (factorResults.air ? factorResults.air.score : 50) * 0.3);
        triggerExplanation = `Heavy industrial machinery, transport movements, and acoustic emissions relative to nearest settlement (${metrics.settlementDistKm.toFixed(1)} km).`;
        break;

      case "land":
        score = Math.round((factorResults.agriculture ? factorResults.agriculture.score : 50) * 0.6 + (factorResults.waste ? factorResults.waste.score : 50) * 0.4);
        triggerExplanation = `Evaluation of topsoil disturbance, chemical containment integrity, and industrial site grading footprint.`;
        break;

      case "climate":
        score = factorResults.energy ? factorResults.energy.score : 60;
        triggerExplanation = `Carbon intensity and energy demand profile for ${profile.name} combined with regional climate resilience parameters.`;
        break;

      case "hazards":
        score = industryKey === "nuclear" ? 85 : industryKey === "chemical" || industryKey === "petroleum" ? 78 : 45;
        triggerExplanation = industryKey === "nuclear" 
          ? "Special statutory siting regime under AERB: seismic stability, cooling hydrology, and emergency planning zones are primary screening determinants."
          : `Industrial hazard profile for ${profile.name} handling volatile, flammable, or hazardous process materials.`;
        break;

      default:
        score = 50;
        triggerExplanation = "Standard environmental screening baseline.";
    }

    if (score >= 75) riskLevel = "CRITICAL";
    else if (score >= 60) riskLevel = "HIGH";
    else if (score >= 42) riskLevel = "MODERATE";
    else riskLevel = "LOW";

    // Build tailored causes and mitigations
    const tailoredMitigations = [...domainData.mitigationMeasures];
    if (profile.mitigationFocus && profile.mitigationFocus.length > 0) {
      tailoredMitigations.unshift(...profile.mitigationFocus.slice(0, 2));
    }

    const requiresSpecialistAssessment = score >= 55 || industryKey === "nuclear";

    domainAssessments.push({
      id: domainKey,
      title: domainData.title,
      icon: domainData.icon,
      score,
      riskLevel,
      description: domainData.description,
      triggerExplanation,
      potentialCauses: domainData.potentialCauses,
      environmentalHarm: domainData.environmentalHarm,
      communityPathways: domainData.communityPathways,
      mitigationMeasures: tailoredMitigations.slice(0, 4),
      specialistStudies: domainData.specialistStudies,
      requiresSpecialistAssessment,
      confidence: "High (Model Grounded)"
    });
  }

  return domainAssessments;
}
