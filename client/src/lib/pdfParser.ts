import * as pdfjsLib from 'pdfjs-dist';
import type { InsertShift, UserProfile, ShiftType } from '@shared/schema';
import { combineDateAndTime } from './datetime';
import { format, parse } from 'date-fns';

// Set worker source for pdfjs - using unpkg CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ParsedShiftRow {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  breaksMinutes: number;
  comment?: string;
}

/**
 * Parse PDF file (WorkTime format) into shifts
 */
export async function parsePDF(
  file: File,
  profile: UserProfile,
  shiftType: ShiftType
): Promise<InsertShift[]> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Parse PDF using pdfjs-dist
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  // Extract text from all pages
  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  // Parse WorkTime format
  const shiftRows = parseWorkTimeFormat(fullText);
  
  if (shiftRows.length === 0) {
    throw new Error('No se encontraron turnos válidos en el PDF. Verifica que el formato sea compatible.');
  }
  
  // Convert to InsertShift format
  const shifts: InsertShift[] = shiftRows.map(row => {
    const shift: InsertShift = {
      uid: profile.uid,
      kind: 'normal',
      dateISO: row.date,
      type: shiftType,
      source: {
        origin: 'import',
        fileName: file.name,
      },
    };

    // Handle start/end times
    shift.startISO = combineDateAndTime(row.date, row.startTime, profile.timezone);
    shift.endISO = combineDateAndTime(row.date, row.endTime, profile.timezone);

    // Handle midnight crossing (if end time is before start time)
    if (row.endTime < row.startTime) {
      const nextDay = new Date(row.date);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayISO = format(nextDay, 'yyyy-MM-dd');
      shift.endISO = combineDateAndTime(nextDayISO, row.endTime, profile.timezone);
    }

    // Add breaks
    if (row.breaksMinutes > 0) {
      shift.breaksMinutes = row.breaksMinutes;
    }

    return shift;
  });

  return shifts;
}

/**
 * Parse WorkTime PDF text format
 * Expected format:
 * Fecha       Inicio     Fin     Descanso Tiempo   Precio por hora   Importe   Comentario
 * 1/11/2024   12:00      15:30   0        03:30    8.1               28.35
 */
function parseWorkTimeFormat(text: string): ParsedShiftRow[] {
  const shifts: ParsedShiftRow[] = [];
  
  // Split into tokens (words/numbers)
  const tokens = text.split(/\s+/).filter(t => t.trim());
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Try to match date format: DD/MM/YYYY or D/M/YYYY
    const dateMatch = token.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!dateMatch) continue;
    
    // Found a date, now look for start time, end time, and break
    // Pattern: date startTime endTime breaks ...
    if (i + 3 < tokens.length) {
      const startTime = tokens[i + 1];
      const endTime = tokens[i + 2];
      const breaks = tokens[i + 3];
      
      // Validate time format HH:MM
      if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
        continue;
      }
      
      // Skip invalid shifts (00:00 - 00:00)
      if (startTime === '00:00' && endTime === '00:00') {
        continue;
      }
      
      // Validate breaks is a number
      if (!/^\d+$/.test(breaks)) {
        continue;
      }
      
      try {
        const date = parseDateString(token);
        shifts.push({
          date,
          startTime,
          endTime,
          breaksMinutes: parseInt(breaks),
        });
      } catch (error) {
        console.warn('Error parsing date:', token, error);
      }
    }
  }

  return shifts;
}

/**
 * Parse date string from various formats to YYYY-MM-DD
 */
function parseDateString(dateStr: string): string {
  // Clean up
  dateStr = dateStr.trim();
  
  // Try DD/MM/YYYY or D/M/YYYY
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const [_, day, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Try parsing with date-fns
  try {
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    return format(parsed, 'yyyy-MM-dd');
  } catch {
    throw new Error(`Formato de fecha no válido: ${dateStr}`);
  }
}
