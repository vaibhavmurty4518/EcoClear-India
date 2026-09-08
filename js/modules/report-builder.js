/**
 * EcoClear India — Executive Report Generator & Data Exporter
 * Produces consulting/academic grade environmental pre-screening reports.
 */

import { DATA_SOURCES } from "../data/data-sources.js";

/**
 * Builds printable executive HTML report modal content.
 */
export function buildExecutiveReportHtml(reportData) {
  const {
    projectName,
    industryProfile,
    subsector,
    projectPhase,
    capacity,
    unit,
    siteLocation,
    spatialAnalysis,
    riskEvaluation,
    impactAssessments,
    regulatoryChecks,
    timestamp
  } = reportData;

  const docId = `EC-IND-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*900+100)}`;
  const dateFormatted = new Date(timestamp || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return `
  <div class="screening-report-doc">
    <!-- Header / Cover Block -->
    <div class="report-header">
      <div class="report-brand">
        <span class="report-logo">🌿</span>
        <div>
          <h2>EcoClear India — Environmental Site Intelligence</h2>
          <p>Industrial Site Preliminary Pre-Screening & Impact Assessment Report</p>
        </div>
      </div>
      <div class="report-meta">
        <div><strong>Document Ref:</strong> ${docId}</div>
        <div><strong>Generated:</strong> ${dateFormatted}</div>
        <div><strong>Status:</strong> Preliminary Non-Statutory Pre-Screening</div>
      </div>
    </div>

    <div class="report-disclaimer-box">
      <strong>⚠️ STATUTORY DISCLAIMER & LIMITATIONS:</strong>
      This document constitutes a computerized preliminary environmental screening report generated for pre-feasibility planning and academic evaluation. 
      It does <u>not</u> constitute statutory Environmental Clearance (EC), Consent to Establish (CTE), Wildlife Clearance, Forest Clearance, or legal siting permission from the Ministry of Environment, Forest and Climate Change (MoEFCC), State Pollution Control Boards (SPCBs), Atomic Energy Regulatory Board (AERB), or any competent regulatory authority.
    </div>

    <!-- Section 1: Project & Location Summary -->
    <div class="report-section">
      <h3 class="report-section-title">01 • Project Profile & Location Specification</h3>
      <table class="report-table">
        <tbody>
          <tr>
            <td class="lbl">Project Name</td>
            <td><strong>${projectName || "Proposed Industrial Installation"}</strong></td>
            <td class="lbl">Project Phase</td>
            <td><span class="report-tag">${projectPhase || "Greenfield New Project"}</span></td>
          </tr>
          <tr>
            <td class="lbl">Industry Sector</td>
            <td><strong>${industryProfile.name}</strong> (${industryProfile.cpcbCategory} Category)</td>
            <td class="lbl">Sub-Sector</td>
            <td>${subsector || "General Manufacturing"}</td>
          </tr>
          <tr>
            <td class="lbl">Proposed Capacity</td>
            <td><strong>${capacity.toLocaleString()} ${unit}</strong></td>
            <td class="lbl">EIA 2006 Item</td>
            <td>${industryProfile.eiaScheduleItem}</td>
          </tr>
          <tr>
            <td class="lbl">Site Location</td>
            <td>${siteLocation.name}</td>
            <td class="lbl">State / District</td>
            <td>${siteLocation.state || "Maharashtra"} / ${siteLocation.district || "Pune"}</td>
          </tr>
          <tr>
            <td class="lbl">GIS Coordinates</td>
            <td colspan="3"><code>Latitude: ${siteLocation.lat.toFixed(5)}°N, Longitude: ${siteLocation.lng.toFixed(5)}°E</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 2: GIS Spatial Proximity -->
    <div class="report-section">
      <h3 class="report-section-title">02 • Geodesic Spatial Proximity Findings</h3>
      <table class="report-table">
        <thead>
          <tr>
            <th>Receptor / Feature</th>
            <th>Nearest Mapped Feature</th>
            <th>Distance</th>
            <th>Data Provenance</th>
            <th>Preliminary Sensitivity Indicator</th>
          </tr>
        </thead>
        <tbody>
          ${spatialAnalysis.nearbyFeatures.map(f => `
            <tr>
              <td><strong>${f.icon} ${f.category}</strong></td>
              <td>${f.name}</td>
              <td><strong style="color:${f.distanceKm < 2.0 ? '#dc2626' : f.distanceKm < 5.0 ? '#ea580c' : '#16a34a'}">${f.distanceKm.toFixed(1)} km</strong></td>
              <td><span class="report-badge-small">${f.source}</span> (${f.confidence})</td>
              <td style="font-size:11px;">${f.relevance}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Section 3: Explainable Risk Score -->
    <div class="report-section">
      <h3 class="report-section-title">03 • Explainable Preliminary Environmental Risk Evaluation</h3>
      <div class="report-score-banner">
        <div class="report-score-num" style="border-color:${riskEvaluation.riskBadgeColor}; color:${riskEvaluation.riskBadgeColor};">
          <span>${riskEvaluation.finalScore}</span>
          <small>/100</small>
        </div>
        <div>
          <h4 style="color:${riskEvaluation.riskBadgeColor}; margin:0 0 5px 0; font-size:18px;">PRELIMINARY RISK LEVEL: ${riskEvaluation.riskLevel}</h4>
          <p style="margin:0; font-size:13px; color:#475569;">${riskEvaluation.riskDescription}</p>
        </div>
      </div>

      <h5 style="margin:15px 0 8px 0; font-size:13px;">Itemized Factor Contribution Audit Trail ("Why ${riskEvaluation.finalScore}?")</h5>
      <table class="report-table">
        <thead>
          <tr>
            <th>Environmental Factor</th>
            <th>Sector Weight</th>
            <th>Factor Score</th>
            <th>Contribution</th>
            <th>Audit Explanation</th>
          </tr>
        </thead>
        <tbody>
          ${riskEvaluation.auditBreakdown.map(a => `
            <tr>
              <td><strong>${a.label}</strong></td>
              <td>${a.weight}</td>
              <td><strong>${a.rawScore}/100</strong></td>
              <td><strong>+${a.contribution} pts</strong></td>
              <td style="font-size:11px;">${a.notes}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Section 4: Environmental Impact Profile (12 Categories) -->
    <div class="report-section">
      <h3 class="report-section-title">04 • 12-Factor Environmental Impact & Mitigation Profile</h3>
      <div class="report-impacts-grid">
        ${impactAssessments.map(imp => `
          <div class="report-impact-card">
            <div class="report-impact-head">
              <span>${imp.icon} <strong>${imp.title}</strong></span>
              <span class="tag-level tag-${imp.riskLevel.toLowerCase()}">${imp.riskLevel} (${imp.score}/100)</span>
            </div>
            <p class="report-impact-desc"><strong>Trigger:</strong> ${imp.triggerExplanation}</p>
            <div class="report-impact-sub">
              <strong>Potential Harms:</strong> ${imp.environmentalHarm.slice(0, 2).join("; ")}
            </div>
            <div class="report-impact-sub">
              <strong>Recommended Mitigations:</strong> ${imp.mitigationMeasures.slice(0, 2).join("; ")}
            </div>
            <div class="report-impact-sub" style="color:#0369a1;">
              <strong>Specialist Assessment Required:</strong> ${imp.requiresSpecialistAssessment ? "Yes — " + imp.specialistStudies[0] : "Standard Environmental Management Plan adequate."}
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Section 5: Regulatory Pre-Screening -->
    <div class="report-section">
      <h3 class="report-section-title">05 • Potential Regulatory Considerations & Clearance Checklist</h3>
      <table class="report-table">
        <thead>
          <tr>
            <th>Clearance Pathway</th>
            <th>Competent Authority</th>
            <th>Statutory Basis</th>
            <th>Applicability Status</th>
            <th>Mandatory Procedural Next Step</th>
          </tr>
        </thead>
        <tbody>
          ${regulatoryChecks.map(r => `
            <tr>
              <td><strong>${r.category}</strong></td>
              <td>${r.authority}</td>
              <td><code>${r.statutoryReference}</code></td>
              <td><span class="report-status-pill">${r.status}</span></td>
              <td style="font-size:11px;">${r.actionRequired}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Section 6: Data Sources & Provenance -->
    <div class="report-section">
      <h3 class="report-section-title">06 • Data Freshness, Confidence & Source Transparency</h3>
      <table class="report-table">
        <thead>
          <tr>
            <th>Dataset Name</th>
            <th>Source Authority</th>
            <th>Coverage</th>
            <th>Version / Date</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          ${DATA_SOURCES.slice(0, 6).map(ds => `
            <tr>
              <td><strong>${ds.datasetName}</strong></td>
              <td>${ds.sourceAuthority}</td>
              <td>${ds.geographicCoverage}</td>
              <td>${ds.version}</td>
              <td><span class="confidence-tag conf-${ds.confidence.toLowerCase().includes('high') ? 'high' : 'demo'}">${ds.confidence}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="report-footer">
      <div>EcoClear India Academic Decision-Support System • Stage 3 Evolution • College Project Demonstration</div>
      <div>Page 1 of 1 (Consolidated Screening Summary)</div>
    </div>
  </div>
  `;
}

/**
 * Downloads structured JSON data package of the assessment.
 */
export function exportReportJson(reportData) {
  const jsonString = JSON.stringify(reportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ecoclear-india-${reportData.industryProfile.id}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
