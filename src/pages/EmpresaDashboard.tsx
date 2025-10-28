import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEmpresaAuth } from "@/hooks/useEmpresaAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Building2, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  LogOut,
  Download,
  Eye
} from "lucide-react";
import mukafeLogo from "@/assets/mukafe-logo.png";
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
  certificado_url: string | null;
  selos_url: string | null;
}

export default function EmpresaDashboard() {
  const navigate = useNavigate();
  const { user, empresa, signOut, loading } = useEmpresaAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/empresa/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (empresa) {
      fetchPedidos();
    }
  }, [empresa]);

  const fetchPedidos = async () => {
    if (!empresa) return;

    try {
      const { data, error } = await supabase
        .from("pedidos_certificacao")
        .select("*")
        .eq("empresa_id", empresa.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoadingPedidos(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      navigate("/empresa/auth");
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

  if (loading || !empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={mukafeLogo} alt="MUKAFE" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold">{empresa.nome_empresa}</h1>
                <p className="text-sm text-muted-foreground">Portal de Certificações</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Company Info Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Informações da Empresa</CardTitle>
                  <CardDescription>NIF: {empresa.nif}</CardDescription>
                </div>
              </div>
              <Button onClick={() => navigate("/solicitar-certificacao")}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Solicitação
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{empresa.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{empresa.telefone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="font-medium">{empresa.cidade}, {empresa.provincia}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pedidos */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Pedidos de Certificação</CardTitle>
            <CardDescription>
              {pedidos.length === 0 
                ? "Nenhum pedido realizado ainda" 
                : `${pedidos.length} ${pedidos.length === 1 ? 'pedido' : 'pedidos'} encontrado${pedidos.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPedidos ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Carregando pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Ainda não há pedidos de certificação</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/solicitar-certificacao")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Fazer Primeira Solicitação
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido) => {
                  const statusInfo = getStatusInfo(pedido.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <Card key={pedido.id} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-mono font-bold text-lg text-primary">
                              {pedido.numero_pedido}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Solicitado em {format(new Date(pedido.data_solicitacao), 'dd/MM/yyyy HH:mm')}
                            </p>
                          </div>
                          <Badge variant="outline" className={statusInfo.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Tipo de Certificação</p>
                            <p className="font-medium">{getTipoCertificacaoLabel(pedido.tipo_certificacao)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Quantidade de Lotes</p>
                            <p className="font-medium">{pedido.quantidade_lotes}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Volume Estimado</p>
                            <p className="font-medium">
                              {pedido.volume_estimado} {pedido.unidade_volume}
                            </p>
                          </div>
                        </div>

                        {pedido.status === 'concluido' && (pedido.certificado_url || pedido.selos_url) && (
                          <>
                            <Separator className="my-4" />
                            <div className="flex gap-2">
                              {pedido.certificado_url && (
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Baixar Certificado
                                </Button>
                              )}
                              {pedido.selos_url && (
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Baixar Selos
                                </Button>
                              )}
                            </div>
                          </>
                        )}

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-4 w-full"
                          onClick={() => navigate(`/empresa/pedido/${pedido.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes e Histórico
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
