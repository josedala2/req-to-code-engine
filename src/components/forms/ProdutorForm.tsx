import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const produtorSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (formato: 000.000.000-00)"),
  email: z.string().email("Email inválido").max(255),
  telefone: z.string().min(10, "Telefone inválido").max(20),
  nomeFazenda: z.string().min(3, "Nome da fazenda deve ter pelo menos 3 caracteres").max(100),
  localizacao: z.string().min(5, "Localização deve ter pelo menos 5 caracteres").max(200),
  area: z.string().min(1, "Área é obrigatória"),
  altitude: z.string().min(1, "Altitude é obrigatória"),
  variedades: z.string().min(3, "Variedades devem ter pelo menos 3 caracteres").max(200),
  observacoes: z.string().max(500, "Observações devem ter no máximo 500 caracteres").optional(),
});

type ProdutorFormData = z.infer<typeof produtorSchema>;

interface ProdutorFormProps {
  onSuccess?: () => void;
}

export function ProdutorForm({ onSuccess }: ProdutorFormProps) {
  const form = useForm<ProdutorFormData>({
    resolver: zodResolver(produtorSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      nomeFazenda: "",
      localizacao: "",
      area: "",
      altitude: "",
      variedades: "",
      observacoes: "",
    },
  });

  const onSubmit = (data: ProdutorFormData) => {
    console.log("Dados do produtor:", data);
    toast.success("Produtor cadastrado com sucesso!");
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="joao@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomeFazenda"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Fazenda</FormLabel>
                <FormControl>
                  <Input placeholder="Fazenda Boa Vista" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="localizacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade, Estado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área (hectares)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="altitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altitude (metros)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="variedades"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variedades Cultivadas</FormLabel>
              <FormControl>
                <Input placeholder="Arábica, Bourbon, Catuaí" {...field} />
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

        <Button type="submit" className="w-full">
          Cadastrar Produtor
        </Button>
      </form>
    </Form>
  );
}
