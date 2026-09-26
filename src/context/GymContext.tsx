import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ScreenId,
  BranchId,
  Branch,
  Member,
  MembershipPlan,
  CheckInLog,
  CheckInMethod,
  ClassSession,
  PTSession,
  Lead,
  LeadStage,
  StaffMember,
  StaffCheckInFeed,
  Invoice,
  ToastMessage,
  User,
  UserRole,
  SaaSPackage,
  SaaSLicense,
  TenantRole,
  UserRoleAssignment,
  RBACPermission
} from '../types';
import {
  BRANCHES,
  INITIAL_MEMBERS,
  INITIAL_CHECKINS,
  INITIAL_CLASSES,
  INITIAL_PT_SESSIONS,
  INITIAL_UNSCHEDULED_REQUESTS,
  UnscheduledPTRequest,
  INITIAL_LEADS,
  INITIAL_STAFF,
  INITIAL_STAFF_FEED,
  INITIAL_INVOICES,
  PENDING_PAYMENTS_LIST
} from '../data/mockData';
import {
  INITIAL_SAAS_PACKAGES,
  INITIAL_SAAS_LICENSES
} from '../data/superAdminData';
import {
  ALL_RBAC_PERMISSIONS,
  DEFAULT_TENANT_ROLES,
  INITIAL_USER_ASSIGNMENTS
} from '../data/rbacData';

interface GymContextType {
  // Theme Switcher
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Navigation & Location
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  currentBranch: Branch;
  setBranch: (branchId: BranchId) => void;
  branches: Branch[];

  // Authentication & Users
  currentUser: User | null;
  login: (username: string, password: string) => { success: boolean; error?: string; role?: UserRole };
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Super Admin: SaaS Packages & Customisation
  saasPackages: SaaSPackage[];
  saveSaaSPackage: (pkg: SaaSPackage) => void;
  deleteSaaSPackage: (id: string) => void;

  // Super Admin: License Generation Engine
  saasLicenses: SaaSLicense[];
  activeTenantLicense: SaaSLicense;
  generateLicense: (data: {
    gymName: string;
    contactEmail: string;
    adminName: string;
    tier: string;
    maxMembers: number;
    maxStaff: number;
    maxLocations: number;
    durationMonths: number;
    features: string[];
    hardwareBinding?: string;
  }) => SaaSLicense;
  updateLicenseStatus: (id: string, status: SaaSLicense['status']) => void;
  updateOperationStatus: (id: string, operationStatus: SaaSLicense['operationStatus']) => void;
  applyLicenseToTenant: (license: SaaSLicense) => void;

  // Tenant Admin: RBAC & Function Selection
  tenantRoles: TenantRole[];
  userRoleAssignments: UserRoleAssignment[];
  allRbacPermissions: RBACPermission[];
  updateUserRole: (userId: string, roleId: string) => void;
  toggleUserPermissionOverride: (userId: string, permissionId: string, grant: boolean) => void;
  toggleUserCustomOverridesMode: (userId: string, enabled: boolean) => void;
  addNewUserAssignment: (data: { name: string; email: string; roleId: string; department: UserRoleAssignment['department']; avatar?: string }) => void;
  saveTenantRole: (role: TenantRole) => void;
  hasUserPermission: (userId: string, permissionId: string) => boolean;

  // Members
  members: Member[];
  addMember: (data: { name: string; email: string; phone: string; plan: MembershipPlan }) => void;
  renewMember: (id: string, newPlan?: MembershipPlan) => void;
  toggleMemberFreeze: (id: string) => void;
  checkInMember: (memberId: string, method?: CheckInMethod) => boolean;

  // Attendance & Terminal Scanner
  liveOccupancy: number;
  maxCapacity: number;
  checkInLogs: CheckInLog[];
  simulateScan: (customName?: string) => { name: string; plan: string; allowed: boolean };
  lastScannedMember: { name: string; plan: string; code: string; allowed: boolean; timestamp: string } | null;
  isTerminalLocked: boolean;
  toggleTerminalLock: () => void;

