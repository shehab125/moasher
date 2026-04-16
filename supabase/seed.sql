-- Seed data for Moasher
-- Populate regions, districts, and sample transactions

-- 1. Regions
INSERT INTO public.regions (name_ar, name_en) VALUES 
('منطقة الرياض', 'Riyadh Region');

-- 2. Districts (Sample Riyadh Districts)
INSERT INTO public.districts (region_id, name_ar, name_en) VALUES 
(1, 'العليا', 'Al Olaya'),
(1, 'الياسمين', 'Al Yasmin'),
(1, 'الملقا', 'Al Malqa'),
(1, 'حطين', 'Hittin'),
(1, 'النرجس', 'Al Narjis'),
(1, 'الصحافة', 'Al Sahafa'),
(1, 'المروج', 'Al Murooj');

-- 3. Property Types
INSERT INTO public.property_types (name_ar, name_en) VALUES 
('سكني', 'Residential'),
('تجاري', 'Commercial'),
('أرض', 'Land'),
('زراعي', 'Agricultural');

-- 4. Subscription Limits
INSERT INTO public.subscription_limits (plan, max_saved_items, historical_data_years, can_export) VALUES 
('free', 10, 1, false),
('premium', 1000, 10, true);

-- 5. Mock Transactions (Focused on Riyadh)
INSERT INTO public.transactions 
(region_id, district_id, property_type_id, total_price, price_per_meter, area_sqm, transaction_date, latitude, longitude, usage_type, plan_number, parcel_number)
VALUES 
(1, 1, 1, 1200000, 4000, 300, '2023-10-15', 24.7136, 46.6753, 'سكني', '101', '15'),
(1, 2, 2, 5500000, 11000, 500, '2023-10-12', 24.7742, 46.7385, 'تجاري', '202', '24'),
(1, 3, 3, 2100000, 3500, 600, '2023-10-10', 24.8123, 46.6211, 'أرض', '303', '7'),
(1, 4, 1, 1800000, 4500, 400, '2023-10-08', 24.795, 46.65, 'سكني', '404', '12'),
(1, 5, 1, 2400000, 4800, 500, '2023-10-05', 24.825, 46.68, 'سكني', '505', '89'),
(1, 6, 1, 1500000, 4200, 350, '2023-10-02', 24.78, 46.66, 'سكني', '606', '33'),
(1, 7, 2, 3200000, 9000, 355, '2023-09-28', 24.75, 46.69, 'تجاري', '707', '11');
