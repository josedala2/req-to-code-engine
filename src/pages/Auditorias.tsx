import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuditoriaForm } from "@/components/forms/AuditoriaForm";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ModuleHelp from "@/components/ModuleHelp";
import { auditoriasHelp } from "@/data/moduleHelpContent";

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

export default function Auditorias() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { data: auditorias, isLoading, refetch } = useQuery({
    queryKey: ["auditorias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auditorias")
        .select(`
          *,
          lotes(codigo),
          produtores(nome)
        `)
        .order("data_auditoria", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredAuditorias = auditorias?.filter((auditoria) =>
    auditoria.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auditoria.auditor_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auditoria.tipo_auditoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuccess = () => {
    setIsDialogOpen(false);
    refetch();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Auditorias</h2>
          <p className="text-muted-foreground">Gestão de auditorias e relatórios</p>
        </div>
        <div className="flex gap-2">
          <ModuleHelp moduleName="Auditorias" sections={auditoriasHelp} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Auditoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Auditoria</DialogTitle>
                <DialogDescription>
                  Cadastre uma nova auditoria no sistema
                </DialogDescription>
              </DialogHeader>
              <AuditoriaForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, auditor ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando auditorias...</div>
          ) : filteredAuditorias && filteredAuditorias.length > 0 ? (
            <div className="grid gap-4">
              {filteredAuditorias.map((auditoria) => {
                const StatusIcon = statusIcons[auditoria.status as keyof typeof statusIcons];
                return (
                  <Card
                    key={auditoria.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/auditorias/${auditoria.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <StatusIcon className="h-5 w-5" />
                            <span className="font-mono text-lg font-bold text-primary">
                              {auditoria.codigo}
                            </span>
                            <Badge className={statusColors[auditoria.status as keyof typeof statusColors]}>
                              {statusLabels[auditoria.status as keyof typeof statusLabels]}
                            </Badge>
                            <Badge variant="outline">{auditoria.tipo_auditoria}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mt-4">
                            <div>
                              <span className="font-medium text-foreground">Data:</span>{" "}
                              {format(new Date(auditoria.data_auditoria), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Auditor:</span>{" "}
                              {auditoria.auditor_nome}
                            </div>
                            {auditoria.produtores && (
                              <div>
                                <span className="font-medium text-foreground">Produtor:</span>{" "}
                                {auditoria.produtores.nome}
                              </div>
                            )}
                            {auditoria.lotes && (
                              <div>
                                <span className="font-medium text-foreground">Lote:</span>{" "}
                                {auditoria.lotes.codigo}
                              </div>
                            )}
                            {auditoria.pontuacao_total && auditoria.pontuacao_maxima && (
                              <div>
                                <span className="font-medium text-foreground">Pontuação:</span>{" "}
                                {auditoria.pontuacao_total}/{auditoria.pontuacao_maxima} (
                                {((auditoria.pontuacao_total / auditoria.pontuacao_maxima) * 100).toFixed(1)}%)
                              </div>
                            )}
                            {auditoria.certificado_emitido && (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-green-500 font-medium">Certificado Emitido</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma auditoria encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
