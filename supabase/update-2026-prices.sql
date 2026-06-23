-- ============================================
-- MMS 2026 Official Price List Update
-- Run this in Supabase SQL editor if courses
-- already exist (seed.sql uses ON CONFLICT DO NOTHING)
-- ============================================

UPDATE courses SET price = 3500,  duration_weeks = 1, duration_hours = 24,  level = 'Beginner'    WHERE slug = 'forklift-training';
UPDATE courses SET price = 5000,  duration_weeks = 1, duration_hours = 40,  level = 'Beginner'    WHERE slug = 'excavator-training';
UPDATE courses SET price = 5000,  duration_weeks = 1, duration_hours = 40,  level = 'Beginner'    WHERE slug = 'front-end-loader-training';
UPDATE courses SET price = 5000,  duration_weeks = 1, duration_hours = 40,  level = 'Beginner'    WHERE slug = 'tlb-training';
UPDATE courses SET price = 5000,  duration_weeks = 1, duration_hours = 40,  level = 'Beginner'    WHERE slug = 'adt-training';
UPDATE courses SET price = 7500,  duration_weeks = 1, duration_hours = 40,  level = 'Intermediate' WHERE slug = 'dump-truck-777d-training';
UPDATE courses SET price = 6000,  duration_weeks = 1, duration_hours = 40,  level = 'Intermediate' WHERE slug = 'tracked-dozer-training';
UPDATE courses SET price = 6500,  duration_weeks = 1, duration_hours = 40,  level = 'Intermediate' WHERE slug = 'grader-training';
UPDATE courses SET price = 5500,  duration_weeks = 1, duration_hours = 40,  level = 'Beginner'    WHERE slug = 'roller-training';
UPDATE courses SET price = 5000,  duration_weeks = 1, duration_hours = 40,  level = 'Beginner'    WHERE slug = 'tractor-training';
UPDATE courses SET price = 4500,  duration_weeks = 1, duration_hours = 40,  level = 'Beginner'    WHERE slug = 'bobcat-training';
UPDATE courses SET price = 6500,  duration_weeks = 1, duration_hours = 40,  level = 'Intermediate' WHERE slug = 'lhd-scoop-training';
UPDATE courses SET price = 7000,  duration_weeks = 1, duration_hours = 40,  level = 'Intermediate' WHERE slug = 'drill-rig-training';
UPDATE courses SET price = 8500,  duration_weeks = 3, duration_hours = 120, level = 'Advanced'    WHERE slug = 'mobile-crane-training';
UPDATE courses SET price = 2000,  duration_weeks = 1, duration_hours = 40,  level = 'All Levels'  WHERE slug = 'first-aid-training';
UPDATE courses SET price = 2000,  duration_weeks = 1, duration_hours = 40,  level = 'All Levels'  WHERE slug = 'fire-fighting-training';
UPDATE courses SET price = 5000,  duration_weeks = 2, duration_hours = 80,  level = 'All Levels'  WHERE slug = 'she-representative-training';
