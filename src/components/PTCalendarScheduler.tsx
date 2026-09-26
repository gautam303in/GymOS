import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { PTSession } from '../types';
import { UnscheduledPTRequest } from '../data/mockData';

const DAYS_OF_WEEK: Array<NonNullable<PTSession['day']>> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const TIME_SLOTS = [
  '06:00 AM',
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM'
];

const TRAINERS = [
  'All Coaches',
  'Vikramaditya Rao',
  'Priya Sundaram',
  'Devrat Chauhan',
  'Pooja Iyer'
];

export const PTCalendarScheduler: React.FC = () => {
  const {
    ptSessions,
    unscheduledRequests,
    movePTSession,
    assignUnscheduledRequest,
    updatePTSessionStatus,
    scheduleNewPTSession,
    showToast
  } = useGym();

  const [selectedTrainer, setSelectedTrainer] = useState<string>('All Coaches');
  const [selectedDay, setSelectedDay] = useState<NonNullable<PTSession['day']>>('Monday');
  const [viewMode, setViewMode] = useState<'week' | 'coach_board'>('week');
  const [dragOverCell, setDragOverCell] = useState<{ day?: string; time?: string; trainer?: string } | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ type: 'existing' | 'queue'; id: string; title: string } | null>(null);

  // Quick book modal state
  const [showQuickBookModal, setShowQuickBookModal] = useState(false);
  const [quickBookSlot, setQuickBookSlot] = useState<{ day: NonNullable<PTSession['day']>; time: string; trainer?: string } | null>(null);
  const [bookClientName, setBookClientName] = useState('');
  const [bookTrainer, setBookTrainer] = useState('Vikramaditya Rao');
  const [bookPackage, setBookPackage] = useState('1-on-1 Hypertrophy (₹1,800/session)');
  const [bookFocus, setBookFocus] = useState<NonNullable<PTSession['focus']>>('Strength & Conditioning');

  // Filtered sessions
  const filteredSessions = ptSessions.filter((s) => {
    if (selectedTrainer !== 'All Coaches' && s.trainerName !== selectedTrainer) {
      return false;
    }
    return true;
  });

  // Handle Drag Start
  const handleDragStartExisting = (e: React.DragEvent, session: PTSession) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'existing', id: session.id }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({ type: 'existing', id: session.id, title: `${session.clientName} (${session.trainerName})` });
  };

  const handleDragStartQueue = (e: React.DragEvent, request: UnscheduledPTRequest) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'queue', id: request.id }));
    e.dataTransfer.effectAllowed = 'copyMove';
    setDraggedItem({ type: 'queue', id: request.id, title: `Queue: ${request.clientName}` });
  };

  // Drag over handler
  const handleDragOver = (e: React.DragEvent, day: NonNullable<PTSession['day']>, time: string, trainer?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ day, time, trainer });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  // Handle Drop on cell
  const handleDrop = (e: React.DragEvent, day: NonNullable<PTSession['day']>, time: string, trainerName?: string) => {
    e.preventDefault();
    setDragOverCell(null);
    setDraggedItem(null);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);

      if (data.type === 'existing') {
        movePTSession(data.id, day, time, trainerName);
      } else if (data.type === 'queue') {
        assignUnscheduledRequest(data.id, day, time, trainerName);
      }
    } catch (err) {
      console.error('Failed to parse drag-drop payload:', err);
    }
  };

  const handleOpenQuickBook = (day: NonNullable<PTSession['day']>, time: string, trainer?: string) => {
    setQuickBookSlot({ day, time, trainer });
    if (trainer && trainer !== 'All Coaches') {
      setBookTrainer(trainer);
    }
    setShowQuickBookModal(true);
  };

  const handleSaveQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickBookSlot || !bookClientName.trim()) return;

    scheduleNewPTSession({
      clientName: bookClientName.trim(),
      trainerName: bookTrainer,
      timeSlot: quickBookSlot.time,
      day: quickBookSlot.day,
      packageType: bookPackage,
      focus: bookFocus,
      status: 'Confirmed'
    });

    setShowQuickBookModal(false);
    setBookClientName('');
  };

  const getFocusBadgeColor = (focus?: string) => {
    switch (focus) {
      case 'Hypertrophy & Muscle':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Fat Loss & HIIT':
        return 'bg-error/20 text-error border-error/30';
      case 'Posture & Rehab':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Boxing / Combat':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-tertiary/20 text-tertiary border-tertiary/30';
    }
  };

  return (
    <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 shadow-xl space-y-6">
      {/* Calendar Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold text-primary uppercase font-mono tracking-wider">
              Smart Drag &amp; Drop Scheduler
            </span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">
            Personal Training Calendar Matrix
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Drag any coaching appointment across days &amp; time slots, or drag members from the booking queue to assign.
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Trainer Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs">
            <span className="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="bg-transparent text-on-surface font-medium outline-none cursor-pointer"
            >
              {TRAINERS.map((t) => (
                <option key={t} value={t} className="bg-surface-container text-on-surface">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs">
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'week' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">calendar_view_week</span>
              <span>7-Day Grid</span>
            </button>
            <button
              onClick={() => setViewMode('coach_board')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                viewMode === 'coach_board' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">view_column</span>
              <span>Coach Lanes</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenQuickBook(selectedDay, '08:00 AM')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>New PT Slot</span>
          </button>
        </div>
      </div>

      {/* Main Drag-and-Drop Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left 3 Columns: Interactive Drag-Drop Grid */}
        <div className="xl:col-span-3 space-y-4">
          {/* Active Drag Helper banner */}
          {draggedItem && (
            <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/40 text-primary text-xs flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">drag_indicator</span>
                <span>Dragging: <strong>{draggedItem.title}</strong> — Drop into any target cell to reschedule</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold">
                Move Active
              </span>
            </div>
          )}

          {/* VIEW MODE 1: WEEK GRID */}
          {viewMode === 'week' && (
            <div className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface-container-low">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container text-xs font-semibold text-on-surface">
                    <th className="py-3 px-3 w-24 text-on-surface-variant font-mono">Time Slot</th>
                    {DAYS_OF_WEEK.map((d) => (
                      <th
                        key={d}
                        onClick={() => setSelectedDay(d)}
                        className={`py-3 px-3 text-center cursor-pointer transition-colors ${
                          selectedDay === d ? 'text-primary bg-primary/10 font-bold' : 'hover:bg-surface-container-high'
                        }`}
                      >
                        <div className="font-headline">{d.slice(0, 3)}</div>
                        <div className="text-[10px] text-on-surface-variant font-normal">Oct 12-18</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-xs">
                  {TIME_SLOTS.map((time) => (
                    <tr key={time} className="hover:bg-surface-container/30 transition-colors">
                      {/* Time Slot Header */}
                      <td className="py-3 px-3 font-mono text-[11px] text-on-surface-variant font-semibold border-r border-outline-variant/20 whitespace-nowrap bg-surface-container/20">
                        {time}
                      </td>

                      {/* Day Drop Targets */}
                      {DAYS_OF_WEEK.map((day) => {
                        const isOver = dragOverCell?.day === day && dragOverCell?.time === time;
                        const matchedSessions = filteredSessions.filter(
                          (s) => (s.day === day || (!s.day && day === 'Monday')) && s.timeSlot.includes(time.slice(0, 5))
                        );

                        return (
                          <td
                            key={day}
                            onDragOver={(e) => handleDragOver(e, day, time)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, day, time)}
                            className={`p-1.5 border-r border-outline-variant/15 align-top min-h-[90px] transition-all relative ${
                              isOver
                                ? 'bg-primary/20 ring-2 ring-inset ring-primary border-primary shadow-inner'
                                : 'hover:bg-surface-container-high/40'
                            }`}
                          >
                            {/* Empty Slot with Quick Add button on hover */}
                            {matchedSessions.length === 0 ? (
                              <div
                                onClick={() => handleOpenQuickBook(day, time)}
                                className={`w-full h-16 rounded-xl flex flex-col items-center justify-center text-[10px] text-on-surface-variant/40 border border-dashed border-outline-variant/30 hover:border-primary/60 hover:text-primary transition-all cursor-pointer group ${
                                  isOver ? 'border-primary text-primary bg-primary/10' : ''
                                }`}
                              >
                                <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">
                                  {isOver ? 'file_download' : 'add'}
                                </span>
                                <span>{isOver ? 'Drop Slot' : 'Available'}</span>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                {matchedSessions.map((session) => (
                                  <div
                                    key={session.id}
                                    draggable={session.status !== 'Cancelled'}
                                    onDragStart={(e) => handleDragStartExisting(e, session)}
                                    className={`p-2.5 rounded-xl border transition-all shadow-sm select-none cursor-grab active:cursor-grabbing hover:scale-[1.02] ${
                                      session.status === 'Completed'
                                        ? 'bg-surface-container opacity-60 border-outline-variant/40'
                                        : session.status === 'Cancelled'
                                        ? 'bg-error/10 border-error/30 opacity-75'
                                        : 'bg-surface-container-high border-primary/40 hover:border-primary hover:shadow-lg hover:shadow-primary/10'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <div className="flex items-center gap-1.5 truncate">
                                        <img
                                          src={session.clientPhoto}
                                          alt={session.clientName}
                                          className="w-5 h-5 rounded-full object-cover ring-1 ring-primary/40 shrink-0"
                                        />
                                        <span className="font-semibold text-on-surface truncate text-[11px]">
                                          {session.clientName}
                                        </span>
                                      </div>
                                      <span
                                        className="material-symbols-outlined text-[14px] text-on-surface-variant hover:text-primary cursor-pointer shrink-0"
                                        title="Drag to move slot"
                                      >
                                        drag_indicator
                                      </span>
                                    </div>

                                    <div className="text-[10px] text-on-surface-variant truncate mb-1">
                                      Coach: <strong className="text-on-surface">{session.trainerName}</strong>
                                    </div>

                                    {session.focus && (
                                      <span
                                        className={`inline-block px-1.5 py-0.2 rounded border text-[9px] font-semibold truncate max-w-full ${getFocusBadgeColor(
                                          session.focus
                                        )}`}
                                      >
                                        {session.focus}
                                      </span>
                                    )}

                                    <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-outline-variant/20 text-[10px]">
                                      <span className="font-mono text-tertiary font-bold">
                                        ₹{session.price ? session.price.toLocaleString('en-IN') : '1,800'}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {session.status === 'Confirmed' && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              updatePTSessionStatus(session.id, 'Completed');
                                            }}
                                            className="p-0.5 hover:text-primary transition-colors"
                                            title="Mark Session Done"
                                          >
                                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                          </button>
                                        )}
                                        {session.status !== 'Cancelled' && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              updatePTSessionStatus(session.id, 'Cancelled');
                                            }}
                                            className="p-0.5 hover:text-error transition-colors"
                                            title="Cancel Session"
                                          >
                                            <span className="material-symbols-outlined text-[13px]">cancel</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW MODE 2: COACH BOARD */}
          {viewMode === 'coach_board' && (
            <div className="space-y-4">
              {/* Day Selector Ribbon */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedDay === d ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Coach Column Lanes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {TRAINERS.filter((t) => t !== 'All Coaches').map((coach) => {
                  const coachSessions = ptSessions.filter(
                    (s) => s.trainerName === coach && (s.day === selectedDay || (!s.day && selectedDay === 'Monday'))
                  );

                  return (
                    <div
                      key={coach}
                      className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                        <div>
                          <h4 className="font-headline font-bold text-sm text-on-surface">{coach}</h4>
                          <span className="text-[11px] text-on-surface-variant">
                            {coachSessions.length} session{coachSessions.length !== 1 ? 's' : ''} on {selectedDay}
                          </span>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      </div>

                      {/* Coach Time Slots */}
                      <div className="space-y-2.5 min-h-[300px]">
                        {TIME_SLOTS.slice(0, 8).map((time) => {
                          const slotSession = coachSessions.find((s) => s.timeSlot.includes(time.slice(0, 5)));
                          const isOver = dragOverCell?.day === selectedDay && dragOverCell?.time === time && dragOverCell?.trainer === coach;

                          return (
                            <div
                              key={time}
                              onDragOver={(e) => handleDragOver(e, selectedDay, time, coach)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, selectedDay, time, coach)}
                              className={`p-2.5 rounded-xl border text-xs transition-all ${
                                isOver
                                  ? 'bg-primary/20 border-primary ring-2 ring-primary ring-inset'
                                  : slotSession
                                  ? 'bg-surface-container border-outline-variant/40 hover:border-primary/50'
                                  : 'bg-surface-container/30 border-dashed border-outline-variant/20 hover:border-outline-variant/50'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-on-surface-variant mb-1 font-mono">
                                <span>{time}</span>
                                {slotSession && (
                                  <span className="font-bold text-primary">{slotSession.status}</span>
                                )}
                              </div>

                              {slotSession ? (
                                <div
                                  draggable={slotSession.status !== 'Cancelled'}
                                  onDragStart={(e) => handleDragStartExisting(e, slotSession)}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <div className="font-semibold text-on-surface">{slotSession.clientName}</div>
                                  <div className="text-[11px] text-on-surface-variant truncate">{slotSession.focus}</div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleOpenQuickBook(selectedDay, time, coach)}
                                  className="text-[11px] text-on-surface-variant/40 hover:text-primary cursor-pointer flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[13px]">add</span>
                                  <span>Open Slot</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Unscheduled Member Booking Queue */}
        <div className="space-y-5">
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">pending_actions</span>
                  <span>Pending PT Queue</span>
                </h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Drag cards directly onto any calendar time slot to book instantly.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-primary/20 text-primary">
                {unscheduledRequests.length}
              </span>
            </div>

            {/* Draggable Queue Cards */}
            <div className="space-y-3">
              {unscheduledRequests.length === 0 ? (
                <div className="p-6 text-center text-xs text-on-surface-variant border border-dashed border-outline-variant/30 rounded-xl">
                  <span className="material-symbols-outlined text-[28px] text-primary/60 block mb-1">done_all</span>
                  <span>Queue is clear. All PT requests are currently scheduled!</span>
                </div>
              ) : (
                unscheduledRequests.map((req) => (
                  <div
                    key={req.id}
                    draggable
                    onDragStart={(e) => handleDragStartQueue(e, req)}
                    className="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary/60 transition-all shadow-sm cursor-grab active:cursor-grabbing group select-none"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={req.clientPhoto}
                          alt={req.clientName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/40"
                        />
                        <div>
                          <div className="font-semibold text-xs text-on-surface">{req.clientName}</div>
                          <div className="text-[10px] text-on-surface-variant font-mono">{req.clientId}</div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-primary group-hover:scale-110 transition-transform">
                        drag_pan
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-on-surface-variant">
                      <div className="flex justify-between">
                        <span>Pref. Coach:</span>
                        <strong className="text-on-surface">{req.preferredTrainer}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Target Day:</span>
                        <span className="text-primary font-medium">{req.preferredDay} ({req.preferredTime})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Focus:</span>
                        <span className="text-on-surface truncate max-w-[140px]">{req.focus}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-tertiary">
                        ₹{req.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => assignUnscheduledRequest(req.id, req.preferredDay, req.preferredTime, req.preferredTrainer)}
                        className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary hover:text-on-primary transition-all"
                      >
                        Auto-Assign
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Scheduling Tips & Legend */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-xs space-y-3">
            <h4 className="font-headline font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">lightbulb</span>
              <span>Scheduling Telemetry</span>
            </h4>
            <div className="space-y-2 text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                <span>Hypertrophy &amp; Strength training</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-error"></span>
                <span>Fat Loss &amp; High Intensity HIIT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-400"></span>
                <span>Posture, Mobility &amp; Spinal Rehab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
                <span>Boxing &amp; Combat Conditioning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Modal */}
      {showQuickBookModal && quickBookSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/40 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <h3 className="text-lg font-headline font-bold text-on-surface">Book 1-on-1 PT Session</h3>
                <p className="text-xs text-on-surface-variant">
                  {quickBookSlot.day} at {quickBookSlot.time}
                </p>
              </div>
              <button
                onClick={() => setShowQuickBookModal(false)}
                className="p-1.5 rounded-full hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveQuickBook} className="space-y-4 text-xs">
              <div>
                <label className="block text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">
                  Member / Client Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Joshi or Aarav Sharma"
                  value={bookClientName}
                  onChange={(e) => setBookClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">
                  Assigned Personal Coach
                </label>
                <select
                  value={bookTrainer}
                  onChange={(e) => setBookTrainer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
                >
                  {TRAINERS.filter((t) => t !== 'All Coaches').map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">
                  Workout Focus Area
                </label>
                <select
                  value={bookFocus}
                  onChange={(e) => setBookFocus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Strength & Conditioning">Strength & Conditioning</option>
                  <option value="Hypertrophy & Muscle">Hypertrophy & Muscle</option>
                  <option value="Fat Loss & HIIT">Fat Loss & HIIT</option>
                  <option value="Posture & Rehab">Posture & Rehab</option>
                  <option value="Boxing / Combat">Boxing / Combat</option>
                  <option value="Athletic Performance">Athletic Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant font-semibold mb-1 uppercase tracking-wider">
                  Package Tier &amp; Rate
                </label>
                <select
                  value={bookPackage}
                  onChange={(e) => setBookPackage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:border-primary font-mono"
                >
                  <option value="1-on-1 Hypertrophy (₹1,800/session)">1-on-1 Hypertrophy (₹1,800/session)</option>
                  <option value="Fat Loss Conditioning (₹1,500/session)">Fat Loss Conditioning (₹1,500/session)</option>
                  <option value="Combat & Boxing Drills (₹2,200/session)">Combat & Boxing Drills (₹2,200/session)</option>
                  <option value="Postural Spine Rehab (₹2,000/session)">Postural Spine Rehab (₹2,000/session)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowQuickBookModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 shadow-md shadow-primary/20"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
