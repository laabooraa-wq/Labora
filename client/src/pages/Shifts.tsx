import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getAllShifts } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatEuros, formatMinutesAsHours } from '@/lib/money';
import { formatDateES } from '@/lib/datetime';
import { computeShiftPay } from '@/lib/calc';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parse } from 'date-fns';
import type { Shift, DayKind } from '@shared/schema';

export default function Shifts() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('month');
  const [filterKind, setFilterKind] = useState<DayKind | 'all'>('all');
  const [filterExtra, setFilterExtra] = useState<'all' | 'yes' | 'no'>('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ['/shifts', profile?.uid],
    queryFn: async () => {
      if (!profile?.uid) return [];
      return await getAllShifts(profile.uid);
    },
    enabled: !!profile?.uid,
  });

  if (!profile) return null;

  // Filter shifts
  const filteredShifts = shifts.filter(shift => {
    if (filterKind !== 'all' && shift.kind !== filterKind) return false;
    if (filterExtra === 'yes' && !shift.isExtraShift) return false;
    if (filterExtra === 'no' && shift.isExtraShift) return false;
    if (filterStartDate && shift.dateISO < filterStartDate) return false;
    if (filterEndDate && shift.dateISO > filterEndDate) return false;
    return true;
  });

  // Group by period
  const getShiftsForPeriod = () => {
    const now = new Date();
    let start: Date, end: Date;

    switch (activeTab) {
      case 'day':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        return filteredShifts;
    }

    return filteredShifts.filter(shift => {
      const shiftDate = parse(shift.dateISO, 'yyyy-MM-dd', new Date());
      return shiftDate >= start && shiftDate <= end;
    });
  };

  const periodShifts = getShiftsForPeriod();

  // Calculate totals
  const calculateTotals = (shifts: Shift[]) => {
    const totals = {
      baseMin: 0,
      extraMin: 0,
      nightMin: 0,
      complementaryMin: 0,
      ptoMin: 0,
      euros: 0,
    };

    shifts.forEach(shift => {
      const calc = shift.calcCache || computeShiftPay(shift, profile);
      
      if (shift.kind === 'normal') {
        totals.baseMin += calc.baseMin;
        totals.extraMin += calc.extraMin;
        totals.nightMin += calc.nightMin;
        totals.complementaryMin += calc.complementaryMin;
      } else if (shift.kind === 'vacaciones' || shift.kind === 'compensatoria') {
        totals.ptoMin += calc.baseMin;
      }
      
      totals.euros += calc.euros;
    });

    return totals;
  };

  const totals = calculateTotals(periodShifts);

  const getKindLabel = (kind: DayKind) => {
    const labels = {
      normal: 'Normal',
      descanso: 'Descanso',
      vacaciones: 'Vacaciones',
      compensatoria: 'Compensatoria',
      baja: 'Baja',
    };
    return labels[kind];
  };

  const getKindBadgeVariant = (kind: DayKind) => {
    if (kind === 'normal') return 'default';
    if (kind === 'descanso') return 'secondary';
    if (kind === 'vacaciones') return 'outline';
    return 'secondary';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Turnos</h1>
        <p className="text-muted-foreground">Vista detallada de todos tus turnos y estadísticas</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filterKind">Tipo de día</Label>
              <Select value={filterKind} onValueChange={(v: any) => setFilterKind(v)}>
                <SelectTrigger id="filterKind" data-testid="select-filter-kind">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="descanso">Descanso</SelectItem>
                  <SelectItem value="vacaciones">Vacaciones</SelectItem>
                  <SelectItem value="compensatoria">Compensatoria</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterExtra">Turno extra</Label>
              <Select value={filterExtra} onValueChange={(v: any) => setFilterExtra(v)}>
                <SelectTrigger id="filterExtra" data-testid="select-filter-extra">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="yes">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterStartDate">Desde</Label>
              <Input
                id="filterStartDate"
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                data-testid="input-filter-start"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterEndDate">Hasta</Label>
              <Input
                id="filterEndDate"
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                data-testid="input-filter-end"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="day" data-testid="tab-day">Día</TabsTrigger>
          <TabsTrigger value="week" data-testid="tab-week">Semana</TabsTrigger>
          <TabsTrigger value="month" data-testid="tab-month">Mes</TabsTrigger>
          <TabsTrigger value="year" data-testid="tab-year">Año</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {/* Totals Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Totales del período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Base</p>
                  <p className="text-xl font-semibold font-mono" data-testid="total-base-hours">
                    {formatMinutesAsHours(totals.baseMin)}h
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Extra</p>
                  <p className="text-xl font-semibold font-mono" data-testid="total-extra-hours">
                    {formatMinutesAsHours(totals.extraMin)}h
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nocturna</p>
                  <p className="text-xl font-semibold font-mono" data-testid="total-night-hours">
                    {formatMinutesAsHours(totals.nightMin)}h
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Complementaria</p>
                  <p className="text-xl font-semibold font-mono" data-testid="total-comp-hours">
                    {formatMinutesAsHours(totals.complementaryMin)}h
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">PTO</p>
                  <p className="text-xl font-semibold font-mono" data-testid="total-pto-hours">
                    {formatMinutesAsHours(totals.ptoMin)}h
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total €</p>
                  <p className="text-2xl font-bold font-mono text-primary" data-testid="total-euros">
                    {formatEuros(totals.euros)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shifts List */}
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Cargando turnos...</p>
            ) : periodShifts.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    No hay turnos en este período
                  </p>
                </CardContent>
              </Card>
            ) : (
              periodShifts
                .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
                .map((shift) => {
                  const calc = shift.calcCache || computeShiftPay(shift, profile);
                  
                  return (
                    <Card key={shift.id} className="hover-elevate" data-testid={`shift-item-${shift.id}`}>
                      <CardContent className="py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">
                                {formatDateES(shift.dateISO)}
                              </span>
                              <Badge variant={getKindBadgeVariant(shift.kind)}>
                                {getKindLabel(shift.kind)}
                              </Badge>
                              {shift.isExtraShift && (
                                <Badge variant="outline">Extra</Badge>
                              )}
                              {shift.type && shift.kind === 'normal' && (
                                <Badge variant="secondary">{shift.type}</Badge>
                              )}
                            </div>

                            {shift.kind === 'normal' && shift.startISO && shift.endISO && (
                              <div className="text-sm text-muted-foreground font-mono">
                                {shift.startISO.split('T')[1].substring(0, 5)} - {shift.endISO.split('T')[1].substring(0, 5)}
                                {shift.breaksMinutes ? ` • Descanso: ${shift.breaksMinutes}min` : ''}
                              </div>
                            )}

                            {shift.extraShiftInfo?.colleagueName && (
                              <div className="text-sm text-muted-foreground">
                                Compañero: {shift.extraShiftInfo.colleagueName}
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold font-mono">
                              {formatEuros(calc.euros)}
                            </div>
                            <div className="text-xs text-muted-foreground space-x-2">
                              {calc.baseMin > 0 && <span>Base: {formatMinutesAsHours(calc.baseMin)}h</span>}
                              {calc.extraMin > 0 && <span>Extra: {formatMinutesAsHours(calc.extraMin)}h</span>}
                              {calc.nightMin > 0 && <span>Noche: {formatMinutesAsHours(calc.nightMin)}h</span>}
                              {calc.complementaryMin > 0 && <span>Comp: {formatMinutesAsHours(calc.complementaryMin)}h</span>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
