import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, History as HistoryIcon } from "lucide-react";
import { RenovarCertificacaoDialog } from "@/components/forms/RenovarCertificacaoDialog";
import { AlterarStatusDialog } from "@/components/forms/AlterarStatusDialog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function CertificacaoDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [certificacao, setCertificacao] = useState<any>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: cert } = await supabase
        .from("certificacoes")
        .select(`*, produtores (nome, nome_fazenda)`)
        .eq("id", id)
        .single();

      const { data: hist } = await supabase
        .from("certificacoes_historico")
        .select("*")
        .eq("certificacao_id", id)
        .order("data_alteracao", { ascending: false });

      setCertificacao(cert);
      setHistorico(hist || []);
    } catch (error: any) {
      toast.error("Erro ao carregar certificação");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Carregando...</div>;
  if (!certificacao) return <div className="text-center py-12">Certificação não encontrada</div>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/certificacoes")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{certificacao.tipo}</h1>
            <p className="text-muted-foreground">{certificacao.produtores?.nome}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <AlterarStatusDialog
            certificacaoId={certificacao.id}
            statusAtual={certificacao.status}
            onSuccess={fetchData}
          />
          <RenovarCertificacaoDialog
            certificacaoId={certificacao.id}
            onSuccess={fetchData}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Certificadora</p>
            <p className="font-medium">{certificacao.certificadora}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Número</p>
            <p className="font-medium">{certificacao.numero_certificado}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Emissão</p>
            <p className="font-medium">{format(new Date(certificacao.data_emissao), "dd/MM/yyyy")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Validade</p>
            <p className="font-medium">{format(new Date(certificacao.data_validade), "dd/MM/yyyy")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5" />
            Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhum histórico</p>
          ) : (
            <div className="space-y-3">
              {historico.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.tipo_alteracao}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(item.data_alteracao), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                  {item.status_anterior && (
                    <p className="text-sm">
                      <Badge variant="outline">{item.status_anterior}</Badge> →{" "}
                      <Badge variant="outline">{item.status_novo}</Badge>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
