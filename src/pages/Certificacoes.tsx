import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CertificacaoForm } from "@/components/forms/CertificacaoForm";
import { RenovarCertificacaoDialog } from "@/components/forms/RenovarCertificacaoDialog";
import { AlterarStatusDialog } from "@/components/forms/AlterarStatusDialog";
import { Award, FileText, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import ModuleHelp from "@/components/ModuleHelp";
import { certificacoesHelp } from "@/data/moduleHelpContent";

const getStatusConfig = (status: string) => {
  const configs = {
    ativa: { color: "bg-green-500", icon: CheckCircle, label: "Ativa" },
    pendente: { color: "bg-yellow-500", icon: Clock, label: "Pendente" },
    expirada: { color: "bg-red-500", icon: AlertCircle, label: "Expirada" },
    suspensa: { color: "bg-gray-500", icon: AlertCircle, label: "Suspensa" },
    renovacao: { color: "bg-blue-500", icon: AlertCircle, label: "Em Renovação" },
  };
  return configs[status as keyof typeof configs] || configs.ativa;
};

export default function Certificacoes() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [certificacoes, setCertificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificacoes();
  }, []);

  const fetchCertificacoes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("certificacoes")
        .select(`*, produtores (nome)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertificacoes(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar certificações");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowDialog(false);
    fetchCertificacoes();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Certificações</h2>
          <p className="text-muted-foreground">Gestão de certificações e conformidades</p>
        </div>
        <div className="flex gap-2">
          <ModuleHelp moduleName="Certificações" sections={certificacoesHelp} />
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Certificação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Certificação</DialogTitle>
                <DialogDescription>Registre uma certificação de qualidade</DialogDescription>
              </DialogHeader>
              <CertificacaoForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificacoes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {certificacoes.filter(c => c.status === "ativa").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {certificacoes.filter(c => c.status === "pendente" || c.status === "renovacao").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="grid gap-4">
          {certificacoes.map((cert) => {
            const statusConfig = getStatusConfig(cert.status);
            
            return (
              <Card key={cert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{cert.tipo}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cert.produtores?.nome || "Produtor não informado"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Certificadora</p>
                      <p className="font-medium">{cert.certificadora}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Número</p>
                      <p className="font-medium">{cert.numero_certificado}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Emissão</p>
                      <p className="font-medium">{format(new Date(cert.data_emissao), "dd/MM/yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Validade</p>
                      <p className="font-medium">{format(new Date(cert.data_validade), "dd/MM/yyyy")}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/certificacoes/${cert.id}`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    
                    <AlterarStatusDialog
                      certificacaoId={cert.id}
                      statusAtual={cert.status}
                      onSuccess={fetchCertificacoes}
                    />
                    
                    {(cert.status === "pendente" || cert.status === "renovacao" || cert.status === "expirada") && (
                      <RenovarCertificacaoDialog
                        certificacaoId={cert.id}
                        onSuccess={fetchCertificacoes}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
