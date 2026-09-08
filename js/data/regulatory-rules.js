/**
 * EcoClear India — Regulatory Pre-Screening & Rule Engine
 * Authoritative Indian Environmental Legal & Clearance Framework
 * 
 * Includes full rule versioning schema:
 * - rule_id
 * - name
 * - jurisdiction (Central / State / Concurrent)
 * - authority (MoEFCC, SPCB, CPCB, NBWL, CGWA, PESO, AERB)
 * - source & source_url
 * - effective_date & last_verified
 * - version
 * - conditions (trigger logic)
 * - statutory_action (EIA Category A/B1/B2, Consent, Authorization, NOC)
 * - explanation & cautious non-statutory verification text
 */

export const REGULATORY_RULES = [
  {
    rule_id: "IND-EC-EIA-2006-GEN",
    name: "Environmental Clearance (EC) under EIA Notification 2006",
    category: "Environment Clearance",
    jurisdiction: "Central / State (MoEFCC & SEIAA)",
    authority: "Ministry of Environment, Forest and Climate Change (MoEFCC) & State SEIAA",
    source: "EIA Notification S.O. 1533(E) dated 14th September 2006 & subsequent amendments",
    source_url: "https://parivesh.nic.in",
    effective_date: "2006-09-14",
    last_verified: "2025-12-01",
    version: "2006.v24-Amended",
    conditions: {
      sectors_included: ["steel", "cement", "chemical", "pharmaceutical", "thermal", "mining", "petroleum", "waste", "paper", "nuclear", "electronics"],
      sectors_exempted: ["solar", "wind", "automobile"]
    },
    statutory_action: "Prior Environmental Clearance (Category A or B) via PARIVESH portal",
    explanation: "Mandates prior environmental clearance for 39 designated industrial and infrastructure activities. Projects categorized as 'Category A' undergo appraisal at the Central Expert Appraisal Committee (EAC) in New Delhi; 'Category B' projects are appraised by the respective State Expert Appraisal Committee (SEAC) and SEIAA.",
    cautious_label: "Potentially relevant — verify specific schedule item, capacity threshold, and whether located inside a notified industrial estate on PARIVESH."
  },

  {
    rule_id: "IND-EC-GC-TRIGGER",
    name: "General Conditions (GC) Applicability under EIA Notification 2006",
    category: "Environment Clearance - Category Elevation",
    jurisdiction: "Central (MoEFCC)",
    authority: "MoEFCC Central Expert Appraisal Committee (EAC)",
    source: "EIA Notification 2006 Clause 4(iii) & Notification S.O. 3067(E)",
    source_url: "https://parivesh.nic.in",
    effective_date: "2006-09-14",
    last_verified: "2025-12-01",
    version: "2006.v18",
    conditions: {
      spatial_trigger: "Located within 5 km / 10 km of Protected Area, Interstate boundary, Coastal Regulation Zone, or Critically Polluted Area (CEPI)"
    },
    statutory_action: "Category B project elevated to Category A (Central MoEFCC appraisal required)",
    explanation: "Under the General Conditions (GC) of EIA 2006, any project or activity specified in Category 'B' shall be treated and appraised as Category 'A' if located in whole or in part within: (i) 5 km from Interstate / Union Territory boundary; (ii) 10 km from National Park, Wildlife Sanctuary, or Biosphere Reserve; or (iii) designated Critically Polluted Areas (CEPI).",
    cautious_label: "Location-dependent trigger — verify exact geodesic distance to protected boundaries and interstate borders."
  },

  {
    rule_id: "IND-FOR-FCA-2023",
    name: "Forest Clearance under Van (Sanrakshan Evam Samvardhan) Adhiniyam 2023",
    category: "Forest Clearance",
    jurisdiction: "Central (MoEFCC Forest Advisory Committee)",
    authority: "MoEFCC Regional Offices & Integrated Regional Office (IRO)",
    source: "Van (Sanrakshan Evam Samvardhan) Adhiniyam 2023 (amending Forest Conservation Act 1980)",
    source_url: "https://parivesh.nic.in/forest",
    effective_date: "2023-08-04",
    last_verified: "2025-12-01",
    version: "2023.v1",
    conditions: {
      spatial_trigger: "Requires diversion of any recorded forest, notified forest, or deemed forest land"
    },
    statutory_action: "Two-stage Forest Clearance (Stage-I In-Principle & Stage-II Final Approval) + CAMPA payment",
    explanation: "Mandates prior approval from the Central Government for de-reservation or non-forestry use of recorded forest land. Requires identification of equivalent non-forest land or double degraded forest land for Compensatory Afforestation (CA) and payment of Net Present Value (NPV).",
    cautious_label: "Potentially relevant if project footprint, transmission lines, or water pipelines touch recorded forest compartments."
  },

  {
    rule_id: "IND-WLD-NBWL-1972",
    name: "Wildlife Clearance & Eco-Sensitive Zone (ESZ) Clearance",
    category: "Wildlife Clearance",
    jurisdiction: "Central & State (NBWL / SBWL)",
    authority: "Standing Committee of National Board for Wildlife (SC-NBWL)",
    source: "Wildlife (Protection) Act 1972 (as amended in 2022) & Supreme Court Orders in WP(C) 460/2004",
    source_url: "https://parivesh.nic.in/wildlife",
    effective_date: "2006-12-04",
    last_verified: "2025-12-01",
    version: "2022.v2",
    conditions: {
      spatial_trigger: "Located within a declared Wildlife Protected Area or its designated / default 10 km Eco-Sensitive Zone (ESZ)"
    },
    statutory_action: "Statutory Wildlife Clearance from SC-NBWL chaired by Hon'ble Minister, MoEFCC",
    explanation: "Any industrial project situated within a National Park, Wildlife Sanctuary, or within its designated Eco-Sensitive Zone (or default 10 km boundary where ESZ is pending notification) strictly requires prior recommendation of the Standing Committee of the NBWL before commencement of work.",
    cautious_label: "Statutory restriction — verify whether the site falls inside declared ESZ prohibited/regulated activity lists."
  },

  {
    rule_id: "IND-CRZ-2019",
    name: "Coastal Regulation Zone (CRZ) Clearance",
    category: "CRZ Clearance",
    jurisdiction: "State & Central (SCZMA & NCZMA)",
    authority: "State Coastal Zone Management Authority (SCZMA) & MoEFCC",
    source: "CRZ Notification G.S.R. 37(E) dated 18th January 2019",
    source_url: "https://moef.gov.in/en/division/forest-divisions-2/coastal-regulation-zone-crz/",
    effective_date: "2019-01-18",
    last_verified: "2025-12-01",
    version: "2019.v1",
    conditions: {
      spatial_trigger: "Located within 500m of High Tide Line (HTL) along open sea, or 50m / width of creek/river along tidally influenced waterbodies"
    },
    statutory_action: "CRZ Clearance under CRZ Notification 2019 via SCZMA and MoEFCC",
    explanation: "Regulates developmental activities along India's coastal belt to protect fragile marine ecosystems. Establishes classification into CRZ-I (ecologically sensitive like mangroves, coral reefs), CRZ-II (developed urban areas), CRZ-III (rural areas with No Development Zones), and CRZ-IV (water area). Heavy industries are strictly prohibited in CRZ-I and CRZ-III.",
    cautious_label: "Potentially relevant for coastal sites (e.g. Dahej, Mundra, Paradeep, Haldia) — verify approved Coastal Zone Management Plan (CZMP)."
  },

  {
    rule_id: "IND-POL-CTE-CTO-1974",
    name: "Consent to Establish (CTE) & Consent to Operate (CTO)",
    category: "Air & Water Pollution Consent",
    jurisdiction: "State (State Pollution Control Board / Pollution Control Committee)",
    authority: "State Pollution Control Board (e.g. MPCB, GPCB, KSPCB, TNPCB, OSPCB)",
    source: "Water (Prevention & Control of Pollution) Act 1974 (Sec 25) & Air (Prevention & Control of Pollution) Act 1981 (Sec 21)",
    source_url: "https://cpcb.nic.in",
    effective_date: "1974-03-23",
    last_verified: "2025-12-01",
    version: "1974-81.CPCB-Categorization-2016",
    conditions: {
      sectors_included: ["all_except_white"]
    },
    statutory_action: "Consent to Establish (CTE / NOC) prior to construction; Consent to Operate (CTO) prior to commissioning",
    explanation: "Mandatory statutory consents required from the relevant State Pollution Control Board for all industrial units categorized under CPCB's Red, Orange, or Green categories. White category industries are exempt from CTE/CTO and only require formal intimation.",
    cautious_label: "Mandatory statutory requirement across all Indian states for Red and Orange industries."
  },

  {
    rule_id: "IND-HAZ-WASTE-2016",
    name: "Hazardous & Other Wastes Management Authorization",
    category: "Waste Management Authorization",
    jurisdiction: "State & Central (SPCB / CPCB)",
    authority: "State Pollution Control Board under CPCB supervision",
    source: "Hazardous and Other Wastes (Management and Transboundary Movement) Rules 2016",
    source_url: "https://cpcb.nic.in/hazardous-waste/",
    effective_date: "2016-04-04",
    last_verified: "2025-12-01",
    version: "2016.v3-Amended",
    conditions: {
      sectors_included: ["steel", "cement", "chemical", "pharmaceutical", "textile", "thermal", "mining", "petroleum", "waste", "paper", "automobile", "electronics"]
    },
    statutory_action: "Authorization for Generation, Storage, Packaging, Transportation and Disposal of Hazardous Wastes",
    explanation: "Regulates industries generating hazardous chemical wastes, ETP sludges, spent solvents, and residues listed in Schedule I & II. Requires designated covered storage sheds, manifest tracking, and formal agreement with an authorized Common TSDF / pre-processing cement co-processing plant.",
    cautious_label: "Mandatory authorization for industrial operations generating toxic, corrosive, or reactive waste streams."
  },

  {
    rule_id: "IND-WAT-CGWA-2020",
    name: "Groundwater Abstraction NOC from CGWA",
    category: "Water Abstraction Permission",
    jurisdiction: "Central / State Ground Water Authority",
    authority: "Central Ground Water Authority (CGWA) / State Ground Water Authority",
    source: "CGWA Guidelines for Ground Water Abstraction in India (Notification S.O. 3289(E))",
    source_url: "https://cgwa-noc.gov.in",
    effective_date: "2020-09-24",
    last_verified: "2025-12-01",
    version: "2020.v2",
    conditions: {
      resource_condition: "Projects proposing to abstract groundwater for industrial, commercial, or infrastructure purposes"
    },
    statutory_action: "No Objection Certificate (NOC) for Groundwater Abstraction + Groundwater Abstraction Charges",
    explanation: "Strictly regulates industrial groundwater extraction. Categorizes assessment units into 'Safe', 'Semi-Critical', 'Critical', and 'Over-Exploited'. In 'Over-Exploited' assessment units, NOC is strictly denied to new packaged drinking water and heavy commercial industrial units unless drinking/domestic use only.",
    cautious_label: "Potentially relevant if relying on on-site borewells — verify assessment unit groundwater status."
  },

  {
    rule_id: "IND-SAF-MSIHC-1989",
    name: "Major Accident Hazard (MAH) Compliance under MSIHC Rules 1989",
    category: "Industrial Safety & Hazardous Chemical Storage",
    jurisdiction: "State & Central (Directorate of Industrial Safety & Health - DISH / PESO)",
    authority: "Directorate of Industrial Safety & Health (DISH), Petroleum and Explosives Safety Organisation (PESO)",
    source: "Manufacture, Storage and Import of Hazardous Chemicals Rules 1989 & Chemical Accidents (EPPR) Rules 1996",
    source_url: "https://moef.gov.in",
    effective_date: "1989-11-27",
    last_verified: "2025-12-01",
    version: "1989.v4-Amended",
    conditions: {
      sectors_included: ["chemical", "petroleum", "pharmaceutical", "thermal"]
    },
    statutory_action: "Preparation of Safety Audit, HAZOP Study, On-Site Emergency Plan, and submission to District Crisis Group",
    explanation: "Applies to industrial facilities handling designated toxic, flammable, or explosive chemicals exceeding Schedule 1, 2, or 3 threshold inventories. Mandates formal quantitative risk assessment (QRA), installation of automated emergency isolation systems, and coordination with the District Emergency Plan.",
    cautious_label: "Potentially relevant for chemical/fuel storage units exceeding threshold quantities."
  },

  {
    rule_id: "IND-NUC-AERB-SITING",
    name: "AERB Siting Consents under Atomic Energy Act 1962",
    category: "Nuclear Statutory Siting Clearance",
    jurisdiction: "Central Statutory (Atomic Energy Regulatory Board - AERB)",
    authority: "Atomic Energy Regulatory Board (AERB) & Department of Atomic Energy (DAE)",
    source: "Atomic Energy Act 1962 (Act No. 33 of 1962) & AERB Safety Code on Siting of Nuclear Power Plants (AERB/SC/S)",
    source_url: "https://www.aerb.gov.in",
    effective_date: "1962-09-15",
    last_verified: "2025-12-01",
    version: "AERB/SC/S-Rev.1",
    conditions: {
      sectors_included: ["nuclear"]
    },
    statutory_action: "Multi-stage AERB Regulatory Siting Consent (Site Evaluation Report, SAR, Construction Consent, Operating Licence)",
    explanation: "SPECIAL STATUTORY SITTING REGIME: Nuclear power plants and fuel cycle facilities operate under exclusive central statutory jurisdiction of AERB. Siting involves multi-year investigations covering Seismotectonics, Extreme Meteorological Hazards, Hydrology and Flooding, Aircraft Crash probabilities, Population Distribution, and mandatory Exclusion Zone (~1.0 to 1.6 km) establishment.",
    cautious_label: "SPECIAL STATUTORY REGIME: Cannot be appraised as a conventional industrial site. Requires specialist statutory investigations under AERB/SC/S."
  }
];
