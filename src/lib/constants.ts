// ============================================
// MMS BUSINESS CONSTANTS
// ============================================

export const COMPANY = {
  name: "Mpumalanga Mining Solutions",
  shortName: "MMS",
  tagline: "Building The Future Of Mining",
  description:
    "South Africa's premier mining and heavy machinery training institution. We provide industry-recognized certification, hands-on practical training, and expert-led courses for the mining and industrial sector.",
  location: "Middelburg, Mpumalanga, South Africa",
  email: "info@mpumalangaminingsolutions.co.za",
  phone: "+27 000 000 000",
  whatsapp: "+27 000 000 000",
  registrationNumber: "",
  website: "https://mpumalangaminingsolutions.co.za",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
  { label: "Apply", href: "/apply" },
  { label: "Contact", href: "/contact" },
  { label: "Support", href: "/support" },
] as const;

// ============================================
// ABOUT PAGE DATA
// ============================================

export const MISSION =
  "To provide accessible, high-quality mining and heavy machinery training that empowers individuals with industry-recognized skills, promotes workplace safety, and drives economic growth across South Africa.";

export const VISION =
  "To become South Africa's leading digital-first mining training institution — recognized nationally for excellence in machinery operation, safety compliance, and graduate employability.";

export const CORE_VALUES = [
  {
    title: "Safety First",
    description: "Every training program prioritizes the health, safety, and well-being of our students and the communities they serve.",
    icon: "Shield",
  },
  {
    title: "Excellence",
    description: "We maintain the highest standards in training delivery, assessment, and certification — ensuring graduates are industry-ready.",
    icon: "Award",
  },
  {
    title: "Integrity",
    description: "We operate with transparency, honesty, and accountability in every interaction with students, partners, and regulators.",
    icon: "Scale",
  },
  {
    title: "Innovation",
    description: "We leverage modern technology and digital tools to make training more accessible, efficient, and impactful.",
    icon: "Lightbulb",
  },
  {
    title: "Empowerment",
    description: "We believe in transforming lives through education — creating pathways to employment and professional growth.",
    icon: "Heart",
  },
  {
    title: "Community",
    description: "We build a supportive network of students, instructors, and industry partners committed to shared success.",
    icon: "Users",
  },
] as const;

export const TRAINING_PHILOSOPHY = [
  {
    title: "Theory Meets Practice",
    description: "Our programs balance rigorous theoretical foundations with extensive hands-on practical training using real machinery and simulated mining environments.",
  },
  {
    title: "Industry-Aligned Curriculum",
    description: "Every course is designed in consultation with mining industry experts and aligned with MQA standards, ensuring graduates meet employer expectations from day one.",
  },
  {
    title: "Continuous Assessment",
    description: "Students undergo regular knowledge checks, practical evaluations, and competency assessments to ensure skill mastery before certification.",
  },
  {
    title: "Digital-First Learning",
    description: "Our online portal enables students to access learning materials, track progress, and receive support anytime — even from remote locations.",
  },
] as const;

// ============================================
// ALL COURSES (17 training programs)
// ============================================

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: "Machinery" | "Safety" | "Mining" | "Industrial";
  level: string;
  durationWeeks: number;
  durationHours: number;
  price: number;
  certification: boolean;
  isFeatured: boolean;
  icon: string;
  image: string;
  outcomes: string[];
  prerequisites: string[];
}

