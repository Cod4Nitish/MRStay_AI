-- ================================================
-- MRStay AI — Database Schema
-- ================================================

-- ================================================
-- Properties Table
-- ================================================
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    developer VARCHAR(255),
    property_type VARCHAR(100),         -- e.g. Apartment, Villa
    location VARCHAR(255),
    rera_number VARCHAR(100),

    configurations TEXT[],              -- e.g. {'2 BHK', '3 BHK'}
    price_min NUMERIC(12, 2),
    price_max NUMERIC(12, 2),

    amenities TEXT[],                   -- e.g. {'Clubhouse', 'Gym', 'Pool'}

    possession_status VARCHAR(50),      -- 'Ready to Move' / 'Under Construction'
    possession_date DATE,

    source_document VARCHAR(255),       -- links back to the brochure filename
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- Leads Table
-- ================================================
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),

    budget_min NUMERIC(12, 2),
    budget_max NUMERIC(12, 2),
    location_preference VARCHAR(255),
    property_type_preference VARCHAR(100),
    requirement TEXT,                   -- free-text notes from conversation

    status VARCHAR(50) DEFAULT 'new',   -- new / contacted / qualified / converted / lost
    source VARCHAR(50) DEFAULT 'chatbot',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- Indexes (for common lookups)
-- ================================================
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);