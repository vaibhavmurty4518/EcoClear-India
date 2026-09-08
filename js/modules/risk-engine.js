/**
 * EcoClear India — Explainable Risk Engine
 * Multi-Criteria Evaluation (MCE) with transparent factor contribution audit trail
 */

import { INDUSTRY_PROFILES, FACTOR_LABELS } from "../data/industry-profiles.js";

/**
 * Calculates itemized spatial distance penalties based on actual measured kilometers.
 */
function computeSpatialPenalties(summaryMetrics, industryKey) {
  const p = {
    water: 0,
    population: 0,
    biodiversity: 0,
    forest: 0,
    agriculture: 0,
    air: 0,
    safety: 0
  };

  const { riverDistKm, paDistKm, settlementDistKm, forestDistKm, agriDistKm } = summaryMetrics;

  // Water proximity penalty (max 25 pts)
  if (riverDistKm < 1.0) p.water += 25;
  else if (riverDistKm < 3.0) p.water += 16;
  else if (riverDistKm < 5.0) p.water += 8;

  // Protected area / Wildlife proximity penalty (max 30 pts)
  if (paDistKm < 5.0) p.biodiversity += 30;
  else if (paDistKm < 10.0) p.biodiversity += 18;
  else if (paDistKm < 15.0) p.biodiversity += 8;

  // Population / Settlement proximity penalty (max 28 pts)
  if (settlementDistKm < 1.5) p.population += 28;
  else if (settlementDistKm < 3.5) p.population += 16;
  else if (settlementDistKm < 7.0) p.population += 8;

  // Forest proximity penalty (max 20 pts)
  if (forestDistKm < 1.0) p.forest += 20;
  else if (forestDistKm < 2.5) p.forest += 10;

  // Agriculture proximity penalty (max 18 pts)
  if (agriDistKm < 1.0) p.agriculture += 18;
  else if (agriDistKm < 2.5) p.agriculture += 9;

  // Nuclear sector specific demographic and safety penalties
  if (industryKey === "nuclear") {
    if (settlementDistKm < 5.0) {
      p.population += 35; // AERB sterilized zone consideration
      p.safety += 30;
    } else if (settlementDistKm < 16.0) {
      p.population += 18; // AERB emergency planning zone
      p.safety += 15;
    }
  }

  return p;
}

/**
 * Computes capacity scale factor penalty based on log10 scaling.
 */
function computeScaleFactor(capacity, defaultCapacity) {
  if (!capacity || capacity <= 0) return 0;
  const ratio = capacity / (defaultCapacity || 1000);
  if (ratio > 1) {
    return Math.min(15, Math.log10(ratio + 1) * 6.5);
  }
  return 0;
}

/**
 * Evaluates comprehensive preliminary risk for an industrial site.
 * Returns both the aggregate score (0-100) and an itemized audit ledger.
 */
export function evaluateSiteRisk(industryKey, spatialAnalysis, capacity, customWeights = null) {
  const profile = INDUSTRY_PROFILES[industryKey] || INDUSTRY_PROFILES.steel;
  const weights = customWeights || profile.weights;
  const baseScores = profile.base;
  const summaryMetrics = spatialAnalysis.summaryMetrics;

  const spatialPenalties = computeSpatialPenalties(summaryMetrics, industryKey);
  const scalePenalty = computeScaleFactor(capacity, profile.defaultCapacity);

  const factorResults = {};
  let totalWeightedScore = 0;
  let totalWeight = 0;
  const auditBreakdown = [];

  for (const [factorKey, weight] of Object.entries(weights)) {
    const baseVal = baseScores[factorKey] || 70;
    const sPenalty = spatialPenalties[factorKey] || 0;
    
    // Scale penalty applies primarily to air, waste, water, and energy
    let factorScalePenalty = 0;
    if (["air", "waste", "water", "energy"].includes(factorKey)) {
      factorScalePenalty = scalePenalty;
    }

    // Individual factor score clamped between 10 and 99
    // Higher score = Higher Environmental Sensitivity / Concern
    const rawFactorScore = Math.min(99, Math.max(10, Math.round(baseVal * 0.5 + sPenalty * 1.3 + factorScalePenalty * 1.1)));
    const weightedContribution = rawFactorScore * weight;

    totalWeightedScore += weightedContribution;
    totalWeight += weight;

    // Categorize factor risk
    const factorLevel = rawFactorScore >= 75 ? "CRITICAL" : rawFactorScore >= 60 ? "HIGH" : rawFactorScore >= 45 ? "MODERATE" : "LOW";

    factorResults[factorKey] = {
      score: rawFactorScore,
      weight,
      weightedContribution: parseFloat(weightedContribution.toFixed(2)),
      level: factorLevel,
      baseVal,
      spatialPenalty: sPenalty,
      scalePenalty: parseFloat(factorScalePenalty.toFixed(1)),
      label: FACTOR_LABELS[factorKey] || factorKey
    };

    auditBreakdown.push({
      factorKey,
      label: FACTOR_LABELS[factorKey] || factorKey,
      weight: Math.round(weight * 100) + "%",
      rawScore: rawFactorScore,
      contribution: parseFloat(weightedContribution.toFixed(1)),
      notes: sPenalty > 0 
        ? `Spatial proximity penalty applied (+${sPenalty} pts)` 
        : `Baseline sector profile`
    });
  }

  const finalScore = Math.round(totalWeightedScore / (totalWeight || 1));

  // Risk Classification
  let riskLevel = "LOW";
  let riskBadgeColor = "#16a34a"; // Green
  let riskHeadline = "Low Preliminary Environmental Constraint";
  let riskDescription = "The proposed site exhibits favorable environmental separation buffers with lower initial regulatory and spatial constraints.";

  if (finalScore >= 75) {
    riskLevel = "CRITICAL";
    riskBadgeColor = "#dc2626"; // Red
    riskHeadline = "Critical Environmental Sensitivity / High Constraint";
    riskDescription = "The proposed site is situated in close proximity to major sensitive ecological, hydrological, or demographic receptors. Significant statutory hurdles and comprehensive EIA investigations are anticipated.";
  } else if (finalScore >= 60) {
    riskLevel = "HIGH";
    riskBadgeColor = "#ea580c"; // Orange
    riskHeadline = "High Environmental Sensitivity";
    riskDescription = "The preliminary assessment indicates substantial environmental sensitivities that warrant detailed site investigation, specialized mitigation engineering, and rigorous statutory pre-clearance checks.";
  } else if (finalScore >= 42) {
    riskLevel = "MODERATE";
    riskBadgeColor = "#ca8a04"; // Yellow
    riskHeadline = "Moderate Preliminary Sensitivity";
    riskDescription = "The site presents standard industrial environmental sensitivities that can typically be managed via standard environmental management plans and standard SPCB consent conditions.";
  }

  // Generate top concerns
  const topConcerns = Object.entries(factorResults)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3)
    .map(([k, v]) => ({ factor: k, label: v.label, score: v.score, level: v.level }));

  return {
    finalScore,
    riskLevel,
    riskBadgeColor,
    riskHeadline,
    riskDescription,
    factorResults,
    auditBreakdown,
    topConcerns,
    modelMetadata: {
      formula: "Final Score = Σ (Factor_Score_i × Weight_i) / Σ (Weight_i)",
      industry: profile.name,
      capacity,
      unit: profile.unit,
      ruleVersion: "2026.v1",
      nonStatutoryDisclaimer: "This preliminary score is indicative for early screening and does not represent an official statutory determination or EIA clearance."
    }
  };
}
