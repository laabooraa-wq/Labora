import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { createUserProfile } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Check } from 'lucide-react';
import type { Theme } from '@shared/schema';

export default function Setup() {
  const { user, updateProfile } = useAuth();
  const { setTheme } = useTheme();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    baseRate: '12.50',
    extraRate: '15.00',
    nightRate: '14.00',
    complementaryRate: '',
    nightFrom: '22:00',
    nightTo: '06:00',
    hoursPerWeek: '40',
    workDaysPerWeek: '5',
    theme: 'system' as Theme,
    timezone: 'Europe/Madrid',
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error('No user');

      const profile = await createUserProfile(user.uid, user.email!, {
        email: user.email!,
        currency: 'EUR',
        timezone: formData.timezone,
        theme: formData.theme,
        rates: {
          base: parseFloat(formData.baseRate),
          extra: parseFloat(formData.extraRate),
          night: parseFloat(formData.nightRate),
          complementary: formData.complementaryRate ? parseFloat(formData.complementaryRate) : undefined,
        },
        nightWindow: {
          from: formData.nightFrom,
          to: formData.nightTo,
        },
        contract: {
          hoursPerWeek: parseFloat(formData.hoursPerWeek),
          workDaysPerWeek: parseInt(formData.workDaysPerWeek),
        },
      });

      setTheme(profile.theme);
      updateProfile(profile);

      toast({
        title: 'Perfil creado',
        description: 'Tu configuración se ha guardado correctamente',
      });
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo completar la configuración',
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.baseRate && formData.extraRate && formData.nightRate;
    }
    if (step === 2) {
      return formData.nightFrom && formData.nightTo;
    }
    if (step === 3) {
      return formData.hoursPerWeek && formData.workDaysPerWeek;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Configuración inicial</CardTitle>
          <CardDescription>
            Configura tu perfil para comenzar a gestionar tus turnos
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold ${
                  s < step ? 'bg-primary text-primary-foreground' :
                  s === step ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 4 && <div className={`h-0.5 flex-1 mx-2 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Tarifas */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Tarifas horarias</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseRate">Tarifa base (€/h)</Label>
                    <Input
                      id="baseRate"
                      type="number"
                      step="0.01"
                      value={formData.baseRate}
                      onChange={(e) => setFormData({ ...formData, baseRate: e.target.value })}
                      data-testid="input-base-rate"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extraRate">Tarifa extra (€/h)</Label>
                    <Input
                      id="extraRate"
                      type="number"
                      step="0.01"
                      value={formData.extraRate}
                      onChange={(e) => setFormData({ ...formData, extraRate: e.target.value })}
                      data-testid="input-extra-rate"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nightRate">Tarifa nocturna (€/h)</Label>
                    <Input
                      id="nightRate"
                      type="number"
                      step="0.01"
                      value={formData.nightRate}
                      onChange={(e) => setFormData({ ...formData, nightRate: e.target.value })}
                      data-testid="input-night-rate"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complementaryRate">Tarifa complementaria (€/h, opcional)</Label>
                    <Input
                      id="complementaryRate"
                      type="number"
                      step="0.01"
                      value={formData.complementaryRate}
                      onChange={(e) => setFormData({ ...formData, complementaryRate: e.target.value })}
                      data-testid="input-complementary-rate"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Franja nocturna */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Franja horaria nocturna</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define el horario que se considera nocturnidad. Puede cruzar la medianoche.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nightFrom">Desde</Label>
                    <Input
                      id="nightFrom"
                      type="time"
                      value={formData.nightFrom}
                      onChange={(e) => setFormData({ ...formData, nightFrom: e.target.value })}
                      data-testid="input-night-from"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nightTo">Hasta</Label>
                    <Input
                      id="nightTo"
                      type="time"
                      value={formData.nightTo}
                      onChange={(e) => setFormData({ ...formData, nightTo: e.target.value })}
                      data-testid="input-night-to"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contrato */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Datos del contrato</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hoursPerWeek">Horas semanales</Label>
                    <Input
                      id="hoursPerWeek"
                      type="number"
                      step="0.5"
                      value={formData.hoursPerWeek}
                      onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                      data-testid="input-hours-per-week"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workDaysPerWeek">Días laborables/semana</Label>
                    <Input
                      id="workDaysPerWeek"
                      type="number"
                      value={formData.workDaysPerWeek}
                      onChange={(e) => setFormData({ ...formData, workDaysPerWeek: e.target.value })}
                      data-testid="input-work-days-per-week"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferencias */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Preferencias</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select 
                      value={formData.theme} 
                      onValueChange={(value: Theme) => setFormData({ ...formData, theme: value })}
                    >
                      <SelectTrigger id="theme" data-testid="select-theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona horaria</Label>
                    <Select 
                      value={formData.timezone} 
                      onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                    >
                      <SelectTrigger id="timezone" data-testid="select-timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              data-testid="button-back"
            >
              Atrás
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                data-testid="button-next"
              >
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                data-testid="button-complete"
              >
                {loading ? 'Guardando...' : 'Completar'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
