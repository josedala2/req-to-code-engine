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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

const renovacaoSchema = z.object({
  numero_certificado: z.string().min(1, "Número do certificado é obrigatório"),
  data_emissao: z.string().min(1, "Data de emissão é obrigatória"),
  data_validade: z.string().min(1, "Data de validade é obrigatória"),
  observacoes: z.string().optional(),
});

type RenovacaoFormData = z.infer<typeof renovacaoSchema>;

interface RenovarCertificacaoDialogProps {
  certificacaoId: string;
  onSuccess?: () => void;
}

export function RenovarCertificacaoDialog({
  certificacaoId,
  onSuccess,
}: RenovarCertificacaoDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<RenovacaoFormData>({
    resolver: zodResolver(renovacaoSchema),
    defaultValues: {
      numero_certificado: "",
      data_emissao: "",
      data_validade: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: RenovacaoFormData) => {
    setLoading(true);
    try {
      // Atualizar certificação
      const { error: updateError } = await supabase
        .from("certificacoes")
        .update({
          numero_certificado: data.numero_certificado,
          data_emissao: data.data_emissao,
          data_validade: data.data_validade,
          status: "ativa",
          observacoes: data.observacoes,
        })
        .eq("id", certificacaoId);

      if (updateError) throw updateError;

      // Registrar no histórico
      const { error: historicoError } = await supabase
        .from("certificacoes_historico")
        .insert({
          certificacao_id: certificacaoId,
          tipo_alteracao: "renovacao",
          status_anterior: "renovacao",
          status_novo: "ativa",
          observacoes: data.observacoes || "Certificação renovada",
        });

      if (historicoError) throw historicoError;

      toast.success("Certificação renovada com sucesso!");
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao renovar certificação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Renovar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Renovar Certificação</DialogTitle>
          <DialogDescription>
            Atualize os dados da certificação para renovação
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="numero_certificado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo Número do Certificado</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: ORG-2025-001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_emissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_validade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Data de Validade</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
                      placeholder="Observações sobre a renovação..."
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
                {loading ? "Renovando..." : "Renovar Certificação"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
