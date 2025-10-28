import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameMonth,
  startOfWeek,
  endOfWeek,
  isSameDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { Shift, UserProfile } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatEuros } from '@/lib/money';
import { computeShiftPay } from '@/lib/calc';
import { extractTime } from '@/lib/datetime';

interface CalendarGridProps {
  month: Date;
  shifts: Shift[];
  viewMode: 'table' | 'cards';
  onAddShift: (dateISO: string) => void;
  onEditShift: (shift: Shift) => void;
  profile: UserProfile;
}

export default function CalendarGrid({ 
  month, 
  shifts, 
  viewMode, 
  onAddShift, 
  onEditShift,
  profile 
}: CalendarGridProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group shifts by date
  const shiftsByDate = shifts.reduce((acc, shift) => {
    if (!acc[shift.dateISO]) {
      acc[shift.dateISO] = [];
    }
    acc[shift.dateISO].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  const getShiftBadgeVariant = (shift: Shift) => {
    if (shift.kind !== 'normal') return 'secondary';
    if (shift.type === 'complementario') return 'default';
    if (shift.type === 'adquirido') return 'outline';
    return 'secondary';
  };

  const getShiftLabel = (shift: Shift) => {
    if (shift.kind === 'descanso') return 'Descanso';
    if (shift.kind === 'vacaciones') return 'Vacaciones';
    if (shift.kind === 'compensatoria') return 'Compensatoria';
    if (shift.kind === 'baja') return 'Baja';
    
    if (shift.startISO && shift.endISO) {
      const start = extractTime(shift.startISO, profile.timezone);
      const end = extractTime(shift.endISO, profile.timezone);
      return `${start}-${end}`;
    }
    return 'Turno';
  };

  const getDayTotal = (dateISO: string) => {
    const dayShifts = shiftsByDate[dateISO] || [];
    const total = dayShifts.reduce((sum, shift) => {
      const calc = shift.calcCache || computeShiftPay(shift, profile);
      return sum + calc.euros;
    }, 0);
    return total;
  };

  if (viewMode === 'table') {
    return (
      <div className="space-y-2">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dateISO = format(day, 'yyyy-MM-dd');
            const dayShifts = shiftsByDate[dateISO] || [];
            const isCurrentMonth = isSameMonth(day, month);
            const isToday = isSameDay(day, new Date());
            const dayTotal = getDayTotal(dateISO);

            return (
              <Card
                key={dateISO}
                className={`min-h-[120px] p-2 hover-elevate cursor-pointer ${
                  !isCurrentMonth ? 'opacity-40' : ''
                } ${isToday ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onAddShift(dateISO)}
                data-testid={`calendar-day-${dateISO}`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayShifts.length > 0 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddShift(dateISO);
                        }}
                        data-testid={`button-add-shift-${dateISO}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 space-y-1 overflow-hidden">
                    {dayShifts.slice(0, 3).map((shift) => (
                      <Badge
                        key={shift.id}
                        variant={getShiftBadgeVariant(shift)}
                        className="w-full text-xs justify-start cursor-pointer truncate"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditShift(shift);
                        }}
                        data-testid={`shift-badge-${shift.id}`}
                      >
                        {getShiftLabel(shift)}
                      </Badge>
                    ))}
                    {dayShifts.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{dayShifts.length - 3} más
                      </p>
                    )}
                  </div>

                  {dayTotal > 0 && (
                    <div className="text-xs font-mono font-semibold text-right mt-1">
                      {formatEuros(dayTotal)}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Cards view - vertical layout
  const weeksInMonth = Math.ceil(days.length / 7);
  const weeks = Array.from({ length: weeksInMonth }, (_, i) => 
    days.slice(i * 7, (i + 1) * 7)
  );

  return (
    <div className="space-y-6">
      {weeks.map((week, weekIdx) => (
        <div key={weekIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {week.map((day) => {
            const dateISO = format(day, 'yyyy-MM-dd');
            const dayShifts = shiftsByDate[dateISO] || [];
            const isCurrentMonth = isSameMonth(day, month);
            const isToday = isSameDay(day, new Date());
            const dayTotal = getDayTotal(dateISO);

            if (!isCurrentMonth) return null;

            return (
              <Card
                key={dateISO}
                className={`p-4 hover-elevate cursor-pointer ${
                  isToday ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onAddShift(dateISO)}
                data-testid={`calendar-card-${dateISO}`}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                        {format(day, 'd')}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {format(day, 'EEEE', { locale: es })}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddShift(dateISO);
                      }}
                      data-testid={`button-add-shift-card-${dateISO}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Shifts */}
                  {dayShifts.length > 0 ? (
                    <div className="space-y-2">
                      {dayShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="flex items-center justify-between p-2 rounded-md bg-muted hover-elevate cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditShift(shift);
                          }}
                          data-testid={`shift-card-${shift.id}`}
                        >
                          <span className="text-sm font-medium">
                            {getShiftLabel(shift)}
                          </span>
                          <Badge variant={getShiftBadgeVariant(shift)}>
                            {shift.type || shift.kind}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Sin turnos
                    </p>
                  )}

                  {/* Total */}
                  {dayTotal > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-base font-mono font-semibold">
                          {formatEuros(dayTotal)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );
}
