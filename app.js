/**
 * EcoClear India — Central Application Controller
 * Connects GIS map, 16 industry profiles, spatial engine, explainable risk scoring,
 * 12-factor impact library, regulatory pre-screening, AI Advisor, and report generator.
 */

import { INDUSTRY_PROFILES, INDUSTRY_KEYS, FACTOR_LABELS } from "./js/data/industry-profiles.js";
import { INDIAN_STATES_DISTRICTS, PRESET_SITES, MAJOR_RIVERS, PROTECTED_AREAS, INDUSTRIAL_CORRIDORS, URBAN_SETTLEMENTS, DEMO_ILLUSTRATIVE_ZONES } from "./js/data/gis-layers.js";
import { DATA_SOURCES } from "./js/data/data-sources.js";
import { analyzeSiteProximity, parseBoundaryGeometry, calculateHaversineDistance } from "./js/modules/gis-engine.js";
import { evaluateSiteRisk } from "./js/modules/risk-engine.js";
import { analyzeEnvironmentalImpacts } from "./js/modules/impact-analyzer.js";
import { evaluateRegulatoryClearances } from "./js/modules/regulatory-checker.js";
import { findAlternativeSites } from "./js/modules/alternatives-finder.js";
import { compareIndustriesAtSite } from "./js/modules/comparison-matrix.js";
import { buildExecutiveReportHtml, exportReportJson } from "./js/modules/report-builder.js";
import { aiAdvisorInstance } from "./js/modules/ai-advisor.js";

// Global Application State
const state = {
  projectName: "Greenfield Manufacturing Facility",
  selectedIndustry: "steel",
  subsector: "Integrated Iron & Steel Plant",
  capacity: 500000,
  unit: "tonnes/year",
  projectPhase: "New Greenfield Project",
  selectedState: "Maharashtra",
  selectedDistrict: "Pune",
  location: { ...PRESET_SITES.pune_chakan },
  boundaryGeometry: null,
  spatialAnalysis: null,
  riskEvaluation: null,
  impactAssessments: null,
  regulatoryChecks: null,
  alternativeSites: null,
  comparisonData: null,
  activeBuffers: { km1: true, km5: true, km10: true }
};

// Leaflet Map & Layer References
let map = null;
let siteMarker = null;
let bufferLayers = { km1: null, km5: null, km10: null };
let polygonLayer = null;
let riverLayerGroup = null;
let paLayerGroup = null;
let industrialLayerGroup = null;
let settlementGroupTier1 = null;
let settlementGroupTier2 = null;
let settlementGroupTier3 = null;
let demoZonesLayerGroup = null;
let candidatesLayerGroup = null;

// Basemap references
let activeBaseLayer = null;
let vectorLayer = null;
let satelliteLayer = null;
let topoLayer = null;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Debounce utility to prevent high-frequency layout churn
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Application Entry Point
 */
document.addEventListener("DOMContentLoaded", () => {
  initUIComponents();
  initLeafletMap();
  updateDistrictDropdown();
  updateIndustryDetails();
  runFullAnalysis(); // Perform initial analysis on load
  setupEventHandlers();
  setupAIAdvisor();
});

/**
 * Initializes form dropdowns and UI components
 */
function initUIComponents() {
  // Populate Industry Dropdown
  const indSelect = document.getElementById("industrySelect");
  if (indSelect) {
    indSelect.innerHTML = INDUSTRY_KEYS.map(key => {
      const p = INDUSTRY_PROFILES[key];
      return `<option value="${key}">${p.icon} ${p.name} [${p.cpcbCategory}]</option>`;
    }).join("");
    indSelect.value = state.selectedIndustry;
  }

  // Populate State Dropdown
  const stateSelect = document.getElementById("stateSelect");
  if (stateSelect) {
    stateSelect.innerHTML = Object.keys(INDIAN_STATES_DISTRICTS).map(s => {
      return `<option value="${s}">${s}</option>`;
    }).join("");
    stateSelect.value = state.selectedState;
  }

  // Populate Preset Sites
  const presetSelect = document.getElementById("presetSiteSelect");
  if (presetSelect) {
    presetSelect.innerHTML = `
      <option value="custom">📍 Custom Map Click Location</option>
      ${Object.entries(PRESET_SITES).map(([k, s]) => `<option value="${k}">${s.name}</option>`).join("")}
    `;
    presetSelect.value = "pune_chakan";
  }
}

/**
 * Initializes Leaflet Map with layers, custom panes, and reliable basemap switcher
 */
function initLeafletMap() {
  const initialLat = state.location.lat;
  const initialLng = state.location.lng;

  // Bounding box constraint to Indian subcontinent extents
  const southWest = L.latLng(4.0, 65.0);
  const northEast = L.latLng(38.5, 100.0);
  const indiaBounds = L.latLngBounds(southWest, northEast);

  map = L.map("map", {
    center: [initialLat, initialLng],
    zoom: 10,
    minZoom: 5,
    maxZoom: 18,
    maxBounds: indiaBounds.pad(0.25),
    maxBoundsViscosity: 0.75,
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    dragging: true,
    touchZoom: true,
    boxZoom: true,
    keyboard: true
  });

  // Strict Custom Pane Z-Index Hierarchy (guarantees layers stack in correct order)
  map.createPane("riversPane");
  map.getPane("riversPane").style.zIndex = 350;

  map.createPane("demoZonesPane");
  map.getPane("demoZonesPane").style.zIndex = 370;

  map.createPane("protectedAreasPane");
  map.getPane("protectedAreasPane").style.zIndex = 390;

  map.createPane("industrialPane");
  map.getPane("industrialPane").style.zIndex = 420;

  map.createPane("settlementsPane");
  map.getPane("settlementsPane").style.zIndex = 450;

  map.createPane("candidateSitesPane");
  map.getPane("candidateSitesPane").style.zIndex = 480;

  map.createPane("buffersPane");
  map.getPane("buffersPane").style.zIndex = 510;

  map.createPane("siteMarkerPane");
  map.getPane("siteMarkerPane").style.zIndex = 650;

  // 1. Vector Map: Standard OpenStreetMap (no API key required, zero watermarking)
  vectorLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // 2. High-Resolution Satellite Map (Esri World Imagery)
  satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
  });

  // 3. Topographic Elevation Terrain (OpenTopoMap)
  topoLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Set default basemap
  vectorLayer.addTo(map);
  activeBaseLayer = vectorLayer;

  // Basemap Switcher Events
  document.getElementById("btnBaseVector")?.addEventListener("click", () => switchBasemap("vector"));
  document.getElementById("btnBaseSatellite")?.addEventListener("click", () => switchBasemap("satellite"));
  document.getElementById("btnBaseTopo")?.addEventListener("click", () => switchBasemap("topo"));

  // Layer Groups connected to custom panes
  riverLayerGroup = L.layerGroup({ pane: "riversPane" }).addTo(map);
  paLayerGroup = L.layerGroup({ pane: "protectedAreasPane" }).addTo(map);
  industrialLayerGroup = L.layerGroup({ pane: "industrialPane" }).addTo(map);
  demoZonesLayerGroup = L.layerGroup({ pane: "demoZonesPane" }).addTo(map);
  candidatesLayerGroup = L.layerGroup({ pane: "candidateSitesPane" }).addTo(map);

  settlementGroupTier1 = L.layerGroup({ pane: "settlementsPane" });
  settlementGroupTier2 = L.layerGroup({ pane: "settlementsPane" });
  settlementGroupTier3 = L.layerGroup({ pane: "settlementsPane" });

  drawStaticGisLayers();
  renderSiteMarkerAndBuffers();
  updateSettlementLOD();

  // Dynamic Level of Detail (LOD) for settlements as user zooms
  map.on("zoomend", updateSettlementLOD);

  // Click on map selects custom site without resetting zoom or view
  map.on("click", (e) => {
    const customLoc = {
      name: `Custom Site (${e.latlng.lat.toFixed(4)}°N, ${e.latlng.lng.toFixed(4)}°E)`,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      state: state.selectedState,
      district: state.selectedDistrict,
      setting: "Custom Geographic Coordinates"
    };
    const presetSelect = document.getElementById("presetSiteSelect");
    if (presetSelect) presetSelect.value = "custom";
    updateSiteLocation(customLoc, { flyTo: false, panTo: false, triggerAnalysis: true });
  });

  // Debounced Window Resize Handler for stable canvas rendering
  window.addEventListener("resize", debounce(() => {
    if (map) map.invalidateSize();
  }, 150));

  // Initial layout stabilization
  setTimeout(() => { if (map) map.invalidateSize(); }, 200);
  setTimeout(() => { if (map) map.invalidateSize(); }, 600);
}

