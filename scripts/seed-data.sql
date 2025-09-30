-- Insert sample service providers
INSERT INTO service_providers (name, email, phone, services, rating, review_count, location_lat, location_lng, verified) VALUES
('Quick Fix Auto', 'contact@quickfixauto.com', '+1-555-0101', ARRAY['tire_change', 'battery_jump', 'emergency_repair'], 4.8, 127, 40.7128, -74.0060, TRUE),
('Mike''s Towing Service', 'mike@mikestowing.com', '+1-555-0102', ARRAY['towing', 'winching', 'battery_jump'], 4.9, 89, 40.7589, -73.9851, TRUE),
('Road Rescue Pro', 'info@roadrescuepro.com', '+1-555-0103', ARRAY['lockout', 'fuel_delivery', 'tire_change'], 4.7, 156, 40.7505, -73.9934, TRUE),
('Emergency Auto Care', 'help@emergencyautocare.com', '+1-555-0104', ARRAY['emergency_repair', 'towing', 'battery_jump'], 4.6, 203, 40.7282, -74.0776, TRUE),
('City Roadside Assistance', 'support@cityroadside.com', '+1-555-0105', ARRAY['fuel_delivery', 'lockout', 'winching'], 4.5, 98, 40.7831, -73.9712, TRUE);
