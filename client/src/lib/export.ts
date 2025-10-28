import { format } from 'date-fns';
import type { Shift, UserProfile } from '@shared/schema';
import { computeShiftPay } from './calc';
import { formatEuros, formatMinutesAsHours } from './money';
import { extractTime } from './datetime';

/**
 * Export shifts to CSV format
 */
export function exportToCSV(shifts: Shift[], profile: UserProfile): void {
  const headers = [
    'Fecha',
    'Tipo',
    'Inicio',
    'Fin',
    'Descanso (min)',
    'Horas Base',
    'Horas Extra',
    'Horas Noche',
    'Horas Comp',
    'Total €',
  ];

  const rows = shifts.map((shift) => {
    const calc = shift.calcCache || computeShiftPay(shift, profile);
    
    return [
      shift.dateISO,
      shift.kind,
      shift.startISO ? extractTime(shift.startISO, profile.timezone) : '',
      shift.endISO ? extractTime(shift.endISO, profile.timezone) : '',
      shift.breaksMinutes || '',
      formatMinutesAsHours(calc.baseMin),
      formatMinutesAsHours(calc.extraMin),
      formatMinutesAsHours(calc.nightMin),
      formatMinutesAsHours(calc.complementaryMin),
      calc.euros.toFixed(2),
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  downloadFile(csv, 'turnos.csv', 'text/csv');
}

/**
 * Export shifts to TXT format (human readable)
 */
export function exportToTXT(shifts: Shift[], profile: UserProfile): void {
  const lines = shifts.map((shift) => {
    const calc = shift.calcCache || computeShiftPay(shift, profile);
    
    let line = `${shift.dateISO} - ${shift.kind}`;
    
    if (shift.kind === 'normal' && shift.startISO && shift.endISO) {
      const start = extractTime(shift.startISO, profile.timezone);
      const end = extractTime(shift.endISO, profile.timezone);
      line += ` ${start}-${end}`;
      
      if (shift.breaksMinutes) {
        line += ` (${shift.breaksMinutes}min descanso)`;
      }
    }
    
    line += ` - ${formatEuros(calc.euros)}`;
    
    return line;
  });

  const txt = lines.join('\n');
  downloadFile(txt, 'turnos.txt', 'text/plain');
}

/**
 * Export shifts summary with totals
 */
export function exportSummary(shifts: Shift[], profile: UserProfile): void {
  const totals = {
    baseHours: 0,
    extraHours: 0,
    nightHours: 0,
    compHours: 0,
    totalEuros: 0,
  };

  shifts.forEach((shift) => {
    const calc = shift.calcCache || computeShiftPay(shift, profile);
    totals.baseHours += calc.baseMin / 60;
    totals.extraHours += calc.extraMin / 60;
    totals.nightHours += calc.nightMin / 60;
    totals.compHours += calc.complementaryMin / 60;
    totals.totalEuros += calc.euros;
  });

  const summary = `
RESUMEN DE TURNOS
==================

Período: ${shifts[0]?.dateISO} - ${shifts[shifts.length - 1]?.dateISO}
Total de turnos: ${shifts.length}

HORAS:
------
Horas base: ${totals.baseHours.toFixed(2)}h
Horas extra: ${totals.extraHours.toFixed(2)}h
Horas nocturnas: ${totals.nightHours.toFixed(2)}h
Horas complementarias: ${totals.compHours.toFixed(2)}h

TOTAL: ${formatEuros(totals.totalEuros)}
`;

  downloadFile(summary, 'resumen_turnos.txt', 'text/plain');
}

/**
 * Helper to trigger file download
 */
function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
