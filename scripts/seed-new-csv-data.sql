-- Clear existing data
TRUNCATE TABLE area_mechanics CASCADE;
TRUNCATE TABLE service_areas RESTART IDENTITY CASCADE;

-- Insert service areas based on new CSV data analysis
INSERT INTO service_areas (area_name, city, state, latitude, longitude, radius_km) VALUES
-- Vadodara areas (primary city based on CSV analysis)
('Mandvi', 'Vadodara', 'Gujarat', 22.3178, 73.1812, 8),
('Karelibaug', 'Vadodara', 'Gujarat', 22.3039, 73.1812, 8),
('Alkapuri', 'Vadodara', 'Gujarat', 22.3178, 73.1734, 8),
('Sayajigunj', 'Vadodara', 'Gujarat', 22.3072, 73.1812, 8),
('Fatehgunj', 'Vadodara', 'Gujarat', 22.3176, 73.1896, 8),
('Manjalpur', 'Vadodara', 'Gujarat', 22.2587, 73.1893, 8),
('Waghodia Road', 'Vadodara', 'Gujarat', 22.2733, 73.1956, 8),
('Gotri', 'Vadodara', 'Gujarat', 22.2928, 73.2081, 8),
('Nizampura', 'Vadodara', 'Gujarat', 22.3176, 73.1896, 8),
('Vasna', 'Vadodara', 'Gujarat', 22.2928, 73.2081, 8),
('Subhanpura', 'Vadodara', 'Gujarat', 22.2587, 73.1893, 8),
('Harni', 'Vadodara', 'Gujarat', 22.2733, 73.1956, 8),
('Tandalja', 'Vadodara', 'Gujarat', 22.3039, 73.1812, 8),
('Sama', 'Vadodara', 'Gujarat', 22.2928, 73.2081, 8),
('Bapod', 'Vadodara', 'Gujarat', 22.2587, 73.1893, 8),

-- Ahmedabad areas
('Satellite', 'Ahmedabad', 'Gujarat', 23.0225, 72.5714, 12),
('Vastrapur', 'Ahmedabad', 'Gujarat', 23.0395, 72.5240, 12),
('Bopal', 'Ahmedabad', 'Gujarat', 23.0395, 72.4294, 12),
('Maninagar', 'Ahmedabad', 'Gujarat', 22.9965, 72.6069, 12),
('Navrangpura', 'Ahmedabad', 'Gujarat', 23.0395, 72.5659, 12),
('Paldi', 'Ahmedabad', 'Gujarat', 23.0176, 72.5797, 12),

-- Surat areas
('Adajan', 'Surat', 'Gujarat', 21.2051, 72.8397, 10),
('Vesu', 'Surat', 'Gujarat', 21.1418, 72.7709, 10),
('Katargam', 'Surat', 'Gujarat', 21.2297, 72.8406, 10),
('Rander', 'Surat', 'Gujarat', 21.2514, 72.8328, 10),

-- Rajkot areas
('University Road', 'Rajkot', 'Gujarat', 22.2587, 70.7729, 10),
('Kalawad Road', 'Rajkot', 'Gujarat', 22.2735, 70.7512, 10),
('Gondal Road', 'Rajkot', 'Gujarat', 22.2735, 70.8022, 10);

-- Insert mechanics data based on new CSV structure
INSERT INTO area_mechanics (service_area_id, name, phone, address, services, rating, verified) VALUES
-- Mandvi mechanics (Area ID: 1)
(1, 'Mandvi Car Care', '+919825712345', 'Shop No 50, Mandvi, Vadodara - 390001', ARRAY['Engine Repair', 'AC Service', 'General Service', 'Oil Change'], 4.5, true),
(1, 'Mandvi Auto Service', '+918200487838', 'Near Mandvi Gate, Vadodara - 390001', ARRAY['Brake Service', 'Tire Replacement', 'Battery Service', 'Emergency Service'], 4.3, true),
(1, 'Royal Motors Mandvi', '+919876543210', 'Mandvi Main Road, Vadodara - 390001', ARRAY['Engine Diagnostics', 'Electrical Work', 'Transmission Service'], 4.6, true),

-- Karelibaug mechanics (Area ID: 2)
(2, 'Karelibaug Auto Hub', '+918765432109', 'Karelibaug Circle, Vadodara - 390018', ARRAY['Engine Repair', 'AC Service', 'Brake Service', 'Oil Change'], 4.4, true),
(2, 'Quick Fix Karelibaug', '+917654321098', 'Near Karelibaug Bus Stand, Vadodara - 390018', ARRAY['Emergency Service', 'Towing Service', 'Jump Start', 'Fuel Delivery'], 4.7, true),
(2, 'Khaswadi Motors', '+916543210987', 'Khaswadi Road, Karelibaug, Vadodara - 390018', ARRAY['Tire Service', 'Battery Replacement', 'General Service'], 4.2, true),

