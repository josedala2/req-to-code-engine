import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Coffee, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const qualityData = {
  "LOT-2025-001": {
    id: "LOT-2025-001",
    date: "20/01/2025",
    analyst: "Maria Clara - Q-Grader",
    batch: "LOT-2025-001",
    producer: "Fazenda Santa Clara",
    variety: "Bourbon Amarelo",
    totalScore: 87.5,
    classification: "Especial",
    attributes: [
      { name: "Fragrância/Aroma", score: 8.5, max: 10 },
      { name: "Sabor", score: 8.75, max: 10 },
      { name: "Acidez", score: 8.5, max: 10 },
      { name: "Corpo", score: 8.25, max: 10 },
      { name: "Finalização", score: 8.5, max: 10 },
      { name: "Equilíbrio", score: 8.5, max: 10 },
      { name: "Doçura", score: 9.0, max: 10 },
      { name: "Uniformidade", score: 9.0, max: 10 },
      { name: "Xícara Limpa", score: 9.0, max: 10 },
      { name: "Impressão Geral", score: 9.5, max: 10 },
    ],
    descriptors: [
      "Chocolate ao leite",
      "Caramelo",
      "Frutas vermelhas",
      "Mel",
      "Amêndoas",
      "Florais suaves",
    ],
    defects: {
      category1: 0,
      category2: 2,
      total: "Sem defeitos graves",
    },
    notes: "Café de excelente qualidade com perfil sensorial complexo e bem equilibrado. Ideal para microlotes e cafés especiais premium.",
    recommendations: [
      "Recomendado para torras médias (city a full city)",
      "Excelente para métodos de extração filtrados",
      "Potencial para competições e leilões especiais",
    ],
  },
};

export default function QualidadeDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const quality = qualityData[id as keyof typeof qualityData] || qualityData["LOT-2025-001"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/qualidade")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">Análise de Qualidade</CardTitle>
                <CardDescription className="text-lg mt-2">Lote: {quality.batch}</CardDescription>
              </div>
              <Badge className="bg-gradient-coffee text-primary-foreground text-lg px-4 py-2">
                {quality.classification}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data da Análise</p>
                <p className="font-medium">{quality.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Analista</p>
                <p className="font-medium">{quality.analyst}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Produtor</p>
                <p className="font-medium">{quality.producer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Variedade</p>
                <Badge variant="secondary">{quality.variety}</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                Atributos Sensoriais SCA
              </h3>
              <div className="space-y-4">
                {quality.attributes.map((attr) => (
                  <div key={attr.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{attr.name}</span>
                      <span className="text-sm font-bold text-primary">
                        {attr.score.toFixed(2)} / {attr.max}
                      </span>
                    </div>
                    <Progress value={(attr.score / attr.max) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Pontuação Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-primary">{quality.totalScore}</p>
              <p className="text-muted-foreground mt-2">/ 100 pontos SCA</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Defeitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Categoria 1:</span>
                <span className="font-bold">{quality.defects.category1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Categoria 2:</span>
                <span className="font-bold">{quality.defects.category2}</span>
              </div>
              <p className="text-sm text-success mt-3 font-medium">{quality.defects.total}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Descritores Sensoriais</CardTitle>
            <CardDescription>Notas e aromas identificados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quality.descriptors.map((descriptor) => (
                <Badge key={descriptor} variant="secondary" className="text-sm px-3 py-1">
                  {descriptor}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
            <CardDescription>Sugestões de uso e preparo</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {quality.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Observações do Analista</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{quality.notes}</p>
        </CardContent>
      </Card>
    </div>
  );
}
