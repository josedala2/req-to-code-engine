import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, MapPin, Phone, Mail, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProdutorForm } from "@/components/forms/ProdutorForm";
import ModuleHelp from "@/components/ModuleHelp";
import { produtoresHelp } from "@/data/moduleHelpContent";
import { generateProdutoresPDF } from "@/lib/pdfGenerator";

interface Produtor {
  id: string;
  nome: string;
  nif: string | null;
  email: string | null;
  telefone: string | null;
  nome_fazenda: string;
  localizacao: string;
  area: string | null;
  altitude: string | null;
  variedades: string[] | null;
  certificacoes: string[] | null;
  observacoes: string | null;
  status: "pendente" | "aprovado" | "rejeitado";
  contact?: {
    phone: string;
    email: string;
  };
}

export default function Produtores() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProdutores();
  }, []);

  const fetchProdutores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produtores")
      .select("*")
      .eq("status", "aprovado")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar produtores:", error);
    } else {
      setProdutores(data || []);
    }
    setLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Produtores</h2>
          <p className="text-muted-foreground">Gestão de produtores e fazendas</p>
        </div>
        <div className="flex gap-2">
          <ModuleHelp moduleName="Produtores" sections={produtoresHelp} />
          <Button onClick={generateProdutoresPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-coffee hover:opacity-90 shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produtor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Produtor</DialogTitle>
                <DialogDescription>
                  Preencha os dados do produtor e da propriedade
                </DialogDescription>
              </DialogHeader>
              <ProdutorForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtor por nome, localização ou certificação..."
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando produtores...</p>
        </div>
      ) : produtores.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum produtor aprovado encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {produtores.map((producer) => (
            <Card key={producer.id} className="shadow-elegant hover:shadow-glow transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{producer.nome_fazenda}</CardTitle>
                <CardDescription>{producer.nome}</CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{producer.localizacao}</span>
                  </div>
                  {producer.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{producer.telefone}</span>
                    </div>
                  )}
                  {producer.email && (
                    <div className="flex items-start gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground break-all">{producer.email}</span>
                    </div>
                  )}
                </div>

                {producer.area && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-medium mb-2">Área: {producer.area}</p>
                  </div>
                )}

                {producer.variedades && producer.variedades.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-medium mb-2">Variedades:</p>
                    <div className="flex flex-wrap gap-2">
                      {producer.variedades.map((variety) => (
                        <Badge key={variety} variant="secondary">
                          {variety}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {producer.certificacoes && producer.certificacoes.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-medium mb-2">Certificações:</p>
                    <div className="flex flex-wrap gap-2">
                      {producer.certificacoes.map((cert) => (
                        <Badge key={cert} className="bg-gradient-natural text-secondary-foreground">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate(`/produtores/${producer.id}`)}
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
