-- ============================================
-- MMS Platform - Seed Data
-- Populates courses table with 17 training programs
-- ============================================

INSERT INTO courses (title, slug, description, short_description, category, level, duration_weeks, duration_hours, price, max_students, prerequisites, certification, is_active, is_featured)
VALUES
  (
    'Forklift Operation',
    'forklift-training',
    'Comprehensive forklift operator training covering load handling, stacking procedures, warehouse safety, and machine maintenance.',
    'Master forklift operation for warehousing and logistics.',
    'Machinery', 'Beginner', 1, 24, 3500, 20,
    'Grade 10 or equivalent, Valid ID document', true, true, true
  ),
  (
    'Excavator Operation',
    'excavator-training',
    'Professional excavator training covering trenching, grading, loading, and demolition operations. Includes safety protocols, machine inspection, and operational efficiency techniques.',
    'Professional excavator operation and safety training.',
    'Machinery', 'Beginner', 1, 40, 5000, 20,
    'Grade 10 or equivalent, Valid ID document, Medical fitness certificate', true, true, true
  ),
  (
    'Front End Loader (FEL)',
    'front-end-loader-training',
    'Complete front end loader training for mining and construction applications. Learn bucket operation, material handling, loading procedures, and safety compliance.',
    'Front end loader operation for mining and construction.',
    'Machinery', 'Beginner', 1, 40, 5000, 20,
    'Grade 10 or equivalent, Valid ID document', true, true, false
  ),
  (
    'TLB (Tractor Loader Backhoe)',
    'tlb-training',
    'Versatile TLB operator training covering loader, backhoe, and tractor functions. Ideal for construction, agriculture, and municipal operations.',
    'Versatile TLB operation for construction and agriculture.',
    'Machinery', 'Beginner', 1, 40, 5000, 20,
    'Grade 10 or equivalent, Valid ID document', true, true, false
  ),
  (
    'Articulated Dump Truck (ADT)',
    'adt-training',
    'Specialized ADT operator training for mining and earthmoving operations. Covers hauling, dumping, site navigation, and machine maintenance.',
    'Articulated dump truck operation for earthmoving.',
    'Machinery', 'Beginner', 1, 40, 5000, 20,
    'Grade 10 or equivalent, Valid ID document, Medical fitness certificate', true, true, false
  ),
  (
    'Dump Truck 777D',
    'dump-truck-777d-training',
    'Advanced training on Caterpillar 777D and similar large mining dump trucks. Covers high-capacity hauling, mine site navigation, and emergency procedures.',
    'Large mining dump truck 777D operation training.',
    'Machinery', 'Intermediate', 1, 40, 7500, 20,
    'Grade 10 or equivalent, Valid ID document, Medical fitness certificate, Prior machinery experience preferred', true, true, true
  ),
  (
    'Tracked Dozer',
    'tracked-dozer-training',
    'Heavy dozer operation training for mining, earthmoving, and site preparation. Covers blade control, ripping, pushing, and terrain management.',
    'Tracked dozer operation for mining and earthmoving.',
    'Machinery', 'Intermediate', 1, 40, 6000, 20,
    'Grade 10 or equivalent, Valid ID document, Medical fitness certificate', true, true, false
  ),
  (
    'Grader',
    'grader-training',
    'Motor grader training for road construction and maintenance. Learn blade control, leveling, ditching, and road surface management.',
    'Motor grader operation for road construction.',
    'Machinery', 'Intermediate', 1, 40, 6500, 20,
    'Grade 10 or equivalent, Valid ID document', true, true, false
  ),
  (
    'Roller',
    'roller-training',
    'Compaction roller training for road construction, earthworks, and surface compaction. Covers vibratory and static roller operation.',
    'Compaction roller operation for road construction.',
    'Machinery', 'Beginner', 1, 40, 5500, 20,
    'Grade 10 or equivalent, Valid ID document', true, true, false
  ),
  (
    'Tractor',
    'tractor-training',
    'Agricultural and industrial tractor training covering ploughing, hauling, implement attachment, and field operation safety.',
    'Tractor operation for agriculture and industry.',
    'Machinery', 'Beginner', 1, 40, 5000, 20,
    'Grade 10 or equivalent, Valid ID document', true, true, false
  ),
  (
    'Bobcat (Skid Steer Loader)',
    'bobcat-training',
    'Compact skid steer loader training for construction, landscaping, and site cleanup. Covers attachment usage and confined space operation.',
    'Bobcat skid steer loader for construction sites.',
    'Machinery', 'Beginner', 1, 40, 4500, 20,
    'Grade 10 or equivalent, Valid ID document', true, true, false
  ),
  (
    'LHD Scoop (Load Haul Dump)',
    'lhd-scoop-training',
    'Underground LHD scoop loader training for mining operations. Covers loading, hauling, and dumping in confined underground environments.',
    'Underground LHD scoop loader mining operation.',
    'Mining', 'Intermediate', 1, 40, 6500, 20,
    'Grade 10 or equivalent, Valid ID document, Medical fitness certificate, Prior machinery experience', true, true, false
  ),
  (
    'Drill Rig',
    'drill-rig-training',
    'Professional drill rig operation training for mining, quarrying, and construction. Covers rotary, percussive, and DTH drilling techniques.',
    'Drill rig operation for mining and quarrying.',
    'Machinery', 'Intermediate', 1, 40, 7000, 20,
    'Grade 10 or equivalent, Valid ID document, Medical fitness certificate', true, true, false
  ),
  (
    'Mobile Crane',
    'mobile-crane-training',
    'Comprehensive mobile crane operator training covering load lifting, rigging, signaling, and crane setup. Prepares for high-demand crane operator roles.',
    'Mobile crane operation and rigging certification.',
    'Machinery', 'Advanced', 3, 120, 8500, 20,
    'Grade 10 or equivalent, Valid ID document, Medical fitness certificate, Prior machinery experience preferred', true, true, true
  ),
  (
    'First Aid',
    'first-aid-training',
    'Workplace first aid certification covering emergency response, wound management, CPR, and injury stabilization. Required for mining and construction environments.',
    'Workplace first aid and emergency response training.',
    'Safety', 'All Levels', 1, 40, 2000, 30,
    'Valid ID document', true, true, false
  ),
  (
    'Fire Fighting',
    'fire-fighting-training',
    'Industrial fire fighting training covering fire prevention, extinguisher use, evacuation procedures, and emergency response for mining and industrial sites.',
    'Industrial fire fighting and prevention certification.',
    'Safety', 'All Levels', 1, 40, 2000, 30,
    'Valid ID document', true, true, false
  ),
  (
    'SHE Representative',
    'she-representative-training',
    'Safety, Health, and Environment representative training aligned with South African OHSA and MHSA regulations. Covers hazard identification, risk assessment, incident investigation, and compliance auditing.',
    'SHE compliance and safety representative certification.',
    'Safety', 'All Levels', 2, 80, 5000, 25,
    'Grade 10 or equivalent, Valid ID document', true, true, true
  )
ON CONFLICT (slug) DO NOTHING;

-- Seed default instructor profile reference
-- (to be updated with actual user IDs after admin registration)
INSERT INTO instructors (user_id, employee_number, specialization, phone, bio, status)
SELECT id, 'INS-001', 'Heavy Machinery', '+27 000 000 000', 'Lead instructor specializing in heavy machinery operation and mining safety.', 'active'
FROM profiles
WHERE email = 'info@mpumalangaminingsolutions.co.za'
  AND NOT EXISTS (SELECT 1 FROM instructors WHERE employee_number = 'INS-001');
