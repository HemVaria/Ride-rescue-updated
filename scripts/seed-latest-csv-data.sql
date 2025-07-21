-- Clear existing data
TRUNCATE TABLE area_mechanics CASCADE;
TRUNCATE TABLE service_areas RESTART IDENTITY CASCADE;

-- Insert service areas based on latest CSV data
INSERT INTO service_areas (area_name, city, state, latitude, longitude) VALUES
('Akota Circle', 'Vadodara', 'Gujarat', 22.2928, 73.2081),
('Alkapuri', 'Vadodara', 'Gujarat', 22.3178, 73.1734),
('Karelibaug', 'Vadodara', 'Gujarat', 22.3039, 73.1812),
('Mandvi', 'Vadodara', 'Gujarat', 22.3178, 73.1812),
('Fatehgunj', 'Vadodara', 'Gujarat', 22.3176, 73.1896),
('Sayajigunj', 'Vadodara', 'Gujarat', 22.3072, 73.1812),
('Waghodia Road', 'Vadodara', 'Gujarat', 22.2847, 73.1434),
('Gotri', 'Vadodara', 'Gujarat', 22.3511, 73.2069),
('Manjalpur', 'Vadodara', 'Gujarat', 22.2644, 73.1953),
('Nizampura', 'Vadodara', 'Gujarat', 22.2889, 73.1953),
('Vasna Road', 'Vadodara', 'Gujarat', 22.3178, 73.1456),
('Subhanpura', 'Vadodara', 'Gujarat', 22.2847, 73.1734),
('Harni', 'Vadodara', 'Gujarat', 22.3511, 73.1456),
('Sama', 'Vadodara', 'Gujarat', 22.2644, 73.2347),
('Tarsali', 'Vadodara', 'Gujarat', 22.2889, 73.1178),
('Bapod', 'Vadodara', 'Gujarat', 22.3178, 73.2625),
('Makarpura', 'Vadodara', 'Gujarat', 22.2847, 73.2069),
('Productivity Road', 'Vadodara', 'Gujarat', 22.3511, 73.1812);

-- Insert mechanics based on latest CSV data
INSERT INTO area_mechanics (name, phone, address, area_id, latitude, longitude, rating, verified, services) VALUES
-- Akota Circle mechanics
('Akota Circle Auto Garage', '+919825600100', 'Shop 149, Akota Circle, Vadodara - 390020', 1, 22.2928, 73.2081, 4.5, true, ARRAY['Engine Repair', 'AC Service', 'General Service']),
('Express Service Akota', '+919825600101', 'Near Akota Circle, Vadodara - 390020', 1, 22.2935, 73.2088, 4.3, true, ARRAY['Emergency Service', 'Towing Service', 'Jump Start']),
('Akota Auto Care', '+919825600102', 'Akota Garden Road, Vadodara - 390020', 1, 22.2921, 73.2074, 4.6, true, ARRAY['Brake Service', 'Battery Service', 'AC Repair']),

-- Alkapuri mechanics
('Alkapuri Service Center', '+919825600200', 'RC Dutt Road, Alkapuri, Vadodara - 390007', 2, 22.3178, 73.1734, 4.7, true, ARRAY['Engine Repair', 'Transmission Service', 'General Service']),
('Quick Fix Alkapuri', '+919825600201', 'Near Alkapuri Bus Stand, Vadodara - 390007', 2, 22.3185, 73.1741, 4.4, true, ARRAY['Emergency Service', 'AC Service', 'Battery Replacement']),
('Alkapuri Auto Hub', '+919825600202', 'Alkapuri Main Road, Vadodara - 390007', 2, 22.3171, 73.1727, 4.5, true, ARRAY['Brake Service', 'Tire Service', 'Oil Change']),

-- Karelibaug mechanics
('Karelibaug Motors', '+919825600300', 'Karelibaug Main Road, Vadodara - 390018', 3, 22.3039, 73.1812, 4.6, true, ARRAY['Engine Repair', 'AC Service', 'General Service']),
('Express Auto Karelibaug', '+919825600301', 'Near Karelibaug Circle, Vadodara - 390018', 3, 22.3046, 73.1819, 4.3, true, ARRAY['Emergency Service', 'Towing Service', 'Jump Start']),
('Karelibaug Service Point', '+919825600302', 'Karelibaug Society Road, Vadodara - 390018', 3, 22.3032, 73.1805, 4.5, true, ARRAY['Brake Service', 'Battery Service', 'Electrical Work']),

-- Mandvi mechanics
('Mandvi Auto Garage', '+919825600400', 'Mandvi Main Road, Vadodara - 390001', 4, 22.3178, 73.1812, 4.4, true, ARRAY['Engine Repair', 'AC Service', 'General Service']),
('Mandvi Car Care', '+919825600401', 'Near Mandvi Bridge, Vadodara - 390001', 4, 22.3185, 73.1819, 4.6, true, ARRAY['Emergency Service', 'Brake Service', 'Battery Replacement']),
('Quick Service Mandvi', '+919825600402', 'Mandvi Chowk, Vadodara - 390001', 4, 22.3171, 73.1805, 4.2, true, ARRAY['AC Repair', 'Tire Service', 'Oil Change']),

-- Fatehgunj mechanics
('Fatehgunj Motors', '+919825600500', 'Fatehgunj Main Road, Vadodara - 390002', 5, 22.3176, 73.1896, 4.5, true, ARRAY['Engine Repair', 'Transmission Service', 'General Service']),
('Express Service Fatehgunj', '+919825600501', 'Near Fatehgunj Railway Station, Vadodara - 390002', 5, 22.3183, 73.1903, 4.7, true, ARRAY['Emergency Service', 'Towing Service', 'AC Service']),
('Fatehgunj Auto Care', '+919825600502', 'Fatehgunj Circle, Vadodara - 390002', 5, 22.3169, 73.1889, 4.3, true, ARRAY['Brake Service', 'Battery Service', 'Jump Start']),

