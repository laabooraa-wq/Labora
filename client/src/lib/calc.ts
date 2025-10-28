import { Shift, UserProfile } from '@shared/schema';
import { expandMinutes, isMinuteInNightWindow } from './datetime';
import { round2 } from './money';

export interface CalcResult {
  baseMin: number;
  extraMin: number;
  nightMin: number;
  complementaryMin: number;
  euros: number;
}

/**
 * Main calculation engine for shift pay
 * Priority: night > extra > complementary > normal
 */
export function computeShiftPay(shift: Shift, profile: UserProfile): CalcResult {
  // Handle special days (non-normal)
  if (shift.kind !== 'normal') {
    return computePTOorRest(shift, profile);
  }

  // eurosOverride bypasses all calculation
  if (shift.eurosOverride !== undefined) {
    return {
      baseMin: 0,
      extraMin: 0,
      nightMin: 0,
      complementaryMin: 0,
      euros: round2(shift.eurosOverride),
    };
  }

  if (!shift.startISO || !shift.endISO) {
    return { baseMin: 0, extraMin: 0, nightMin: 0, complementaryMin: 0, euros: 0 };
  }

  // Use override rates if present, otherwise profile rates
  const tariffs = {
    base: shift.overrideRates?.base ?? profile.rates.base,
    extra: shift.overrideRates?.extra ?? profile.rates.extra,
    night: shift.overrideRates?.night ?? profile.rates.night,
    complementary: shift.overrideRates?.complementary ?? profile.rates.complementary ?? profile.rates.base,
  };

  // Expand timeline into minutes
  const timeline = expandMinutes(shift.startISO, shift.endISO);
  const breaksMinutes = shift.breaksMinutes ?? 0;

  // Classify minutes as night or normal, excluding breaks
  let nightMinutes: Date[] = [];
  let normalMinutes: Date[] = [];

  for (let i = 0; i < timeline.length; i++) {
    // Skip break minutes (assume breaks are at the start for simplicity)
    if (i < breaksMinutes) {
      continue;
    }

    const minute = timeline[i];
    if (isMinuteInNightWindow(minute, profile.nightWindow, profile.timezone)) {
      nightMinutes.push(minute);
    } else {
      normalMinutes.push(minute);
    }
  }

  // Apply tails (complementary and overtime) to the END of the shift
  // These are applied from the end of normalMinutes, but if they fall into night time,
  // they stay as night (night has priority)
  
  const complementaryMinutesRequested = shift.complementaryMinutes ?? 0;
  const overtimeMinutesRequested = shift.overtimeMinutes ?? 0;

  // We need to take from the end of the effective work time
  // Get the last N minutes from the timeline (after breaks)
  const effectiveTimeline = timeline.slice(breaksMinutes);
  
  // Mark which minutes are complementary and overtime
  const complementaryIndices = new Set<number>();
  const overtimeIndices = new Set<number>();

  // Complementary tail: last N minutes
  for (let i = 0; i < complementaryMinutesRequested && i < effectiveTimeline.length; i++) {
    const idx = effectiveTimeline.length - 1 - i;
    complementaryIndices.add(idx);
  }

  // Overtime tail: last M minutes after complementary
  for (let i = complementaryMinutesRequested; i < complementaryMinutesRequested + overtimeMinutesRequested && i < effectiveTimeline.length; i++) {
    const idx = effectiveTimeline.length - 1 - i;
    overtimeIndices.add(idx);
  }

  // Now classify all minutes with priority: night > extra > complementary > normal
  let minNight = 0;
  let minExtra = 0;
  let minComplementary = 0;
  let minNormal = 0;

  for (let i = 0; i < effectiveTimeline.length; i++) {
    const minute = effectiveTimeline[i];
    const isNight = isMinuteInNightWindow(minute, profile.nightWindow, profile.timezone);
    const isComplementary = complementaryIndices.has(i);
    const isOvertime = overtimeIndices.has(i);

    if (isNight) {
      // Night always takes priority
      minNight++;
    } else if (isOvertime) {
      minExtra++;
    } else if (isComplementary) {
      minComplementary++;
    } else {
      minNormal++;
    }
  }

  const euros = round2(
    (minNormal / 60) * tariffs.base +
    (minComplementary / 60) * tariffs.complementary +
    (minExtra / 60) * tariffs.extra +
    (minNight / 60) * tariffs.night
  );

  return {
    baseMin: minNormal,
    extraMin: minExtra,
    nightMin: minNight,
    complementaryMin: minComplementary,
    euros,
  };
}

/**
 * Calculate pay for PTO and rest days
 */
function computePTOorRest(shift: Shift, profile: UserProfile): CalcResult {
  if (shift.kind === 'descanso' || shift.kind === 'baja') {
    return { baseMin: 0, extraMin: 0, nightMin: 0, complementaryMin: 0, euros: 0 };
  }

  // vacaciones or compensatoria
  const baseRate = shift.overrideRates?.base ?? profile.rates.base;
  const hoursPerDay = profile.contract.hoursPerWeek / profile.contract.workDaysPerWeek;
  const paidMinutes = shift.paidMinutesOverride ?? Math.round(hoursPerDay * 60);
  const euros = round2((paidMinutes / 60) * baseRate);

  return {
    baseMin: paidMinutes,
    extraMin: 0,
    nightMin: 0,
    complementaryMin: 0,
    euros,
  };
}

/**
 * Validates shift data
 */
export function validateShift(shift: Partial<Shift>, profile: UserProfile): string[] {
  const errors: string[] = [];

  if (shift.kind === 'normal') {
    if (!shift.startISO || !shift.endISO) {
      errors.push('Inicio y fin son obligatorios para turnos normales');
    } else {
      const start = new Date(shift.startISO);
      const end = new Date(shift.endISO);
      const durationMin = (end.getTime() - start.getTime()) / (1000 * 60);
      const breaks = shift.breaksMinutes ?? 0;
      const effective = durationMin - breaks;

      if (effective <= 0) {
        errors.push('La duración efectiva debe ser mayor que cero');
      }

      const complementary = shift.complementaryMinutes ?? 0;
      const overtime = shift.overtimeMinutes ?? 0;

      if (complementary + overtime > effective) {
        errors.push('Los minutos complementarios y extra no pueden exceder la duración efectiva');
      }
    }
  }

  return errors;
}
