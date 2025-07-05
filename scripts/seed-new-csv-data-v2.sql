-- Clear existing data and reset sequences
TRUNCATE TABLE area_mechanics CASCADE;
TRUNCATE TABLE service_areas RESTART IDENTITY CASCADE;

-- Insert service areas based on new CSV data analysis
INSERT INTO service_areas (area_name, city, state, latitude, longitude, radius_km) VALUES
-- Vadodara areas (based on new CSV data)
('Akota Circle', 'Vadodara', 'Gujarat', 22.2928, 73.2081, 8),
('Alkapuri', 'Vadodara', 'Gujarat', 22.3178, 73.1734, 8),
('Bapod', 'Vadodara', 'Gujarat', 22.2587, 73.1893, 8),
('Chhani', 'Vadodara', 'Gujarat', 22.2733, 73.1956, 8),
('Fatehgunj', 'Vadodara', 'Gujarat', 22.3176, 73.1896, 8),
('Gotri', 'Vadodara', 'Gujarat', 22.2928, 73.2081, 8),
('Harni', 'Vadodara', 'Gujarat', 22.2733, 73.1956, 8),
('Karelibaug', 'Vadodara', 'Gujarat', 22.3039, 73.1812, 8),
('Manjalpur', 'Vadodara', 'Gujarat', 22.2587, 73.1893, 8),
('Mandvi', 'Vadodara', 'Gujarat', 22.3178, 73.1812, 8),
('Nizampura', 'Vadodara', 'Gujarat', 22.3176, 73.1896, 8),
('Old Padra Road', 'Vadodara', 'Gujarat', 22.3072, 73.1512, 8),
('Sama', 'Vadodara', 'Gujarat', 22.2928, 73.2081, 8),
('Sayajigunj', 'Vadodara', 'Gujarat', 22.3072, 73.1812, 8),
('Subhanpura', 'Vadodara', 'Gujarat', 22.2587, 73.1893, 8),
('Tandalja', 'Vadodara', 'Gujarat', 22.3039, 73.1812, 8),
('Vasna', 'Vadodara', 'Gujarat', 22.2928, 73.2081, 8),
('Waghodia Road', 'Vadodara', 'Gujarat', 22.2733, 73.1956, 8),

-- Ahmedabad areas
('Bopal', 'Ahmedabad', 'Gujarat', 23.0395, 72.4294, 12),
('Maninagar', 'Ahmedabad', 'Gujarat', 22.9965, 72.6069, 12),
('Navrangpura', 'Ahmedabad', 'Gujarat', 23.0395, 72.5659, 12),
('Paldi', 'Ahmedabad', 'Gujarat', 23.0176, 72.5797, 12),
('Satellite', 'Ahmedabad', 'Gujarat', 23.0225, 72.5714, 12),
('Vastrapur', 'Ahmedabad', 'Gujarat', 23.0395, 72.5240, 12),

-- Surat areas
('Adajan', 'Surat', 'Gujarat', 21.2051, 72.8397, 10),
('Katargam', 'Surat', 'Gujarat', 21.2297, 72.8406, 10),
('Rander', 'Surat', 'Gujarat', 21.2514, 72.8328, 10),
('Vesu', 'Surat', 'Gujarat', 21.1418, 72.7709, 10),

-- Rajkot areas
('Gondal Road', 'Rajkot', 'Gujarat', 22.2735, 70.8022, 10),
('Kalawad Road', 'Rajkot', 'Gujarat', 22.2735, 70.7512, 10),
('University Road', 'Rajkot', 'Gujarat', 22.2587, 70.7729, 10);

-- Insert mechanics data based on new CSV structure
INSERT INTO area_mechanics (service_area_id, name, phone, address, services, rating, verified, available) VALUES
-- Akota Circle mechanics (Area ID: 1)
(1, 'Akota Circle Auto Garage', '+919825600100', 'Shop 149, Akota Circle, Vadodara - 390020', ARRAY['Engine Repair', 'AC Service', 'General Service', 'Oil Change'], 4.5, true, true),
(1, 'Circle Motors Akota', '+919825600101', 'Near Akota Circle, Vadodara - 390020', ARRAY['Brake Service', 'Tire Replacement', 'Battery Service', 'Emergency Service'], 4.3, true, true),
(1, 'Akota Auto Care', '+919825600102', 'Akota Main Road, Vadodara - 390020', ARRAY['Engine Diagnostics', 'Electrical Work', 'Transmission Service'], 4.6, true, true),

