/**
 * EcoClear India — Data Sources & Transparency Registry
 * Comprehensive metadata tracking for all authoritative and illustrative datasets
 */

export const DATA_SOURCES = [
  {
    id: "ds_osm_rivers",
    datasetName: "Indian National River Centerlines & Waterway Network",
    sourceAuthority: "OpenStreetMap India Community & Survey of India Open Data",
    geographicCoverage: "Pan-India (Major river basins: Ganga, Indus, Brahmaputra, Peninsular rivers)",
    version: "2025.v1",
    lastUpdated: "2025-01-15",
    confidence: "High",
    isReal: true,
    licensing: "Open Data Commons Open Database License (ODbL) / Government Open Data License (GODL-India)",
    usageNote: "Authoritative geospatial linestrings representing major perennial and seasonal river centerlines used for geodesic proximity calculations."
  },
  {
    id: "ds_wii_pas",
    datasetName: "National Parks, Wildlife Sanctuaries & Tiger Reserves Database",
    sourceAuthority: "Wildlife Institute of India (WII) / MoEFCC National Wildlife Database",
    geographicCoverage: "Pan-India (106 National Parks, 573 Wildlife Sanctuaries, 55 Tiger Reserves)",
    version: "2024.Annual-Report",
    lastUpdated: "2024-11-20",
    confidence: "High",
    isReal: true,
    licensing: "Official Public Domain Government Publication / Research Citation",
    usageNote: "Official geographic coordinates, core areas, and statutory 10 km Eco-Sensitive Zone (ESZ) default boundaries for national conservation areas."
  },
  {
    id: "ds_moefcc_eia",
    datasetName: "PARIVESH Environmental Clearance Schedule & Category Master",
    sourceAuthority: "Ministry of Environment, Forest and Climate Change (MoEFCC)",
    geographicCoverage: "National (All Indian States & Union Territories)",
    version: "EIA-2006-Amended-2024",
    lastUpdated: "2024-10-10",
    confidence: "High",
    isReal: true,
    licensing: "Statutory Gazette Notification (Government of India)",
    usageNote: "Statutory categorization logic mapping 16 industrial sectors to Category A (Central MoEFCC) or Category B (State SEIAA) thresholds."
  },
  {
    id: "ds_cpcb_cat",
    datasetName: "CPCB Industrial Sector Categorization (Red / Orange / Green / White)",
    sourceAuthority: "Central Pollution Control Board (CPCB) & Ministry of Environment",
    geographicCoverage: "Pan-India (All State Pollution Control Boards)",
    version: "CPCB-Categorization-Revised-2016",
    lastUpdated: "2024-03-01",
    confidence: "High",
    isReal: true,
    licensing: "Official Statutory Standard",
    usageNote: "Pollution index scoring methodology categorizing industrial processes based on water/air emissions and hazardous waste generation."
  },
  {
    id: "ds_industrial_parks",
    datasetName: "Notified State Industrial Estates, SEZs & Corridors (MIDC, GIDC, KIADB, IDCO)",
    sourceAuthority: "State Industrial Development Corporations & National Industrial Corridor Development Corp (NICDC)",
    geographicCoverage: "Key industrial states (Maharashtra, Gujarat, Karnataka, Odisha, Tamil Nadu, Andhra Pradesh)",
    version: "2024.v2",
    lastUpdated: "2024-08-15",
    confidence: "High",
    isReal: true,
    licensing: "State Industrial Development Corporation Public Gazettes",
    usageNote: "Boundaries and locations of formally designated industrial zones where streamlined environmental clearance pathways apply."
  },
  {
    id: "ds_census_settlements",
    datasetName: "Indian Census Urban Agglomerations & Settlement Clusters",
    sourceAuthority: "Office of the Registrar General & Census Commissioner, India",
    geographicCoverage: "Pan-India",
    version: "Census-2011 (with 2021-2024 municipal updates)",
    lastUpdated: "2024-02-18",
    confidence: "High",
    isReal: true,
    licensing: "Census of India Public Domain",
    usageNote: "Spatial centroids and population tiers used for demographic exposure and settlement proximity screening."
  },
  {
    id: "ds_demo_aquifers",
    datasetName: "Illustrative Regional Hydrogeology & Aquifer Sensitivity Models",
    sourceAuthority: "EcoClear Synthetic Academic Simulation (Designed for CGWB adapter)",
    geographicCoverage: "Demonstration districts (Western Maharashtra, Coastal Gujarat)",
    version: "Demo-Model-1.2",
    lastUpdated: "2025-02-01",
    confidence: "Illustrative Demo",
    isReal: false,
    licensing: "Academic Demo Only",
    usageNote: "Illustrative synthetic polygon data representing shallow aquifer vulnerability and micro-watershed recharge zones. Not for statutory decision-making. Production requires CGWB National Aquifer Mapping (NAQUIM) data integration."
  },
  {
    id: "ds_demo_agriculture",
    datasetName: "Illustrative Prime Multi-Crop Agricultural Land Parcels",
    sourceAuthority: "EcoClear Synthetic Academic Simulation (Designed for NRSC Bhuvan LULC adapter)",
    geographicCoverage: "Demonstration regional clusters",
    version: "Demo-Model-1.2",
    lastUpdated: "2025-02-01",
    confidence: "Illustrative Demo",
    isReal: false,
    licensing: "Academic Demo Only",
    usageNote: "Illustrative land-use land-cover (LULC) polygon features. In production, this layer is intended to be replaced with 1:50,000 scale Bhuvan Land Use Land Cover (LULC) 50K multi-temporal satellite data."
  }
];
