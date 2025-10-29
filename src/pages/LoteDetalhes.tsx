import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Weight, MapPin, Thermometer, Droplets, Users, Download, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlterarStatusLoteDialog } from "@/components/forms/AlterarStatusLoteDialog";
import { generateRastreabilidadePDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function LoteDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lote, setLote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLote = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("lotes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setLote(data);
    } catch (error: any) {
      toast.error("Erro ao carregar lote: " + error.message);
      navigate("/lotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLote();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Lote não encontrado</p>
        <Button onClick={() => navigate("/lotes")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Lotes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/lotes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-2">
          <AlterarStatusLoteDialog
            loteId={lote.id}
            statusAtual={lote.status}
            onSuccess={fetchLote}
          />
          <Button onClick={() => {
            generateRastreabilidadePDF(lote.codigo);
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
            <CardTitle className="text-3xl font-mono">{lote.codigo}</CardTitle>
            <CardDescription className="text-lg">{lote.produtor_nome}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Variedade</p>
                <div className="flex flex-wrap gap-1">
                  {lote.variedade?.map((v: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-base">{v}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Processo</p>
                <p className="font-medium">{lote.processo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Certificação</p>
                <Badge className="bg-gradient-coffee text-primary-foreground">
                  {lote.certificacao || "Standard"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant="outline" className={getStatusColor(lote.status)}>
                  {lote.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Data da Colheita</p>
                  <p className="font-medium">{new Date(lote.data_colheita).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Quantidade</p>
                  <p className="font-medium">{lote.quantidade} {lote.unidade}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Peneira</p>
                  <p className="font-medium">{lote.peneira || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Umidade</p>
                  <p className="font-medium">{lote.umidade ? `${lote.umidade}%` : "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Safra</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{lote.safra}</p>
            </CardContent>
          </Card>

          {lote.umidade && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  Umidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{lote.umidade}%</p>
              </CardContent>
            </Card>
          )}

          {lote.observacoes && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{lote.observacoes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