-- Alkapuri mechanics (Area ID: 2)
(2, 'Alkapuri Service Center', '+919825600103', 'RC Dutt Road, Alkapuri, Vadodara - 390007', ARRAY['Engine Repair', 'Transmission Service', 'AC Service'], 4.5, true, true),
(2, 'City Motors Alkapuri', '+919825600104', 'Near Alkapuri Circle, Vadodara - 390007', ARRAY['Brake Service', 'Electrical Work', 'Oil Change', 'General Service'], 4.3, true, true),
(2, 'Royal Garage Alkapuri', '+919825600105', 'Alkapuri Main Road, Vadodara - 390007', ARRAY['Luxury Car Service', 'Engine Repair', 'AC Service'], 4.7, true, true),

-- Bapod mechanics (Area ID: 3)
(3, 'Bapod Auto Works', '+919825600106', 'Bapod Main Road, Vadodara - 390020', ARRAY['Engine Repair', 'Heavy Vehicle Service', 'General Service'], 4.4, true, true),
(3, 'Highway Motors Bapod', '+919825600107', 'NH-8, Bapod, Vadodara - 390020', ARRAY['Tire Service', 'Battery Replacement', 'Fuel Delivery'], 4.6, true, true),
(3, 'Bapod Service Station', '+919825600108', 'Near Bapod Bridge, Vadodara - 390020', ARRAY['Emergency Service', 'Towing Service', 'AC Service'], 4.2, true, true),

-- Chhani mechanics (Area ID: 4)
(4, 'Chhani Auto Hub', '+919825600109', 'Chhani Road, Vadodara - 390002', ARRAY['Engine Repair', 'AC Service', 'Brake Service'], 4.3, true, true),
(4, 'Modern Motors Chhani', '+919825600110', 'Near Chhani Circle, Vadodara - 390002', ARRAY['Emergency Service', 'Towing Service', 'General Service'], 4.7, true, true),
(4, 'Chhani Service Center', '+919825600111', 'Chhani Main Road, Vadodara - 390002', ARRAY['Engine Diagnostics', 'Electrical Work', 'Oil Change'], 4.5, true, true),

-- Fatehgunj mechanics (Area ID: 5)
(5, 'Fatehgunj Auto Care', '+919825600112', 'Fatehgunj Circle, Vadodara - 390002', ARRAY['Engine Diagnostics', 'Electrical Work', 'General Service'], 4.5, true, true),
(5, 'Express Service Fatehgunj', '+919825600113', 'Near Railway Station, Fatehgunj, Vadodara - 390002', ARRAY['Emergency Service', 'Towing Service', 'AC Service'], 4.8, true, true),
(5, 'Station Motors Fatehgunj', '+919825600114', 'Station Road, Fatehgunj, Vadodara - 390002', ARRAY['Brake Service', 'Battery Service', 'Oil Change'], 4.4, true, true),

-- Gotri mechanics (Area ID: 6)
(6, 'Gotri Service Station', '+919825600115', 'Gotri Main Road, Vadodara - 390021', ARRAY['Engine Repair', 'Oil Change', 'Battery Service'], 4.2, true, true),
(6, 'Modern Motors Gotri', '+919825600116', 'Near Gotri Bridge, Vadodara - 390021', ARRAY['AC Service', 'Electrical Work', 'Tire Replacement'], 4.5, true, true),
(6, 'Bridge Auto Gotri', '+919825600117', 'Gotri Bridge Road, Vadodara - 390021', ARRAY['Emergency Service', 'General Service', 'Brake Service'], 4.6, true, true),

-- Harni mechanics (Area ID: 7)
(7, 'Harni Auto Works', '+919825600118', 'Harni Road, Vadodara - 390006', ARRAY['Engine Repair', 'Transmission Service', 'AC Service'], 4.4, true, true),
(7, 'Road King Harni', '+919825600119', 'Near Harni Circle, Vadodara - 390006', ARRAY['Tire Service', 'Battery Replacement', 'Emergency Service'], 4.7, true, true),
(7, 'Harni Service Hub', '+919825600120', 'Harni Main Road, Vadodara - 390006', ARRAY['General Service', 'Oil Change', 'Brake Service'], 4.3, true, true),

