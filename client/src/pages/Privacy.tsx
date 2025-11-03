import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Privacy() {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Política de Privacidad</h1>
            <p className="text-muted-foreground">Última actualización: 3 de noviembre de 2025</p>
          </div>

          <section className="space-y-4 prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold">1. Introducción</h2>
            <p className="text-muted-foreground leading-relaxed">
              En Schedule Paysheet, respetamos su privacidad y nos comprometemos a proteger sus datos personales. 
              Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos su información 
              cuando utiliza nuestra aplicación web de gestión de turnos y cálculo de nóminas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Información que recopilamos</h2>
            <h3 className="text-xl font-semibold">2.1 Información de autenticación</h3>
            <p className="text-muted-foreground leading-relaxed">
              Cuando inicia sesión con Google, recopilamos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Foto de perfil de Google</li>
              <li>Identificador único de usuario (UID) proporcionado por Firebase Auth</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">2.2 Información de turnos laborales</h3>
            <p className="text-muted-foreground leading-relaxed">
              Los datos que usted introduce voluntariamente en la aplicación:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Fechas y horarios de turnos de trabajo</li>
              <li>Tipos de turno (general, complementario, nocturno, extra)</li>
              <li>Tiempos de descanso</li>
              <li>Tarifas horarias personalizadas</li>
              <li>Configuraciones de contrato laboral (horas semanales, zona horaria)</li>
              <li>Días especiales (vacaciones, bajas por enfermedad)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">2.3 Datos técnicos</h3>
            <p className="text-muted-foreground leading-relaxed">
              Recopilamos automáticamente cierta información técnica:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Dirección IP</li>
              <li>Tipo de navegador y versión</li>
              <li>Sistema operativo</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Zona horaria configurada</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Cómo utilizamos su información</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos su información para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Proporcionar y mantener el servicio de Schedule Paysheet</li>
              <li>Autenticar su identidad y gestionar su cuenta</li>
              <li>Calcular automáticamente sus ingresos según los turnos registrados</li>
              <li>Almacenar y sincronizar sus datos de turnos en la nube</li>
              <li>Mejorar y optimizar la funcionalidad de la aplicación</li>
              <li>Enviar notificaciones importantes sobre el servicio (si las autoriza)</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Almacenamiento y seguridad de datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sus datos se almacenan de forma segura utilizando Firebase Firestore, una base de datos en la nube 
              proporcionada por Google. Firebase implementa medidas de seguridad de nivel empresarial, incluyendo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Cifrado de datos en tránsito (HTTPS/TLS)</li>
              <li>Cifrado de datos en reposo</li>
              <li>Autenticación mediante Firebase Auth con OAuth 2.0</li>
              <li>Reglas de seguridad que restringen el acceso solo a datos propios del usuario autenticado</li>
              <li>Copias de seguridad automáticas</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Los datos se almacenan en servidores ubicados en la Unión Europea para cumplir con el RGPD.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Compartir información con terceros</h2>
            <p className="text-muted-foreground leading-relaxed">
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en los siguientes casos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Google Firebase:</strong> Para autenticación y almacenamiento de datos (consulte la 
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> Política de Privacidad de Google</a>)</li>
              <li><strong>Google AdSense:</strong> Para mostrar anuncios personalizados (puede desactivarlos mediante 
                <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> configuración de anuncios de Google</a>)</li>
              <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o para proteger nuestros derechos legales</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Cookies y tecnologías similares</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Mantener su sesión activa (autenticación)</li>
              <li>Recordar sus preferencias (tema oscuro/claro, zona horaria)</li>
              <li>Analizar el uso de la aplicación</li>
              <li>Mostrar anuncios relevantes mediante Google AdSense</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Puede configurar su navegador para rechazar cookies, aunque esto puede limitar la funcionalidad de la aplicación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Sus derechos (RGPD)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bajo el Reglamento General de Protección de Datos (RGPD), tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos ("derecho al olvido")</li>
              <li><strong>Portabilidad:</strong> Exportar sus datos en formato CSV o TXT</li>
              <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
              <li><strong>Limitación:</strong> Solicitar la limitación del procesamiento</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Para ejercer cualquiera de estos derechos, contacte con nosotros en: 
              <a href="mailto:privacy@schedulepaysheet.com" className="text-primary hover:underline"> privacy@schedulepaysheet.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Retención de datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conservamos sus datos personales mientras mantenga una cuenta activa en Schedule Paysheet. 
              Si elimina su cuenta, sus datos se eliminarán permanentemente de nuestros servidores en un plazo de 30 días, 
              excepto cuando la ley nos obligue a conservarlos por un período más largo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Menores de edad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Schedule Paysheet no está dirigido a menores de 16 años. No recopilamos intencionalmente información 
              personal de menores. Si tiene conocimiento de que un menor ha proporcionado datos personales, 
              contacte con nosotros inmediatamente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Cambios en esta política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. 
              Le notificaremos de cambios significativos mediante un aviso destacado en la aplicación o por correo electrónico. 
              La fecha de "Última actualización" al inicio de este documento indica cuándo se revisó por última vez.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos sus datos personales, 
              puede contactarnos en:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 ml-4">
              <li>Email: <a href="mailto:privacy@schedulepaysheet.com" className="text-primary hover:underline">privacy@schedulepaysheet.com</a></li>
              <li>Página de contacto: <Link href="/contact"><a className="text-primary hover:underline">schedulepaysheet.com/contact</a></Link></li>
            </ul>
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
