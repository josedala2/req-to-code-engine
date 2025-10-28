import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ClipboardCheck, TrendingUp, Coffee, Award, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do sistema de rastreabilidade</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-elegant hover:shadow-glow transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-success border-success/50">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground">vs. último mês</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
            <CardTitle>Ações Rápidas</CardTitle>
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
