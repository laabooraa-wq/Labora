import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { createShiftsBatch } from '@/lib/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, FileSpreadsheet, Download, CheckCircle, XCircle } from 'lucide-react';
import { parseCSV, parseTXT, parseWorkTimePDF } from '@/lib/import';
import type { InsertShift } from '@shared/schema';

export default function Import() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<InsertShift[]>([]);
  const [importMode, setImportMode] = useState<'none' | 'file-base' | 'file-scaled' | 'file-amount-lock'>('none');

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!profile || preview.length === 0) return;
      await createShiftsBatch(profile.uid, preview);
    },
    onSuccess: () => {
      toast({
        title: 'Importación completada',
        description: `Se han importado ${preview.length} turnos correctamente`,
      });
      setFile(null);
      setPreview([]);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo completar la importación',
      });
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !profile) return;

    setFile(selectedFile);

    try {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      let shifts: InsertShift[] = [];

      if (extension === 'csv') {
        shifts = await parseCSV(selectedFile, profile);
      } else if (extension === 'txt') {
        shifts = await parseTXT(selectedFile, profile);
      } else if (extension === 'pdf') {
        shifts = await parseWorkTimePDF(selectedFile, profile);
      } else {
        throw new Error('Formato de archivo no compatible');
      }

      setPreview(shifts);
      toast({
        title: 'Archivo procesado',
        description: `Se encontraron ${shifts.length} turnos`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al procesar el archivo',
        description: error.message || 'Formato no válido',
      });
      setFile(null);
      setPreview([]);
    }
  };

  const downloadTemplate = () => {
    const csv = `fecha,inicio,fin,descanso,tipo,notas
2025-01-15,09:00,17:00,30,generico,Turno normal
2025-01-16,14:00,22:00,30,complementario,Turno tarde
2025-01-17,22:00,06:00,30,generico,Turno noche (cruza medianoche)
2025-01-18,,,,vacaciones,Día de vacaciones
2025-01-19,,,,descanso,Día de descanso`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_turnos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Importar turnos</h1>
        <p className="text-muted-foreground">
          Importa turnos desde archivos CSV, TXT o PDF de WorkTime
        </p>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar archivo</CardTitle>
          <CardDescription>
            Formatos compatibles: CSV, TXT, PDF (WorkTime)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {file ? (
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">Haz clic para seleccionar archivo</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        o arrastra y suelta aquí
                      </p>
                    </div>
                  )}
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.txt,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-file-upload"
                />
              </Label>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                data-testid="button-download-template"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar plantilla CSV
              </Button>
            </div>
          </div>

          {/* Import Mode */}
          {preview.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="importMode">Modo de importación</Label>
              <Select value={importMode} onValueChange={(v: any) => setImportMode(v)}>
                <SelectTrigger id="importMode" data-testid="select-import-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Calcular según configuración</SelectItem>
                  <SelectItem value="file-base">Usar tarifa del archivo como base</SelectItem>
                  <SelectItem value="file-scaled">Escalar proporcionalmente</SelectItem>
                  <SelectItem value="file-amount-lock">Bloquear importe exacto</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Cómo manejar las tarifas del archivo importado vs. tu configuración actual
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vista previa</CardTitle>
                <CardDescription>
                  {preview.length} turnos listos para importar
                </CardDescription>
              </div>
              <Button
                onClick={() => importMutation.mutate()}
                disabled={importMutation.isPending}
                data-testid="button-confirm-import"
              >
                {importMutation.isPending ? 'Importando...' : 'Confirmar importación'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {preview.map((shift, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-md bg-muted"
                  data-testid={`preview-shift-${idx}`}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{shift.dateISO}</p>
                    <p className="text-sm text-muted-foreground">
                      {shift.kind === 'normal' 
                        ? `${shift.startISO} - ${shift.endISO}` 
                        : shift.kind}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Formatos de archivo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="csv" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="txt">TXT</TabsTrigger>
              <TabsTrigger value="pdf">PDF (WorkTime)</TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="space-y-3 mt-4">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Formato CSV</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Archivo de valores separados por comas. Las columnas deben ser: fecha, inicio, fin, descanso, tipo, notas
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                    <li>Fecha en formato YYYY-MM-DD</li>
                    <li>Horas en formato HH:MM (24h)</li>
                    <li>Descanso en minutos</li>
                    <li>Tipo: generico, complementario, adquirido, vacaciones, descanso, compensatoria, baja</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="txt" className="space-y-3 mt-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Formato TXT</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Archivo de texto plano con turnos en formato libre. Cada línea debe contener un turno.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ejemplo: "15/01/2025 09:00-17:00 (30min descanso)"
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-3 mt-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">PDF de WorkTime</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Exportación PDF del sistema WorkTime. Se extraerán automáticamente los turnos, fechas y horarios.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