-- Karelibaug mechanics (Area ID: 8)
(8, 'Karelibaug Auto Hub', '+919825600121', 'Karelibaug Circle, Vadodara - 390018', ARRAY['Engine Repair', 'AC Service', 'Brake Service', 'Oil Change'], 4.4, true, true),
(8, 'Quick Fix Karelibaug', '+919825600122', 'Near Karelibaug Bus Stand, Vadodara - 390018', ARRAY['Emergency Service', 'Towing Service', 'Jump Start', 'Fuel Delivery'], 4.7, true, true),
(8, 'Khaswadi Motors', '+919825600123', 'Khaswadi Road, Karelibaug, Vadodara - 390018', ARRAY['Tire Service', 'Battery Replacement', 'General Service'], 4.2, true, true),

-- Manjalpur mechanics (Area ID: 9)
(9, 'Manjalpur Motors', '+919825600124', 'GIDC Road, Manjalpur, Vadodara - 390011', ARRAY['Engine Repair', 'Transmission Service', 'Heavy Vehicle Service'], 4.4, true, true),
(9, 'Highway Auto Manjalpur', '+919825600125', 'NH-8, Manjalpur, Vadodara - 390011', ARRAY['Tire Service', 'Battery Replacement', 'Fuel Delivery'], 4.6, true, true),
(9, 'Industrial Motors Manjalpur', '+919825600126', 'GIDC Circle, Manjalpur, Vadodara - 390011', ARRAY['Heavy Vehicle Service', 'Engine Repair', 'General Service'], 4.5, true, true),

-- Mandvi mechanics (Area ID: 10)
(10, 'Mandvi Car Care', '+919825600127', 'Shop No 50, Mandvi, Vadodara - 390001', ARRAY['Engine Repair', 'AC Service', 'General Service', 'Oil Change'], 4.5, true, true),
(10, 'Mandvi Auto Service', '+919825600128', 'Near Mandvi Gate, Vadodara - 390001', ARRAY['Brake Service', 'Tire Replacement', 'Battery Service', 'Emergency Service'], 4.3, true, true),
(10, 'Royal Motors Mandvi', '+919825600129', 'Mandvi Main Road, Vadodara - 390001', ARRAY['Engine Diagnostics', 'Electrical Work', 'Transmission Service'], 4.6, true, true),

-- Nizampura mechanics (Area ID: 11)
(11, 'Nizampura Auto Works', '+919825600130', 'Nizampura Main Road, Vadodara - 390002', ARRAY['Engine Repair', 'Brake Service', 'General Service'], 4.4, true, true),
(11, 'City Service Nizampura', '+919825600131', 'Near Nizampura Circle, Vadodara - 390002', ARRAY['Emergency Service', 'AC Service', 'Battery Replacement'], 4.6, true, true),
(11, 'Nizampura Motors', '+919825600132', 'Nizampura Road, Vadodara - 390002', ARRAY['Oil Change', 'Tire Service', 'Electrical Work'], 4.3, true, true),

-- Old Padra Road mechanics (Area ID: 12)
(12, 'Padra Road Auto Center', '+919825600133', 'Old Padra Road, Vadodara - 390015', ARRAY['Engine Repair', 'AC Service', 'General Service'], 4.5, true, true),
(12, 'Highway Motors Padra', '+919825600134', 'Near Padra Road Circle, Vadodara - 390015', ARRAY['Tire Service', 'Battery Service', 'Emergency Service'], 4.4, true, true),
(12, 'Padra Auto Works', '+919825600135', 'Old Padra Road, Vadodara - 390015', ARRAY['Brake Service', 'Oil Change', 'General Service'], 4.6, true, true),

-- Sama mechanics (Area ID: 13)
(13, 'Sama Service Station', '+919825600136', 'Sama Road, Vadodara - 390008', ARRAY['Engine Repair', 'Transmission Service', 'AC Service'], 4.3, true, true),
(13, 'Modern Auto Sama', '+919825600137', 'Near Sama Circle, Vadodara - 390008', ARRAY['Battery Service', 'Electrical Work', 'General Service'], 4.5, true, true),
(13, 'Sama Motors', '+919825600138', 'Sama Main Road, Vadodara - 390008', ARRAY['Emergency Service', 'Tire Service', 'Oil Change'], 4.4, true, true),

