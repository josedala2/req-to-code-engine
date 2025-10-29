import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Building2, FileCheck, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function Aprovacoes() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [counts, setCounts] = useState({
    produtores: 0,
    empresas: 0,
    pedidos: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    const fetchCounts = async () => {
      // Contar produtores pendentes
      const { count: produtoresCount } = await supabase
        .from("produtores")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");

      // Contar empresas pendentes
      const { count: empresasCount } = await supabase
        .from("empresas")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");

      // Contar pedidos pendentes
      const { count: pedidosCount } = await supabase
        .from("pedidos_certificacao")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");

      setCounts({
        produtores: produtoresCount || 0,
        empresas: empresasCount || 0,
        pedidos: pedidosCount || 0
      });
    };

    if (isAdmin) {
      fetchCounts();
    }
  }, [isAdmin]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const approvalModules = [
    {
      title: "Produtores",
      description: "Aprovar ou rejeitar cadastros de produtores pendentes",
      icon: UserCheck,
      count: counts.produtores,
      href: "/aprovacao-produtores",
      color: "text-blue-600"
    },
    {
      title: "Empresas",
      description: "Aprovar ou rejeitar cadastros de empresas pendentes",
      icon: Building2,
      count: counts.empresas,
      href: "/aprovacao-empresas",
      color: "text-green-600"
    },
    {
      title: "Pedidos de Certificação",
      description: "Aprovar pedidos de certificação de lotes",
      icon: FileCheck,
      count: counts.pedidos,
      href: "/aprovacao-pedidos",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Central de Aprovações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie todas as aprovações pendentes do sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {approvalModules.map((module) => (
          <Card 
            key={module.title}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate(module.href)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-muted ${module.color}`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                </div>
                {module.count > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {module.count}
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="w-full justify-between group-hover:bg-muted"
              >
                Acessar módulo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Produtores pendentes precisam ser aprovados antes de poderem criar lotes</p>
          <p>• Empresas pendentes precisam ser aprovadas antes de solicitar certificações</p>
          <p>• Pedidos de certificação aprovados geram certificados e selos automaticamente</p>
        </CardContent>
      </Card>
    </div>
  );
}
