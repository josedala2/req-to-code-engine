import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Phone, Mail, MapPin, Calendar, Package, Award, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Marketplace() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroProvincia, setFiltroProvincia] = useState("todas");

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ofertas_venda")
        .select("*")
        .in("status_oferta", ["disponivel", "em_negociacao"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOfertas(data || []);
    } catch (error) {
      console.error("Erro ao buscar ofertas:", error);
      toast.error("Erro ao carregar ofertas");
    } finally {
      setLoading(false);
    }
  };

  const incrementarVisualizacao = async (id: string, visualizacoes: number) => {
    await supabase
      .from("ofertas_venda")
      .update({ visualizacoes: visualizacoes + 1 })
      .eq("id", id);
  };

  const provincias = [...new Set(ofertas.map(o => o.provincia))];

  const ofertasFiltradas = ofertas.filter(oferta => {
    const matchSearch = 
      oferta.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oferta.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oferta.variedade?.some((v: string) => v.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchStatus = filtroStatus === "todos" || oferta.status_cafe === filtroStatus;
    const matchProvincia = filtroProvincia === "todas" || oferta.provincia === filtroProvincia;

    return matchSearch && matchStatus && matchProvincia;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Marketplace de Café Angolano</h1>
        <p className="text-muted-foreground">Conectando produtores e compradores de café de qualidade</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, descrição ou variedade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status do café" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="colhido">Colhido</SelectItem>
                <SelectItem value="processado">Processado</SelectItem>
                <SelectItem value="verde">Café Verde</SelectItem>
                <SelectItem value="torrado">Torrado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroProvincia} onValueChange={setFiltroProvincia}>
              <SelectTrigger>
                <SelectValue placeholder="Província" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as províncias</SelectItem>
                {provincias.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{ofertasFiltradas.length}</p>
              <p className="text-sm text-muted-foreground">Ofertas Disponíveis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">
                {ofertasFiltradas.filter(o => o.certificado).length}
              </p>
              <p className="text-sm text-muted-foreground">Cafés Certificados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">
                {ofertasFiltradas.reduce((acc, o) => acc + (o.quantidade_disponivel || 0), 0).toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">Kg Disponíveis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Ofertas */}
      {ofertasFiltradas.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Nenhuma oferta encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertasFiltradas.map((oferta) => (
            <Card key={oferta.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{oferta.titulo}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {oferta.descricao || "Sem descrição"}
                    </CardDescription>
                  </div>
                  {oferta.certificado && (
                    <Award className="h-6 w-6 text-success flex-shrink-0 ml-2" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{oferta.status_cafe}</Badge>
                  <Badge variant={oferta.status_oferta === "disponivel" ? "default" : "secondary"}>
                    {oferta.status_oferta === "disponivel" ? "Disponível" : "Em negociação"}
                  </Badge>
                  {oferta.certificado && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Certificado
                    </Badge>
                  )}
                </div>

                {/* Variedades */}
                {oferta.variedade && oferta.variedade.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Variedades:</p>
                    <div className="flex gap-1 flex-wrap">
                      {oferta.variedade.map((v: string, i: number) => (
                        <Badge key={i} variant="secondary">{v}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantidade e Preço */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="font-semibold">
                      {oferta.quantidade_disponivel} {oferta.unidade}
                    </p>
                  </div>
                  {oferta.preco_sugerido && (
                    <div>
                      <p className="text-sm text-muted-foreground">Preço sugerido</p>
                      <p className="font-semibold">
                        {oferta.preco_sugerido} {oferta.moeda}
                        {oferta.negociavel && <span className="text-xs text-muted-foreground"> /neg</span>}
                      </p>
                    </div>
                  )}
                </div>

                {/* Qualidade */}
                {oferta.nota_qualidade && (
                  <div>
                    <p className="text-sm text-muted-foreground">Nota de Qualidade</p>
                    <p className="text-2xl font-bold text-primary">{oferta.nota_qualidade}</p>
                  </div>
                )}

                {/* Localização */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{oferta.provincia}</span>
                  {oferta.municipio && <span>• {oferta.municipio}</span>}
                </div>

                {/* Data de colheita */}
                {oferta.data_colheita && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Colhido em {new Date(oferta.data_colheita).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Contato */}
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-medium">Contato:</p>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{oferta.contato_nome}</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${oferta.contato_telefone}`} className="hover:underline">
                        {oferta.contato_telefone}
                      </a>
                    </div>
                    {oferta.contato_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${oferta.contato_email}`} className="hover:underline">
                          {oferta.contato_email}
                        </a>
                      </div>
                    )}
                    {oferta.contato_whatsapp && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          incrementarVisualizacao(oferta.id, oferta.visualizacoes);
                          window.open(`https://wa.me/${oferta.contato_whatsapp.replace(/\D/g, '')}`, '_blank');
                        }}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Iniciar Negociação via WhatsApp
                      </Button>
                    )}
                  </div>
                </div>

                {/* Visualizações */}
                <p className="text-xs text-muted-foreground text-center">
                  {oferta.visualizacoes || 0} visualizações
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}