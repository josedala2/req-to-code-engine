import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Package, Scale, User, FileCheck, Leaf } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LoteInfo {
  id: string;
  codigo: string;
  produtor_nome: string;
  variedade: string[];
  processo: string;
  quantidade: number;
  unidade: string;
  data_colheita: string;
  safra: string;
  provincia?: string;
  municipio?: string;
  nota_qualidade?: number;
}

interface CertificadoData {
  id: string;
  numero_certificado: string;
  status: string;
  data_emissao: string | null;
  data_validade: string | null;
  destino_pais: string;
  destino_cidade: string | null;
  importador_nome: string;
  importador_documento: string | null;
  quantidade_total: number;
  unidade: string;
  valor_total: number | null;
  moeda: string;
  normas_cumpridas: string[] | null;
  observacoes: string | null;
  lotes: LoteInfo[];
}

export default function CertificadoExportacaoPublico() {
  const { numero } = useParams<{ numero: string }>();
  const [certificado, setCertificado] = useState<CertificadoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificado = async () => {
      if (!numero) return;

      try {
        // Buscar certificado
        const { data: certData, error: certError } = await supabase
          .from("certificados_exportacao")
          .select("*")
          .eq("numero_certificado", numero)
          .single();

        if (certError) throw certError;
        if (!certData) {
          setLoading(false);
          return;
        }

        // Buscar lotes associados
        const { data: lotesData, error: lotesError } = await supabase
          .from("lotes")
          .select("id, codigo, produtor_nome, variedade, processo, quantidade, unidade, data_colheita, safra")
          .in("id", certData.lotes_ids);

        if (lotesError) throw lotesError;

        // Buscar análises de qualidade dos lotes
        const { data: qualidadeData } = await supabase
          .from("qualidade")
          .select("lote_id, nota_final")
          .in("lote_id", certData.lotes_ids);

        // Mapear notas de qualidade
        const notasMap = new Map(
          qualidadeData?.map((q) => [q.lote_id, q.nota_final]) || []
        );

        const lotes: LoteInfo[] = lotesData?.map((lote) => ({
          ...lote,
          nota_qualidade: notasMap.get(lote.id) || undefined,
        })) || [];

        setCertificado({
          ...certData,
          lotes,
        });
      } catch (error) {
        console.error("Erro ao buscar certificado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificado();
  }, [numero]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Carregando certificado...</p>
        </div>
      </div>
    );
  }

  if (!certificado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <FileCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Certificado não encontrado</h2>
            <p className="text-muted-foreground">
              O certificado com número {numero} não foi encontrado no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    pendente: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    aprovado: "bg-green-500/10 text-green-700 border-green-500/20",
    emitido: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    cancelado: "bg-red-500/10 text-red-700 border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src="/src/assets/mukafe-logo.png" 
                alt="Mukafé Logo" 
                className="h-20 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Certificado de Exportação de Café
              </h1>
              <p className="text-lg text-muted-foreground">
                República de Angola - Instituto Nacional do Café de Angola (INCA)
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Número do Certificado</p>
                <p className="text-2xl font-bold text-primary">{certificado.numero_certificado}</p>
              </div>
              <Badge className={`${statusColors[certificado.status as keyof typeof statusColors]} text-sm px-4 py-2`}>
                {certificado.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Informações da Exportação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Informações da Exportação
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Destino</p>
                  <p className="font-semibold">
                    {certificado.destino_pais}
                    {certificado.destino_cidade && ` - ${certificado.destino_cidade}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Importador</p>
                  <p className="font-semibold">{certificado.importador_nome}</p>
                  {certificado.importador_documento && (
                    <p className="text-sm text-muted-foreground">{certificado.importador_documento}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantidade Total</p>
                  <p className="font-semibold text-lg">
                    {certificado.quantidade_total.toLocaleString()} {certificado.unidade}
                  </p>
                </div>
              </div>
              {certificado.valor_total && (
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                    <p className="font-semibold text-lg">
                      {certificado.valor_total.toLocaleString()} {certificado.moeda}
                    </p>
                  </div>
                </div>
              )}
              {certificado.data_emissao && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Emissão</p>
                    <p className="font-semibold">
                      {format(new Date(certificado.data_emissao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}
              {certificado.data_validade && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Validade</p>
                    <p className="font-semibold">
                      {format(new Date(certificado.data_validade), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certificações e Normas */}
        {certificado.normas_cumpridas && certificado.normas_cumpridas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Certificações e Normas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {certificado.normas_cumpridas.map((norma, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {norma}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ciclo de Produção - Lotes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Ciclo de Produção - Rastreabilidade dos Lotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificado.lotes.map((lote, index) => (
                <Card key={lote.id} className="border-primary/10">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Código do Lote</p>
                        <p className="font-bold text-lg text-primary">{lote.codigo}</p>
                        {lote.nota_qualidade && (
                          <Badge className="mt-2 bg-green-500/10 text-green-700 border-green-500/20">
                            Nota: {lote.nota_qualidade} pts
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Produtor</p>
                        <p className="font-semibold">{lote.produtor_nome}</p>
                        <p className="text-sm text-muted-foreground mt-1">Safra: {lote.safra}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Quantidade</p>
                        <p className="font-semibold text-lg">
                          {lote.quantidade.toLocaleString()} {lote.unidade}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Variedade</p>
                        <p className="font-medium">{lote.variedade.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Processo</p>
                        <p className="font-medium">{lote.processo}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Data de Colheita</p>
                        <p className="font-medium">
                          {format(new Date(lote.data_colheita), "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        {certificado.observacoes && (
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{certificado.observacoes}</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Este certificado é emitido pelo Instituto Nacional do Café de Angola (INCA)
              e garante a origem e qualidade do café angolano para exportação.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Documento gerado eletronicamente • Sistema Nacional de Rastreabilidade do Café
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
