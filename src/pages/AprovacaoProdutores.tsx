import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, MapPin, Phone, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

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
  created_at: string;
}

export default function AprovacaoProdutores() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (!roleLoading && !isAdmin) {
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
      navigate("/");
      return;
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProdutores();
    }
  }, [isAdmin]);

  const fetchProdutores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produtores")
      .select("*")
      .eq("status", "pendente")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar produtores");
    } else {
      setProdutores(data || []);
    }
    setLoading(false);
  };

  const handleApproval = async (id: string, status: "aprovado" | "rejeitado") => {
    const { error } = await supabase
      .from("produtores")
      .update({
        status,
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success(
        status === "aprovado"
          ? "Produtor aprovado com sucesso!"
          : "Produtor rejeitado"
      );
      fetchProdutores();
    }
  };

  if (authLoading || roleLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Aprovação de Produtores</h2>
        <p className="text-muted-foreground">
          Gerencie as solicitações de cadastro de produtores
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : produtores.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Não há produtores pendentes de aprovação
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {produtores.map((produtor) => (
            <Card key={produtor.id} className="shadow-elegant">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{produtor.nome_fazenda}</CardTitle>
                    <CardDescription>{produtor.nome}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    <Clock className="h-3 w-3 mr-1" />
                    Pendente
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {produtor.nif && (
                    <div>
                      <span className="font-medium">NIF:</span> {produtor.nif}
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{produtor.localizacao}</span>
                  </div>
                  {produtor.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{produtor.telefone}</span>
                    </div>
                  )}
                  {produtor.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground break-all">{produtor.email}</span>
                    </div>
                  )}
                </div>

                {produtor.area && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm">
                      <span className="font-medium">Área:</span> {produtor.area}
                    </p>
                  </div>
                )}

                {produtor.variedades && produtor.variedades.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm font-medium mb-2">Variedades:</p>
                    <div className="flex flex-wrap gap-2">
                      {produtor.variedades.map((variety) => (
                        <Badge key={variety} variant="secondary">
                          {variety}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-gradient-natural"
                    onClick={() => handleApproval(produtor.id, "aprovado")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleApproval(produtor.id, "rejeitado")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
