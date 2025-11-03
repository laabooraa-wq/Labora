import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Euro, Clock, Shield, Users, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Schedule Paysheet</h1>
          <Link href="/">
            <Button variant="ghost" data-testid="button-home">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Acerca de Schedule Paysheet</h1>
            <p className="text-xl text-muted-foreground">
              La herramienta que simplifica la gestión de turnos y el cálculo de nóminas para trabajadores.
            </p>
          </div>

          {/* Mission */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Nuestra misión</h2>
            <p className="text-muted-foreground leading-relaxed">
              Schedule Paysheet nace de la necesidad de proporcionar a los trabajadores una forma sencilla y efectiva 
              de gestionar sus turnos laborales y calcular sus ingresos. Entendemos que llevar un control manual de 
              las horas trabajadas, turnos nocturnos, horas extras y complementarias puede ser complejo y propenso a errores.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nuestra misión es empoderar a los trabajadores con una herramienta profesional que automatiza estos cálculos, 
              ahorra tiempo y proporciona transparencia total sobre sus ingresos.
            </p>
          </section>

          {/* Features Cards */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">¿Qué ofrecemos?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Gestión de turnos
                  </CardTitle>
                  <CardDescription>
                    Calendario mensual intuitivo con vistas personalizables para visualizar todos tus turnos de trabajo.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Cálculos automáticos
                  </CardTitle>
                  <CardDescription>
                    Cálculo automático de horas nocturnas, extras, complementarias y descansos con precisión al minuto.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-primary" />
                    Control de ingresos
                  </CardTitle>
                  <CardDescription>
                    Tarifas personalizables por tipo de turno para calcular tus ingresos totales de forma precisa.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Importación rápida
                  </CardTitle>
                  <CardDescription>
                    Importa turnos desde archivos CSV, TXT o PDF de forma masiva para ahorrar tiempo.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Privacidad garantizada
                  </CardTitle>
                  <CardDescription>
                    Tus datos están protegidos con Firebase Auth y almacenados de forma segura en Firestore.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Soporte multizona
                  </CardTitle>
                  <CardDescription>
                    Compatible con múltiples zonas horarias y formato de fecha español (es-ES).
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Technology */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Tecnología</h2>
            <p className="text-muted-foreground leading-relaxed">
              Schedule Paysheet está desarrollado con tecnologías web modernas que garantizan rapidez, seguridad y 
              facilidad de uso. Utilizamos React para una interfaz de usuario fluida, Firebase para autenticación 
              segura con Google y almacenamiento en la nube, y algoritmos de cálculo precisos que consideran cada 
              minuto trabajado según el tipo de turno.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              La aplicación funciona completamente en tu navegador, lo que significa que puedes acceder a ella desde 
              cualquier dispositivo con conexión a internet, sin necesidad de instalar ningún software.
            </p>
          </section>

          {/* Contact CTA */}
          <section className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">¿Tienes preguntas o sugerencias?</h2>
            <p className="text-muted-foreground">
              Nos encantaría escucharte. Tu feedback nos ayuda a mejorar Schedule Paysheet.
            </p>
            <Link href="/contact">
              <Button size="lg" data-testid="button-contact">
                Contáctanos
              </Button>
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Schedule Paysheet. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="/privacy">
                <a className="hover-elevate rounded px-2 py-1">Privacidad</a>
              </Link>
              <Link href="/terms">
                <a className="hover-elevate rounded px-2 py-1">Términos</a>
              </Link>
              <Link href="/contact">
                <a className="hover-elevate rounded px-2 py-1">Contacto</a>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
