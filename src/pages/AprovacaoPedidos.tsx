import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { FileCheck, Building2, Calendar, Package, Hash } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Pedido {
  id: string;
  numero_pedido: string;
  tipo_certificacao: string;
  quantidade_lotes: number;
  volume_estimado: number;
  unidade_volume: string;
  data_solicitacao: string;
  empresas: {
    nome_empresa: string;
  };
}

export default function AprovacaoPedidos() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPedidos();
    }
  }, [isAdmin]);

  const fetchPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pedidos_certificacao")
      .select(`
        *,
        empresas (
          nome_empresa
        )
      `)
      .eq("status", "pendente")
      .order("data_solicitacao", { ascending: false });

    if (!error && data) {
      setPedidos(data);
    }
    setLoading(false);
  };

  const getTipoCertificacaoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      organico: "Orgânico",
      fair_trade: "Fair Trade",
      rainforest: "Rainforest Alliance",
      utz: "UTZ Certified",
      cafe_com_carinho: "Café com Carinho"
    };
    return labels[tipo] || tipo;
  };

  if (authLoading || roleLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Aprovação de Pedidos de Certificação</h1>
        <p className="text-muted-foreground mt-2">
          Pedidos aguardando aprovação e geração de certificados
        </p>
      </div>

      {pedidos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Não há pedidos de certificação pendentes no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {pedidos.map((pedido) => (
            <Card 
              key={pedido.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/aprovar-pedido/${pedido.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-muted text-orange-600">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{pedido.numero_pedido}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {getTipoCertificacaoLabel(pedido.tipo_certificacao)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Pendente</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{pedido.empresas?.nome_empresa}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{pedido.quantidade_lotes} lotes</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>{pedido.volume_estimado} {pedido.unidade_volume}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Solicitado em {format(new Date(pedido.data_solicitacao), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