-- Sayajigunj mechanics (Area ID: 14)
(14, 'Sayaji Auto Works', '+919825600139', 'Sayajigunj Main Road, Vadodara - 390005', ARRAY['Engine Repair', 'AC Service', 'Battery Service'], 4.6, true, true),
(14, 'Garden City Motors', '+919825600140', 'Near Sayaji Garden, Vadodara - 390005', ARRAY['Tire Replacement', 'Brake Service', 'Emergency Service'], 4.4, true, true),
(14, 'Sayaji Service Center', '+919825600141', 'Sayajigunj Circle, Vadodara - 390005', ARRAY['General Service', 'Oil Change', 'Electrical Work'], 4.7, true, true),

-- Subhanpura mechanics (Area ID: 15)
(15, 'Subhanpura Auto Hub', '+919825600142', 'Subhanpura Road, Vadodara - 390023', ARRAY['Engine Repair', 'AC Service', 'General Service'], 4.4, true, true),
(15, 'Express Motors Subhanpura', '+919825600143', 'Near Subhanpura Circle, Vadodara - 390023', ARRAY['Emergency Service', 'Towing Service', 'Battery Service'], 4.6, true, true),
(15, 'Subhanpura Service Center', '+919825600144', 'Subhanpura Main Road, Vadodara - 390023', ARRAY['Brake Service', 'Tire Service', 'Oil Change'], 4.3, true, true),

-- Tandalja mechanics (Area ID: 16)
(16, 'Tandalja Motors', '+919825600145', 'Tandalja Road, Vadodara - 390012', ARRAY['Engine Repair', 'Transmission Service', 'AC Service'], 4.5, true, true),
(16, 'Quick Service Tandalja', '+919825600146', 'Near Tandalja Circle, Vadodara - 390012', ARRAY['Battery Service', 'Emergency Service', 'General Service'], 4.4, true, true),
(16, 'Tandalja Auto Works', '+919825600147', 'Tandalja Main Road, Vadodara - 390012', ARRAY['Tire Service', 'Brake Service', 'Oil Change'], 4.6, true, true),

-- Vasna mechanics (Area ID: 17)
(17, 'Vasna Motors', '+919825600148', 'Vasna Road, Vadodara - 390007', ARRAY['Engine Repair', 'Transmission Service', 'Oil Change'], 4.3, true, true),
(17, 'Quick Service Vasna', '+919825600149', 'Near Vasna Bus Stand, Vadodara - 390007', ARRAY['Tire Service', 'Battery Service', 'Emergency Service'], 4.5, true, true),
(17, 'Vasna Auto Care', '+919825600150', 'Vasna Circle, Vadodara - 390007', ARRAY['AC Service', 'General Service', 'Brake Service'], 4.4, true, true),

-- Waghodia Road mechanics (Area ID: 18)
(18, 'Waghodia Auto Hub', '+919825600151', 'Waghodia Road, Vadodara - 390019', ARRAY['Engine Repair', 'AC Service', 'Brake Service'], 4.3, true, true),
(18, 'Road King Motors', '+919825600152', 'Near Waghodia Circle, Vadodara - 390019', ARRAY['Emergency Service', 'Towing Service', 'General Service'], 4.7, true, true),
(18, 'Highway Service Waghodia', '+919825600153', 'Waghodia Road, Vadodara - 390019', ARRAY['Tire Service', 'Battery Service', 'Oil Change'], 4.5, true, true),

-- Ahmedabad mechanics
(19, 'Bopal Motors', '+919825600154', 'Bopal Cross Roads, Ahmedabad - 380058', ARRAY['Engine Diagnostics', 'Tire Service', 'Emergency Service'], 4.6, true, true),
(19, 'Bopal Auto Care', '+919825600155', 'Near Bopal Circle, Ahmedabad - 380058', ARRAY['Luxury Car Service', 'AC Service', 'General Service'], 4.5, true, true),

(20, 'Maninagar Service Hub', '+919825600156', 'Maninagar Main Road, Ahmedabad - 380008', ARRAY['Engine Repair', 'Brake Service', 'Battery Service'], 4.4, true, true),
(20, 'Express Motors Maninagar', '+919825600157', 'Near Maninagar Circle, Ahmedabad - 380008', ARRAY['Emergency Service', 'Towing Service', 'General Service'], 4.6, true, true),

(21, 'Navrangpura Auto Works', '+919825600158', 'Navrangpura Road, Ahmedabad - 380009', ARRAY['Engine Repair', 'AC Service', 'Electrical Work'], 4.5, true, true),
(21, 'City Motors Navrangpura', '+919825600159', 'Near Navrangpura Circle, Ahmedabad - 380009', ARRAY['Tire Service', 'Battery Service', 'Oil Change'], 4.3, true, true),

