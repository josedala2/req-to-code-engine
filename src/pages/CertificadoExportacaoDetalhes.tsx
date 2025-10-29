import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Download, CheckCircle, XCircle, FileText, Package, User, Plane, Edit } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateExportCertificate } from "@/lib/exportCertificateGenerator";

export default function CertificadoExportacaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificado, setCertificado] = useState<any>(null);
  const [lotes, setLotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    fetchCertificado();
  }, [id]);

  const fetchCertificado = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("certificados_exportacao")
        .select(`
          *,
          produtores (
            nome,
            nif,
            localizacao,
            provincia,
            telefone,
            email
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setCertificado(data);

      // Buscar lotes
      const { data: lotesData, error: lotesError } = await supabase
        .from("lotes")
        .select("*")
        .in("id", data.lotes_ids);

      if (lotesError) throw lotesError;
      setLotes(lotesData || []);
    } catch (error) {
      console.error("Erro ao buscar certificado:", error);
      toast.error("Erro ao carregar certificado");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (novoStatus: string) => {
    try {
      setAtualizando(true);
      
      const updateData: any = { 
        status: novoStatus
      };

      if (novoStatus === "emitido") {
        updateData.data_emissao = new Date().toISOString();
      }

      const { error } = await supabase
        .from("certificados_exportacao")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success(`Certificado ${novoStatus}!`);
      fetchCertificado();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    } finally {
      setAtualizando(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading("Gerando certificado...");

      const certificadoData = {
        numero_certificado: certificado.numero_certificado,
        data_emissao: certificado.data_emissao || new Date().toISOString(),
        data_validade: certificado.data_validade,
        produtor_nome: certificado.produtores?.nome || "N/A",
        produtor_nif: certificado.produtores?.nif,
        produtor_localizacao: `${certificado.produtores?.localizacao}, ${certificado.produtores?.provincia}`,
        destino_pais: certificado.destino_pais,
        destino_cidade: certificado.destino_cidade,
        importador_nome: certificado.importador_nome,
        importador_documento: certificado.importador_documento,
        quantidade_total: certificado.quantidade_total,
        unidade: certificado.unidade,
        valor_total: certificado.valor_total,
        moeda: certificado.moeda,
        lotes: lotes.map((lote) => ({
          codigo: lote.codigo,
          variedade: lote.variedade,
          processo: lote.processo,
          quantidade: lote.quantidade,
          unidade: lote.unidade,
          safra: lote.safra,
          certificacao: lote.certificacao,
          produtor_nome: lote.produtor_nome
        })),
        normas_cumpridas: certificado.normas_cumpridas || [],
        observacoes: certificado.observacoes
      };

      const pdf = await generateExportCertificate(certificadoData);
      pdf.save(`Certificado_Exportacao_${certificado.numero_certificado}.pdf`);

      toast.dismiss();
      toast.success("Certificado baixado!");
    } catch (error) {
      console.error("Erro ao gerar certificado:", error);
      toast.dismiss();
      toast.error("Erro ao gerar certificado");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pendente: { variant: "outline", label: "Pendente" },
      aprovado: { variant: "secondary", label: "Aprovado" },
      emitido: { variant: "default", label: "Emitido" },
      rejeitado: { variant: "destructive", label: "Rejeitado" }
    };

    const config = variants[status] || variants.pendente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!certificado) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Certificado não encontrado</p>
            <Button onClick={() => navigate("/certificados-exportacao")} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/certificados-exportacao")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-2">
          {(certificado.status === "pendente" || certificado.status === "aprovado") && (
            <Button
              variant="outline"
              onClick={() => navigate(`/certificados-exportacao/${id}/editar`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          {certificado.status === "pendente" && (
            <>
              <Button
                variant="outline"
                onClick={() => atualizarStatus("rejeitado")}
                disabled={atualizando}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
              <Button
                onClick={() => atualizarStatus("aprovado")}
                disabled={atualizando}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar
              </Button>
            </>
          )}
          {certificado.status === "aprovado" && (
            <Button
              onClick={() => atualizarStatus("emitido")}
              disabled={atualizando}
            >
              <FileText className="h-4 w-4 mr-2" />
              Emitir Certificado
            </Button>
          )}
          {certificado.status === "emitido" && (
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Certificado
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Cabeçalho */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Plane className="h-6 w-6 text-primary" />
                  {certificado.numero_certificado}
                </CardTitle>
                <CardDescription className="mt-2">
                  Certificado de Autorização de Exportação
                </CardDescription>
              </div>
              {getStatusBadge(certificado.status)}
            </div>
          </CardHeader>
        </Card>

        {/* Exportador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Exportador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-semibold">{certificado.produtores?.nome}</p>
              </div>
              {certificado.produtores?.nif && (
                <div>
                  <p className="text-sm text-muted-foreground">NIF</p>
                  <p className="font-semibold">{certificado.produtores.nif}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="font-semibold">
                  {certificado.produtores?.localizacao}, {certificado.produtores?.provincia}
                </p>
              </div>
              {certificado.produtores?.telefone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-semibold">{certificado.produtores.telefone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Destino */}
        <Card>
          <CardHeader>
            <CardTitle>Destino e Importador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">País de Destino</p>
                <p className="font-semibold">{certificado.destino_pais}</p>
              </div>
              {certificado.destino_cidade && (
                <div>
                  <p className="text-sm text-muted-foreground">Cidade de Destino</p>
                  <p className="font-semibold">{certificado.destino_cidade}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Importador</p>
                <p className="font-semibold">{certificado.importador_nome}</p>
              </div>
              {certificado.importador_documento && (
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-semibold">{certificado.importador_documento}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lotes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lotes Incluídos ({lotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lotes.map((lote) => (
                <div key={lote.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-mono font-bold text-primary">{lote.codigo}</p>
                    {lote.certificacao && <Badge>{lote.certificacao}</Badge>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Variedade</p>
                      <p className="font-medium">{lote.variedade?.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processo</p>
                      <p className="font-medium">{lote.processo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantidade</p>
                      <p className="font-medium">{lote.quantidade} {lote.unidade}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Safra</p>
                      <p className="font-medium">{lote.safra}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <p className="font-semibold">Quantidade Total:</p>
              <p className="text-xl font-bold text-primary">
                {certificado.quantidade_total} {certificado.unidade}
              </p>
            </div>
            {certificado.valor_total && (
              <div className="flex items-center justify-between mt-2">
                <p className="font-semibold">Valor Total:</p>
                <p className="text-xl font-bold">
                  {certificado.valor_total.toLocaleString()} {certificado.moeda || "AOA"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Normas */}
        {certificado.normas_cumpridas && certificado.normas_cumpridas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Normas e Certificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {certificado.normas_cumpridas.map((norma: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {norma}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Datas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Data de Solicitação</p>
                <p className="font-semibold">
                  {format(new Date(certificado.data_solicitacao), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              {certificado.data_emissao && (
                <div>
                  <p className="text-sm text-muted-foreground">Data de Emissão</p>
                  <p className="font-semibold">
                    {format(new Date(certificado.data_emissao), "dd/MM/yyyy")}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Validade</p>
                <p className="font-semibold">
                  {format(new Date(certificado.data_validade), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            {certificado.observacoes && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Observações</p>
                  <p className="whitespace-pre-line">{certificado.observacoes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
