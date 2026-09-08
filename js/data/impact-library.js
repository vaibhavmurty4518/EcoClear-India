/**
 * EcoClear India — Environmental Impact Knowledge Library
 * 12 Core Environmental & Socio-Economic Impact Domains
 * 
 * Provides rigorous, non-deterministic explanatory models:
 * - Why the risk factor triggers
 * - What potential causes exist
 * - Potential environmental harms
 * - Human health & community exposure pathways
 * - Actionable statutory mitigation strategies
 * - Specialist assessment requirements
 */

export const IMPACT_DOMAINS = {
  air: {
    id: "air",
    title: "Air Quality & Atmospheric Emissions",
    icon: "💨",
    pollutants: ["PM10", "PM2.5", "SO2", "NOx", "CO", "VOCs (Benzene, Toluene, Formaldehyde)", "Acid Mists", "PAHs"],
    description: "Evaluates potential atmospheric loading, stack emissions, fugitive dust, and downwind dispersion into local airsheds.",
    potentialCauses: [
      "Combustion of fossil fuels (coal, furnace oil, natural gas, biomass) in captive boilers and furnaces",
      "Process off-gases, catalytic cracking, smelter smelting, and chemical synthesis reactions",
      "Fugitive dust generation during bulk material handling, crushing, screening, and raw material stockpiles",
      "Vehicular exhaust emissions from heavy truck traffic transporting raw inputs and finished goods"
    ],
    environmentalHarm: [
      "Acid deposition (acid rain) potentially affecting nearby soil pH, surface freshwater bodies, and vegetation foliage",
      "Impairment of regional visibility and particulate loading contributing to photochemical smog formation",
      "Deposition of toxic heavy metals and particulates on plant canopies, inhibiting photosynthesis and crop yields"
    ],
    communityPathways: [
      "Potential inhalation exposure to fine respirable particulates (PM2.5) that penetrate deep into alveolar lung tissues",
      "Potential respiratory irritation, aggravation of asthma, and chronic bronchitis from prolonged ambient SO2 and NOx exposure",
      "Potential chronic carcinogenicity or neurotoxicity risks linked to ambient VOC or polycyclic aromatic hydrocarbon (PAH) vapors"
    ],
    mitigationMeasures: [
      "Installation of High-Efficiency Electrostatic Precipitators (ESPs) or Pulse-Jet Bag Houses achieving <30 mg/Nm³",
      "Flue Gas Desulfurization (FGD) wet/dry lime scrubbers for SO2 abatement with >95% operational removal efficiency",
      "Low-NOx combustion burners combined with Selective Catalytic Reduction (SCR) or Selective Non-Catalytic Reduction (SNCR)",
      "Continuous Ambient Air Quality Monitoring Stations (CAAQMS) and Online Continuous Emission Monitoring (OCEMS) with CPCB data uplink",
      "Mandatory minimum 33% high-density multi-tiered green belt along project perimeter using dust-attenuating native tree species"
    ],
    specialistStudies: [
      "AERMOD or CALPUFF mathematical atmospheric dispersion modeling covering minimum 10 km radius impact zone",
      "Baseline seasonal micrometeorological and ambient air quality baseline surveillance (minimum one complete non-monsoon season)"
    ]
  },

  water: {
    id: "water",
    title: "Water Resources, Hydrology & Effluent",
    icon: "💧",
    pollutants: ["BOD", "COD", "Total Dissolved Solids (TDS)", "Heavy Metals", "Phenolics", "Oils & Grease", "Thermal Effluent"],
    description: "Evaluates industrial raw water abstraction stress on local aquifers/rivers, wastewater effluent toxicity, and discharge risks.",
    potentialCauses: [
      "Direct discharge or accidental bypass of treated or untreated industrial trade effluent into surface drains",
      "High volume freshwater abstraction from groundwater aquifers or surface reservoirs causing local drawdown",
      "Thermal discharge plumes from once-through condenser cooling systems entering aquatic ecosystems",
      "Runoff from contaminated process pads, raw material yards, and uncovered hazardous waste handling areas during monsoons"
    ],
    environmentalHarm: [
      "Severe biological oxygen depletion in receiving streams, potentially causing widespread aquatic fauna die-offs",
      "Elevated salinity, sodium adsorption ratios (SAR), and chloride concentrations altering aquatic and riparian community structures",
      "Long-term bioaccumulation of refractory toxic organic contaminants and heavy metals in benthic organisms and food webs"
    ],
    communityPathways: [
      "Potential ingress of contaminated leachate or industrial contaminants into drinking water wells and community water supply intakes",
      "Potential competition with surrounding agrarian villages and municipalities for limited groundwater reserves in semi-arid basins",
      "Potential exposure through consumption of bioaccumulative fish or crops irrigated with contaminated surface stream water"
    ],
    mitigationMeasures: [
      "Implementation of Zero Liquid Discharge (ZLD) systems comprising primary/secondary treatment, Reverse Osmosis, and Multi-Effect Evaporators",
      "Segregation of industrial effluent into high-TDS, high-COD, toxic, and domestic streams for dedicated specialized pre-treatment",
      "Closed-loop recirculating cooling water systems with high cycles of concentration (COC ≥ 5.0) to minimize makeup water demand",
      "Impervious concreted process floors with perimeter dykes and dedicated first-flush storm water retention and treatment ponds",
      "Central Ground Water Authority (CGWA) compliant artificial recharge structures outside the contaminated footprint"
    ],
    specialistStudies: [
      "Comprehensive Hydrogeological & Aquifer Vulnerability Assessment including pumping yield tests and groundwater flow modeling",
      "Water audit, pinch analysis, and mass balance study certified by an accredited environmental institution"
    ]
  },

  land: {
    id: "land",
    title: "Soil Quality, Geology & Land Degradation",
    icon: "🏜️",
    pollutants: ["Trace Metals", "Solvents", "Petroleum Hydrocarbons", "Acids/Alkalis", "Persistent Organic Pollutants"],
    description: "Evaluates physical landscape transformation, soil erosion, topsoil loss, chemical spills, and geological terrain stability.",
    potentialCauses: [
      "Extensive cut-and-fill earthworks, grading, and compaction during construction phase stripping topsoil",
      "Seepage from unlined effluent collection pits, pipe leaks, or chemical storage secondary containment failures",
      "Surface deposition of acidic or alkaline airborne particulate plumes settling onto surrounding agricultural topsoils",
      "Disposal or storage of industrial solid residues and slag on unlined open land"
    ],
    environmentalHarm: [
      "Permanent loss of fertile, humus-rich agricultural topsoil and destruction of microbial soil ecosystems",
      "Soil acidification, salinization, or sodification impairing vegetative regeneration and natural nutrient cycling",
      "Accelerated sheet, rill, and gully erosion during intense monsoonal precipitation events leading to siltation of waterways"
    ],
    communityPathways: [
      "Potential reduction in crop productivity and long-term economic yield on adjacent agricultural farmlands",
      "Potential direct dermal exposure of agricultural workers or grazing livestock to chemically contaminated surface soils",
      "Potential dust entrainment during dry, windy seasons causing nuisance and ocular irritation in nearby settlements"
    ],
    mitigationMeasures: [
      "Mandatory stripping, careful segregation, and biological stockpiling of all fertile topsoil for subsequent landscaping reuse",
      "Concreting and acid/alkali-resistant lining of all chemical unloading bays, process floors, and hazardous storage warehouses",
      "Comprehensive stormwater drainage design featuring siltation traps, check dams, and oil-water interceptors before discharge",
      "Periodic accredited third-party soil core sampling and multi-element toxicological laboratory analysis"
    ],
    specialistStudies: [
      "Detailed geotechnical soil mechanics investigation and seismic vulnerability assessment (IS 1893 compliance)",
      "Baseline soil chemistry profiling for micronutrients, heavy metals, and baseline organic matter"
    ]
  },

  biodiversity: {
    id: "biodiversity",
    title: "Biodiversity & Ecological Integrity",
    icon: "🌱",
    pollutants: ["Chemical run-off", "Habitat alteration", "Invasive flora introduction", "Artificial night lighting"],
    description: "Screens for potential fragmentation of ecosystems, threat to Schedule-I endemic species, and ecological sensitivity.",
    potentialCauses: [
      "Conversion of natural scrublands, wetlands, grasslands, or scrub forests into built industrial footprint",
      "Nighttime light pollution, artificial flare illumination, and continuous operational acoustic emissions",
      "Alteration of local microclimates and surface hydrological drainage patterns supporting wetland ecosystems",
      "Accidental release of process chemicals or saline effluent into adjacent terrestrial and aquatic habitats"
    ],
    environmentalHarm: [
      "Irreversible loss of natural habitat niches for local endemic flora, reptiles, amphibians, and avian species",
      "Disruption of pollination cycles, nocturnal insect populations, and avian roosting patterns due to intense artificial lighting",
      "Introduction and colonization of invasive alien weed species (e.g. Prosopis juliflora, Lantana camara) on disturbed cleared terrain"
    ],
    communityPathways: [
      "Potential loss of traditional ecosystem services (natural pollination, wild medicinal herb gathering, minor forest produce)",
      "Potential destabilization of natural pest-predator ecological balances leading to agricultural pest outbreaks"
    ],
    mitigationMeasures: [
      "Site layout optimization specifically designed to preserve existing mature native trees, water bodies, and rocky outcrops",
      "Deployment of dark-sky compliant, downward-shielded amber LED lighting to minimize nocturnal insect and avian disorientation",
      "Establishment of ecological stepping-stone corridors within the green belt using indigenous floral species (minimum 3 tiers)",
      "Compensatory biodiversity plantation plan in coordination with the State Forest and Biodiversity Board"
    ],
    specialistStudies: [
      "Comprehensive seasonal Terrestrial & Aquatic Biodiversity Assessment covering core and buffer zones by accredited ecologists",
      "Conservation Action Plan for any Wildlife Protection Act Schedule-I floral or faunal species detected within 10 km"
    ]
  },

  forest: {
    id: "forest",
    title: "Forests, Woodlands & Canopy Cover",
    icon: "🌲",
    pollutants: ["Tree felling", "Acidic deposition", "Canopy fragmentation", "Biomass loss"],
    description: "Screens for diversion of legally designated Reserve/Protected forest land, canopy severance, and tree felling.",
    potentialCauses: [
      "Direct physical diversion of deemed or recorded forest land for plant facilities, pipelines, or access roads",
      "Tree cutting and understory clearance for linear right-of-ways (transmission lines, coal conveyor corridors, water pipelines)",
      "Fugitive dust deposition on forest canopies clogging stomata and inducing chlorosis in adjacent forest patches"
    ],
    environmentalHarm: [
      "Direct loss of carbon sequestration capacity and living biomass standing stock",
      "Edge effects penetrating intact forest interiors, altering micro-climatic humidity and increasing wildfire vulnerability",
      "Disruption of contiguous canopy continuity essential for arboreal mammals, hornbills, and canopy-dwelling fauna"
    ],
    communityPathways: [
      "Potential restriction of forest-dwelling tribal communities' (FRA 2006) access to non-timber forest products (NTFP)",
      "Potential alteration of local microclimatic temperature buffers and natural groundwater spring recharge zones"
    ],
    mitigationMeasures: [
      "Rigorous adherence to the hierarchy of avoidance: re-aligning project boundary to fully bypass recorded forest compartments",
      "Stage-I & Stage-II Forest Clearance compliance under Van (Sanrakshan Evam Samvardhan) Adhiniyam 2023 where diversion is unavoidable",
      "Payment of Net Present Value (NPV) and execution of mandatory double-area Compensatory Afforestation (CA) via CAMPA authority",
      "Avenue plantations and boundary green corridors planted with climax native forest canopy species"
    ],
    specialistStudies: [
      "Forest Canopy Density & Floral Inventory enumeration certified by the Divisional Forest Officer (DFO)",
      "Scheduled Tribes and Other Traditional Forest Dwellers (FRA 2006) Gram Sabha settlement verification"
    ]
  },

  wildlife: {
    id: "wildlife",
    title: "Wildlife Corridors & Protected Habitats",
    icon: "🐅",
    pollutants: ["Acoustic disturbance", "Barrier creation", "Vehicle strikes", "Poaching risk during labor influx"],
    description: "Evaluates proximity to National Parks, Sanctuaries, Tiger Reserves, and designated Eco-Sensitive Zones (ESZ).",
    potentialCauses: [
      "Siting within the default or notified 10 km Eco-Sensitive Zone (ESZ) of a declared National Park or Wildlife Sanctuary",
      "High volume construction and heavy transport vehicle movements along rural access roads intersecting animal movement paths",
      "Perimeter chain-link or pre-cast boundary walls creating linear barriers to natural wildlife migration and foraging ranges",
      "Large influx of transient migrant construction labor increasing potential firewood gathering and anthropogenic pressure"
    ],
    environmentalHarm: [
      "Direct mortality of wildlife species from vehicular strikes along raw material transport logistics routes",
      "Behavioral disruption, habitat abandonment, and territorial stress among flagship species (Tigers, Elephants, Leopards)",
      "Severance of biological gene flow and historical migration corridors between isolated wildlife protected areas"
    ],
    communityPathways: [
      "Potential escalation of human-wildlife conflict (crop raiding, livestock predation, human encounters) near forest edges",
      "Public safety risks along transport roads where heavy industrial freight interfaces with rural animal crossings"
    ],
    mitigationMeasures: [
      "Mandatory clearance from the Standing Committee of the National Board for Wildlife (SC-NBWL) for sites within 10 km of PA/ESZ",
      "Construction of dedicated eco-friendly wildlife underpasses, overpasses, and speed-calming zones along critical logistics corridors",
      "Deployment of ultrasonic / acoustic deterrents and thermal infrared animal detection systems along plant boundaries",
      "Strict prohibition of labor colonies in sensitive peripheral zones and provisioning of subsidized LPG cooking fuel to prevent logging"
    ],
    specialistStudies: [
      "Wildlife Movement & Corridor Interruption Study conducted in association with the Wildlife Institute of India (WII)",
      "Site-Specific Wildlife Conservation Plan with budget earmarked for local Protected Area management"
    ]
  },

  agriculture: {
    id: "agriculture",
    title: "Agriculture, Farmland & Rural Livelihoods",
    icon: "🌾",
    pollutants: ["Dust deposition", "Groundwater drawdown", "Airborne fluorides/SO2", "Saline runoff"],
    description: "Assesses potential loss of prime multi-crop irrigated land, irrigation canal disruption, and agrarian livelihood impact.",
    potentialCauses: [
      "Acquisition and conversion of fertile, irrigated agricultural farmland for industrial non-agricultural (NA) use",
      "Large-scale extraction of groundwater from shared agricultural aquifers during peak irrigation seasons",
      "Airborne deposition of particulate matter, cement dust, fly ash, or fluorides onto agricultural standing crops",
      "Severance or alteration of historical irrigation canals, field distributaries, or natural agricultural drainage channels"
    ],
    environmentalHarm: [
      "Permanent loss of prime food-producing agricultural acreage and reduction in regional agrarian crop capacity",
      "Soil encrustation, stomatal blockage, and premature leaf necrosis on standing cash crops from chronic dust fallout",
      "Depletion of shallow water tables relied upon by smallholder farmers using open dug wells and borewells"
    ],
    communityPathways: [
      "Potential loss of agrarian livelihoods, agricultural tenancy, and economic stability for farming households",
      "Potential reduction in agricultural market yields, crop quality grading, and farm household income",
      "Potential socio-economic friction and land-use conflict between industrial management and agrarian communities"
    ],
    mitigationMeasures: [
      "Prioritizing barren, scrub, degraded, or single-crop rainfed land over prime multi-crop irrigated agricultural parcels",
      "Complete engineering protection, culverting, and unhindered routing of all existing village irrigation canals across the property",
      "Enclosed storage of all dry dusty raw materials under negative pressure with automated dust suppression fog cannons",
      "Corporate Social Responsibility (CSR) investments in micro-irrigation (drip/sprinkler) technology for local farming communities"
    ],
    specialistStudies: [
      "Agricultural Impact & Agro-economic Baseline Assessment analyzing crop patterns, yield trends, and soil capability classification",
      "Socio-Economic Impact Assessment (SIA) under RFCTLARR Act 2013 where applicable"
    ]
  },

  population: {
    id: "population",
    title: "Human Settlements, Public Health & Safety",
    icon: "🏘️",
    pollutants: ["Respirable dust", "Toxic process gases", "Heavy transport traffic", "Low frequency noise", "Explosion hazard"],
    description: "Assesses proximity to villages, schools, hospitals, urban fringes, and potential demographic exposure pathways.",
    potentialCauses: [
      "Proximity of hazardous plant boundaries to dense human habitations, educational institutions, or hospitals",
      "Heavy heavy-duty commercial truck movements navigating narrow rural settlement access roads",
      "Potential off-site toxic gas releases (e.g. Chlorine, Ammonia, Phosgene) or vapor cloud explosions during major industrial accidents",
      "Continuous industrial machinery hum, transformer noise, and nocturnal material handling activities"
    ],
    environmentalHarm: [
      "Deterioration of local neighborhood environmental amenity, acoustic calm, and rural tranquility",
      "Elevated traffic emissions and localized micro-particulate spikes within settlement corridors"
    ],
    communityPathways: [
      "Potential elevated risk of chronic respiratory and cardiovascular symptoms among vulnerable populations (children, elderly)",
      "Potential sleep disturbance, cognitive impairment, and stress symptoms from nocturnal industrial and logistics noise",
      "Potential risk of catastrophic exposure requiring mass community evacuation in the event of major chemical or nuclear emergency",
      "Potential traffic safety hazards and road fatalities along shared residential access thoroughfares"
    ],
    mitigationMeasures: [
      "Strict physical setback buffers (minimum 500m to 1.5 km depending on hazard rating) between process units and settlement boundaries",
      "Dedicated, bypass industrial access highway connecting directly to arterial transport networks without passing through village centers",
      "Automated off-site public warning sirens, emergency sirens, and computerized community toxic dispersion alarm systems",
      "Formal On-Site and Off-Site Emergency Plans prepared under MSIHC Rules 1989 and rehearsed via periodic District mock drills"
    ],
    specialistStudies: [
      "Quantitative Risk Assessment (QRA) and Consequence Modeling (ALOHA / DNV PHAST) for major accident hazard scenarios",
      "Public Health Morbidity Baseline Survey within a 5 km demographic radius"
    ]
  },

  noise: {
    id: "noise",
    title: "Noise, Vibration & Acoustic Environment",
    icon: "📢",
    pollutants: ["Acoustic noise (Leq dBA)", "Ground vibration (Peak Particle Velocity)", "Infrasound", "Blasting overpressure"],
    description: "Evaluates acoustic emission from heavy rotating machinery, cooling towers, compressors, blasting, and turbine blades.",
    potentialCauses: [
      "Heavy industrial rotating equipment: turbines, induced draft fans, high-pressure compressors, ball mills, and crushers",
      "Deep-hole rock blasting operations in captive limestone, coal, or metal mining quarries",
      "Aerodynamic blade noise and mechanical gearbox hum from wind turbine installations",
      "Intermittent high-pressure steam safety valve blow-offs and emergency pressure relief releases"
    ],
    environmentalHarm: [
      "Displacement and acoustic masking of wildlife communication, distress calls, and mating signals in nearby habitats",
      "Structural ground-borne vibration potentially damaging micro-structures or causing cracks in traditional non-engineered village dwellings"
    ],
    communityPathways: [
      "Potential occupational noise-induced hearing loss among plant workforce without certified personal protective equipment",
      "Potential chronic annoyance, hypertension, sleep disruption, and cardiovascular stress among nearby residents",
      "Startle reactions and structural fear among neighboring communities from sudden unannounced mine blasting overpressure"
    ],
    mitigationMeasures: [
      "Engineering acoustic enclosures, silencers, and sound attenuation baffles on all high-decibel fans, blowers, and exhausts",
      "Equipment vibration isolation pads, spring dampers, and flexible expansion joints for heavy rotating machinery",
      "Restriction of all blasting operations to designated daytime hours with strict electronic micro-delay non-electric detonators",
      "Thick, multi-layered acoustic buffer green belt along boundary wall achieving at least 8 - 12 dBA natural noise attenuation",
      "Strict adherence to CPCB Ambient Noise Standards (75 dBA Day / 70 dBA Night for Industrial zones)"
    ],
    specialistStudies: [
      "Baseline and Predictive Acoustic Modeling (SoundPLAN or CadnaA) calculating day-night Leq contours at settlement receptors",
      "Ground vibration and blasting overpressure attenuation study with seismograph monitoring"
    ]
  },

  waste: {
    id: "waste",
    title: "Solid, Hazardous & Radioactive Waste",
    icon: "🗑️",
    pollutants: ["Hazardous chemical sludge", "Incinerator bottom/fly ash", "Heavy metal slag", "E-waste", "Radioactive residues"],
    description: "Evaluates generation rates, classification, handling, on-site storage, co-processing, and secured landfilling.",
    potentialCauses: [
      "Generation of heavy process solid residues: blast furnace slag, fly ash, lime mud, phosphogypsum, or tailings",
      "Chemical and hazardous effluent treatment plant (ETP) biological and chemical coagulation sludges",
      "Accumulation of spent organic solvents, distillation bottoms, contaminated containers, and obsolete formulations",
      "Specialty sector wastes: e.g. low-level conditioned radioactive resins (Nuclear), spent lead/cadmium modules (Solar), toxic e-waste (Electronics)"
    ],
    environmentalHarm: [
      "Soil and deep aquifer contamination from unlined, open-air waste dumps subjected to monsoonal rainwater leaching",
      "Fugitive atmospheric dust emissions and spontaneous combustion risks from coal residue, ash ponds, and organic waste dumps",
      "Long-term legacy contamination of industrial sites remaining hazardous for decades after plant decommissioning"
    ],
    communityPathways: [
      "Potential leaching of toxic carcinogens or heavy metals into regional agricultural soils and drinking water aquifers",
      "Potential exposure to smoke, dioxins, and toxic air contaminants from smoldering waste dumps or suboptimal incineration",
      "Potential vectors and public nuisance in the vicinity of unmanaged biodegradable food or organic waste heaps"
    ],
    mitigationMeasures: [
      "100% statutory utilization of high-volume non-hazardous solid wastes (fly ash in cement/bricks, blast furnace slag in civil works)",
      "Dedicated covered, impervious, leachate-collected hazardous waste storage sheds with mandatory 90-day storage compliance",
      "Formal membership and tie-up with State SPCB-authorized Common Hazardous Waste TSDF for secured landfilling and incineration",
      "Co-processing of high-calorific hazardous residues and plastics as Alternate Fuel & Raw materials (AFR) in high-temperature cement kilns",
      "Comprehensive digital manifest tracking under Hazardous and Other Wastes (Management and Transboundary Movement) Rules 2016"
    ],
    specialistStudies: [
      "Toxic Characteristic Leaching Procedure (TCLP) laboratory waste characterization and hazardous classification study",
      "Comprehensive Solid & Hazardous Waste Management & Material Circularity Plan"
    ]
  },

  climate: {
    id: "climate",
    title: "Climate Vulnerability, Carbon & Resilience",
    icon: "🌡️",
    pollutants: ["Carbon Dioxide (CO2)", "Methane (CH4)", "Nitrous Oxide (N2O)", "Hydrofluorocarbons (HFCs)", "SF6"],
    description: "Evaluates greenhouse gas footprint, energy intensity, extreme weather exposure (heat stress, flash floods, sea level rise).",
    potentialCauses: [
      "Direct Scope 1 fossil fuel combustion in large utility boilers, lime kilns, blast furnaces, and process heaters",
      "Intensive indirect Scope 2 electrical energy consumption sourced from fossil-dominant electrical grids",
      "Fugitive greenhouse gas venting, flaring, and transmission leaks (methane in petrochemicals, SF6 in high-voltage substations)",
      "Location in high-risk climate vulnerability regions subject to extreme heatwaves, cyclones, or erratic monsoon precipitation"
    ],
    environmentalHarm: [
      "Contribution to cumulative national and global greenhouse gas inventory driving atmospheric warming",
      "Exacerbation of local urban/industrial heat island (UHI) effects from extensive asphalted and corrugated roof surfaces",
      "Vulnerability to catastrophic flash flooding, cloudbursts, or storm surges inundating chemical containment infrastructure"
    ],
    communityPathways: [
      "Potential heightened regional vulnerability to chronic water scarcity under shifting precipitation regimes",
      "Potential occupational heat stress risks for external workforce during severe pre-monsoon heat extremes"
    ],
    mitigationMeasures: [
      "Adoption of Best Available Technologies (BAT) such as supercritical/ultra-supercritical units, waste heat recovery (WHR) boilers",
      "Integration of captive renewable energy generation (rooftop solar, corporate open-access green energy contracts)",
      "Climate-resilient civil engineering: elevating plinth levels above 100-year High Flood Level (HFL) and designing resilient drainage",
      "Implementation of ISO 50001 Energy Management Systems and participation in India's Perform, Achieve and Trade (PAT) scheme"
    ],
    specialistStudies: [
      "Corporate Carbon Footprint & GHG Accounting (Scope 1, 2, and major 3) aligned with GHG Protocol",
      "Climate Change Vulnerability & Disaster Resilience Risk Screening utilizing IPCC regional projection scenarios"
    ]
  },

  hazards: {
    id: "hazards",
    title: "Disaster Risk, Seismicity & Industrial Accidents",
    icon: "⚠️",
    pollutants: ["Flammable vapor clouds", "Toxic toxic clouds (Chlorine, NH3)", "Boiling Liquid Expanding Vapor Explosions (BLEVE)", "Radionuclides"],
    description: "Evaluates seismic zone classification, flood basin inundation, chemical process safety, and emergency planning zones.",
    potentialCauses: [
      "Location in designated high-risk Seismic Zones (Zone IV or V) subject to earthquake ground acceleration",
      "Siting within low-lying riverine floodplains, coastal storm surge zones, or tsunamigenic inundation zones",
      "Storage of large inventories of flammable, explosive, or toxic gases exceeding threshold quantities under MSIHC Rules 1989",
      "Catastrophic failure of pressurized vessels, reactors, cooling water supplies, or safety relief containment systems"
    ],
    environmentalHarm: [
      "Massive chemical or hazardous material spill into surrounding rivers, reservoirs, and agricultural soils following natural disaster",
      "Widespread secondary fires and atmospheric smoke plumes consuming industrial materials and releasing toxic dioxins"
    ],
    communityPathways: [
      "Potential catastrophic off-site civilian casualties or severe acute toxicity requiring rapid large-scale community evacuation",
      "Potential disruption of critical public infrastructure (transport arteries, power grids, drinking water networks) during crisis"
    ],
    mitigationMeasures: [
      "Earthquake-resistant structural design in strict accordance with Bureau of Indian Standards seismic codes (IS 1893:2016)",
      "Plant layout engineered with safe inter-unit separation distances complying with OISD (Oil Industry Safety Directorate) norms",
      "Fail-safe automated Emergency Shutdown (ESD) valves, nitrogen purging systems, and deluge water spray curtains",
      "For nuclear facilities: double-containment reactor building, passive decay heat removal systems, and AERB-approved emergency planning zones",
      "Mutual Aid emergency response pacts established with neighboring industrial units and District Disaster Management Authority (DDMA)"
    ],
    specialistStudies: [
      "Site-Specific Seismic Hazard Analysis (SSSHA) and Paleoseismic Investigation for critical infrastructure",
      "Comprehensive Disaster Management Plan (DMP) including On-Site Emergency Plan and Off-Site Emergency Framework"
    ]
  }
};