/**
 * Switches the active Leaflet basemap without resetting viewport or layers
 */
function switchBasemap(type) {
  if (!map) return;
  if (activeBaseLayer && map.hasLayer(activeBaseLayer)) {
    map.removeLayer(activeBaseLayer);
  }
  document.querySelectorAll(".basemap-btn").forEach(b => b.classList.remove("active"));

  if (type === "satellite") {
    satelliteLayer.addTo(map);
    activeBaseLayer = satelliteLayer;
    document.getElementById("btnBaseSatellite")?.classList.add("active");
  } else if (type === "topo") {
    topoLayer.addTo(map);
    activeBaseLayer = topoLayer;
    document.getElementById("btnBaseTopo")?.classList.add("active");
  } else {
    vectorLayer.addTo(map);
    activeBaseLayer = vectorLayer;
    document.getElementById("btnBaseVector")?.classList.add("active");
  }
  activeBaseLayer.bringToBack();
}

/**
 * Draws real and illustrative Indian GIS layers onto map
 */
function drawStaticGisLayers() {
  // 1. Major Rivers & Regional Tributaries (Clean Blue Polylines)
  MAJOR_RIVERS.forEach(r => {
    const polyline = L.polyline(r.coordinates, {
      pane: "riversPane",
      color: "#0284c7",
      weight: 3.0,
      opacity: 0.75,
      dashArray: null
    }).addTo(riverLayerGroup);

    polyline.bindTooltip(`<b>${r.name}</b><br><small>${r.type}</small><br><span class="map-badge-real">VERIFIED HYDROLOGY</span>`, {
      sticky: true
    });
  });

  // 2. Protected Areas & Wildlife Sanctuaries (10km ESZ Rings + Shield Badge Pin)
  PROTECTED_AREAS.forEach(pa => {
    // 10km Statutory Eco-Sensitive Zone (ESZ)
    L.circle([pa.lat, pa.lng], {
      pane: "protectedAreasPane",
      radius: (pa.eszKm || 10) * 1000,
      color: "#16a34a",
      fillColor: "#22c55e",
      fillOpacity: 0.06,
      weight: 1.5,
      dashArray: "4, 4"
    }).addTo(paLayerGroup).bindTooltip(`<b>${pa.name} — 10 km Statutory Eco-Sensitive Zone (ESZ)</b><br><small>${pa.fauna}</small>`, { sticky: true });

    // Distinctive circular shield icon
    const paIcon = L.divIcon({
      className: "pa-marker-icon-wrap",
      html: `<div class="pa-marker-badge" title="${pa.name}"><span>🐅</span></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker([pa.lat, pa.lng], { icon: paIcon, pane: "protectedAreasPane" }).addTo(paLayerGroup)
      .bindPopup(`
        <div class="map-popup-card">
          <div class="pop-header pa-head">🐅 ${pa.name}</div>
          <div><strong>Category:</strong> ${pa.type}</div>
          <div><strong>Core Area:</strong> ${pa.areaSqKm} sq km</div>
          <div><strong>Key Fauna:</strong> ${pa.fauna}</div>
          <div><strong>Authority:</strong> ${pa.source}</div>
          <div class="pop-statutory-notice">⚠️ Siting within 10 km triggers mandatory clearance from SC-NBWL.</div>
        </div>
      `);
  });

  // 3. Notified Industrial Corridors & SEZs (Purple Badge Pin)
  INDUSTRIAL_CORRIDORS.forEach(ind => {
    const indIcon = L.divIcon({
      className: "ind-marker-icon-wrap",
      html: `<div class="ind-marker-badge" title="${ind.name}"><span>🏭</span></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker([ind.lat, ind.lng], { icon: indIcon, pane: "industrialPane" }).addTo(industrialLayerGroup)
      .bindPopup(`
        <div class="map-popup-card">
          <div class="pop-header ind-head">🏭 ${ind.name}</div>
          <div><strong>Sector Focus:</strong> ${ind.category}</div>
          <div><strong>State / Authority:</strong> ${ind.notifiedAuthority}</div>
          <div class="pop-benefit-notice">✅ Designated industrial estate: streamlined EIA public hearing exemptions may apply under EIA 2006.</div>
        </div>
      `);
  });

  // 4. Urban Settlements Hierarchical Multi-Tier LOD
  URBAN_SETTLEMENTS.forEach(u => {
    const pop = u.approxPop || 500000;
    const isTier1 = pop >= 5000000;
    const isTier2 = pop >= 1000000 && pop < 5000000;

    const radius = isTier1 ? 4.5 : (isTier2 ? 3.5 : 2.8);
    const color = "#ffffff";
    const fillColor = isTier1 ? "#e11d48" : (isTier2 ? "#f43f5e" : "#fb7185");
    const fillOpacity = isTier1 ? 0.85 : (isTier2 ? 0.75 : 0.65);
    const weight = isTier1 ? 1.5 : (isTier2 ? 1.0 : 0.8);

    const targetGroup = isTier1 ? settlementGroupTier1 : (isTier2 ? settlementGroupTier2 : settlementGroupTier3);

    const marker = L.circleMarker([u.lat, u.lng], {
      pane: "settlementsPane",
      radius,
      color,
      fillColor,
      fillOpacity,
      weight
    }).addTo(targetGroup);

    marker.bindTooltip(`<b>${u.name}</b><br><small>${u.populationTier || "Urban Settlement"}</small><br>Est. Population: ~${(pop / 100000).toFixed(1)} Lakhs`, {
      sticky: true
    });
  });

  // 5. Illustrative Demo Zones (Clear Demonstration Badging)
  DEMO_ILLUSTRATIVE_ZONES.forEach(z => {
    L.circle([z.lat, z.lng], {
      pane: "demoZonesPane",
      radius: z.radiusKm * 1000,
      color: z.color,
      fillColor: z.color,
      fillOpacity: 0.09,
      weight: 1.5,
      dashArray: "6, 6"
    }).addTo(demoZonesLayerGroup)
      .bindTooltip(`<b>${z.name}</b><br><span class="map-badge-demo">ILLUSTRATIVE DEMO LAYER</span><br><small>${z.source}</small>`, { sticky: true });
  });
}

/**
 * Updates settlement visibility dynamically based on map zoom level to eliminate marker clutter
 */
function updateSettlementLOD() {
  if (!map) return;
  const z = map.getZoom();

  // Tier 1 (Mega Metros) always visible
  if (!map.hasLayer(settlementGroupTier1)) settlementGroupTier1.addTo(map);

  // Tier 2 (Major Cities) visible at regional scale (z >= 7)
  if (z >= 7) {
    if (!map.hasLayer(settlementGroupTier2)) settlementGroupTier2.addTo(map);
  } else {
    if (map.hasLayer(settlementGroupTier2)) map.removeLayer(settlementGroupTier2);
  }

  // Tier 3 (District Towns / Local Hubs) visible at local scale (z >= 10)
  if (z >= 10) {
    if (!map.hasLayer(settlementGroupTier3)) settlementGroupTier3.addTo(map);
  } else {
    if (map.hasLayer(settlementGroupTier3)) map.removeLayer(settlementGroupTier3);
  }
}

/**
 * Updates or creates site marker and concentric analytical buffer zones without resetting view/zoom
 */
function renderSiteMarkerAndBuffers() {
  if (!map) return;

  const lat = state.location.lat;
  const lng = state.location.lng;
  const p = INDUSTRY_PROFILES[state.selectedIndustry] || { name: "Industrial Facility" };

  const popupHtml = `
    <div class="map-popup-card">
      <div class="pop-header">📍 Selected Industrial Site</div>
      <div><strong>Location:</strong> ${state.location.name}</div>
      <div><strong>Coordinates:</strong> ${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E</div>
      <div><strong>Industry:</strong> ${p.name}</div>
      <div><strong>Capacity:</strong> ${state.capacity ? state.capacity.toLocaleString() : ""} ${state.unit}</div>
      <div style="margin-top:6px; font-size:10px; color:#64748b;">
        Concentric rings: 1 km (Footprint) • 5 km (Environmental) • 10 km (EIA Statutory)
      </div>
    </div>
  `;

  // 1. Distinctive Selected Site Marker (always on top via siteMarkerPane & high z-index)
  if (!siteMarker) {
    const siteIcon = L.divIcon({
      className: "active-site-pin-wrapper",
      html: `
        <div class="selected-site-pin-wrap">
          <div class="site-radar-pulse"></div>
          <div class="site-pin-ring">
            <div class="site-pin-core"></div>
          </div>
          <div class="site-pin-label">📍 SELECTED SITE</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    siteMarker = L.marker([lat, lng], {
      icon: siteIcon,
      pane: "siteMarkerPane",
      zIndexOffset: 10000
    }).addTo(map);

    siteMarker.bindPopup(popupHtml);
  } else {
    siteMarker.setLatLng([lat, lng]);
    siteMarker.setPopupContent(popupHtml);
  }

  // 2. Concentric Analytical Buffers (1 km, 5 km, 10 km in buffersPane)
  if (!bufferLayers.km1) {
    bufferLayers.km1 = L.circle([lat, lng], {
      pane: "buffersPane",
      radius: 1000,
      color: "#ef4444",
      fillColor: "#ef4444",
      fillOpacity: 0.05,
      weight: 1.5,
      dashArray: "3, 3"
    }).bindTooltip("<b>1.0 km Immediate Footprint Buffer</b>", { sticky: true });
    if (state.activeBuffers.km1) bufferLayers.km1.addTo(map);
  } else {
    bufferLayers.km1.setLatLng([lat, lng]);
  }

  if (!bufferLayers.km5) {
    bufferLayers.km5 = L.circle([lat, lng], {
      pane: "buffersPane",
      radius: 5000,
      color: "#f59e0b",
      fillColor: "#f59e0b",
      fillOpacity: 0.03,
      weight: 1.5,
      dashArray: "4, 4"
    }).bindTooltip("<b>5.0 km Primary Environmental Buffer</b>", { sticky: true });
    if (state.activeBuffers.km5) bufferLayers.km5.addTo(map);
  } else {
    bufferLayers.km5.setLatLng([lat, lng]);
  }

  if (!bufferLayers.km10) {
    bufferLayers.km10 = L.circle([lat, lng], {
      pane: "buffersPane",
      radius: 10000,
      color: "#10b981",
      fillColor: "#10b981",
      fillOpacity: 0.02,
      weight: 1.5,
      dashArray: "5, 5"
    }).bindTooltip("<b>10.0 km EIA Statutory Study Area Buffer</b>", { sticky: true });
    if (state.activeBuffers.km10) bufferLayers.km10.addTo(map);
  } else {
    bufferLayers.km10.setLatLng([lat, lng]);
  }

  // 3. User Uploaded Boundary Polygon
  if (state.boundaryGeometry && state.boundaryGeometry.coordinates) {
    if (polygonLayer) map.removeLayer(polygonLayer);
    polygonLayer = L.polygon(state.boundaryGeometry.coordinates, {
      pane: "candidateSitesPane",
      color: "#059669",
      fillColor: "#10b981",
      fillOpacity: 0.25,
      weight: 2
    }).addTo(map).bindPopup("<b>Project Site Boundary Polygon</b><br>User uploaded boundary layout.");
  }
}

/**
 * Centrally updates project site location and synchronizes viewport cleanly
 */
function updateSiteLocation(newLoc, options = { flyTo: true, zoom: 10, triggerAnalysis: true }) {
  state.location = { ...newLoc };
  state.boundaryGeometry = null;
  if (polygonLayer) {
    map.removeLayer(polygonLayer);
    polygonLayer = null;
  }

  updateCoordinateInputs();
  renderSiteMarkerAndBuffers();

  if (map) {
    const targetZoom = options.zoom || map.getZoom() || 10;
    if (options.flyTo) {
      map.flyTo([state.location.lat, state.location.lng], targetZoom, {
        animate: true,
        duration: 0.8
      });
    } else if (options.panTo) {
      map.panTo([state.location.lat, state.location.lng], {
        animate: true,
        duration: 0.4
      });
    }
  }

  if (options.triggerAnalysis) {
    runFullAnalysis();
  }
}

/**
 * Next-Level Multi-Stage Realistic Geoprocessing Pipeline & Staggered Reveal
 */
async function runFullAnalysis() {
  updateStatus("Initiating real-time spatial geoprocessing pipeline...");

  const pipelineEl = document.getElementById("pipelineContainer");
  const stageTitle = document.getElementById("pipelineStageTitle");
  const stageDetail = document.getElementById("pipelineStageDetail");
  const percentEl = document.getElementById("pipelinePercent");
  const progressBar = document.getElementById("pipelineProgressBar");

  // Show Pipeline Scanner
  if (pipelineEl) pipelineEl.style.display = "block";

  // Show Skeleton Shimmer in all results sections to prevent instant dumping
  showSkeletons();

  // Helper function to update pipeline stages
  function setStage(stepNum, percent, title, detail) {
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (stageTitle) stageTitle.textContent = title;
    if (stageDetail) stageDetail.textContent = detail;
    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById(`pstep-${i}`);
      if (el) {
        if (i < stepNum) { el.className = "pstep done"; }
        else if (i === stepNum) { el.className = "pstep active"; }
        else { el.className = "pstep"; }
      }
    }
  }

  // Stage 1: Spatial Acquisition & Hydrology
  setStage(1, 20, "Acquiring Coordinates & Intersecting Hydrology...", `Calculating geodesic distance to nearest major river networks from (${state.location.lat.toFixed(4)}°N, ${state.location.lng.toFixed(4)}°E)...`);
  await sleep(220);

  // 1. Spatial Analysis
  state.spatialAnalysis = analyzeSiteProximity(state.location.lat, state.location.lng, state.boundaryGeometry);

  // Stage 2: Wildlife Eco-Sensitive Zones
  setStage(2, 45, "Scanning 10 km Statutory Eco-Sensitive Zones (WII)...", `Checking proximity to ${state.spatialAnalysis.nearestPA ? state.spatialAnalysis.nearestPA.name : "National Parks"} and statutory SC-NBWL boundaries...`);
  await sleep(220);

  // Stage 3: Census Habitations & Industrial Corridors
  setStage(3, 65, "Querying Census Habitations & Industrial Corridors...", `Evaluating demographic separation buffers and proximity to ${state.spatialAnalysis.nearestSettlement ? state.spatialAnalysis.nearestSettlement.name : "human settlements"}...`);
  await sleep(220);

  // Stage 4: Multi-Criteria Evaluation (MCE)
  setStage(4, 85, `Executing MCE Risk Weighting Matrix for ${INDUSTRY_PROFILES[state.selectedIndustry].name}...`, `Applying sector-specific damage weights (Air, Water, Waste, Population, Ecology) and capacity scaling...`);
  state.riskEvaluation = evaluateSiteRisk(state.selectedIndustry, state.spatialAnalysis, state.capacity);
  await sleep(220);

  // Stage 5: Impact Matrix & PARIVESH Regulations
  setStage(5, 100, "Synthesizing 12-Factor Impact Matrix & Regulatory Pathways...", `Mapping against MoEFCC EIA 2006 Schedule ${INDUSTRY_PROFILES[state.selectedIndustry].eiaScheduleItem} and SPCB CTE/CTO mandates...`);
  
  state.impactAssessments = analyzeEnvironmentalImpacts(state.selectedIndustry, state.spatialAnalysis, state.riskEvaluation);
  state.regulatoryChecks = evaluateRegulatoryClearances(state.selectedIndustry, state.capacity, state.projectPhase, state.spatialAnalysis);
  state.alternativeSites = findAlternativeSites(state.selectedIndustry, state.location, state.capacity, state.selectedState);
  state.comparisonData = compareIndustriesAtSite(state.spatialAnalysis, state.capacity);

  await sleep(180);

  // Smoothly collapse pipeline status after brief completion note
  if (pipelineEl) {
    setTimeout(() => {
      pipelineEl.style.display = "none";
    }, 1200);
  }

  // Render all dashboard sections with staggered, animated reveals
  renderSiteMarkerAndBuffers();
  renderScoreCardAnimated();
  renderGisFindingsStaggered();
  renderImpactProfileStaggered();
  renderRegulatoryChecksStaggered();
  renderAlternativeSites();
  renderIndustryComparison();
  renderCandidatePinsOnMap();
  updateAiContextPill();

  updateStatus(`Analysis Complete • ${INDUSTRY_PROFILES[state.selectedIndustry].name} at ${state.location.name}`);
}

/**
 * Displays realistic pulse skeletons while scanning
 */
function showSkeletons() {
  const scoreNumEl = document.getElementById("scoreValue");
  if (scoreNumEl) scoreNumEl.textContent = "...";

  const findingsList = document.getElementById("gisFindingsList");
  if (findingsList) {
    findingsList.innerHTML = `
      <div class="skeleton-shimmer skeleton-card"></div>
      <div class="skeleton-shimmer skeleton-card"></div>
      <div class="skeleton-shimmer skeleton-card"></div>
    `;
  }

  const impactsGrid = document.getElementById("impactCardsGrid");
  if (impactsGrid) {
    impactsGrid.innerHTML = `
      <div class="skeleton-shimmer skeleton-card"></div>
      <div class="skeleton-shimmer skeleton-card"></div>
      <div class="skeleton-shimmer skeleton-card"></div>
      <div class="skeleton-shimmer skeleton-card"></div>
    `;
  }

  const regList = document.getElementById("regulatoryChecksList");
  if (regList) {
    regList.innerHTML = `
      <div class="skeleton-shimmer skeleton-card"></div>
      <div class="skeleton-shimmer skeleton-card"></div>
    `;
  }
}

/**
 * Smooth quadratic easing number counter animation
 */
function animateValue(obj, start, end, duration) {
  if (!obj) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const eased = 1 - (1 - progress) * (1 - progress);
    obj.textContent = Math.floor(eased * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * Renders Preliminary Risk Score Card with animated counter
 */
function renderScoreCardAnimated() {
  const r = state.riskEvaluation;
  const scoreNumEl = document.getElementById("scoreValue");
  const riskBadgeEl = document.getElementById("riskBadge");
  const verdictHeadlineEl = document.getElementById("verdictHeadline");
  const verdictDescEl = document.getElementById("verdictDescription");
  const topConcernsEl = document.getElementById("topConcernsSummary");

  if (scoreNumEl) {
    animateValue(scoreNumEl, 0, r.finalScore, 800);
  }

  if (riskBadgeEl) {
    riskBadgeEl.textContent = `PRELIMINARY RISK: ${r.riskLevel}`;
    riskBadgeEl.style.backgroundColor = r.riskBadgeColor;
  }
  if (verdictHeadlineEl) verdictHeadlineEl.textContent = r.riskHeadline;
  if (verdictDescEl) verdictDescEl.textContent = r.riskDescription;

  if (topConcernsEl) {
    topConcernsEl.innerHTML = r.topConcerns.map((c, idx) => `
      <div class="concern-pill pill-${c.level.toLowerCase()} stagger-in" style="animation-delay: ${idx * 0.1}s;">
        <span>${c.label}</span>
        <strong>${c.score}/100 [${c.level}]</strong>
      </div>
    `).join("");
  }
}

/**
 * Renders Geodesic Spatial Proximity Findings Table with staggered CSS cascade
 */
function renderGisFindingsStaggered() {
  const wrap = document.getElementById("gisFindingsList");
  if (!wrap || !state.spatialAnalysis) return;

  wrap.innerHTML = state.spatialAnalysis.nearbyFeatures.map((f, idx) => {
    const isCritical = f.distanceKm < 2.0;
    const isModerate = f.distanceKm < 5.0;
    const tagClass = isCritical ? "tag-risk" : isModerate ? "tag-warn" : "tag-favorable";
    const tagText = isCritical ? "HIGH SENSITIVITY" : isModerate ? "CHECK SENSITIVITY" : "LOWER CONSTRAINT";

    return `
      <div class="gis-feature-row stagger-in" style="animation-delay: ${idx * 0.07}s;">
        <div class="feature-col-main">
          <div class="feature-title">
            <span class="feat-ico">${f.icon}</span>
            <strong>${f.category}: ${f.name}</strong>
          </div>
          <p class="feature-relevance">${f.relevance}</p>
          <div class="feature-provenance">
            <span class="prov-badge ${f.isReal ? 'prov-real' : 'prov-demo'}">${f.isReal ? 'VERIFIED GEOPROCESSING' : 'DEMO LAYER'}</span>
            <span>Source: ${f.source} (${f.confidence})</span>
          </div>
        </div>
        <div class="feature-col-dist">
          <span class="distance-value">${f.distanceKm.toFixed(1)} km</span>
          <span class="status-tag ${tagClass}">${tagText}</span>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Renders 12-Factor Environmental Impact Profile Cards with staggered cascade
 */
function renderImpactProfileStaggered() {
  const wrap = document.getElementById("impactCardsGrid");
  if (!wrap || !state.impactAssessments) return;

  wrap.innerHTML = state.impactAssessments.map((imp, idx) => {
    const levelClass = imp.riskLevel.toLowerCase();
    return `
      <div class="impact-factor-card border-${levelClass} stagger-in" style="animation-delay: ${idx * 0.05}s;">
        <div class="factor-header">
          <div class="factor-title">
            <span class="factor-icon">${imp.icon}</span>
            <div>
              <strong>${imp.title}</strong>
              <small>${imp.triggerExplanation}</small>
            </div>
          </div>
          <div class="factor-score-badge badge-${levelClass}">
            <span>${imp.riskLevel}</span>
            <strong>${imp.score}/100</strong>
          </div>
        </div>

        <div class="factor-body">
          <div class="factor-detail-row">
            <b>Potential Environmental Harms:</b>
            <p>${imp.environmentalHarm[0]}</p>
          </div>
          <div class="factor-detail-row">
            <b>Human / Community Exposure Pathway:</b>
            <p>${imp.communityPathways[0]}</p>
          </div>
          <div class="factor-detail-row">
            <b>Statutory Mitigation Priority:</b>
            <p>${imp.mitigationMeasures[0]}</p>
          </div>
        </div>

        <div class="factor-footer">
          <span>${imp.requiresSpecialistAssessment ? '⚠️ Specialist Assessment Recommended' : '✅ Standard Baseline EMP'}</span>
          <button class="text-btn view-impact-deep-btn" data-domain="${imp.id}">Deep Dive →</button>
        </div>
      </div>
    `;
  }).join("");

  // Attach Deep Dive modal openers
  document.querySelectorAll(".view-impact-deep-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const domainId = e.currentTarget.getAttribute("data-domain");
      openImpactDeepDiveModal(domainId);
    });
  });
}

/**
 * Renders Potential Regulatory Clearances Checklist with staggered cascade
 */
function renderRegulatoryChecksStaggered() {
  const wrap = document.getElementById("regulatoryChecksList");
  if (!wrap || !state.regulatoryChecks) return;

  wrap.innerHTML = state.regulatoryChecks.map((r, idx) => `
    <div class="regulatory-item-card stagger-in" style="animation-delay: ${idx * 0.08}s;">
      <div class="reg-item-top">
        <div>
          <span class="reg-code-pill">${r.ruleId}</span>
          <strong class="reg-title">${r.category}</strong>
        </div>
        <span class="reg-status-badge">${r.status}</span>
      </div>
      <div class="reg-authority">
        <strong>Competent Authority:</strong> ${r.authority}
      </div>
      <p class="reg-notes">${r.applicabilityNotes}</p>
      <div class="reg-action">
        <strong>Mandatory Next Step:</strong> ${r.actionRequired}
      </div>
      <div class="reg-footer">
        <small>Statutory Basis: ${r.statutoryReference} | Last Verified: ${r.lastVerified}</small>
      </div>
    </div>
  `).join("");
}

/**
 * Renders Alternative Sites Grid
 */
function renderAlternativeSites() {
  const wrap = document.getElementById("alternativeSitesGrid");
  if (!wrap || !state.alternativeSites) return;

  wrap.innerHTML = state.alternativeSites.map(c => `
    <div class="candidate-card ${c.isBest ? 'card-best' : ''}">
      <div class="cand-header">
        <div class="cand-rank-badge ${c.isBest ? 'rank-gold' : ''}">#${c.rank}</div>
        <div>
          <strong>${c.name}</strong>
          <small>${c.type}</small>
        </div>
      </div>
      <div class="cand-score-strip">
        <div>
          <span>Suitability Index</span>
          <strong>${c.suitabilityScore}/100</strong>
        </div>
        <div>
          <span>Preliminary Risk</span>
          <strong style="color:${c.riskScore > 60 ? '#ea580c' : '#16a34a'}">${c.riskScore}/100</strong>
        </div>
      </div>
      <p class="cand-advantage">💡 <strong>Advantage:</strong> ${c.advantage}</p>
      <div class="cand-metrics">
        <span>River: <b>${c.riverDistKm} km</b></span>
        <span>Wildlife PA: <b>${c.paDistKm} km</b></span>
        <span>Settlement: <b>${c.settlementDistKm} km</b></span>
      </div>
      <button class="secondary select-candidate-btn" data-lat="${c.lat}" data-lng="${c.lng}" data-name="${c.name}">
        Select This Site For Analysis →
      </button>
    </div>
  `).join("");

  // Attach Candidate selector click handlers
  document.querySelectorAll(".select-candidate-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const lat = parseFloat(e.currentTarget.getAttribute("data-lat"));
      const lng = parseFloat(e.currentTarget.getAttribute("data-lng"));
      const name = e.currentTarget.getAttribute("data-name");
      const candLoc = {
        name,
        lat,
        lng,
        state: state.selectedState,
        district: state.selectedDistrict,
        setting: "Candidate Alternative Site"
      };
      const presetSelect = document.getElementById("presetSiteSelect");
      if (presetSelect) presetSelect.value = "custom";
      updateSiteLocation(candLoc, { flyTo: true, zoom: 11, triggerAnalysis: true });
      document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/**
 * Renders candidate pins on Leaflet Map
 */
function renderCandidatePinsOnMap() {
  candidatesLayerGroup.clearLayers();
  if (!state.alternativeSites) return;

  state.alternativeSites.forEach(c => {
    const color = c.isBest ? "#15803d" : "#0284c7";
    const marker = L.circleMarker([c.lat, c.lng], {
      pane: "candidateSitesPane",
      radius: c.isBest ? 8 : 6,
      color: "#ffffff",
      fillColor: color,
      fillOpacity: 0.9,
      weight: 2
    }).addTo(candidatesLayerGroup);

    marker.bindTooltip(`<b>#${c.rank} ${c.name}</b><br>Suitability: ${c.suitabilityScore}/100 (Risk: ${c.riskScore}/100)`, {
      sticky: true
    });

    marker.on("click", () => {
      const candLoc = {
        name: c.name,
        lat: c.lat,
        lng: c.lng,
        state: state.selectedState,
        district: state.selectedDistrict,
        setting: "Alternative Candidate Site"
      };
      const presetSelect = document.getElementById("presetSiteSelect");
      if (presetSelect) presetSelect.value = "custom";
      updateSiteLocation(candLoc, { flyTo: true, zoom: 11, triggerAnalysis: true });
    });
  });
}

/**
 * Renders Same-Site Multi-Industry Comparison Matrix Table
 */
function renderIndustryComparison() {
  const tbody = document.getElementById("comparisonTableBody");
  if (!tbody || !state.comparisonData) return;

  tbody.innerHTML = state.comparisonData.map(row => {
    const isCurrent = row.industryKey === state.selectedIndustry;
    return `
      <tr class="${isCurrent ? 'row-active-industry' : ''}">
        <td>
          <div class="comp-ind-name">
            <span>${row.icon}</span>
            <strong>${row.name}</strong>
            ${isCurrent ? '<span class="current-pill">CURRENT</span>' : ''}
          </div>
        </td>
        <td><strong class="score-pill score-${row.factors.air > 70 ? 'high' : 'ok'}">${row.factors.air}</strong></td>
        <td><strong class="score-pill score-${row.factors.water > 70 ? 'high' : 'ok'}">${row.factors.water}</strong></td>
        <td><strong class="score-pill score-${row.factors.population > 70 ? 'high' : 'ok'}">${row.factors.population}</strong></td>
        <td><strong class="score-pill score-${row.factors.biodiversity > 70 ? 'high' : 'ok'}">${row.factors.biodiversity}</strong></td>
        <td><strong class="score-pill score-${row.factors.waste > 70 ? 'high' : 'ok'}">${row.factors.waste}</strong></td>
        <td><strong class="score-pill score-${row.factors.agriculture > 70 ? 'high' : 'ok'}">${row.factors.agriculture}</strong></td>
        <td><strong class="comp-overall-score" style="color:${row.overallScore > 65 ? '#ea580c' : '#16a34a'}">${row.overallScore}/100</strong></td>
        <td><small class="comp-limitation">${row.primaryLimitation}</small></td>
      </tr>
    `;
  }).join("");
}

/**
 * Updates District Dropdown when State changes
 */
function updateDistrictDropdown() {
  const distSelect = document.getElementById("districtSelect");
  if (!distSelect) return;
  const districts = INDIAN_STATES_DISTRICTS[state.selectedState] || ["Pune", "Nagpur", "Nashik"];
  distSelect.innerHTML = districts.map(d => `<option value="${d}">${d}</option>`).join("");
  state.selectedDistrict = districts[0];
}

/**
 * Updates Industry Subsectors, Units, and Capacity Defaults
 */
function updateIndustryDetails() {
  const p = INDUSTRY_PROFILES[state.selectedIndustry];
  if (!p) return;

  // Subsector dropdown
  const subSelect = document.getElementById("subsectorSelect");
  if (subSelect && p.subsectors) {
    subSelect.innerHTML = p.subsectors.map(s => `<option value="${s}">${s}</option>`).join("");
    state.subsector = p.subsectors[0];
  }

  // Capacity Unit dropdown
  const unitSelect = document.getElementById("unitSelect");
  if (unitSelect && p.allowedUnits) {
    unitSelect.innerHTML = p.allowedUnits.map(u => `<option value="${u}">${u}</option>`).join("");
    unitSelect.value = p.unit;
    state.unit = p.unit;
  }

  // Default capacity
  const capInput = document.getElementById("capacityInput");
  if (capInput) {
    capInput.value = p.defaultCapacity;
    state.capacity = p.defaultCapacity;
  }

  // Siting / statutory warning note
  const noticeEl = document.getElementById("industrySpecificNotice");
  if (noticeEl) {
    noticeEl.innerHTML = `
      <strong>${p.icon} ${p.name} Siting Context:</strong> ${p.statutoryNotes}
    `;
  }
}

/**
 * Updates coordinate display inputs
 */
function updateCoordinateInputs() {
  const latEl = document.getElementById("latInput");
  const lngEl = document.getElementById("lngInput");
  if (latEl) latEl.value = state.location.lat.toFixed(5);
  if (lngEl) lngEl.value = state.location.lng.toFixed(5);
}

/**
 * Status message bar
 */
function updateStatus(msg) {
  const statusEl = document.getElementById("systemStatusBar");
  if (statusEl) statusEl.textContent = msg;
}

/**
 * Updates context pill text in AI Advisor
 */
function updateAiContextPill() {
  const pill = document.getElementById("aiContextPillText");
  if (pill && state.riskEvaluation) {
    pill.textContent = `Active Context: ${INDUSTRY_PROFILES[state.selectedIndustry].name} at ${state.location.name} (Risk: ${state.riskEvaluation.finalScore}/100)`;
  }
}

/**
 * Sets up AI Advisor Chat Widget & Config
 */
function setupAIAdvisor() {
  const modal = document.getElementById("aiAdvisorModal");
  const openBtn = document.getElementById("btnOpenAI");
  const configBox = document.getElementById("aiKeyConfigBox");
  const toggleKeyBtn = document.getElementById("btnToggleApiKey");
  const keyInput = document.getElementById("geminiApiKeyInput");
  const saveKeyBtn = document.getElementById("btnSaveApiKey");
  const chatForm = document.getElementById("aiChatForm");
  const chatInput = document.getElementById("aiChatInput");
  const chatMessages = document.getElementById("aiChatMessages");

  if (keyInput) {
    keyInput.value = aiAdvisorInstance.getApiKey();
  }

  openBtn?.addEventListener("click", () => {
    updateAiContextPill();
    modal?.classList.add("modal-active");
  });

  toggleKeyBtn?.addEventListener("click", () => {
    if (configBox) {
      configBox.style.display = configBox.style.display === "none" ? "block" : "none";
    }
  });

  saveKeyBtn?.addEventListener("click", () => {
    if (keyInput) {
      aiAdvisorInstance.setApiKey(keyInput.value);
      alert(keyInput.value ? "Gemini API Key saved! Live model enabled." : "Key cleared. Switched to local grounded reasoning engine.");
      if (configBox) configBox.style.display = "none";
    }
  });

  // Prompt chips
  document.querySelectorAll(".prompt-chip").forEach(chip => {
    chip.addEventListener("click", async (e) => {
      const q = e.currentTarget.getAttribute("data-query");
      await executeAiPrompt(q);
    });
  });

  // Chat Form Submit
  chatForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = chatInput?.value.trim();
    if (!query) return;
    chatInput.value = "";
    await executeAiPrompt(query);
  });

  async function executeAiPrompt(query) {
    if (!chatMessages) return;

    // Append User Message
    const userMsg = document.createElement("div");
    userMsg.className = "ai-msg ai-msg-user";
    userMsg.textContent = query;
    chatMessages.appendChild(userMsg);

    // Append Assistant Loading Bubble
    const asstMsg = document.createElement("div");
    asstMsg.className = "ai-msg ai-msg-assistant";
    asstMsg.innerHTML = `<em>Analyzing site data model & querying environmental rules...</em>`;
    chatMessages.appendChild(asstMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const reportData = buildCurrentReportDataObject();
    const response = await aiAdvisorInstance.askQuestion(query, reportData);

    // Render markdown-like response
    asstMsg.innerHTML = formatAiResponseToHtml(response);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

/**
 * Basic markdown parser for AI responses
 */
function formatAiResponseToHtml(md) {
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/gim, '<br>')
    .replace(/\n/gim, '<br>');
}

/**
 * Sets up all UI button clicks and form changes
 */
function setupEventHandlers() {
  // Industry selection change
  document.getElementById("industrySelect")?.addEventListener("change", (e) => {
    state.selectedIndustry = e.target.value;
    updateIndustryDetails();
    runFullAnalysis();
  });

  // State selection change
  document.getElementById("stateSelect")?.addEventListener("change", (e) => {
    state.selectedState = e.target.value;
    updateDistrictDropdown();

    // Auto-orient map and analysis to selected state
    const match = URBAN_SETTLEMENTS.find(u => u.state === state.selectedState);
    if (match) {
      const stateLoc = {
        name: `${match.name}, ${state.selectedState}`,
        lat: match.lat,
        lng: match.lng,
        state: state.selectedState,
        district: state.selectedDistrict,
        setting: "Regional Industrial Zone"
      };
      const presetSelect = document.getElementById("presetSiteSelect");
      if (presetSelect) presetSelect.value = "custom";
      updateSiteLocation(stateLoc, { flyTo: true, zoom: 9, triggerAnalysis: true });
    }
  });

  // District selection change
  document.getElementById("districtSelect")?.addEventListener("change", (e) => {
    state.selectedDistrict = e.target.value;
    const distNameClean = state.selectedDistrict.toLowerCase().replace(/\(.*?\)/g, "").trim();
    const match = URBAN_SETTLEMENTS.find(u => 
      u.state === state.selectedState && 
      (u.name.toLowerCase().includes(distNameClean) || distNameClean.includes(u.name.toLowerCase()))
    );
    if (match) {
      const distLoc = {
        name: `${match.name}, ${state.selectedDistrict}`,
        lat: match.lat,
        lng: match.lng,
        state: state.selectedState,
        district: state.selectedDistrict,
        setting: "District Industrial Hub"
      };
      const presetSelect = document.getElementById("presetSiteSelect");
      if (presetSelect) presetSelect.value = "custom";
      updateSiteLocation(distLoc, { flyTo: true, zoom: 10, triggerAnalysis: true });
    }
  });

  // Preset Site selection change
  document.getElementById("presetSiteSelect")?.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "custom") {
      updateStatus("Click anywhere on the India map to pick a custom site location.");
      return;
    }
    if (PRESET_SITES[val]) {
      const preset = PRESET_SITES[val];
      state.selectedState = preset.state;
      const stateEl = document.getElementById("stateSelect");
      if (stateEl) stateEl.value = state.selectedState;
      updateDistrictDropdown();
      state.selectedDistrict = preset.district;
      const distEl = document.getElementById("districtSelect");
      if (distEl) distEl.value = state.selectedDistrict;

      updateSiteLocation({ ...preset }, { flyTo: true, zoom: 10, triggerAnalysis: true });
    }
  });

  // Project Phase change
  document.getElementById("projectPhaseSelect")?.addEventListener("change", (e) => {
    state.projectPhase = e.target.value;
  });

  // Project Name change
  document.getElementById("projectNameInput")?.addEventListener("input", (e) => {
    state.projectName = e.target.value;
  });

  // Capacity & Unit change
  document.getElementById("capacityInput")?.addEventListener("change", (e) => {
    state.capacity = parseFloat(e.target.value) || 1000;
  });
  document.getElementById("unitSelect")?.addEventListener("change", (e) => {
    state.unit = e.target.value;
  });

  // Main Analyze Button (Runs geoprocessing without resetting user viewport)
  document.getElementById("btnAnalyze")?.addEventListener("click", () => {
    runFullAnalysis();
  });

  // Reset Button
  document.getElementById("btnReset")?.addEventListener("click", () => {
    window.location.reload();
  });

  // Coordinate Manual Input Change
  document.getElementById("latInput")?.addEventListener("change", (e) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && Math.abs(v - state.location.lat) > 0.0001) {
      updateSiteLocation({
        ...state.location,
        lat: v,
        name: `Coordinates (${v.toFixed(4)}°N, ${state.location.lng.toFixed(4)}°E)`
      }, { flyTo: true, zoom: 10, triggerAnalysis: true });
    }
  });
  document.getElementById("lngInput")?.addEventListener("change", (e) => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && Math.abs(v - state.location.lng) > 0.0001) {
      updateSiteLocation({
        ...state.location,
        lng: v,
        name: `Coordinates (${state.location.lat.toFixed(4)}°N, ${v.toFixed(4)}°E)`
      }, { flyTo: true, zoom: 10, triggerAnalysis: true });
    }
  });

  // KML / GeoJSON File Upload
  const fileInput = document.getElementById("boundaryFileInput");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const parsed = parseBoundaryGeometry(event.target.result, file.name);
        if (parsed.error) {
          alert(`File Parse Error: ${parsed.error}`);
          return;
        }
        state.boundaryGeometry = parsed;
        const polyLoc = {
          ...state.location,
          lat: parsed.centroid.lat,
          lng: parsed.centroid.lng,
          name: `Uploaded Boundary (${file.name})`
        };
        updateSiteLocation(polyLoc, { flyTo: false, triggerAnalysis: true });
        if (polygonLayer) {
          map.fitBounds(polygonLayer.getBounds(), { padding: [30, 30], maxZoom: 14 });
        }
      };
      reader.readAsText(file);
    });
  }

  // Buffer Toggles (Show/hide only, zero zoom or view reset)
  document.getElementById("toggle1km")?.addEventListener("change", (e) => {
    state.activeBuffers.km1 = e.target.checked;
    if (!bufferLayers.km1) return;
    if (state.activeBuffers.km1) {
      if (!map.hasLayer(bufferLayers.km1)) map.addLayer(bufferLayers.km1);
    } else {
      if (map.hasLayer(bufferLayers.km1)) map.removeLayer(bufferLayers.km1);
    }
  });
  document.getElementById("toggle5km")?.addEventListener("change", (e) => {
    state.activeBuffers.km5 = e.target.checked;
    if (!bufferLayers.km5) return;
    if (state.activeBuffers.km5) {
      if (!map.hasLayer(bufferLayers.km5)) map.addLayer(bufferLayers.km5);
    } else {
      if (map.hasLayer(bufferLayers.km5)) map.removeLayer(bufferLayers.km5);
    }
  });
  document.getElementById("toggle10km")?.addEventListener("change", (e) => {
    state.activeBuffers.km10 = e.target.checked;
    if (!bufferLayers.km10) return;
    if (state.activeBuffers.km10) {
      if (!map.hasLayer(bufferLayers.km10)) map.addLayer(bufferLayers.km10);
    } else {
      if (map.hasLayer(bufferLayers.km10)) map.removeLayer(bufferLayers.km10);
    }
  });

  // "Why 72?" Explainability Modal Button
  document.getElementById("btnExplainScore")?.addEventListener("click", openExplainScoreModal);

  // Executive Report Modal Buttons
  document.getElementById("btnOpenReport")?.addEventListener("click", openExecutiveReportModal);
  document.getElementById("btnExportJson")?.addEventListener("click", () => {
    if (!state.spatialAnalysis) {
      alert("Run an analysis first.");
      return;
    }
    const reportData = buildCurrentReportDataObject();
    exportReportJson(reportData);
  });

  // Nav Links Modal Triggers
  document.getElementById("navDataSources")?.addEventListener("click", (e) => {
    e.preventDefault();
    openDataSourcesModal();
  });
  document.getElementById("navMethodology")?.addEventListener("click", (e) => {
    e.preventDefault();
    openMethodologyModal();
  });
  document.getElementById("navAcademicDocs")?.addEventListener("click", (e) => {
    e.preventDefault();
    openAcademicDocsModal();
  });

  // Modal Generic Close Buttons
  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("modal-active"));
    });
  });
}

