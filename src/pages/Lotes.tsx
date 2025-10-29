import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Calendar, Weight, MapPin, FileText, Tag, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoteForm } from "@/components/forms/LoteForm";
import { SealForm } from "@/components/forms/SealForm";
import { AlterarStatusLoteDialog } from "@/components/forms/AlterarStatusLoteDialog";
import { generateLotesPDF } from "@/lib/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Em processamento":
      return "bg-warning/10 text-warning border-warning/20";
    case "Pronto":
      return "bg-success/10 text-success border-success/20";
    case "Exportado":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getQualityColor = (quality: string) => {
  switch (quality) {
    case "Premium":
      return "bg-gradient-coffee text-primary-foreground";
    case "Gourmet":
      return "bg-gradient-natural text-secondary-foreground";
    case "Especial":
      return "bg-accent/80 text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Lotes() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sealDialogOpen, setSealDialogOpen] = useState(false);
  const [lotes, setLotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("lotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLotes(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar lotes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const filteredLotes = lotes.filter((lote) => {
    const search = searchTerm.toLowerCase();
    return (
      lote.codigo?.toLowerCase().includes(search) ||
      lote.produtor_nome?.toLowerCase().includes(search) ||
      lote.variedade?.some((v: string) => v.toLowerCase().includes(search)) ||
      lote.status?.toLowerCase().includes(search)
    );
  });
  
  const statusCount = {
    "Em processamento": lotes.filter(l => l.status === "Em processamento").length,
    "Pronto": lotes.filter(l => l.status === "Pronto").length,
    "Exportado": lotes.filter(l => l.status === "Exportado").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Lotes de Café</h2>
          <p className="text-muted-foreground">Rastreamento completo da produção</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateLotesPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          
          <Dialog open={sealDialogOpen} onOpenChange={setSealDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Tag className="mr-2 h-4 w-4" />
                Gerar Selos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Gerar Selos de Embalagem</DialogTitle>
                <DialogDescription>
                  Crie selos 5cm x 5cm para embalagens de café com certificação de qualidade
                </DialogDescription>
              </DialogHeader>
              <SealForm onSuccess={() => setSealDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-coffee hover:opacity-90 shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Novo Lote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Lote</DialogTitle>
                <DialogDescription>
                  Registre um novo lote de café para rastreabilidade
                </DialogDescription>
              </DialogHeader>
              <LoteForm onSuccess={() => {
                setDialogOpen(false);
                fetchLotes();
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em processamento</p>
                <p className="text-2xl font-bold text-warning">{statusCount["Em processamento"]}</p>
              </div>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                Em processamento
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pronto</p>
                <p className="text-2xl font-bold text-success">{statusCount["Pronto"]}</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Pronto
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exportado</p>
                <p className="text-2xl font-bold text-primary">{statusCount["Exportado"]}</p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Exportado
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por código, produtor, variedade ou status..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Todos os Lotes</CardTitle>
          <CardDescription>Visualize e gerencie todos os lotes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Código</TableHead>
                  <TableHead className="font-bold">Produtor</TableHead>
                  <TableHead className="font-bold">Variedade</TableHead>
                  <TableHead className="font-bold">Colheita</TableHead>
                  <TableHead className="font-bold">Quantidade</TableHead>
                  <TableHead className="font-bold">Processo</TableHead>
                  <TableHead className="font-bold">Qualidade</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Localização</TableHead>
                  <TableHead className="font-bold">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="text-muted-foreground mt-2">Carregando lotes...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredLotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum lote encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLotes.map((lote) => (
                    <TableRow key={lote.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono font-semibold text-primary">
                        {lote.codigo}
                      </TableCell>
                      <TableCell>{lote.produtor_nome}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lote.variedade?.map((v: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{v}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(lote.data_colheita).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-muted-foreground" />
                          {lote.quantidade} {lote.unidade}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{lote.processo}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-gradient-coffee text-primary-foreground">
                          {lote.certificacao || "Standard"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(lote.status)}>
                          {lote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{lote.peneira || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/lotes/${lote.id}`)}
                          >
                            Ver Detalhes
                          </Button>
                          <AlterarStatusLoteDialog
                            loteId={lote.id}
                            statusAtual={lote.status}
                            onSuccess={fetchLotes}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
