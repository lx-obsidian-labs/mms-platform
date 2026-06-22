-- ============================================
-- MMS Platform - Content Seed Data
-- Modules and lessons for all 17 courses
-- ============================================

DO $$
DECLARE
  c RECORD;
  mod_data TEXT[][];
  mod_titles TEXT[];
  mod_descs TEXT[];
  lesson_titles TEXT[][];
  m_idx INT;
  l_idx INT;
  mod_id UUID;
BEGIN

-- Define course content structures
-- Format: each course has modules[] and lessons[][]
-- lessons[m_idx] is an array of lesson titles for that module

-- ========================================
-- Forklift Operation
-- ========================================
mod_titles := ARRAY[
  'Introduction & Safety',
  'Machine Components & Controls',
  'Forklift Operations',
  'Maintenance & Inspection'
];
mod_descs := ARRAY[
  'Forklift safety principles, workplace hazards, and personal protective equipment.',
  'Understanding forklift components, control systems, and instrumentation.',
  'Practical operating techniques including loading, stacking, and maneuvering.',
  'Daily inspections, battery maintenance, and basic troubleshooting.'
];
lesson_titles := ARRAY[
  ARRAY['Forklift Safety Overview', 'Workplace Hazard Identification', 'PPE Requirements', 'Site Safety Protocols'],
  ARRAY['Controls & Instrumentation', 'Steering & Braking Systems', 'Hydraulic Systems Overview', 'Mast & Fork Mechanisms'],
  ARRAY['Loading & Unloading Procedures', 'Stacking & Racking Techniques', 'Maneuvering in Confined Spaces', 'Ramp & Slope Operations'],
  ARRAY['Daily Pre-Operation Inspection', 'Battery Charging & Maintenance', 'Common Faults & Troubleshooting', 'Shutdown & Parking Procedures']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'forklift-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 30 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Excavator Operation
-- ========================================
mod_titles := ARRAY[
  'Safety & Site Preparation',
  'Machine Components',
  'Basic Excavator Operations',
  'Advanced Excavator Techniques',
  'Maintenance & Servicing'
];
mod_descs := ARRAY[
  'Excavator site safety, risk assessment, and machine setup procedures.',
  'Understanding excavator components, track systems, and hydraulics.',
  'Fundamental operating techniques for trenching, grading, and loading.',
  'Advanced skills including demolition, fine grading, and slope work.',
  'Preventive maintenance, greasing, and system checks.'
];
lesson_titles := ARRAY[
  ARRAY['Site Safety & Risk Assessment', 'Machine Setup & Stabilization', 'Swing Radius Awareness', 'Underground Utility Safety'],
  ARRAY['Track & Undercarriage Systems', 'Boom, Arm & Bucket', 'Hydraulic System Overview', 'Cab Controls & Display'],
  ARRAY['Trenching Techniques', 'Grading & Leveling', 'Truck Loading Operations', 'Material Handling'],
  ARRAY['Demolition Operations', 'Fine Grading & Finishing', 'Slope & Bench Work', 'Deep Excavation Methods'],
  ARRAY['Daily Greasing Schedule', 'Track Tension Adjustment', 'Fluid Level Checks', 'Storage & Shutdown']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'excavator-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 35 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Front End Loader (FEL)
-- ========================================
mod_titles := ARRAY[
  'Safety & Pre-Operation',
  'Loader Controls & Systems',
  'Loading & Material Handling',
  'Daily Maintenance'
];
mod_descs := ARRAY[
  'Loader safety protocols, site awareness, and pre-operation checks.',
  'Understanding loader controls, hydraulics, and transmission systems.',
  'Techniques for truck loading, stockpile management, and material handling.',
  'Lubrication, tire care, and daily inspection procedures.'
];
lesson_titles := ARRAY[
  ARRAY['Loader Safety Overview', 'Pre-Operation Inspection', 'Site Hazard Assessment', 'Communication & Signaling'],
  ARRAY['Bucket Controls & Hydraulics', 'Steering & Transmission', 'Dashboard Instruments', 'Joystick Operations'],
  ARRAY['Loading Trucks', 'Stockpile Management', 'Material Grading', 'Cycle Time Optimization'],
  ARRAY['Grease Points & Lubrication', 'Tire Inspection & Care', 'Engine & Fluid Checks', 'Daily Logbook']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'front-end-loader-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 25 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- TLB (Tractor Loader Backhoe)
-- ========================================
mod_titles := ARRAY[
  'Safety & Setup',
  'Loader Operations',
  'Backhoe Operations',
  'Transport & Maintenance'
];
mod_descs := ARRAY[
  'TLB safety, stabilizer setup, and site preparation.',
  'Front loader operation for digging, loading, and grading.',
  'Backhoe operation for trenching, excavating, and pipe work.',
  'Road transport preparation and daily maintenance procedures.'
];
lesson_titles := ARRAY[
  ARRAY['TLB Safety Protocols', 'Stabilizer Setup & Leveling', 'Site Assessment', 'Pre-Operation Checks'],
  ARRAY['Loader Bucket Control', 'Digging & Loading', 'Grading & Leveling', 'Material Spreading'],
  ARRAY['Backhoe Controls', 'Trenching Operations', 'Pipe Laying Preparation', 'Backfilling Techniques'],
  ARRAY['Road Transport Positioning', 'Daily Lubrication', 'Hydraulic System Checks', 'Storage Procedures']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'tlb-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 30 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- ADT (Articulated Dump Truck)
-- ========================================
mod_titles := ARRAY[
  'Safety & Site Navigation',
  'ADT Controls & Systems',
  'Hauling & Dumping Operations',
  'Maintenance & Inspections'
];
mod_descs := ARRAY[
  'ADT safety, mine road rules, and site navigation protocols.',
  'Understanding ADT articulation, transmission, and braking systems.',
  'Loading, hauling, dumping techniques and cycle management.',
  'Preventive maintenance, tire care, and inspection routines.'
];
lesson_titles := ARRAY[
  ARRAY['ADT Site Safety', 'Mine Road Rules', 'Right of Way Protocols', 'Emergency Procedures'],
  ARRAY['Articulation Steering', 'Transmission & Retarder', 'Braking Systems', 'Cab Controls'],
  ARRAY['Loading Positioning', 'Hauling Techniques', 'Dumping Procedures', 'Cycle Time Management'],
  ARRAY['Tire Inspection', 'Fluid Checks', 'Grease Points', 'Pre-Shift Inspection']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'adt-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 30 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Dump Truck 777D
-- ========================================
mod_titles := ARRAY[
  'Safety & Mine Site Protocols',
  '777D Systems & Controls',
  'High-Capacity Hauling',
  'Emergency & Maintenance'
];
mod_descs := ARRAY[
  'Advanced safety protocols for large mining trucks and mine site operations.',
  'Caterpillar 777D systems, controls, and display interfaces.',
  'High-capacity hauling techniques, loading positioning, and dump procedures.',
  'Emergency procedures and preventive maintenance schedules.'
];
lesson_titles := ARRAY[
  ARRAY['Large Truck Safety', 'Mine Site Traffic Management', 'Blind Spot Awareness', 'Emergency Escape Protocols'],
  ARRAY['CAT 777D Overview', 'Engine & Powertrain', 'Suspension & Braking', 'VIMS Display System'],
  ARRAY['Loading Positioning', 'Haul Road Operations', 'Dumping at Tip', 'Grade & Ramp Management'],
  ARRAY['Fire Suppression Systems', 'Tire Management', 'Daily Inspection', 'Scheduled Maintenance']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'dump-truck-777d-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 40 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Tracked Dozer
-- ========================================
mod_titles := ARRAY[
  'Safety & Site Preparation',
  'Dozer Components & Controls',
  'Dozing Operations',
  'Advanced Dozer Work',
  'Maintenance'
];
mod_descs := ARRAY[
  'Dozer safety, site assessment, and preparation techniques.',
  'Understanding dozer blade controls, ripper, and track systems.',
  'Basic dozing, pushing, and spreading techniques.',
  'Ripping, slope work, and fine grading with GPS.',
  'Undercarriage maintenance and daily inspections.'
];
lesson_titles := ARRAY[
  ARRAY['Dozer Safety Protocols', 'Site Assessment', 'Ground Conditions', 'Support Equipment Coordination'],
  ARRAY['Blade Controls', 'Ripper Operation', 'Track & Undercarriage', 'Cab Controls'],
  ARRAY['Straight Dozing', 'Slot Dozing', 'Side Casting', 'Spreading & Leveling'],
  ARRAY['Ripping Techniques', 'Slope & Bench Work', 'GPS Grade Control', 'Fine Grading'],
  ARRAY['Undercarriage Inspection', 'Track Tension', 'Fluid Checks', 'Daily Greasing']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'tracked-dozer-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 35 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Grader
-- ========================================
mod_titles := ARRAY[
  'Safety & Preparation',
  'Grader Controls & Setup',
  'Grading Operations',
  'Advanced Grading & Maintenance'
];
mod_descs := ARRAY[
  'Grader safety, site preparation, and blade awareness.',
  'Understanding moldboard controls, articulation, and circle systems.',
  'Basic grading, ditching, and road maintenance techniques.',
  'Fine grading, slope work, and daily maintenance.'
];
lesson_titles := ARRAY[
  ARRAY['Grader Safety', 'Blade Awareness', 'Site Traffic Control', 'Pre-Operation Checks'],
  ARRAY['Moldboard Controls', 'Articulation & Frame', 'Circle & Tilt Systems', 'Ripper Controls'],
  ARRAY['Flat Grading', 'Ditching Operations', 'Road Crown Maintenance', 'Shoulder Repair'],
  ARRAY['Fine Grading Techniques', 'Slope Grading', 'GPS-Aided Grading', 'Daily Maintenance']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'grader-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 25 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Roller
-- ========================================
mod_titles := ARRAY[
  'Safety & Site Knowledge',
  'Roller Controls & Types',
  'Compaction Operations',
  'Maintenance'
];
mod_descs := ARRAY[
  'Roller safety, ground conditions, and site awareness.',
  'Understanding vibratory and static roller controls.',
  'Compaction techniques for different soil and asphalt types.',
  'Daily inspections and roller maintenance.'
];
lesson_titles := ARRAY[
  ARRAY['Roller Safety', 'Ground Condition Assessment', 'Slope Safety', 'Site Communication'],
  ARRAY['Vibratory vs Static', 'Vibration Controls', 'Drum Systems', 'Water Spray Systems'],
  ARRAY['Soil Compaction', 'Asphalt Compaction', 'Pass Pattern Technique', 'Edge Rolling'],
  ARRAY['Daily Inspection', 'Grease Points', 'Water System Maintenance', 'Transport Procedures']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'roller-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 25 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Tractor
-- ========================================
mod_titles := ARRAY[
  'Safety & Basic Knowledge',
  'Tractor Controls & Implements',
  'Field Operations',
  'Maintenance & Storage'
];
mod_descs := ARRAY[
  'Tractor safety, basic operation principles, and pre-use checks.',
  'Understanding PTO, hydraulics, and implement attachment systems.',
  'Ploughing, hauling, and field operation techniques.',
  'Routine maintenance, storage, and troubleshooting.'
];
lesson_titles := ARRAY[
  ARRAY['Tractor Safety', 'Pre-Use Inspection', 'Basic Controls', 'Starting & Stopping'],
  ARRAY['PTO Operation', 'Three-Point Linkage', 'Hydraulics & Remotes', 'Implement Attachment'],
  ARRAY['Ploughing Techniques', 'Trailer Hauling', 'Field Preparation', 'Post-Operation Procedures'],
  ARRAY['Engine Maintenance', 'Tire Care', 'Storage Procedures', 'Common Issues']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'tractor-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 25 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Bobcat (Skid Steer Loader)
-- ========================================
mod_titles := ARRAY[
  'Safety & Site Awareness',
  'Bobcat Controls & Attachments',
  'Operating Techniques',
  'Maintenance'
];
mod_descs := ARRAY[
  'Skid steer safety, confined space awareness, and site protocols.',
  'Understanding bobcat controls, hydraulics, and quick-attach systems.',
  'Techniques for digging, grading, and material handling.',
  'Daily checks, fluid maintenance, and attachment care.'
];
lesson_titles := ARRAY[
  ARRAY['Bobcat Safety', 'Confined Space Operation', 'Site Hazard Awareness', 'Pre-Operation Checks'],
  ARRAY['Joystick Controls', 'Quick-Attach System', 'Auxiliary Hydraulics', 'Attachment Overview'],
  ARRAY['Digging Techniques', 'Grading & Leveling', 'Material Handling', 'Backfilling'],
  ARRAY['Daily Inspection', 'Fluid Checks', 'Track & Tire Care', 'Attachment Maintenance']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'bobcat-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 25 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- LHD Scoop (Load Haul Dump)
-- ========================================
mod_titles := ARRAY[
  'Underground Safety',
  'LHD Components & Controls',
  'Loading & Hauling Operations',
  'Underground Dumping',
  'Maintenance'
];
mod_descs := ARRAY[
  'Underground mining safety, ventilation, and emergency procedures.',
  'LHD machine components, bucket controls, and cab systems.',
  'Loading techniques and hauling in confined underground spaces.',
  'Dumping procedures at ore passes and tips.',
  'Underground maintenance and safety checks.'
];
lesson_titles := ARRAY[
  ARRAY['Underground Safety Protocols', 'Ventilation Awareness', 'Emergency Escape Routes', 'Communication Systems'],
  ARRAY['LHD Machine Overview', 'Bucket & Boom Controls', 'Transmission & Braking', 'Cab & Display'],
  ARRAY['Muck Pile Loading', 'Haulage Route Navigation', 'Cycle Optimization', 'Ramp Operations'],
  ARRAY['Ore Pass Dumping', 'Tip Area Safety', 'Clean-Up Operations', 'Dumping Techniques'],
  ARRAY['Pre-Shift Inspection', 'Undercarriage Checks', 'Fluid & Grease', 'Fire Suppression Checks']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'lhd-scoop-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 35 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Drill Rig
-- ========================================
mod_titles := ARRAY[
  'Safety & Site Setup',
  'Drill Rig Components',
  'Drilling Techniques',
  'Advanced Drilling & Maintenance'
];
mod_descs := ARRAY[
  'Drill rig safety, site preparation, and setup procedures.',
  'Understanding drill rig components, rods, and bit types.',
  'Rotary, percussive, and DTH drilling techniques.',
  'Advanced drilling methods and rig maintenance.'
];
lesson_titles := ARRAY[
  ARRAY['Drill Rig Safety', 'Site Preparation', 'Drill Pattern Planning', 'Setup & Leveling'],
  ARRAY['Mast & Feed Systems', 'Rotation & Percussion', 'Rod Handling', 'Bit Types & Selection'],
  ARRAY['Rotary Drilling', 'Down-The-Hole Drilling', 'Percussive Drilling', 'Hole Cleaning Methods'],
  ARRAY['Angle Drilling', 'Grade Control Drilling', 'Daily Maintenance', 'Troubleshooting']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'drill-rig-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 35 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Mobile Crane
-- ========================================
mod_titles := ARRAY[
  'Safety & Regulations',
  'Crane Setup & Rigging',
  'Lifting Operations',
  'Advanced Lifts & Maintenance'
];
mod_descs := ARRAY[
  'Crane safety, regulations, lift planning, and site assessment.',
  'Crane setup, load charts, rigging equipment, and signaling.',
  'Basic lifting, load control, and precision placement.',
  'Critical lifts, tandem lifts, and crane maintenance.',
];
lesson_titles := ARRAY[
  ARRAY['Crane Safety Regulations', 'Lift Planning', 'Site Assessment', 'Sling & Rigging Safety'],
  ARRAY['Crane Setup Procedures', 'Load Chart Reading', 'Rigging Techniques', 'Hand Signals & Radio Comms'],
  ARRAY['Basic Lifting Operations', 'Load Control & Swing', 'Precision Placement', 'Load Testing'],
  ARRAY['Critical Lift Planning', 'Tandem Lift Operations', 'Tower & Boom Assembly', 'Daily Inspection & Maintenance']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'mobile-crane-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 40 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- First Aid
-- ========================================
mod_titles := ARRAY[
  'First Aid Principles',
  'Emergency Response',
  'Wound Management',
  'CPR & Life Support'
];
mod_descs := ARRAY[
  'Basic first aid principles, scene safety, and legal considerations.',
  'Emergency response procedures and incident assessment.',
  'Wound care, bleeding control, and infection prevention.',
  'CPR, rescue breathing, and automated external defibrillator use.'
];
lesson_titles := ARRAY[
  ARRAY['First Aid Principles', 'Scene Safety Assessment', 'Consent & Legal Aspects', 'Barrier Protection'],
  ARRAY['Emergency Response Plan', 'Primary Survey (DRABC)', 'Secondary Survey', 'Calling for Help'],
  ARRAY['Bleeding Control', 'Wound Dressing', 'Burn Management', 'Fracture Immobilization'],
  ARRAY['Adult CPR', 'Child & Infant CPR', 'AED Operation', 'Choking Response']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'first-aid-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 20 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- Fire Fighting
-- ========================================
mod_titles := ARRAY[
  'Fire Prevention & Safety',
  'Fire Extinguisher Operations',
  'Evacuation & Emergency Response',
  'Industrial Fire Scenarios'
];
mod_descs := ARRAY[
  'Fire prevention principles, fire triangle, and hazard identification.',
  'Types of fire extinguishers, operation techniques, and selection.',
  'Evacuation procedures, mustering, and emergency coordination.',
  'Industrial fire scenarios including electrical, fuel, and chemical fires.'
];
lesson_titles := ARRAY[
  ARRAY['Fire Prevention Principles', 'Fire Triangle', 'Hazard Identification', 'Fire Safety Plans'],
  ARRAY['Extinguisher Types & Classes', 'PASS Technique', 'Extinguisher Selection', 'Inspection & Maintenance'],
  ARRAY['Evacuation Procedures', 'Muster Point Assembly', 'Roll Call & Accountability', 'Coordination with Emergency Services'],
  ARRAY['Electrical Fires', 'Fuel & Oil Fires', 'Chemical Fire Response', 'Vehicle & Equipment Fires']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'fire-fighting-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 20 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

-- ========================================
-- SHE Representative
-- ========================================
mod_titles := ARRAY[
  'SHE Legislation & Standards',
  'Hazard Identification & Risk Assessment',
  'Incident Investigation',
  'Compliance & Auditing'
];
mod_descs := ARRAY[
  'OHSA, MHSA, and environmental regulations governing SA mining and industry.',
  'Hazard identification techniques, risk assessment methodology, and controls.',
  'Incident investigation procedures, root cause analysis, and reporting.',
  'SHE compliance auditing, inspections, and continuous improvement systems.'
];
lesson_titles := ARRAY[
  ARRAY['OHSA Overview', 'MHSA Requirements', 'Environmental Regulations', 'SHE Representative Duties'],
  ARRAY['Hazard Identification Methods', 'Risk Assessment Matrix', 'Hierarchy of Controls', 'Job Safety Analysis'],
  ARRAY['Incident Reporting', 'Root Cause Analysis', 'Investigation Techniques', 'Corrective Action Plans'],
  ARRAY['SHE Inspections', 'Compliance Auditing', 'Record Keeping', 'Continuous Improvement']
];

FOR c IN SELECT id, title, slug FROM courses WHERE slug = 'she-representative-training' LOOP
  FOR m_idx IN 1..array_length(mod_titles, 1) LOOP
    INSERT INTO modules (course_id, title, description, module_order)
    VALUES (c.id, mod_titles[m_idx], mod_descs[m_idx], m_idx)
    RETURNING id INTO mod_id;
    FOR l_idx IN 1..array_length(lesson_titles[m_idx], 1) LOOP
      INSERT INTO lessons (course_id, module_id, title, description, lesson_type, duration_minutes, order_index, is_published)
      VALUES (c.id, mod_id, lesson_titles[m_idx][l_idx], 'Comprehensive lesson covering ' || lower(lesson_titles[m_idx][l_idx]) || '.', 'video', 30 + (l_idx * 5), l_idx, true);
    END LOOP;
  END LOOP;
END LOOP;

END $$;
