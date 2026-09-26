import { RBACPermission, TenantRole, UserRoleAssignment } from '../types';

export const ALL_RBAC_PERMISSIONS: RBACPermission[] = [
  // Dashboard & Telemetry
  {
    id: 'perm_dash_view_kpis',
    name: 'View Real-Time Telemetry & Occupancy',
    description: 'Access live occupancy counters, active member counts, and scanner gateway feeds.',
    module: 'dashboard_analytics',
    category: 'View'
  },
  {
    id: 'perm_dash_view_revenue',
    name: 'View Financial MRR & Daily Collections',
    description: 'Inspect total revenue numbers, collection breakdown, and financial forecast charts.',
    module: 'dashboard_analytics',
    category: 'View'
  },
  {
    id: 'perm_dash_export_d3',
    name: 'Export Heatmap & Telemetry Data',
    description: 'Download D3 density matrices, churn cohorts, and raw visit metrics as CSV/JSON.',
    module: 'dashboard_analytics',
    category: 'Execute'
  },

  // Members & Access Control
  {
    id: 'perm_members_view_directory',
    name: 'View Member Directory & Records',
    description: 'Browse all club members, contact details, attendance counts, and status.',
    module: 'members_crm',
    category: 'View'
  },
  {
    id: 'perm_members_create_onboard',
    name: 'Onboard & Register New Members',
    description: 'Create new member profiles, issue RFID/QR codes, and upload verification photos.',
    module: 'members_crm',
    category: 'Create'
  },
  {
    id: 'perm_members_freeze_cancel',
    name: 'Freeze or Terminate Memberships',
    description: 'Pause subscription billing or revoke facility access privileges.',
    module: 'members_crm',
    category: 'Edit',
    isDangerous: true
  },
  {
    id: 'perm_members_view_emergency',
    name: 'View Emergency Contacts & Medical Info',
    description: 'Inspect sensitive health waivers and emergency next-of-kin information.',
    module: 'members_crm',
    category: 'View'
  },

  // Gate Access & Hardware
  {
    id: 'perm_gate_simulate_scan',
    name: 'Process QR Scanner Turnstile Check-Ins',
    description: 'Operate front desk scan terminal and allow manual member entry.',
    module: 'gate_access',
    category: 'Execute'
  },
  {
    id: 'perm_gate_emergency_override',
    name: 'Emergency Gate Unlock / Relay Pulse',
    description: 'Trigger GPIO signal to unlock physical turnstile gates during emergency or bypass.',
    module: 'gate_access',
    category: 'Execute',
    isDangerous: true
  },
  {
    id: 'perm_gate_toggle_lockdown',
    name: 'Facility Terminal Lockdown',
    description: 'Halt all automatic door relays and restrict entrance to authorized staff only.',
    module: 'gate_access',
    category: 'Edit',
    isDangerous: true
  },

  // Classes & PT Scheduling
  {
    id: 'perm_pt_view_calendar',
    name: 'View PT & Class Calendar',
    description: 'Access visual weekly calendar of all trainer bookings and group fitness sessions.',
    module: 'classes_pt_scheduler',
    category: 'View'
  },
  {
    id: 'perm_pt_drag_drop_reschedule',
    name: 'Drag-and-Drop Slot Rescheduling',
    description: 'Reassign PT sessions between trainers, adjust time slots, or drag unassigned queue.',
    module: 'classes_pt_scheduler',
    category: 'Edit'
  },
  {
    id: 'perm_pt_create_appointment',
    name: 'Book 1-on-1 PT Appointments',
    description: 'Create new coaching appointments and assign member client packages.',
    module: 'classes_pt_scheduler',
    category: 'Create'
  },
  {
    id: 'perm_pt_manage_group_classes',
    name: 'Create & Manage Group Fitness Classes',
    description: 'Add new HIIT, Yoga, or Spin classes, set instructor, duration, and studio capacities.',
    module: 'classes_pt_scheduler',
    category: 'Create'
  },

  // Billing & Payments
  {
    id: 'perm_billing_view_invoices',
    name: 'View Payment Ledgers & Invoices',
    description: 'Audit transaction receipts, member payment statuses, and overdue lists.',
    module: 'billing_payments',
    category: 'View'
  },
  {
    id: 'perm_billing_collect_upi_cash',
    name: 'Collect UPI & Cash Fees',
    description: 'Generate dynamic UPI QR codes and record instant fee payments.',
    module: 'billing_payments',
    category: 'Create'
  },
  {
    id: 'perm_billing_issue_refunds',
    name: 'Authorize & Process Payment Refunds',
    description: 'Refund processed membership fees back to original payment method or credit note.',
    module: 'billing_payments',
    category: 'Execute',
    isDangerous: true
  },

  // Staff & HR Payroll
  {
    id: 'perm_staff_view_attendance',
    name: 'View Staff Shift Geofence Feeds',
    description: 'Inspect live staff arrival telemetry, selfie verifications, and shift status.',
    module: 'staff_hr_payroll',
    category: 'View'
  },
  {
    id: 'perm_staff_approve_shifts',
    name: 'Approve Shift Timesheets & Overtime',
    description: 'Validate manager review flags and approve biometric clock-in logs.',
    module: 'staff_hr_payroll',
    category: 'Edit'
  },
  {
    id: 'perm_staff_view_payroll_payslips',
    name: 'Process Payroll & Export Bank ACH/NEFT',
    description: 'Access staff salaries, commissions, TDS withholding, and generate payout files.',
    module: 'staff_hr_payroll',
    category: 'Execute',
    isDangerous: true
  },

  // Tenant Settings & RBAC
  {
    id: 'perm_settings_edit_branch',
    name: 'Modify Branch Configuration',
    description: 'Change gym address, capacity thresholds, geofence radius, and operating hours.',
    module: 'tenant_settings',
    category: 'Edit'
  },
  {
    id: 'perm_settings_manage_rbac',
    name: 'Manage User-Wise RBAC & Permissions',
    description: 'Assign roles to staff, customize function permissions, and audit security tokens.',
    module: 'tenant_settings',
    category: 'Edit',
    isDangerous: true
  }
];

