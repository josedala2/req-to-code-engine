import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Coffee, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function QualidadeDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: quality, isLoading } = useQuery({
    queryKey: ['qualidade', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qualidade')
        .select(`
          *,
          lotes (codigo, produtor_nome, variedade)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-elegant">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quality) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/qualidade")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Card className="shadow-elegant">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Análise não encontrada.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const attributes = [
    { name: "Fragrância/Aroma", score: quality.fragrancia || 0, max: 10 },
    { name: "Sabor", score: quality.sabor || 0, max: 10 },
    { name: "Pós-Gosto", score: quality.pos_gosto || 0, max: 10 },
    { name: "Acidez", score: quality.acidez || 0, max: 10 },
    { name: "Corpo", score: quality.corpo || 0, max: 10 },
    { name: "Equilíbrio", score: quality.equilibrio || 0, max: 10 },
    { name: "Uniformidade", score: quality.uniformidade || 0, max: 10 },
    { name: "Xícara Limpa", score: quality.xicara_limpa || 0, max: 10 },
    { name: "Doçura", score: quality.doçura || 0, max: 10 },
  ];

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
                <CardDescription className="text-lg mt-2">
                  Lote: {quality.lotes?.codigo || 'N/A'}
                </CardDescription>
              </div>
              {quality.classificacao && (
                <Badge className="bg-gradient-coffee text-primary-foreground text-lg px-4 py-2">
                  {quality.classificacao}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data da Análise</p>
                <p className="font-medium">{format(new Date(quality.data_analise), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Classificador</p>
                <p className="font-medium">{quality.classificador_nome}</p>
                {quality.classificador_certificacao && (
                  <p className="text-xs text-muted-foreground">{quality.classificador_certificacao}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Produtor</p>
                <p className="font-medium">{quality.lotes?.produtor_nome || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Variedade</p>
                <Badge variant="secondary">{quality.lotes?.variedade || 'N/A'}</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                Atributos Sensoriais
              </h3>
              <div className="space-y-4">
                {attributes.map((attr) => (
                  <div key={attr.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{attr.name}</span>
                      <span className="text-sm font-bold text-primary">
                        {attr.score.toFixed(1)} / {attr.max}
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
              <p className="text-5xl font-bold text-primary">{quality.nota_final?.toFixed(1) || 0}</p>
              <p className="text-muted-foreground mt-2">/ 100 pontos</p>
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
                <span className="text-sm">Total de Defeitos:</span>
                <span className="font-bold">{quality.defeitos || 0}</span>
              </div>
              {quality.umidade && (
                <div className="flex justify-between mt-3">
                  <span className="text-sm">Umidade:</span>
                  <span className="font-bold">{quality.umidade}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {quality.observacoes && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{quality.observacoes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