(22, 'Paldi Service Center', '+919825600160', 'Paldi Main Road, Ahmedabad - 380007', ARRAY['Engine Repair', 'Brake Service', 'General Service'], 4.4, true, true),
(22, 'Modern Motors Paldi', '+919825600161', 'Near Paldi Circle, Ahmedabad - 380007', ARRAY['AC Service', 'Emergency Service', 'Tire Service'], 4.6, true, true),

(23, 'Satellite Auto Care', '+919825600162', 'SG Highway, Satellite, Ahmedabad - 380015', ARRAY['Luxury Car Service', 'Engine Repair', 'AC Service'], 4.7, true, true),
(23, 'Highway Motors Satellite', '+919825600163', 'Satellite Road, Ahmedabad - 380015', ARRAY['Emergency Service', 'Towing Service', 'General Service'], 4.5, true, true),

(24, 'Vastrapur Service Hub', '+919825600164', 'Vastrapur Lake Road, Ahmedabad - 380015', ARRAY['Brake Service', 'Electrical Work', 'General Service'], 4.4, true, true),
(24, 'Lake Motors Vastrapur', '+919825600165', 'Near Vastrapur Lake, Ahmedabad - 380015', ARRAY['Engine Repair', 'AC Service', 'Battery Service'], 4.6, true, true),

-- Surat mechanics
(25, 'Adajan Auto Works', '+919825600166', 'Adajan Patiya, Surat - 395009', ARRAY['Engine Repair', 'AC Service', 'General Service'], 4.5, true, true),
(25, 'Modern Service Adajan', '+919825600167', 'Near Adajan Circle, Surat - 395009', ARRAY['Emergency Service', 'Tire Service', 'Battery Service'], 4.4, true, true),

(26, 'Katargam Motors', '+919825600168', 'Katargam Road, Surat - 395004', ARRAY['Engine Repair', 'Brake Service', 'Oil Change'], 4.3, true, true),
(26, 'Express Auto Katargam', '+919825600169', 'Near Katargam Circle, Surat - 395004', ARRAY['Emergency Service', 'AC Service', 'General Service'], 4.6, true, true),

(27, 'Rander Service Station', '+919825600170', 'Rander Road, Surat - 395009', ARRAY['Engine Repair', 'Transmission Service', 'Battery Service'], 4.4, true, true),
(27, 'Highway Motors Rander', '+919825600171', 'Near Rander Bridge, Surat - 395009', ARRAY['Tire Service', 'Emergency Service', 'General Service'], 4.5, true, true),

(28, 'Vesu Service Center', '+919825600172', 'Vesu Main Road, Surat - 395007', ARRAY['Brake Service', 'Battery Service', 'Oil Change'], 4.3, true, true),
(28, 'Modern Auto Vesu', '+919825600173', 'Near Vesu Circle, Surat - 395007', ARRAY['Engine Repair', 'AC Service', 'Emergency Service'], 4.6, true, true),

-- Rajkot mechanics
(29, 'Gondal Road Garage', '+919825600174', 'Gondal Road, Rajkot - 360002', ARRAY['Engine Repair', 'Transmission Service', 'General Service'], 4.4, true, true),
(29, 'Highway Service Gondal', '+919825600175', 'Near Gondal Road Circle, Rajkot - 360002', ARRAY['Emergency Service', 'Tire Service', 'Battery Service'], 4.5, true, true),

(30, 'Kalawad Auto Service', '+919825600176', 'Kalawad Road, Rajkot - 360001', ARRAY['Tire Service', 'Battery Replacement', 'Emergency Service'], 4.6, true, true),
(30, 'Road King Kalawad', '+919825600177', 'Near Kalawad Circle, Rajkot - 360001', ARRAY['Engine Repair', 'AC Service', 'General Service'], 4.4, true, true),

(31, 'University Road Garage', '+919825600178', 'University Road, Rajkot - 360005', ARRAY['Engine Repair', 'Electrical Work', 'General Service'], 4.4, true, true),
(31, 'Campus Motors University', '+919825600179', 'Near University Circle, Rajkot - 360005', ARRAY['Brake Service', 'Battery Service', 'Emergency Service'], 4.6, true, true);
