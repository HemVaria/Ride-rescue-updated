-- Create service_areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id SERIAL PRIMARY KEY,
  area_name VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) DEFAULT 'Gujarat',
  country VARCHAR(50) DEFAULT 'India',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  radius_km INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create area_mechanics table
CREATE TABLE IF NOT EXISTS area_mechanics (
  id SERIAL PRIMARY KEY,
  service_area_id INTEGER REFERENCES service_areas(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  services TEXT[] DEFAULT ARRAY['General Service', 'Emergency Service'],
  rating DECIMAL(3, 2) DEFAULT 4.0,
  verified BOOLEAN DEFAULT true,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_areas_city ON service_areas(city);
CREATE INDEX IF NOT EXISTS idx_service_areas_location ON service_areas(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_area_mechanics_area ON area_mechanics(service_area_id);
CREATE INDEX IF NOT EXISTS idx_area_mechanics_available ON area_mechanics(available);
CREATE INDEX IF NOT EXISTS idx_area_mechanics_services ON area_mechanics USING GIN(services);
