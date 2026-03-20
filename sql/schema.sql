-- Organizations Table: Registry of all reporting agencies
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    type VARCHAR(50) DEFAULT 'NGO',
    -- NGO, INGO, Government, etc.
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Projects Table: Tracking specific interventions
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    -- Internal project code
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Locations Table: Geographic hierarchy
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    lga VARCHAR(100) NOT NULL,
    ward VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Activities Table: Specific tasks within a project
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id),
    location_id INT REFERENCES locations(id),
    activity_name TEXT NOT NULL,
    sector VARCHAR(100),
    target_value NUMERIC(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Indicators & Reports Table: Field data entries
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    activity_id INT REFERENCES activities(id),
    indicator_name VARCHAR(255) NOT NULL,
    recorded_value NUMERIC(15, 2) NOT NULL,
    reporting_period DATE NOT NULL,
    -- e.g., '2023-10-01'
    source_kobo_id VARCHAR(100),
    -- Reference back to Kobo entry ID
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Views for Analytics
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT o.name AS organization,
    p.name AS project,
    a.activity_name,
    l.lga,
    r.indicator_name,
    r.recorded_value,
    r.reporting_period
FROM reports r
    JOIN activities a ON r.activity_id = a.id
    JOIN projects p ON a.project_id = p.id
    JOIN organizations o ON p.organization_id = o.id
    JOIN locations l ON a.location_id = l.id;