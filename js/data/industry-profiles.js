/**
 * EcoClear India — Industry Environmental Profiles
 * Version: 2026.1 (MoEFCC EIA Notification 2006 & CPCB Industrial Categorization aligned)
 * 
 * Each profile defines:
 * - Specific factor weights (summing to 1.0)
 * - Base sensitivity ratings (0-100 where higher = higher sensitivity/concern)
 * - Dynamic capacity units and typical scales
 * - Sub-sector taxonomies
 * - Statutory mappings (EIA 2006 Schedule Item, CPCB Red/Orange classification)
 */

export const INDUSTRY_PROFILES = {
  steel: {
    id: "steel",
    name: "Steel / Metallurgical Industry",
    icon: "🏭",
    cpcbCategory: "Red",
    eiaScheduleItem: "3(a) Metallurgical industries (ferrous & non-ferrous)",
    defaultCapacity: 500000,
    unit: "tonnes/year",
    allowedUnits: ["tonnes/year", "tonnes/day", "MTPA"],
    subsectors: [
      "Integrated Iron & Steel Plant",
      "Sponge Iron / Direct Reduced Iron (DRI)",
      "Secondary Steel / Induction Furnace & Rolling Mill",
      "Ferro Alloys Manufacturing",
      "Pelletization & Sinter Plant"
    ],
    weights: {
      air: 0.20,
      water: 0.18,
      waste: 0.16,
      energy: 0.12,
      population: 0.12,
      biodiversity: 0.12,
      agriculture: 0.10
    },
    base: {
      air: 88,
      water: 75,
      waste: 82,
      energy: 90,
      population: 70,
      biodiversity: 74,
      agriculture: 68
    },
    keyPollutants: ["PM10", "PM2.5", "SO2", "NOx", "CO", "PAHs", "Heavy Metals (Fe, Mn, Cr)"],
    waterDemandIntensity: "High (2.5 - 4.0 m³/tonne crude steel in modern units)",
    wasteStreams: ["Blast Furnace Slag", "Steel Melting Slag", "Fly Ash", "Mill Scale", "Tar Sludge"],
    mitigationFocus: [
      "High-efficiency Dry Electrostatic Precipitators (ESPs) and Bag Houses",
      "100% Slag utilization in cement manufacturing and road sub-base",
      "Zero Liquid Discharge (ZLD) with RO and Multi-Effect Evaporator (MEE)",
      "Coke Dry Quenching (CDQ) and Top Gas Recovery Turbines (TRT)",
      "Mandatory 33% high-density green belt with native broadleaf species"
    ],
    statutoryNotes: "Category A under EIA 2006 for primary metallurgical units > 20,000 tonnes/year. Requires MoEFCC central appraisal."
  },

  cement: {
    id: "cement",
    name: "Cement Plant",
    icon: "🧱",
    cpcbCategory: "Red",
    eiaScheduleItem: "3(b) Cement plants",
    defaultCapacity: 1200000,
    unit: "tonnes/year",
    allowedUnits: ["tonnes/year", "tonnes/day", "MTPA"],
    subsectors: [
      "Integrated Cement Plant (with captive limestone quarry)",
      "Clinker Grinding Unit (stand-alone)",
      "White Cement Manufacturing",
      "Slag / Pozzolana Blended Cement"
    ],
    weights: {
      air: 0.22,
      waste: 0.16,
      energy: 0.16,
      agriculture: 0.14,
      population: 0.12,
      biodiversity: 0.12,
      water: 0.08
    },
    base: {
      air: 89,
      waste: 78,
      energy: 88,
      agriculture: 72,
      population: 72,
      biodiversity: 75,
      water: 68
    },
    keyPollutants: ["PM10", "PM2.5", "SO2", "NOx", "Fugitive Limestone Dust"],
    waterDemandIntensity: "Moderate (dry process: ~0.15 m³/tonne clinker)",
    wasteStreams: ["Cement Kiln Dust (CKD)", "Reject limestone", "Refractory waste"],
    mitigationFocus: [
      "Bag filters with emission limits < 30 mg/Nm³ at stack",
      "Selective Non-Catalytic Reduction (SNCR) for NOx abatement",
      "Covered sheds and pneumatic conveying for raw material handling",
      "Co-processing of hazardous and municipal waste in cement kilns (AFR)",
      "Quarry progressive rehabilitation and rainwater harvesting recharge pits"
    ],
    statutoryNotes: "Integrated plants with captive limestone mines require simultaneous Mining Plan approval, Wildlife clearance if within 10 km ESZ, and EIA Category A appraisal."
  },

  chemical: {
    id: "chemical",
    name: "Chemical Industry",
    icon: "🧪",
    cpcbCategory: "Red",
    eiaScheduleItem: "5(f) Synthetic organic chemicals industry",
    defaultCapacity: 50000,
    unit: "tonnes/year",
    allowedUnits: ["tonnes/year", "tonnes/day", "KL/day"],
    subsectors: [
      "Synthetic Organic Chemicals (Dyes, Pigments, Resins)",
      "Basic Inorganic Chemicals & Industrial Acids (H2SO4, HCl, HNO3)",
      "Chlor-Alkali & Caustic Soda",
      "Agrochemicals & Technical Pesticides",
      "Specialty & Fine Chemicals"
    ],
    weights: {
      water: 0.20,
      waste: 0.20,
      air: 0.18,
      population: 0.14,
      biodiversity: 0.12,
      agriculture: 0.08,
      energy: 0.08
    },
    base: {
      water: 92,
      waste: 94,
      air: 90,
      population: 78,
      biodiversity: 76,
      agriculture: 70,
      energy: 78
    },
    keyPollutants: ["VOCs", "Chlorinated Solvents", "SO2", "Acid Fumes", "High-TDS/COD Effluent", "Heavy Metals"],
    waterDemandIntensity: "High to Extreme; critical dependence on water quality and discharge assimilation",
    wasteStreams: ["Distillation Residues", "Spent Carbon", "Chemical Sludge from ETP", "Incinerator Ash", "Toxic Mother Liquors"],
    mitigationFocus: [
      "Zero Liquid Discharge (ZLD) plant with MEE and ATFD (Agitated Thin Film Dryer)",
      "Thermal Oxidizer / Regenerative Thermal Oxidizer (RTO) with 99.9% VOC destruction",
      "Dedicated Common Hazardous Waste Treatment, Storage & Disposal Facility (TSDF) tie-up",
      "On-site Quantitative Risk Assessment (QRA) and Hazop-engineered secondary containment",
      "Automated Continuous Emission Monitoring System (OCEMS) connected to CPCB/SPCB server"
    ],
    statutoryNotes: "Category A if located outside notified industrial estates/parks; Category B if located inside MoEFCC-recognized industrial estates."
  },

  pharmaceutical: {
    id: "pharmaceutical",
    name: "Pharmaceutical Industry",
    icon: "💊",
    cpcbCategory: "Red",
    eiaScheduleItem: "5(f) Synthetic organic chemicals (Bulk drugs & intermediates)",
    defaultCapacity: 25000,
    unit: "tonnes/year",
    allowedUnits: ["tonnes/year", "tonnes/day", "KL/day"],
    subsectors: [
      "Active Pharmaceutical Ingredients (API) / Bulk Drugs",
      "Finished Drug Formulations (Tablets, Capsules, Injectables)",
      "Biopharmaceuticals & Vaccines",
      "Fermentation-based Antibiotic Manufacturing"
    ],
    weights: {
      water: 0.22,
      waste: 0.20,
      air: 0.16,
      population: 0.16,
      biodiversity: 0.12,
      agriculture: 0.08,
      energy: 0.06
    },
    base: {
      water: 90,
      waste: 92,
      air: 84,
      population: 76,
      biodiversity: 74,
      agriculture: 68,
      energy: 72
    },
    keyPollutants: ["Active Pharmaceutical Residues (APIs)", "Organic Solvents (DCM, IPA, Methanol, Toluene)", "High COD Effluent", "Odorous Mercaptans"],
    waterDemandIntensity: "High (pure water / WFI generation produces high reject streams)",
    wasteStreams: ["Spent solvents", "Contaminated packaging", "Biological sludge", "Expired formulations", "Incineration residue"],
    mitigationFocus: [
      "Closed-loop Solvent Recovery Systems (>95% recovery rate)",
      "Dedicated advanced oxidation processes (Ozone/UV/Fenton) for antibiotic residue destruction",
      "ZLD facility with biological ETP followed by RO and MEE",
      "Solvent vapor extraction with nitrogen-blanketed condenser loops",
      "Bio-medical Waste Authorization compliance under BMWM Rules 2016"
    ],
    statutoryNotes: "Bulk drug API manufacturing units require prior Environmental Clearance. Standalone formulation units without API synthesis are typically exempted from EC but require SPCB CTE/CTO."
  },

  textile: {
    id: "textile",
    name: "Textile & Dyeing Industry",
    icon: "🧵",
    cpcbCategory: "Red",
    eiaScheduleItem: "5(d) Manmade fibers / Dyeing & Finishing",
    defaultCapacity: 100000,
    unit: "metres/day",
    allowedUnits: ["metres/day", "tonnes/day", "KL/day"],
    subsectors: [
      "Textile Dyeing, Printing & Wet Processing",
      "Synthetic Fiber & Polymer Spinning",
      "Composite Textile Mill (Spinning, Weaving & Processing)",
      "Denim Manufacturing & Garment Washing",
      "Cotton Ginning & Spinning (Dry process)"
    ],
    weights: {
      water: 0.26,
      waste: 0.18,
      population: 0.16,
      agriculture: 0.14,
      energy: 0.12,
      biodiversity: 0.10,
      air: 0.04
    },
    base: {
      water: 92,
      waste: 86,
      population: 76,
      agriculture: 80,
      energy: 74,
      biodiversity: 72,
      air: 62
    },
    keyPollutants: ["Azo Dyes", "Heavy Metals (Cr, Cu, Zn)", "High TDS & Salinity", "Surfactants", "Chlorine / Bleaching agents"],
    waterDemandIntensity: "Very High (80 - 150 litres per kg of finished fabric)",
    wasteStreams: ["Chemical ETP Sludge", "Salt cake from MEE", "Fibre lint", "Container drums"],
    mitigationFocus: [
      "Mandatory Zero Liquid Discharge (ZLD) with salt recovery and brine reuse",
      "Adoption of eco-friendly low-salt enzymatic dyeing technologies",
      "Color removal using biological membrane bioreactors (MBR) and activated carbon",
      "Rooftop solar and biomass boiler cogeneration for thermal demand",
      "Safe containment of hazardous sludge in authorized TSDF landfill"
    ],
    statutoryNotes: "Wet processing units in water-stressed basins (e.g. Noyyal, Bhavani, Bandi, Luni) are subject to strict High Court and NGT ZLD directives."
  },

  food: {
    id: "food",
    name: "Food & Agro Processing Industry",
    icon: "🥫",
    cpcbCategory: "Orange",
    eiaScheduleItem: "5(j) Sugar Industry / Distilleries / Food Parks",
    defaultCapacity: 2000,
    unit: "tonnes/day",
    allowedUnits: ["tonnes/day", "KL/day", "tonnes/year"],
    subsectors: [
      "Sugar Mills & Molasses Distilleries",
      "Dairy Products & Milk Processing",
      "Edible Oil Refining & Solvent Extraction",
      "Grain Milling, Starch & Bakery",
      "Meat & Poultry Processing / Cold Chain",
      "Fruit & Vegetable Canning / Beverages"
    ],
    weights: {
      water: 0.22,
      waste: 0.18,
      agriculture: 0.18,
      population: 0.16,
      biodiversity: 0.12,
      energy: 0.10,
      air: 0.04
    },
    base: {
      water: 82,
      waste: 78,
      agriculture: 76,
      population: 78,
      biodiversity: 70,
      energy: 68,
      air: 55
    },
    keyPollutants: ["High BOD", "High COD", "Suspended Solids", "Fats, Oils & Grease (FOG)", "Odor from fermentation & anaerobic decay"],
    waterDemandIntensity: "Moderate to High; severe biodegradable organic effluent load",
    wasteStreams: ["Bagasse", "Press mud", "Spent wash", "Organic sludge", "Bone meal/offal", "Effluent grease"],
    mitigationFocus: [
      "Anaerobic Biomethanation Digesters (UASB) generating biogas for captive power",
      "Continuous condensate polishing units (CPU) for total boiler feed recycling",
      "Bio-composting with press mud for organic fertilizer production",
      "Odor control biofilters at wastewater pretreatment and rendering zones",
      "FSSAI and groundwater abstraction clearance from Central Ground Water Authority (CGWA)"
    ],
    statutoryNotes: "Sugar mills (>5,000 TCD) and molasses-based distilleries require prior MoEFCC Environmental Clearance. Grain-based ethanol distilleries have specific fast-track provisions."
  },

  thermal: {
    id: "thermal",
    name: "Thermal Power Plant (Coal / Gas)",
    icon: "⚡",
    cpcbCategory: "Red",
    eiaScheduleItem: "1(d) Thermal Power Plants",
    defaultCapacity: 1320,
    unit: "MW",
    allowedUnits: ["MW", "tonnes/day coal"],
    subsectors: [
      "Supercritical Pulverized Coal Power Plant",
      "Ultra-Supercritical Coal Power Station",
      "Combined Cycle Gas Turbine (CCGT)",
      "Lignite-based Power Plant",
      "Biomass & Captive Cogeneration Power"
    ],
    weights: {
      air: 0.24,
      water: 0.20,
      waste: 0.18,
      energy: 0.14,
      population: 0.12,
      biodiversity: 0.08,
      agriculture: 0.04
    },
    base: {
      air: 94,
      water: 90,
      waste: 92,
      energy: 94,
      population: 74,
      biodiversity: 75,
      agriculture: 66
    },
    keyPollutants: ["PM2.5", "PM10", "SO2", "NOx", "Mercury (Hg)", "CO2", "Fly Ash"],
    waterDemandIntensity: "High (wet cooling requires 3.0 m³/MWh; dry cooling ~0.7 m³/MWh)",
    wasteStreams: ["Fly Ash", "Bottom Ash", "FGD Gypsum", "Boiler Blowdown", "Cooling Tower Drift"],
    mitigationFocus: [
      "Flue Gas Desulfurization (FGD) systems for SO2 removal (>95% efficiency)",
      "Low-NOx burners and Selective Catalytic Reduction (SCR) for NOx compliance",
      "100% Fly Ash utilization in cement, bricks, and highway embankments (MoEFCC 2021 Notification)",
      "Closed-cycle cooling towers with cycle of concentration (COC) > 5.0",
      "High-concentration slurry disposal (HCSD) or dry ash handling systems"
    ],
    statutoryNotes: "Category A under EIA 2006 for coal plants ≥ 500 MW (and all coal plants regardless of capacity outside designated industrial estates). Strict siting norms apply: >1 km from major rivers, outside urban airsheds."
  },

  solar: {
    id: "solar",
    name: "Solar Power Project (Utility Scale)",
    icon: "☀️",
    cpcbCategory: "White",
    eiaScheduleItem: "Exempted from EIA Notification 2006 (requires state consent/land conversion)",
    defaultCapacity: 250,
    unit: "MW",
    allowedUnits: ["MW", "hectares"],
    subsectors: [
      "Ground-mounted Photovoltaic (PV) Solar Park",
      "Floating Solar PV on Reservoirs/Waterbodies",
      "Agro-photovoltaic (Agri-PV) dual-use system",
      "Concentrated Solar Power (CSP) with thermal storage"
    ],
    weights: {
      agriculture: 0.26,
      biodiversity: 0.20,
      water: 0.16,
      energy: 0.14,
      waste: 0.10,
      population: 0.08,
      air: 0.06
    },
    base: {
      agriculture: 68,
      biodiversity: 65,
      water: 45,
      energy: 25,
      waste: 40,
      population: 35,
      air: 15
    },
    keyPollutants: ["End-of-life solar module components (Lead, Cadmium Telluride, Silicon)", "Dust during civil grading"],
    waterDemandIntensity: "Low during operation (panel washing requires 1.5 - 3.0 L/module/cycle or robotic waterless cleaning)",
    wasteStreams: ["Damaged PV modules", "Inverter scrap", "Packaging crates", "Battery energy storage residues"],
    mitigationFocus: [
      "Robotic dry-cleaning systems to eliminate groundwater depletion in arid regions (e.g. Rajasthan, Gujarat)",
      "Strict avoidance of prime multi-crop irrigated agricultural land",
      "Ecological corridors and bird diverters on transmission evacuation lines (critical in Great Indian Bustard habitat)",
      "EPR (Extended Producer Responsibility) tie-up under E-Waste Management Rules 2022 for module recycling",
      "Surface stormwater percolation trenches and native soil stabilization"
    ],
    statutoryNotes: "Classified as 'White Category' by CPCB. Exempt from EIA Notification 2006, but transmission lines require Forest/Wildlife clearance if crossing reserve forests or Eco-Sensitive Zones (Supreme Court GIB mandate)."
  },

  wind: {
    id: "wind",
    name: "Wind Energy Project (Onshore)",
    icon: "💨",
    cpcbCategory: "White",
    eiaScheduleItem: "Exempted from EIA Notification 2006 (requires state permissions/forest clearance)",
    defaultCapacity: 150,
    unit: "MW",
    allowedUnits: ["MW", "Turbines count"],
    subsectors: [
      "Onshore Wind Farm (Ridgeline / Plateau)",
      "Wind-Solar Hybrid Park",
      "Repowering of existing low-capacity wind assets",
      "Coastal Wind Power Array"
    ],
    weights: {
      biodiversity: 0.30,
      population: 0.18,
      agriculture: 0.16,
      energy: 0.14,
      waste: 0.10,
      air: 0.06,
      water: 0.06
    },
    base: {
      biodiversity: 76,
      population: 58,
      agriculture: 55,
      energy: 25,
      waste: 35,
      air: 15,
      water: 15
    },
    keyPollutants: ["Acoustic emissions (Low-frequency noise)", "Shadow flicker", "Blade microplastics during weathering"],
    waterDemandIntensity: "Minimal (domestic use and substation maintenance only)",
    wasteStreams: ["Decommissioned composite fiberglass blades", "Spent transformer oil", "Grease and gear lubricants"],
    mitigationFocus: [
      "Bat and bird acoustic monitoring and radar-activated turbine curtailment during peak migration",
      "Undergrounding of power evacuation cables in protected avian corridors (Supreme Court GIB orders)",
      "Setback buffer of minimum 500m from human settlements to mitigate shadow flicker and aerodynamic noise",
      "Soil erosion control on steep ridge access roads and turbine pad grading",
      "Composite blade circular recycling / co-processing partnership"
    ],
    statutoryNotes: "Exempt from Environmental Clearance, but projects in forest land require Stage I/II Forest Clearance under Van (Sanrakshan Evam Samvardhan) Adhiniyam 2023."
  },

  mining: {
    id: "mining",
    name: "Mining of Minerals & Coal",
    icon: "⛏️",
    cpcbCategory: "Red",
    eiaScheduleItem: "1(a) Mining of minerals",
    defaultCapacity: 2000000,
    unit: "tonnes/year",
    allowedUnits: ["tonnes/year", "MTPA", "hectares lease area"],
    subsectors: [
      "Opencast Coal Mining",
      "Underground Coal Mining",
      "Iron Ore Mining & Beneficiation",
      "Bauxite Mining (Laterite capping)",
      "Limestone & Dolomite Quarrying",
      "Sand Mining & Minor Minerals"
    ],
    weights: {
      biodiversity: 0.22,
      forest: 0.20,
      water: 0.18,
      agriculture: 0.16,
      population: 0.12,
      air: 0.08,
      waste: 0.04
    },
    base: {
      biodiversity: 92,
      forest: 94,
      water: 88,
      agriculture: 85,
      population: 80,
      air: 86,
      waste: 82
    },
    keyPollutants: ["PM10 & Fugitive Mineral Dust", "Acid Mine Drainage (AMD)", "Heavy Metal Leaching", "Ground Vibration & Flyrock from Blasting"],
    waterDemandIntensity: "High for mineral beneficiation; severe impact on regional water table drawdown due to mine pit dewatering",
    wasteStreams: ["Overburden (OB) dumps", "Tailings slurry", "Slime rejects", "Mine pit water"],
    mitigationFocus: [
      "Concurrent backfilling and biological reclamation of overburden dumps",
      "Lined garland drains and siltation settling ponds with oil & grease traps",
      "Deep-hole controlled blasting using electronic detonators to limit peak particle velocity (PPV)",
      "Continuous mist dust suppression systems on haul roads and conveyor networks",
      "Groundwater replenishment through external artificial recharge structures"
    ],
    statutoryNotes: "Category A if mining lease area > 100 hectares (or > 50 hectares for coal); Category B for 5 to 100 hectares. Mandatory public hearing and approved Mine Closure Plan by IBM / Ministry of Coal."
  },

  petroleum: {
    id: "petroleum",
    name: "Petroleum Refining & Petrochemicals",
    icon: "🛢️",
    cpcbCategory: "Red",
    eiaScheduleItem: "4(a) Petroleum refining industry / 5(c) Petrochemicals",
    defaultCapacity: 6000000,
    unit: "tonnes/year",
    allowedUnits: ["tonnes/year", "MMTPA", "barrels/day"],
    subsectors: [
      "Integrated Petroleum Refinery",
      "Naphtha / Cracker Petrochemical Complex",
      "Lube Oil Blending & Base Oil Refinery",
      "Petroleum Storage Terminals & Coastal Depots"
    ],
    weights: {
      air: 0.22,
      water: 0.18,
      waste: 0.18,
      population: 0.16,
      biodiversity: 0.10,
      energy: 0.10,
      agriculture: 0.06
    },
    base: {
      air: 95,
      water: 92,
      waste: 90,
      population: 84,
      biodiversity: 78,
      energy: 92,
      agriculture: 68
    },
    keyPollutants: ["VOCs (Benzene, Toluene, Xylene)", "SO2", "NOx", "H2S", "Oily Sludge", "Phenols", "Polycyclic Aromatics"],
    waterDemandIntensity: "High (desalting, cooling, and high-pressure steam generation)",
    wasteStreams: ["Oily Tank Bottom Sludge", "Spent Catalysts containing heavy metals", "Spent Caustic", "Biological ETP Sludge"],
    mitigationFocus: [
      "Sulfur Recovery Units (SRU) with Claus process achieving >99.9% sulfur recovery",
      "LDAR (Leak Detection and Repair) programs using Optical Gas Imaging cameras",
      "Bio-remediation and mechanical recovery of oily sludge using centrifuges",
      "Tertiary wastewater treatment with RO, activated carbon, and double-pass ozonation",
      "Comprehensive Disaster Management Plan (DMP) and automated Deluge Foam fire protection"
    ],
    statutoryNotes: "Category A under EIA 2006. Mandatory clearance from PESO (Petroleum and Explosives Safety Organisation) and Coastal Regulation Zone (CRZ) clearance if near shoreline."
  },

  waste: {
    id: "waste",
    name: "Waste Processing & Management",
    icon: "♻️",
    cpcbCategory: "Red",
    eiaScheduleItem: "7(d) Common Hazardous Waste TSDF / 7(i) Waste to Energy",
    defaultCapacity: 500,
    unit: "tonnes/day",
    allowedUnits: ["tonnes/day", "tonnes/year"],
    subsectors: [
      "Common Hazardous Waste TSDF (Secured Landfill & Incineration)",
      "Common Bio-Medical Waste Treatment Facility (CBWTF)",
      "Municipal Solid Waste (MSW) Waste-to-Energy (WtE) Plant",
      "Common Effluent Treatment Plant (CETP)",
      "E-Waste Dismantling & End-of-Life Vehicle Scrapping"
    ],
    weights: {
      water: 0.22,
      waste: 0.20,
      population: 0.20,
      air: 0.16,
      biodiversity: 0.10,
      agriculture: 0.08,
      energy: 0.04
    },
    base: {
      water: 92,
      waste: 94,
      population: 86,
      air: 86,
      biodiversity: 72,
      agriculture: 72,
      energy: 65
    },
    keyPollutants: ["Toxic Leachate (Heavy metals, Organics)", "Dioxins & Furans", "Odor (H2S, NH3)", "Mercury & Lead", "Bio-aerosols"],
    waterDemandIntensity: "Low process water consumption; extreme risk of leachate generation into groundwater",
    wasteStreams: ["Incinerator bottom and fly ash", "Leachate concentrate", "Slag", "Non-recyclable residues"],
    mitigationFocus: [
      "Double composite geo-membrane lining (1.5mm HDPE + compacted clay) with leachate collection",
      "High-temperature dual-chamber incineration (>1100°C) with 2-second residence time for dioxin destruction",
      "Dedicated Leachate Evaporation and advanced RO treatment units",
      "Bio-filters and negative-pressure odor management systems in storage sheds",
      "Dedicated multi-well upstream and downstream groundwater monitoring network"
    ],
    statutoryNotes: "Common TSDF and CBWTF require Category A/B prior Environmental Clearance under Schedule 7(d)/7(da) and explicit authorization under specific waste management rules."
  },

  paper: {
    id: "paper",
    name: "Pulp & Paper Manufacturing",
    icon: "📄",
    cpcbCategory: "Red",
    eiaScheduleItem: "5(i) Pulp & paper industry",
    defaultCapacity: 150000,
    unit: "tonnes/year",
    allowedUnits: ["tonnes/year", "tonnes/day"],
    subsectors: [
      "Integrated Pulp & Paper Mill (Chemical Wood/Bamboo Pulping)",
      "Agro-residue based Pulp & Paper Mill (Bagasse/Straw)",
      "Recycled Waste-paper De-inking & Board Mill",
      "Specialty Tissue & Security Paper Mill"
    ],
    weights: {
      water: 0.26,
      waste: 0.18,
      air: 0.16,
      forest: 0.16,
      population: 0.12,
      energy: 0.08,
      biodiversity: 0.04
    },
    base: {
      water: 94,
      waste: 88,
      air: 86,
      forest: 84,
      population: 74,
      energy: 82,
      biodiversity: 70
    },
    keyPollutants: ["Black Liquor Organics", "Chlorinated Phenols / AOX", "Sulfides & Methyl Mercaptans", "Color & Lignin", "SO2"],
    waterDemandIntensity: "Extreme (chemical pulp: 35 - 50 m³/tonne paper; recycled: 10 - 15 m³/tonne)",
    wasteStreams: ["Effluent Primary & Secondary Sludge", "Lime Mud", "Boiler Ash", "Plastic & Ragger rejects"],
    mitigationFocus: [
      "Elemental Chlorine Free (ECF) or Total Chlorine Free (TCF) bleaching technology",
      "Chemical Recovery Boiler with 98% caustic soda recovery from black liquor",
      "High-rate anaerobic digestion of high-COD wastewater with methane capture",
      "Extended aeration biological treatment followed by ultrafiltration and color removal",
      "100% farm forestry and captive social plantation raw material sourcing"
    ],
    statutoryNotes: "Mills with capacity ≥ 50 tonnes/day require Category A MoEFCC clearance. Strictest CPCB charter limits apply to effluent discharge into Ganga and river basins."
  },

  automobile: {
    id: "automobile",
    name: "Automobile & Component Manufacturing",
    icon: "🚗",
    cpcbCategory: "Orange",
    eiaScheduleItem: "Typically exempt from EIA Notification 2006 unless large paint shop/foundry included",
    defaultCapacity: 300000,
    unit: "vehicles/year",
    allowedUnits: ["vehicles/year", "units/month"],
    subsectors: [
      "Integrated Passenger Car / Commercial Vehicle Assembly",
      "Two-Wheeler & Three-Wheeler Manufacturing",
      "Automotive Paint Shops & Electrocoating (CED)",
      "Automotive Engine Foundries & Machining",
      "Electric Vehicle (EV) Powertrain & Battery Assembly"
    ],
    weights: {
      water: 0.18,
      waste: 0.18,
      air: 0.18,
      energy: 0.16,
      population: 0.14,
      biodiversity: 0.10,
      agriculture: 0.06
    },
    base: {
      water: 78,
      waste: 78,
      air: 80,
      energy: 82,
      population: 70,
      biodiversity: 65,
      agriculture: 60
    },
    keyPollutants: ["VOCs from Primer, Basecoat & Clearcoat paint booths", "Phosphating Sludge containing heavy metals", "Oily Coolants", "Baking oven exhaust"],
    waterDemandIntensity: "Moderate (paint shop washing, cooling, pre-treatment)",
    wasteStreams: ["Paint sludge", "Phosphating chemical sludge", "Scrap metal", "Used cutting fluids", "Cardboard & plastic dunnage"],
    mitigationFocus: [
      "Waterborne paint formulations and automated robotic electrostatic bells",
      "Thermal oxidizers with heat recovery on paint curing baking ovens",
      "Zero Liquid Discharge (ZLD) with vacuum distillation for paint wastewater",
      "Closed-loop coolant filtration and oil centrifuging systems",
      "Rooftop solar carports and green logistics supply-chain integration"
    ],
    statutoryNotes: "Assembly plants are generally Orange category requiring SPCB CTE/CTO. If an in-house casting foundry (>20,000 TPA) or electroplating unit is present, specific EIA clearances may trigger."
  },

  electronics: {
    id: "electronics",
    name: "Electronics & Semiconductor Manufacturing",
    icon: "💻",
    cpcbCategory: "Orange",
    eiaScheduleItem: "Semiconductor wafer fabrication falls under Category A; PCB/Assembly Orange/Red",
    defaultCapacity: 5000000,
    unit: "units/year",
    allowedUnits: ["units/year", "wafers/month"],
    subsectors: [
      "Semiconductor Wafer Fabrication (Fab)",
      "Printed Circuit Board (PCB) Fabrication & Etching",
      "Electronic Assembly & SMT (Surface Mount Technology)",
      "Solar Cell & Photovoltaic Ingot Manufacturing",
      "Lithium-ion Battery Cell Manufacturing"
    ],
    weights: {
      water: 0.24,
      waste: 0.22,
      air: 0.16,
      population: 0.14,
      energy: 0.14,
      biodiversity: 0.06,
      agriculture: 0.04
    },
    base: {
      water: 88,
      waste: 90,
      air: 82,
      population: 72,
      energy: 86,
      biodiversity: 68,
      agriculture: 62
    },
    keyPollutants: ["Hydrofluoric Acid (HF) fumes", "Toxic Trace Metals (Copper, Lead, Arsenic, Gallium)", "Solvent VOCs (NMP, Acetone)", "Acid/Base etching fumes"],
    waterDemandIntensity: "Extreme for wafer fabs (requires millions of liters of Ultrapure Water / UPW daily)",
    wasteStreams: ["Calcium fluoride sludge", "Heavy metal etching bath concentrates", "Spent solvents", "E-waste off-cuts"],
    mitigationFocus: [
      "Dedicated multi-stream segregation: Acid/Base, Fluoride, Heavy Metals, Solvent lines",
      "Fluoride precipitation using calcium chloride to < 2 mg/L",
      "High-recovery UPW reverse osmosis with >85% internal water reuse",
      "Wet acid gas scrubbers and VOC rotor concentrators for cleanroom exhaust",
      "E-Waste Management Rules 2022 authorization with authorized recyclers"
    ],
    statutoryNotes: "Semiconductor fabs require central MoEFCC environmental clearance and massive reliable grid power and water infrastructure commitments."
  },

  nuclear: {
    id: "nuclear",
    name: "Nuclear / Atomic Energy Project",
    icon: "☢️",
    cpcbCategory: "Red",
    eiaScheduleItem: "1(e) Nuclear power projects and processing of nuclear fuel",
    defaultCapacity: 1400,
    unit: "MW",
    allowedUnits: ["MW", "MWe"],
    subsectors: [
      "Pressurized Heavy Water Reactor (PHWR) Power Station",
      "Light Water Reactor (LWR) Power Plant",
      "Fast Breeder Reactor (FBR)",
      "Nuclear Fuel Fabrication Facility",
      "Heavy Water Production Plant",
      "Spent Fuel Storage & Reprocessing Facility"
    ],
    weights: {
      population: 0.25,
      water: 0.20,
      waste: 0.16,
      biodiversity: 0.14,
      safety: 0.15,
      energy: 0.05,
      air: 0.05
    },
    base: {
      population: 94,
      water: 92,
      waste: 95,
      biodiversity: 82,
      safety: 96,
      energy: 90,
      air: 60
    },
    keyPollutants: ["Low-level radioactive gaseous effluents (Noble gases, Tritium, Iodine-131, C-14)", "Thermal discharge plume", "Conditioned solid radwaste"],
    waterDemandIntensity: "Extreme (condenser cooling demands massive, uninterrupted heat sink — coastal or large perennial reservoir)",
    wasteStreams: ["Spent nuclear fuel (closed fuel cycle managed by DAE)", "Low & intermediate level solid radwaste", "Cooling tower blowdown"],
    mitigationFocus: [
      "Multi-barrier containment: double-walled pre-stressed concrete reactor building",
      "Strict compliance with AERB Code on Siting of Nuclear Power Plants (AERB/SC/S)",
      "Establishment of statutory Exclusion Zone (~1.0 to 1.6 km) under administrative control",
      "Sterilized Zone (~5 km) where population growth is monitored and regulated",
      "Emergency Planning Zones (On-site 1.6km, Off-site 16km) with tested disaster evacuation protocols",
      "Near-surface disposal facilities (NSDF) with engineered multi-barrier vaults for low-level radwaste"
    ],
    statutoryNotes: "SPECIAL STATUTORY REGIME: Siting is governed directly by the Atomic Energy Regulatory Board (AERB) under the Atomic Energy Act 1962, plus Category A MoEFCC Environmental Clearance. Siting requires specialist geological, seismotectonic (Zone III or below preferred), hydrological, and demographic clearance."
  }
};

export const INDUSTRY_KEYS = Object.keys(INDUSTRY_PROFILES);

export const FACTOR_LABELS = {
  air: "Air Pollution & Emissions",
  water: "Water Demand & Hydrology",
  waste: "Waste & Hazardous Residues",
  energy: "Energy Intensity & Carbon",
  population: "Population & Settlement Proximity",
  biodiversity: "Biodiversity & Ecology",
  agriculture: "Agriculture & Land Use Conflict",
  forest: "Forest Cover & Ecosystem Loss",
  safety: "Nuclear Safety & Emergency Planning"
};