export const DEFAULT_TENANT_ROLES: TenantRole[] = [
  {
    id: 'role_director',
    name: 'Club Director / Owner',
    description: 'Full administrative authority across all operational branches, payroll, and RBAC security.',
    badgeColor: 'bg-primary/20 text-primary border-primary/40',
    isSystemDefault: true,
    permissionIds: ALL_RBAC_PERMISSIONS.map(p => p.id)
  },
  {
    id: 'role_operations_manager',
    name: 'Operations Manager',
    description: 'Oversees daily club operations, member onboarding, staff shifts, and PT schedules.',
    badgeColor: 'bg-tertiary/20 text-tertiary border-tertiary/40',
    isSystemDefault: true,
    permissionIds: [
      'perm_dash_view_kpis',
      'perm_dash_view_revenue',
      'perm_dash_export_d3',
      'perm_members_view_directory',
      'perm_members_create_onboard',
      'perm_members_freeze_cancel',
      'perm_members_view_emergency',
      'perm_gate_simulate_scan',
      'perm_gate_emergency_override',
      'perm_pt_view_calendar',
      'perm_pt_drag_drop_reschedule',
      'perm_pt_create_appointment',
      'perm_pt_manage_group_classes',
      'perm_billing_view_invoices',
      'perm_billing_collect_upi_cash',
      'perm_staff_view_attendance',
      'perm_staff_approve_shifts',
      'perm_settings_edit_branch'
    ]
  },
  {
    id: 'role_head_trainer',
    name: 'Head Coach / Lead Trainer',
    description: 'Manages personal training schedules, coach workload, group classes, and client fitness files.',
    badgeColor: 'bg-secondary/20 text-secondary border-secondary/40',
    isSystemDefault: true,
    permissionIds: [
      'perm_dash_view_kpis',
      'perm_members_view_directory',
      'perm_members_view_emergency',
      'perm_gate_simulate_scan',
      'perm_pt_view_calendar',
      'perm_pt_drag_drop_reschedule',
      'perm_pt_create_appointment',
      'perm_pt_manage_group_classes',
      'perm_staff_view_attendance'
    ]
  },
  {
    id: 'role_front_desk',
    name: 'Front Desk Lead / Receptionist',
    description: 'First point of contact for member check-in, dynamic UPI fee collection, and trial booking.',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    isSystemDefault: true,
    permissionIds: [
      'perm_dash_view_kpis',
      'perm_members_view_directory',
      'perm_members_create_onboard',
      'perm_members_view_emergency',
      'perm_gate_simulate_scan',
      'perm_pt_view_calendar',
      'perm_billing_view_invoices',
      'perm_billing_collect_upi_cash'
    ]
  },
  {
    id: 'role_finance_accountant',
    name: 'Finance & Compliance Accountant',
    description: 'Audits GST invoices, oversees UPI bank reconciliation, and exports staff payslips.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    isSystemDefault: true,
    permissionIds: [
      'perm_dash_view_kpis',
      'perm_dash_view_revenue',
      'perm_dash_export_d3',
      'perm_billing_view_invoices',
      'perm_billing_collect_upi_cash',
      'perm_billing_issue_refunds',
      'perm_staff_view_payroll_payslips'
    ]
  }
];

