import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const auditoriaSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  lote_id: z.string().optional(),
  produtor_id: z.string().optional(),
  data_auditoria: z.string().min(1, "Data é obrigatória"),
  auditor_nome: z.string().min(1, "Nome do auditor é obrigatório"),
  auditor_certificacao: z.string().optional(),
  tipo_auditoria: z.string().min(1, "Tipo de auditoria é obrigatório"),
  status: z.enum(["em_andamento", "concluida", "aprovada", "reprovada"]),
  pontuacao_total: z.string().optional(),
  pontuacao_maxima: z.string().optional(),
  conformidades: z.string().optional(),
  nao_conformidades: z.string().optional(),
  observacoes: z.string().optional(),
  recomendacoes: z.string().optional(),
  resultado: z.string().optional(),
  certificado_emitido: z.boolean().default(false),
  validade_certificado: z.string().optional(),
});

type AuditoriaFormData = z.infer<typeof auditoriaSchema>;

interface AuditoriaFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<AuditoriaFormData>;
  auditoriaId?: string;
}

export function AuditoriaForm({ onSuccess, defaultValues, auditoriaId }: AuditoriaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lotes, setLotes] = useState<any[]>([]);
  const [produtores, setProdutores] = useState<any[]>([]);

  const form = useForm<AuditoriaFormData>({
    resolver: zodResolver(auditoriaSchema),
    defaultValues: defaultValues || {
      codigo: "",
      data_auditoria: new Date().toISOString().split("T")[0],
      status: "em_andamento",
      certificado_emitido: false,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const [lotesRes, produtoresRes] = await Promise.all([
        supabase.from("lotes").select("id, codigo").order("codigo"),
        supabase.from("produtores").select("id, nome").eq("status", "aprovado").order("nome"),
      ]);

      if (lotesRes.data) setLotes(lotesRes.data);
      if (produtoresRes.data) setProdutores(produtoresRes.data);
    };

    fetchData();
  }, []);

  const onSubmit = async (data: AuditoriaFormData) => {
    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const conformidadesArray = data.conformidades
        ? data.conformidades.split("\n").filter((item) => item.trim())
        : [];
      const naoConformidadesArray = data.nao_conformidades
        ? data.nao_conformidades.split("\n").filter((item) => item.trim())
        : [];

      const auditoriaData = {
        codigo: data.codigo,
        lote_id: data.lote_id || null,
        produtor_id: data.produtor_id || null,
        data_auditoria: data.data_auditoria,
        auditor_nome: data.auditor_nome,
        auditor_certificacao: data.auditor_certificacao || null,
        tipo_auditoria: data.tipo_auditoria,
        status: data.status,
        pontuacao_total: data.pontuacao_total ? parseFloat(data.pontuacao_total) : null,
        pontuacao_maxima: data.pontuacao_maxima ? parseFloat(data.pontuacao_maxima) : null,
        conformidades: conformidadesArray,
        nao_conformidades: naoConformidadesArray,
        observacoes: data.observacoes || null,
        recomendacoes: data.recomendacoes || null,
        resultado: data.resultado || null,
        certificado_emitido: data.certificado_emitido,
        validade_certificado: data.validade_certificado || null,
        created_by: userData.user.id,
      };

      let error;
      if (auditoriaId) {
        ({ error } = await supabase.from("auditorias").update(auditoriaData).eq("id", auditoriaId));
      } else {
        ({ error } = await supabase.from("auditorias").insert(auditoriaData));
      }

      if (error) throw error;

      toast.success(auditoriaId ? "Auditoria atualizada com sucesso!" : "Auditoria cadastrada com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao salvar auditoria:", error);
      toast.error(error.message || "Erro ao salvar auditoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código da Auditoria</FormLabel>
                <FormControl>
                  <Input placeholder="AUD-2025-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_auditoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Auditoria</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auditor_nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Auditor</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auditor_certificacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificação do Auditor</FormLabel>
                <FormControl>
                  <Input placeholder="ISO 9001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo_auditoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Auditoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="qualidade">Qualidade</SelectItem>
                    <SelectItem value="organica">Orgânica</SelectItem>
                    <SelectItem value="sustentabilidade">Sustentabilidade</SelectItem>
                    <SelectItem value="rastreabilidade">Rastreabilidade</SelectItem>
                    <SelectItem value="processamento">Processamento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="aprovada">Aprovada</SelectItem>
                    <SelectItem value="reprovada">Reprovada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="produtor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produtor (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produtor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {produtores.map((produtor) => (
                      <SelectItem key={produtor.id} value={produtor.id}>
                        {produtor.nome}
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
            name="lote_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lote (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o lote" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lotes.map((lote) => (
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
            name="pontuacao_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontuação Total</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="85.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pontuacao_maxima"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontuação Máxima</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="conformidades"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conformidades (uma por linha)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Produto atende aos padrões de qualidade&#10;Embalagem adequada&#10;Documentação completa"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nao_conformidades"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Não Conformidades (uma por linha)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Falta de certificação orgânica&#10;Processo de secagem inadequado"
                  className="min-h-[100px]"
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
                <Textarea
                  placeholder="Observações gerais sobre a auditoria..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recomendacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recomendações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Recomendações para melhoria..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resultado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resultado Final</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do resultado final da auditoria..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="certificado_emitido"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Certificado Emitido</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validade_certificado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade do Certificado</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {auditoriaId ? "Atualizar Auditoria" : "Cadastrar Auditoria"}
        </Button>
      </form>
    </Form>
  );
}
