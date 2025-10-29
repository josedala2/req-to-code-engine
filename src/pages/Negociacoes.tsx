import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Package, Send } from "lucide-react";
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
    }
  }, [selectedNegociacao]);

  const fetchNegociacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("negociacoes")
        .select(`
          *,
          ofertas_venda (
            titulo,
            quantidade_disponivel,
            unidade,
            status_oferta
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

        {/* Chat de Mensagens */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedNegociacao?.ofertas_venda.titulo}
            </CardTitle>
            <CardDescription>
              Status: <Badge variant="outline">{selectedNegociacao?.ofertas_venda.status_oferta}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Área de Mensagens */}
            <ScrollArea className="h-[450px] border rounded-lg p-4">
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
  );
}
