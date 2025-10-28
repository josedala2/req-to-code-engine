import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Leaf, Factory, Scale, Droplets, Award, Coffee, CheckCircle2 } from "lucide-react";
import mukafeLogo from "@/assets/mukafe-logo.png";

interface LoteData {
  codigo: string;
  produtor_nome: string;
  safra: string;
  variedade: string[];
  processo: string;
  data_colheita: string;
  quantidade: number;
  unidade: string;
  peneira?: string;
  umidade?: number;
  certificacao?: string;
  observacoes?: string;
  status: string;
}

export default function LotePublico() {
  const { codigo } = useParams<{ codigo: string }>();
  const [lote, setLote] = useState<LoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLote = async () => {
      if (!codigo) return;

      const { data, error } = await supabase
        .from("lotes")
        .select("*")
        .eq("codigo", codigo)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar lote:", error);
      } else {
        setLote(data);
      }
      setLoading(false);
    };

    fetchLote();
  }, [codigo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-elegant">
          <CardContent className="p-12 text-center">
            <Coffee className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-muted-foreground">Carregando informações do lote...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-elegant">
          <CardContent className="p-12 text-center">
            <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Lote não encontrado</h2>
            <p className="text-muted-foreground">
              O código {codigo} não foi encontrado no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header com Logo */}
        <Card className="shadow-elegant border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <img src={mukafeLogo} alt="SNRCAFE" className="h-20 w-auto" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-coffee bg-clip-text text-transparent">
              Sistema Nacional de Rastreabilidade do Café
            </CardTitle>
            <CardDescription className="text-base">
              Informações públicas de rastreabilidade
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Informações do Lote */}
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Lote {lote.codigo}</CardTitle>
                <CardDescription>Café de qualidade certificada de Angola</CardDescription>
              </div>
              <Badge className="bg-gradient-coffee text-white">
                <Award className="h-4 w-4 mr-2" />
                Certificado
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Certificação */}
            {lote.certificacao && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">
                      Número de Certificação
                    </p>
                    <p className="text-lg font-bold text-primary">{lote.certificacao}</p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Produtor */}
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Produtor
              </h3>
              <p className="text-lg">{lote.produtor_nome}</p>
            </div>

            <Separator />

            {/* Detalhes da Produção */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                Detalhes da Produção
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Leaf className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">Variedade</p>
                    <p className="text-base font-medium">{lote.variedade.join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Factory className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">Processo</p>
                    <p className="text-base font-medium">{lote.processo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">Data de Colheita</p>
                    <p className="text-base font-medium">
                      {new Date(lote.data_colheita).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Coffee className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">Safra</p>
                    <p className="text-base font-medium">{lote.safra}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Scale className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">Quantidade</p>
                    <p className="text-base font-medium">
                      {lote.quantidade} {lote.unidade}
                    </p>
                  </div>
                </div>

                {lote.peneira && (
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Coffee className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">Peneira</p>
                      <p className="text-base font-medium">{lote.peneira}</p>
                    </div>
                  </div>
                )}

                {lote.umidade && (
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Droplets className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">Umidade</p>
                      <p className="text-base font-medium">{lote.umidade}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Observações */}
            {lote.observacoes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-bold text-lg mb-3">Observações</h3>
                  <p className="text-muted-foreground">{lote.observacoes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="shadow-elegant bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Este certificado garante a origem e qualidade do café angolano
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              INCA • FDCA • MINAGRIF
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
