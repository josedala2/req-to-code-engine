import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const ofertaSchema = z.object({
  produtor_id: z.string().uuid(),
  lote_id: z.string().optional(),
  titulo: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  descricao: z.string().optional(),
  variedade: z.string(),
  processo: z.string().min(1, "Processo é obrigatório"),
  quantidade_disponivel: z.coerce.number().positive("Quantidade deve ser maior que zero"),
  unidade: z.string().default("kg"),
  status_cafe: z.string().min(1, "Status do café é obrigatório"),
  certificado: z.boolean().default(false),
  tipo_certificacao: z.string().optional(),
  nota_qualidade: z.coerce.number().optional(),
  classificacao: z.string().optional(),
  descritores: z.string().optional(),
  peneira: z.string().optional(),
  umidade: z.coerce.number().optional(),
  preco_sugerido: z.coerce.number().optional(),
  moeda: z.string().default("AOA"),
  negociavel: z.boolean().default(true),
  provincia: z.string().min(1, "Província é obrigatória"),
  municipio: z.string().optional(),
  altitude: z.string().optional(),
  fazenda: z.string().optional(),
  contato_nome: z.string().min(3, "Nome do contato é obrigatório"),
  contato_telefone: z.string().min(9, "Telefone é obrigatório"),
  contato_email: z.string().email().optional().or(z.literal("")),
  contato_whatsapp: z.string().optional(),
  data_colheita: z.string().optional(),
  data_disponibilidade: z.string().optional(),
  validade_oferta: z.string().optional(),
  observacoes: z.string().optional(),
  condicoes_venda: z.string().optional(),
});

type OfertaFormData = z.infer<typeof ofertaSchema>;

interface OfertaVendaFormProps {
  onSuccess?: () => void;
}

export default function OfertaVendaForm({ onSuccess }: OfertaVendaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [produtores, setProdutores] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);

  const form = useForm<OfertaFormData>({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      unidade: "kg",
      moeda: "AOA",
      negociavel: true,
      certificado: false,
      status_cafe: "colhido",
    },
  });

  useEffect(() => {
    fetchProdutores();
    fetchLotes();
  }, []);

  const fetchProdutores = async () => {
    const { data } = await supabase
      .from("produtores")
      .select("id, nome, nome_fazenda")
      .eq("status", "aprovado")
      .order("nome");
    
    if (data) setProdutores(data);
  };

  const fetchLotes = async () => {
    const { data } = await supabase
      .from("lotes")
      .select("id, codigo, produtor_nome")
      .order("codigo");
    
    if (data) setLotes(data);
  };

  const onSubmit = async (data: OfertaFormData) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();

      const ofertaData: any = {
        ...data,
        variedade: data.variedade.split(",").map(v => v.trim()),
        tipo_certificacao: data.tipo_certificacao ? data.tipo_certificacao.split(",").map(t => t.trim()) : null,
        descritores: data.descritores ? data.descritores.split(",").map(d => d.trim()) : null,
        lote_id: data.lote_id || null,
        created_by: user?.id,
      };

      const { error } = await supabase
        .from("ofertas_venda")
        .insert([ofertaData]);

      if (error) throw error;

      toast.success("Oferta criada com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao criar oferta:", error);
      toast.error(error.message || "Erro ao criar oferta");
    } finally {
      setIsSubmitting(false);
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
                <FormLabel>Produtor *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produtor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {produtores.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome} - {p.nome_fazenda}
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
                <FormLabel>Lote (opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um lote" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {lotes.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.codigo} - {l.produtor_nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Oferta *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Café Arábica Premium de Huambo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva as características do café, processo de produção, qualidades especiais..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="variedade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variedades * (separadas por vírgula)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Catuaí, Bourbon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="processo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processo *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Natural">Natural</SelectItem>
                    <SelectItem value="Lavado">Lavado</SelectItem>
                    <SelectItem value="Honey">Honey</SelectItem>
                    <SelectItem value="Semi-lavado">Semi-lavado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status_cafe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status do Café *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="colhido">Colhido</SelectItem>
                    <SelectItem value="processado">Processado</SelectItem>
                    <SelectItem value="verde">Café Verde</SelectItem>
                    <SelectItem value="torrado">Torrado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantidade_disponivel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade Disponível *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ton">toneladas</SelectItem>
                    <SelectItem value="sacas">sacas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preco_sugerido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Sugerido (opcional)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="certificado"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Certificado</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="negociavel"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Preço Negociável</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="provincia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Província *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="municipio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Município</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="contato_nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contato_telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input placeholder="+244 XXX XXX XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contato_whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="+244 XXX XXX XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações Adicionais</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando oferta...
            </>
          ) : (
            "Criar Oferta"
          )}
        </Button>
      </form>
    </Form>
  );
}