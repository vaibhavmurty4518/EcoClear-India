# EcoClear India — Academic Project Technical Documentation
**Project Title:** EcoClear India: Industrial Environmental Site Pre-Screening & Impact Intelligence System  
**Domain:** Geographic Information Systems (GIS), Environmental Engineering & Decision Support Systems  
**Stage:** Stage 3 Evolution (Academic Defense & Prototype Demonstration Specification)

---

## 1. Problem Statement
In India's rapidly expanding industrial landscape, project proponents frequently commit substantial capital to site acquisition, engineering designs, and land conversion before identifying critical statutory environmental impediments. Such oversights lead to:
1. **Severe Project Delays & Abandonment:** Discovery of statutory constraints (e.g. proximity to National Parks, interstate boundaries triggering Category A elevation under EIA Notification 2006, or high flood lines).
2. **Litigation & Stay Orders:** Frequent disputes before the National Green Tribunal (NGT) and High Courts regarding clearance invalidations.
3. **Irreversible Ecological Degradation:** Siting polluting industries near fragile aquifers, dense populations, or critical wildlife corridors.

---

## 2. Project Objectives
- To build a spatial decision-support system specifically calibrated for industrial projects in the **Republic of India**.
- To implement an **Industry-Specific Environmental Rule Engine** across 16 major industrial sectors where factors and weights dynamically adapt to the sector's operational damage profile.
- To provide **Explainable Multi-Criteria Evaluation (MCE)** risk scoring ("Why X/100?") with a complete mathematical audit trail.
- To screen for potential regulatory requirements across the **EIA Notification 2006**, **Forest (Conservation) Act**, **Wildlife (Protection) Act**, **CRZ Notification 2019**, and **AERB Siting Codes**.
- To integrate an **Alternative Site Finder** that ranks candidate locations within the state/region using the active project profile.
- To produce an **Executive Pre-Screening Report** with complete data transparency and non-statutory disclaimers.

---

## 3. Existing System vs. Proposed System

| Dimension | Traditional / Existing Practice | EcoClear India (Proposed System) |
| :--- | :--- | :--- |
| **Site Selection** | Driven almost exclusively by commercial land costs, power tariffs, and logistics access. | Evaluates environmental vulnerability and statutory clearance risks *prior* to land commitment. |
| **Screening Speed** | Months of manual consultant reviews and field data collection. | Near-instant preliminary spatial screening and regulatory checklist generation. |
| **Industry Nuance** | Generic environmental checklists treating all industries identically. | 16 distinct industry profiles with sector-specific weights, base sensitivities, and pollutants. |
| **Explainability** | Black-box intuition or opaque risk scores. | Fully explainable: transparent factor weights, baseline sensitivities, spatial decay, and scale penalties. |
| **Alternatives** | Manual shortlisting of candidate plots without comparative environmental metrics. | Algorithmic ranking of candidate alternative sites based on lower environmental conflict. |

---

## 4. System Architecture
The application follows a clean 3-tier modular architecture:

```
[ Presentation Layer: Modern SPA ]
  ├── Leaflet.js Interactive Web Map & Turf.js Geodesic Calculations
  ├── Dynamic 16-Sector Project Profile Form
  ├── Explainable Score Visualizer ("Why X/100?" Modal)
  ├── 12-Factor Environmental Impact Matrix & Deep-Dive Drawers
  ├── Multi-Industry Comparison Matrix
  └── Executive Printable Screening Report Generator
           │
[ Intelligence Layer: Core Processing Modules ]
  ├── GIS Geoprocessing Engine (Haversine Distance, Buffer Generation, KML/GeoJSON Parser)
  ├── Industry Rule Engine (Weights Matrix, Base Profiles, Capacity Scaling)
  ├── Impact Analyzer (12 Environmental Domains, Causes, Harms, Exposure Pathways, Mitigations)
  ├── Regulatory Pre-Screening Checker (EIA 2006 Schedules, General Conditions, SPCB, AERB)
  └── Alternative Site Finder (Spatial Candidate Discovery & MCE Suitability Ranking)
           │
[ Data & Persistence Layer ]
  ├── Authoritative Indian Datasets (Major Rivers, Protected Areas & 10km ESZ, Industrial Parks)
  ├── Data Transparency & Provenance Registry (Confidence Tagging, Source Authority)
  └── Production PostGIS Spatial Tables & FastAPI Endpoints
```