/**
 * Builds composite report data object
 */
function buildCurrentReportDataObject() {
  return {
    projectName: state.projectName,
    industryProfile: INDUSTRY_PROFILES[state.selectedIndustry],
    subsector: state.subsector,
    projectPhase: state.projectPhase,
    capacity: state.capacity,
    unit: state.unit,
    siteLocation: state.location,
    boundaryGeometry: state.boundaryGeometry,
    spatialAnalysis: state.spatialAnalysis,
    riskEvaluation: state.riskEvaluation,
    impactAssessments: state.impactAssessments,
    regulatoryChecks: state.regulatoryChecks,
    alternativeSites: state.alternativeSites,
    timestamp: new Date().toISOString()
  };
}

/**
 * Opens "Why X/100?" Explainability Modal
 */
function openExplainScoreModal() {
  const modal = document.getElementById("explainScoreModal");
  const content = document.getElementById("explainScoreModalContent");
  if (!modal || !content || !state.riskEvaluation) return;

  const r = state.riskEvaluation;
  content.innerHTML = `
    <div class="explain-modal-body">
      <div class="explain-top-callout">
        <div class="score-circle-sm" style="border-color:${r.riskBadgeColor}; color:${r.riskBadgeColor};">
          ${r.finalScore}
        </div>
        <div>
          <h3>Why is the Preliminary Risk Score ${r.finalScore}/100?</h3>
          <p>The score is computed through a <strong>Weighted Multi-Criteria Evaluation (MCE)</strong> specifically tuned to the environmental damage potential of <strong>${INDUSTRY_PROFILES[state.selectedIndustry].name}</strong>.</p>
        </div>
      </div>

      <div class="formula-box">
        <strong>Mathematical Risk Model:</strong>
        <code>Score = Σ [ (Base_Sensitivity_i + Spatial_Penalty_i + Scale_Penalty_i) × Weight_i ] / Σ Weight_i</code>
      </div>

      <table class="explain-table">
        <thead>
          <tr>
            <th>Factor</th>
            <th>Sector Weight</th>
            <th>Base Score</th>
            <th>Spatial Proximity Penalty</th>
            <th>Weighted Contribution</th>
          </tr>
        </thead>
        <tbody>
          ${r.auditBreakdown.map(a => {
            const f = r.factorResults[a.factorKey];
            return `
              <tr>
                <td><strong>${a.label}</strong></td>
                <td>${a.weight}</td>
                <td>${f.baseVal}/100</td>
                <td style="color:${f.spatialPenalty > 0 ? '#ea580c' : '#16a34a'}">
                  ${f.spatialPenalty > 0 ? `+${f.spatialPenalty} pts (${a.notes})` : 'Zero spatial penalty'}
                </td>
                <td><strong style="font-size:14px;">+${a.contribution} pts</strong></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>

      <div class="explain-scale-note" style="margin-top:14px; font-size:11px; color:var(--slate-500);">
        <strong>Capacity Scale Adjustment:</strong> A scale penalty of +${r.factorResults.air ? r.factorResults.air.scalePenalty : 0} pts was applied to throughput factors due to proposed capacity of ${state.capacity.toLocaleString()} ${state.unit}.
      </div>
    </div>
  `;

  modal.classList.add("modal-active");
}

/**
 * Opens 12-Factor Impact Deep Dive Modal
 */
function openImpactDeepDiveModal(domainId) {
  const modal = document.getElementById("impactDeepDiveModal");
  const content = document.getElementById("impactDeepDiveContent");
  if (!modal || !content || !state.impactAssessments) return;

  const imp = state.impactAssessments.find(d => d.id === domainId);
  if (!imp) return;

  content.innerHTML = `
    <div class="impact-deep-dive">
      <div class="deep-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="deep-icon" style="font-size:28px;">${imp.icon}</span>
          <div>
            <h3 style="margin:0;">${imp.title}</h3>
            <span class="status-tag tag-${imp.riskLevel.toLowerCase()}">PRELIMINARY RISK: ${imp.riskLevel} (${imp.score}/100)</span>
          </div>
        </div>
      </div>

      <div class="deep-section" style="margin-bottom:12px;">
        <h4 style="color:var(--slate-900); margin-bottom:4px;">1. Triggering GIS & Operational Data</h4>
        <p style="font-size:12px; color:var(--slate-600);">${imp.triggerExplanation}</p>
      </div>

      <div class="deep-section" style="margin-bottom:12px;">
        <h4 style="color:var(--slate-900); margin-bottom:4px;">2. Potential Causes for this Sector</h4>
        <ul style="font-size:12px; color:var(--slate-600); padding-left:18px;">${imp.potentialCauses.map(c => `<li>${c}</li>`).join("")}</ul>
      </div>

      <div class="deep-section" style="margin-bottom:12px;">
        <h4 style="color:var(--slate-900); margin-bottom:4px;">3. Potential Environmental Harm</h4>
        <ul style="font-size:12px; color:var(--slate-600); padding-left:18px;">${imp.environmentalHarm.map(h => `<li>${h}</li>`).join("")}</ul>
      </div>

      <div class="deep-section" style="margin-bottom:12px;">
        <h4 style="color:var(--slate-900); margin-bottom:4px;">4. Potential Human Health & Community Exposure Pathways</h4>
        <ul style="font-size:12px; color:var(--slate-600); padding-left:18px;">${imp.communityPathways.map(p => `<li>${p}</li>`).join("")}</ul>
      </div>

      <div class="deep-section" style="margin-bottom:12px;">
        <h4 style="color:var(--slate-900); margin-bottom:4px;">5. Recommended Engineering & Siting Mitigations</h4>
        <ul style="font-size:12px; color:var(--slate-600); padding-left:18px;">${imp.mitigationMeasures.map(m => `<li>${m}</li>`).join("")}</ul>
      </div>

      <div class="deep-section">
        <h4 style="color:var(--slate-900); margin-bottom:4px;">6. Recommended Specialist Field Studies</h4>
        <ul style="font-size:12px; color:var(--slate-600); padding-left:18px;">${imp.specialistStudies.map(s => `<li><strong>${s}</strong></li>`).join("")}</ul>
      </div>
    </div>
  `;

  modal.classList.add("modal-active");
}

/**
 * Opens Executive Printable Report Modal
 */
function openExecutiveReportModal() {
  const modal = document.getElementById("reportModal");
  const content = document.getElementById("reportModalContent");
  if (!modal || !content || !state.spatialAnalysis) return;

  const reportData = buildCurrentReportDataObject();
  content.innerHTML = buildExecutiveReportHtml(reportData);
  modal.classList.add("modal-active");

  // Wire inner Print button
  document.getElementById("btnModalPrint")?.addEventListener("click", () => {
    window.print();
  });
}

/**
 * Opens Data Sources & Transparency Modal
 */
function openDataSourcesModal() {
  const modal = document.getElementById("dataSourcesModal");
  const content = document.getElementById("dataSourcesContent");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="transparency-doc">
      <h3>Data Sources & Provenance Registry</h3>
      <p style="margin:6px 0 16px; font-size:12px; color:var(--slate-600);">EcoClear India explicitly distinguishes between <strong>Verified Public Geospatial Datasets</strong> and <strong>Illustrative Demonstration Layers</strong>. No official clearance decisions or legal approvals are fabricated.</p>

      <table class="report-table">
        <thead>
          <tr>
            <th>Dataset</th>
            <th>Source Authority</th>
            <th>Coverage</th>
            <th>Version</th>
            <th>Confidence</th>
            <th>Usage & Siting Role</th>
          </tr>
        </thead>
        <tbody>
          ${DATA_SOURCES.map(ds => `
            <tr>
              <td><strong>${ds.datasetName}</strong></td>
              <td>${ds.sourceAuthority}</td>
              <td>${ds.geographicCoverage}</td>
              <td><code>${ds.version}</code></td>
              <td><span class="confidence-tag conf-${ds.confidence.toLowerCase().includes('high') ? 'high' : 'demo'}">${ds.confidence}</span></td>
              <td style="font-size:11px;">${ds.usageNote}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  modal.classList.add("modal-active");
}

