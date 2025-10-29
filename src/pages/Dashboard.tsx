import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ClipboardCheck, TrendingUp, Coffee, Award, FileCheck, Building2, FileText, Eye, DollarSign, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

const stats = [
  {
    name: "Total de Lotes",
    value: "248",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Produtores Ativos",
    value: "67",
    change: "+5%",
    trend: "up",
    icon: Users,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    name: "Análises de Qualidade",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: ClipboardCheck,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    name: "Certificações Ativas",
    value: "34",
    change: "+2",
    trend: "up",
    icon: Award,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const recentBatches = [
  {
    id: "LOT-2025-001",
    producer: "Fazenda Santa Clara",
    variety: "Bourbon Amarelo",
    quantity: "1.200 kg",
    quality: "Especial",
    status: "Em processamento",
  },
  {
    id: "LOT-2025-002",
    producer: "Quinta Bela Vista",
    variety: "Catuaí Vermelho",
    quantity: "850 kg",
    quality: "Gourmet",
    status: "Pronto",
  },
  {
    id: "LOT-2024-458",
    producer: "Fazenda São José",
    variety: "Mundo Novo",
    quantity: "2.100 kg",
    quality: "Premium",
    status: "Exportado",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  const { data: produtores } = useQuery({
    queryKey: ['produtores-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produtores')
        .select('provincia, status')
        .eq('status', 'aprovado');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: lotes } = useQuery({
    queryKey: ['lotes-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lotes')
        .select('status')
        .eq('status', 'ativo');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: qualidade } = useQuery({
    queryKey: ['qualidade-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qualidade')
        .select('id');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: empresas } = useQuery({
    queryKey: ['empresas-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: pedidosCertificacao } = useQuery({
    queryKey: ['pedidos-certificacao-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pedidos_certificacao')
        .select(`
          *,
          empresas (nome_empresa)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: negociacoes } = useQuery({
    queryKey: ['negociacoes-em-andamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('negociacoes')
        .select(`
          *,
          ofertas_venda (
            titulo,
            quantidade_disponivel,
            unidade,
            preco_sugerido,
            moeda,
            contato_nome
          )
        `)
        .in('status', ['aberta', 'em_negociacao'])
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Count producers by province
  const producersByProvince = produtores?.reduce((acc, producer) => {
    const province = producer.provincia || 'Outros';
    acc[province] = (acc[province] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number }) || {};

  return (
    <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do sistema de rastreabilidade</p>
        </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Lotes
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{lotes?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Lotes ativos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtores Activos
            </CardTitle>
            <div className="p-2 rounded-lg bg-secondary/10">
              <Users className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{produtores?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Produtores aprovados</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Análises de Qualidade
            </CardTitle>
            <div className="p-2 rounded-lg bg-accent/10">
              <ClipboardCheck className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{qualidade?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Análises realizadas</p>
          </CardContent>
        </Card>

        <Card className="shadow-elegant hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Províncias Activas
            </CardTitle>
            <div className="p-2 rounded-lg bg-success/10">
              <Award className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {Object.keys(producersByProvince).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Com produtores cadastrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Quality Overview and Recent Batches */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Distribuição de Qualidade</CardTitle>
            <CardDescription>Classificação dos lotes por qualidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Premium</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-coffee" style={{ width: "45%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gourmet</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: "35%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Especial</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: "20%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">20%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Status dos Lotes</CardTitle>
            <CardDescription>Situação atual do processamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em processamento</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: "40%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">99</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pronto</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: "35%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">87</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Exportado</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "25%" }} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-12 text-right">62</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-primary" />
              <CardTitle>Lotes Recentes</CardTitle>
            </div>
            <CardDescription>Últimos lotes cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBatches.slice(0, 3).map((batch) => (
                <div
                  key={batch.id}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-primary">{batch.id}</span>
                    <Badge variant="secondary" className="text-xs">{batch.variety}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{batch.producer}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{batch.quantity}</span>
                    <Badge className="text-xs bg-gradient-coffee text-primary-foreground">{batch.quality}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <CardTitle>Acções Rápidas</CardTitle>
          </div>
          <CardDescription>Acesso rápido às funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/lotes">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Gerenciar Lotes</p>
                    <p className="text-sm text-muted-foreground">Cadastro e rastreio</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/qualidade">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <ClipboardCheck className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Análise de Qualidade</p>
                    <p className="text-sm text-muted-foreground">Testes e avaliações</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/auditorias">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-success/10">
                    <FileCheck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">Auditorias</p>
                    <p className="text-sm text-muted-foreground">Relatórios de auditoria</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Transações em Andamento */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Transações em Andamento
              </CardTitle>
              <CardDescription>Negociações ativas no marketplace</CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate("/negociacoes")}
            >
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!negociacoes || negociacoes.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nenhuma transação em andamento</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {negociacoes.map((neg: any) => (
                  <div key={neg.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-1">{neg.ofertas_venda?.titulo}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Fornecedor: {neg.ofertas_venda?.contato_nome}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {neg.status === 'aberta' ? 'Aberta' : 'Em Negociação'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-background border rounded p-2">
                        <p className="text-muted-foreground mb-1">Quantidade</p>
                        <p className="font-semibold">
                          {neg.ofertas_venda?.quantidade_disponivel} {neg.ofertas_venda?.unidade}
                        </p>
                      </div>
                      {neg.ofertas_venda?.preco_sugerido && (
                        <div className="bg-background border rounded p-2">
                          <p className="text-muted-foreground mb-1">Preço Inicial</p>
                          <p className="font-semibold">
                            {neg.ofertas_venda.preco_sugerido.toLocaleString()} {neg.ofertas_venda.moeda || 'AOA'}
                          </p>
                        </div>
                      )}
                    </div>

                    {neg.valor_proposto && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Proposta do Comprador
                          </p>
                          <Badge 
                            variant={
                              neg.proposta_status === 'aceita' ? 'default' :
                              neg.proposta_status === 'rejeitada' ? 'destructive' :
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {neg.proposta_status === 'aceita' ? '✓ Aceita' :
                             neg.proposta_status === 'rejeitada' ? '✗ Rejeitada' :
                             neg.proposta_status === 'nova_proposta' ? 'Aguardando' :
                             'Pendente'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Valor</p>
                            <p className="font-bold text-primary">
                              {neg.valor_proposto.toLocaleString()} {neg.ofertas_venda?.moeda || 'AOA'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pagamento</p>
                            <p className="font-semibold">{neg.metodo_pagamento}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(neg.created_at), 'dd/MM/yyyy HH:mm')}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate("/negociacoes")}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Solicitações Recentes */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Pedidos de Certificação */}
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Pedidos de Certificação
                </CardTitle>
                <CardDescription>Últimas solicitações de empresas</CardDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate("/empresa/auth")}
              >
                Portal Empresas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!pedidosCertificacao || pedidosCertificacao.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Nenhum pedido ainda</p>
            ) : (
              <div className="space-y-3">
                {pedidosCertificacao.map((pedido: any) => (
                  <div key={pedido.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex-1">
                      <p className="font-mono font-semibold text-sm text-primary">{pedido.numero_pedido}</p>
                      <p className="text-sm text-muted-foreground">{pedido.empresas?.nome_empresa}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(pedido.created_at), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {pedido.status.replace('_', ' ')}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/aprovar-pedido/${pedido.id}`)}
                      >
                        Processar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empresas Cadastradas */}
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Empresas Registadas
                </CardTitle>
                <CardDescription>Últimas empresas cadastradas</CardDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate("/empresa/auth")}
              >
                Portal Empresas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!empresas || empresas.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Nenhuma empresa ainda</p>
            ) : (
              <div className="space-y-3">
                {empresas.map((empresa: any) => (
                  <div key={empresa.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{empresa.nome_empresa}</p>
                      <p className="text-xs text-muted-foreground">NIF: {empresa.nif}</p>
                      <p className="text-xs text-muted-foreground">
                        {empresa.cidade}, {empresa.provincia}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(empresa.created_at), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/aprovar-empresa/${empresa.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
