import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { createShift, updateShift, deleteShift, getShiftsByDate } from '@/lib/firestore';
import { combineDateAndTime, extractTime, getTodayISO } from '@/lib/datetime';
import { validateShift, computeShiftPay } from '@/lib/calc';
import { formatEuros } from '@/lib/money';
import type { Shift, UserProfile, DayKind, ShiftType } from '@shared/schema';
import { Trash2 } from 'lucide-react';

interface ShiftDialogProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  initialDate?: string;
  editingShift?: Shift | null;
}

export default function ShiftDialog({ 
  open, 
  onClose, 
  profile, 
  initialDate,
  editingShift 
}: ShiftDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [kind, setKind] = useState<DayKind>('normal');
  const [dateISO, setDateISO] = useState(initialDate || getTodayISO(profile.timezone));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breaks, setBreaks] = useState('30');
  const [complementary, setComplementary] = useState('0');
  const [overtime, setOvertime] = useState('0');
  const [isExtraShift, setIsExtraShift] = useState(false);
  const [colleagueName, setColleagueName] = useState('');
  const [shiftType, setShiftType] = useState<ShiftType>('generico');
  const [paidMinutesOverride, setPaidMinutesOverride] = useState('');

  useEffect(() => {
    if (editingShift) {
      setKind(editingShift.kind);
      setDateISO(editingShift.dateISO);
      
      if (editingShift.kind === 'normal') {
        if (editingShift.startISO && editingShift.endISO) {
          setStartTime(extractTime(editingShift.startISO, profile.timezone));
          setEndTime(extractTime(editingShift.endISO, profile.timezone));
        }
        setBreaks((editingShift.breaksMinutes || 0).toString());
        setComplementary((editingShift.complementaryMinutes || 0).toString());
        setOvertime((editingShift.overtimeMinutes || 0).toString());
        setIsExtraShift(editingShift.isExtraShift || false);
        setColleagueName(editingShift.extraShiftInfo?.colleagueName || '');
        setShiftType(editingShift.type || 'generico');
      } else {
        setPaidMinutesOverride(editingShift.paidMinutesOverride?.toString() || '');
      }
    } else if (initialDate) {
      setDateISO(initialDate);
    }
  }, [editingShift, initialDate, profile.timezone]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Check for existing shifts on this date
      const existing = await getShiftsByDate(profile.uid, data.dateISO);
      const hasSpecialDay = existing.some(s => s.kind !== 'normal');
      
      if (hasSpecialDay && data.kind === 'normal') {
        const confirmed = window.confirm(
          'Ya existe un día especial en esta fecha. ¿Deseas sustituirlo con un turno normal?'
        );
        if (!confirmed) return;
      }
      
      return createShift(profile.uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/shifts'] });
      toast({ title: 'Turno creado', description: 'El turno se ha guardado correctamente' });
      onClose();
    },
    onError: (error) => {
      toast({ 
        variant: 'destructive',
        title: 'Error', 
        description: 'No se pudo crear el turno' 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editingShift) return;
      await updateShift(profile.uid, editingShift.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/shifts'] });
      toast({ title: 'Turno actualizado', description: 'Los cambios se han guardado' });
      onClose();
    },
    onError: () => {
      toast({ 
        variant: 'destructive',
        title: 'Error', 
        description: 'No se pudo actualizar el turno' 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!editingShift) return;
      await deleteShift(profile.uid, editingShift.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/shifts'] });
      toast({ title: 'Turno eliminado' });
      onClose();
    },
  });

  const handleSubmit = () => {
    const shiftData: any = {
      uid: profile.uid,
      kind,
      dateISO,
    };

    if (kind === 'normal') {
      // Always start with the selected date for start time
      shiftData.startISO = combineDateAndTime(dateISO, startTime, profile.timezone);
      
      // For end time, check if it crosses midnight
      let endDateISO = dateISO;
      if (endTime < startTime) {
        // Shift crosses midnight - use next day for end time
        const nextDay = new Date(dateISO);
        nextDay.setDate(nextDay.getDate() + 1);
        endDateISO = nextDay.toISOString().split('T')[0];
      }
      shiftData.endISO = combineDateAndTime(endDateISO, endTime, profile.timezone);
      
      shiftData.breaksMinutes = parseInt(breaks) || 0;
      shiftData.complementaryMinutes = parseInt(complementary) || 0;
      shiftData.overtimeMinutes = parseInt(overtime) || 0;
      shiftData.isExtraShift = isExtraShift;
      if (isExtraShift && colleagueName) {
        shiftData.extraShiftInfo = { colleagueName };
      }
      shiftData.type = shiftType;
    } else {
      if (paidMinutesOverride) {
        shiftData.paidMinutesOverride = parseInt(paidMinutesOverride);
      }
    }

    // Validate
    const errors = validateShift(shiftData, profile);
    if (errors.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Error de validación',
        description: errors.join(', '),
      });
      return;
    }

    if (editingShift) {
      updateMutation.mutate(shiftData);
    } else {
      createMutation.mutate(shiftData);
    }
  };

  const handleDelete = () => {
    if (!editingShift) return;
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este turno?');
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  // Calculate preview
  const getPreview = () => {
    if (kind !== 'normal') {
      const tempShift: Partial<Shift> = {
        kind,
        uid: profile.uid,
        dateISO,
        paidMinutesOverride: paidMinutesOverride ? parseInt(paidMinutesOverride) : undefined,
      };
      const calc = computeShiftPay(tempShift as Shift, profile);
      return formatEuros(calc.euros);
    }

    try {
      // Build times with same logic as handleSubmit
      const startISO = combineDateAndTime(dateISO, startTime, profile.timezone);
      
      let endDateISO = dateISO;
      if (endTime < startTime) {
        // Shift crosses midnight
        const nextDay = new Date(dateISO);
        nextDay.setDate(nextDay.getDate() + 1);
        endDateISO = nextDay.toISOString().split('T')[0];
      }
      const endISO = combineDateAndTime(endDateISO, endTime, profile.timezone);

      const tempShift: Partial<Shift> = {
        kind: 'normal',
        uid: profile.uid,
        dateISO,
        startISO,
        endISO,
        breaksMinutes: parseInt(breaks) || 0,
        complementaryMinutes: parseInt(complementary) || 0,
        overtimeMinutes: parseInt(overtime) || 0,
      };

      const calc = computeShiftPay(tempShift as Shift, profile);
      return formatEuros(calc.euros);
    } catch (error) {
      console.error('Preview calc error:', error);
      return '-';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingShift ? 'Editar turno' : 'Nuevo turno'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              data-testid="input-shift-date"
            />
          </div>

          {/* Day Kind Selector */}
          <div className="space-y-2">
            <Label>Tipo de día</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { value: 'normal', label: 'Normal' },
                { value: 'descanso', label: 'Descanso' },
                { value: 'vacaciones', label: 'Vacaciones' },
                { value: 'compensatoria', label: 'Compensatoria' },
                { value: 'baja', label: 'Baja' },
              ].map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={kind === option.value ? 'default' : 'outline'}
                  onClick={() => setKind(option.value as DayKind)}
                  data-testid={`button-kind-${option.value}`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Normal shift fields */}
          {kind === 'normal' && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      data-testid="input-start-time"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      data-testid="input-end-time"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breaks">Descanso (minutos)</Label>
                  <Input
                    id="breaks"
                    type="number"
                    value={breaks}
                    onChange={(e) => setBreaks(e.target.value)}
                    data-testid="input-breaks"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shiftType">Etiqueta</Label>
                  <Select value={shiftType} onValueChange={(v: ShiftType) => setShiftType(v)}>
                    <SelectTrigger id="shiftType" data-testid="select-shift-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generico">Genérico</SelectItem>
                      <SelectItem value="complementario">Complementario</SelectItem>
                      <SelectItem value="adquirido">Adquirido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="complementary">Cola complementaria (min)</Label>
                    <Input
                      id="complementary"
                      type="number"
                      value={complementary}
                      onChange={(e) => setComplementary(e.target.value)}
                      data-testid="input-complementary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overtime">Cola extra (min)</Label>
                    <Input
                      id="overtime"
                      type="number"
                      value={overtime}
                      onChange={(e) => setOvertime(e.target.value)}
                      data-testid="input-overtime"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isExtraShift"
                      checked={isExtraShift}
                      onChange={(e) => setIsExtraShift(e.target.checked)}
                      className="h-4 w-4"
                      data-testid="checkbox-extra-shift"
                    />
                    <Label htmlFor="isExtraShift" className="cursor-pointer">
                      Turno extra (cogido a compañero)
                    </Label>
                  </div>
                  {isExtraShift && (
                    <Input
                      placeholder="Nombre del compañero (opcional)"
                      value={colleagueName}
                      onChange={(e) => setColleagueName(e.target.value)}
                      data-testid="input-colleague-name"
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Special day fields */}
          {kind !== 'normal' && kind !== 'descanso' && kind !== 'baja' && (
            <div className="space-y-2">
              <Label htmlFor="paidMinutes">Minutos pagados (opcional, sobrescribe cálculo automático)</Label>
              <Input
                id="paidMinutes"
                type="number"
                value={paidMinutesOverride}
                onChange={(e) => setPaidMinutesOverride(e.target.value)}
                placeholder="Se calculará según contrato"
                data-testid="input-paid-minutes"
              />
            </div>
          )}

          {/* Preview */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pago estimado:</span>
              <span className="text-lg font-mono font-semibold" data-testid="text-preview-amount">
                {getPreview()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-2">
            {editingShift && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                data-testid="button-delete-shift"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-shift"
              >
                {editingShift ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
