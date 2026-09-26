import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface DensityDataPoint {
  dayIndex: number; // 0 = Mon, 6 = Sun
  dayName: string;
  hour: number; // 6 to 22 (6 AM to 10 PM)
  hourLabel: string;
  density: number; // 0 to 100 check-ins count
  occupancyPercent: number; // 0 to 100%
  churnRiskCount: number; // members in this slot with high risk
}

export interface ChurnCohortPoint {
  tenureMonths: string;
  planType: string;
  churnRate: number; // percentage
  memberCount: number;
  avgVisitsPerWeek: number;
  riskCategory: 'High Risk' | 'Medium Risk' | 'Low Risk' | 'Healthy';
}

interface HeatmapProps {
  onSlotSelect?: (slot: DensityDataPoint) => void;
  onCohortSelect?: (cohort: ChurnCohortPoint) => void;
}

export const D3AnalyticsHeatmap: React.FC<HeatmapProps> = ({ onSlotSelect, onCohortSelect }) => {
  const [viewType, setViewType] = useState<'density' | 'churn'>('density');
  const [selectedSlot, setSelectedSlot] = useState<DensityDataPoint | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<ChurnCohortPoint | null>(null);
  const [filterDay, setFilterDay] = useState<string>('all');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Generate realistic 7-day x 17-hour visit density data for Indian fitness centers
  // Indian gyms peak: 6:00 AM - 10:00 AM (Morning rush) and 5:00 PM - 9:30 PM (Evening post-work)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM (6) to 9 PM (21)

  const densityData: DensityDataPoint[] = [];
  days.forEach((dayName, dayIndex) => {
    hours.forEach((hour) => {
      let baseDensity = 12;
      // Morning peak
      if (hour >= 6 && hour <= 9) {
        baseDensity = dayIndex < 5 ? 75 + (hour === 7 ? 22 : 12) : 58;
      }
      // Afternoon lull
      else if (hour >= 12 && hour <= 16) {
        baseDensity = 14 + (hour === 13 ? 8 : 2);
      }
      // Evening peak
      else if (hour >= 17 && hour <= 21) {
        baseDensity = dayIndex < 5 ? 88 + (hour === 19 ? 10 : 0) : 48;
      } else {
        baseDensity = 25;
      }

      // Add mild variation based on day
      if (dayIndex === 0) baseDensity += 5; // Monday motivation
      if (dayIndex === 4) baseDensity += 3; // Friday
      if (dayIndex === 6) baseDensity -= 15; // Sunday evening dip

      const finalDensity = Math.max(5, Math.min(100, Math.round(baseDensity + (Math.sin(hour * 2 + dayIndex) * 8))));
      const occupancy = Math.round((finalDensity / 100) * 100);
      
      // Churn risk concentration: Low attendance hours or irregular visitors
      const churnRisk = Math.max(0, Math.round((100 - finalDensity) * 0.08 + (Math.cos(hour) > 0 ? 3 : 1)));

      const formatHour = (h: number) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h > 12 ? h - 12 : h;
        return `${displayH}:00 ${period}`;
      };

      densityData.push({
        dayIndex,
        dayName,
        hour,
        hourLabel: formatHour(hour),
        density: finalDensity,
        occupancyPercent: occupancy,
        churnRiskCount: churnRisk,
      });
    });
  });

  // Churn Cohort Matrix: Tenure vs Plan Type vs Risk
  const cohortData: ChurnCohortPoint[] = [
    { tenureMonths: '< 1 Month', planType: 'Monthly Standard', churnRate: 38.5, memberCount: 68, avgVisitsPerWeek: 1.2, riskCategory: 'High Risk' },
    { tenureMonths: '< 1 Month', planType: 'Pro Monthly', churnRate: 24.2, memberCount: 52, avgVisitsPerWeek: 2.1, riskCategory: 'Medium Risk' },
    { tenureMonths: '< 1 Month', planType: 'VIP Annual', churnRate: 7.8, memberCount: 45, avgVisitsPerWeek: 3.8, riskCategory: 'Low Risk' },
    { tenureMonths: '< 1 Month', planType: 'Student Pass', churnRate: 31.0, memberCount: 40, avgVisitsPerWeek: 1.5, riskCategory: 'High Risk' },

    { tenureMonths: '1 - 3 Months', planType: 'Monthly Standard', churnRate: 29.4, memberCount: 84, avgVisitsPerWeek: 1.8, riskCategory: 'High Risk' },
    { tenureMonths: '1 - 3 Months', planType: 'Pro Monthly', churnRate: 18.0, memberCount: 96, avgVisitsPerWeek: 2.6, riskCategory: 'Medium Risk' },
    { tenureMonths: '1 - 3 Months', planType: 'VIP Annual', churnRate: 5.2, memberCount: 78, avgVisitsPerWeek: 4.0, riskCategory: 'Healthy' },
    { tenureMonths: '1 - 3 Months', planType: 'Student Pass', churnRate: 22.5, memberCount: 42, avgVisitsPerWeek: 2.0, riskCategory: 'Medium Risk' },

    { tenureMonths: '3 - 6 Months', planType: 'Monthly Standard', churnRate: 19.1, memberCount: 110, avgVisitsPerWeek: 2.4, riskCategory: 'Medium Risk' },
    { tenureMonths: '3 - 6 Months', planType: 'Pro Monthly', churnRate: 11.4, memberCount: 140, avgVisitsPerWeek: 3.2, riskCategory: 'Low Risk' },
    { tenureMonths: '3 - 6 Months', planType: 'VIP Annual', churnRate: 3.8, memberCount: 120, avgVisitsPerWeek: 4.4, riskCategory: 'Healthy' },
    { tenureMonths: '3 - 6 Months', planType: 'Student Pass', churnRate: 14.2, memberCount: 65, avgVisitsPerWeek: 2.8, riskCategory: 'Low Risk' },

    { tenureMonths: '6 - 12 Months', planType: 'Monthly Standard', churnRate: 12.0, memberCount: 95, avgVisitsPerWeek: 2.9, riskCategory: 'Low Risk' },
    { tenureMonths: '6 - 12 Months', planType: 'Pro Monthly', churnRate: 7.5, memberCount: 130, avgVisitsPerWeek: 3.7, riskCategory: 'Healthy' },
    { tenureMonths: '6 - 12 Months', planType: 'VIP Annual', churnRate: 2.1, memberCount: 160, avgVisitsPerWeek: 4.8, riskCategory: 'Healthy' },
    { tenureMonths: '6 - 12 Months', planType: 'Student Pass', churnRate: 9.8, memberCount: 50, avgVisitsPerWeek: 3.1, riskCategory: 'Healthy' },

    { tenureMonths: '12+ Months (Loyal)', planType: 'Monthly Standard', churnRate: 6.2, memberCount: 88, avgVisitsPerWeek: 3.5, riskCategory: 'Healthy' },
    { tenureMonths: '12+ Months (Loyal)', planType: 'Pro Monthly', churnRate: 4.0, memberCount: 115, avgVisitsPerWeek: 4.1, riskCategory: 'Healthy' },
    { tenureMonths: '12+ Months (Loyal)', planType: 'VIP Annual', churnRate: 1.4, memberCount: 220, avgVisitsPerWeek: 5.2, riskCategory: 'Healthy' },
    { tenureMonths: '12+ Months (Loyal)', planType: 'Student Pass', churnRate: 5.1, memberCount: 38, avgVisitsPerWeek: 3.6, riskCategory: 'Healthy' },
  ];

  // D3 Rendering Hook
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 720;
    const height = 300;
    const margin = { top: 25, right: 30, bottom: 40, left: 55 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height);

    if (viewType === 'density') {
      renderDensityHeatmap(svg, width, height, margin);
    } else {
      renderChurnCohortHeatmap(svg, width, height, margin);
    }
  }, [viewType, filterDay]);

  // Render Visit Density D3 Heatmap
  const renderDensityHeatmap = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number,
    margin: { top: number; right: number; bottom: number; left: number }
  ) => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const filtered = filterDay === 'all' ? densityData : densityData.filter(d => d.dayName === filterDay);

    const activeDays = filterDay === 'all' ? days : [filterDay];

    const xScale = d3
      .scaleBand()
      .domain(hours.map(String))
      .range([0, innerWidth])
      .padding(0.06);

    const yScale = d3
      .scaleBand()
      .domain(activeDays)
      .range([0, innerHeight])
      .padding(0.08);

    // Color interpolation: Dark Navy/Surface -> Warm Amber -> Neon Emerald/Cyan
    // Density gradient: 0 - 100
    const colorScale = d3
      .scaleSequential()
      .domain([5, 95])
      .interpolator(d3.interpolateRgbBasis([
        '#132238', // Low density (deep navy/slate)
        '#1e3a5f',
        '#1d6f7a',
        '#00a896', // Mid-density teal
        '#02c39a', // Active
        '#10b981', // High density emerald
        '#f59e0b'  // Peak capacity amber
      ]));

    // Draw Heatmap Cells
    g.selectAll('rect')
      .data(filtered)
      .enter()
      .append('rect')
      .attr('x', d => xScale(String(d.hour)) || 0)
      .attr('y', d => yScale(d.dayName) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', d => colorScale(d.density))
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer')
      .attr('opacity', 0.92)
      .on('mouseover', function (_event, d) {
        d3.select(this)
          .transition()
          .duration(120)
          .attr('opacity', 1)
          .attr('stroke', '#38bdf8')
          .attr('stroke-width', 2.5);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(120)
          .attr('opacity', 0.92)
          .attr('stroke', '#0f172a')
          .attr('stroke-width', 1.5);
      })
      .on('click', (_event, d) => {
        setSelectedSlot(d);
        if (onSlotSelect) onSlotSelect(d);
      })
      .append('title')
      .text(
        d => `${d.dayName} @ ${d.hourLabel}\nOccupancy: ${d.density} check-ins (${d.occupancyPercent}%)\nAt-Risk Churn Visitors: ${d.churnRiskCount}`
      );

    // X-Axis (Hours)
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d => {
        const h = Number(d);
        if (h === 6) return '6 AM';
        if (h === 9) return '9 AM';
        if (h === 12) return '12 PM';
        if (h === 15) return '3 PM';
        if (h === 18) return '6 PM';
        if (h === 21) return '9 PM';
        return '';
      })
      .tickSize(0);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight + 6})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.select('.domain').remove();

    // Y-Axis (Days)
    const yAxis = d3.axisLeft(yScale).tickSize(0);

    g.append('g')
      .attr('transform', 'translate(-6,0)')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    g.select('.domain').remove();
  };

  // Render Churn Cohort Risk Heatmap
  const renderChurnCohortHeatmap = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number,
    margin: { top: number; right: number; bottom: number; left: number }
  ) => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left + 25},${margin.top})`);

    const tenureCategories = ['< 1 Month', '1 - 3 Months', '3 - 6 Months', '6 - 12 Months', '12+ Months (Loyal)'];
    const planCategories = ['Monthly Standard', 'Pro Monthly', 'Student Pass', 'VIP Annual'];

    const xScale = d3
      .scaleBand()
      .domain(tenureCategories)
      .range([0, innerWidth - 25])
      .padding(0.08);

    const yScale = d3
      .scaleBand()
      .domain(planCategories)
      .range([0, innerHeight])
      .padding(0.08);

    // Churn Risk Color scale: Low risk (Emerald/Green) -> Med (Amber) -> High (Rose/Crimson)
    const riskColorScale = d3
      .scaleLinear<string>()
      .domain([2, 10, 22, 40])
      .range(['#10b981', '#14b8a6', '#f59e0b', '#f43f5e']);

    // Draw Heatmap Cells
    g.selectAll('rect')
      .data(cohortData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.tenureMonths) || 0)
      .attr('y', d => yScale(d.planType) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', d => riskColorScale(d.churnRate))
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer')
      .attr('opacity', 0.9)
      .on('mouseover', function (_event, d) {
        d3.select(this)
          .transition()
          .duration(120)
          .attr('opacity', 1)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(120)
          .attr('opacity', 0.9)
          .attr('stroke', '#0f172a')
          .attr('stroke-width', 1.5);
      })
      .on('click', (_event, d) => {
        setSelectedCohort(d);
        if (onCohortSelect) onCohortSelect(d);
      })
      .append('title')
      .text(
        d => `${d.planType} (${d.tenureMonths})\nChurn Risk: ${d.churnRate}%\nCohort Size: ${d.memberCount} members\nVisits: ${d.avgVisitsPerWeek}/week`
      );

    // Cell Text Labels (e.g. "38.5%")
    g.selectAll('text.cell-label')
      .data(cohortData)
      .enter()
      .append('text')
      .attr('class', 'cell-label')
      .attr('x', d => (xScale(d.tenureMonths) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => (yScale(d.planType) || 0) + yScale.bandwidth() / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .attr('pointer-events', 'none')
      .text(d => `${d.churnRate}%`);

    // X-Axis (Tenure)
    const xAxis = d3.axisBottom(xScale).tickSize(0);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight + 6})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-weight', '500');

    g.select('.domain').remove();

    // Y-Axis (Plan Types)
    const yAxis = d3.axisLeft(yScale).tickSize(0);
    g.append('g')
      .attr('transform', 'translate(-6,0)')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '10.5px')
      .attr('font-weight', '600');

    g.select('.domain').remove();
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary font-headline">
              D3 Analytical Telemetry Engine
            </span>
          </div>
          <h2 className="text-lg font-headline font-bold text-on-surface mt-0.5">
            {viewType === 'density' ? 'Daily Visit Density Heatmap' : 'Member Churn Risk & Tenure Cohorts'}
          </h2>
          <p className="text-xs text-on-surface-variant">
            {viewType === 'density'
              ? 'Real-time turnstile footfall distribution across Indian workout rush hours (6 AM - 10 PM)'
              : 'Predictive churn probability matrix by membership plan tier and customer lifecycle stage'}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container p-1 rounded-xl border border-outline-variant/30">
            <button
              onClick={() => {
                setViewType('density');
                setSelectedCohort(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewType === 'density'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Visit Density</span>
            </button>
            <button
              onClick={() => {
                setViewType('churn');
                setSelectedSlot(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewType === 'churn'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Churn Risk Matrix</span>
            </button>
          </div>

          {viewType === 'density' && (
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="bg-surface-container text-on-surface text-xs px-2.5 py-1.5 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary font-medium"
            >
              <option value="all">All 7 Days</option>
              {days.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* D3 Heatmap SVG Container */}
      <div ref={containerRef} className="w-full overflow-x-auto py-2">
        <svg ref={svgRef} className="w-full min-w-[620px]"></svg>
      </div>

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-outline-variant/20 text-xs">
        {viewType === 'density' ? (
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant text-[11px] font-medium">Footfall Intensity:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-on-surface-variant font-mono">Low (0-20)</span>
              <div className="flex h-3 w-32 rounded-full overflow-hidden border border-outline-variant/30">
                <div className="flex-1 bg-[#132238]"></div>
                <div className="flex-1 bg-[#1e3a5f]"></div>
                <div className="flex-1 bg-[#1d6f7a]"></div>
                <div className="flex-1 bg-[#02c39a]"></div>
                <div className="flex-1 bg-[#10b981]"></div>
                <div className="flex-1 bg-[#f59e0b]"></div>
              </div>
              <span className="text-[10px] text-primary font-bold font-mono">Rush (100+)</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant text-[11px] font-medium">Churn Probability:</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> &lt; 5% Healthy
              </span>
              <span className="flex items-center gap-1 text-[11px] text-teal-300">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span> 5-15% Normal
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> 15-25% Watch
              </span>
              <span className="flex items-center gap-1 text-[11px] text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> &gt; 25% Critical
              </span>
            </div>
          </div>
        )}

        <div className="text-[11px] text-on-surface-variant">
          Click any cell to inspect slot telemetry &amp; dispatch retention WhatsApp
        </div>
      </div>

      {/* Selected Cell Detail Card */}
      {selectedSlot && viewType === 'density' && (
        <div className="mt-4 p-4 rounded-xl bg-surface-container border border-primary/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">schedule</span>
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                <span>{selectedSlot.dayName} @ {selectedSlot.hourLabel}</span>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px]">
                  {selectedSlot.occupancyPercent}% Peak Load
                </span>
              </div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">
                Active Turnstile Scans: <strong className="text-on-surface font-mono">{selectedSlot.density} members</strong> • At-Risk Check-ins: <strong className="text-rose-400 font-mono">{selectedSlot.churnRiskCount} members</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Broadcasting class vacancy alert for ${selectedSlot.dayName} at ${selectedSlot.hourLabel} via WhatsApp Bot.`)}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>Send Slot Pass</span>
            </button>
            <button
              onClick={() => setSelectedSlot(null)}
              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {selectedCohort && viewType === 'churn' && (
        <div className="mt-4 p-4 rounded-xl bg-surface-container border border-error/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                <span>{selectedCohort.planType} • Tenure: {selectedCohort.tenureMonths}</span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  selectedCohort.churnRate > 25 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {selectedCohort.churnRate}% Churn Probability
                </span>
              </div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">
                Cohort Size: <strong className="text-on-surface font-mono">{selectedCohort.memberCount} members</strong> • Frequency: <strong className="text-on-surface font-mono">{selectedCohort.avgVisitsPerWeek} visits/week</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Automated WhatsApp retention coupon (20% off PT upgrade) triggered for ${selectedCohort.memberCount} members in ${selectedCohort.planType} cohort.`)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">chat</span>
              <span>Engage via WhatsApp</span>
            </button>
            <button
              onClick={() => setSelectedCohort(null)}
              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
