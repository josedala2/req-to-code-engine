import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Coffee, Home, Users, Package, ClipboardCheck, FileText, BarChart3, LogOut, UserCheck, FileCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import mukafeLogo from "@/assets/mukafe-logo.png";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Produtores", href: "/produtores", icon: Users },
  { name: "Lotes", href: "/lotes", icon: Package },
  { name: "Qualidade", href: "/qualidade", icon: ClipboardCheck },
  { name: "Certificações", href: "/certificacoes", icon: FileText },
  { name: "Auditorias", href: "/auditorias", icon: FileCheck },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={mukafeLogo} alt="Mukafe Logo" className="w-16 h-16 object-contain rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mukafe</h1>
                <p className="text-sm text-muted-foreground">Sistema Nacional de Rastreabilidade do Café</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{user.email}</p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground">Administrador</p>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap",
                    "hover:text-primary hover:bg-muted/50 rounded-t-lg",
                    isActive
                      ? "text-primary bg-background border-b-2 border-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            {isAdmin && (
              <>
                <Link
                  to="/aprovacao-produtores"
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap",
                    "hover:text-primary hover:bg-muted/50 rounded-t-lg",
                    location.pathname === "/aprovacao-produtores"
                      ? "text-primary bg-background border-b-2 border-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <UserCheck className="h-4 w-4" />
                  Aprovações
                </Link>
                <Link
                  to="/configuracoes-usuarios"
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap",
                    "hover:text-primary hover:bg-muted/50 rounded-t-lg",
                    location.pathname === "/configuracoes-usuarios"
                      ? "text-primary bg-background border-b-2 border-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Usuários
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Mukafe - Sistema Nacional de Rastreabilidade do Café. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
