import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import heroImage from '@assets/generated_images/Schedule_management_hero_illustration_67fbb69c.png';
import { Calendar, Euro, Clock } from 'lucide-react';

export default function Welcome() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold">Schedule Paysheet</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  Schedule Paysheet
                </h2>
                <p className="text-xl text-muted-foreground">
                  Gestiona tus turnos laborales y pagos al completo de una forma sencilla.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Calendario mensual</h3>
                    <p className="text-sm text-muted-foreground">
                      Visualiza todos tus turnos con vistas personalizables
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Cálculo automático</h3>
                    <p className="text-sm text-muted-foreground">
                      Horas nocturnas, extras y complementarias calculadas automáticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Euro className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Gestión de pagos</h3>
                    <p className="text-sm text-muted-foreground">
                      Control total de tus ingresos con tarifas personalizadas
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={signInWithGoogle}
                  data-testid="button-sign-in"
                  className="text-base"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Iniciar sesión con Google
                </Button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="hidden lg:block">
              <img 
                src={heroImage} 
                alt="Schedule management illustration" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Schedule Paysheet. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="/about" className="hover-elevate rounded px-2 py-1">Acerca de</a>
              <a href="/privacy" className="hover-elevate rounded px-2 py-1">Privacidad</a>
              <a href="/terms" className="hover-elevate rounded px-2 py-1">Términos</a>
              <a href="/contact" className="hover-elevate rounded px-2 py-1">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
