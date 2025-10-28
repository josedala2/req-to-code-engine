import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ClipboardCheck, TrendingUp, Coffee, Award, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const stats = [
  {
    name: "Total de Lotes",
    value: "248",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Produtores Ativos",
    value: "67",
    change: "+5%",
    trend: "up",
    icon: Users,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    name: "Análises de Qualidade",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: ClipboardCheck,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    name: "Certificações Ativas",
    value: "34",
    change: "+2",
    trend: "up",
    icon: Award,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const recentBatches = [
  {
    id: "LOT-2025-001",
    producer: "Fazenda Santa Clara",
    variety: "Bourbon Amarelo",
    quantity: "1.200 kg",
    quality: "Especial",
    status: "Em processamento",
  },
  {
    id: "LOT-2025-002",
    producer: "Quinta Bela Vista",
    variety: "Catuaí Vermelho",
    quantity: "850 kg",
    quality: "Gourmet",
    status: "Pronto",
  },
  {
    id: "LOT-2024-458",
    producer: "Fazenda São José",
    variety: "Mundo Novo",
    quantity: "2.100 kg",
    quality: "Premium",
    status: "Exportado",
  },
];

export default function Dashboard() {
  const { data: produtores } = useQuery({
    queryKey: ['produtores-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produtores')
        .select('provincia, status')
        .eq('status', 'aprovado');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: lotes } = useQuery({
    queryKey: ['lotes-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lotes')
        .select('status')
        .eq('status', 'ativo');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: qualidade } = useQuery({
    queryKey: ['qualidade-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qualidade')
        .select('id');
      
      if (error) throw error;
      return data;
    },
  });

  // Count producers by province
  const producersByProvince = produtores?.reduce((acc, producer) => {
    const province = producer.provincia || 'Outros';
    acc[province] = (acc[province] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number }) || {};

  return (
    <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do sistema de rastreabilidade</p>
        </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Lotes
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{lotes?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Lotes ativos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtores Activos
            </CardTitle>
            <div className="p-2 rounded-lg bg-secondary/10">
              <Users className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{produtores?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Produtores aprovados</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Análises de Qualidade
            </CardTitle>
            <div className="p-2 rounded-lg bg-accent/10">
              <ClipboardCheck className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{qualidade?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Análises realizadas</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Províncias Activas
            </CardTitle>
            <div className="p-2 rounded-lg bg-success/10">
              <Award className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {Object.keys(producersByProvince).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Com produtores cadastrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Distribuição Geográfica de Produtores</CardTitle>
              <CardDescription>Produtores activos por província</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {Object.keys(producersByProvince).length} Províncias
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(producersByProvince)
              .sort((a, b) => b[1] - a[1])
              .map(([province, count]) => (
                <Card 
                  key={province} 
                  className="relative overflow-hidden hover:shadow-lg transition-all border-2 hover:border-primary/50"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{province}</h3>
                        <p className="text-xs text-muted-foreground">Produtores registados</p>
                      </div>
                      <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                        {count}
                      </Badge>
                    </div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-coffee transition-all"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(producersByProvince))) * 100}%` 
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {Object.keys(producersByProvince).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum produtor registado ainda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Batches */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            <CardTitle>Lotes Recentes</CardTitle>
          </div>
          <CardDescription>Últimos lotes cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBatches.map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-bold text-primary">{batch.id}</span>
                    <Badge variant="secondary">{batch.variety}</Badge>
                    <Badge className="bg-gradient-coffee text-primary-foreground">{batch.quality}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{batch.producer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{batch.quantity}</p>
                  <p className="text-sm text-muted-foreground">{batch.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Distribuição de Qualidade</CardTitle>
            <CardDescription>Classificação dos lotes por qualidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Premium</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-coffee" style={{ width: "45%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gourmet</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: "35%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Especial</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: "20%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">20%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Status dos Lotes</CardTitle>
            <CardDescription>Situação atual do processamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em processamento</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: "40%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">99</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pronto</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: "35%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">87</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Exportado</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "25%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">62</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <CardTitle>Acções Rápidas</CardTitle>
          </div>
          <CardDescription>Acesso rápido às funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/lotes">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Gerenciar Lotes</p>
                    <p className="text-sm text-muted-foreground">Cadastro e rastreio</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/qualidade">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <ClipboardCheck className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Análise de Qualidade</p>
                    <p className="text-sm text-muted-foreground">Testes e avaliações</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/auditorias">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-success/10">
                    <FileCheck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">Auditorias</p>
                    <p className="text-sm text-muted-foreground">Relatórios de auditoria</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
