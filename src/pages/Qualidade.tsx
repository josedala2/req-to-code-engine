import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ClipboardCheck, Droplet, Bug, Eye, Star } from "lucide-react";

const qualityTests = [
  {
    id: "QA-2025-012",
    batchId: "LOT-2025-001",
    date: "16/01/2025",
    inspector: "Dr. Roberto Café",
    sensoryScore: 87,
    defects: 2,
    moisture: "11.5%",
    classification: "Premium",
    notes: "Aroma intenso, corpo médio, acidez balanceada",
    approved: true,
  },
  {
    id: "QA-2025-011",
    batchId: "LOT-2025-002",
    date: "14/01/2025",
    inspector: "Ana Clara Barista",
    sensoryScore: 84,
    defects: 4,
    moisture: "12.0%",
    classification: "Gourmet",
    notes: "Doçura pronunciada, notas de chocolate",
    approved: true,
  },
  {
    id: "QA-2025-010",
    batchId: "LOT-2024-458",
    date: "05/01/2025",
    inspector: "Dr. Roberto Café",
    sensoryScore: 89,
    defects: 1,
    moisture: "11.2%",
    classification: "Premium",
    notes: "Excepcional equilíbrio, finalização longa",
    approved: true,
  },
];

const getScoreColor = (score: number) => {
  if (score >= 85) return "text-primary";
  if (score >= 80) return "text-secondary";
  return "text-warning";
};

const getScoreBg = (score: number) => {
  if (score >= 85) return "bg-gradient-coffee";
  if (score >= 80) return "bg-gradient-natural";
  return "bg-warning/20";
};

export default function Qualidade() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Controle de Qualidade</h2>
          <p className="text-muted-foreground">Análises sensoriais e testes de qualidade</p>
        </div>
        <Button className="bg-gradient-coffee hover:opacity-90 shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Análise
        </Button>
      </div>

      {/* Quality Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Score Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">86.7</span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= 4 ? "fill-accent text-accent" : "text-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-success">94%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">146 de 156 análises</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Umidade Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Droplet className="h-8 w-8 text-primary" />
              <span className="text-4xl font-bold text-foreground">11.6%</span>
            </div>
            <p className="text-sm text-success mt-2">✓ Dentro do ideal</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Defeitos Médios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bug className="h-8 w-8 text-warning" />
              <span className="text-4xl font-bold text-foreground">2.4</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">por amostra de 300g</p>
          </CardContent>
        </Card>
      </div>

      {/* Quality Tests List */}
      <div className="space-y-4">
        {qualityTests.map((test) => (
          <Card key={test.id} className="shadow-elegant hover:shadow-glow transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg font-mono">{test.id}</CardTitle>
                    <Badge variant="outline">Lote: {test.batchId}</Badge>
                    {test.approved && (
                      <Badge className="bg-success text-success-foreground">
                        ✓ Aprovado
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {test.date} • Inspetor: {test.inspector}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getScoreBg(test.sensoryScore)} text-white font-bold text-2xl`}>
                    <ClipboardCheck className="h-6 w-6" />
                    {test.sensoryScore}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Score Sensorial</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bug className="h-4 w-4" />
                    Defeitos
                  </div>
                  <p className="text-2xl font-bold text-foreground">{test.defects}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Droplet className="h-4 w-4" />
                    Umidade
                  </div>
                  <p className="text-2xl font-bold text-foreground">{test.moisture}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    Classificação
                  </div>
                  <Badge className={getScoreBg(test.sensoryScore) + " text-white"}>
                    {test.classification}
                  </Badge>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-1">Notas do Degustador:</p>
                <p className="text-sm text-muted-foreground italic">"{test.notes}"</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  Ver Relatório Completo
                </Button>
                <Button variant="outline" size="sm">
                  Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
