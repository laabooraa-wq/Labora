import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { parsePDF } from '@/lib/pdfParser';
import { createShiftsBatch } from '@/lib/firestore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { InsertShift, ShiftType } from '@shared/schema';
import { format } from 'date-fns';

interface PDFImportWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'select-type' | 'upload' | 'preview';

export default function PDFImportWizard({ open, onOpenChange }: PDFImportWizardProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>('select-type');
  const [shiftType, setShiftType] = useState<ShiftType>('generico');
  const [file, setFile] = useState<File | null>(null);
  const [parsedShifts, setParsedShifts] = useState<InsertShift[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [parseError, setParseError] = useState<string>('');

  const handleReset = () => {
    setStep('select-type');
    setShiftType('generico');
    setFile(null);
    setParsedShifts([]);
    setParseError('');
    setIsProcessing(false);
    setIsImporting(false);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !profile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast({
        variant: 'destructive',
        title: 'Archivo inválido',
        description: 'Solo se permiten archivos PDF',
      });
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setParseError('');

    try {
      const shifts = await parsePDF(selectedFile, profile, shiftType);
      setParsedShifts(shifts);
      setStep('preview');
    } catch (error: any) {
      setParseError(error.message || 'Error al procesar el PDF');
      toast({
        variant: 'destructive',
        title: 'Error al procesar PDF',
        description: error.message || 'No se pudo extraer los turnos del PDF',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!profile || parsedShifts.length === 0) return;

    setIsImporting(true);
    
    try {
      await createShiftsBatch(profile.uid, parsedShifts);

      toast({
        title: '¡Importación exitosa!',
        description: `Se importaron ${parsedShifts.length} turnos correctamente`,
      });

      handleClose();
      
      // Reload page to show new shifts
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al importar',
        description: error.message || 'No se pudieron guardar los turnos',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const getShiftTypeLabel = (type: ShiftType) => {
    switch (type) {
      case 'generico': return 'Turno general';
      case 'complementario': return 'Horas complementarias';
      case 'adquirido': return 'Turno cogido por compañero';
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'select-type':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Tipo de turnos a importar</Label>
              <RadioGroup value={shiftType} onValueChange={(value) => setShiftType(value as ShiftType)}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate cursor-pointer">
                  <RadioGroupItem value="generico" id="type-generico" data-testid="radio-type-generico" />
                  <Label htmlFor="type-generico" className="flex-1 cursor-pointer">
                    <div className="font-medium">Turnos generales</div>
                    <div className="text-sm text-muted-foreground">Turnos normales de trabajo</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate cursor-pointer">
                  <RadioGroupItem value="complementario" id="type-complementario" data-testid="radio-type-complementario" />
                  <Label htmlFor="type-complementario" className="flex-1 cursor-pointer">
                    <div className="font-medium">Horas complementarias</div>
                    <div className="text-sm text-muted-foreground">Horas extra fuera del horario habitual</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate cursor-pointer">
                  <RadioGroupItem value="adquirido" id="type-adquirido" data-testid="radio-type-adquirido" />
                  <Label htmlFor="type-adquirido" className="flex-1 cursor-pointer">
                    <div className="font-medium">Turnos de compañeros</div>
                    <div className="text-sm text-muted-foreground">Turnos cogidos a cambio por otros compañeros</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep('upload')} data-testid="button-next-to-upload">
                Siguiente
              </Button>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Tipo seleccionado: <span className="font-medium text-foreground">{getShiftTypeLabel(shiftType)}</span>
            </div>

            <div className="space-y-4">
              <Label htmlFor="pdf-file">Selecciona el archivo PDF</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer">
                <input
                  id="pdf-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                  data-testid="input-pdf-file"
                />
                <label htmlFor="pdf-file" className="cursor-pointer">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-sm font-medium">Procesando PDF...</p>
                      <p className="text-xs text-muted-foreground">Esto puede tardar unos segundos</p>
                    </div>
                  ) : file ? (
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="h-12 w-12 text-green-600" />
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">Haz clic para seleccionar otro archivo</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <p className="text-sm font-medium">Arrastra o haz clic para seleccionar</p>
                      <p className="text-xs text-muted-foreground">Solo archivos PDF (WorkTime, etc.)</p>
                    </div>
                  )}
                </label>
              </div>

              {parseError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{parseError}</div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('select-type')} data-testid="button-back-to-type">
                Atrás
              </Button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900 dark:text-green-100">
                  {parsedShifts.length} turnos detectados
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Tipo: {getShiftTypeLabel(shiftType)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Vista previa (primeros 10 turnos)</Label>
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-3">
                  {parsedShifts.slice(0, 10).map((shift, idx) => (
                    <div key={idx} className="text-sm p-3 rounded-lg bg-muted/50">
                      <div className="font-medium">
                        {format(new Date(shift.dateISO), 'dd/MM/yyyy')}
                      </div>
                      {shift.startISO && shift.endISO && (
                        <div className="text-muted-foreground">
                          {format(new Date(shift.startISO), 'HH:mm')} - {format(new Date(shift.endISO), 'HH:mm')}
                          {shift.breaksMinutes ? ` (${shift.breaksMinutes}min descanso)` : ''}
                        </div>
                      )}
                    </div>
                  ))}
                  {parsedShifts.length > 10 && (
                    <div className="text-xs text-center text-muted-foreground py-2">
                      ... y {parsedShifts.length - 10} turnos más
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset} disabled={isImporting} data-testid="button-cancel-import">
                Cancelar
              </Button>
              <Button onClick={handleImport} disabled={isImporting} data-testid="button-confirm-import">
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Importar {parsedShifts.length} turnos
                  </>
                )}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]" data-testid="dialog-pdf-import">
        <DialogHeader>
          <DialogTitle>Importar turnos desde PDF</DialogTitle>
          <DialogDescription>
            {step === 'select-type' && 'Selecciona el tipo de turnos que vas a importar'}
            {step === 'upload' && 'Sube tu archivo PDF con los turnos'}
            {step === 'preview' && 'Revisa los turnos antes de importar'}
          </DialogDescription>
        </DialogHeader>

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
