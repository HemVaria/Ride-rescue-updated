-- Create service areas table based on latest CSV data
CREATE TABLE IF NOT EXISTS service_areas (
    id SERIAL PRIMARY KEY,
    area_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Vadodara',
    state VARCHAR(100) NOT NULL DEFAULT 'Gujarat',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create area mechanics table based on latest CSV data
CREATE TABLE IF NOT EXISTS area_mechanics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    area_id INTEGER REFERENCES service_areas(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 4.5,
    verified BOOLEAN DEFAULT true,
    services TEXT[] DEFAULT ARRAY['General Service', 'Emergency Service'],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_areas_location ON service_areas(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_area_mechanics_location ON area_mechanics(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_area_mechanics_area_id ON area_mechanics(area_id);
CREATE INDEX IF NOT EXISTS idx_area_mechanics_services ON area_mechanics USING GIN(services);

-- Add some constraints
ALTER TABLE area_mechanics ADD CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE area_mechanics ADD CONSTRAINT chk_phone_format CHECK (phone ~ '^\+?[0-9\s\-$$$$]+$');

COMMENT ON TABLE service_areas IS 'Service areas based on latest CSV data from Gujarat';
COMMENT ON TABLE area_mechanics IS 'Mechanics and service providers from latest CSV data';
