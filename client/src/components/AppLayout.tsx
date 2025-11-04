import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar, List, Settings as SettingsIcon, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { profile } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />;
    if (theme === 'dark') return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const navItems = [
    { path: '/', label: 'Calendario', icon: Calendar },
    { path: '/shifts', label: 'Turnos', icon: List },
    { path: '/settings', label: 'Ajustes', icon: SettingsIcon },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation - Desktop */}
      <header className="hidden sm:block border-b bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">ChesPay</h1>
              
              <nav className="flex gap-1">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={location === item.path ? 'secondary' : 'ghost'}
                      size="sm"
                      className="gap-2"
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={cycleTheme}
                data-testid="button-theme-toggle"
              >
                {getThemeIcon()}
              </Button>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {profile?.email[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sm:hidden border-b bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-lg font-bold">ChesPay</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            data-testid="button-theme-toggle-mobile"
          >
            {getThemeIcon()}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-16 sm:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="sm:hidden border-t bg-card fixed bottom-0 left-0 right-0 z-40">
        <div className="flex">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className="flex-1">
              <button
                className={`w-full flex flex-col items-center gap-1 py-3 ${
                  location === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