/**
 * Opens Methodology & Flowchart Modal
 */
function openMethodologyModal() {
  const modal = document.getElementById("methodologyModal");
  const content = document.getElementById("methodologyContent");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="methodology-doc">
      <h3>EcoClear India — Scientific Methodology</h3>
      
      <div class="flowchart-box" style="display:flex; align-items:center; justify-content:space-between; background:var(--slate-50); padding:16px; border-radius:8px; margin:14px 0; font-size:11px;">
        <div class="flow-step" style="background:white; border:1px solid var(--slate-200); padding:8px; border-radius:6px; text-align:center;">1. Project Profile<br><small>16 Industries + Capacity</small></div>
        <div class="flow-arr" style="color:var(--primary); font-size:16px;">➔</div>
        <div class="flow-step" style="background:white; border:1px solid var(--slate-200); padding:8px; border-radius:6px; text-align:center;">2. GIS Coordinates<br><small>Point or Boundary Polygon</small></div>
        <div class="flow-arr" style="color:var(--primary); font-size:16px;">➔</div>
        <div class="flow-step" style="background:white; border:1px solid var(--slate-200); padding:8px; border-radius:6px; text-align:center;">3. Spatial Engine<br><small>Haversine Distance to PAs, Rivers</small></div>
        <div class="flow-arr" style="color:var(--primary); font-size:16px;">➔</div>
        <div class="flow-step" style="background:white; border:1px solid var(--slate-200); padding:8px; border-radius:6px; text-align:center;">4. Rule & Risk Engine<br><small>Industry Weights + Proximity Decay</small></div>
        <div class="flow-arr" style="color:var(--primary); font-size:16px;">➔</div>
        <div class="flow-step" style="background:white; border:1px solid var(--slate-200); padding:8px; border-radius:6px; text-align:center;">5. Impact & Clearance<br><small>12 Domains + PARIVESH Mapping</small></div>
      </div>

      <h4>1. Spatial Proximity Calculation</h4>
      <p style="font-size:12px; color:var(--slate-600); line-height:1.5;">Geodesic distance $d$ is calculated using great-circle Haversine trigonometry on the WGS84 ellipsoid. For river networks, minimum distance to polyline segments is calculated iteratively.</p>

      <h4 style="margin-top:12px;">2. Multi-Criteria Evaluation (MCE) Formula</h4>
      <p style="font-size:12px; color:var(--slate-600); line-height:1.5;">Each industry sector has a normalized weight vector $W = [w_1, w_2, ..., w_n]$ where $\\sum w_i = 1.0$. Factor scores decay based on proximity to sensitive features and logarithmic capacity scaling:</p>
      <code style="display:block; background:var(--slate-100); padding:8px; border-radius:4px; font-family:'JetBrains Mono'; margin:6px 0;">Final Risk Score = Σ [ (Base_i + Penalty_spatial,i + Penalty_scale,i) × w_i ]</code>

      <h4 style="margin-top:12px;">3. Cautionary Pre-Screening Boundaries</h4>
      <p style="font-size:12px; color:var(--slate-600); line-height:1.5;">The system adheres to non-deterministic, precautionary environmental screening. Siting scores represent early risk intelligence and do not substitute for statutory Environmental Impact Assessment (EIA) field studies or public hearings.</p>
    </div>
  `;

  modal.classList.add("modal-active");
}

/**
 * Opens Academic Project Defense Documentation Modal
 */
function openAcademicDocsModal() {
  const modal = document.getElementById("academicDocsModal");
  const content = document.getElementById("academicDocsContent");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="academic-doc">
      <h3>Academic Project Documentation (Stage 3 Evolution)</h3>
      <p><strong>Title:</strong> EcoClear India — Preliminary Environmental Site Screening & Impact Intelligence Decision-Support System</p>
      
      <h4 style="margin-top:12px;">1. Problem Statement</h4>
      <p style="font-size:12px; color:var(--slate-600); line-height:1.5;">Industrial project proponents in India frequently commit capital to site acquisition before understanding critical statutory environmental constraints (EIA 2006 Category A elevation, 10 km Eco-Sensitive Zones, High-Flood Line setbacks, SPCB ZLD mandates). This results in costly project delays, litigation at the National Green Tribunal (NGT), and severe ecological disruption.</p>

      <h4 style="margin-top:12px;">2. Proposed System Objectives</h4>
      <ul style="font-size:12px; color:var(--slate-600); line-height:1.5; padding-left:18px;">
        <li>Provide instant, explainable preliminary site screening across 16 major Indian industries.</li>
        <li>Integrate authoritative Indian geospatial data (River networks, Wildlife Sanctuaries, Notified Industrial Estates).</li>
        <li>Demonstrate sector-specific risk weighting (e.g. Nuclear emphasizes demographic sterilized zones and AERB codes, while Chemical emphasizes water and hazardous waste).</li>
        <li>Offer automated alternative candidate parcel ranking to guide greenfield investments toward less sensitive terrain.</li>
      </ul>

      <h4 style="margin-top:12px;">3. Production Architecture Blueprint</h4>
      <ul style="font-size:12px; color:var(--slate-600); line-height:1.5; padding-left:18px;">
        <li><strong>Frontend:</strong> Modern responsive GIS layout with Leaflet.js, Turf.js geoprocessing, and executive print reporting.</li>
        <li><strong>Backend Architecture:</strong> Modular Python FastAPI backend with PostGIS spatial query engine (see <code>/backend</code> and <code>/database/schema.sql</code>).</li>
        <li><strong>Rule Versioning:</strong> Complete audit schema storing rule ID, authority, source citation, effective date, and verification status.</li>
      </ul>
    </div>
  `;

  modal.classList.add("modal-active");
}
