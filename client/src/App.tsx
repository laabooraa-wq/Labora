import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Welcome from "@/pages/Welcome";
import Setup from "@/pages/Setup";
import Home from "@/pages/Home";
import Shifts from "@/pages/Shifts";
import Settings from "@/pages/Settings";
import AppLayout from "@/components/AppLayout";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Welcome />;
  }

  if (!profile) {
    return <Setup />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shifts" component={Shifts} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AuthenticatedRouter />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
