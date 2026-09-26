import React, { useState } from 'react';
import { useGym } from '../context/GymContext';

export const SettingsView: React.FC = () => {
  const { currentBranch, showToast, theme, toggleTheme, setActiveScreen } = useGym();
  const [branchName, setBranchName] = useState(currentBranch.name);
  const [branchAddress, setBranchAddress] = useState(currentBranch.address);
  const [facilityCapacity, setFacilityCapacity] = useState(currentBranch.capacity);
  const [geofenceRadius, setGeofenceRadius] = useState(50);
  const [autoOpenTurnstile, setAutoOpenTurnstile] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);
  const [stripeConnected, setStripeConnected] = useState(true);
  const [gracePeriodDays, setGracePeriodDays] = useState(7);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Branch parameters and hardware preferences updated.', 'success');
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tight">System &amp; Hardware Settings</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Configure facility parameters, QR terminal hardware, geofence radius, and automated payment gateways.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Appearance & Theme Preference Card */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">palette</span>
              <h2 className="text-base font-headline font-bold text-on-surface">Visual Appearance &amp; Theme</h2>
            </div>
            <span className="text-[11px] font-mono text-primary font-semibold uppercase">
              Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 text-xs">
            <div>
              <div className="font-semibold text-on-surface">Interface Color Theme</div>
              <div className="text-[11px] text-on-surface-variant">
                Toggle between sleek cyber-dark mode and clean high-contrast light mode for gym front desks and offices.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold ${
                  theme === 'light'
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">light_mode</span>
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold ${
                  theme === 'dark'
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">dark_mode</span>
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tenant Admin RBAC Governance Card */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px]">shield_person</span>
              <h2 className="text-base font-headline font-bold text-on-surface">
                Tenant Admin RBAC &amp; Staff Roles
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary/20 text-tertiary border border-tertiary/30">
              Security Governance
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 text-xs">
            <div>
              <div className="font-semibold text-on-surface">Manage User-Wise Function Permissions</div>
              <div className="text-[11px] text-on-surface-variant">
                Assign roles (Director, Manager, Head Trainer, Front Desk, Accountant) and customize granular function overrides.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveScreen('tenant-rbac')}
              className="px-4 py-2 rounded-xl bg-tertiary text-on-tertiary font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-tertiary/20 whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
              <span>Open RBAC Matrix</span>
            </button>
          </div>
        </div>

        {/* Branch Info Card */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[20px]">store</span>
            <h2 className="text-base font-headline font-bold text-on-surface">Branch Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-on-surface-variant font-semibold mb-1.5 uppercase tracking-wider">
                Branch Name
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-semibold mb-1.5 uppercase tracking-wider">
                Max Capacity (People)
              </label>
              <input
                type="number"
                value={facilityCapacity}
                onChange={(e) => setFacilityCapacity(Number(e.target.value))}
                className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:border-primary outline-none font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-on-surface-variant font-semibold mb-1.5 uppercase tracking-wider">
                Physical Street Address
              </label>
              <input
                type="text"
                value={branchAddress}
                onChange={(e) => setBranchAddress(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* QR Scanner Hardware & Terminal Configuration */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[20px]">qr_code_scanner</span>
            <h2 className="text-base font-headline font-bold text-on-surface">
              Terminal #04 Scanner &amp; Access Turnstile
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div>
                <div className="font-semibold text-on-surface">Auto-Trigger Turnstile Relay</div>
                <div className="text-[11px] text-on-surface-variant">Send GPIO pulse to unlock turnstile on valid member scan</div>
              </div>
              <input
                type="checkbox"
                checked={autoOpenTurnstile}
                onChange={(e) => setAutoOpenTurnstile(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div>
                <div className="font-semibold text-on-surface">Audio Tone on Verification</div>
                <div className="text-[11px] text-on-surface-variant">Play pleasant confirmation chime upon successful gate entry</div>
              </div>
              <input
                type="checkbox"
                checked={soundFeedback}
                onChange={(e) => setSoundFeedback(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div>
                <div className="font-semibold text-on-surface">Geofence Attendance Radius (Meters)</div>
                <div className="text-[11px] text-on-surface-variant">Require staff GPS to be within perimeter during punch-in</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={geofenceRadius}
                  onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                  className="w-20 bg-surface-container text-on-surface px-3 py-1 rounded-lg border border-outline-variant/40 font-mono text-center"
                />
                <span className="text-on-surface-variant font-mono">meters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways & Invoicing */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
            <h2 className="text-base font-headline font-bold text-on-surface">Payment Gateways &amp; Retries</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div>
                <div className="font-semibold text-on-surface flex items-center gap-2">
                  <span>Stripe Connect Merchant</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary">Connected</span>
                </div>
                <div className="text-[11px] text-on-surface-variant font-mono">Account ID: acct_1NxGymOS882049</div>
              </div>
              <button
                type="button"
                onClick={() => setStripeConnected(!stripeConnected)}
                className="px-3 py-1.5 rounded-xl bg-surface-container-high text-xs font-semibold text-on-surface hover:bg-surface-bright"
              >
                {stripeConnected ? 'Test Webhook' : 'Connect'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div>
                <div className="font-semibold text-on-surface">Contract Expiry Warning Threshold</div>
                <div className="text-[11px] text-on-surface-variant">Flag members and trigger automated SMS before plan ends</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={gracePeriodDays}
                  onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                  className="w-20 bg-surface-container text-on-surface px-3 py-1 rounded-lg border border-outline-variant/40 font-mono text-center"
                />
                <span className="text-on-surface-variant">days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
