# What to do next in Antigravity

## Phase 1 — turn the demo into a real app
- Convert the HTML/CSS/JS into React/Next.js.
- Keep the same screens and interaction flow.
- Add PostgreSQL + PostGIS.
- Add login only if needed.

## Phase 2 — real GIS
Build an ingestion pipeline:
- obtain authoritative/licensed Indian datasets;
- normalize CRS to a common spatial reference;
- import into PostGIS;
- index geometry columns;
- expose `/api/site-analysis`.

Example API response:
{
  "site": {"lat": 18.5204, "lng": 73.8567},
  "industry": "steel",
  "nearby": [
    {"type":"river","name":"...","distance_km":3.2}
  ],
  "flags": [],
  "score": 71,
  "data_as_of": "YYYY-MM-DD"
}

## Phase 3 — industry rule engine
Create database tables:
- industries
- project_categories
- parameters
- rules
- rule_versions
- approval_paths

Each rule needs:
- source
- effective date
- jurisdiction
- condition
- action
- explanation

This avoids hard-coding regulatory rules into the frontend.

## Phase 4 — India scope
Do not attempt the whole world.
Start with one state and expand:
1. Maharashtra
2. Gujarat / Karnataka
3. More states
4. Pan-India

## Phase 5 — serious report
Generate a PDF containing:
- project profile
- exact site boundary
- map
- data sources + dates
- nearby sensitive features
- distances
- industry-specific factors
- flagged concerns
- possible approval checks
- limitations/disclaimer

## Demo presentation
Show the SAME location with:
Steel → analyze
Chemical → analyze
Nuclear → analyze

The criteria and score change because the rule profile changes. This is the project's strongest demonstration.
