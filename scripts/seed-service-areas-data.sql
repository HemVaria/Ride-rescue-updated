-- Insert service areas with coordinates for major Gujarat cities
INSERT INTO service_areas (area_name, city, state, latitude, longitude, radius_km) VALUES
-- Vadodara areas
('Karelibaug', 'Vadodara', 'Gujarat', 22.3039, 73.1812, 15),
('Alkapuri', 'Vadodara', 'Gujarat', 22.3178, 73.1812, 15),
('Sayajigunj', 'Vadodara', 'Gujarat', 22.3072, 73.1812, 15),
('Fatehgunj', 'Vadodara', 'Gujarat', 22.3178, 73.1812, 15),
('Manjalpur', 'Vadodara', 'Gujarat', 22.2587, 73.1812, 15),

-- Ahmedabad areas
('Satellite', 'Ahmedabad', 'Gujarat', 23.0225, 72.5714, 20),
('Vastrapur', 'Ahmedabad', 'Gujarat', 23.0395, 72.5264, 20),
('Bopal', 'Ahmedabad', 'Gujarat', 23.0395, 72.4569, 20),
('Maninagar', 'Ahmedabad', 'Gujarat', 23.0225, 72.5714, 20),

-- Surat areas
('Adajan', 'Surat', 'Gujarat', 21.2051, 72.8397, 18),
('Vesu', 'Surat', 'Gujarat', 21.1458, 72.7775, 18),
('Citylight', 'Surat', 'Gujarat', 21.2051, 72.8397, 18),

-- Rajkot areas
('University Road', 'Rajkot', 'Gujarat', 22.3039, 70.8022, 15),
('Kalawad Road', 'Rajkot', 'Gujarat', 22.2587, 70.8022, 15);

-- Insert mechanics data based on CSV structure
INSERT INTO area_mechanics (service_area_id, name, phone, address, services, rating, verified) VALUES
-- Karelibaug mechanics
(1, 'Khaswadi Samsan Road Mechanic', '+918044566454', 'Near Khaswadi Samsan Road, Karelibaug, Vadodara - 390018', ARRAY['Engine Repair', 'Brake Service', 'General Service'], 4.5, true),
(1, 'Karelibaug Auto Service', '+918200487838', 'Karelibaug Main Road, Vadodara - 390018', ARRAY['AC Repair', 'Electrical Work', 'Oil Change'], 4.3, true),
(1, 'Quick Fix Garage', '+919876543210', 'Near Karelibaug Circle, Vadodara - 390018', ARRAY['Tire Replacement', 'Battery Replacement', 'Emergency Service'], 4.6, true),

-- Alkapuri mechanics
(2, 'Alkapuri Motors', '+918765432109', 'Alkapuri Society, Vadodara - 390007', ARRAY['Engine Repair', 'Transmission Service', 'General Service'], 4.4, true),
(2, 'City Auto Care', '+917654321098', 'Near Alkapuri Bus Stand, Vadodara - 390007', ARRAY['Brake Service', 'AC Repair', 'Oil Change'], 4.2, true),

-- Sayajigunj mechanics
(3, 'Sayaji Auto Works', '+916543210987', 'Sayajigunj Main Road, Vadodara - 390005', ARRAY['Electrical Work', 'Battery Replacement', 'Emergency Service'], 4.7, true),
(3, 'Royal Garage', '+915432109876', 'Near Sayaji Garden, Vadodara - 390005', ARRAY['Engine Repair', 'Tire Replacement', 'General Service'], 4.5, true),

-- Fatehgunj mechanics
(4, 'Fatehgunj Service Center', '+914321098765', 'Fatehgunj Circle, Vadodara - 390002', ARRAY['AC Repair', 'Brake Service', 'Oil Change'], 4.3, true),
(4, 'Express Auto Repair', '+913210987654', 'Near Fatehgunj Railway Station, Vadodara - 390002', ARRAY['Emergency Service', 'Towing Service', 'Jump Start'], 4.8, true),

-- Manjalpur mechanics
(5, 'Manjalpur Motors', '+912109876543', 'Manjalpur GIDC, Vadodara - 390011', ARRAY['Engine Repair', 'Transmission Service', 'General Service'], 4.4, true),
(5, 'Highway Auto Service', '+911098765432', 'NH-8, Manjalpur, Vadodara - 390011', ARRAY['Tire Replacement', 'Battery Replacement', 'Fuel Delivery'], 4.6, true),

-- Ahmedabad mechanics
(6, 'Satellite Auto Care', '+919988776655', 'Satellite Road, Ahmedabad - 380015', ARRAY['Engine Repair', 'AC Repair', 'General Service'], 4.5, true),
(7, 'Vastrapur Service Hub', '+918877665544', 'Vastrapur Lake Road, Ahmedabad - 380015', ARRAY['Brake Service', 'Electrical Work', 'Oil Change'], 4.3, true),
(8, 'Bopal Motors', '+917766554433', 'Bopal Cross Roads, Ahmedabad - 380058', ARRAY['Tire Replacement', 'Battery Replacement', 'Emergency Service'], 4.7, true),

-- Surat mechanics
(10, 'Adajan Auto Works', '+916655443322', 'Adajan Patiya, Surat - 395009', ARRAY['Engine Repair', 'Transmission Service', 'General Service'], 4.4, true),
(11, 'Vesu Service Center', '+915544332211', 'Vesu Main Road, Surat - 395007', ARRAY['AC Repair', 'Brake Service', 'Oil Change'], 4.2, true),

-- Rajkot mechanics
(13, 'University Road Garage', '+914433221100', 'University Road, Rajkot - 360005', ARRAY['Engine Repair', 'Electrical Work', 'General Service'], 4.6, true),
(14, 'Kalawad Auto Service', '+913322110099', 'Kalawad Road, Rajkot - 360001', ARRAY['Tire Replacement', 'Battery Replacement', 'Emergency Service'], 4.5, true);
