import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Package, Send, MapPin, Calendar, Award, TrendingUp } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Negociacoes() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [negociacoes, setNegociacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNegociacao, setSelectedNegociacao] = useState<any>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

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
          {/* Informações da Produção */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedNegociacao?.ofertas_venda.titulo}</CardTitle>
              <CardDescription className="flex gap-2 items-center flex-wrap">
                <Badge variant="outline">{selectedNegociacao?.ofertas_venda.status_oferta}</Badge>
                {selectedNegociacao?.ofertas_venda.certificado && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Certificado
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Informações Básicas */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantidade Disponível</p>
                    <p className="text-lg font-semibold">
                      {selectedNegociacao?.ofertas_venda.quantidade_disponivel} {selectedNegociacao?.ofertas_venda.unidade}
                    </p>
                  </div>
                  
                  {selectedNegociacao?.ofertas_venda.preco_sugerido && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Preço Sugerido</p>
                      <p className="text-lg font-semibold">
                        {selectedNegociacao?.ofertas_venda.preco_sugerido} {selectedNegociacao?.ofertas_venda.moeda || 'AOA'}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Variedade</p>
                    <p className="text-sm">{selectedNegociacao?.ofertas_venda.variedade?.join(", ")}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processo</p>
                    <p className="text-sm">{selectedNegociacao?.ofertas_venda.processo}</p>
                  </div>

                  {selectedNegociacao?.ofertas_venda.classificacao && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Classificação</p>
                      <p className="text-sm">{selectedNegociacao?.ofertas_venda.classificacao}</p>
                    </div>
                  )}

                  {selectedNegociacao?.ofertas_venda.nota_qualidade && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nota de Qualidade</p>
                        <p className="text-sm font-semibold">{selectedNegociacao?.ofertas_venda.nota_qualidade} pontos</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Localização e Informações Complementares */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Localização</p>
                      <p className="text-sm">
                        {selectedNegociacao?.ofertas_venda.provincia}
                        {selectedNegociacao?.ofertas_venda.municipio && `, ${selectedNegociacao.ofertas_venda.municipio}`}
                      </p>
                      {selectedNegociacao?.ofertas_venda.altitude && (
                        <p className="text-xs text-muted-foreground">Altitude: {selectedNegociacao.ofertas_venda.altitude}m</p>
                      )}
                    </div>
                  </div>

                  {selectedNegociacao?.ofertas_venda.fazenda && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fazenda</p>
                      <p className="text-sm">{selectedNegociacao.ofertas_venda.fazenda}</p>
                    </div>
                  )}

                  {selectedNegociacao?.ofertas_venda.data_colheita && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Data de Colheita</p>
                        <p className="text-sm">{new Date(selectedNegociacao.ofertas_venda.data_colheita).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  {selectedNegociacao?.ofertas_venda.lotes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lote</p>
                      <p className="text-sm font-mono">{selectedNegociacao.ofertas_venda.lotes.codigo}</p>
                      <p className="text-xs text-muted-foreground">Produtor: {selectedNegociacao.ofertas_venda.lotes.produtor_nome}</p>
                    </div>
                  )}

                  {selectedNegociacao?.ofertas_venda.certificado && qrCodeUrl && (
                    <div className="flex flex-col items-start gap-2 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">QR Code de Certificação</p>
                      </div>
                      <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                      <p className="text-xs text-muted-foreground">Escaneie para verificar certificação</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedNegociacao?.ofertas_venda.descricao && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Descrição</p>
                  <p className="text-sm">{selectedNegociacao.ofertas_venda.descricao}</p>
                </div>
              )}

              {selectedNegociacao?.ofertas_venda.descritores && selectedNegociacao.ofertas_venda.descritores.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Descritores</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNegociacao.ofertas_venda.descritores.map((descritor: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {descritor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedNegociacao?.ofertas_venda.condicoes_venda && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Condições de Venda</p>
                  <p className="text-sm">{selectedNegociacao.ofertas_venda.condicoes_venda}</p>
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
        </div>
      </div>
    </div>
  );
}
