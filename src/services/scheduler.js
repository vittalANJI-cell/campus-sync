// ─── CampusSync Scheduling Engine ─────────────────────────────────────────────
// Implements constraint-based scheduling with backtracking.
// Hard constraints checked:
//  1. Room must match requested room type
//  2. Room capacity >= participants
//  3. All required equipment must be present in room
//  4. No two events in the same room overlap in time
//  5. Resource (room) must be available (not marked unavailable)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Convert "HH:MM" time string to minutes since midnight.
 */
export function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert minutes since midnight back to "HH:MM" string.
 */
export function minutesToTime(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Format "HH:MM" to "HH:MM AM/PM" display string.
 */
export function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Check if two time ranges overlap.
 * Range A: [aStart, aStart + aDuration)
 * Range B: [bStart, bStart + bDuration)
 */
function timesOverlap(aStartMin, aDurHrs, bStartMin, bDurHrs) {
  const aEnd = aStartMin + aDurHrs * 60;
  const bEnd = bStartMin + bDurHrs * 60;
  return aStartMin < bEnd && bStartMin < aEnd;
}

/**
 * Check if a room satisfies all hard constraints for an event
 * given already-assigned events (to detect conflicts).
 */
function isRoomCompatible(room, event, assignedEvents) {
  // 1. Room type must match
  if (room.type !== event.roomType) return false;

  // 2. Room must be available
  if (!room.available) return false;

  // 3. Capacity check
  if (room.capacity < event.participants) return false;

  // 4. Equipment check — room must have ALL required equipment
  for (const eq of event.equipment) {
    if (!room.equipment.includes(eq)) return false;
  }

  return true;
}

/**
 * Check time slot availability — no overlap with already-scheduled events in the same room.
 */
function isTimeSlotFree(room, startTime, duration, assignedEvents) {
  const startMin = timeToMinutes(startTime);
  for (const ae of assignedEvents) {
    if (ae.assignedRoom !== room.id) continue;
    if (!ae.assignedStartTime) continue;
    const aeStart = timeToMinutes(ae.assignedStartTime);
    if (timesOverlap(startMin, duration, aeStart, ae.duration)) {
      return false;
    }
  }
  return true;
}

/**
 * Available time slots for the scheduler to try (08:00–18:00 in 1-hr steps).
 */
const CANDIDATE_SLOTS = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00'
];

/**
 * Main scheduling function.
 * Accepts events array and resources array.
 * Returns { scheduledEvents, conflicts, stats }.
 *
 * Strategy:
 *  - Sort events by priority (High → Medium → Low) then by participants descending
 *  - For each event, try to assign at the preferred time first, then fall back
 *  - If preferred slot + preferred room fails, try other compatible rooms
 *  - If still no slot, mark as unscheduled and record conflict with suggestions
 */
export function generateSchedule(events, resources) {
  // Deep-clone to avoid mutating state directly
  const workingEvents = events.map(e => ({ ...e, assignedRoom: null, assignedStartTime: null, status: 'Pending' }));

  const priorityOrder = { High: 0, Medium: 1, Low: 2 };

  // Sort: highest priority first, then most participants (hardest to place first)
  const sorted = [...workingEvents].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority])
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    return b.participants - a.participants;
  });

  const assigned = [];   // successfully scheduled events
  const conflicts = [];  // conflict records

  for (const event of sorted) {
    // Collect rooms compatible with hard constraints (type, capacity, equipment, available)
    const compatibleRooms = resources.filter(r => isRoomCompatible(r, event, assigned));

    if (compatibleRooms.length === 0) {
      // No room can ever satisfy this event's requirements
      conflicts.push({
        id: `c-${event.id}`,
        eventId: event.id,
        eventName: event.name,
        type: compatibleRooms.length === 0 ? detectConstraintViolationType(event, resources) : 'Room Conflict',
        severity: event.priority,
        resource: event.roomType,
        time: `${formatTime(event.startTime)}`,
        message: buildConflictMessage(event, resources),
        suggestions: buildSuggestions(event, resources, assigned),
      });
      event.status = 'Unscheduled';
      assigned.push(event);
      continue;
    }

    // Build candidate (room, time) pairs — prefer preferred time first
    let placed = false;
    const trySlotsInOrder = buildSlotOrder(event.startTime);

    for (const slot of trySlotsInOrder) {
      // Check the slot doesn't push past 18:00
      const endMin = timeToMinutes(slot) + event.duration * 60;
      if (endMin > 18 * 60) continue;

      for (const room of compatibleRooms) {
        if (isTimeSlotFree(room, slot, event.duration, assigned)) {
          event.assignedRoom = room.id;
          event.assignedStartTime = slot;
          event.status = 'Scheduled';
          placed = true;
          break;
        }
      }
      if (placed) break;
    }

    if (!placed) {
      // Couldn't place even with backtracking over slots
      const suggestions = buildSuggestions(event, resources, assigned);
      conflicts.push({
        id: `c-${event.id}`,
        eventId: event.id,
        eventName: event.name,
        type: 'Room Conflict',
        severity: event.priority,
        resource: compatibleRooms.map(r => r.name).join(', ') || event.roomType,
        time: `${formatTime(event.startTime)} – ${formatTime(minutesToTime(timeToMinutes(event.startTime) + event.duration * 60))}`,
        message: `No available time slot found for ${event.name}. All compatible rooms are occupied during requested hours.`,
        suggestions,
      });
      event.status = 'Conflict';
    }

    assigned.push(event);
  }

  // Build stats
  const scheduled = assigned.filter(e => e.status === 'Scheduled').length;
  const unscheduled = assigned.filter(e => e.status === 'Unscheduled').length;
  const conflictCount = assigned.filter(e => e.status === 'Conflict').length;

  // Resource utilization — proportion of room-hours used out of available
  const totalRoomSlots = resources.filter(r => r.available).length * 10; // 10 one-hour slots
  const usedRoomHours = assigned
    .filter(e => e.assignedRoom)
    .reduce((sum, e) => sum + e.duration, 0);
  const utilization = totalRoomSlots > 0
    ? Math.round((usedRoomHours / totalRoomSlots) * 100)
    : 0;

  return {
    scheduledEvents: assigned,
    conflicts,
    stats: {
      total: assigned.length,
      scheduled,
      unscheduled,
      conflictCount,
      utilization: Math.min(utilization, 99),
    },
  };
}

