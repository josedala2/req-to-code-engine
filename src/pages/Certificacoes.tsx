import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Award, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

const certifications = [
  {
    id: 1,
    name: "Certificação Orgânica",
    organization: "IBD - Instituto Biodinâmico",
    producer: "Fazenda Santa Clara",
    issueDate: "15/03/2024",
    expiryDate: "15/03/2025",
    status: "Ativa",
    scope: "Produção de café orgânico certificado",
    number: "BR-ORG-001-2024",
  },
  {
    id: 2,
    name: "Fair Trade",
    organization: "FLO-CERT",
    producer: "Fazenda Santa Clara",
    issueDate: "10/01/2024",
    expiryDate: "10/01/2026",
    status: "Ativa",
    scope: "Comércio justo e sustentável",
    number: "FT-BR-12345",
  },
  {
    id: 3,
    name: "UTZ Certified",
    organization: "UTZ",
    producer: "Sítio Bela Vista",
    issueDate: "20/06/2024",
    expiryDate: "20/06/2025",
    status: "Ativa",
    scope: "Práticas agrícolas sustentáveis",
    number: "UTZ-2024-6789",
  },
  {
    id: 4,
    name: "Rainforest Alliance",
    organization: "Rainforest Alliance",
    producer: "Sítio Bela Vista",
    issueDate: "05/02/2024",
    expiryDate: "05/02/2025",
    status: "Renovação Pendente",
    scope: "Conservação ambiental e social",
    number: "RA-BR-2024-001",
  },
  {
    id: 5,
    name: "4C Association",
    organization: "4C Services GmbH",
    producer: "Fazenda São José",
    issueDate: "12/09/2024",
    expiryDate: "12/09/2027",
    status: "Ativa",
    scope: "Código de conduta para café sustentável",
    number: "4C-BR-54321",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Ativa":
      return {
        color: "bg-success/10 text-success border-success/20",
        icon: CheckCircle2,
      };
    case "Renovação Pendente":
      return {
        color: "bg-warning/10 text-warning border-warning/20",
        icon: AlertCircle,
      };
    default:
      return {
        color: "bg-muted text-muted-foreground border-border",
        icon: Award,
      };
  }
};

export default function Certificacoes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Certificações</h2>
          <p className="text-muted-foreground">Gestão de certificações e conformidades</p>
        </div>
        <Button className="bg-gradient-coffee hover:opacity-90 shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Certificação
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Certificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Award className="h-10 w-10 text-primary" />
              <span className="text-4xl font-bold text-foreground">34</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Em todos os produtores</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-10 w-10 text-success" />
              <span className="text-4xl font-bold text-success">31</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">91% do total</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Renovação Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-10 w-10 text-warning" />
              <span className="text-4xl font-bold text-warning">3</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Requer atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.map((cert) => {
          const statusConfig = getStatusConfig(cert.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card key={cert.id} className="shadow-elegant hover:shadow-glow transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">{cert.name}</CardTitle>
                      <Badge variant="outline" className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {cert.status}
                      </Badge>
                    </div>
                    <CardDescription>{cert.organization}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Produtor</p>
                    <p className="font-medium text-foreground">{cert.producer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Número</p>
                    <p className="font-mono font-medium text-foreground">{cert.number}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Emissão
                    </div>
                    <p className="font-medium text-foreground">{cert.issueDate}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Validade
                    </div>
                    <p className="font-medium text-foreground">{cert.expiryDate}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-1">Escopo:</p>
                  <p className="text-sm text-muted-foreground">{cert.scope}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Ver Certificado
                  </Button>
                  <Button variant="outline" size="sm">
                    Histórico
                  </Button>
                  {cert.status === "Renovação Pendente" && (
                    <Button size="sm" className="bg-gradient-coffee hover:opacity-90">
                      Renovar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
