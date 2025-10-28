import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const certificacaoSchema = z.object({
  produtor_id: z.string().min(1, "Selecione um produtor"),
  tipo: z.string().min(1, "Selecione o tipo de certificação"),
  certificadora: z.string().min(3, "Nome da certificadora deve ter pelo menos 3 caracteres"),
  numero_certificado: z.string().min(3, "Número da certificação é obrigatório"),
  data_emissao: z.string().min(1, "Data de emissão é obrigatória"),
  data_validade: z.string().min(1, "Data de validade é obrigatória"),
  escopo: z.string().min(10, "Escopo deve ter pelo menos 10 caracteres"),
  observacoes: z.string().optional(),
});

type CertificacaoFormData = z.infer<typeof certificacaoSchema>;

interface CertificacaoFormProps {
  onSuccess?: () => void;
}

export function CertificacaoForm({ onSuccess }: CertificacaoFormProps) {
  const [produtores, setProdutores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<CertificacaoFormData>({
    resolver: zodResolver(certificacaoSchema),
    defaultValues: {
      produtor_id: "",
      tipo: "",
      certificadora: "",
      numero_certificado: "",
      data_emissao: "",
      data_validade: "",
      escopo: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    fetchProdutores();
  }, []);

  const fetchProdutores = async () => {
    const { data } = await supabase
      .from("produtores")
      .select("id, nome")
      .eq("status", "aprovado")
      .order("nome");
    setProdutores(data || []);
  };

  const onSubmit = async (data: CertificacaoFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("certificacoes").insert({
        produtor_id: data.produtor_id,
        tipo: data.tipo,
        certificadora: data.certificadora,
        numero_certificado: data.numero_certificado,
        data_emissao: data.data_emissao,
        data_validade: data.data_validade,
        escopo: data.escopo,
        observacoes: data.observacoes,
        status: "ativa",
      });

      if (error) throw error;

      toast.success("Certificação cadastrada com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar certificação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="produtor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produtor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produtor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {produtores.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Certificação</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="organico">Orgânico</SelectItem>
                    <SelectItem value="rainforest">Rainforest Alliance</SelectItem>
                    <SelectItem value="fairtrade">Fair Trade</SelectItem>
                    <SelectItem value="utz">UTZ Certified</SelectItem>
                    <SelectItem value="4c">4C Association</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificadora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificadora</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da empresa certificadora" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero_certificado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da Certificação</FormLabel>
                <FormControl>
                  <Input placeholder="CERT-2024-12345" {...field} />
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
                <FormLabel>Data de Emissão</FormLabel>
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
                <FormLabel>Data de Validade</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="escopo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Escopo da Certificação</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o escopo e requisitos da certificação..." 
                  {...field} 
                />
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
                <Textarea placeholder="Informações adicionais..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Certificação"}
        </Button>
      </form>
    </Form>
  );
}
