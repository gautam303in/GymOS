import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { RBACModule, UserRoleAssignment, TenantRole } from '../types';

const MODULE_METADATA: Record<RBACModule, { label: string; icon: string; description: string }> = {
  dashboard_analytics: {
    label: 'Dashboard & Telemetry',
    icon: 'monitoring',
    description: 'Occupancy telemetry, live visit counters, and financial KPIs'
  },
  members_crm: {
    label: 'Members & Access Control',
    icon: 'groups',
    description: 'Member records, onboarding, freeze status, and waivers'
  },
  gate_access: {
    label: 'Gate & Turnstile Hardware',
    icon: 'door_sliding',
    description: 'Turnstile GPIO trigger, QR scanners, and emergency bypass'
  },
  classes_pt_scheduler: {
    label: 'Classes & PT Scheduling',
    icon: 'calendar_month',
    description: 'Drag-and-drop PT scheduling, coach lanes, and group fitness'
  },
  billing_payments: {
    label: 'Billing & UPI Payments',
    icon: 'payments',
    description: 'Dynamic UPI QR generation, fee collection, and refunds'
  },
  staff_hr_payroll: {
    label: 'Staff HR & Payroll',
    icon: 'badge',
    description: 'Staff geofence arrival, timesheets, and NEFT salary batches'
  },
  tenant_settings: {
    label: 'Tenant Settings & RBAC',
    icon: 'tune',
    description: 'Branch parameters, operating hours, and role assignments'
  },
  security_audit: {
    label: 'Security & Audit Logs',
    icon: 'shield',
    description: 'Permission change audits, failed check-ins, and token resets'
  }
};

