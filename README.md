# EcoClear India — Stage 3 Evolution
**India-Specific Industrial Environmental Site Pre-Screening & Impact Intelligence Platform**

> *"If I am planning to establish an industrial project at a particular location in India, what environmental risks, sensitive features, potential impacts, and regulatory considerations should I investigate before proceeding?"*

---

## 🚀 Quick Start (Local Run)

EcoClear India runs with **zero-friction** using any standard local web server:

```cmd
cd %USERPROFILE%\Downloads\EcoClear-India-Stage3\EcoClear-India-Demo
py -m http.server 8000
```

Open your browser to: **[http://localhost:8000](http://localhost:8000)**

---

## 🌟 Key Features & Evolution Highlights

### 1. 16 Distinct Industry Environmental Profiles
Does **not** treat all industries equally. Every sector has its own operational profile, baseline sensitivities, pollutants, and regulatory pathways:
1. **Steel / Metallurgical** (Blast furnace slag, ESPs, water consumption, air loading)
2. **Cement** (Limestone quarrying, clinker dust, AFR co-processing, kiln emissions)
3. **Chemical** (Hazardous waste, VOCs, ZLD systems, secondary containment, QRA)
4. **Pharmaceutical** (APIs, high-COD/TDS effluent, solvent recovery, bio-medical waste)
5. **Textile** (Wet processing, azo dyes, heavy metals, court-mandated ZLD)
6. **Food Processing** (Biomethanation, organic BOD load, wastewater reuse, odor)
7. **Thermal Power** (Coal ash, Flue Gas Desulfurization, thermal water withdrawal)
8. **Solar Power (Utility Scale)** (Agri-land footprint, dry robotic cleaning, bird diverters)
9. **Wind Power (Onshore)** (Avian/bat corridors, shadow flicker, ridge erosion)
10. **Mining (Coal & Minerals)** (Overburden dumps, water table drawdown, blasting, forest diversion)
11. **Petroleum / Petrochemicals** (Oily sludge, sulfur recovery, flaring, PESO/CRZ clearance)
12. **Waste Processing** (Secured landfills, high-temperature incineration, leachate lagoons)
13. **Paper & Pulp** (Black liquor recovery, chlorine-free bleaching, water intensity)
14. **Automobile Manufacturing** (Paint shop VOCs, phosphating sludge, CED booths)
15. **Electronics & Semiconductors** (Ultrapure water demand, toxic trace metals, acid scrubbers)
16. **Nuclear / Atomic Energy** (Treated under **AERB** safety code AERB/SC/S: sterilized zones, cooling hydrology, seismic stability, and emergency planning zones)

### 2. Real GIS System & Authoritative Indian Layers
- **Major Indian Rivers:** Real geodesic line-distance calculations to Ganga, Yamuna, Narmada, Godavari, Krishna, Mahanadi, Brahmaputra, Kaveri, Sabarmati, Tapi, and Brahmani.
- **National Parks & Sanctuaries:** Real coordinates and 10 km Eco-Sensitive Zone (ESZ) buffers for Jim Corbett, Kaziranga, Sundarbans, Gir, Tadoba-Andhari, Bandipur, Western Ghats, Ranthambore, Kanha, and Similipal.
- **Notified Industrial Estates:** State IDCs (MIDC, GIDC, KIADB, SIPCOT, IDCO) and DMIC nodes.
- **Urban Centers & Demographics:** Census of India urban agglomerations and population tiers.
- **Analytical Buffers:** Dynamic 1 km (footprint), 5 km (primary), and 10 km (EIA study zone) concentric circles.
- **Boundary Upload:** Drag-and-drop support for `.geojson` and `.kml` project boundary files.

### 3. Explainable Risk Scoring Engine ("Why X/100?")
- Multi-Criteria Evaluation (MCE) combines baseline industry intensity, distance-decay penalties, and scale adjustments.
- Interactive **"Why this score?"** modal showing itemized mathematical contributions for each factor.

### 4. 12-Factor Environmental Impact Library
Comprehensive scientific impact profiles answering **WHY?**, **WHAT CAN HAPPEN?**, **WHO IS AFFECTED?**, and **WHAT SHOULD BE INVESTIGATED?**:
- Air Quality, Water Resources, Soil & Land, Biodiversity, Forests, Wildlife Corridors, Agriculture, Human Settlements, Noise & Vibration, Waste Management, Climate Resilience, and Disaster Hazards.

### 5. Regulatory Pre-Screening Engine
Versioned statutory checks mapped to Indian environmental legislation:
- **EIA Notification 2006:** Category A vs. B1/B2 scheduling, and General Conditions (GC) 10 km elevation triggers.
- **Van (Sanrakshan Evam Samvardhan) Adhiniyam 2023:** Stage-I & Stage-II Forest Clearance and CAMPA.
- **Wildlife (Protection) Act 1972:** Standing Committee of National Board for Wildlife (SC-NBWL).
- **Water Act 1974 & Air Act 1981:** State PCB Consent to Establish (CTE) and Consent to Operate (CTO).
- **CRZ Notification 2019:** Coastal Zone Management Authority checks.
- **AERB Safety Codes:** Nuclear siting consents under the Atomic Energy Act 1962.

### 6. Alternative Site Finder
- Scans candidate industrial parcels in the state/region.
- Ranks candidate parcels by overall environmental suitability using the active project profile.
- Renders interactive map pins allowing users to click and switch analysis directly to candidate sites.

### 7. Same-Site Multi-Industry Comparison Matrix
- Visually compares Chemical vs. Steel vs. Cement vs. Nuclear vs. Solar vs. Pharma at the exact same location, proving that different industries have vastly different risk profiles on the same land.

### 8. Executive Environmental Pre-Screening Report
- Professional printable multi-page report preview formatted with `@media print` for PDF generation.
- Machine-readable JSON data export.

---

## 🏛️ Production Architecture & Code Structure

```
EcoClear-India-Demo/
├── index.html                      # Modern responsive SPA interface
├── styles.css                      # Design tokens, responsive grids, print styles
├── app.js                          # Central application coordinator
├── js/
│   ├── data/
│   │   ├── industry-profiles.js    # 16 detailed industry profiles & weights
│   │   ├── gis-layers.js           # Real Indian rivers, protected areas, corridors
│   │   ├── impact-library.js       # 12-factor environmental impact knowledge base
│   │   ├── regulatory-rules.js     # Versioned Indian regulatory rules
│   │   └── data-sources.js         # Dataset transparency & confidence registry
│   └── modules/
│       ├── gis-engine.js           # Haversine distance, polyline proximity, KML parser
│       ├── risk-engine.js          # MCE scoring & "Why X/100?" audit trail
│       ├── impact-analyzer.js      # 12-factor impact profile synthesizer
│       ├── regulatory-checker.js   # Regulatory clearance checklist generator
│       ├── alternatives-finder.js  # Regional alternative site ranking
│       ├── comparison-matrix.js    # Multi-industry same-site comparative engine
│       └── report-builder.js       # Executive HTML & JSON report generator
├── backend/
│   ├── main.py                     # Production FastAPI REST backend
│   └── requirements.txt            # Python dependencies
├── database/
│   └── schema.sql                  # PostgreSQL + PostGIS spatial schema DDL
└── docs/
    └── ACADEMIC_PROJECT_REPORT.md  # Comprehensive academic project documentation
```

---

## ⚖️ Statutory Notice & Data Authenticity Policy
EcoClear India is a **preliminary decision-support system and academic prototype**. It does not issue official government clearances or substitute for formal statutory Environmental Impact Assessment (EIA) studies or public hearings under the MoEFCC, State SEIAAs, or SPCBs. All datasets maintain clear distinction between **Verified Public Geospatial Data** and **Illustrative Demonstration Layers**.
