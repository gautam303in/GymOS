import {
  Branch,
  Member,
  CheckInLog,
  ClassSession,
  PTSession,
  Lead,
  StaffMember,
  StaffCheckInFeed,
  Invoice
} from '../types';

export const APP_LOGO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUP-8_flvki-ZmX5_fHcfdgi2gZd4-5f61Cl88TgInYOILlELUWxWw6AID74nyRkVaBDzb3zJrKa9fb4TdmvjFxhcq2JA-KbwzMsNj2YiwRCWZMHyKeoRXHfOLtB04fFv0IP10ztdCh1W4n3zV8rKR9U3AW7sjpXTMNfWjFSHmGHIs_nyIBnzE9M3iNvdc_CGQZ6fSw4UZBGTBHqa0OnBW7HMvfgVcjhM-rg2k3ipZBO9TWWpQiPC0AA';

export const BRANCHES: Branch[] = [
  { id: 'downtown', name: 'Indiranagar Flagship', address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038', capacity: 220, activeMembers: 1248 },
  { id: 'westside', name: 'Koramangala Club', address: '80 Feet Road, 4th Block Koramangala, Bengaluru, Karnataka 560034', capacity: 190, activeMembers: 980 },
  { id: 'metro', name: 'BKC Executive Arena', address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051', capacity: 380, activeMembers: 1650 },
  { id: 'north', name: 'Connaught Place Club', address: 'Inner Circle, Connaught Place, New Delhi, Delhi 110001', capacity: 160, activeMembers: 720 },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    memberCode: '#MEM-8402',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@fitpro.in',
    phone: '+91 98201 44521',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    plan: 'VIP Annual',
    status: 'active',
    joinedDate: 'Oct 2023',
    expiryDate: 'Oct 24, 2027',
    lastVisit: 'Today (06:01 AM)',
    totalCheckIns: 184,
    assignedTrainer: 'Vikramaditya Rao'
  },
  {
    id: 'm2',
    memberCode: '#MEM-8403',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@zenfitness.in',
    phone: '+91 99304 88122',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    plan: 'Pro Monthly',
    status: 'active',
    joinedDate: 'Jan 2024',
    expiryDate: 'Nov 15, 2026',
    lastVisit: 'Today (05:58 AM)',
    totalCheckIns: 142,
  },
  {
    id: 'm3',
    memberCode: '#MEM-7910',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@athletics.org.in',
    phone: '+91 98450 12940',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    plan: 'Standard Semi-Annual',
    status: 'frozen',
    joinedDate: 'Nov 2022',
    expiryDate: 'Dec 01, 2026',
    lastVisit: '3 weeks ago',
    totalCheckIns: 98,
  },
  {
    id: 'm4',
    memberCode: '#MEM-5120',
    name: 'Rohan Verma',
    email: 'rohan.verma@designwave.in',
    phone: '+91 98110 77881',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    plan: 'VIP Annual',
    status: 'expired',
    joinedDate: 'Dec 2021',
    expiryDate: 'Oct 15, 2026',
    lastVisit: '25 mins ago',
    totalCheckIns: 215,
  },
  {
    id: 'm5',
    memberCode: '#MEM-6294',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@studioflux.in',
    phone: '+91 98210 44329',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    plan: 'Pro Monthly',
    status: 'active',
    joinedDate: 'Mar 2023',
    expiryDate: 'Nov 30, 2026',
    lastVisit: 'Today (11:00 AM)',
    totalCheckIns: 164,
  },
  {
    id: 'm6',
    memberCode: '#MEM-8402',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@corpfitness.in',
    phone: '+91 99201 12499',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    plan: 'VIP Annual',
    status: 'active',
    joinedDate: 'May 2023',
    expiryDate: 'May 10, 2027',
    lastVisit: '04:22 PM',
    totalCheckIns: 204,
  },
  {
    id: 'm7',
    memberCode: '#MEM-9104',
    name: 'Aditya Nair',
    email: 'aditya.nair@apexteam.in',
    phone: '+91 97402 44189',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    plan: 'Monthly Standard',
    status: 'active',
    joinedDate: 'Aug 2023',
    expiryDate: 'Dec 18, 2026',
    lastVisit: '04:18 PM',
    totalCheckIns: 88,
  },
  {
    id: 'm8',
    memberCode: '#MEM-1192',
    name: 'Divya Sen',
    email: 'divya.sen@iitb.ac.in',
    phone: '+91 98300 77421',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    plan: 'Student Pass',
    status: 'expired',
    joinedDate: 'Jan 2023',
    expiryDate: 'Sep 30, 2026',
    lastVisit: '04:10 PM',
    totalCheckIns: 65,
  },
  {
    id: 'm9',
    memberCode: '#MEM-5521',
    name: 'Kabir Singhania',
    email: 'kabir.s@foundation.org.in',
    phone: '+91 98200 88033',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    plan: 'VIP Annual',
    status: 'active',
    joinedDate: 'Feb 2023',
    expiryDate: 'Feb 15, 2027',
    lastVisit: '03:55 PM',
    totalCheckIns: 176,
  }
];

export const INITIAL_CHECKINS: CheckInLog[] = [
  {
    id: 'c1',
    memberId: 'm7',
    memberName: 'Aditya Nair',
    memberCode: '#MEM-84920',
    plan: 'VIP Annual',
    timestamp: '2026-09-26T10:42:00',
    timeFormatted: 'Just now (10:42 AM)',
    method: 'QR Scanner',
    status: 'Allowed',
    terminal: 'Terminal #04'
  },
  {
    id: 'c2',
    memberId: 'm1',
    memberName: 'Aarav Sharma',
    memberCode: '#MEM-39281',
    plan: 'Monthly Standard',
    timestamp: '2026-09-26T10:39:00',
    timeFormatted: '3 mins ago (10:39 AM)',
    method: 'QR Scanner',
    status: 'Allowed',
    terminal: 'Terminal #04'
  },
  {
    id: 'c3',
    memberId: 'm3',
    memberName: 'Rohan Verma',
    memberCode: '#MEM-10928',
    plan: 'Day Pass',
    timestamp: '2026-09-26T10:30:00',
    timeFormatted: '12 mins ago (10:30 AM)',
    method: 'Manual Entry',
    status: 'Allowed',
    terminal: 'Front Desk Terminal'
  },
  {
    id: 'c4',
    memberId: 'm4',
    memberName: 'Pooja Iyer',
    memberCode: '#MEM-55412',
    plan: 'Student Pass',
    timestamp: '2026-09-26T10:17:00',
    timeFormatted: '25 mins ago (10:17 AM)',
    method: 'QR Scanner',
    status: 'Access Denied',
    terminal: 'Terminal #04'
  },
  {
    id: 'c5',
    memberId: 'm6',
    memberName: 'Sneha Kulkarni',
    memberCode: '#MEM-8402',
    plan: 'VIP Annual',
    timestamp: '2026-09-26T16:22:00',
    timeFormatted: '04:22 PM',
    method: 'QR Scanner',
    status: 'Allowed',
    terminal: 'Turnstile A'
  },
  {
    id: 'c6',
    memberId: 'm7',
    memberName: 'Aditya Nair',
    memberCode: '#MEM-9104',
    plan: 'Monthly Standard',
    timestamp: '2026-09-26T16:18:00',
    timeFormatted: '04:18 PM',
    method: 'QR Scanner',
    status: 'Allowed',
    terminal: 'Turnstile B'
  },
  {
    id: 'c7',
    memberId: 'm8',
    memberName: 'Divya Sen',
    memberCode: '#MEM-1192',
    plan: 'Student Pass',
    timestamp: '2026-09-26T16:10:00',
    timeFormatted: '04:10 PM',
    method: 'QR Scanner',
    status: 'Expired',
    terminal: 'Turnstile A'
  },
  {
    id: 'c8',
    memberId: 'm9',
    memberName: 'Kabir Singhania',
    memberCode: '#MEM-5521',
    plan: 'VIP Annual',
    timestamp: '2026-09-26T15:55:00',
    timeFormatted: '03:55 PM',
    method: 'QR Scanner',
    status: 'Allowed',
    terminal: 'Turnstile A'
  }
];

export const INITIAL_CLASSES: ClassSession[] = [
  {
    id: 'cls1',
    title: 'Desi HIIT & Core Conditioning',
    category: 'High Intensity',
    studio: 'Studio A',
    durationMins: 45,
    timeFormatted: '06:00 AM',
    trainerName: 'Priya Sundaram',
    trainerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    capacity: 30,
    enrolled: 28,
    waitlist: 2,
    status: 'live'
  },
  {
    id: 'cls2',
    title: 'Ashtanga Yoga & Vinyasa Flow',
    category: 'Mind & Body',
    studio: 'Zen Studio',
    durationMins: 60,
    timeFormatted: '08:30 AM',
    trainerName: 'Vikramaditya Rao',
    trainerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    capacity: 20,
    enrolled: 20,
    waitlist: 6,
    status: 'upcoming'
  },
  {
    id: 'cls3',
    title: 'CrossFit Power Endurance & WOD',
    category: 'Strength',
    studio: 'Main Arena',
    durationMins: 60,
    timeFormatted: '10:00 AM',
    trainerName: 'Devrat Chauhan',
    trainerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    capacity: 25,
    enrolled: 18,
    waitlist: 0,
    status: 'upcoming'
  },
  {
    id: 'cls4',
    title: 'Bollywood Spin & Rhythm Ride',
    category: 'Cardio',
    studio: 'Cycle Studio',
    durationMins: 45,
    timeFormatted: '05:30 PM',
    trainerName: 'Pooja Iyer',
    trainerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    capacity: 35,
    enrolled: 34,
    waitlist: 1,
    status: 'upcoming'
  }
];

export const INITIAL_PT_SESSIONS: PTSession[] = [
  {
    id: 'pt1',
    clientName: 'Rahul Mehra',
    clientId: 'ID: PT-8092',
    clientPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Vikramaditya Rao',
    timeSlot: '07:00 AM',
    day: 'Monday',
    packageType: 'Advanced Hypertrophy',
    focus: 'Hypertrophy & Muscle',
    durationMins: 60,
    status: 'Confirmed',
    price: 1800,
    notes: 'Focus on incline dumbbell press and back hypertrophy'
  },
  {
    id: 'pt2',
    clientName: 'Ananya Deshmukh',
    clientId: 'ID: PT-8095',
    clientPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Priya Sundaram',
    timeSlot: '08:00 AM',
    day: 'Monday',
    packageType: 'Fat Loss & Conditioning',
    focus: 'Fat Loss & HIIT',
    durationMins: 60,
    status: 'Confirmed',
    price: 1500,
    notes: 'Heart rate target zone: 145-165 BPM interval sprints'
  },
  {
    id: 'pt3',
    clientName: 'Rajesh Singhal',
    clientId: 'ID: PT-8102',
    clientPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Devrat Chauhan',
    timeSlot: '09:00 AM',
    day: 'Monday',
    packageType: 'Injury Rehabilitation',
    focus: 'Posture & Rehab',
    durationMins: 45,
    status: 'Confirmed',
    price: 2000,
    notes: 'Lower lumbar decompression & rotator cuff stabilization'
  },
  {
    id: 'pt4',
    clientName: 'Tanya Kapoor',
    clientId: 'ID: PT-8110',
    clientPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Pooja Iyer',
    timeSlot: '05:00 PM',
    day: 'Monday',
    packageType: 'Functional Strength',
    focus: 'Strength & Conditioning',
    durationMins: 60,
    status: 'Confirmed',
    price: 1600,
    notes: 'Barbell deadlift form check & kettlebell complex'
  },
  {
    id: 'pt5',
    clientName: 'Kunal Verma',
    clientId: 'ID: PT-8118',
    clientPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Vikramaditya Rao',
    timeSlot: '06:00 PM',
    day: 'Monday',
    packageType: 'Athletic Conditioning',
    focus: 'Athletic Performance',
    durationMins: 60,
    status: 'Confirmed',
    price: 1800,
    notes: 'Sprint acceleration & plyometric box jumps'
  },
  {
    id: 'pt6',
    clientName: 'Sneha Kulkarni',
    clientId: 'ID: PT-8125',
    clientPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Priya Sundaram',
    timeSlot: '07:00 AM',
    day: 'Tuesday',
    packageType: 'Functional Strength',
    focus: 'Strength & Conditioning',
    durationMins: 60,
    status: 'Confirmed',
    price: 1500,
    notes: 'Barbell squat depth and hip mobility'
  },
  {
    id: 'pt7',
    clientName: 'Arjun Patel',
    clientId: 'ID: PT-8130',
    clientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Vikramaditya Rao',
    timeSlot: '08:00 AM',
    day: 'Tuesday',
    packageType: 'Advanced Hypertrophy',
    focus: 'Hypertrophy & Muscle',
    durationMins: 60,
    status: 'Confirmed',
    price: 1800,
    notes: 'Chest & triceps progressive overload'
  },
  {
    id: 'pt8',
    clientName: 'Divya Sen',
    clientId: 'ID: PT-8134',
    clientPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Pooja Iyer',
    timeSlot: '06:00 PM',
    day: 'Wednesday',
    packageType: 'Fat Loss & Conditioning',
    focus: 'Fat Loss & HIIT',
    durationMins: 60,
    status: 'Confirmed',
    price: 1600,
    notes: 'Kettlebell swings & rowing machine sprints'
  },
  {
    id: 'pt9',
    clientName: 'Kabir Singhania',
    clientId: 'ID: PT-8140',
    clientPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Devrat Chauhan',
    timeSlot: '05:00 PM',
    day: 'Thursday',
    packageType: 'Boxing Conditioning',
    focus: 'Boxing / Combat',
    durationMins: 60,
    status: 'Confirmed',
    price: 2200,
    notes: 'Pad work combinations & footwork drills'
  },
  {
    id: 'pt10',
    clientName: 'Meera Nambiar',
    clientId: 'ID: PT-8148',
    clientPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Priya Sundaram',
    timeSlot: '07:00 AM',
    day: 'Friday',
    packageType: 'Posture & Core Rehab',
    focus: 'Posture & Rehab',
    durationMins: 60,
    status: 'Confirmed',
    price: 1500,
    notes: 'Thoracic extension & deep core activation'
  },
  {
    id: 'pt11',
    clientName: 'Vikram Joshi',
    clientId: 'ID: PT-8152',
    clientPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    trainerName: 'Vikramaditya Rao',
    timeSlot: '09:00 AM',
    day: 'Saturday',
    packageType: 'Strength Max Testing',
    focus: 'Strength & Conditioning',
    durationMins: 75,
    status: 'Confirmed',
    price: 2000,
    notes: '1-rep max bench and squat assessment'
  }
];

export interface UnscheduledPTRequest {
  id: string;
  clientName: string;
  clientId: string;
  clientPhoto: string;
  preferredTrainer: string;
  preferredTime: string;
  preferredDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  packageType: string;
  focus: 'Strength & Conditioning' | 'Hypertrophy & Muscle' | 'Fat Loss & HIIT' | 'Posture & Rehab' | 'Athletic Performance' | 'Boxing / Combat';
  requestedDate: string;
  price: number;
}

export const INITIAL_UNSCHEDULED_REQUESTS: UnscheduledPTRequest[] = [
  {
    id: 'req1',
    clientName: 'Ishaan Chopra',
    clientId: 'ID: PT-8160',
    clientPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    preferredTrainer: 'Vikramaditya Rao',
    preferredTime: '07:00 AM',
    preferredDay: 'Wednesday',
    packageType: 'Hypertrophy 10-Pack',
    focus: 'Hypertrophy & Muscle',
    requestedDate: 'Requested Today',
    price: 1800
  },
  {
    id: 'req2',
    clientName: 'Rhea Sengupta',
    clientId: 'ID: PT-8165',
    clientPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    preferredTrainer: 'Priya Sundaram',
    preferredTime: '08:00 AM',
    preferredDay: 'Thursday',
    packageType: 'Fat Loss HIIT Booster',
    focus: 'Fat Loss & HIIT',
    requestedDate: 'Requested 1h ago',
    price: 1500
  },
  {
    id: 'req3',
    clientName: 'Gaurav Khanna',
    clientId: 'ID: PT-8172',
    clientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    preferredTrainer: 'Devrat Chauhan',
    preferredTime: '06:00 PM',
    preferredDay: 'Friday',
    packageType: 'Combat Conditioning',
    focus: 'Boxing / Combat',
    requestedDate: 'Requested Yesterday',
    price: 2200
  },
  {
    id: 'req4',
    clientName: 'Deepika Nair',
    clientId: 'ID: PT-8180',
    clientPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    preferredTrainer: 'Pooja Iyer',
    preferredTime: '10:00 AM',
    preferredDay: 'Saturday',
    packageType: 'Postural Spine Alignment',
    focus: 'Posture & Rehab',
    requestedDate: 'Requested 2h ago',
    price: 1600
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'ld1',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@gmail.com',
    phone: '+91 99201 12499',
    stage: 'Trial Booked',
    source: 'Instagram Ad',
    assignedRep: 'Manish K.',
    assignedRepInitials: 'MK',
    lastInteraction: '10 mins ago',
    notes: 'Trial session tomorrow @ 10:00 AM'
  },
  {
    id: 'ld2',
    name: 'Aditya Nair',
    email: 'aditya.nair@gmail.com',
    phone: '+91 97402 44189',
    stage: 'Negotiation',
    source: 'Website',
    assignedRep: 'Simran L.',
    assignedRepInitials: 'SL',
    lastInteraction: '2 hours ago',
    notes: 'Reviewing corporate couple package quote'
  },
  {
    id: 'ld3',
    name: 'Ritu Sen',
    email: 'ritu.sen@fitmail.in',
    phone: '+91 98451 90211',
    stage: 'Trial Booked',
    source: 'Referral',
    assignedRep: 'Manish K.',
    assignedRepInitials: 'MK',
    lastInteraction: 'Yesterday',
    notes: 'Trial expiring today, needs follow-up call'
  },
  {
    id: 'ld4',
    name: 'Karan Bhasin',
    email: 'karan.b@gympro.in',
    phone: '+91 98101 44123',
    stage: 'New Inquiry',
    source: 'Walk-in',
    assignedRep: 'Joy D.',
    assignedRepInitials: 'JD',
    lastInteraction: '3 hours ago',
    notes: 'Interested in Annual Unlimited with Locker'
  },
  {
    id: 'ld5',
    name: 'Kunal Joshi',
    email: 'kunal.j@techmumbai.com',
    phone: '+91 98205 77133',
    stage: 'Trial Completed',
    source: 'Google Search',
    assignedRep: 'Simran L.',
    assignedRepInitials: 'SL',
    lastInteraction: '2 days ago',
    notes: 'Trial ended 2 days ago • Needs WhatsApp reminder'
  },
  {
    id: 'ld6',
    name: 'Meera Nambiar',
    email: 'meera.n@studiofilms.in',
    phone: '+91 99401 99188',
    stage: 'New Inquiry',
    source: 'Instagram Ad',
    assignedRep: 'Joy D.',
    assignedRepInitials: 'JD',
    lastInteraction: '3 days ago',
    notes: 'Requested student discount pricing'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 's1',
    staffCode: '#GYM-1024',
    name: 'Vikramaditya Rao',
    role: 'Senior Trainer',
    category: 'trainer',
    phone: '+91 99304 88122',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    shiftHours: '06:00 - 14:00',
    shiftType: 'Morning Shift',
    geofenceStatus: 'Verified Inside',
    onShift: true
  },
  {
    id: 's2',
    staffCode: '#GYM-1001',
    name: 'Pooja Iyer',
    role: 'Operations Manager',
    category: 'management',
    phone: '+91 98450 12940',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    shiftHours: '08:00 - 17:00',
    shiftType: 'Full Day',
    geofenceStatus: 'Verified Inside',
    onShift: true
  },
  {
    id: 's3',
    staffCode: '#GYM-1055',
    name: 'Rohan Verma',
    role: 'Front Desk Lead',
    category: 'frontdesk',
    phone: '+91 98110 77881',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    shiftHours: '13:00 - 21:00',
    shiftType: 'Evening Shift',
    geofenceStatus: 'Outside Geofence',
    onShift: true
  },
  {
    id: 's4',
    staffCode: '#GYM-1089',
    name: 'Priya Sundaram',
    role: 'Personal Trainer',
    category: 'trainer',
    phone: '+91 98201 44521',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    shiftHours: '06:00 - 14:00',
    shiftType: 'Morning Shift',
    geofenceStatus: 'Verified Inside',
    onShift: true
  }
];

export const INITIAL_STAFF_FEED: StaffCheckInFeed[] = [
  {
    id: 'sf1',
    staffName: 'Vikramaditya Rao',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    timeFormatted: '05:58 AM',
    gpsOffset: 'GPS: 3m accuracy (Indiranagar HQ)',
    isInside: true,
    status: 'Photo Verified',
    onTime: true
  },
  {
    id: 'sf2',
    staffName: 'Rohan Verma',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    timeFormatted: '12:55 PM',
    gpsOffset: 'Outside Geofence (45m offset)',
    isInside: false,
    status: 'Manager Review Required',
    onTime: false
  },
  {
    id: 'sf3',
    staffName: 'Priya Sundaram',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    timeFormatted: '06:01 AM',
    gpsOffset: 'GPS: 1m accuracy (Indiranagar HQ)',
    isInside: true,
    status: 'Photo Verified',
    onTime: true
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: '#INV-8421',
    memberId: 'm6',
    memberName: 'Kabir Singhania',
    memberCode: 'MEM-9021',
    memberInitials: 'KS',
    planOrDescription: 'VIP Annual Membership',
    amount: 38500.00,
    method: 'UPI',
    dateTimeFormatted: 'Oct 24, 2026 09:42',
    status: 'Paid'
  },
  {
    id: 'inv2',
    invoiceNumber: '#INV-8420',
    memberId: 'm1',
    memberName: 'Aarav Sharma',
    memberCode: 'MEM-1422',
    memberInitials: 'AS',
    planOrDescription: 'Pro Monthly Package',
    amount: 4500.00,
    method: 'UPI',
    dateTimeFormatted: 'Oct 24, 2026 08:15',
    status: 'Paid'
  },
  {
    id: 'inv3',
    invoiceNumber: '#INV-8419',
    memberId: 'm7',
    memberName: 'Aditya Nair',
    memberCode: 'MEM-8831',
    memberInitials: 'AN',
    planOrDescription: 'Personal Training Pack (10s)',
    amount: 18000.00,
    method: 'Credit Card',
    dateTimeFormatted: 'Oct 23, 2026 19:30',
    status: 'Pending'
  },
  {
    id: 'inv4',
    invoiceNumber: '#INV-8418',
    memberId: 'm9',
    memberName: 'Manish Trivedi',
    memberCode: 'MEM-3321',
    memberInitials: 'MT',
    planOrDescription: 'Monthly Standard',
    amount: 3200.00,
    method: 'Cash',
    dateTimeFormatted: 'Oct 22, 2026 14:10',
    status: 'Overdue'
  },
  {
    id: 'inv5',
    invoiceNumber: '#INV-8417',
    memberId: 'm4',
    memberName: 'Ananya Deshmukh',
    memberCode: 'MEM-7712',
    memberInitials: 'AD',
    planOrDescription: 'Locker Rental (Annual)',
    amount: 6000.00,
    method: 'UPI',
    dateTimeFormatted: 'Oct 21, 2026 11:05',
    status: 'Refunded'
  }
];

export const PENDING_PAYMENTS_LIST = [
  { initials: 'RT', name: 'Rajesh Tiwari', subtitle: 'Monthly Gym Dues', amount: 3200.00, dueDate: '2 days ago', status: 'Overdue' },
  { initials: 'EL', name: 'Esha Lakhani', subtitle: 'Personal Training Pack (10 Sessions)', amount: 15000.00, dueDate: 'Today', status: 'Pending' },
  { initials: 'DP', name: 'Darshan Patel', subtitle: 'Executive Locker Rental', amount: 1500.00, dueDate: '5 days ago', status: 'Overdue' },
  { initials: 'KW', name: 'Kavita Walia', subtitle: 'Monthly Standard Dues', amount: 3200.00, dueDate: 'Tomorrow', status: 'Scheduled' },
];

export const AT_RISK_MEMBERS = [
  {
    id: 'ar1',
    initials: 'JD',
    name: 'Juhi Dutta',
    code: '#MS-88921',
    riskScore: 'High (88%)',
    lastVisit: '14 days ago',
    activePlan: 'VIP Annual',
    riskFactor: '0 visits in 14 days',
    riskType: 'high'
  },
  {
    id: 'ar2',
    initials: 'MR',
    name: 'Manav Rawat',
    code: '#MS-44102',
    riskScore: 'High (82%)',
    lastVisit: '9 days ago',
    activePlan: 'Monthly Unlimited',
    riskFactor: 'Expiring in 3 days',
    riskType: 'high'
  },
  {
    id: 'ar3',
    initials: 'AL',
    name: 'Ankita Lamba',
    code: '#MS-99231',
    riskScore: 'Medium (65%)',
    lastVisit: '5 days ago',
    activePlan: 'Standard 6-Month',
    riskFactor: 'Skipped 3 PT Sessions',
    riskType: 'medium'
  },
  {
    id: 'ar4',
    initials: 'KS',
    name: 'Karan Singhal',
    code: '#MS-33109',
    riskScore: 'Medium (58%)',
    lastVisit: '4 days ago',
    activePlan: 'Monthly Unlimited',
    riskFactor: 'Declined UPI Autopay Retry',
    riskType: 'medium'
  }
];
