import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { updateUserProfile, recalculateAllShifts } from '@/lib/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Save, RefreshCw } from 'lucide-react';
import type { Theme } from '@shared/schema';
import AdSense from '@/components/AdSense';

export default function Settings() {
  const { profile, signOut, updateProfile: updateAuthProfile } = useAuth();
  const { setTheme } = useTheme();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    baseRate: profile?.rates.base.toString() || '',
    extraRate: profile?.rates.extra.toString() || '',
    nightRate: profile?.rates.night.toString() || '',
    complementaryRate: profile?.rates.complementary?.toString() || '',
    nightFrom: profile?.nightWindow.from || '',
    nightTo: profile?.nightWindow.to || '',
    hoursPerWeek: profile?.contract.hoursPerWeek.toString() || '',
    workDaysPerWeek: profile?.contract.workDaysPerWeek.toString() || '',
    theme: profile?.theme || 'system',
    timezone: profile?.timezone || 'Europe/Madrid',
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!profile) return;

      const updates = {
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
        theme: formData.theme as Theme,
        timezone: formData.timezone,
      };

      await updateUserProfile(profile.uid, updates);
      
      // Update local profile
      updateAuthProfile({ ...profile, ...updates });
      setTheme(updates.theme);
    },
    onSuccess: () => {
      toast({
        title: 'Configuración guardada',
        description: 'Tus preferencias se han actualizado correctamente',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar la configuración',
      });
    },
  });

  const recalculateMutation = useMutation({
    mutationFn: async () => {
      if (!profile) return;
      await recalculateAllShifts(profile.uid);
    },
    onSuccess: () => {
      toast({
        title: 'Recalculación completa',
        description: 'Todos los turnos se han recalculado con las nuevas tarifas',
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate();
  };

  const handleRecalculate = () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres recalcular todos los turnos? Esto actualizará todos los pagos según las tarifas actuales.'
    );
    if (confirmed) {
      recalculateMutation.mutate();
    }
  };

  const handleSignOut = async () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmed) {
      await signOut();
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Gestiona tus preferencias y tarifas</p>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          data-testid="button-sign-out"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Cuenta</CardTitle>
          <CardDescription>Información de tu cuenta de Google</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-base">{profile.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tariffs */}
      <Card>
        <CardHeader>
          <CardTitle>Tarifas horarias</CardTitle>
          <CardDescription>
            Configura tus tarifas por hora en euros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseRate">Tarifa base (€/h)</Label>
              <Input
                id="baseRate"
                type="number"
                step="0.01"
                value={formData.baseRate}
                onChange={(e) => setFormData({ ...formData, baseRate: e.target.value })}
                data-testid="input-settings-base-rate"
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
                data-testid="input-settings-extra-rate"
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
                data-testid="input-settings-night-rate"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complementaryRate">Tarifa complementaria (€/h)</Label>
              <Input
                id="complementaryRate"
                type="number"
                step="0.01"
                value={formData.complementaryRate}
                onChange={(e) => setFormData({ ...formData, complementaryRate: e.target.value })}
                placeholder="Opcional, usa base por defecto"
                data-testid="input-settings-comp-rate"
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleRecalculate}
            disabled={recalculateMutation.isPending}
            data-testid="button-recalculate"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${recalculateMutation.isPending ? 'animate-spin' : ''}`} />
            Recalcular todos los turnos
          </Button>
        </CardContent>
      </Card>

      {/* Night Window */}
      <Card>
        <CardHeader>
          <CardTitle>Franja horaria nocturna</CardTitle>
          <CardDescription>
            Define el horario que se considera nocturnidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nightFrom">Desde</Label>
              <Input
                id="nightFrom"
                type="time"
                value={formData.nightFrom}
                onChange={(e) => setFormData({ ...formData, nightFrom: e.target.value })}
                data-testid="input-settings-night-from"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nightTo">Hasta</Label>
              <Input
                id="nightTo"
                type="time"
                value={formData.nightTo}
                onChange={(e) => setFormData({ ...formData, nightTo: e.target.value })}
                data-testid="input-settings-night-to"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del contrato</CardTitle>
          <CardDescription>
            Información para calcular vacaciones y compensatorias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hoursPerWeek">Horas semanales</Label>
              <Input
                id="hoursPerWeek"
                type="number"
                step="0.5"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                data-testid="input-settings-hours-week"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workDaysPerWeek">Días laborables/semana</Label>
              <Input
                id="workDaysPerWeek"
                type="number"
                value={formData.workDaysPerWeek}
                onChange={(e) => setFormData({ ...formData, workDaysPerWeek: e.target.value })}
                data-testid="input-settings-work-days"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google AdSense Banner */}
      <div className="my-6">
        <AdSense
          adSlot="9312486065"
          adFormat="horizontal"
          style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
        />
      </div>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>Personaliza tu experiencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select 
              value={formData.theme} 
              onValueChange={(value: Theme) => setFormData({ ...formData, theme: value })}
            >
              <SelectTrigger id="theme" data-testid="select-settings-theme">
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
              <SelectTrigger id="timezone" data-testid="select-settings-timezone">
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
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          data-testid="button-save-settings"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  );
}
