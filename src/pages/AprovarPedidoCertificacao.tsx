import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, FileText, Package, CheckCircle, Download } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/Layout";

interface Pedido {
  id: string;
  numero_pedido: string;
  tipo_certificacao: string;
  quantidade_lotes: number;
  volume_estimado: number;
  unidade_volume: string;
  status: string;
  data_solicitacao: string;
  data_conclusao: string | null;
  observacoes: string | null;
  certificado_url: string | null;
  selos_url: string | null;
  empresa_id: string;
  empresas: {
    nome_empresa: string;
    nif: string;
    email: string;
    telefone: string;
    provincia: string;
  };
}

export default function AprovarPedidoCertificacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPedido();
    }
  }, [id]);

  const fetchPedido = async () => {
    try {
      const { data, error } = await supabase
        .from("pedidos_certificacao")
        .select(`
          *,
          empresas (
            nome_empresa,
            nif,
            email,
            telefone,
            provincia
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setPedido(data);
      setNewStatus(data?.status || "");
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      toast.error("Erro ao carregar dados do pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!pedido || !newStatus) return;

    setSubmitting(true);
    try {
      const updateData: any = {
        status: newStatus,
      };

      if (newStatus === 'concluido') {
        updateData.data_conclusao = new Date().toISOString();
      }

      const { error } = await supabase
        .from("pedidos_certificacao")
        .update(updateData)
        .eq("id", pedido.id);

      if (error) throw error;

      toast.success("Status atualizado com sucesso!");
      fetchPedido();
      setObservacoes("");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateCertificateAndSeals = async () => {
    if (!pedido) return;

    setGenerating(true);
    toast.info("Funcionalidade de geração de certificados em desenvolvimento. Por enquanto, adicione os URLs manualmente no banco de dados.");
    setGenerating(false);
  };

  const getTipoCertificacaoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      organico: "Orgânico",
      fair_trade: "Fair Trade",
      rainforest_alliance: "Rainforest Alliance",
      utz: "UTZ",
      cafe_especial: "Café Especial",
    };
    return tipos[tipo] || tipo;
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pendente: { label: "Pendente", color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
      documentacao_analise: { label: "Documentação em Análise", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
      auditoria_agendada: { label: "Auditoria Agendada", color: "bg-purple-500/10 text-purple-700 border-purple-500/20" },
      auditoria_realizada: { label: "Auditoria Realizada", color: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20" },
      em_emissao: { label: "Certificado em Emissão", color: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
      concluido: { label: "Concluído", color: "bg-green-500/10 text-green-700 border-green-500/20" },
      rejeitado: { label: "Rejeitado", color: "bg-red-500/10 text-red-700 border-red-500/20" },
    };
    return statusMap[status] || statusMap.pendente;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!pedido) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <p className="text-center text-muted-foreground">Pedido não encontrado</p>
        </div>
      </Layout>
    );
  }

  const statusInfo = getStatusInfo(pedido.status);

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-mono text-primary">
                  {pedido.numero_pedido}
                </CardTitle>
                <CardDescription>
                  {pedido.empresas.nome_empresa} • Solicitado em {format(new Date(pedido.data_solicitacao), 'dd/MM/yyyy HH:mm')}
                </CardDescription>
              </div>
              <Badge variant="outline" className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Empresa</p>
                <p className="font-semibold">{pedido.empresas.nome_empresa}</p>
                <p className="text-sm text-muted-foreground">NIF: {pedido.empresas.nif}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contacto</p>
                <p className="font-semibold">{pedido.empresas.email}</p>
                <p className="text-sm">{pedido.empresas.telefone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Certificação</p>
                <p className="font-semibold">{getTipoCertificacaoLabel(pedido.tipo_certificacao)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-semibold">
                  {pedido.volume_estimado} {pedido.unidade_volume} ({pedido.quantidade_lotes} lotes)
                </p>
              </div>
            </div>

            {pedido.observacoes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Observações do Pedido</p>
                  <p className="text-sm">{pedido.observacoes}</p>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Atualizar Status</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Novo Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="documentacao_analise">Documentação em Análise</SelectItem>
                      <SelectItem value="auditoria_agendada">Auditoria Agendada</SelectItem>
                      <SelectItem value="auditoria_realizada">Auditoria Realizada</SelectItem>
                      <SelectItem value="em_emissao">Certificado em Emissão</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Adicione observações sobre esta atualização..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={submitting || newStatus === pedido.status}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Atualizar Status
                </Button>
              </div>
            </div>

            {pedido.status !== 'concluido' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold">Gerar Certificado e Selos</h3>
                  <p className="text-sm text-muted-foreground">
                    Gere o certificado e os selos de certificação para este pedido
                  </p>
                  <Button
                    onClick={handleGenerateCertificateAndSeals}
                    disabled={generating}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {generating ? "Gerando..." : "Gerar Certificado e Selos"}
                  </Button>
                </div>
              </>
            )}

            {(pedido.certificado_url || pedido.selos_url) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold">Documentos Gerados</h3>
                  <div className="flex gap-3">
                    {pedido.certificado_url && (
                      <Button variant="outline" asChild>
                        <a href={pedido.certificado_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Certificado
                        </a>
                      </Button>
                    )}
                    {pedido.selos_url && (
                      <Button variant="outline" asChild>
                        <a href={pedido.selos_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Selos
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
