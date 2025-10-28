import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEmpresaAuth } from "@/hooks/useEmpresaAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Package
} from "lucide-react";
import { format } from "date-fns";

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
}

interface HistoricoItem {
  id: string;
  status_anterior: string | null;
  status_novo: string;
  observacoes: string | null;
  created_at: string;
}

export default function EmpresaPedidoDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, empresa, loading } = useEmpresaAuth();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/empresa/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (id && empresa) {
      fetchPedidoData();
    }
  }, [id, empresa]);

  const fetchPedidoData = async () => {
    if (!id || !empresa) return;

    try {
      // Fetch pedido
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedidos_certificacao")
        .select("*")
        .eq("id", id)
        .eq("empresa_id", empresa.id)
        .maybeSingle();

      if (pedidoError) throw pedidoError;
      if (!pedidoData) {
        toast.error("Pedido não encontrado");
        navigate("/empresa/dashboard");
        return;
      }

      setPedido(pedidoData);

      // Fetch historico
      const { data: historicoData, error: historicoError } = await supabase
        .from("historico_pedidos")
        .select("*")
        .eq("pedido_id", id)
        .order("created_at", { ascending: false });

      if (historicoError) throw historicoError;
      setHistorico(historicoData || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar informações do pedido");
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      pendente: { 
        label: "Pendente", 
        color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
        icon: Clock
      },
      documentacao_analise: { 
        label: "Documentação em Análise", 
        color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
        icon: FileText
      },
      auditoria_agendada: { 
        label: "Auditoria Agendada", 
        color: "bg-purple-500/10 text-purple-700 border-purple-500/20",
        icon: Clock
      },
      auditoria_realizada: { 
        label: "Auditoria Realizada", 
        color: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
        icon: CheckCircle2
      },
      em_emissao: { 
        label: "Certificado em Emissão", 
        color: "bg-orange-500/10 text-orange-700 border-orange-500/20",
        icon: FileText
      },
      concluido: { 
        label: "Concluído", 
        color: "bg-green-500/10 text-green-700 border-green-500/20",
        icon: CheckCircle2
      },
      rejeitado: { 
        label: "Rejeitado", 
        color: "bg-red-500/10 text-red-700 border-red-500/20",
        icon: XCircle
      },
    };
    return statusMap[status] || statusMap.pendente;
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

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return null;
  }

  const statusInfo = getStatusInfo(pedido.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 p-4">
      <div className="container mx-auto max-w-4xl py-8 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/empresa/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        {/* Header Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl font-mono text-primary mb-2">
                  {pedido.numero_pedido}
                </CardTitle>
                <CardDescription>
                  Solicitado em {format(new Date(pedido.data_solicitacao), 'dd/MM/yyyy HH:mm')}
                </CardDescription>
              </div>
              <Badge variant="outline" className={`${statusInfo.color} text-base px-4 py-2`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusInfo.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Certificação</p>
                  <p className="font-semibold">{getTipoCertificacaoLabel(pedido.tipo_certificacao)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Quantidade de Lotes</p>
                  <p className="font-semibold">{pedido.quantidade_lotes}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Volume Estimado</p>
                  <p className="font-semibold">
                    {pedido.volume_estimado} {pedido.unidade_volume}
                  </p>
                </div>
              </div>
            </div>

            {pedido.observacoes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Observações</p>
                  <p className="text-sm">{pedido.observacoes}</p>
                </div>
              </>
            )}

            {pedido.status === 'concluido' && (pedido.certificado_url || pedido.selos_url) && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-semibold mb-3">Documentos Disponíveis</p>
                  <div className="flex gap-3">
                    {pedido.certificado_url && (
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Certificado
                      </Button>
                    )}
                    {pedido.selos_url && (
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Selos
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Histórico do Processo</CardTitle>
            <CardDescription>
              Acompanhe todas as etapas do seu pedido de certificação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {historico.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum histórico disponível
              </p>
            ) : (
              <div className="space-y-4">
                {historico.map((item, index) => {
                  const isFirst = index === 0;
                  const statusInfo = getStatusInfo(item.status_novo);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`rounded-full p-2 ${isFirst ? 'bg-primary' : 'bg-muted'}`}>
                          <StatusIcon className={`h-4 w-4 ${isFirst ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        </div>
                        {index < historico.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}
                          </span>
                        </div>
                        {item.observacoes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {item.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Etapas do Processo */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Etapas do Processo de Certificação</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>Recepção e análise da documentação enviada</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>Agendamento da auditoria com o produtor</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>Realização da auditoria in loco</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>Análise dos resultados e emissão do certificado</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">5.</span>
                <span>Disponibilização dos selos de embalagem</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
