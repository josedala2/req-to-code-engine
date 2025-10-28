import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Building2, CheckCircle, XCircle, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/Layout";

interface Empresa {
  id: string;
  nome_empresa: string;
  nif: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  provincia: string;
  responsavel_nome: string;
  responsavel_cargo: string | null;
  documento_certidao: string | null;
  documento_nif: string | null;
  documento_alvara: string | null;
  documento_outros: string | null;
  status: string;
  created_at: string;
}

export default function AprovarEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    if (id) {
      fetchEmpresa();
    }
  }, [id]);

  const fetchEmpresa = async () => {
    try {
      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setEmpresa(data);
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      toast.error("Erro ao carregar dados da empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (approved: boolean) => {
    if (!user || !empresa) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("empresas")
        .update({
          status: approved ? "aprovado" : "rejeitado",
          aprovado_por: user.id,
          aprovado_em: new Date().toISOString(),
          observacoes_aprovacao: observacoes,
        })
        .eq("id", empresa.id);

      if (error) throw error;

      toast.success(
        approved
          ? "Empresa aprovada com sucesso!"
          : "Empresa rejeitada."
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao processar aprovação:", error);
      toast.error("Erro ao processar aprovação");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!empresa) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <p className="text-center text-muted-foreground">Empresa não encontrada</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  {empresa.nome_empresa}
                </CardTitle>
                <CardDescription>
                  Cadastrado em {format(new Date(empresa.created_at), 'dd/MM/yyyy HH:mm')}
                </CardDescription>
              </div>
              <Badge variant="outline" className={
                empresa.status === 'aprovado' ? 'bg-green-500/10 text-green-700 border-green-500/20' :
                empresa.status === 'rejeitado' ? 'bg-red-500/10 text-red-700 border-red-500/20' :
                'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
              }>
                {empresa.status === 'aprovado' ? 'Aprovado' :
                 empresa.status === 'rejeitado' ? 'Rejeitado' :
                 'Pendente'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">NIF</p>
                <p className="font-semibold">{empresa.nif}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{empresa.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-semibold">{empresa.telefone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Província</p>
                <p className="font-semibold">{empresa.provincia}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cidade</p>
                <p className="font-semibold">{empresa.cidade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-semibold">{empresa.endereco}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Responsável</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-semibold">{empresa.responsavel_nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="font-semibold">{empresa.responsavel_cargo || "-"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Documentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {empresa.documento_certidao && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={empresa.documento_certidao} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Certidão Comercial
                    </a>
                  </Button>
                )}
                {empresa.documento_nif && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={empresa.documento_nif} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Comprovativo NIF
                    </a>
                  </Button>
                )}
                {empresa.documento_alvara && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={empresa.documento_alvara} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Alvará
                    </a>
                  </Button>
                )}
                {empresa.documento_outros && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={empresa.documento_outros} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Outros Documentos
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {empresa.status === 'pendente' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Adicione observações sobre esta aprovação..."
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApproval(true)}
                      disabled={submitting}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar Empresa
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleApproval(false)}
                      disabled={submitting}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