-- Sayajigunj mechanics
('Sayajigunj Service Center', '+919825600600', 'Sayajigunj Main Road, Vadodara - 390005', 6, 22.3072, 73.1812, 4.6, true, ARRAY['Engine Repair', 'AC Service', 'General Service']),
('Royal Auto Sayajigunj', '+919825600601', 'Near Sayajigunj Post Office, Vadodara - 390005', 6, 22.3079, 73.1819, 4.4, true, ARRAY['Emergency Service', 'Brake Service', 'Battery Replacement']),
('Sayajigunj Motors', '+919825600602', 'Sayajigunj Circle, Vadodara - 390005', 6, 22.3065, 73.1805, 4.5, true, ARRAY['AC Repair', 'Tire Service', 'Electrical Work']),

-- Waghodia Road mechanics
('Waghodia Road Garage', '+919825600700', 'Waghodia Road, Vadodara - 390019', 7, 22.2847, 73.1434, 4.3, true, ARRAY['Engine Repair', 'Heavy Vehicle Service', 'General Service']),
('Highway Auto Service', '+919825600701', 'Near Waghodia Road Bridge, Vadodara - 390019', 7, 22.2854, 73.1441, 4.6, true, ARRAY['Emergency Service', 'Towing Service', 'AC Service']),
('Waghodia Motors', '+919825600702', 'Waghodia Road Junction, Vadodara - 390019', 7, 22.2840, 73.1427, 4.4, true, ARRAY['Brake Service', 'Battery Service', 'Fuel Delivery']),

-- Gotri mechanics
('Gotri Auto Center', '+919825600800', 'Gotri Main Road, Vadodara - 390021', 8, 22.3511, 73.2069, 4.5, true, ARRAY['Engine Repair', 'AC Service', 'General Service']),
('Express Gotri Service', '+919825600801', 'Near Gotri Sevasi Road, Vadodara - 390021', 8, 22.3518, 73.2076, 4.7, true, ARRAY['Emergency Service', 'Brake Service', 'Battery Replacement']),
('Gotri Motors Hub', '+919825600802', 'Gotri Circle, Vadodara - 390021', 8, 22.3504, 73.2062, 4.2, true, ARRAY['AC Repair', 'Tire Service', 'Jump Start']);

-- Add more mechanics for remaining areas
INSERT INTO area_mechanics (name, phone, address, area_id, latitude, longitude, rating, verified, services) VALUES
-- Manjalpur
('Manjalpur Auto Service', '+919825600900', 'Manjalpur Main Road, Vadodara - 390011', 9, 22.2644, 73.1953, 4.4, true, ARRAY['Engine Repair', 'AC Service', 'General Service']),
('Quick Fix Manjalpur', '+919825600901', 'Near Manjalpur Circle, Vadodara - 390011', 9, 22.2651, 73.1960, 4.6, true, ARRAY['Emergency Service', 'Towing Service', 'Battery Service']),

-- Nizampura
('Nizampura Motors', '+919825601000', 'Nizampura Road, Vadodara - 390002', 10, 22.2889, 73.1953, 4.3, true, ARRAY['Engine Repair', 'Brake Service', 'General Service']),
('Express Nizampura', '+919825601001', 'Near Nizampura Bridge, Vadodara - 390002', 10, 22.2896, 73.1960, 4.5, true, ARRAY['Emergency Service', 'AC Service', 'Jump Start']),

-- Vasna Road
('Vasna Road Garage', '+919825601100', 'Vasna Road, Vadodara - 390007', 11, 22.3178, 73.1456, 4.6, true, ARRAY['Engine Repair', 'AC Service', 'General Service']),
('Vasna Auto Care', '+919825601101', 'Near Vasna Circle, Vadodara - 390007', 11, 22.3185, 73.1463, 4.4, true, ARRAY['Emergency Service', 'Brake Service', 'Battery Replacement']),

-- Subhanpura
('Subhanpura Service', '+919825601200', 'Subhanpura Main Road, Vadodara - 390023', 12, 22.2847, 73.1734, 4.5, true, ARRAY['Engine Repair', 'AC Service', 'General Service']),
('Quick Service Subhanpura', '+919825601201', 'Near Subhanpura Circle, Vadodara - 390023', 12, 22.2854, 73.1741, 4.3, true, ARRAY['Emergency Service', 'Towing Service', 'AC Repair']);

-- Create a view for easy querying
CREATE OR REPLACE VIEW mechanic_details AS
SELECT 
    m.id,
    m.name,
    m.phone,
    m.address,
    m.latitude,
    m.longitude,
    m.rating,
    m.verified,
    m.services,
    sa.area_name,
    sa.city,
    sa.state
FROM area_mechanics m
JOIN service_areas sa ON m.area_id = sa.id
ORDER BY sa.area_name, m.name;

-- Grant permissions
GRANT SELECT ON service_areas TO PUBLIC;
GRANT SELECT ON area_mechanics TO PUBLIC;
GRANT SELECT ON mechanic_details TO PUBLIC;

-- Add some sample queries for testing
-- SELECT * FROM mechanic_details WHERE area_name = 'Akota Circle';
-- SELECT * FROM mechanic_details WHERE 'Engine Repair' = ANY(services);
-- SELECT area_name, COUNT(*) as mechanic_count FROM mechanic_details GROUP BY area_name ORDER BY mechanic_count DESC;