export const INITIAL_USER_ASSIGNMENTS: UserRoleAssignment[] = [
  {
    userId: 'usr_rajesh_singhania',
    name: 'Rajesh Singhania',
    email: 'admin@gymos.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roleId: 'role_director',
    roleName: 'Club Director / Owner',
    hasCustomOverrides: false,
    customGrantedPermissions: [],
    customRevokedPermissions: [],
    status: 'Active',
    department: 'Executive',
    lastActive: 'Active now (HQ)',
    assignedBranchId: 'all'
  },
  {
    userId: 'usr_sneha_kulkarni',
    name: 'Sneha Kulkarni',
    email: 'sneha.ops@gymos.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    roleId: 'role_operations_manager',
    roleName: 'Operations Manager',
    hasCustomOverrides: true,
    customGrantedPermissions: ['perm_settings_manage_rbac'], // Special override: allowed to manage staff RBAC
    customRevokedPermissions: ['perm_members_freeze_cancel'],
    status: 'Active',
    department: 'Operations',
    lastActive: '5m ago',
    assignedBranchId: 'downtown'
  },
  {
    userId: 'usr_vikramaditya_rao',
    name: 'Vikramaditya Rao',
    email: 'vikram.coach@gymos.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    roleId: 'role_head_trainer',
    roleName: 'Head Coach / Lead Trainer',
    hasCustomOverrides: true,
    customGrantedPermissions: ['perm_billing_collect_upi_cash'], // Allowed to collect PT fees on floor
    customRevokedPermissions: [],
    status: 'Active',
    department: 'Training',
    lastActive: '12m ago',
    assignedBranchId: 'downtown'
  },
  {
    userId: 'usr_priya_nair',
    name: 'Priya Nair',
    email: 'priya.pt@gymos.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roleId: 'role_head_trainer',
    roleName: 'Head Coach / Lead Trainer',
    hasCustomOverrides: false,
    customGrantedPermissions: [],
    customRevokedPermissions: [],
    status: 'Active',
    department: 'Training',
    lastActive: '30m ago',
    assignedBranchId: 'downtown'
  },
  {
    userId: 'usr_rohan_deshmukh',
    name: 'Rohan Deshmukh',
    email: 'rohan.desk@gymos.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    roleId: 'role_front_desk',
    roleName: 'Front Desk Lead / Receptionist',
    hasCustomOverrides: false,
    customGrantedPermissions: [],
    customRevokedPermissions: [],
    status: 'Active',
    department: 'Front Desk',
    lastActive: '2m ago',
    assignedBranchId: 'downtown'
  },
  {
    userId: 'usr_ananya_iyer',
    name: 'Ananya Iyer',
    email: 'ananya.finance@gymos.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    roleId: 'role_finance_accountant',
    roleName: 'Finance & Compliance Accountant',
    hasCustomOverrides: false,
    customGrantedPermissions: [],
    customRevokedPermissions: [],
    status: 'Active',
    department: 'Finance',
    lastActive: '1h ago',
    assignedBranchId: 'all'
  }
];