---

## 5. Technology Stack
- **Frontend Core:** HTML5, Modern CSS3 (Design Tokens, Glassmorphism, CSS Grid, Print Stylesheet), Vanilla ES6 Modules.
- **Geospatial Mapping:** Leaflet.js (v1.9.4) with CartoDB Positron & OpenStreetMap India tiles.
- **Geoprocessing Math:** Great-Circle Haversine Geodesic algorithms and point-in-polygon / polyline-segment distance calculations.
- **Backend Architecture (Production Ready):** Python 3.13, FastAPI, Uvicorn, Pydantic v2.
- **Spatial Database (Production Ready):** PostgreSQL 16 with PostGIS 3.4 spatial extension, GIST spatial indexing.

---

## 6. Mathematical Risk Model

The EcoClear Preliminary Environmental Risk Score ($S_{\text{risk}} \in [0, 100]$) is formulated as:

$$S_{\text{risk}} = \frac{\sum_{i=1}^{n} w_i \cdot \min\left(99, \max\left(10, B_i \cdot 0.5 + P_{\text{spatial}, i} \cdot 1.3 + P_{\text{scale}, i} \cdot 1.1\right)\right)}{\sum_{i=1}^{n} w_i}$$

Where:
- $w_i$: Normalized sector-specific weight for environmental factor $i$, satisfying $\sum_{i=1}^{n} w_i = 1.0$.
- $B_i$: Baseline sector sensitivity score (0–100) reflecting intrinsic pollution intensity (e.g. chemical effluent vs. solar PV).
- $P_{\text{spatial}, i}$: Distance-decay penalty function derived from measured geodesic distance $d$ (in km) to the nearest sensitive receptor.
- $P_{\text{scale}, i}$: Logarithmic capacity scale factor: $P_{\text{scale}} = \min\left(15, \log_{10}\left(\frac{\text{Capacity}}{\text{Default Capacity}} + 1\right) \cdot 6.5\right)$.

---

## 7. Preliminary Risk Classifications
- **0 – 41: LOW PRELIMINARY RISK (Green):** Favorable baseline conditions; generous separation buffers from sensitive receptors.
- **42 – 59: MODERATE PRELIMINARY SENSITIVITY (Yellow):** Typical industrial baseline; manageable via standard Environmental Management Plans (EMP) and SPCB consent conditions.
- **60 – 74: HIGH PRELIMINARY SENSITIVITY (Orange):** Substantial environmental constraints; proximity to rivers, settlements, or agricultural tracts requiring advanced mitigation engineering.
- **75 – 100: CRITICAL ENVIRONMENTAL CONSTRAINT (Red):** Siting in immediate proximity to declared Protected Areas (<10 km), major river basins (<1 km), or high-density habitations. Warrants specialized statutory review and potential site reconsideration.

---

## 8. Data Sources & Provenance Policy
The system maintains strict integrity between verified datasets and demo layers:
1. **Rivers:** OpenStreetMap India & Survey of India perennial river centerlines. [VERIFIED DATA]
2. **Protected Areas:** Wildlife Institute of India (WII) & MoEFCC National Wildlife Database. [VERIFIED DATA]
3. **Settlements:** Census of India Urban Agglomerations & Municipal Boundaries. [VERIFIED DATA]
4. **Industrial Estates:** State IDCs (MIDC, GIDC, KIADB, IDCO) Gazette notifications. [VERIFIED DATA]
5. **Hydrogeology & Micro-Aquifers:** Synthetic demonstration polygons clearly badged as `[ILLUSTRATIVE DEMO LAYER]`.

---

## 9. Non-Statutory Disclaimer
EcoClear India is an academic prototype and decision-support tool. It does not issue legal clearances, statutory approvals, or substitute for mandatory Environmental Impact Assessment (EIA) studies under the MoEFCC, State SEIAAs, State Pollution Control Boards, or the Atomic Energy Regulatory Board (AERB).