/**
 * Build a slot order starting from the preferred time, then expanding outward.
 */
function buildSlotOrder(preferredTime) {
  const idx = CANDIDATE_SLOTS.indexOf(preferredTime);
  if (idx === -1) return CANDIDATE_SLOTS;
  // Try preferred first, then later slots, then earlier slots
  const after = CANDIDATE_SLOTS.slice(idx);
  const before = CANDIDATE_SLOTS.slice(0, idx).reverse();
  // Interleave after/before
  const result = [];
  const maxLen = Math.max(after.length, before.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < after.length) result.push(after[i]);
    if (i < before.length) result.push(before[i]);
  }
  return result;
}

/**
 * Detect the primary reason a room type can't be satisfied.
 */
function detectConstraintViolationType(event, resources) {
  const typeMatch = resources.filter(r => r.type === event.roomType);
  if (typeMatch.length === 0) return 'No Room of Required Type';
  const capMatch = typeMatch.filter(r => r.capacity >= event.participants);
  if (capMatch.length === 0) return 'Capacity Conflict';
  const eqMatch = capMatch.filter(r => event.equipment.every(eq => r.equipment.includes(eq)));
  if (eqMatch.length === 0) return 'Equipment Conflict';
  return 'Room Conflict';
}

/**
 * Build a human-readable conflict message.
 */
function buildConflictMessage(event, resources) {
  const typeMatch = resources.filter(r => r.type === event.roomType);
  if (typeMatch.length === 0)
    return `No ${event.roomType} available in the system.`;
  const capMatch = typeMatch.filter(r => r.capacity >= event.participants);
  if (capMatch.length === 0)
    return `No ${event.roomType} has capacity for ${event.participants} participants.`;
  return `All compatible ${event.roomType}s are occupied during the requested time.`;
}

/**
 * Build alternative suggestions for a conflicted event.
 * Returns up to 3 suggestions: different room same time, same room different time, etc.
 */
export function buildSuggestions(event, resources, assignedSoFar) {
  const suggestions = [];
  const compatibleRooms = resources.filter(r => isRoomCompatible(r, event, assignedSoFar));

  if (compatibleRooms.length === 0) return suggestions;

  for (const slot of CANDIDATE_SLOTS) {
    const endMin = timeToMinutes(slot) + event.duration * 60;
    if (endMin > 18 * 60) continue;

    for (const room of compatibleRooms) {
      if (isTimeSlotFree(room, slot, event.duration, assignedSoFar)) {
        const endTime = minutesToTime(timeToMinutes(slot) + event.duration * 60);
        suggestions.push({
          roomId: room.id,
          roomName: room.name,
          startTime: slot,
          endTime,
          label: `${room.name} — ${formatTime(slot)} to ${formatTime(endTime)}`,
        });
        if (suggestions.length >= 3) return suggestions;
      }
    }
  }

  return suggestions;
}

/**
 * Detect conflicts in a given list of already-scheduled events (for display purposes).
 * Used on the Conflicts page to recompute from current state.
 */
export function detectConflicts(events, resources) {
  const conflicts = [];
  const resourceMap = Object.fromEntries(resources.map(r => [r.id, r]));

  for (let i = 0; i < events.length; i++) {
    const a = events[i];
    if (!a.assignedRoom || !a.assignedStartTime) continue;

    for (let j = i + 1; j < events.length; j++) {
      const b = events[j];
      if (!b.assignedRoom || !b.assignedStartTime) continue;
      if (a.assignedRoom !== b.assignedRoom) continue;
      if (a.date !== b.date) continue;

      const aStart = timeToMinutes(a.assignedStartTime);
      const bStart = timeToMinutes(b.assignedStartTime);
      if (timesOverlap(aStart, a.duration, bStart, b.duration)) {
        const room = resourceMap[a.assignedRoom];
        conflicts.push({
          id: `conflict-${a.id}-${b.id}`,
          eventId: a.id,
          eventName: `${a.name} ↔ ${b.name}`,
          type: 'Room Conflict',
          severity: a.priority === 'High' || b.priority === 'High' ? 'High' : 'Medium',
          resource: room?.name || a.assignedRoom,
          time: `${formatTime(a.assignedStartTime)} – ${formatTime(minutesToTime(aStart + a.duration * 60))}`,
          message: `${room?.name} is double-booked by "${a.name}" and "${b.name}".`,
          suggestions: [],
        });
      }
    }
  }
  return conflicts;
}