export const TenantAdminRBACView: React.FC = () => {
  const {
    tenantRoles,
    userRoleAssignments,
    allRbacPermissions,
    updateUserRole,
    toggleUserPermissionOverride,
    toggleUserCustomOverridesMode,
    addNewUserAssignment,
    saveTenantRole,
    hasUserPermission,
    showToast,
    setActiveScreen
  } = useGym();

  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedUserId, setSelectedUserId] = useState<string>(userRoleAssignments[0]?.userId || '');
  const [activeTab, setActiveTab] = useState<'users' | 'role_blueprints'>('users');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  // New user modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState(tenantRoles[0]?.id || '');
  const [newUserDept, setNewUserDept] = useState<UserRoleAssignment['department']>('Operations');

  // Currently selected user
  const selectedUser = userRoleAssignments.find((u) => u.userId === selectedUserId) || userRoleAssignments[0];
  const userRole = tenantRoles.find((r) => r.id === selectedUser?.roleId);

  // Filtered users
  const filteredUsers = userRoleAssignments.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.roleName.toLowerCase().includes(searchUserQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || u.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  // Calculate user's effective permissions count
  const getUserPermissionsCount = (user: UserRoleAssignment) => {
    return allRbacPermissions.filter((p) => hasUserPermission(user.userId, p.id)).length;
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addNewUserAssignment({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      roleId: newUserRole,
      department: newUserDept
    });

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs">
            <span className="font-semibold text-primary uppercase tracking-wider font-headline">
              Tenant Administration
            </span>
            <span className="text-on-surface-variant">•</span>
            <span className="text-on-surface-variant">Security &amp; RBAC Control</span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            User-Wise Role &amp; Function RBAC
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Empower your team with granular operational function permissions, custom user overrides, and security governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveScreen('settings')}
            className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-all flex items-center gap-1.5 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>Facility Settings</span>
          </button>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Assign User Role</span>
          </button>
        </div>
      </div>

      {/* Bento Metric Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-[11px] text-on-surface-variant font-medium">Assigned System Users</div>
          <div className="text-2xl font-headline font-bold text-on-surface mt-1 font-mono">
            {userRoleAssignments.length} Users
          </div>
          <div className="text-[10px] text-primary mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>Across 4 Gym Branches</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-[11px] text-on-surface-variant font-medium">Configured Role Templates</div>
          <div className="text-2xl font-headline font-bold text-primary mt-1 font-mono">
            {tenantRoles.length} Roles
          </div>
          <div className="text-[10px] text-on-surface-variant mt-0.5">
            Owner, Manager, Head Trainer &amp; Lead
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-[11px] text-on-surface-variant font-medium">Custom User Overrides</div>
          <div className="text-2xl font-headline font-bold text-tertiary mt-1 font-mono">
            {userRoleAssignments.filter((u) => u.hasCustomOverrides).length} Active
          </div>
          <div className="text-[10px] text-tertiary mt-0.5">
            Special floor privileges enabled
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-[11px] text-on-surface-variant font-medium">Granular Functions Governed</div>
          <div className="text-2xl font-headline font-bold text-on-surface mt-1 font-mono">
            {allRbacPermissions.length} Functions
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">verified_user</span>
            <span>Zero-Trust Enforced</span>
          </div>
        </div>
      </div>

      {/* Top Tab Mode Ribbon */}
      <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
          <span>User-Wise RBAC &amp; Function Overrides</span>
        </button>
        <button
          onClick={() => setActiveTab('role_blueprints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'role_blueprints' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">schema</span>
          <span>Role Template Blueprints ({tenantRoles.length})</span>
        </button>
      </div>

      {/* TAB 1: USER-WISE RBAC & FUNCTION SELECTION */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 Cols): User Roster */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4">
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface font-headline">
                  Club Personnel
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">
                  {filteredUsers.length} shown
                </span>
              </div>

              {/* User Search & Department Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-on-surface-variant">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    placeholder="Search staff, role, email..."
                    className="w-full pl-9 pr-3 py-2 bg-surface-container border border-outline-variant/40 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                  {['all', 'Operations', 'Training', 'Front Desk', 'Finance', 'Executive'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                        selectedDepartment === dept
                          ? 'bg-primary/20 text-primary border border-primary/40 font-semibold'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* User List Cards */}
              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {filteredUsers.map((user) => {
                  const isSelected = user.userId === selectedUser?.userId;
                  const permsCount = getUserPermissionsCount(user);

                  return (
                    <div
                      key={user.userId}
                      onClick={() => setSelectedUserId(user.userId)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-surface-container-high border-primary ring-1 ring-primary shadow-md'
                          : 'bg-surface-container hover:bg-surface-container-high/60 border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-primary/40 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-xs text-on-surface flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.hasCustomOverrides && (
                              <span
                                className="w-2 h-2 rounded-full bg-tertiary"
                                title="Has custom function overrides"
                              ></span>
                            )}
                          </div>
                          <div className="text-[11px] text-on-surface-variant truncate max-w-[150px]">
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container-highest text-on-surface-variant font-mono font-medium">
                              {user.roleName}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              • {permsCount} fn
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`material-symbols-outlined text-[18px] transition-transform ${
                          isSelected ? 'text-primary translate-x-0.5' : 'text-on-surface-variant/40'
                        }`}
                      >
                        chevron_right
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (8 Cols): Granular Function Selection Inspector */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-5">
            {selectedUser ? (
              <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 space-y-6">
                {/* User Profile Banner & Role Assignment Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/40 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-headline font-bold text-on-surface">
                          {selectedUser.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/20 text-primary border border-primary/30">
                          {selectedUser.department}
                        </span>
                      </div>
                      <div className="text-xs text-on-surface-variant font-mono mt-0.5">
                        {selectedUser.email} • Last active: {selectedUser.lastActive}
                      </div>
                    </div>
                  </div>

                  {/* Role Selector & Custom Override Toggle */}
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant font-semibold">Assigned Role:</span>
                      <select
                        value={selectedUser.roleId}
                        onChange={(e) => updateUserRole(selectedUser.userId, e.target.value)}
                        className="bg-surface-container text-on-surface text-xs font-semibold px-3 py-1.5 rounded-xl border border-outline-variant/40 outline-none focus:border-primary cursor-pointer"
                      >
                        {tenantRoles.map((r) => (
                          <option key={r.id} value={r.id} className="bg-surface-container text-on-surface">
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Override Mode Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedUser.hasCustomOverrides}
                        onChange={(e) => toggleUserCustomOverridesMode(selectedUser.userId, e.target.checked)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 bg-surface"
                      />
                      <span className="text-xs font-semibold text-primary">
                        Enable Custom Function Overrides
                      </span>
                    </label>
                  </div>
                </div>

                {/* Overrides Status Alert */}
                {selectedUser.hasCustomOverrides ? (
                  <div className="p-3.5 rounded-2xl bg-tertiary/10 border border-tertiary/30 text-xs text-on-surface flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">tune</span>
                      <span>
                        Custom function overrides are active for <strong>{selectedUser.name}</strong>. Specific permissions can be toggled on/off below regardless of role template defaults.
                      </span>
                    </div>
                    <button
                      onClick={() => toggleUserCustomOverridesMode(selectedUser.userId, false)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container text-tertiary hover:bg-surface-container-high font-semibold text-[11px] whitespace-nowrap"
                    >
                      Reset to Default
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/20 text-xs text-on-surface-variant flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
                      <span>
                        Permissions are automatically synchronized with the <strong>{userRole?.name}</strong> template blueprint. Enable overrides above to fine-tune individual function access.
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">Template Enforced</span>
                  </div>
                )}

                {/* Module Category Filter */}
                <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 text-xs">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider shrink-0">
                    Filter Modules:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setModuleFilter('all')}
                      className={`px-3 py-1 rounded-xl font-medium transition-all ${
                        moduleFilter === 'all'
                          ? 'bg-primary text-on-primary font-semibold'
                          : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      All Modules ({allRbacPermissions.length})
                    </button>
                    {(Object.keys(MODULE_METADATA) as RBACModule[]).map((mod) => (
                      <button
                        key={mod}
                        onClick={() => setModuleFilter(mod)}
                        className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all ${
                          moduleFilter === mod
                            ? 'bg-primary text-on-primary font-semibold'
                            : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {MODULE_METADATA[mod].label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Granular Function Permissions Matrix */}
                <div className="space-y-6">
                  {(Object.keys(MODULE_METADATA) as RBACModule[])
                    .filter((mod) => moduleFilter === 'all' || moduleFilter === mod)
                    .map((mod) => {
                      const modPerms = allRbacPermissions.filter((p) => p.module === mod);
                      if (modPerms.length === 0) return null;

                      const meta = MODULE_METADATA[mod];

                      return (
                        <div
                          key={mod}
                          className="bg-surface-container rounded-2xl p-5 border border-outline-variant/20 space-y-3.5"
                        >
                          <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/20">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">{meta.icon}</span>
                              </div>
                              <div>
                                <h4 className="font-headline font-bold text-sm text-on-surface">
                                  {meta.label}
                                </h4>
                                <p className="text-[11px] text-on-surface-variant">{meta.description}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              {modPerms.filter((p) => hasUserPermission(selectedUser.userId, p.id)).length}/{modPerms.length} Enabled
                            </span>
                          </div>

                          {/* Function Item Checkboxes */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {modPerms.map((perm) => {
                              const isGranted = hasUserPermission(selectedUser.userId, perm.id);
                              const isRoleDefault = userRole?.permissionIds.includes(perm.id) || false;
                              const isCustomGranted = selectedUser.customGrantedPermissions.includes(perm.id);
                              const isCustomRevoked = selectedUser.customRevokedPermissions.includes(perm.id);

                              return (
                                <div
                                  key={perm.id}
                                  onClick={() => {
                                    if (selectedUser.hasCustomOverrides) {
                                      toggleUserPermissionOverride(selectedUser.userId, perm.id, !isGranted);
                                    } else {
                                      showToast('Template Locked', 'Enable "Custom Function Overrides" to toggle individual permissions.', 'info');
                                    }
                                  }}
                                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                                    selectedUser.hasCustomOverrides
                                      ? 'cursor-pointer hover:border-primary/60'
                                      : 'cursor-default'
                                  } ${
                                    isGranted
                                      ? 'bg-surface-container-high/80 border-primary/30'
                                      : 'bg-surface-container-low/60 border-outline-variant/20 opacity-70'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isGranted}
                                    onChange={(e) => {
                                      if (selectedUser.hasCustomOverrides) {
                                        toggleUserPermissionOverride(selectedUser.userId, perm.id, e.target.checked);
                                      }
                                    }}
                                    disabled={!selectedUser.hasCustomOverrides}
                                    className="mt-1 rounded text-primary focus:ring-primary w-4 h-4 bg-surface"
                                  />

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-semibold text-xs text-on-surface">
                                        {perm.name}
                                      </span>
                                      {perm.isDangerous && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-error/20 text-error border border-error/30">
                                          Elevated
                                        </span>
                                      )}
                                      {isCustomGranted && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30 font-mono">
                                          +Override Grant
                                        </span>
                                      )}
                                      {isCustomRevoked && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-error/20 text-error border border-error/30 font-mono">
                                          -Revoked
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant leading-snug mt-1">
                                      {perm.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-on-surface-variant font-mono">
                                      <span>Action: {perm.category}</span>
                                      <span>•</span>
                                      <span className={isRoleDefault ? 'text-primary' : 'text-on-surface-variant/60'}>
                                        {isRoleDefault ? 'Included in Role' : 'Not in Role'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-on-surface-variant">
                Select a user to inspect and customize function RBAC.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ROLE TEMPLATE BLUEPRINTS */}
      {activeTab === 'role_blueprints' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tenantRoles.map((role) => (
              <div
                key={role.id}
                className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${role.badgeColor}`}>
                      {role.name}
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">
                      {role.permissionIds.length} permissions
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-base text-on-surface">{role.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{role.description}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-outline-variant/20 text-xs">
                  <div className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                    Assigned Personnel:
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {userRoleAssignments
                      .filter((u) => u.roleId === role.id)
                      .map((u) => (
                        <div key={u.userId} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface">
                          <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                          <span>{u.name}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const firstUserWithRole = userRoleAssignments.find((u) => u.roleId === role.id);
                      if (firstUserWithRole) {
                        setSelectedUserId(firstUserWithRole.userId);
                      }
                      setActiveTab('users');
                    }}
                    className="w-full py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition-all border border-outline-variant/30"
                  >
                    Manage Assigned Users
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Assign / Invite New User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/40 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="text-lg font-headline font-bold text-on-surface">Assign New Staff Role</h3>
                <p className="text-xs text-on-surface-variant">Create user profile with granular RBAC access</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 rounded-full hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Nambiar or Rohan Verma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gymos.io"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">
                  Department
                </label>
                <select
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Operations">Operations</option>
                  <option value="Training">Training &amp; Coaching</option>
                  <option value="Front Desk">Front Desk &amp; Reception</option>
                  <option value="Finance">Finance &amp; Accounting</option>
                  <option value="Executive">Executive / Ownership</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">
                  Assign Default Role Template
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
                >
                  {tenantRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 shadow-md shadow-primary/20"
                >
                  Save &amp; Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
