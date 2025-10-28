import { format, parseISO, addMinutes, differenceInMinutes, startOfDay, endOfDay, parse } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

/**
 * Converts a UTC ISO string to a Date in the user's timezone
 */
export function utcToZoned(utcISO: string, timezone: string): Date {
  return toZonedTime(parseISO(utcISO), timezone);
}

/**
 * Converts a local date in user's timezone to UTC ISO string
 */
export function zonedToUtc(localDate: Date, timezone: string): string {
  return fromZonedTime(localDate, timezone).toISOString();
}

/**
 * Parses HH:mm time string and combines with date in timezone, returns UTC ISO
 */
export function combineDateAndTime(dateISO: string, timeHHmm: string, timezone: string): string {
  const [hours, minutes] = timeHHmm.split(':').map(Number);
  const localDate = parse(dateISO, 'yyyy-MM-dd', new Date());
  localDate.setHours(hours, minutes, 0, 0);
  return zonedToUtc(localDate, timezone);
}

/**
 * Extracts HH:mm from UTC ISO string in user's timezone
 */
export function extractTime(utcISO: string, timezone: string): string {
  const zoned = utcToZoned(utcISO, timezone);
  return format(zoned, 'HH:mm');
}

/**
 * Formats date in es-ES locale
 */
export function formatDateES(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return new Intl.DateTimeFormat('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(d);
}

/**
 * Formats date and time in es-ES locale
 */
export function formatDateTimeES(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return new Intl.DateTimeFormat('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

/**
 * Expands a time range (potentially crossing midnight) into an array of minute timestamps
 * Returns array of Date objects for each minute in the range
 */
export function expandMinutes(startISO: string, endISO: string): Date[] {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  const totalMinutes = differenceInMinutes(end, start);
  
  const minutes: Date[] = [];
  for (let i = 0; i < totalMinutes; i++) {
    minutes.push(addMinutes(start, i));
  }
  
  return minutes;
}

/**
 * Checks if a time (HH:mm) falls within a night window, handling midnight crossing
 */
export function isTimeInNightWindow(timeHHmm: string, nightFrom: string, nightTo: string): boolean {
  const [h, m] = timeHHmm.split(':').map(Number);
  const [fromH, fromM] = nightFrom.split(':').map(Number);
  const [toH, toM] = nightTo.split(':').map(Number);
  
  const timeMinutes = h * 60 + m;
  const fromMinutes = fromH * 60 + fromM;
  const toMinutes = toH * 60 + toM;
  
  // Handle midnight crossing
  if (fromMinutes > toMinutes) {
    // Window crosses midnight (e.g., 22:00 to 06:00)
    return timeMinutes >= fromMinutes || timeMinutes < toMinutes;
  } else {
    // Normal window (e.g., 08:00 to 17:00)
    return timeMinutes >= fromMinutes && timeMinutes < toMinutes;
  }
}

/**
 * Checks if a UTC minute timestamp falls in the night window when converted to timezone
 */
export function isMinuteInNightWindow(
  minute: Date, 
  nightWindow: { from: string; to: string }, 
  timezone: string
): boolean {
  const zoned = toZonedTime(minute, timezone);
  const timeHHmm = format(zoned, 'HH:mm');
  return isTimeInNightWindow(timeHHmm, nightWindow.from, nightWindow.to);
}

/**
 * Gets date in YYYY-MM-DD format for a given timezone
 */
export function getDateISO(date: Date, timezone: string): string {
  const zoned = toZonedTime(date, timezone);
  return format(zoned, 'yyyy-MM-dd');
}

/**
 * Parses YYYY-MM-DD string to Date at start of day in timezone
 */
export function parseDateISO(dateISO: string, timezone: string): Date {
  return fromZonedTime(parse(dateISO, 'yyyy-MM-dd', new Date()), timezone);
}

/**
 * Validates HH:mm format
 */
export function isValidTimeFormat(time: string): boolean {
  return /^\d{2}:\d{2}$/.test(time);
}

/**
 * Gets current date in YYYY-MM-DD format for timezone
 */
export function getTodayISO(timezone: string): string {
  return getDateISO(new Date(), timezone);
}
