import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const certificacaoSchema = z.object({
  produtor: z.string().min(1, "Selecione um produtor"),
  tipo: z.string().min(1, "Selecione o tipo de certificação"),
  certificadora: z.string().min(3, "Nome da certificadora deve ter pelo menos 3 caracteres").max(100),
  numero: z.string().min(3, "Número da certificação é obrigatório").max(50),
  dataEmissao: z.string().min(1, "Data de emissão é obrigatória"),
  dataValidade: z.string().min(1, "Data de validade é obrigatória"),
  escopo: z.string().min(10, "Escopo deve ter pelo menos 10 caracteres").max(500),
  observacoes: z.string().max(500).optional(),
});

type CertificacaoFormData = z.infer<typeof certificacaoSchema>;

interface CertificacaoFormProps {
  onSuccess?: () => void;
}

export function CertificacaoForm({ onSuccess }: CertificacaoFormProps) {
  const form = useForm<CertificacaoFormData>({
    resolver: zodResolver(certificacaoSchema),
    defaultValues: {
      produtor: "",
      tipo: "",
      certificadora: "",
      numero: "",
      dataEmissao: "",
      dataValidade: "",
      escopo: "",
      observacoes: "",
    },
  });

  const onSubmit = (data: CertificacaoFormData) => {
    console.log("Dados da certificação:", data);
    toast.success("Certificação cadastrada com sucesso!");
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="cafe-do-cerrado">Café do Cerrado</SelectItem>
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
            name="numero"
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
            name="dataEmissao"
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
            name="dataValidade"
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

        <Button type="submit" className="w-full">
          Cadastrar Certificação
        </Button>
      </form>
    </Form>
  );
}
