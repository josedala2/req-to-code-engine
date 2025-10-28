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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const qualidadeSchema = z.object({
  lote_id: z.string().min(1, "Selecione um lote"),
  data_analise: z.string().min(1, "Data de análise é obrigatória"),
  classificador_nome: z.string().min(3, "Nome do classificador deve ter pelo menos 3 caracteres"),
  classificador_certificacao: z.string().optional(),
  fragrancia: z.string().min(1, "Nota obrigatória"),
  sabor: z.string().min(1, "Nota obrigatória"),
  pos_gosto: z.string().min(1, "Nota obrigatória"),
  acidez: z.string().min(1, "Nota obrigatória"),
  corpo: z.string().min(1, "Nota obrigatória"),
  equilibrio: z.string().min(1, "Nota obrigatória"),
  uniformidade: z.string().min(1, "Nota obrigatória"),
  xicara_limpa: z.string().min(1, "Nota obrigatória"),
  doçura: z.string().min(1, "Nota obrigatória"),
  nota_final: z.string().min(1, "Nota final é obrigatória"),
  defeitos: z.string().optional(),
  umidade: z.string().optional(),
  classificacao: z.string().optional(),
  observacoes: z.string().max(500).optional(),
});

type QualidadeFormData = z.infer<typeof qualidadeSchema>;

interface QualidadeFormProps {
  onSuccess?: () => void;
}

export function QualidadeForm({ onSuccess }: QualidadeFormProps) {
  const [loading, setLoading] = useState(false);

  const { data: lotes } = useQuery({
    queryKey: ['lotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lotes')
        .select('id, codigo')
        .eq('status', 'ativo')
        .order('codigo');
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<QualidadeFormData>({
    resolver: zodResolver(qualidadeSchema),
    defaultValues: {
      lote_id: "",
      data_analise: "",
      classificador_nome: "",
      classificador_certificacao: "",
      fragrancia: "",
      sabor: "",
      pos_gosto: "",
      acidez: "",
      corpo: "",
      equilibrio: "",
      uniformidade: "",
      xicara_limpa: "",
      doçura: "",
      nota_final: "",
      defeitos: "",
      umidade: "",
      classificacao: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: QualidadeFormData) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('qualidade').insert({
        lote_id: data.lote_id,
        data_analise: data.data_analise,
        classificador_nome: data.classificador_nome,
        classificador_certificacao: data.classificador_certificacao || null,
        fragrancia: parseFloat(data.fragrancia),
        sabor: parseFloat(data.sabor),
        pos_gosto: parseFloat(data.pos_gosto),
        acidez: parseFloat(data.acidez),
        corpo: parseFloat(data.corpo),
        equilibrio: parseFloat(data.equilibrio),
        uniformidade: parseFloat(data.uniformidade),
        xicara_limpa: parseFloat(data.xicara_limpa),
        doçura: parseFloat(data.doçura),
        nota_final: parseFloat(data.nota_final),
        defeitos: data.defeitos ? parseInt(data.defeitos) : 0,
        umidade: data.umidade ? parseFloat(data.umidade) : null,
        classificacao: data.classificacao || null,
        observacoes: data.observacoes || null,
        created_by: user?.id,
      });

      if (error) throw error;

      toast.success("Análise de qualidade cadastrada com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error("Erro ao cadastrar análise: " + error.message);
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
            name="lote_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lote</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o lote" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lotes?.map((lote) => (
                      <SelectItem key={lote.id} value={lote.id}>
                        {lote.codigo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_analise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Análise</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classificador_nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classificador Q-Grader</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do classificador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classificador_certificacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificação (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Q-Grader License #12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Atributos Sensoriais (0-10)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="fragrancia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fragrância/Aroma</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="8.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sabor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sabor</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="8.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pos_gosto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pós-Gosto</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="8.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acidez"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acidez</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="8.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="corpo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corpo</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="8.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equilibrio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equilíbrio</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="8.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uniformidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uniformidade</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="xicara_limpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xícara Limpa</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doçura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doçura</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.25" min="0" max="10" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="nota_final"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nota Final (0-100)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.25" min="0" max="100" placeholder="85.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defeitos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Defeitos (número)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="umidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Umidade (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" min="0" max="20" placeholder="11.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="classificacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classificação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classificação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Premium">Premium (90+)</SelectItem>
                  <SelectItem value="Especial">Especial (85-89)</SelectItem>
                  <SelectItem value="Gourmet">Gourmet (80-84)</SelectItem>
                  <SelectItem value="Superior">Superior (75-79)</SelectItem>
                  <SelectItem value="Comercial">Comercial (&lt;75)</SelectItem>
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
                <Textarea placeholder="Notas de cupping, perfil sensorial..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar Análise de Qualidade"}
        </Button>
      </form>
    </Form>
  );
}
