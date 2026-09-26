export type ScreenId =
  | 'dashboard'
  | 'members'
  | 'attendance'
  | 'classes-pt'
  | 'crm-leads'
  | 'staff-hr'
  | 'payments'
  | 'reports'
  | 'settings'
  | 'tenant-rbac'
  | 'landing'
  | 'login'
  | 'super-admin';

export type UserRole = 'superadmin' | 'director' | 'manager' | 'staff';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  branchAccess?: string[];
}

export interface SaaSPackage {
  id: string;
  name: string;
  tier: 'starter' | 'pro' | 'elite' | 'enterprise' | 'custom';
  maxMembers: number;
  maxStaff: number;
  maxLocations: number;
  monthlyPrice: number;
  annualDiscountPercent: number;
  features: {
    qrTurnstileGate: boolean;
    aiChurnPrediction: boolean;
    whatsappSmsAutomation: boolean;
    brandedMemberApp: boolean;
    multiBranchRoaming: boolean;
    prioritySupport247: boolean;
    customReporting: boolean;
  };
  description: string;
}

export type OperationStatus =
  | 'Online & Operational'
  | 'Degraded Latency'
  | 'Maintenance Mode'
  | 'Hardware Locked';

export interface SaaSLicense {
  id: string;
  licenseKey: string;
  gymName: string;
  contactEmail: string;
  adminName: string;
  tier: string;
  maxMembers: number;
  maxStaff: number;
  maxLocations: number;
  currentMembersUsed: number;
  currentLocationsUsed: number;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Suspended' | 'Revoked';
  // Operational Status & Telemetry
  operationStatus: OperationStatus;
  turnstilesOnline: number;
  totalTurnstiles: number;
  liveFloorOccupancy: number;
  syncLatencyMs: number;
  lastHeartbeat: string;
  clusterHub: string;
  features: string[];
  hardwareBinding?: string;
  signature: string;
}

export type BranchId = 'downtown' | 'westside' | 'metro' | 'north';

export interface Branch {
  id: BranchId;
  name: string;
  address: string;
  capacity: number;
  activeMembers: number;
}

export type MembershipPlan =
  | 'VIP Annual'
  | 'Monthly Standard'
  | 'Pro Monthly'
  | 'Student Pass'
  | 'Standard Semi-Annual'
  | 'Day Pass';

export type MemberStatus = 'active' | 'frozen' | 'expired' | 'cancelled';

export interface Member {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  plan: MembershipPlan;
  status: MemberStatus;
  joinedDate: string;
  expiryDate: string;
  lastVisit: string;
  totalCheckIns: number;
  assignedTrainer?: string;
  emergencyContact?: string;
}

export type CheckInMethod = 'QR Scanner' | 'Manual Entry' | 'RFID Wristband';
export type CheckInStatus = 'Allowed' | 'Expired' | 'Access Denied';

export interface CheckInLog {
  id: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  photoUrl?: string;
  plan: MembershipPlan;
  timestamp: string;
  timeFormatted: string;
  method: CheckInMethod;
  status: CheckInStatus;
  terminal: string;
}

export interface ClassSession {
  id: string;
  title: string;
  category: 'High Intensity' | 'Mind & Body' | 'Strength' | 'Cardio';
  studio: 'Studio A' | 'Zen Studio' | 'Main Arena' | 'Cycle Studio';
  durationMins: number;
  timeFormatted: string;
  trainerName: string;
  trainerPhoto: string;
  capacity: number;
  enrolled: number;
  waitlist: number;
  status: 'live' | 'upcoming' | 'completed';
}

export interface PTSession {
  id: string;
  clientName: string;
  clientId: string;
  clientPhoto: string;
  trainerName: string;
  timeSlot: string; // e.g. "07:00 AM" or "07:00 AM - 08:00 AM"
  packageType: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  date?: string;
  focus?: 'Strength & Conditioning' | 'Hypertrophy & Muscle' | 'Fat Loss & HIIT' | 'Posture & Rehab' | 'Athletic Performance' | 'Boxing / Combat';
  durationMins?: number;
  notes?: string;
  price?: number;
}

export type LeadStage =
  | 'New Inquiry'
  | 'Trial Booked'
  | 'Trial Completed'
  | 'Negotiation'
  | 'Won / Converted'
  | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: LeadStage;
  source: 'Instagram Ad' | 'Website' | 'Referral' | 'Walk-in' | 'Google Search';
  assignedRep: string;
  assignedRepInitials: string;
  lastInteraction: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  staffCode: string;
  name: string;
  role: 'Senior Trainer' | 'Operations Manager' | 'Front Desk Lead' | 'Personal Trainer' | 'Yoga Instructor';
  category: 'trainer' | 'frontdesk' | 'management';
  phone: string;
  photoUrl: string;
  shiftHours: string;
  shiftType: string;
  geofenceStatus: 'Verified Inside' | 'Outside Geofence';
  onShift: boolean;
}

export interface StaffCheckInFeed {
  id: string;
  staffName: string;
  photoUrl: string;
  timeFormatted: string;
  gpsOffset: string;
  isInside: boolean;
  status: 'Photo Verified' | 'Manager Review Required' | 'Approved by Manager' | 'Rejected';
  onTime: boolean;
}

export type PaymentMethod = 'Stripe' | 'UPI' | 'Credit Card' | 'Cash' | 'Bank Transfer';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Refunded';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  memberInitials: string;
  planOrDescription: string;
  amount: number;
  method: PaymentMethod;
  dateTimeFormatted: string;
  status: InvoiceStatus;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}

// ==========================================
// Tenant Admin RBAC & Function Permissions
// ==========================================

export type RBACModule =
  | 'dashboard_analytics'
  | 'members_crm'
  | 'gate_access'
  | 'classes_pt_scheduler'
  | 'billing_payments'
  | 'staff_hr_payroll'
  | 'tenant_settings'
  | 'security_audit';

export interface RBACPermission {
  id: string;
  name: string;
  description: string;
  module: RBACModule;
  category: 'View' | 'Create' | 'Edit' | 'Delete' | 'Execute';
  isDangerous?: boolean;
}

export interface TenantRole {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  isSystemDefault: boolean;
  permissionIds: string[];
}

export interface UserRoleAssignment {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  roleId: string;
  roleName: string;
  hasCustomOverrides: boolean;
  customGrantedPermissions: string[]; // explicit custom added functions
  customRevokedPermissions: string[]; // explicit custom removed functions
  status: 'Active' | 'Suspended' | 'Pending Review';
  department: 'Operations' | 'Training' | 'Front Desk' | 'Finance' | 'Executive';
  lastActive: string;
  assignedBranchId?: BranchId | 'all';
}
