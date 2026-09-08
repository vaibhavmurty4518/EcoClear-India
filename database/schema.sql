-- ==============================================================================
-- EcoClear India — PostgreSQL + PostGIS Spatial Schema & Rule Repository
-- Production Architecture Blueprint for Stage 4 Production Deployment
-- ==============================================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Industrial Sectors & Master Weight Profiles Table
CREATE TABLE IF NOT EXISTS industries (
    industry_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cpcb_category VARCHAR(20) NOT NULL CHECK (cpcb_category IN ('Red', 'Orange', 'Green', 'White')),
    eia_schedule_item VARCHAR(255) NOT NULL,
    default_capacity NUMERIC(15, 2) NOT NULL,
    default_unit VARCHAR(50) NOT NULL,
    water_demand_intensity VARCHAR(100),
    weights JSONB NOT NULL,             -- e.g. {"air": 0.20, "water": 0.18, ...}
    base_sensitivities JSONB NOT NULL,   -- e.g. {"air": 88, "water": 75, ...}
    key_pollutants TEXT[],
    waste_streams TEXT[],
    mitigation_focus TEXT[],
    statutory_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indian Spatial Geospatial Layers (PostGIS Geometry Tables)

-- 3.1 Rivers & Surface Waterbodies
CREATE TABLE IF NOT EXISTS spatial_rivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    river_type VARCHAR(100) NOT NULL,
    basin_name VARCHAR(100),
    geom GEOMETRY(MultiLineString, 4326) NOT NULL,
    is_real BOOLEAN DEFAULT TRUE,
    source_authority VARCHAR(255),
    confidence_level VARCHAR(50) DEFAULT 'High',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_spatial_rivers_geom ON spatial_rivers USING GIST (geom);

-- 3.2 Protected Areas & National Parks (WII / MoEFCC)
CREATE TABLE IF NOT EXISTS spatial_protected_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- National Park, Wildlife Sanctuary, Tiger Reserve, Biosphere
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    area_sq_km NUMERIC(10, 2),
    esz_buffer_km NUMERIC(5, 2) DEFAULT 10.0,
    core_geom GEOMETRY(MultiPolygon, 4326),
    centroid_geom GEOMETRY(Point, 4326) NOT NULL,
    faunal_flagships TEXT,
    source_authority VARCHAR(255),
    is_real BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_spatial_pa_geom ON spatial_protected_areas USING GIST (centroid_geom);
CREATE INDEX IF NOT EXISTS idx_spatial_pa_core_geom ON spatial_protected_areas USING GIST (core_geom);

-- 3.3 Notified Industrial Parks & Corridors
CREATE TABLE IF NOT EXISTS spatial_industrial_parks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    notified_authority VARCHAR(255) NOT NULL, -- e.g. MIDC, GIDC, KIADB, SIPCOT
    sector_focus VARCHAR(255),
    geom GEOMETRY(Geometry, 4326) NOT NULL,
    is_notified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_spatial_ind_geom ON spatial_industrial_parks USING GIST (geom);

-- 3.4 Census Settlements & Urban Agglomerations
CREATE TABLE IF NOT EXISTS spatial_settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    population_tier VARCHAR(50),
    approx_population INTEGER,
    centroid_geom GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_spatial_settlements_geom ON spatial_settlements USING GIST (centroid_geom);

-- 4. Versioned Regulatory Rules & Siting Criteria
CREATE TABLE IF NOT EXISTS regulatory_rules (
    rule_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    authority VARCHAR(255) NOT NULL,
    source_act_citation VARCHAR(255) NOT NULL,
    source_url TEXT,
    effective_date DATE NOT NULL,
    last_verified DATE NOT NULL,
    rule_version VARCHAR(50) NOT NULL,
    trigger_conditions JSONB NOT NULL,
    statutory_action TEXT NOT NULL,
    explanation TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. User Site Screenings & Audit Log
CREATE TABLE IF NOT EXISTS site_screenings (
    screening_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    industry_id VARCHAR(50) REFERENCES industries(industry_id),
    subsector VARCHAR(255),
    project_phase VARCHAR(100),
    capacity NUMERIC(15, 2) NOT NULL,
    capacity_unit VARCHAR(50) NOT NULL,
    site_location_name VARCHAR(255) NOT NULL,
    site_geom GEOMETRY(Geometry, 4326) NOT NULL,
    computed_risk_score INTEGER NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    gis_summary JSONB NOT NULL,
    factor_breakdown JSONB NOT NULL,
    regulatory_checklist JSONB NOT NULL,
    client_ip VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_site_screenings_geom ON site_screenings USING GIST (site_geom);

-- ==============================================================================
-- Example Spatial Query in PostGIS
-- Calculates exact geodesic distance in meters from site to nearest Major River:
--
-- SELECT 
--     r.name, 
--     r.river_type,
--     ST_Distance(ST_SetSRID(ST_MakePoint(73.8569, 18.7562), 4326)::geography, r.geom::geography) / 1000.0 AS distance_km
-- FROM spatial_rivers r
-- ORDER BY ST_Distance(ST_SetSRID(ST_MakePoint(73.8569, 18.7562), 4326)::geography, r.geom::geography) ASC
-- LIMIT 1;
-- ==============================================================================
