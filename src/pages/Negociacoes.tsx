import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Package, Send, MapPin, Calendar, Award, TrendingUp, FileText, Phone, Mail, User, DollarSign, CreditCard, CheckCircle, XCircle } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserRole } from "@/hooks/useUserRole";

export default function Negociacoes() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const [negociacoes, setNegociacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNegociacao, setSelectedNegociacao] = useState<any>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  
  // Estados para contra-proposta (comprador)
  const [valorProposto, setValorProposto] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [observacoesProposta, setObservacoesProposta] = useState("");
  const [enviandoProposta, setEnviandoProposta] = useState(false);

  // Estados para contra-proposta do vendedor
  const [valorContrapropostaVendedor, setValorContrapropostaVendedor] = useState("");
  const [observacoesContrapropostaVendedor, setObservacoesContrapropostaVendedor] = useState("");
  const [enviandoContrapropostaVendedor, setEnviandoContrapropostaVendedor] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchNegociacoes();
    }
  }, [user]);

  useEffect(() => {
    if (selectedNegociacao) {
      fetchMensagens(selectedNegociacao.id);
      generateQRCode();
    }
  }, [selectedNegociacao]);

  const generateQRCode = async () => {
    if (selectedNegociacao?.ofertas_venda?.lotes?.codigo) {
      try {
        const url = `${window.location.origin}/lote/${selectedNegociacao.ofertas_venda.lotes.codigo}`;
        const qrCode = await QRCode.toDataURL(url, { width: 200 });
        setQrCodeUrl(qrCode);
      } catch (error) {
        console.error("Erro ao gerar QR Code:", error);
      }
    }
  };

  const fetchNegociacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("negociacoes")
        .select(`
          *,
          ofertas_venda (
            *,
            lotes (
              codigo,
              certificacao,
              variedade,
              processo,
              safra,
              produtor_nome,
              data_colheita
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNegociacoes(data || []);
      
      if (data && data.length > 0 && !selectedNegociacao) {
        setSelectedNegociacao(data[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar negociações:", error);
      toast.error("Erro ao carregar negociações");
    } finally {
      setLoading(false);
    }
  };

  const fetchMensagens = async (negociacaoId: string) => {
    try {
      const { data, error } = await supabase
        .from("mensagens_negociacao")
        .select("*")
        .eq("negociacao_id", negociacaoId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMensagens(data || []);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      toast.error("Erro ao carregar mensagens");
    }
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !selectedNegociacao) return;

    try {
      setEnviando(true);
      const { error } = await supabase
        .from("mensagens_negociacao")
        .insert({
          negociacao_id: selectedNegociacao.id,
          usuario_id: user!.id,
          mensagem: novaMensagem.trim()
        });

      if (error) throw error;

      setNovaMensagem("");
      await fetchMensagens(selectedNegociacao.id);
      toast.success("Mensagem enviada!");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setEnviando(false);
    }
  };

  const enviarContraProposta = async () => {
    if (!valorProposto || !metodoPagamento || !selectedNegociacao) {
      toast.error("Preencha o valor e o método de pagamento");
      return;
    }

    try {
      setEnviandoProposta(true);
      const { error } = await supabase
        .from("negociacoes")
        .update({
          valor_proposto: parseFloat(valorProposto),
          metodo_pagamento: metodoPagamento,
          observacoes_proposta: observacoesProposta,
          proposta_status: "nova_proposta"
        })
        .eq("id", selectedNegociacao.id);

      if (error) throw error;

      // Enviar mensagem automática no chat
      await supabase.from("mensagens_negociacao").insert({
        negociacao_id: selectedNegociacao.id,
        usuario_id: user!.id,
        mensagem: `Nova proposta enviada: ${parseFloat(valorProposto).toLocaleString()} ${selectedNegociacao.ofertas_venda.moeda || "AOA"} - Método: ${metodoPagamento}`
      });

      setValorProposto("");
      setMetodoPagamento("");
      setObservacoesProposta("");
      await fetchNegociacoes();
      await fetchMensagens(selectedNegociacao.id);
      toast.success("Contra-proposta enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
      toast.error("Erro ao enviar proposta");
    } finally {
      setEnviandoProposta(false);
    }
  };

  const responderProposta = async (aceitar: boolean) => {
    if (!selectedNegociacao) return;

    try {
      const novoStatus = aceitar ? "aceita" : "rejeitada";
      
      // Se rejeitada, limpar os valores da proposta para permitir nova proposta
      const updateData = aceitar 
        ? {
            proposta_status: novoStatus,
            status: "concluida"
          }
        : {
            proposta_status: novoStatus,
            status: "aberta",
            valor_proposto: null,
            metodo_pagamento: null,
            observacoes_proposta: null
          };
      
      const { error } = await supabase
        .from("negociacoes")
        .update(updateData)
        .eq("id", selectedNegociacao.id);

      if (error) throw error;

      // Enviar mensagem automática
      await supabase.from("mensagens_negociacao").insert({
        negociacao_id: selectedNegociacao.id,
        usuario_id: user!.id,
        mensagem: aceitar 
          ? "✅ Proposta aceita! Entraremos em contato para finalizar a transação."
          : "❌ Proposta rejeitada. Por favor, envie uma nova proposta com valores diferentes."
      });

      await fetchNegociacoes();
      await fetchMensagens(selectedNegociacao.id);
      toast.success(aceitar ? "Proposta aceita!" : "Proposta rejeitada - comprador pode fazer nova proposta");
    } catch (error) {
      console.error("Erro ao responder proposta:", error);
      toast.error("Erro ao processar resposta");
    }
  };

  const enviarContrapropostaVendedor = async () => {
    if (!valorContrapropostaVendedor || !selectedNegociacao) {
      toast.error("Preencha o valor da contraproposta");
      return;
    }

    try {
      setEnviandoContrapropostaVendedor(true);
      const { error } = await supabase
        .from("negociacoes")
        .update({
          valor_contraproposta_vendedor: parseFloat(valorContrapropostaVendedor),
          observacoes_contraproposta_vendedor: observacoesContrapropostaVendedor,
          contraproposta_vendedor_status: "pendente",
          proposta_status: "rejeitada",
          status: "aberta",
          valor_proposto: null,
          metodo_pagamento: null,
          observacoes_proposta: null
        })
        .eq("id", selectedNegociacao.id);

      if (error) throw error;

      // Atualizar também a oferta no marketplace
      await supabase
        .from("ofertas_venda")
        .update({
          preco_sugerido: parseFloat(valorContrapropostaVendedor)
        })
        .eq("id", selectedNegociacao.oferta_id);

      // Enviar mensagem automática no chat
      await supabase.from("mensagens_negociacao").insert({
        negociacao_id: selectedNegociacao.id,
        usuario_id: user!.id,
        mensagem: `💰 Contraproposta do vendedor: ${parseFloat(valorContrapropostaVendedor).toLocaleString()} ${selectedNegociacao.ofertas_venda.moeda || "AOA"}${observacoesContrapropostaVendedor ? `\n\n${observacoesContrapropostaVendedor}` : ""}`
      });

      setValorContrapropostaVendedor("");
      setObservacoesContrapropostaVendedor("");
      await fetchNegociacoes();
      await fetchMensagens(selectedNegociacao.id);
      toast.success("Contraproposta enviada! O preço foi atualizado no marketplace.");
    } catch (error) {
      console.error("Erro ao enviar contraproposta:", error);
      toast.error("Erro ao enviar contraproposta");
    } finally {
      setEnviandoContrapropostaVendedor(false);
    }
  };

  const responderContrapropostaVendedor = async (aceitar: boolean) => {
    if (!selectedNegociacao) return;

    try {
      const updateData = aceitar 
        ? {
            contraproposta_vendedor_status: "aceita",
            valor_proposto: selectedNegociacao.valor_contraproposta_vendedor,
            proposta_status: "aceita",
            status: "concluida"
          }
        : {
            contraproposta_vendedor_status: "rejeitada",
            valor_contraproposta_vendedor: null,
            observacoes_contraproposta_vendedor: null
          };
      
      const { error } = await supabase
        .from("negociacoes")
        .update(updateData)
        .eq("id", selectedNegociacao.id);

      if (error) throw error;

      // Enviar mensagem automática
      await supabase.from("mensagens_negociacao").insert({
        negociacao_id: selectedNegociacao.id,
        usuario_id: user!.id,
        mensagem: aceitar 
          ? "✅ Contraproposta do vendedor aceita! Negociação concluída."
          : "❌ Contraproposta do vendedor rejeitada."
      });

      await fetchNegociacoes();
      await fetchMensagens(selectedNegociacao.id);
      toast.success(aceitar ? "Contraproposta aceita!" : "Contraproposta rejeitada");
    } catch (error) {
      console.error("Erro ao responder contraproposta:", error);
      toast.error("Erro ao processar resposta");
    }
  };

  const isComprador = selectedNegociacao?.comprador_id === user?.id;
  const isVendedor = selectedNegociacao?.vendedor_id === user?.id;

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (negociacoes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Nenhuma negociação iniciada</p>
              <p className="text-sm text-muted-foreground">
                Visite o marketplace para iniciar uma negociação
              </p>
            </div>
            <Button onClick={() => navigate("/marketplace")}>
              Ir para Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Minhas Negociações</h1>
        <p className="text-muted-foreground">Gerencie suas conversas de compra e venda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de Negociações */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Negociações Ativas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {negociacoes.map((neg) => (
                <button
                  key={neg.id}
                  onClick={() => setSelectedNegociacao(neg)}
                  className={`w-full text-left p-4 border-b hover:bg-accent transition-colors ${
                    selectedNegociacao?.id === neg.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="space-y-2">
                    <p className="font-medium line-clamp-1">
                      {neg.ofertas_venda.titulo}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {neg.status}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {neg.ofertas_venda.quantidade_disponivel} {neg.ofertas_venda.unidade}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(neg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detalhes da Produção e Chat */}
        <div className="md:col-span-2 space-y-6">
          {/* Pro-forma Comercial */}
          <Card>
            <CardHeader className="border-b bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Proposta Comercial</CardTitle>
                  </div>
                  <CardDescription>Referência: {selectedNegociacao?.id.slice(0, 8).toUpperCase()}</CardDescription>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">Data: {new Date(selectedNegociacao?.created_at || '').toLocaleDateString()}</p>
                  {selectedNegociacao?.ofertas_venda.validade_oferta && (
                    <p className="text-muted-foreground">Válido até: {new Date(selectedNegociacao.ofertas_venda.validade_oferta).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Informações do Vendedor */}
              <div className="space-y-3 pb-4 border-b">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações do Fornecedor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Nome de Contato</p>
                    <p className="font-medium">{selectedNegociacao?.ofertas_venda.contato_nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fazenda</p>
                    <p className="font-medium">{selectedNegociacao?.ofertas_venda.fazenda || 'Não especificado'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="font-medium">{selectedNegociacao?.ofertas_venda.contato_telefone}</p>
                    </div>
                  </div>
                  {selectedNegociacao?.ofertas_venda.contato_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-sm">{selectedNegociacao.ofertas_venda.contato_email}</p>
                      </div>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground">Localização</p>
                    <p className="font-medium">
                      {selectedNegociacao?.ofertas_venda.provincia}
                      {selectedNegociacao?.ofertas_venda.municipio && `, ${selectedNegociacao.ofertas_venda.municipio}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Descrição do Produto */}
              <div className="space-y-3 pb-4 border-b">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">Especificações do Produto</h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-lg">{selectedNegociacao?.ofertas_venda.titulo}</h4>
                  {selectedNegociacao?.ofertas_venda.descricao && (
                    <p className="text-sm text-muted-foreground">{selectedNegociacao.ofertas_venda.descricao}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{selectedNegociacao?.ofertas_venda.status_oferta}</Badge>
                    {selectedNegociacao?.ofertas_venda.certificado && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Certificado
                      </Badge>
                    )}
                    {selectedNegociacao?.ofertas_venda.tipo_certificacao && selectedNegociacao.ofertas_venda.tipo_certificacao.length > 0 && (
                      selectedNegociacao.ofertas_venda.tipo_certificacao.map((cert: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Detalhes Técnicos */}
              <div className="space-y-3 pb-4 border-b">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">Características Técnicas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Variedade</p>
                    <p className="font-medium text-sm">{selectedNegociacao?.ofertas_venda.variedade?.join(", ")}</p>
                  </div>
                  <div className="bg-background border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Processo</p>
                    <p className="font-medium text-sm">{selectedNegociacao?.ofertas_venda.processo}</p>
                  </div>
                  <div className="bg-background border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="font-medium text-sm">{selectedNegociacao?.ofertas_venda.status_cafe}</p>
                  </div>
                  {selectedNegociacao?.ofertas_venda.peneira && (
                    <div className="bg-background border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Peneira</p>
                      <p className="font-medium text-sm">{selectedNegociacao.ofertas_venda.peneira}</p>
                    </div>
                  )}
                  {selectedNegociacao?.ofertas_venda.umidade && (
                    <div className="bg-background border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Umidade</p>
                      <p className="font-medium text-sm">{selectedNegociacao.ofertas_venda.umidade}%</p>
                    </div>
                  )}
                  {selectedNegociacao?.ofertas_venda.classificacao && (
                    <div className="bg-background border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Classificação</p>
                      <p className="font-medium text-sm">{selectedNegociacao.ofertas_venda.classificacao}</p>
                    </div>
                  )}
                  {selectedNegociacao?.ofertas_venda.nota_qualidade && (
                    <div className="bg-background border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Pontuação</p>
                      <p className="font-medium text-sm flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        {selectedNegociacao.ofertas_venda.nota_qualidade} pts
                      </p>
                    </div>
                  )}
                  {selectedNegociacao?.ofertas_venda.altitude && (
                    <div className="bg-background border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Altitude</p>
                      <p className="font-medium text-sm">{selectedNegociacao.ofertas_venda.altitude}m</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Descritores de Sabor */}
              {selectedNegociacao?.ofertas_venda.descritores && selectedNegociacao.ofertas_venda.descritores.length > 0 && (
                <div className="space-y-3 pb-4 border-b">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">Perfil Sensorial</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNegociacao.ofertas_venda.descritores.map((descritor: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {descritor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantidade e Preço */}
              <div className="space-y-3 pb-4 border-b">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">Condições Comerciais</h3>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Quantidade Disponível</p>
                      <p className="text-2xl font-bold text-primary">
                        {selectedNegociacao?.ofertas_venda.quantidade_disponivel} {selectedNegociacao?.ofertas_venda.unidade}
                      </p>
                    </div>
                    {selectedNegociacao?.ofertas_venda.preco_sugerido && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Preço {selectedNegociacao?.ofertas_venda.negociavel && '(Negociável)'}</p>
                        <p className="text-2xl font-bold">
                          {selectedNegociacao.ofertas_venda.preco_sugerido.toLocaleString()} {selectedNegociacao.ofertas_venda.moeda || 'AOA'}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedNegociacao?.ofertas_venda.data_disponibilidade && (
                    <div className="mt-3 pt-3 border-t border-primary/20">
                      <p className="text-xs text-muted-foreground">Disponível a partir de</p>
                      <p className="font-medium">{new Date(selectedNegociacao.ofertas_venda.data_disponibilidade).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rastreabilidade */}
              {selectedNegociacao?.ofertas_venda.lotes && (
                <div className="space-y-3 pb-4 border-b">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">Rastreabilidade</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Código do Lote</p>
                        <p className="font-mono font-bold text-lg">{selectedNegociacao.ofertas_venda.lotes.codigo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Produtor</p>
                        <p className="font-medium">{selectedNegociacao.ofertas_venda.lotes.produtor_nome}</p>
                      </div>
                      {selectedNegociacao.ofertas_venda.lotes.data_colheita && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Colheita</p>
                            <p className="text-sm font-medium">{new Date(selectedNegociacao.ofertas_venda.lotes.data_colheita).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      {selectedNegociacao.ofertas_venda.lotes.safra && (
                        <div>
                          <p className="text-xs text-muted-foreground">Safra</p>
                          <p className="text-sm font-medium">{selectedNegociacao.ofertas_venda.lotes.safra}</p>
                        </div>
                      )}
                    </div>
                    {selectedNegociacao?.ofertas_venda.certificado && qrCodeUrl && (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 bg-background border-2 border-dashed rounded-lg">
                        <Award className="h-5 w-5 text-primary" />
                        <p className="text-xs font-medium text-center">Certificação Verificável</p>
                        <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                        <p className="text-xs text-muted-foreground text-center">Escaneie para verificar autenticidade</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Condições e Observações */}
              {(selectedNegociacao?.ofertas_venda.condicoes_venda || selectedNegociacao?.ofertas_venda.observacoes) && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">Termos e Condições</h3>
                  {selectedNegociacao?.ofertas_venda.condicoes_venda && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">Condições de Venda</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedNegociacao.ofertas_venda.condicoes_venda}</p>
                    </div>
                  )}
                  {selectedNegociacao?.ofertas_venda.observacoes && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">Observações</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedNegociacao.ofertas_venda.observacoes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat de Mensagens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Mensagens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Área de Mensagens */}
              <ScrollArea className="h-[350px] border rounded-lg p-4">
                <div className="space-y-4">
                  {mensagens.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma mensagem ainda</p>
                      <p className="text-sm">Envie a primeira mensagem para iniciar a conversa</p>
                    </div>
                  ) : (
                    mensagens.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.usuario_id === user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.usuario_id === user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.mensagem}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Input de Nova Mensagem */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      enviarMensagem();
                    }
                  }}
                  className="resize-none"
                  rows={2}
                />
                <Button
                  onClick={enviarMensagem}
                  disabled={!novaMensagem.trim() || enviando}
                  size="icon"
                  className="h-full"
                >
                  {enviando ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Área de Proposta Comercial */}
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {isComprador ? "Fazer Contra-Proposta" : "Proposta do Cliente"}
              </CardTitle>
              <CardDescription>
                {isComprador 
                  ? "Envie sua proposta de valor e condições de pagamento"
                  : "Revise e responda às propostas recebidas"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Exibir proposta existente se houver */}
              {selectedNegociacao?.valor_proposto && (
                <div className={`border-2 rounded-lg p-4 ${
                  selectedNegociacao.proposta_status === 'aceita' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : selectedNegociacao.proposta_status === 'rejeitada'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-primary bg-primary/5'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Proposta Atual
                    </h4>
                    <Badge variant={
                      selectedNegociacao.proposta_status === 'aceita' ? 'default' :
                      selectedNegociacao.proposta_status === 'rejeitada' ? 'destructive' :
                      'secondary'
                    }>
                      {selectedNegociacao.proposta_status === 'aceita' ? '✓ Aceita' :
                       selectedNegociacao.proposta_status === 'rejeitada' ? '✗ Rejeitada' :
                       selectedNegociacao.proposta_status === 'nova_proposta' ? 'Aguardando Resposta' :
                       'Pendente'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Valor Proposto</p>
                      <p className="text-2xl font-bold text-primary">
                        {selectedNegociacao.valor_proposto.toLocaleString()} {selectedNegociacao.ofertas_venda.moeda || 'AOA'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Método de Pagamento</p>
                      <p className="font-semibold text-lg">{selectedNegociacao.metodo_pagamento}</p>
                    </div>
                  </div>

                  {selectedNegociacao.observacoes_proposta && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Observações</p>
                      <p className="text-sm">{selectedNegociacao.observacoes_proposta}</p>
                    </div>
                  )}

                  {/* Botões de ação para vendedor */}
                  {isVendedor && selectedNegociacao.proposta_status === 'nova_proposta' && (
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button 
                        onClick={() => responderProposta(true)}
                        className="flex-1"
                        variant="default"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aceitar Proposta
                      </Button>
                      <Button 
                        onClick={() => responderProposta(false)}
                        className="flex-1"
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Exibir contraproposta do vendedor */}
              {selectedNegociacao?.valor_contraproposta_vendedor && (
                <div className={`border-2 rounded-lg p-4 ${
                  selectedNegociacao.contraproposta_vendedor_status === 'aceita' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : selectedNegociacao.contraproposta_vendedor_status === 'rejeitada'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Contraproposta do Vendedor
                    </h4>
                    <Badge variant={
                      selectedNegociacao.contraproposta_vendedor_status === 'aceita' ? 'default' :
                      selectedNegociacao.contraproposta_vendedor_status === 'rejeitada' ? 'destructive' :
                      'secondary'
                    }>
                      {selectedNegociacao.contraproposta_vendedor_status === 'aceita' ? '✓ Aceita' :
                       selectedNegociacao.contraproposta_vendedor_status === 'rejeitada' ? '✗ Rejeitada' :
                       'Aguardando Resposta'}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Novo Preço Proposto</p>
                    <p className="text-2xl font-bold text-primary">
                      {selectedNegociacao.valor_contraproposta_vendedor.toLocaleString()} {selectedNegociacao.ofertas_venda.moeda || 'AOA'}
                    </p>
                  </div>

                  {selectedNegociacao.observacoes_contraproposta_vendedor && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Observações do Vendedor</p>
                      <p className="text-sm">{selectedNegociacao.observacoes_contraproposta_vendedor}</p>
                    </div>
                  )}

                  {/* Botões de ação para comprador responder à contraproposta */}
                  {isComprador && selectedNegociacao.contraproposta_vendedor_status === 'pendente' && (
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button 
                        onClick={() => responderContrapropostaVendedor(true)}
                        className="flex-1"
                        variant="default"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aceitar Contraproposta
                      </Button>
                      <Button 
                        onClick={() => responderContrapropostaVendedor(false)}
                        className="flex-1"
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar e Fazer Nova Proposta
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Formulário de contraproposta do vendedor */}
              {isVendedor && selectedNegociacao?.valor_proposto && selectedNegociacao.proposta_status === 'nova_proposta' && (
                <div className="space-y-4 border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Enviar Contraproposta (Opcional)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      Se preferir rejeitar e propor um novo valor, preencha abaixo. O novo preço será exibido no marketplace.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorContraproposta">
                        Novo Preço ({selectedNegociacao.ofertas_venda.moeda || 'AOA'}) *
                      </Label>
                      <Input
                        id="valorContraproposta"
                        type="number"
                        placeholder="Digite o novo preço"
                        value={valorContrapropostaVendedor}
                        onChange={(e) => setValorContrapropostaVendedor(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacoesContraproposta">
                        Observações (Opcional)
                      </Label>
                      <Textarea
                        id="observacoesContraproposta"
                        placeholder="Justifique sua contraproposta..."
                        value={observacoesContrapropostaVendedor}
                        onChange={(e) => setObservacoesContrapropostaVendedor(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={enviarContrapropostaVendedor}
                      disabled={enviandoContrapropostaVendedor || !valorContrapropostaVendedor}
                      className="w-full"
                      variant="default"
                    >
                      {enviandoContrapropostaVendedor ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Contraproposta
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Formulário de nova proposta (apenas para comprador) */}
              {isComprador && !selectedNegociacao?.valor_proposto && (
                <div className="space-y-4">
                  {selectedNegociacao?.proposta_status === 'rejeitada' && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        💡 Sua proposta anterior foi rejeitada. Faça uma nova proposta com valores diferentes.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor">
                        Valor Proposto ({selectedNegociacao?.ofertas_venda.moeda || 'AOA'}) *
                      </Label>
                      <Input
                        id="valor"
                        type="number"
                        placeholder="Digite o valor"
                        value={valorProposto}
                        onChange={(e) => setValorProposto(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      {selectedNegociacao?.ofertas_venda.preco_sugerido && (
                        <p className="text-xs text-muted-foreground">
                          Preço sugerido: {selectedNegociacao.ofertas_venda.preco_sugerido.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metodo">Método de Pagamento *</Label>
                      <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                        <SelectTrigger id="metodo">
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                          <SelectItem value="deposito">Depósito Bancário</SelectItem>
                          <SelectItem value="multicaixa">Multicaixa Express</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="parcelado">Pagamento Parcelado</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações (Opcional)</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Adicione detalhes sobre sua proposta, condições especiais, prazos, etc."
                      value={observacoesProposta}
                      onChange={(e) => setObservacoesProposta(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={enviarContraProposta}
                    disabled={enviandoProposta || !valorProposto || !metodoPagamento}
                    className="w-full"
                    size="lg"
                  >
                    {enviandoProposta ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Proposta
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Informação para admin */}
              {isAdmin && !isComprador && !isVendedor && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    👤 Modo Administrador - Você está visualizando esta negociação entre comprador e vendedor.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
