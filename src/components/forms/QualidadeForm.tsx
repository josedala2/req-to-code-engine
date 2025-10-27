import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const qualidadeSchema = z.object({
  lote: z.string().min(1, "Selecione um lote"),
  dataAnalise: z.string().min(1, "Data de análise é obrigatória"),
  classificador: z.string().min(3, "Nome do classificador deve ter pelo menos 3 caracteres"),
  fragranciaAroma: z.string().min(1, "Nota obrigatória"),
  sabor: z.string().min(1, "Nota obrigatória"),
  retrogosto: z.string().min(1, "Nota obrigatória"),
  acidez: z.string().min(1, "Nota obrigatória"),
  corpo: z.string().min(1, "Nota obrigatória"),
  equilibrio: z.string().min(1, "Nota obrigatória"),
  uniformidade: z.string().min(1, "Nota obrigatória"),
  xicara: z.string().min(1, "Nota obrigatória"),
  doçura: z.string().min(1, "Nota obrigatória"),
  notaFinal: z.string().min(1, "Nota final é obrigatória"),
  defeitos: z.string().optional(),
  observacoes: z.string().max(500).optional(),
});

type QualidadeFormData = z.infer<typeof qualidadeSchema>;

interface QualidadeFormProps {
  onSuccess?: () => void;
}

export function QualidadeForm({ onSuccess }: QualidadeFormProps) {
  const form = useForm<QualidadeFormData>({
    resolver: zodResolver(qualidadeSchema),
    defaultValues: {
      lote: "",
      dataAnalise: "",
      classificador: "",
      fragranciaAroma: "",
      sabor: "",
      retrogosto: "",
      acidez: "",
      corpo: "",
      equilibrio: "",
      uniformidade: "",
      xicara: "",
      doçura: "",
      notaFinal: "",
      defeitos: "",
      observacoes: "",
    },
  });

  const onSubmit = (data: QualidadeFormData) => {
    console.log("Dados de qualidade:", data);
    toast.success("Análise de qualidade cadastrada com sucesso!");
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="lote"
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
                    <SelectItem value="lote1">LOTE-2024-001</SelectItem>
                    <SelectItem value="lote2">LOTE-2024-002</SelectItem>
                    <SelectItem value="lote3">LOTE-2024-003</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataAnalise"
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
            name="classificador"
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Atributos Sensoriais (0-10)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="fragranciaAroma"
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
              name="retrogosto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retrogosto</FormLabel>
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
              name="xicara"
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

        <FormField
          control={form.control}
          name="notaFinal"
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
              <FormLabel>Defeitos</FormLabel>
              <FormControl>
                <Input placeholder="Descreva os defeitos encontrados, se houver" {...field} />
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
                <Textarea placeholder="Notas de cupping, perfil sensorial..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Cadastrar Análise de Qualidade
        </Button>
      </form>
    </Form>
  );
}
