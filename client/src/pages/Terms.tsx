import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">ChesPay</h1>
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
            <h1 className="text-4xl font-bold tracking-tight">Términos y Condiciones de Uso</h1>
            <p className="text-muted-foreground">Última actualización: 3 de noviembre de 2025</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Aceptación de los términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al acceder y utilizar ChesPay ("la Aplicación", "el Servicio"), usted acepta estar sujeto a 
              estos Términos y Condiciones de Uso. Si no está de acuerdo con alguno de estos términos, 
              no debe utilizar la Aplicación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Descripción del servicio</h2>
            <p className="text-muted-foreground leading-relaxed">
              ChesPay es una aplicación web gratuita que permite a los usuarios gestionar sus turnos laborales 
              y calcular automáticamente sus ingresos basándose en tarifas personalizables. El servicio incluye:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Calendario mensual de turnos</li>
              <li>Cálculo automático de horas normales, nocturnas, extras y complementarias</li>
              <li>Importación y exportación de datos en formatos CSV, TXT y PDF</li>
              <li>Almacenamiento seguro en la nube mediante Firebase</li>
              <li>Configuración personalizada de tarifas y contratos laborales</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Requisitos de uso</h2>
            <h3 className="text-xl font-semibold">3.1 Cuenta de usuario</h3>
            <p className="text-muted-foreground leading-relaxed">
              Para utilizar ChesPay, debe:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Tener al menos 16 años de edad</li>
              <li>Crear una cuenta mediante autenticación con Google</li>
              <li>Proporcionar información precisa y completa</li>
              <li>Mantener la seguridad de su cuenta</li>
              <li>Notificarnos inmediatamente de cualquier uso no autorizado</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">3.2 Uso aceptable</h3>
            <p className="text-muted-foreground leading-relaxed">
              Usted se compromete a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Utilizar la Aplicación solo para fines legales y personales</li>
              <li>No compartir su cuenta con terceros</li>
              <li>No intentar acceder a cuentas de otros usuarios</li>
              <li>No realizar ingeniería inversa, descompilar o modificar la Aplicación</li>
              <li>No utilizar la Aplicación de manera que pueda dañar, deshabilitar o sobrecargar nuestros servidores</li>
              <li>No introducir virus, malware o código malicioso</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Propiedad intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todos los derechos de propiedad intelectual relacionados con ChesPay, incluyendo pero no 
              limitándose a código fuente, diseño, logotipos, marcas comerciales y contenido, son propiedad exclusiva 
              de ChesPay o de sus licenciantes. No se concede ningún derecho de propiedad intelectual 
              excepto el derecho limitado de uso descrito en estos términos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Datos del usuario</h2>
            <p className="text-muted-foreground leading-relaxed">
              Usted conserva todos los derechos sobre los datos que introduce en ChesPay (turnos, tarifas, etc.). 
              Nos concede una licencia limitada para procesar, almacenar y mostrar estos datos con el único propósito 
              de proporcionar el servicio. Para más información, consulte nuestra{" "}
              <Link href="/privacy" className="text-primary hover:underline">Política de Privacidad</Link>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Exactitud de los cálculos</h2>
            <p className="text-muted-foreground leading-relaxed">
              ChesPay calcula automáticamente los ingresos basándose en los datos que usted proporciona 
              (turnos, tarifas, horas). Si bien nos esforzamos por proporcionar cálculos precisos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Usted es responsable de verificar la exactitud de todos los datos introducidos</li>
              <li>Usted es responsable de verificar que los cálculos sean correctos</li>
              <li>ChesPay es una herramienta de apoyo y no sustituye la nómina oficial de su empleador</li>
              <li>No nos hacemos responsables de discrepancias en los cálculos debidas a datos incorrectos</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Le recomendamos contrastar siempre los cálculos con su nómina oficial.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Disponibilidad del servicio</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hacemos todo lo posible para mantener ChesPay disponible 24/7, pero no garantizamos:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Que el servicio estará disponible de forma ininterrumpida</li>
              <li>Que el servicio estará libre de errores</li>
              <li>Que los servidores estarán libres de virus o componentes dañinos</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nos reservamos el derecho de suspender temporalmente el servicio para mantenimiento, actualizaciones 
              o por razones técnicas, con o sin previo aviso.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Publicidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              ChesPay es un servicio gratuito financiado mediante anuncios de Google AdSense. 
              Al utilizar la Aplicación, acepta que se muestren anuncios. Estos anuncios pueden ser personalizados 
              según sus intereses. Puede gestionar sus preferencias de anuncios mediante 
              <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> la configuración de Google</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Limitación de responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              En la máxima medida permitida por la ley:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>ChesPay se proporciona "tal cual" y "según disponibilidad"</li>
              <li>No garantizamos que el servicio cumplirá con sus requisitos específicos</li>
              <li>No seremos responsables de ningún daño directo, indirecto, incidental, especial o consecuente</li>
              <li>No seremos responsables de pérdidas de datos, pérdidas de ingresos o pérdidas económicas</li>
              <li>Nuestra responsabilidad total no excederá 100 euros</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Terminación</h2>
            <p className="text-muted-foreground leading-relaxed">
              Usted puede dejar de usar ChesPay y eliminar su cuenta en cualquier momento desde la 
              página de Configuración. Nos reservamos el derecho de suspender o cancelar su cuenta si:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Viola estos Términos y Condiciones</li>
              <li>Utiliza el servicio de forma fraudulenta o ilegal</li>
              <li>Su cuenta permanece inactiva durante más de 2 años</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Al terminar su cuenta, se eliminarán permanentemente todos sus datos en un plazo de 30 días.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Modificaciones de los términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. 
              Le notificaremos de cambios significativos mediante un aviso en la Aplicación o por correo electrónico. 
              El uso continuado de ChesPay después de dichos cambios constituye su aceptación de los 
              nuevos términos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Ley aplicable y jurisdicción</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estos Términos y Condiciones se rigen por las leyes de España. Cualquier disputa relacionada con 
              estos términos se resolverá en los tribunales de España.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">13. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 ml-4">
              <li>Email: <a href="mailto:legal@chespay.com" className="text-primary hover:underline">legal@chespay.com</a></li>
              <li>Página de contacto: <Link href="/contact"><a className="text-primary hover:underline">chespay.com/contact</a></Link></li>
            </ul>
          </section>

          <section className="bg-muted/50 rounded-lg p-6 mt-8">
            <p className="text-sm text-muted-foreground">
              Al utilizar ChesPay, usted reconoce haber leído, entendido y aceptado estos Términos y Condiciones 
              en su totalidad.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 ChesPay. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="/about">
                <a className="hover-elevate rounded px-2 py-1">Acerca de</a>
              </Link>
              <Link href="/privacy">
                <a className="hover-elevate rounded px-2 py-1">Privacidad</a>
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
