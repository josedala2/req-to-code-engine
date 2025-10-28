import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Settings } from "lucide-react";

const statusSchema = z.object({
  status: z.string().min(1, "Selecione um status"),
  observacoes: z.string().optional(),
});

type StatusFormData = z.infer<typeof statusSchema>;

interface AlterarStatusLoteDialogProps {
  loteId: string;
  statusAtual: string;
  onSuccess?: () => void;
}

export function AlterarStatusLoteDialog({
  loteId,
  statusAtual,
  onSuccess,
}: AlterarStatusLoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: statusAtual,
      observacoes: "",
    },
  });

  const onSubmit = async (data: StatusFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("lotes")
        .update({
          status: data.status,
          observacoes: data.observacoes
            ? `${data.observacoes}\n\n[Status alterado: ${new Date().toLocaleString()}]`
            : undefined,
        })
        .eq("id", loteId);

      if (error) throw error;

      toast.success("Status do lote alterado com sucesso!");
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Alterar Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Alterar Status do Lote</DialogTitle>
          <DialogDescription>
            Atualize o status atual do lote
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="em_processamento">Em Processamento</SelectItem>
                      <SelectItem value="pronto">Pronto</SelectItem>
                      <SelectItem value="exportado">Exportado</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Motivo da alteração de status..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Alterando..." : "Alterar Status"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