  // Classes & PT
  classes: ClassSession[];
  addClass: (data: Omit<ClassSession, 'id' | 'enrolled' | 'waitlist' | 'status'>) => void;
  updateClassCapacity: (id: string, action: 'enroll' | 'drop' | 'waitlist') => void;
  ptSessions: PTSession[];
  updatePTSessionStatus: (id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => void;
  unscheduledRequests: UnscheduledPTRequest[];
  movePTSession: (sessionId: string, newDay: PTSession['day'], newTimeSlot: string, newTrainerName?: string) => void;
  assignUnscheduledRequest: (requestId: string, day: PTSession['day'], timeSlot: string, trainerName?: string) => void;
  scheduleNewPTSession: (data: Partial<PTSession> & { clientName: string; trainerName: string; timeSlot: string; day: PTSession['day'] }) => void;
  deletePTSession: (id: string) => void;

  // CRM Leads
  leads: Lead[];
  addLead: (lead: { name: string; email: string; phone: string; source: any; assignedRep: string; notes?: string }) => void;
  updateLeadStage: (id: string, newStage: LeadStage) => void;
  convertLeadToMember: (leadId: string, plan: MembershipPlan) => void;

  // Staff & HR
  staff: StaffMember[];
  addStaff: (data: { name: string; role: StaffMember['role']; phone: string; shiftHours?: string }) => void;
  staffFeed: StaffCheckInFeed[];
  approveStaffCheckIn: (feedId: string) => void;
  rejectStaffCheckIn: (feedId: string) => void;

  // Invoices & Billing
  invoices: Invoice[];
  addInvoice: (data: { memberName: string; planOrDescription: string; amount: number; method: Invoice['method']; status?: Invoice['status'] }) => void;
  pendingPayments: typeof PENDING_PAYMENTS_LIST;
  markPendingPaid: (index: number) => void;

  // Global Toasts & Modals
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  activeModal: string | null;
  modalPayload: any;
  openModal: (modalName: string, payload?: any) => void;
  closeModal: () => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme Switcher (Dark / Light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('gymos-theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('gymos-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [activeScreen, setActiveScreenRaw] = useState<ScreenId>('dashboard');

  const setActiveScreen = (screen: ScreenId) => {
    if (screen === 'super-admin' && currentUser?.role !== 'superadmin') {
      showToast('Access Restricted', 'Super Admin interface is strictly restricted to platform superadministrators.', 'error');
      return;
    }
    setActiveScreenRaw(screen);
  };
  const [currentBranchId, setCurrentBranchId] = useState<BranchId>('downtown');
  const currentBranch = BRANCHES.find(b => b.id === currentBranchId) || BRANCHES[0];

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'u-director',
    username: 'admin@gymos.io',
    name: 'Alex Ross',
    role: 'director',
    email: 'director@gymos.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  });

  const [saasPackages, setSaasPackages] = useState<SaaSPackage[]>(INITIAL_SAAS_PACKAGES);
  const [saasLicenses, setSaasLicenses] = useState<SaaSLicense[]>(INITIAL_SAAS_LICENSES);
  const [activeTenantLicense, setActiveTenantLicense] = useState<SaaSLicense>(INITIAL_SAAS_LICENSES[0]);

  // Tenant Admin: RBAC & Function Selection State
  const [tenantRoles, setTenantRoles] = useState<TenantRole[]>(DEFAULT_TENANT_ROLES);
  const [userRoleAssignments, setUserRoleAssignments] = useState<UserRoleAssignment[]>(INITIAL_USER_ASSIGNMENTS);
  const allRbacPermissions = ALL_RBAC_PERMISSIONS;

  const login = (username: string, password: string): { success: boolean; error?: string; role?: UserRole } => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // 1. Superadmin verification as specified: superadmin / Admin#321
    if (cleanUser === 'superadmin' && cleanPass === 'Admin#321') {
      const superAdminUser: User = {
        id: 'u-superadmin',
        username: 'superadmin',
        name: 'Platform Super Admin',
        role: 'superadmin',
        email: 'superadmin@gymos.cloud',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      setCurrentUser(superAdminUser);
      setActiveScreenRaw('super-admin');
      showToast('Super Admin Access Granted', 'Full platform licensing & SaaS package control initialized.', 'success');
      return { success: true, role: 'superadmin' };
    }

    // 2. Gym Director / Admin demo account
    if (
      (cleanUser.toLowerCase() === 'admin@gymos.io' || cleanUser.toLowerCase() === 'admin') &&
      (cleanPass === 'gym123' || cleanPass === 'admin')
    ) {
      const directorUser: User = {
        id: 'u-director',
        username: 'admin@gymos.io',
        name: 'Alex Ross',
        role: 'director',
        email: 'director@gymos.io',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      };
      setCurrentUser(directorUser);
      setActiveScreen('dashboard');
      showToast('Welcome Alex Ross', 'Logged in as Gym Operations Director', 'success');
      return { success: true, role: 'director' };
    }

    // 3. Front Desk Staff demo account
    if (
      (cleanUser.toLowerCase() === 'staff@gymos.io' || cleanUser.toLowerCase() === 'staff') &&
      (cleanPass === 'staff123' || cleanPass === 'staff')
    ) {
      const staffUser: User = {
        id: 'u-staff',
        username: 'staff@gymos.io',
        name: 'Jessica Davis',
        role: 'staff',
        email: 'staff@gymos.io'
      };
      setCurrentUser(staffUser);
      setActiveScreen('attendance');
      showToast('Terminal Initialized', 'Front Desk staff shift active', 'success');
      return { success: true, role: 'staff' };
    }

    return {
      success: false,
      error: 'Invalid credentials. For Super Admin, use Login ID "superadmin" & Password "Admin#321"'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveScreen('landing');
    showToast('Signed Out', 'You have been safely disconnected from GymOS.', 'info');
  };

  const switchRole = (newRole: UserRole) => {
    if (!currentUser) return;
    if (newRole === 'superadmin') {
      if (currentUser.role !== 'superadmin') {
        showToast('Access Denied', 'Super Admin console requires dedicated credentials.', 'error');
        return;
      }
      setActiveScreenRaw('super-admin');
      showToast('Super Admin Console', 'Platform licensing view active', 'info');
    } else {
      setCurrentUser({
        ...currentUser,
        role: newRole,
        name: newRole === 'director' ? 'Alex Ross' : newRole === 'manager' ? 'Sneha Kulkarni' : 'Rohan Deshmukh'
      });
      if (activeScreen === 'super-admin') {
        setActiveScreenRaw('dashboard');
      }
      showToast('Role Switched', `Active view updated to ${newRole} permissions`, 'info');
    }
  };

  const saveSaaSPackage = (pkg: SaaSPackage) => {
    setSaasPackages(prev => {
      const exists = prev.some(p => p.id === pkg.id);
      if (exists) {
        return prev.map(p => (p.id === pkg.id ? pkg : p));
      }
      return [pkg, ...prev];
    });
    showToast('Package Blueprint Saved', `SaaS package "${pkg.name}" is now live in the engine.`, 'success');
  };

  const deleteSaaSPackage = (id: string) => {
    setSaasPackages(prev => prev.filter(p => p.id !== id));
    showToast('Package Archived', 'Plan template removed from active catalog.', 'info');
  };

  const generateLicense = (data: {
    gymName: string;
    contactEmail: string;
    adminName: string;
    tier: string;
    maxMembers: number;
    maxStaff: number;
    maxLocations: number;
    durationMonths: number;
    features: string[];
    hardwareBinding?: string;
  }): SaaSLicense => {
    const tierCode = (data.tier || 'PRO').slice(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const randPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const licenseKey = `GOS-${tierCode}-${year}-${randPart1}-${randPart2}-M${data.maxMembers}-L${data.maxLocations}-ST${data.maxStaff}`;

    const now = new Date();
    const expiry = new Date(now.getTime() + (data.durationMonths || 12) * 30 * 24 * 60 * 60 * 1000);
    const issueDateStr = now.toISOString().split('T')[0];
    const expiryDateStr = expiry.toISOString().split('T')[0];

    const signatureRaw = `${licenseKey}:${data.contactEmail}:${expiryDateStr}:${data.maxMembers}`;
    let hash = 0;
    for (let i = 0; i < signatureRaw.length; i++) {
      hash = ((hash << 5) - hash) + signatureRaw.charCodeAt(i);
      hash |= 0;
    }
    const signature = `SHA256:${Math.abs(hash).toString(16).padStart(8, '0')}${Math.abs(hash * 31).toString(16).padStart(8, '0')}00f492b`;

    const newLicense: SaaSLicense = {
      id: `lic-${Date.now().toString(36)}`,
      licenseKey,
      gymName: data.gymName,
      contactEmail: data.contactEmail,
      adminName: data.adminName,
      tier: data.tier,
      maxMembers: data.maxMembers,
      maxStaff: data.maxStaff,
      maxLocations: data.maxLocations,
      currentMembersUsed: 0,
      currentLocationsUsed: 1,
      issueDate: issueDateStr,
      expiryDate: expiryDateStr,
      status: 'Active',
      operationStatus: 'Online & Operational',
      turnstilesOnline: 2,
      totalTurnstiles: 2,
      liveFloorOccupancy: 0,
      syncLatencyMs: 14,
      lastHeartbeat: 'Just now',
      clusterHub: 'Asia-South (Regional Hub)',
      features: data.features,
      hardwareBinding: data.hardwareBinding || `HW-AUTO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      signature
    };

    setSaasLicenses(prev => [newLicense, ...prev]);
    showToast('License Key Generated', `Cryptographic key issued for ${data.gymName}`, 'success');
    return newLicense;
  };

  const updateLicenseStatus = (id: string, status: SaaSLicense['status']) => {
    setSaasLicenses(prev => prev.map(lic => lic.id === id ? { ...lic, status } : lic));
    showToast('License Status Updated', `License ${id} marked as ${status}`, 'info');
  };

  const updateOperationStatus = (id: string, operationStatus: SaaSLicense['operationStatus']) => {
    setSaasLicenses(prev => prev.map(lic => lic.id === id ? { ...lic, operationStatus } : lic));
    showToast('Operation Status Updated', `Tenant marked as "${operationStatus}"`, 'info');
  };

  const applyLicenseToTenant = (license: SaaSLicense) => {
    setActiveTenantLicense(license);
    showToast('License Activated on Tenant', `Applied ${license.tier} (${license.maxMembers.toLocaleString()} members quota)`, 'success');
  };

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [liveOccupancy, setLiveOccupancy] = useState<number>(142);
  const maxCapacity = currentBranch.capacity;
  const [checkInLogs, setCheckInLogs] = useState<CheckInLog[]>(INITIAL_CHECKINS);
  const [isTerminalLocked, setIsTerminalLocked] = useState<boolean>(false);
  const [lastScannedMember, setLastScannedMember] = useState<{
    name: string;
    plan: string;
    code: string;
    allowed: boolean;
    timestamp: string;
  } | null>({
    name: 'Alex Mercer',
    plan: 'VIP ANNUAL',
    code: '#MEM-84920',
    allowed: true,
    timestamp: 'Just now'
  });

  const [classes, setClasses] = useState<ClassSession[]>(INITIAL_CLASSES);
  const [ptSessions, setPtSessions] = useState<PTSession[]>(INITIAL_PT_SESSIONS);
  const [unscheduledRequests, setUnscheduledRequests] = useState<UnscheduledPTRequest[]>(INITIAL_UNSCHEDULED_REQUESTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [staffFeed, setStaffFeed] = useState<StaffCheckInFeed[]>(INITIAL_STAFF_FEED);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [pendingPayments, setPendingPayments] = useState(PENDING_PAYMENTS_LIST);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openModal = (modalName: string, payload: any = null) => {
    setActiveModal(modalName);
    setModalPayload(payload);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
  };

  const setBranch = (branchId: BranchId) => {
    setCurrentBranchId(branchId);
    const branch = BRANCHES.find(b => b.id === branchId);
    showToast('Branch Switched', `Now viewing operations for ${branch?.name || branchId}`, 'info');
  };

  // Add Member
  const addMember = (data: { name: string; email: string; phone: string; plan: MembershipPlan }) => {
    const newCode = `#MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember: Member = {
      id: `m-${Date.now()}`,
      memberCode: newCode,
      name: data.name,
      email: data.email,
      phone: data.phone,
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0wHCSuwSOm8a8yUq8R6hY-UiVI6PgJOtL_E0YXKOhqUARbwqXLcdgbrnYHgnhe9dU4DFwJ9AOiAzccoAZRjvoo8ZgqmiTnpNfznnJWf-AUo9uCHPGi6O5CmhAr0yCDPp1NIT6e94MDptTYciYxQsDjmgznv1IwlNBoOwA4rLQVeK5CLr7x4uJX4B7v_rdnG7NTCDX3rd7tlwNkzEAVpdmpG6897I63p3Ho4-i5kFUZCs5HXYpeK8Vig',
      plan: data.plan,
      status: 'active',
      joinedDate: 'Today',
      expiryDate: 'Oct 2027',
      lastVisit: 'Just registered',
      totalCheckIns: 0
    };

    setMembers(prev => [newMember, ...prev]);
    showToast('Member Registered', `${newMember.name} has been enrolled under ${newMember.plan}`, 'success');
  };

  // Renew Member
  const renewMember = (id: string, newPlan?: MembershipPlan) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === id) {
          const plan = newPlan || m.plan;
          return {
            ...m,
            plan,
            status: 'active',
            expiryDate: 'Oct 2027'
          };
        }
        return m;
      })
    );
    showToast('Membership Renewed', 'Membership has been reactivated successfully for another term.', 'success');
  };

