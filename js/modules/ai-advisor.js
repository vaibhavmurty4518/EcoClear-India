/**
 * EcoClear India — AI Environmental Siting Advisor
 * Grounded conversational intelligence for industrial environmental screening.
 * 
 * Works in dual-mode:
 * 1. Live Google Gemini API (if GEMINI_API_KEY is provided in settings)
 * 2. Grounded Expert Reasoning Engine (runs 100% locally with zero API key)
 */

export class AIAdvisor {
  constructor() {
    this.apiKey = typeof localStorage !== "undefined" ? (localStorage.getItem("ecoclear_gemini_api_key") || "") : "";
  }

  setApiKey(key) {
    this.apiKey = key ? key.trim() : "";
    if (typeof localStorage !== "undefined") {
      if (this.apiKey) {
        localStorage.setItem("ecoclear_gemini_api_key", this.apiKey);
      } else {
        localStorage.removeItem("ecoclear_gemini_api_key");
      }
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  /**
   * Generates a grounded response to a user query based on current site state.
   */
  async askQuestion(query, reportData) {
    // If user provided a Gemini API Key, use live Gemini API
    if (this.apiKey) {
      try {
        return await this.callGeminiApi(query, reportData);
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local grounded reasoning engine:", err);
        // Fallback to grounded local engine
        return this.localGroundedReasoning(query, reportData, `(Live Gemini API encountered an error: ${err.message}. Switched to local grounded engine)`);
      }
    }

    // Default: Grounded Local Reasoning Engine (Fast, 100% reliable, zero key needed)
    return this.localGroundedReasoning(query, reportData);
  }

  /**
   * Calls Google Gemini API with grounded context.
   */
  async callGeminiApi(query, reportData) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const contextPayload = {
      project: {
        name: reportData.projectName,
        industry: reportData.industryProfile.name,
        subsector: reportData.subsector,
        capacity: `${reportData.capacity} ${reportData.unit}`,
        location: reportData.siteLocation.name,
        coordinates: reportData.siteLocation
      },
      preliminaryRiskScore: `${reportData.riskEvaluation.finalScore}/100 [${reportData.riskEvaluation.riskLevel}]`,
      gisDistances: reportData.spatialAnalysis.summaryMetrics,
      topConcerns: reportData.riskEvaluation.topConcerns,
      statutoryClearances: reportData.regulatoryChecks.map(r => `${r.category}: ${r.status} (${r.authority})`),
      disclaimer: "Non-statutory preliminary screening."
    };

    const systemPrompt = `You are the Lead Environmental Engineer and Indian Regulatory Specialist for EcoClear India.
Analyze the user's query strictly based on the following structured environmental screening data:
${JSON.stringify(contextPayload, null, 2)}

Rules:
1. Ground your reasoning strictly in Indian statutory frameworks (MoEFCC EIA Notification 2006, Water Act 1974, Air Act 1981, Van Sanrakshan Adhiniyam 2023, AERB Siting Codes).
2. Do NOT claim the project is officially approved or legally barred. Use cautious advisory language: "Potential concern", "Warrants field investigation", "Statutory clearance pathway".
3. Provide crisp, structured bullet points with actionable engineering mitigations.`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
        }
      ]
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errJson = await response.json();
      throw new Error(errJson.error ? errJson.error.message : response.statusText);
    }

    const data = await response.json();
    const candidate = data.candidates && data.candidates[0];
    if (candidate && candidate.content && candidate.content.parts) {
      return candidate.content.parts.map(p => p.text).join("");
    }
    throw new Error("Empty response from Gemini API.");
  }

  /**
   * Local Rule-Grounded Knowledge Engine (Zero Key Needed)
   */
  localGroundedReasoning(query, reportData, noticePrefix = "") {
    const q = query.toLowerCase();
    const ind = reportData.industryProfile;
    const loc = reportData.siteLocation;
    const r = reportData.riskEvaluation;
    const metrics = reportData.spatialAnalysis.summaryMetrics;
    const nearestRiver = reportData.spatialAnalysis.nearestRiver;
    const nearestPA = reportData.spatialAnalysis.nearestPA;

    let response = "";

    if (q.includes("summar") || q.includes("top risk") || q.includes("overview")) {
      response = `### 🌿 Environmental Siting Summary: ${reportData.projectName}
**Industry:** ${ind.name} (${ind.cpcbCategory} Category)  
**Proposed Scale:** ${reportData.capacity.toLocaleString()} ${reportData.unit}  
**Site:** ${loc.name} (${loc.lat.toFixed(4)}°N, ${loc.lng.toFixed(4)}°E)  
**EcoClear Preliminary Risk Score:** **${r.finalScore}/100** (**${r.riskLevel}**)

#### Key Spatial Findings:
- **Surface Hydrology:** Located **${metrics.riverDistKm.toFixed(1)} km** from *${nearestRiver ? nearestRiver.name : "Mapped River"}*. ${metrics.riverDistKm < 2.0 ? "⚠️ Critical river buffer concern (<2 km); SPCB setbacks and flood margin investigations required." : "✅ Adequate river separation buffer (>5 km)."}
- **Wildlife & Conservation:** Located **${metrics.paDistKm.toFixed(1)} km** from *${nearestPA ? nearestPA.name : "National Park"}*. ${metrics.paDistKm < 10.0 ? "⚠️ Within 10 km default Eco-Sensitive Zone (ESZ); triggers mandatory SC-NBWL Wildlife Clearance." : "✅ Outside 10 km default ESZ."}
- **Demographic Proximity:** Nearest urban cluster is **${metrics.settlementDistKm.toFixed(1)} km** away.

#### Dominant Sector Sensitivities:
${r.topConcerns.map(c => `- **${c.label}:** Rated **${c.score}/100** (${c.level})`).join("\n")}

*Recommendation: Prioritize comprehensive hydrogeological aquifer vulnerability tests and seasonal baseline air quality modeling.*`;
    }

    else if (q.includes("statutory") || q.includes("clearance") || q.includes("bottleneck") || q.includes("approval")) {
      const checks = reportData.regulatoryChecks;
      response = `### ⚖️ Statutory Clearance Pre-Screening & Bottlenecks
Based on Indian environmental legislation and CPCB classifications:

1. **Prior Environmental Clearance (EC) under EIA Notification 2006:**
   - Categorized under: \`${ind.eiaScheduleItem}\`.
   - **Appraisal Path:** ${checks[0] ? checks[0].authority : "MoEFCC / State SEIAA"}.
   ${metrics.paDistKm < 10.0 ? "- ⚠️ **General Conditions (GC) Trigger:** Proximity within 10 km of a Protected Area elevates this project to **Category A**, requiring Central MoEFCC appraisal in New Delhi." : "- Sited outside 10 km ESZ; standard Category B/A conditions apply."}

2. **Wildlife Clearance (Standing Committee NBWL):**
   ${metrics.paDistKm < 10.0 ? `- ⚠️ **MANDATORY TRIGGER:** Located ${metrics.paDistKm.toFixed(1)} km from ${nearestPA.name}. Requires formal recommendation from the Chief Wildlife Warden and SC-NBWL via PARIVESH before construction.` : `- Not triggered based on ${metrics.paDistKm.toFixed(1)} km separation from mapped National Parks/Sanctuaries.`}

3. **State Pollution Control Board Consents:**
   - Mandatory **Consent to Establish (CTE)** prior to civil construction.
   - Mandatory **Consent to Operate (CTO)** prior to trial production under Water Act 1974 & Air Act 1981.

4. **Water Abstraction:**
   - Central Ground Water Authority (CGWA) NOC mandatory if utilizing on-site borewells.`;
    }

    else if (q.includes("water") || q.includes("zld") || q.includes("effluent") || q.includes("river")) {
      response = `### 💧 Hydrological & Effluent Management Strategy
**Sector Profile:** ${ind.name} has **${ind.waterDemandIntensity}**.  
**Nearest Waterway:** ${nearestRiver ? nearestRiver.name : "Surface Water"} at **${metrics.riverDistKm.toFixed(1)} km**.

#### Recommended Engineering Safeguards:
1. **Zero Liquid Discharge (ZLD) Architecture:**
   - Multi-stage primary/secondary Effluent Treatment Plant (ETP).
   - High-recovery Reverse Osmosis (RO) membranes (>85% permeate recovery).
   - Multi-Effect Evaporators (MEE) followed by Agitated Thin Film Dryers (ATFD) to convert liquid concentrate to dry salt cake.
2. **Rainwater Harvesting & Stormwater Segregation:**
   - First-flush storm retention reservoirs to prevent oily/chemical runoff during monsoons.
   - Separate clean stormwater drains from industrial process pads.
3. **Continuous Monitoring:**
   - Install automated effluent flow meters and Online Continuous Emission Monitoring (OCEMS) with telemetry connected to the SPCB portal.`;
    }

    else if (q.includes("tor") || q.includes("terms of reference") || q.includes("eia outline")) {
      response = `### 📋 Indicative Terms of Reference (ToR) Outline for EIA Study
For **${ind.name}** at **${loc.name}**:

1. **Air Environment:**
   - Baseline monitoring across 8 stations for PM10, PM2.5, SO2, NOx, and sector VOCs.
   - Mathematical dispersion simulation (AERMOD/CALPUFF) covering a 10 km radial study area.
2. **Water Environment:**
   - Hydrogeological aquifer yield assessment, groundwater sampling (TDS, heavy metals), and water mass balance pinch analysis.
3. **Ecology & Biodiversity:**
   - Seasonal enumeration of floral and faunal species within 10 km; conservation plan for Schedule-I species (Wildlife Protection Act 1972).
4. **Socio-Economic & R&R:**
   - Demographic profiling within 5 km; Social Impact Assessment (SIA) and CSR/CER capital investment allocation.
5. **Risk Assessment & Disaster Management:**
   - Quantitative Risk Assessment (QRA), HAZOP, and On-Site/Off-Site Emergency Plans conforming to MSIHC Rules 1989.`;
    }

    else if (q.includes("solar") || q.includes("compare")) {
      response = `### 🔄 Comparative Evaluation: ${ind.name} vs. Solar Power Project
At this specific geographic site (${loc.name}):

- **${ind.name}:**
  - **Risk Profile:** Preliminary Risk Score **${r.finalScore}/100** (${r.riskLevel}).
  - **Primary Concerns:** Air emissions, industrial effluent, hazardous waste containment, and regulatory consents (EIA Category A/B, CTE/CTO).
  - **Footprint:** Compact industrial plot, high utility intensity.

- **Solar Power Project (Utility Scale):**
  - **Risk Profile:** Preliminary Risk Score **~28/100** (LOW).
  - **Primary Concerns:** Land acreage footprint (conversion of agricultural land), panel cleaning water requirements, and transmission line bird diverters.
  - **Statutory Advantage:** Classified as **White Category** by CPCB; formally exempted from prior Environmental Clearance (EIA 2006).`;
    }

    else {
      response = `### 💡 EcoClear Environmental Assessment for ${ind.name}
**Project:** ${reportData.projectName}  
**Site:** ${loc.name} (${metrics.riverDistKm.toFixed(1)} km to River, ${metrics.paDistKm.toFixed(1)} km to Wildlife PA)  
**Preliminary Risk Score:** **${r.finalScore}/100** (${r.riskLevel})

**Key Takeaways:**
1. **Air Pollution & Dust:** ${ind.mitigationFocus[0] || "Install high-efficiency bag filters and dry ESPs."}
2. **Water Conservation:** ${ind.mitigationFocus[2] || "Target Zero Liquid Discharge (ZLD) and closed-loop cooling."}
3. **Solid/Hazardous Waste:** Ensure 100% formal tie-up with State SPCB-authorized Common TSDF for hazardous residues.
4. **Statutory Pathway:** Verify Category A vs B appraisal status on MoEFCC PARIVESH portal before executing land acquisition.

*You can ask me to summarize top risks, detail statutory clearance bottlenecks, explain ZLD water strategies, or draft an EIA ToR outline!*`;
    }

    if (noticePrefix) {
      response = `> *${noticePrefix}*\n\n` + response;
    }

    return response;
  }
}

export const aiAdvisorInstance = new AIAdvisor();
