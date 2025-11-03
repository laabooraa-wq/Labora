import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';

export default function Contact() {
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
            <h1 className="text-4xl font-bold tracking-tight">Contacto</h1>
            <p className="text-xl text-muted-foreground">
              Estamos aquí para ayudarte. Contacta con nosotros para cualquier consulta o sugerencia.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  Envíanos un correo electrónico
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <a 
                  href="mailto:support@schedulepaysheet.com" 
                  className="text-primary hover:underline"
                  data-testid="link-email"
                >
                  support@schedulepaysheet.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>
                  Comparte tus ideas y sugerencias
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <a 
                  href="mailto:feedback@schedulepaysheet.com" 
                  className="text-primary hover:underline"
                  data-testid="link-feedback"
                >
                  feedback@schedulepaysheet.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Soporte técnico</CardTitle>
                <CardDescription>
                  ¿Necesitas ayuda con la aplicación?
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <a 
                  href="mailto:help@schedulepaysheet.com" 
                  className="text-primary hover:underline"
                  data-testid="link-support"
                >
                  help@schedulepaysheet.com
                </a>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cómo funciona el cálculo automático de turnos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Schedule Paysheet analiza cada turno minuto a minuto, aplicando las tarifas correspondientes 
                  según el tipo de turno (nocturno, extra, complementario) y calculando automáticamente los descansos. 
                  Puedes personalizar las tarifas en la página de Configuración.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Mis datos están seguros?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sí. Utilizamos Firebase Auth para autenticación segura con Google y Firestore para almacenar 
                  tus datos de forma cifrada en la nube. Solo tú tienes acceso a tu información mediante tu 
                  cuenta de Google. Lee nuestra <Link href="/privacy"><a className="text-primary hover:underline">Política de Privacidad</a></Link> para más detalles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Puedo importar turnos desde otro sistema?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sí. Schedule Paysheet soporta importación de turnos desde archivos CSV, TXT y PDF. 
                  Si usas la aplicación WorkTime, puedes importar directamente tus turnos desde el PDF exportado.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Es gratis?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sí, Schedule Paysheet es completamente gratuito. La aplicación se mantiene mediante anuncios 
                  no intrusivos que ayudan a cubrir los costos de desarrollo y mantenimiento.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Response Time */}
          <section className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">Tiempo de respuesta</h2>
            <p className="text-muted-foreground">
              Nos esforzamos por responder todas las consultas en un plazo de 24-48 horas laborables. 
              Para consultas urgentes, por favor indícalo en el asunto del correo electrónico.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Schedule Paysheet. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="/about">
                <a className="hover-elevate rounded px-2 py-1">Acerca de</a>
              </Link>
              <Link href="/privacy">
                <a className="hover-elevate rounded px-2 py-1">Privacidad</a>
              </Link>
              <Link href="/terms">
                <a className="hover-elevate rounded px-2 py-1">Términos</a>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
