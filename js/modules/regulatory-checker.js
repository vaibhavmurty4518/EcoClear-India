/**
 * EcoClear India — Regulatory Pre-Screening Checker
 * Evaluates applicable statutory clearance pathways based on sector, scale, and GIS spatial triggers.
 */

import { REGULATORY_RULES } from "../data/regulatory-rules.js";
import { INDUSTRY_PROFILES } from "../data/industry-profiles.js";

export function evaluateRegulatoryClearances(industryKey, capacity, projectPhase, spatialAnalysis) {
  const profile = INDUSTRY_PROFILES[industryKey] || INDUSTRY_PROFILES.steel;
  const metrics = spatialAnalysis.summaryMetrics;
  const applicableChecks = [];

  // 1. Environmental Clearance (EIA Notification 2006)
  if (profile.cpcbCategory === "Red" || profile.cpcbCategory === "Orange") {
    let eiaCategory = "Category B";
    let eiaLevel = "State SEIAA Appraisal";
    let gcTriggered = false;

    // Nuclear, Petroleum, Thermal (>500MW), Steel (>20k TPA) are Category A
    if (["nuclear", "petroleum", "thermal", "mining"].includes(industryKey) || (industryKey === "steel" && capacity > 20000)) {
      eiaCategory = "Category A";
      eiaLevel = "Central MoEFCC (New Delhi) Appraisal";
    }

    // General Conditions (GC) Check: within 10km of Protected Area elevations
    if (metrics.paDistKm < 10.0 && eiaCategory === "Category B") {
      eiaCategory = "Category A (Elevated under General Conditions)";
      eiaLevel = "Central MoEFCC Appraisal due to <10 km Wildlife PA Proximity";
      gcTriggered = true;
    }

    applicableChecks.push({
      ruleId: "IND-EC-EIA-2006-GEN",
      category: "Prior Environmental Clearance (EC)",
      authority: eiaLevel,
      statutoryReference: profile.eiaScheduleItem,
      status: "Potentially Mandatory Prior to Groundbreaking",
      applicabilityNotes: `Appraised as ${eiaCategory}. Application submitted via MoEFCC PARIVESH portal. ${gcTriggered ? "Elevated from Category B to A due to proximity to " + (spatialAnalysis.nearestPA ? spatialAnalysis.nearestPA.name : "Protected Area") + "." : ""}`,
      actionRequired: "Terms of Reference (ToR), EIA Report preparation, Public Hearing (unless exempted in notified park), and EAC/SEAC appraisal.",
      source: "EIA Notification 2006 & subsequent amendments",
      lastVerified: "2025-12-01"
    });
  } else if (profile.cpcbCategory === "White") {
    applicableChecks.push({
      ruleId: "IND-EC-EIA-2006-WHITE",
      category: "Environmental Clearance Exemption",
      authority: "State Pollution Control Board",
      statutoryReference: "CPCB White Category Circular 2016",
      status: "Formally Exempted from Prior EC",
      applicabilityNotes: `${profile.name} is classified as White Category. Exempt from prior EC and EIA reports.`,
      actionRequired: "Intimation to SPCB and compliance with general environmental guidelines.",
      source: "CPCB Guidelines & MoEFCC Notifications",
      lastVerified: "2025-12-01"
    });
  }

  // 2. Wildlife & Eco-Sensitive Zone Clearance
  if (metrics.paDistKm < 10.0) {
    applicableChecks.push({
      ruleId: "IND-WLD-NBWL-1972",
      category: "Wildlife Clearance (SC-NBWL)",
      authority: "Standing Committee of National Board for Wildlife (SC-NBWL)",
      statutoryReference: "Wildlife (Protection) Act 1972 / Supreme Court Directives",
      status: "Potentially Mandatory (Proximity Trigger)",
      applicabilityNotes: `Site is located ${metrics.paDistKm.toFixed(1)} km from ${spatialAnalysis.nearestPA ? spatialAnalysis.nearestPA.name : "Protected Area"}, falling within the statutory/default 10 km Eco-Sensitive Zone.`,
      actionRequired: "Online submission on PARIVESH Wildlife module for recommendation by Chief Wildlife Warden and SC-NBWL.",
      source: "MoEFCC Wildlife Division / Supreme Court in WP(C) 460/2004",
      lastVerified: "2025-12-01"
    });
  }

  // 3. Forest Clearance (Van Sanrakshan Evam Samvardhan Adhiniyam 2023)
  if (metrics.forestDistKm < 2.0 || industryKey === "mining" || industryKey === "wind") {
    applicableChecks.push({
      ruleId: "IND-FOR-FCA-2023",
      category: "Forest Clearance",
      authority: "MoEFCC Regional Office & Forest Advisory Committee (FAC)",
      statutoryReference: "Van (Sanrakshan Evam Samvardhan) Adhiniyam 2023",
      status: "Conditional Verification Required",
      applicabilityNotes: "Applicable if any part of the project boundary, pipeline, or power transmission line crosses recorded or deemed forest land.",
      actionRequired: "Two-stage Forest Clearance (Stage-I In-Principle & Stage-II Final), Net Present Value (NPV) payment, and equivalent Compensatory Afforestation land.",
      source: "Van Sanrakshan Adhiniyam 2023 Rules",
      lastVerified: "2025-12-01"
    });
  }

  // 4. Coastal Regulation Zone (CRZ) Check
  if (metrics.riverDistKm < 1.0 || spatialAnalysis.coordinates.lng < 73.2 && spatialAnalysis.coordinates.lat < 22.5) {
    applicableChecks.push({
      ruleId: "IND-CRZ-2019",
      category: "Coastal Regulation Zone (CRZ) Clearance",
      authority: "State Coastal Zone Management Authority (SCZMA) & MoEFCC",
      statutoryReference: "CRZ Notification 2019",
      status: "Location-Specific Verification Required",
      applicabilityNotes: "Relevant if project is in coastal talukas or tidal creeks (e.g. Dahej, Mundra, Paradeep). Prohibits heavy industries in CRZ-I and CRZ-III.",
      actionRequired: "Superimposition of project layout on approved Coastal Zone Management Plan (CZMP) by MoEFCC-authorized agency.",
      source: "CRZ Notification 2019",
      lastVerified: "2025-12-01"
    });
  }

  // 5. Consent to Establish (CTE) & Consent to Operate (CTO)
  if (profile.cpcbCategory !== "White") {
    applicableChecks.push({
      ruleId: "IND-POL-CTE-CTO-1974",
      category: "Consent to Establish (CTE) & Operate (CTO)",
      authority: "State Pollution Control Board (SPCB / PCC)",
      statutoryReference: "Water Act 1974 (Sec 25) & Air Act 1981 (Sec 21)",
      status: "Mandatory Prior to Construction & Commissioning",
      applicabilityNotes: `Required for ${profile.cpcbCategory} Category industrial installations across all Indian states.`,
      actionRequired: "CTE application with detailed project report, ETP/APCD engineering drawings, and fees before commencing site construction. CTO application before trial production.",
      source: "State PCB Consolidated Consent Rules",
      lastVerified: "2025-12-01"
    });
  }

  // 6. Hazardous Waste Management Authorization
  if (["steel", "cement", "chemical", "pharmaceutical", "textile", "thermal", "petroleum", "waste", "automobile", "electronics"].includes(industryKey)) {
    applicableChecks.push({
      ruleId: "IND-HAZ-WASTE-2016",
      category: "Hazardous Waste Authorization",
      authority: "State Pollution Control Board",
      statutoryReference: "Hazardous & Other Wastes Rules 2016 (Schedule I/II)",
      status: "Mandatory for Waste-Generating Units",
      applicabilityNotes: `Applies to generation, storage, and handling of: ${profile.wasteStreams.slice(0, 2).join(", ")}.`,
      actionRequired: "Dedicated covered, impervious hazardous waste storage facility and formal agreement with an authorized Common TSDF.",
      source: "CPCB Hazardous Waste Division",
      lastVerified: "2025-12-01"
    });
  }

  // 7. Groundwater Abstraction NOC (CGWA)
  applicableChecks.push({
    ruleId: "IND-WAT-CGWA-2020",
    category: "Groundwater Abstraction NOC",
    authority: "Central Ground Water Authority (CGWA) / State GW Authority",
    statutoryReference: "CGWA Ground Water Guidelines Notification 2020",
    status: "Mandatory if Extracting Groundwater",
    applicabilityNotes: "Required if the project proposes on-site borewells for process or cooling water. Siting in Over-Exploited blocks restricts new industrial permissions.",
    actionRequired: "Online application on CGWA portal, digital water metering with telemetry, and construction of mandatory rainwater harvesting recharge structures.",
    source: "CGWA Guidelines 2020",
    lastVerified: "2025-12-01"
  });

  // 8. Nuclear Sector AERB Siting Sancation
  if (industryKey === "nuclear") {
    applicableChecks.push({
      ruleId: "IND-NUC-AERB-SITING",
      category: "AERB Siting Consents & Safety Authorizations",
      authority: "Atomic Energy Regulatory Board (AERB)",
      statutoryReference: "Atomic Energy Act 1962 & AERB/SC/S Safety Code",
      status: "Special Statutory Regime (Mandatory)",
      applicabilityNotes: "Nuclear projects require comprehensive multi-stage regulatory consents: Site Evaluation, Siting Consent, Construction Consent, Fuel Loading, Commissioning and Operating License.",
      actionRequired: "Comprehensive Site Evaluation Report (SER) covering Seismotectonics, Hydrology, Extreme Meteorological events, Demography, and Exclusion Zone (~1.6 km) acquisition.",
      source: "AERB Regulatory Documents",
      lastVerified: "2025-12-01"
    });
  }

  return applicableChecks;
}