-- Alkapuri mechanics (Area ID: 3)
(3, 'Alkapuri Service Center', '+915432109876', 'RC Dutt Road, Alkapuri, Vadodara - 390007', ARRAY['Engine Repair', 'Transmission Service', 'AC Service'], 4.5, true),
(3, 'City Motors Alkapuri', '+914321098765', 'Near Alkapuri Circle, Vadodara - 390007', ARRAY['Brake Service', 'Electrical Work', 'Oil Change', 'General Service'], 4.3, true),

-- Sayajigunj mechanics (Area ID: 4)
(4, 'Sayaji Auto Works', '+913210987654', 'Sayajigunj Main Road, Vadodara - 390005', ARRAY['Engine Repair', 'AC Service', 'Battery Service'], 4.6, true),
(4, 'Garden City Motors', '+912109876543', 'Near Sayaji Garden, Vadodara - 390005', ARRAY['Tire Replacement', 'Brake Service', 'Emergency Service'], 4.4, true),

-- Fatehgunj mechanics (Area ID: 5)
(5, 'Fatehgunj Auto Care', '+911098765432', 'Fatehgunj Circle, Vadodara - 390002', ARRAY['Engine Diagnostics', 'Electrical Work', 'General Service'], 4.5, true),
(5, 'Express Service Fatehgunj', '+919988776655', 'Near Railway Station, Fatehgunj, Vadodara - 390002', ARRAY['Emergency Service', 'Towing Service', 'AC Service'], 4.8, true),

-- Manjalpur mechanics (Area ID: 6)
(6, 'Manjalpur Motors', '+918877665544', 'GIDC Road, Manjalpur, Vadodara - 390011', ARRAY['Engine Repair', 'Transmission Service', 'Heavy Vehicle Service'], 4.4, true),
(6, 'Highway Auto Manjalpur', '+917766554433', 'NH-8, Manjalpur, Vadodara - 390011', ARRAY['Tire Service', 'Battery Replacement', 'Fuel Delivery'], 4.6, true),

-- Waghodia Road mechanics (Area ID: 7)
(7, 'Waghodia Auto Hub', '+916655443322', 'Waghodia Road, Vadodara - 390019', ARRAY['Engine Repair', 'AC Service', 'Brake Service'], 4.3, true),
(7, 'Road King Motors', '+915544332211', 'Near Waghodia Circle, Vadodara - 390019', ARRAY['Emergency Service', 'Towing Service', 'General Service'], 4.7, true),

-- Gotri mechanics (Area ID: 8)
(8, 'Gotri Service Station', '+914433221100', 'Gotri Main Road, Vadodara - 390021', ARRAY['Engine Repair', 'Oil Change', 'Battery Service'], 4.2, true),
(8, 'Modern Motors Gotri', '+913322110099', 'Near Gotri Bridge, Vadodara - 390021', ARRAY['AC Service', 'Electrical Work', 'Tire Replacement'], 4.5, true),

-- Nizampura mechanics (Area ID: 9)
(9, 'Nizampura Auto Works', '+912211009988', 'Nizampura Main Road, Vadodara - 390002', ARRAY['Engine Repair', 'Brake Service', 'General Service'], 4.4, true),
(9, 'City Service Nizampura', '+911100998877', 'Near Nizampura Circle, Vadodara - 390002', ARRAY['Emergency Service', 'AC Service', 'Battery Replacement'], 4.6, true),

-- Vasna mechanics (Area ID: 10)
(10, 'Vasna Motors', '+919988776644', 'Vasna Road, Vadodara - 390007', ARRAY['Engine Repair', 'Transmission Service', 'Oil Change'], 4.3, true),
(10, 'Quick Service Vasna', '+918877665533', 'Near Vasna Bus Stand, Vadodara - 390007', ARRAY['Tire Service', 'Battery Service', 'Emergency Service'], 4.5, true),

-- Ahmedabad mechanics
(16, 'Satellite Auto Care', '+917766554422', 'SG Highway, Satellite, Ahmedabad - 380015', ARRAY['Luxury Car Service', 'Engine Repair', 'AC Service'], 4.7, true),
(17, 'Vastrapur Service Hub', '+916655443311', 'Vastrapur Lake Road, Ahmedabad - 380015', ARRAY['Brake Service', 'Electrical Work', 'General Service'], 4.4, true),
(18, 'Bopal Motors', '+915544332200', 'Bopal Cross Roads, Ahmedabad - 380058', ARRAY['Engine Diagnostics', 'Tire Service', 'Emergency Service'], 4.6, true),

-- Surat mechanics
(22, 'Adajan Auto Works', '+914433221199', 'Adajan Patiya, Surat - 395009', ARRAY['Engine Repair', 'AC Service', 'General Service'], 4.5, true),
(23, 'Vesu Service Center', '+913322110088', 'Vesu Main Road, Surat - 395007', ARRAY['Brake Service', 'Battery Service', 'Oil Change'], 4.3, true),

-- Rajkot mechanics
(26, 'University Road Garage', '+912211009977', 'University Road, Rajkot - 360005', ARRAY['Engine Repair', 'Electrical Work', 'General Service'], 4.4, true),
(27, 'Kalawad Auto Service', '+911100998866', 'Kalawad Road, Rajkot - 360001', ARRAY['Tire Service', 'Battery Replacement', 'Emergency Service'], 4.6, true);
