import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Eye, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import OfertaVendaForm from "@/components/forms/OfertaVendaForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MinhasOfertas() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [negociacoesCount, setNegociacoesCount] = useState(0);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ofertas_venda")
        .select(`
          *,
          negociacoes(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Calcular total de negociações ativas
      const totalNegociacoes = data?.reduce((acc, oferta) => {
        return acc + (oferta.negociacoes?.[0]?.count || 0);
      }, 0) || 0;
      
      setNegociacoesCount(totalNegociacoes);
      setOfertas(data || []);
    } catch (error) {
      console.error("Erro ao buscar ofertas:", error);
      toast.error("Erro ao carregar ofertas");
    } finally {
      setLoading(false);
    }
  };

  const deleteOferta = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ofertas_venda")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Oferta excluída com sucesso");
      fetchOfertas();
    } catch (error) {
      console.error("Erro ao excluir oferta:", error);
      toast.error("Erro ao excluir oferta");
    }
  };

  const updateStatus = async (id: string, novoStatus: string) => {
    try {
      const { error } = await supabase
        .from("ofertas_venda")
        .update({ status_oferta: novoStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Status atualizado com sucesso");
      fetchOfertas();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Ofertas</h1>
          <p className="text-muted-foreground">Gerencie suas ofertas no marketplace</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Oferta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Oferta</DialogTitle>
            </DialogHeader>
            <OfertaVendaForm
              onSuccess={() => {
                setDialogOpen(false);
                fetchOfertas();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{ofertas.length}</p>
              <p className="text-sm text-muted-foreground">Total de Ofertas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {ofertas.filter(o => o.status_oferta === "disponivel").length}
              </p>
              <p className="text-sm text-muted-foreground">Disponíveis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">
                {negociacoesCount}
              </p>
              <p className="text-sm text-muted-foreground">Negociações em Curso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {ofertas.reduce((acc, o) => acc + (o.visualizacoes || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total de Visualizações</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ofertas</CardTitle>
        </CardHeader>
        <CardContent>
          {ofertas.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma oferta cadastrada ainda
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Visualizações</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ofertas.map((oferta) => (
                  <TableRow key={oferta.id}>
                    <TableCell className="font-medium">{oferta.titulo}</TableCell>
                    <TableCell>
                      <Badge variant={
                        oferta.status_oferta === "disponivel" ? "default" :
                        oferta.status_oferta === "em_negociacao" ? "secondary" :
                        "outline"
                      }>
                        {oferta.status_oferta}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {oferta.quantidade_disponivel} {oferta.unidade}
                    </TableCell>
                    <TableCell>
                      {oferta.preco_sugerido ? 
                        `${oferta.preco_sugerido} ${oferta.moeda}` : 
                        "A negociar"
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {oferta.visualizacoes || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(oferta.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(
                            oferta.id,
                            oferta.status_oferta === "disponivel" ? "inativo" : "disponivel"
                          )}
                        >
                          {oferta.status_oferta === "disponivel" ? "Desativar" : "Ativar"}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta oferta? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteOferta(oferta.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}