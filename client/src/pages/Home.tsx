import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getShiftsByDateRange } from '@/lib/firestore';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Grid3x3, LayoutList } from 'lucide-react';
import CalendarGrid from '@/components/CalendarGrid';
import ShiftDialog from '@/components/ShiftDialog';
import { getTodayISO } from '@/lib/datetime';
import type { Shift } from '@shared/schema';

export default function Home() {
  const { profile } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ['/shifts', profile?.uid, format(monthStart, 'yyyy-MM-dd'), format(monthEnd, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!profile?.uid) return [];
      return await getShiftsByDateRange(
        profile.uid,
        format(monthStart, 'yyyy-MM-dd'),
        format(monthEnd, 'yyyy-MM-dd')
      );
    },
    enabled: !!profile?.uid,
  });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleAddShift = (dateISO?: string) => {
    setSelectedDate(dateISO || getTodayISO(profile!.timezone));
    setEditingShift(null);
    setDialogOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setSelectedDate(shift.dateISO);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
    setEditingShift(null);
  };

  if (!profile) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
                data-testid="button-prev-month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h2 className="text-lg font-semibold min-w-[200px] text-center capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h2>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                data-testid="button-next-month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={handleToday}
                data-testid="button-today"
              >
                Hoy
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  data-testid="button-view-table"
                  className="rounded-r-none"
                >
                  <Grid3x3 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Tabla</span>
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  data-testid="button-view-cards"
                  className="rounded-l-none"
                >
                  <LayoutList className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Tarjetas</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Cargando calendario...</p>
            </div>
          ) : (
            <CalendarGrid
              month={currentMonth}
              shifts={shifts}
              viewMode={viewMode}
              onAddShift={handleAddShift}
              onEditShift={handleEditShift}
              profile={profile}
            />
          )}
        </div>
      </div>

      {/* FAB */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg sm:bottom-8 sm:right-8 z-50"
        onClick={() => handleAddShift()}
        data-testid="button-add-shift"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Shift Dialog */}
      <ShiftDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        profile={profile}
        initialDate={selectedDate || undefined}
        editingShift={editingShift}
      />
    </div>
  );
}
