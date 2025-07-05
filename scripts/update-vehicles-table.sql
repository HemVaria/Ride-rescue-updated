-- Add new columns to vehicles table if they don't exist
DO $$ 
BEGIN
    -- Add color column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'color') THEN
        ALTER TABLE vehicles ADD COLUMN color VARCHAR(50);
    END IF;
    
    -- Add mileage column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'mileage') THEN
        ALTER TABLE vehicles ADD COLUMN mileage INTEGER DEFAULT 0;
    END IF;
    
    -- Add fuel_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'fuel_type') THEN
        ALTER TABLE vehicles ADD COLUMN fuel_type VARCHAR(20) DEFAULT 'petrol';
    END IF;
    
    -- Add insurance_expiry column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'insurance_expiry') THEN
        ALTER TABLE vehicles ADD COLUMN insurance_expiry DATE;
    END IF;
    
    -- Add registration_expiry column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'registration_expiry') THEN
        ALTER TABLE vehicles ADD COLUMN registration_expiry DATE;
    END IF;
    
    -- Add last_service column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'last_service') THEN
        ALTER TABLE vehicles ADD COLUMN last_service DATE;
    END IF;
    
    -- Add next_service column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'next_service') THEN
        ALTER TABLE vehicles ADD COLUMN next_service DATE;
    END IF;
    
    -- Add updated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'updated_at') THEN
        ALTER TABLE vehicles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add insurance_company column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'insurance_company') THEN
        ALTER TABLE vehicles ADD COLUMN insurance_company VARCHAR(255);
    END IF;
    
    -- Add insurance_policy column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'insurance_policy') THEN
        ALTER TABLE vehicles ADD COLUMN insurance_policy VARCHAR(255);
    END IF;
    
    -- Add last_service_date column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'last_service_date') THEN
        ALTER TABLE vehicles ADD COLUMN last_service_date DATE;
    END IF;
    
    -- Add next_service_due column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'next_service_due') THEN
        ALTER TABLE vehicles ADD COLUMN next_service_due DATE;
    END IF;
    
    -- Add notes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'notes') THEN
        ALTER TABLE vehicles ADD COLUMN notes TEXT;
    END IF;
    
    -- Add vin column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'vin') THEN
        ALTER TABLE vehicles ADD COLUMN vin VARCHAR(17);
    END IF;
END $$;

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for date-based queries
CREATE INDEX IF NOT EXISTS idx_vehicles_insurance_expiry ON vehicles(insurance_expiry);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration_expiry ON vehicles(registration_expiry);
CREATE INDEX IF NOT EXISTS idx_vehicles_next_service ON vehicles(next_service_due);
