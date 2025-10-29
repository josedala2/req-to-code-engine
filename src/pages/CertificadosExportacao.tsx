import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, FileText, Download, Eye, Plus, Search, Plane, Edit } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateExportCertificate } from "@/lib/exportCertificateGenerator";

export default function CertificadosExportacao() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: certificados, isLoading, refetch } = useQuery({
    queryKey: ["certificados-exportacao"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificados_exportacao")
        .select(`
          *,
          produtores (
            nome,
            nif,
            localizacao,
            provincia
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getLotesInfo = async (lotesIds: string[]) => {
    const { data, error } = await supabase
      .from("lotes")
      .select("*")
      .in("id", lotesIds);

    if (error) throw error;
    return data;
  };

  const handleDownloadCertificate = async (certificado: any) => {
    try {
      toast.loading("Gerando certificado...");

      const lotes = await getLotesInfo(certificado.lotes_ids);

      const certificadoData = {
        numero_certificado: certificado.numero_certificado,
        data_emissao: certificado.data_emissao || new Date().toISOString(),
        data_validade: certificado.data_validade,
        produtor_nome: certificado.produtores?.nome || "N/A",
        produtor_nif: certificado.produtores?.nif,
        produtor_localizacao: `${certificado.produtores?.localizacao}, ${certificado.produtores?.provincia}`,
        destino_pais: certificado.destino_pais,
        destino_cidade: certificado.destino_cidade,
        importador_nome: certificado.importador_nome,
        importador_documento: certificado.importador_documento,
        quantidade_total: certificado.quantidade_total,
        unidade: certificado.unidade,
        valor_total: certificado.valor_total,
        moeda: certificado.moeda,
        lotes: lotes.map((lote: any) => ({
          codigo: lote.codigo,
          variedade: lote.variedade,
          processo: lote.processo,
          quantidade: lote.quantidade,
          unidade: lote.unidade,
          safra: lote.safra,
          certificacao: lote.certificacao,
          produtor_nome: lote.produtor_nome
        })),
        normas_cumpridas: certificado.normas_cumpridas || [],
        observacoes: certificado.observacoes
      };

      const pdf = await generateExportCertificate(certificadoData);
      pdf.save(`Certificado_Exportacao_${certificado.numero_certificado}.pdf`);

      toast.dismiss();
      toast.success("Certificado gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar certificado:", error);
      toast.dismiss();
      toast.error("Erro ao gerar certificado");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pendente: "outline",
      aprovado: "secondary",
      emitido: "default",
      rejeitado: "destructive"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredCertificados = certificados?.filter((cert) =>
    cert.numero_certificado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.produtores?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.importador_nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Plane className="h-8 w-8 text-primary" />
            Certificados de Exportação
          </h1>
          <p className="text-muted-foreground">Gerencie autorizações de exportação de café</p>
        </div>
        <Button onClick={() => navigate("/certificados-exportacao/novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Certificado
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por número, produtor ou importador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Certificados */}
      {!filteredCertificados || filteredCertificados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhum certificado encontrado</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm ? "Tente ajustar sua pesquisa" : "Comece criando um novo certificado de exportação"}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate("/certificados-exportacao/novo")}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Certificado
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCertificados.map((certificado) => (
            <Card key={certificado.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {certificado.numero_certificado}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Exportador: {certificado.produtores?.nome}
                    </CardDescription>
                  </div>
                  {getStatusBadge(certificado.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Importador</p>
                    <p className="font-medium">{certificado.importador_nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destino</p>
                    <p className="font-medium">{certificado.destino_pais}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantidade Total</p>
                    <p className="font-medium">{certificado.quantidade_total} {certificado.unidade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lotes Incluídos</p>
                    <p className="font-medium">{certificado.lotes_ids.length} lote(s)</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data de Solicitação</p>
                    <p className="font-medium">{format(new Date(certificado.data_solicitacao), "dd/MM/yyyy")}</p>
                  </div>
                  {certificado.data_validade && (
                    <div>
                      <p className="text-xs text-muted-foreground">Validade</p>
                      <p className="font-medium">{format(new Date(certificado.data_validade), "dd/MM/yyyy")}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/certificados-exportacao/${certificado.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  {(certificado.status === "pendente" || certificado.status === "aprovado") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/certificados-exportacao/${certificado.id}/editar`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                  {certificado.status === "emitido" && (
                    <Button
                      size="sm"
                      onClick={() => handleDownloadCertificate(certificado)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Certificado
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
