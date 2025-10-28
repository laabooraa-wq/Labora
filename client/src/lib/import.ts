import Papa from 'papaparse';
import type { InsertShift, UserProfile } from '@shared/schema';
import { combineDateAndTime, getTodayISO } from './datetime';
import { parse, format } from 'date-fns';

interface CSVRow {
  fecha: string;
  inicio?: string;
  fin?: string;
  descanso?: string;
  tipo?: string;
  notas?: string;
}

/**
 * Parse CSV file into shifts
 */
export async function parseCSV(file: File, profile: UserProfile): Promise<InsertShift[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const shifts: InsertShift[] = results.data.map((row) => {
            const dateISO = parseDateString(row.fecha);
            const kind = parseKind(row.tipo);

            const shift: InsertShift = {
              uid: profile.uid,
              kind,
              dateISO,
              source: {
                origin: 'import',
                fileName: file.name,
              },
            };

            if (kind === 'normal' && row.inicio && row.fin) {
              shift.startISO = combineDateAndTime(dateISO, row.inicio, profile.timezone);
              shift.endISO = combineDateAndTime(dateISO, row.fin, profile.timezone);
              
              // Handle midnight crossing
              if (row.fin < row.inicio) {
                const nextDay = new Date(dateISO);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayISO = format(nextDay, 'yyyy-MM-dd');
                shift.endISO = combineDateAndTime(nextDayISO, row.fin, profile.timezone);
              }

              if (row.descanso) {
                shift.breaksMinutes = parseInt(row.descanso);
              }

              shift.type = row.tipo as any || 'generico';
            }

            return shift;
          });

          resolve(shifts);
        } catch (error: any) {
          reject(new Error(`Error al parsear CSV: ${error.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`Error al leer archivo: ${error.message}`));
      },
    });
  });
}

/**
 * Parse TXT file (simple format)
 * Format: "DD/MM/YYYY HH:MM-HH:MM (XXmin descanso)"
 */
export async function parseTXT(file: File, profile: UserProfile): Promise<InsertShift[]> {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  const shifts: InsertShift[] = [];

  for (const line of lines) {
    try {
      // Try to parse date and time from line
      const dateMatch = line.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const timeMatch = line.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
      const breakMatch = line.match(/(\d+)\s*min/i);

      if (!dateMatch) continue;

      const [_, day, month, year] = dateMatch;
      const dateISO = `${year}-${month}-${day}`;

      const shift: InsertShift = {
        uid: profile.uid,
        kind: 'normal',
        dateISO,
        source: {
          origin: 'import',
          fileName: file.name,
        },
      };

      if (timeMatch) {
        const [__, startH, startM, endH, endM] = timeMatch;
        const startTime = `${startH}:${startM}`;
        const endTime = `${endH}:${endM}`;

        shift.startISO = combineDateAndTime(dateISO, startTime, profile.timezone);
        shift.endISO = combineDateAndTime(dateISO, endTime, profile.timezone);

        // Handle midnight crossing
        if (endTime < startTime) {
          const nextDay = new Date(dateISO);
          nextDay.setDate(nextDay.getDate() + 1);
          const nextDayISO = format(nextDay, 'yyyy-MM-dd');
          shift.endISO = combineDateAndTime(nextDayISO, endTime, profile.timezone);
        }
      }

      if (breakMatch) {
        shift.breaksMinutes = parseInt(breakMatch[1]);
      }

      shifts.push(shift);
    } catch (error) {
      console.error('Error parsing line:', line, error);
    }
  }

  return shifts;
}

/**
 * Parse WorkTime PDF (placeholder - requires pdf-parse library)
 */
export async function parseWorkTimePDF(file: File, profile: UserProfile): Promise<InsertShift[]> {
  // This is a placeholder - actual implementation would use pdf-parse
  // to extract text and then parse it similar to TXT format
  
  throw new Error('Importación de PDF aún no implementada. Usa CSV o TXT.');
  
  // Future implementation would:
  // 1. Use pdf-parse to extract text
  // 2. Parse the WorkTime-specific format
  // 3. Extract shifts, dates, times
  // 4. Return InsertShift[]
}

/**
 * Helper: Parse date string in various formats to YYYY-MM-DD
 */
function parseDateString(dateStr: string): string {
  // Try YYYY-MM-DD first
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Try DD/MM/YYYY
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    const [_, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  // Try parsing with date-fns
  try {
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    return format(parsed, 'yyyy-MM-dd');
  } catch {
    throw new Error(`Formato de fecha no válido: ${dateStr}`);
  }
}

/**
 * Helper: Parse shift kind from string
 */
function parseKind(tipo?: string): any {
  if (!tipo) return 'normal';
  
  const lower = tipo.toLowerCase();
  
  if (lower.includes('vacacion')) return 'vacaciones';
  if (lower.includes('descanso')) return 'descanso';
  if (lower.includes('compensat')) return 'compensatoria';
  if (lower.includes('baja')) return 'baja';
  
  return 'normal';
}
