import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { D3AnalyticsHeatmap } from '../components/D3AnalyticsHeatmap';
import { UPIFeePaymentModal } from '../components/UPIFeePaymentModal';

export const DashboardOverview: React.FC = () => {
  const {
    openModal,
    setActiveScreen,
    currentBranch,
    liveOccupancy,
    maxCapacity,
    checkInLogs,
    pendingPayments,
    markPendingPaid
  } = useGym();

  const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
  const [selectedPendingPayment, setSelectedPendingPayment] = useState<{
    name: string;
    amount: number;
    subtitle: string;
  } | null>(null);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const openUPIForPending = (item: { name: string; amount: number; subtitle: string }) => {
    setSelectedPendingPayment(item);
    setIsUPIModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-12">
      {/* Consolidated Function: Analytics & Reports Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
            <span className="material-symbols-outlined text-[18px]">insights</span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
              FUNCTION: ANALYTICS &amp; REPORTS
            </div>
            <div className="text-xs font-semibold text-on-surface">
              Real-Time Facility Telemetry &amp; Interactive D3 Analytics
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl border border-outline-variant/20 overflow-x-auto">
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[15px]">dashboard</span>
            <span>Executive Telemetry</span>
          </button>
          <button
            onClick={() => setActiveScreen('reports')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[15px]">bar_chart</span>
            <span>BI Reports &amp; Exports</span>
          </button>
        </div>
      </div>

      {/* Top Banner / Quick Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low p-6 rounded-2xl relative overflow-hidden border border-outline-variant/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <span className="text-xs uppercase tracking-wider text-primary font-semibold font-headline">
            Operations Core / {currentBranch.name}
          </span>
          <h1 className="text-3xl font-headline font-bold text-on-surface mt-1 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time telemetry and member flow for today,{' '}
            <span className="text-on-surface font-semibold">{currentDate}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-sm"
            onClick={() => openModal('register-member')}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Register Member</span>
          </button>

          {/* QR Code for Fees Payment Trigger Button */}
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-emerald-900/20"
            onClick={() => {
              setSelectedPendingPayment(null);
              setIsUPIModalOpen(true);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            <span>Pay Fees via QR</span>
          </button>

          <button
            className="flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-surface-variant transition-all border border-outline-variant/40"
            onClick={() => openModal('record-payment')}
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span>Record Payment</span>
          </button>
          <button
            className="flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-surface-variant transition-all border border-outline-variant/40"
            onClick={() => openModal('scan-qr')}
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Scan QR Check-in</span>
          </button>
        </div>
      </div>

      {/* Metric Telemetry Modules (Top Cards with INR Currency) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between relative group hover:bg-surface-container transition-all border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Active Members</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-headline font-bold text-on-surface">1,248</span>
            <span className="text-xs text-primary font-semibold flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+4.2%
            </span>
          </div>
          <div className="mt-4 pt-3.5 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Target: 1,300</span>
            <span className="text-primary font-semibold">96% Capacity</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between relative group hover:bg-surface-container transition-all border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Today's Attendance</span>
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-headline font-bold text-on-surface">{liveOccupancy}</span>
            <span className="text-xs text-tertiary font-semibold flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+12 this hour
            </span>
          </div>
          <div className="mt-4 pt-3.5 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Peak: 7:00 PM</span>
            <span className="text-tertiary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              Turnstiles Online
            </span>
          </div>
        </div>

        {/* Card 3 - INR Today's Collection */}
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between relative group hover:bg-surface-container transition-all border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Today's Collection</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-headline font-bold text-on-surface font-mono">₹1,84,500</span>
            <span className="text-xs text-primary font-semibold flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+18.5%
            </span>
          </div>
          <div className="mt-4 pt-3.5 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span>26 Transactions</span>
            <span className="text-primary font-semibold">UPI &amp; Card Active</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between relative group hover:bg-surface-container transition-all border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Expiring Memberships</span>
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-headline font-bold text-on-surface">18</span>
            <span className="text-xs text-error font-semibold">Action Needed</span>
          </div>
          <div className="mt-4 pt-3.5 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Within 7 days</span>
            <button
              className="text-primary font-semibold hover:underline"
              onClick={() => setActiveScreen('reports')}
            >
              View List
            </button>
          </div>
        </div>
      </div>

      {/* D3-BASED ANALYTICS HEATMAP INTEGRATION */}
      <D3AnalyticsHeatmap
        onSlotSelect={(slot) => {
          // Heatmap interaction hook
        }}
        onCohortSelect={(cohort) => {
          // Churn matrix interaction hook
        }}
      />

      {/* Charts Section: Weekly Attendance Trends & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Trends (2 cols) */}
        <div className="lg:col-span-2 bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-headline font-bold text-on-surface">Weekly Attendance Trends</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Check-ins volume compared to previous week</p>
            </div>
            <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <span>This Week</span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary ml-3"></span>
              <span>Last Week</span>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {[
              { day: 'Mon', last: 65, curr: 88 },
              { day: 'Tue', last: 70, curr: 92 },
              { day: 'Wed', last: 85, curr: 96 },
              { day: 'Thu', last: 60, curr: 78 },
              { day: 'Fri', last: 90, curr: 100 },
              { day: 'Sat', last: 50, curr: 62 },
              { day: 'Sun', last: 35, curr: 48 }
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  <div
                    className="w-1/2 bg-secondary/40 rounded-t-lg transition-all group-hover:bg-secondary/60"
                    style={{ height: `${bar.last}%` }}
                    title={`Last week: ${bar.last}%`}
                  ></div>
                  <div
                    className="w-1/2 bg-primary rounded-t-lg transition-all group-hover:brightness-125"
                    style={{ height: `${bar.curr}%` }}
                    title={`This week: ${bar.curr}%`}
                  ></div>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown (1 col) - INR Currency */}
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/30">
          <div>
            <h2 className="text-lg font-headline font-bold text-on-surface">Revenue Breakdown</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Distribution by revenue stream (MTD)</p>
          </div>

          <div className="my-6 flex items-center justify-center">
            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                ></path>
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="65, 100"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></path>
                <path
                  className="text-tertiary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-65"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></path>
                <path
                  className="text-secondary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-85"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-on-surface-variant font-semibold tracking-wider">TOTAL MTD</span>
                <span className="text-xl font-headline font-bold text-on-surface font-mono">₹24.8L</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-on-surface">Memberships</span>
              </div>
              <span className="text-on-surface font-semibold font-mono">65% (₹16.1L)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                <span className="text-on-surface">Personal Training</span>
              </div>
              <span className="text-on-surface font-semibold font-mono">20% (₹4.9L)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="text-on-surface">Supplements &amp; Cafe</span>
              </div>
              <span className="text-on-surface font-semibold font-mono">15% (₹3.7L)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section: Recent Check-ins and Pending Payments (With QR Fee Payment Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Check-ins Table */}
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-headline font-bold text-on-surface">Recent Check-ins</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Real-time gatekeeper log</p>
            </div>
            <button
              onClick={() => setActiveScreen('attendance')}
              className="text-xs text-primary font-semibold bg-primary/10 px-3 py-1 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Live Feed
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/30 text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  <th className="py-3 px-2">Member</th>
                  <th className="py-3 px-2">Plan</th>
                  <th className="py-3 px-2">Time</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-xs text-on-surface">
                {checkInLogs.slice(0, 4).map((log) => {
                  const initials = log.memberName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();
                  const isAllowed = log.status === 'Allowed';

                  return (
                    <tr key={log.id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="py-3 px-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-xs">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-on-surface">{log.memberName}</div>
                          <div className="text-[11px] text-on-surface-variant font-mono">{log.memberCode}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-on-surface-variant">{log.plan}</td>
                      <td className="py-3 px-2 text-on-surface-variant font-mono">{log.timeFormatted}</td>
                      <td className="py-3 px-2 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isAllowed ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Payments Table with QR Code Fees Payment Button */}
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-headline font-bold text-on-surface">Pending Fee Collections</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Outstanding membership dues &amp; UPI requests</p>
            </div>
            <button
              onClick={() => {
                setSelectedPendingPayment(null);
                setIsUPIModalOpen(true);
              }}
              className="text-xs text-primary font-semibold bg-primary/10 px-3 py-1 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
              <span>Open QR Terminal</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/30 text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  <th className="py-3 px-2">Member</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Due Date</th>
                  <th className="py-3 px-2 text-right">Pay via QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-xs text-on-surface">
                {pendingPayments.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-container/50 transition-colors">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-error text-xs">
                        {item.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface">{item.name}</div>
                        <div className="text-[11px] text-on-surface-variant">{item.subtitle}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono font-semibold text-on-surface">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2 text-on-surface-variant">{item.dueDate}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openUPIForPending(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm"
                          title="Generate UPI QR Code for instant fee settlement"
                        >
                          <span className="material-symbols-outlined text-[13px]">qr_code_2</span>
                          <span>UPI QR</span>
                        </button>
                        <button
                          onClick={() => markPendingPaid(idx)}
                          className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-semibold transition-opacity ${
                            item.status === 'Overdue'
                              ? 'bg-error/15 text-error border border-error/30'
                              : 'bg-tertiary/15 text-tertiary border border-tertiary/30'
                          }`}
                          title="Mark paid manually"
                        >
                          {item.status}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* UPI QR Payment Modal */}
      <UPIFeePaymentModal
        isOpen={isUPIModalOpen}
        onClose={() => {
          setIsUPIModalOpen(false);
          setSelectedPendingPayment(null);
        }}
        defaultAmount={selectedPendingPayment ? selectedPendingPayment.amount : 4500}
        memberName={selectedPendingPayment ? selectedPendingPayment.name : 'Aarav Sharma'}
        planName={selectedPendingPayment ? selectedPendingPayment.subtitle : 'Pro Monthly Membership'}
        memberCode={selectedPendingPayment ? '#MEM-8402' : '#MEM-8402'}
      />
    </div>
  );
};