  // Toggle freeze
  const toggleMemberFreeze = (id: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === id) {
          const newStatus = m.status === 'frozen' ? 'active' : 'frozen';
          return { ...m, status: newStatus };
        }
        return m;
      })
    );
    showToast('Status Updated', 'Member status modified successfully', 'info');
  };

  // Check In member
  const checkInMember = (memberId: string, method: CheckInMethod = 'Manual Entry') => {
    const member = members.find(m => m.id === memberId);
    if (!member) return false;

    if (member.status === 'expired' || member.status === 'cancelled') {
      const deniedLog: CheckInLog = {
        id: `ci-${Date.now()}`,
        memberId: member.id,
        memberName: member.name,
        memberCode: member.memberCode,
        plan: member.plan,
        timestamp: new Date().toISOString(),
        timeFormatted: 'Just now',
        method,
        status: 'Access Denied',
        terminal: 'Front Desk'
      };
      setCheckInLogs(prev => [deniedLog, ...prev]);
      showToast('Access Denied', `${member.name}'s plan is ${member.status}. Renewal required.`, 'error');
      return false;
    }

    const newLog: CheckInLog = {
      id: `ci-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      memberCode: member.memberCode,
      plan: member.plan,
      timestamp: new Date().toISOString(),
      timeFormatted: 'Just now',
      method,
      status: 'Allowed',
      terminal: 'Front Desk'
    };

    setCheckInLogs(prev => [newLog, ...prev]);
    setLiveOccupancy(prev => Math.min(prev + 1, maxCapacity));
    setMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? { ...m, lastVisit: 'Just now', totalCheckIns: m.totalCheckIns + 1 }
          : m
      )
    );

    setLastScannedMember({
      name: member.name,
      plan: member.plan.toUpperCase(),
      code: member.memberCode,
      allowed: true,
      timestamp: 'Checked in just now'
    });

    showToast('Check-in Verified', `${member.name} entered the facility. Turnstile unlocked.`, 'success');
    return true;
  };

  // Simulate Next Scan on Terminal #04
  const simulateScan = (customName?: string) => {
    if (isTerminalLocked) {
      showToast('Terminal Locked', 'Please unlock Terminal #04 before scanning passes.', 'warning');
      return { name: 'Unknown', plan: 'N/A', allowed: false };
    }

    const availableMembers = members.length > 0 ? members : INITIAL_MEMBERS;
    const randomMember = customName
      ? availableMembers.find(m => m.name.toLowerCase().includes(customName.toLowerCase())) || availableMembers[0]
      : availableMembers[Math.floor(Math.random() * availableMembers.length)];

    const isAllowed = randomMember.status === 'active';

    const newCheckIn: CheckInLog = {
      id: `ci-${Date.now()}`,
      memberId: randomMember.id,
      memberName: randomMember.name,
      memberCode: randomMember.memberCode,
      plan: randomMember.plan,
      timestamp: new Date().toISOString(),
      timeFormatted: 'Just now',
      method: 'QR Scanner',
      status: isAllowed ? 'Allowed' : 'Access Denied',
      terminal: 'Terminal #04'
    };

    setCheckInLogs(prev => [newCheckIn, ...prev.slice(0, 19)]);

    if (isAllowed) {
      setLiveOccupancy(prev => Math.min(prev + 1, maxCapacity));
    }

    setLastScannedMember({
      name: randomMember.name,
      plan: randomMember.plan.toUpperCase(),
      code: randomMember.memberCode,
      allowed: isAllowed,
      timestamp: 'Checked in 2s ago'
    });

    if (isAllowed) {
      showToast('Scan Verified (Terminal #04)', `Access Granted: ${randomMember.name} • ${randomMember.plan}`, 'success');
    } else {
      showToast('Scan Rejected (Terminal #04)', `Access Denied: ${randomMember.name} (${randomMember.status.toUpperCase()})`, 'error');
    }

    return { name: randomMember.name, plan: randomMember.plan, allowed: isAllowed };
  };

  const toggleTerminalLock = () => {
    setIsTerminalLocked(prev => {
      const next = !prev;
      showToast(
        next ? 'Terminal Locked' : 'Terminal Unlocked',
        next ? 'Terminal #04 is now paused and locked.' : 'Terminal #04 is live and scanning.',
        next ? 'warning' : 'success'
      );
      return next;
    });
  };

  // Add Class
  const addClass = (data: Omit<ClassSession, 'id' | 'enrolled' | 'waitlist' | 'status'>) => {
    const newClass: ClassSession = {
      ...data,
      id: `cls-${Date.now()}`,
      enrolled: 0,
      waitlist: 0,
      status: 'upcoming'
    };
    setClasses(prev => [...prev, newClass]);
    showToast('Class Scheduled', `"${newClass.title}" published to member mobile schedule.`, 'success');
  };

  const updateClassCapacity = (id: string, action: 'enroll' | 'drop' | 'waitlist') => {
    setClasses(prev =>
      prev.map(c => {
        if (c.id === id) {
          if (action === 'enroll') {
            return { ...c, enrolled: Math.min(c.enrolled + 1, c.capacity) };
          } else if (action === 'drop') {
            return { ...c, enrolled: Math.max(c.enrolled - 1, 0) };
          } else if (action === 'waitlist') {
            return { ...c, waitlist: c.waitlist + 1 };
          }
        }
        return c;
      })
    );
    showToast('Roster Updated', 'Class attendance roster updated.', 'info');
  };

  // PT session status
  const updatePTSessionStatus = (id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
    setPtSessions(prev =>
      prev.map(pt => (pt.id === id ? { ...pt, status } : pt))
    );
    showToast('PT Session Updated', `Session status changed to ${status}`, 'info');
  };

  // Drag and Drop PT Session Rescheduling
  const movePTSession = (
    sessionId: string,
    newDay: PTSession['day'],
    newTimeSlot: string,
    newTrainerName?: string
  ) => {
    setPtSessions(prev =>
      prev.map(s => {
        if (s.id === sessionId) {
          return {
            ...s,
            day: newDay,
            timeSlot: newTimeSlot,
            trainerName: newTrainerName || s.trainerName
          };
        }
        return s;
      })
    );
    showToast(
      'PT Slot Rescheduled',
      `Session moved to ${newDay} at ${newTimeSlot}${newTrainerName ? ` with ${newTrainerName}` : ''}`,
      'success'
    );
  };

  // Assign Unscheduled PT request by dragging onto calendar
  const assignUnscheduledRequest = (
    requestId: string,
    day: PTSession['day'],
    timeSlot: string,
    trainerName?: string
  ) => {
    const req = unscheduledRequests.find(r => r.id === requestId);
    if (!req) return;

    const newSession: PTSession = {
      id: `pt-${Date.now()}`,
      clientName: req.clientName,
      clientId: req.clientId,
      clientPhoto: req.clientPhoto,
      trainerName: trainerName || req.preferredTrainer,
      timeSlot,
      day,
      packageType: req.packageType,
      focus: req.focus,
      durationMins: 60,
      status: 'Confirmed',
      price: req.price,
      notes: `Scheduled from queue for ${day}`
    };

    setPtSessions(prev => [newSession, ...prev]);
    setUnscheduledRequests(prev => prev.filter(r => r.id !== requestId));
    showToast('PT Slot Booked', `${req.clientName} booked for ${day} at ${timeSlot} with ${newSession.trainerName}`, 'success');
  };

  const scheduleNewPTSession = (data: Partial<PTSession> & { clientName: string; trainerName: string; timeSlot: string; day: PTSession['day'] }) => {
    const newSession: PTSession = {
      id: `pt-${Date.now()}`,
      clientName: data.clientName,
      clientId: data.clientId || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientPhoto: data.clientPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      trainerName: data.trainerName,
      timeSlot: data.timeSlot,
      day: data.day,
      packageType: data.packageType || 'Standard Personal Coaching',
      focus: data.focus || 'Strength & Conditioning',
      durationMins: data.durationMins || 60,
      status: 'Confirmed',
      price: data.price || 1800,
      notes: data.notes || 'Scheduled via Calendar drag-drop interface'
    };

    setPtSessions(prev => [newSession, ...prev]);
    showToast('PT Booked', `Booked ${newSession.clientName} for ${newSession.day} at ${newSession.timeSlot}`, 'success');
  };

  const deletePTSession = (id: string) => {
    setPtSessions(prev => prev.filter(s => s.id !== id));
    showToast('PT Slot Removed', 'Session deleted from calendar.', 'info');
  };

  // ==========================================
  // Tenant Admin: RBAC & Permission Management
  // ==========================================

  const updateUserRole = (userId: string, roleId: string) => {
    const targetRole = tenantRoles.find(r => r.id === roleId);
    if (!targetRole) return;

    setUserRoleAssignments(prev =>
      prev.map(u => {
        if (u.userId === userId) {
          return {
            ...u,
            roleId,
            roleName: targetRole.name
          };
        }
        return u;
      })
    );
    showToast('Role Updated', `Updated role to ${targetRole.name}`, 'success');
  };

  const toggleUserCustomOverridesMode = (userId: string, enabled: boolean) => {
    setUserRoleAssignments(prev =>
      prev.map(u => (u.userId === userId ? { ...u, hasCustomOverrides: enabled } : u))
    );
    showToast('Permissions Mode', enabled ? 'Custom function overrides enabled' : 'Reset to role template default', 'info');
  };

  const toggleUserPermissionOverride = (userId: string, permissionId: string, grant: boolean) => {
    setUserRoleAssignments(prev =>
      prev.map(u => {
        if (u.userId !== userId) return u;
        const role = tenantRoles.find(r => r.id === u.roleId);
        const roleHasIt = role ? role.permissionIds.includes(permissionId) : false;

        let granted = [...u.customGrantedPermissions];
        let revoked = [...u.customRevokedPermissions];

        if (grant) {
          revoked = revoked.filter(p => p !== permissionId);
          if (!roleHasIt && !granted.includes(permissionId)) {
            granted.push(permissionId);
          }
        } else {
          granted = granted.filter(p => p !== permissionId);
          if (roleHasIt && !revoked.includes(permissionId)) {
            revoked.push(permissionId);
          }
        }

        return {
          ...u,
          hasCustomOverrides: true,
          customGrantedPermissions: granted,
          customRevokedPermissions: revoked
        };
      })
    );
    showToast('Permission Changed', `Toggled function permission (${grant ? 'Granted' : 'Revoked'})`, 'info');
  };

  const addNewUserAssignment = (data: { name: string; email: string; roleId: string; department: UserRoleAssignment['department']; avatar?: string }) => {
    const role = tenantRoles.find(r => r.id === data.roleId) || tenantRoles[0];
    const newAssignment: UserRoleAssignment = {
      userId: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      avatar: data.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      roleId: role.id,
      roleName: role.name,
      hasCustomOverrides: false,
      customGrantedPermissions: [],
      customRevokedPermissions: [],
      status: 'Active',
      department: data.department,
      lastActive: 'Just invited',
      assignedBranchId: currentBranchId
    };

    setUserRoleAssignments(prev => [newAssignment, ...prev]);
    showToast('User Role Assigned', `Created RBAC profile for ${data.name} as ${role.name}`, 'success');
  };

  const saveTenantRole = (newOrUpdatedRole: TenantRole) => {
    setTenantRoles(prev => {
      const exists = prev.some(r => r.id === newOrUpdatedRole.id);
      if (exists) {
        return prev.map(r => (r.id === newOrUpdatedRole.id ? newOrUpdatedRole : r));
      }
      return [...prev, newOrUpdatedRole];
    });
    showToast('Role Saved', `Role blueprint "${newOrUpdatedRole.name}" updated.`, 'success');
  };

  const hasUserPermission = (userId: string, permissionId: string): boolean => {
    const user = userRoleAssignments.find(u => u.userId === userId);
    if (!user) return false;
    if (user.status === 'Suspended') return false;

    if (user.hasCustomOverrides) {
      if (user.customRevokedPermissions.includes(permissionId)) return false;
      if (user.customGrantedPermissions.includes(permissionId)) return true;
    }

    const role = tenantRoles.find(r => r.id === user.roleId);
    return role ? role.permissionIds.includes(permissionId) : false;
  };

  // Leads
  const addLead = (lead: { name: string; email: string; phone: string; source: any; assignedRep: string; notes?: string }) => {
    const initials = lead.assignedRep
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    const newLead: Lead = {
      id: `ld-${Date.now()}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      stage: 'New Inquiry',
      source: lead.source,
      assignedRep: lead.assignedRep,
      assignedRepInitials: initials || 'JD',
      lastInteraction: 'Just created',
      notes: lead.notes || 'Prospect interested in facility membership'
    };

    setLeads(prev => [newLead, ...prev]);
    showToast('Lead Added', `${newLead.name} added to pipeline under New Inquiry.`, 'success');
  };

  const updateLeadStage = (id: string, newStage: LeadStage) => {
    setLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, stage: newStage, lastInteraction: 'Just now' } : l))
    );
    showToast('Stage Updated', `Lead moved to ${newStage}`, 'info');
  };

  const convertLeadToMember = (leadId: string, plan: MembershipPlan) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    addMember({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      plan
    });

    updateLeadStage(leadId, 'Won / Converted');
    showToast('Lead Converted!', `${lead.name} is now an active member!`, 'success');
  };

  // Staff
  const addStaff = (data: { name: string; role: StaffMember['role']; phone: string; shiftHours?: string }) => {
    const newStaff: StaffMember = {
      id: `s-${Date.now()}`,
      staffCode: `#GYM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      role: data.role,
      category: data.role.toLowerCase().includes('trainer') ? 'trainer' : data.role.toLowerCase().includes('desk') ? 'frontdesk' : 'management',
      phone: data.phone,
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLv6HwU0cph9_w2XMDRYMXlljFn5geUkJ5rEBtfKdXgwhJQ4TKWVdqu_i8K5BASSrcdSlCJFaaJtqmF49hSMq7G2LcwsqJPPXfukthwBBu17OUoPYrJtQ6atWLQnHK9DIBVocZflo3Efu1uVzNO-hTcFxsLW0Q63vzL6yJWOGOyDFPXMunwqZN8TI0oqKR_wnFcJYfEMbP5aUHEWFhrv-XKmQ2tQghVOwMrug9pqQazSzU3uBrXsYw0Q',
      shiftHours: data.shiftHours || '08:00 - 17:00',
      shiftType: 'Full Day',
      geofenceStatus: 'Verified Inside',
      onShift: true
    };

    setStaff(prev => [newStaff, ...prev]);
    showToast('Staff Added', `${newStaff.name} added to staff directory.`, 'success');
  };

  const approveStaffCheckIn = (feedId: string) => {
    setStaffFeed(prev =>
      prev.map(f => (f.id === feedId ? { ...f, status: 'Approved by Manager' } : f))
    );
    showToast('Check-in Approved', 'Staff geofence exception approved by Manager.', 'success');
  };

  const rejectStaffCheckIn = (feedId: string) => {
    setStaffFeed(prev =>
      prev.map(f => (f.id === feedId ? { ...f, status: 'Rejected' } : f))
    );
    showToast('Check-in Rejected', 'Staff check-in has been marked invalid.', 'error');
  };

  // Invoices
  const addInvoice = (data: { memberName: string; planOrDescription: string; amount: number; method: Invoice['method']; status?: Invoice['status'] }) => {
    const invNum = `#INV-${Math.floor(8000 + Math.random() * 999)}`;
    const initials = data.memberName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      memberId: 'm-custom',
      memberName: data.memberName,
      memberCode: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      memberInitials: initials || 'JD',
      planOrDescription: data.planOrDescription,
      amount: data.amount,
      method: data.method,
      dateTimeFormatted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: data.status || 'Paid'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    showToast('Payment Recorded', `Invoice ${invNum} for ₹${data.amount.toLocaleString('en-IN')} processed via ${data.method}.`, 'success');
  };

  const markPendingPaid = (index: number) => {
    const item = pendingPayments[index];
    if (!item) return;

    addInvoice({
      memberName: item.name,
      planOrDescription: item.subtitle,
      amount: item.amount,
      method: 'UPI',
      status: 'Paid'
    });

    setPendingPayments(prev => prev.filter((_, i) => i !== index));
    showToast('Payment Settled', `Cleared outstanding ${item.subtitle} for ${item.name}`, 'success');
  };

  return (
    <GymContext.Provider
      value={{
        theme,
        toggleTheme,
        activeScreen,
        setActiveScreen,
        currentBranch,
        setBranch,
        branches: BRANCHES,
        currentUser,
        login,
        logout,
        switchRole,
        saasPackages,
        saveSaaSPackage,
        deleteSaaSPackage,
        saasLicenses,
        activeTenantLicense,
        generateLicense,
        updateLicenseStatus,
        updateOperationStatus,
        applyLicenseToTenant,
        tenantRoles,
        userRoleAssignments,
        allRbacPermissions,
        updateUserRole,
        toggleUserPermissionOverride,
        toggleUserCustomOverridesMode,
        addNewUserAssignment,
        saveTenantRole,
        hasUserPermission,
        members,
        addMember,
        renewMember,
        toggleMemberFreeze,
        checkInMember,
        liveOccupancy,
        maxCapacity,
        checkInLogs,
        simulateScan,
        lastScannedMember,
        isTerminalLocked,
        toggleTerminalLock,
        classes,
        addClass,
        updateClassCapacity,
        ptSessions,
        updatePTSessionStatus,
        unscheduledRequests,
        movePTSession,
        assignUnscheduledRequest,
        scheduleNewPTSession,
        deletePTSession,
        leads,
        addLead,
        updateLeadStage,
        convertLeadToMember,
        staff,
        addStaff,
        staffFeed,
        approveStaffCheckIn,
        rejectStaffCheckIn,
        invoices,
        addInvoice,
        pendingPayments,
        markPendingPaid,
        toasts,
        showToast,
        removeToast,
        activeModal,
        modalPayload,
        openModal,
        closeModal
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
