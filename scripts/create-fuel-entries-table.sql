-- Create fuel entries table for tracking vehicle fuel consumption
CREATE TABLE IF NOT EXISTS fuel_entries (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  odometer_reading INTEGER NOT NULL,
  fuel_amount DECIMAL(8,2) NOT NULL,
  fuel_cost DECIMAL(10,2) NOT NULL,
  fuel_type VARCHAR(20) DEFAULT 'petrol',
  location TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fuel_entries_vehicle ON fuel_entries(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_date ON fuel_entries(date);

-- Add constraints
ALTER TABLE fuel_entries 
ADD CONSTRAINT check_fuel_amount_positive CHECK (fuel_amount > 0),
ADD CONSTRAINT check_fuel_cost_positive CHECK (fuel_cost > 0),
ADD CONSTRAINT check_odometer_positive CHECK (odometer_reading > 0);
