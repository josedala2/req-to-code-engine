import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Coffee, Home, Users, Package, ClipboardCheck, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Produtores", href: "/produtores", icon: Users },
  { name: "Lotes", href: "/lotes", icon: Package },
  { name: "Qualidade", href: "/qualidade", icon: ClipboardCheck },
  { name: "Certificações", href: "/certificacoes", icon: FileText },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-coffee p-2.5 rounded-xl shadow-glow">
              <Coffee className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">CaféTrace</h1>
              <p className="text-sm text-muted-foreground">Sistema de Rastreabilidade e Qualidade</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
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
            © 2025 CaféTrace - Sistema de Rastreabilidade e Qualidade do Café
          </p>
        </div>
      </footer>
    </div>
  );
}