export const ALL_COURSES: Course[] = [
  {
    id: "forklift-operation",
    title: "Forklift Operation",
    slug: "forklift-training",
    description: "Comprehensive forklift operator training covering load handling, stacking procedures, warehouse safety, and machine maintenance.",
    shortDescription: "Master forklift operation for warehousing and logistics.",
    category: "Machinery",
    level: "Beginner",
    durationWeeks: 1,
    durationHours: 24,
    price: 3500,
    certification: true,
    isFeatured: true,
    icon: "Forklift",
    image: "/images/courses/forklift.jpg",
    outcomes: ["Operate forklifts safely in warehouse and yard environments", "Perform pre-operational inspections and basic maintenance", "Understand load charts and weight distribution", "Apply SA safety regulations for forklift operation"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document"],
  },
  {
    id: "excavator-operation",
    title: "Excavator Operation",
    slug: "excavator-training",
    description: "Professional excavator training covering trenching, grading, loading, and demolition operations. Includes safety protocols, machine inspection, and operational efficiency techniques.",
    shortDescription: "Professional excavator operation and safety training.",
    category: "Machinery",
    level: "Beginner",
    durationWeeks: 1,
    durationHours: 40,
    price: 5000,
    certification: true,
    isFeatured: true,
    icon: "Truck",
    image: "/images/courses/excavator.jpg",
    outcomes: ["Operate excavators for trenching, loading, and grading", "Perform daily machine inspections", "Understand hydraulic systems and attachment usage", "Apply safety procedures for excavation work"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document", "Medical fitness certificate"],
  },
  {
    id: "front-end-loader",
    title: "Front End Loader (FEL)",
    slug: "front-end-loader-training",
    description: "Complete front end loader training for mining and construction applications. Learn bucket operation, material handling, loading procedures, and safety compliance.",
    shortDescription: "Front end loader operation for mining and construction.",
    category: "Machinery",
    level: "Beginner",
    durationWeeks: 1,
    durationHours: 40,
    price: 5000,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/front-end-loader.jpg",
    outcomes: ["Operate FEL machines for loading and material handling", "Perform pre-start checks and routine maintenance", "Understand load capacities and safe operating procedures", "Work safely in mining and construction environments"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document"],
  },
  {
    id: "tlb-operation",
    title: "TLB (Tractor Loader Backhoe)",
    slug: "tlb-training",
    description: "Versatile TLB operator training covering loader, backhoe, and tractor functions. Ideal for construction, agriculture, and municipal operations.",
    shortDescription: "Versatile TLB operation for construction and agriculture.",
    category: "Machinery",
    level: "Beginner",
    durationWeeks: 1,
    durationHours: 40,
    price: 5000,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/tlb.jpg",
    outcomes: ["Operate TLB loader and backhoe attachments", "Perform trenching, loading, and grading operations", "Conduct machine inspections and basic maintenance", "Apply safety protocols across different work environments"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document"],
  },
  {
    id: "adt-operation",
    title: "Articulated Dump Truck (ADT)",
    slug: "adt-training",
    description: "Specialized ADT operator training for mining and earthmoving operations. Covers hauling, dumping, site navigation, and machine maintenance.",
    shortDescription: "Articulated dump truck operation for earthmoving.",
    category: "Machinery",
    level: "Beginner",
    durationWeeks: 1,
    durationHours: 40,
    price: 5000,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/adt.jpg",
    outcomes: ["Operate ADT safely on mining and construction sites", "Understand braking systems and articulation mechanics", "Perform haul road assessment and safe dumping", "Conduct pre-operational inspections"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document", "Medical fitness certificate"],
  },
  {
    id: "dump-truck-777d",
    title: "Dump Truck 777D",
    slug: "dump-truck-777d-training",
    description: "Advanced training on Caterpillar 777D and similar large mining dump trucks. Covers high-capacity hauling, mine site navigation, and emergency procedures.",
    shortDescription: "Large mining dump truck 777D operation training.",
    category: "Machinery",
    level: "Intermediate",
    durationWeeks: 1,
    durationHours: 40,
    price: 7500,
    certification: true,
    isFeatured: true,
    icon: "Truck",
    image: "/images/courses/dump-truck-777d.jpg",
    outcomes: ["Operate CAT 777D and similar large dump trucks", "Navigate mine haul roads safely", "Understand payload management and weighbridge procedures", "Respond to emergency situations"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document", "Medical fitness certificate", "Prior machinery experience preferred"],
  },
  {
    id: "tracked-dozer",
    title: "Tracked Dozer",
    slug: "tracked-dozer-training",
    description: "Heavy dozer operation training for mining, earthmoving, and site preparation. Covers blade control, ripping, pushing, and terrain management.",
    shortDescription: "Tracked dozer operation for mining and earthmoving.",
    category: "Machinery",
    level: "Intermediate",
    durationWeeks: 1,
    durationHours: 40,
    price: 6000,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/tracked-dozer.jpg",
    outcomes: ["Operate tracked dozers for pushing and grading", "Control blade for precision earthmoving", "Perform ripping and site preparation", "Maintain tracks and undercarriage components"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document", "Medical fitness certificate"],
  },
  {
    id: "grader-operation",
    title: "Grader",
    slug: "grader-training",
    description: "Motor grader training for road construction and maintenance. Learn blade control, leveling, ditching, and road surface management.",
    shortDescription: "Motor grader operation for road construction.",
    category: "Machinery",
    level: "Intermediate",
    durationWeeks: 1,
    durationHours: 40,
    price: 6500,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/grader.jpg",
    outcomes: ["Operate motor graders for road construction and maintenance", "Perform fine grading and leveling operations", "Cut ditches and manage road surfaces", "Conduct daily machine inspections"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document"],
  },
  {
    id: "roller-operation",
    title: "Roller",
    slug: "roller-training",
    description: "Compaction roller training for road construction, earthworks, and surface compaction. Covers vibratory and static roller operation.",
    shortDescription: "Compaction roller operation for road construction.",
    category: "Machinery",
    level: "Beginner",
    durationWeeks: 1,
    durationHours: 40,
    price: 5500,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/roller.jpg",
    outcomes: ["Operate vibratory and static compaction rollers", "Understand compaction principles and soil types", "Perform compaction testing and quality checks", "Maintain roller drum and water systems"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document"],
  },
  {
    id: "tractor-operation",
    title: "Tractor",
    slug: "tractor-training",
    description: "Agricultural and industrial tractor training covering ploughing, hauling, implement attachment, and field operation safety.",
    shortDescription: "Tractor operation for agriculture and industry.",
    category: "Machinery",
    level: "Beginner",
    durationWeeks: 1,
    durationHours: 40,
    price: 5000,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/tractor.jpg",
    outcomes: ["Operate tractors for agricultural and industrial tasks", "Attach and use various implements safely", "Perform field operations including ploughing and hauling", "Conduct routine tractor maintenance"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document"],
  },
  {
    id: "bobcat-operation",
    title: "Bobcat (Skid Steer Loader)",
    slug: "bobcat-training",
    description: "Compact skid steer loader training for construction, landscaping, and site cleanup. Covers attachment usage and confined space operation.",
    shortDescription: "Bobcat skid steer loader for construction sites.",
    category: "Machinery",
    level: "Beginner",
    durationWeeks: 1,
    durationHours: 40,
    price: 4500,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/bobcat.jpg",
    outcomes: ["Operate Bobcat skid steer loaders safely", "Use various attachments (buckets, augers, breakers)", "Work in confined spaces and construction sites", "Perform machine inspections and maintenance"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document"],
  },
  {
    id: "lhd-scoop",
    title: "LHD Scoop (Load Haul Dump)",
    slug: "lhd-scoop-training",
    description: "Underground LHD scoop loader training for mining operations. Covers loading, hauling, and dumping in confined underground environments.",
    shortDescription: "Underground LHD scoop loader mining operation.",
    category: "Mining",
    level: "Intermediate",
    durationWeeks: 1,
    durationHours: 40,
    price: 6500,
    certification: true,
    isFeatured: false,
    icon: "Mountain",
    image: "/images/courses/lhd-scoop.jpg",
    outcomes: ["Operate LHD scoop loaders in underground mines", "Navigate underground tunnels and intersections safely", "Load and haul ore from stope to tipping point", "Respond to underground emergency situations"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document", "Medical fitness certificate", "Prior machinery experience"],
  },
  {
    id: "drill-rig-operation",
    title: "Drill Rig",
    slug: "drill-rig-training",
    description: "Professional drill rig operation training for mining, quarrying, and construction. Covers rotary, percussive, and DTH drilling techniques.",
    shortDescription: "Drill rig operation for mining and quarrying.",
    category: "Machinery",
    level: "Intermediate",
    durationWeeks: 1,
    durationHours: 40,
    price: 7000,
    certification: true,
    isFeatured: false,
    icon: "Truck",
    image: "/images/courses/drill-rig.jpg",
    outcomes: ["Operate drill rigs for blast hole and exploration drilling", "Understand drilling methods (rotary, percussive, DTH)", "Perform drill bit selection and rod management", "Apply safety procedures for drilling operations"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document", "Medical fitness certificate"],
  },
  {
    id: "mobile-crane",
    title: "Mobile Crane",
    slug: "mobile-crane-training",
    description: "Comprehensive mobile crane operator training covering load lifting, rigging, signaling, and crane setup. Prepares for high-demand crane operator roles.",
    shortDescription: "Mobile crane operation and rigging certification.",
    category: "Machinery",
    level: "Advanced",
    durationWeeks: 3,
    durationHours: 120,
    price: 8500,
    certification: true,
    isFeatured: true,
    icon: "Truck",
    image: "/images/courses/mobile-crane.jpg",
    outcomes: ["Operate mobile cranes for lifting and placement", "Read and interpret load charts", "Perform rigging and slinging procedures", "Understand crane stability and ground conditions"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document", "Medical fitness certificate", "Prior machinery experience preferred"],
  },
  {
    id: "first-aid",
    title: "First Aid",
    slug: "first-aid-training",
    description: "Workplace first aid certification covering emergency response, wound management, CPR, and injury stabilization. Required for mining and construction environments.",
    shortDescription: "Workplace first aid and emergency response training.",
    category: "Safety",
    level: "All Levels",
    durationWeeks: 1,
    durationHours: 40,
    price: 2000,
    certification: true,
    isFeatured: false,
    icon: "HeartPulse",
    image: "/images/courses/first-aid.jpg",
    outcomes: ["Respond to workplace medical emergencies", "Perform CPR and basic life support", "Manage wounds, fractures, and burns", "Stabilize patients for transport"],
    prerequisites: ["Valid ID document"],
  },
  {
    id: "fire-fighting",
    title: "Fire Fighting",
    slug: "fire-fighting-training",
    description: "Industrial fire fighting training covering fire prevention, extinguisher use, evacuation procedures, and emergency response for mining and industrial sites.",
    shortDescription: "Industrial fire fighting and prevention certification.",
    category: "Safety",
    level: "All Levels",
    durationWeeks: 1,
    durationHours: 40,
    price: 2000,
    certification: true,
    isFeatured: false,
    icon: "Flame",
    image: "/images/courses/fire-fighting.jpg",
    outcomes: ["Identify fire hazards in industrial environments", "Use fire extinguishers and hose reels effectively", "Conduct safe evacuation procedures", "Respond to industrial fire emergencies"],
    prerequisites: ["Valid ID document"],
  },
  {
    id: "she-representative",
    title: "SHE Representative",
    slug: "she-representative-training",
    description: "Safety, Health, and Environment representative training aligned with South African OHSA and MHSA regulations. Covers hazard identification, risk assessment, incident investigation, and compliance auditing.",
    shortDescription: "SHE compliance and safety representative certification.",
    category: "Safety",
    level: "All Levels",
    durationWeeks: 2,
    durationHours: 80,
    price: 5000,
    certification: true,
    isFeatured: true,
    icon: "Shield",
    image: "/images/courses/she-representative.jpg",
    outcomes: ["Conduct workplace hazard identification and risk assessments", "Investigate workplace incidents and near misses", "Understand OHSA and MHSA regulatory requirements", "Implement and audit SHE management systems"],
    prerequisites: ["Grade 10 or equivalent", "Valid ID document"],
  },
];

export const FEATURED_COURSES = ALL_COURSES.filter((c) => c.isFeatured);

export const COURSE_CATEGORIES = [
  { label: "All Training", value: "all" },
  { label: "Machinery Training", value: "Machinery" },
  { label: "Safety Training", value: "Safety" },
  { label: "Mining Training", value: "Mining" },
  { label: "Industrial Skills", value: "Industrial" },
] as const;

// ============================================
// BENEFITS
// ============================================

export const BENEFITS = [
  {
    title: "Industry-Recognized Certificates",
    description: "Our certifications are recognized across the South African mining industry, opening doors to employment opportunities nationwide.",
    icon: "Award",
  },
  {
    title: "Hands-On Practical Training",
    description: "Learn by doing with real machinery and simulated mining environments. Our training bridges the gap between theory and operational excellence.",
    icon: "Wrench",
  },
  {
    title: "Expert Instructors",
    description: "Learn from seasoned mining professionals with decades of field experience. Our instructors bring real-world expertise to every lesson.",
    icon: "Users",
  },
  {
    title: "Flexible Learning Options",
    description: "Study at your own pace with our online portal, or join scheduled on-site training programs designed around your availability.",
    icon: "Clock",
  },
] as const;

// ============================================
// LEARNING STEPS
// ============================================

export const LEARNING_STEPS = [
  { step: 1, title: "Apply Online", description: "Complete our simple online application form. Choose your course and submit your details.", icon: "FileText" },
  { step: 2, title: "Get Accepted", description: "Our admissions team reviews your application and sends you an acceptance letter within 48 hours.", icon: "CheckCircle" },
  { step: 3, title: "Learn from Experts", description: "Access world-class training materials, attend practical sessions, and learn from industry veterans.", icon: "BookOpen" },
  { step: 4, title: "Complete Practical Training", description: "Demonstrate your skills through hands-on assessments and real-world operational scenarios.", icon: "HardHat" },
  { step: 5, title: "Earn Your Certificate", description: "Receive your industry-recognized certificate and join the MMS alumni network.", icon: "GraduationCap" },
] as const;

// ============================================
// TESTIMONIALS
// ============================================

export const TESTIMONIALS = [
  { name: "Thabo Mokoena", course: "Heavy Machinery Operation", quote: "MMS gave me the skills and confidence to operate heavy machinery safely. Within two months of graduating, I secured a position at a major mining operation in Limpopo.", rating: 5, year: 2025 },
  { name: "Nomsa Dlamini", course: "Mining Safety & SHE Compliance", quote: "The safety training at MMS is world-class. The instructors truly care about your success and the practical assessments prepared me for real mine safety audits.", rating: 5, year: 2025 },
  { name: "Sipho Nkosi", course: "Underground Mining Operations", quote: "I came in with zero mining experience and left as a certified underground operator. The hands-on approach and mentorship made all the difference in my career.", rating: 5, year: 2024 },
] as const;

// ============================================
// FAQ ITEMS
// ============================================

export const FAQ_ITEMS = [
  { question: "What are the entry requirements for MMS courses?", answer: "Most courses require a minimum of Grade 10 (or equivalent). Some advanced courses may require prior mining experience or specific certifications. Each course page lists its specific prerequisites. We also accept Recognition of Prior Learning (RPL) applications." },
  { question: "How long does it take to complete a course?", answer: "Course durations vary from 2 to 8 weeks depending on the program. Short courses like First Aid take approximately 2 weeks, while comprehensive programs like Mobile Crane Operation run for 8 weeks. All courses include both theoretical and practical components." },
  { question: "Are MMS certificates recognized in the mining industry?", answer: "Yes. MMS certificates are recognized across the South African mining sector. Our training programs are aligned with the Mining Qualifications Authority (MQA) standards and industry best practices. Many of our graduates work at leading mining companies nationwide." },
  { question: "Do you offer payment plans or financial assistance?", answer: "Yes, we offer flexible payment plans for all courses. You can pay in monthly installments over the duration of your course. We also partner with several funding institutions and can assist with NSFAS and SETA bursary applications." },
  { question: "Is there accommodation available for out-of-town students?", answer: "We assist out-of-town students in finding suitable accommodation near our training facility in Middelburg. We have partnerships with local guesthouses and can arrange affordable housing options. Contact our admissions team for details." },
  { question: "What career support do you provide after graduation?", answer: "MMS provides ongoing career support including job placement assistance, CV workshops, interview preparation, and access to our employer partner network. Our alumni network spans major mining operations across South Africa." },
] as const;

// ============================================
// STATS
// ============================================

export const STATS = [
  { label: "Students Trained", value: 2500, suffix: "+" },
  { label: "Training Programs", value: 17, suffix: "+" },
  { label: "Certification Rate", value: 94, suffix: "%" },
  { label: "Years of Experience", value: 10, suffix: "+" },
] as const;

// ============================================
// ENROLLMENT FORM DATA
// ============================================

export const EMPLOYMENT_STATUSES = ["Unemployed", "Employed", "Self Employed", "Student"] as const;
export const TRAINING_TYPES = ["Weekdays", "Weekends", "Flexible"] as const;
export const SOUTH_AFRICAN_PROVINCES = ["Mpumalanga", "Gauteng", "KwaZulu-Natal", "Limpopo", "North West", "Free State", "Eastern Cape", "Western Cape", "Northern Cape"] as const;
export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"] as const;

// ============================================
// CONTACT PAGE DATA
// ============================================

export const BUSINESS_HOURS = [
  { day: "Monday - Friday", hours: "07:00 - 17:00" },
  { day: "Saturday", hours: "08:00 - 13:00" },
  { day: "Sunday & Public Holidays", hours: "Closed" },
] as const;
