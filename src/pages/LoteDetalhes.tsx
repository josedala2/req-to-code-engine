import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Weight, MapPin, Thermometer, Droplets, Users, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlterarStatusLoteDialog } from "@/components/forms/AlterarStatusLoteDialog";
import { generateRastreabilidadePDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";

const batchData = {
  "LOT-2025-001": {
    id: "LOT-2025-001",
    producer: "Fazenda Santa Clara",
    variety: "Bourbon Amarelo",
    harvestDate: "15/01/2025",
    quantity: "1.200 kg",
    process: "Natural",
    quality: "Premium",
    status: "Em processamento",
    location: "Secador 3",
    details: {
      altitude: "1.200m",
      temperature: "24°C",
      humidity: "45%",
      fermentation: "48 horas",
      drying: "Em andamento - Dia 8/15",
    },
    cupping: {
      score: 87,
      aroma: "Frutas vermelhas, chocolate",
      flavor: "Doce, corpo médio, acidez equilibrada",
      notes: "Notas de caramelo e frutas secas",
    },
    timeline: [
      { date: "15/01/2025", event: "Colheita realizada", status: "completed" },
      { date: "15/01/2025", event: "Recepção do lote", status: "completed" },
      { date: "16/01/2025", event: "Início da fermentação", status: "completed" },
      { date: "18/01/2025", event: "Início da secagem", status: "completed" },
      { date: "25/01/2025", event: "Secagem completa", status: "pending" },
      { date: "26/01/2025", event: "Beneficiamento", status: "pending" },
    ],
  },
};

export default function LoteDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const batch = batchData[id as keyof typeof batchData] || batchData["LOT-2025-001"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em processamento":
        return "bg-warning/10 text-warning border-warning/20";
      case "Pronto":
        return "bg-success/10 text-success border-success/20";
      case "Exportado":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/lotes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <AlterarStatusLoteDialog
            loteId={batch.id}
            statusAtual={batch.status}
            onSuccess={() => window.location.reload()}
          />
          <Button onClick={() => {
            generateRastreabilidadePDF(id || "LOTE-2024-001");
            toast.success("Relatório de rastreabilidade exportado!");
          }}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Rastreabilidade
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl font-mono">{batch.id}</CardTitle>
            <CardDescription className="text-lg">{batch.producer}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Variedade</p>
                <Badge variant="secondary" className="text-base">{batch.variety}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Processo</p>
                <p className="font-medium">{batch.process}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Qualidade</p>
                <Badge className="bg-gradient-coffee text-primary-foreground">{batch.quality}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant="outline" className={getStatusColor(batch.status)}>
                  {batch.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Data da Colheita</p>
                  <p className="font-medium">{batch.harvestDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Quantidade</p>
                  <p className="font-medium">{batch.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Localização Atual</p>
                  <p className="font-medium">{batch.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Altitude</p>
                  <p className="font-medium">{batch.details.altitude}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                Temperatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{batch.details.temperature}</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Umidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{batch.details.humidity}</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Secagem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{batch.details.drying}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          <TabsTrigger value="cupping">Análise Sensorial</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Rastreamento do Lote</CardTitle>
              <CardDescription>Acompanhe todas as etapas do processamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {batch.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${
                      item.status === "completed" 
                        ? "bg-success" 
                        : "bg-muted border-2 border-muted-foreground"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.event}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      {item.status === "completed" && (
                        <Badge variant="outline" className="mt-1 bg-success/10 text-success border-success/20">
                          Concluído
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cupping" className="mt-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Análise Sensorial (Cupping)</CardTitle>
              <CardDescription>Avaliação de qualidade e características</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Pontuação SCA</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-primary">{batch.cupping.score}</p>
                  <p className="text-muted-foreground">/ 100</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="font-medium mb-1">Aroma</p>
                <p className="text-muted-foreground">{batch.cupping.aroma}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Sabor</p>
                <p className="text-muted-foreground">{batch.cupping.flavor}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Notas Adicionais</p>
                <p className="text-muted-foreground">{batch.cupping.notes}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
