import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  Edit,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateAuditReport } from "@/lib/auditReportGenerator";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuditoriaForm } from "@/components/forms/AuditoriaForm";
import { useState } from "react";

const statusColors = {
  em_andamento: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  concluida: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  aprovada: "bg-green-500/10 text-green-500 border-green-500/20",
  reprovada: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusIcons = {
  em_andamento: Clock,
  concluida: FileText,
  aprovada: CheckCircle2,
  reprovada: XCircle,
};

const statusLabels = {
  em_andamento: "Em Andamento",
  concluida: "Concluída",
  aprovada: "Aprovada",
  reprovada: "Reprovada",
};

export default function AuditoriaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: auditoria, isLoading, refetch } = useQuery({
    queryKey: ["auditoria", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auditorias")
        .select(`
          *,
          lotes(id, codigo),
          produtores(id, nome)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleGenerateReport = async () => {
    if (!auditoria) return;

    try {
      await generateAuditReport({
        codigo: auditoria.codigo,
        data_auditoria: auditoria.data_auditoria,
        auditor_nome: auditoria.auditor_nome,
        auditor_certificacao: auditoria.auditor_certificacao || undefined,
        tipo_auditoria: auditoria.tipo_auditoria,
        status: auditoria.status,
        produtor_nome: auditoria.produtores?.nome,
        lote_codigo: auditoria.lotes?.codigo,
        criterios_avaliados: Array.isArray(auditoria.criterios_avaliados) ? auditoria.criterios_avaliados : [],
        pontuacao_total: auditoria.pontuacao_total || undefined,
        pontuacao_maxima: auditoria.pontuacao_maxima || undefined,
        conformidades: Array.isArray(auditoria.conformidades) ? auditoria.conformidades : [],
        nao_conformidades: Array.isArray(auditoria.nao_conformidades) ? auditoria.nao_conformidades : [],
        observacoes: auditoria.observacoes || undefined,
        recomendacoes: auditoria.recomendacoes || undefined,
        resultado: auditoria.resultado || undefined,
        certificado_emitido: auditoria.certificado_emitido,
        validade_certificado: auditoria.validade_certificado || undefined,
      });

      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    }
  };

  const handleSuccess = () => {
    setIsEditDialogOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Carregando auditoria...</div>
      </div>
    );
  }

  if (!auditoria) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Auditoria não encontrada</p>
        <Button onClick={() => navigate("/auditorias")}>Voltar para Auditorias</Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[auditoria.status as keyof typeof statusIcons];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/auditorias")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-foreground">{auditoria.codigo}</h2>
              <Badge className={statusColors[auditoria.status as keyof typeof statusColors]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusLabels[auditoria.status as keyof typeof statusLabels]}
              </Badge>
            </div>
            <p className="text-muted-foreground">Detalhes da auditoria</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Auditoria</DialogTitle>
                <DialogDescription>Atualize as informações da auditoria</DialogDescription>
              </DialogHeader>
              <AuditoriaForm
                auditoriaId={auditoria.id}
                defaultValues={{
                  codigo: auditoria.codigo,
                  lote_id: auditoria.lote_id || undefined,
                  produtor_id: auditoria.produtor_id || undefined,
                  data_auditoria: auditoria.data_auditoria,
                  auditor_nome: auditoria.auditor_nome,
                  auditor_certificacao: auditoria.auditor_certificacao || undefined,
                  tipo_auditoria: auditoria.tipo_auditoria,
                  status: auditoria.status as "em_andamento" | "concluida" | "aprovada" | "reprovada",
                  pontuacao_total: auditoria.pontuacao_total?.toString(),
                  pontuacao_maxima: auditoria.pontuacao_maxima?.toString(),
                  conformidades: Array.isArray(auditoria.conformidades) ? auditoria.conformidades.join("\n") : "",
                  nao_conformidades: Array.isArray(auditoria.nao_conformidades) ? auditoria.nao_conformidades.join("\n") : "",
                  observacoes: auditoria.observacoes || undefined,
                  recomendacoes: auditoria.recomendacoes || undefined,
                  resultado: auditoria.resultado || undefined,
                  certificado_emitido: auditoria.certificado_emitido,
                  validade_certificado: auditoria.validade_certificado || undefined,
                }}
                onSuccess={handleSuccess}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={handleGenerateReport} className="gap-2">
            <Download className="h-4 w-4" />
            Gerar Relatório PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Data da Auditoria</span>
              <p className="font-medium">
                {format(new Date(auditoria.data_auditoria), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tipo de Auditoria</span>
              <p className="font-medium capitalize">{auditoria.tipo_auditoria}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Auditor</span>
              <p className="font-medium">{auditoria.auditor_nome}</p>
            </div>
            {auditoria.auditor_certificacao && (
              <div>
                <span className="text-sm text-muted-foreground">Certificação do Auditor</span>
                <p className="font-medium">{auditoria.auditor_certificacao}</p>
              </div>
            )}
            {auditoria.produtores && (
              <div>
                <span className="text-sm text-muted-foreground">Produtor</span>
                <p className="font-medium">{auditoria.produtores.nome}</p>
              </div>
            )}
            {auditoria.lotes && (
              <div>
                <span className="text-sm text-muted-foreground">Lote</span>
                <p className="font-medium">{auditoria.lotes.codigo}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pontuação e Certificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {auditoria.pontuacao_total !== null && auditoria.pontuacao_maxima !== null && (
              <div>
                <span className="text-sm text-muted-foreground">Pontuação</span>
                <p className="text-2xl font-bold">
                  {auditoria.pontuacao_total} / {auditoria.pontuacao_maxima}
                </p>
                <p className="text-sm text-muted-foreground">
                  {((auditoria.pontuacao_total / auditoria.pontuacao_maxima) * 100).toFixed(1)}%
                </p>
              </div>
            )}
            <div>
              <span className="text-sm text-muted-foreground">Certificado</span>
              <div className="flex items-center gap-2 mt-1">
                {auditoria.certificado_emitido ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-500">Emitido</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Não emitido</span>
                  </>
                )}
              </div>
            </div>
            {auditoria.validade_certificado && (
              <div>
                <span className="text-sm text-muted-foreground">Validade</span>
                <p className="font-medium">
                  {format(new Date(auditoria.validade_certificado), "dd/MM/yyyy")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {auditoria.conformidades && auditoria.conformidades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Conformidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {auditoria.conformidades.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {auditoria.nao_conformidades && auditoria.nao_conformidades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Não Conformidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {auditoria.nao_conformidades.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {auditoria.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{auditoria.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {auditoria.recomendacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{auditoria.recomendacoes}</p>
          </CardContent>
        </Card>
      )}

      {auditoria.resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado Final</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap font-medium">{auditoria.resultado}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
