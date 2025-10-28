import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ClipboardCheck, Droplet, Bug, Eye, Star, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QualidadeForm } from "@/components/forms/QualidadeForm";
import { generateQualidadePDF } from "@/lib/pdfGenerator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: qualityTests, refetch } = useQuery({
    queryKey: ['qualidade'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qualidade')
        .select(`
          *,
          lotes (codigo)
        `)
        .order('data_analise', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const stats = {
    avgScore: qualityTests?.reduce((acc, test) => acc + (test.nota_final || 0), 0) / (qualityTests?.length || 1),
    approvalRate: qualityTests?.filter(t => (t.nota_final || 0) >= 80).length / (qualityTests?.length || 1) * 100,
    avgMoisture: qualityTests?.reduce((acc, test) => acc + (test.umidade || 0), 0) / (qualityTests?.length || 1),
    avgDefects: qualityTests?.reduce((acc, test) => acc + (test.defeitos || 0), 0) / (qualityTests?.length || 1),
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Controlo de Qualidade</h2>
          <p className="text-muted-foreground">Análises sensoriais e testes de qualidade</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateQualidadePDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-coffee hover:opacity-90 shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Nova Análise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Análise de Qualidade</DialogTitle>
                <DialogDescription>
                  Registre a análise sensorial e classificação do café
                </DialogDescription>
              </DialogHeader>
              <QualidadeForm onSuccess={() => {
                setDialogOpen(false);
                refetch();
              }} />
            </DialogContent>
          </Dialog>
        </div>
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
              <span className="text-4xl font-bold text-primary">{stats.avgScore.toFixed(1)}</span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(stats.avgScore / 20) ? "fill-accent text-accent" : "text-muted"
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
              <span className="text-4xl font-bold text-success">{stats.approvalRate.toFixed(0)}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {qualityTests?.filter(t => (t.nota_final || 0) >= 80).length || 0} de {qualityTests?.length || 0} análises
            </p>
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
              <span className="text-4xl font-bold text-foreground">{stats.avgMoisture.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-success mt-2">
              {stats.avgMoisture >= 10 && stats.avgMoisture <= 12 ? "✓ Dentro do ideal" : "⚠ Atenção"}
            </p>
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
              <span className="text-4xl font-bold text-foreground">{stats.avgDefects.toFixed(1)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">por amostra de 300g</p>
          </CardContent>
        </Card>
      </div>

      {/* Quality Tests List */}
      <div className="space-y-4">
        {!qualityTests || qualityTests.length === 0 ? (
          <Card className="shadow-elegant">
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma análise de qualidade cadastrada ainda.</p>
            </CardContent>
          </Card>
        ) : (
          qualityTests.map((test) => (
            <Card key={test.id} className="shadow-elegant hover:shadow-glow transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg font-mono">
                        Lote: {test.lotes?.codigo || 'N/A'}
                      </CardTitle>
                      {(test.nota_final || 0) >= 80 && (
                        <Badge className="bg-success text-success-foreground">
                          ✓ Aprovado
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {format(new Date(test.data_analise), 'dd/MM/yyyy')} • Classificador: {test.classificador_nome}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getScoreBg(test.nota_final || 0)} text-white font-bold text-2xl`}>
                      <ClipboardCheck className="h-6 w-6" />
                      {test.nota_final?.toFixed(1) || 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Score Final</p>
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
                    <p className="text-2xl font-bold text-foreground">{test.defeitos || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Droplet className="h-4 w-4" />
                      Umidade
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {test.umidade ? `${test.umidade}%` : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      Classificação
                    </div>
                    {test.classificacao && (
                      <Badge className={getScoreBg(test.nota_final || 0) + " text-white"}>
                        {test.classificacao}
                      </Badge>
                    )}
                  </div>
                </div>
                {test.observacoes && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-1">Observações:</p>
                    <p className="text-sm text-muted-foreground italic">"{test.observacoes}"</p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/qualidade/${test.id}`)}
                  >
                    Ver Relatório Completo
                  </Button>
                  <Button variant="outline" size="sm">
                    Exportar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
