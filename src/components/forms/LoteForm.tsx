import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const loteSchema = z.object({
  codigo: z.string().min(3, "Código deve ter pelo menos 3 caracteres").max(50),
  produtor: z.string().min(1, "Selecione um produtor"),
  safra: z.string().min(4, "Safra inválida"),
  variedade: z.string().min(1, "Selecione uma variedade"),
  processo: z.string().min(1, "Selecione um processo"),
  dataColheita: z.string().min(1, "Data de colheita é obrigatória"),
  quantidade: z.string().min(1, "Quantidade é obrigatória"),
  unidade: z.string().min(1, "Selecione uma unidade"),
  peneira: z.string().optional(),
  umidade: z.string().optional(),
  observacoes: z.string().max(500).optional(),
});

type LoteFormData = z.infer<typeof loteSchema>;

interface LoteFormProps {
  onSuccess?: () => void;
}

export function LoteForm({ onSuccess }: LoteFormProps) {
  const form = useForm<LoteFormData>({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      codigo: "",
      produtor: "",
      safra: "",
      variedade: "",
      processo: "",
      dataColheita: "",
      quantidade: "",
      unidade: "",
      peneira: "",
      umidade: "",
      observacoes: "",
    },
  });

  const onSubmit = (data: LoteFormData) => {
    console.log("Dados do lote:", data);
    toast.success("Lote cadastrado com sucesso!");
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código do Lote</FormLabel>
                <FormControl>
                  <Input placeholder="LOTE-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="produtor"
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
                    <SelectItem value="prod1">João Silva</SelectItem>
                    <SelectItem value="prod2">Maria Santos</SelectItem>
                    <SelectItem value="prod3">Carlos Oliveira</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Safra</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="variedade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variedade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a variedade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="arabica">Arábica</SelectItem>
                    <SelectItem value="bourbon">Bourbon</SelectItem>
                    <SelectItem value="catuai">Catuaí</SelectItem>
                    <SelectItem value="mundo-novo">Mundo Novo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="processo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o processo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="lavado">Lavado</SelectItem>
                    <SelectItem value="honey">Honey</SelectItem>
                    <SelectItem value="semi-lavado">Semi-lavado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataColheita"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Colheita</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1000" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                    <SelectItem value="sacas">Sacas (60kg)</SelectItem>
                    <SelectItem value="ton">Toneladas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="peneira"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peneira</FormLabel>
                <FormControl>
                  <Input placeholder="17/18" {...field} />
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
                  <Input type="number" step="0.1" placeholder="11.5" {...field} />
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
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Informações adicionais sobre o lote..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Cadastrar Lote
        </Button>
      </form>
    </Form>
  );
}
