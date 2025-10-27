import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { toast } from "sonner";
import { generateMultipleSeals } from "@/lib/sealGenerator";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const sealSchema = z.object({
  loteId: z.string().min(3, "Código do lote é obrigatório"),
  produtor: z.string().min(3, "Nome do produtor é obrigatório"),
  certificacao: z.string().min(3, "Número de certificação é obrigatório"),
  dataColheita: z.string().min(1, "Data de colheita é obrigatória"),
  variedade: z.string().min(1, "Variedade é obrigatória"),
  processo: z.string().min(1, "Processo é obrigatório"),
  quantidade: z.string()
    .min(1, "Quantidade é obrigatória")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, {
      message: "Quantidade deve estar entre 1 e 100 selos",
    }),
});

type SealFormData = z.infer<typeof sealSchema>;

interface SealFormProps {
  onSuccess?: () => void;
  defaultLoteId?: string;
  defaultProdutor?: string;
}

export function SealForm({ onSuccess, defaultLoteId, defaultProdutor }: SealFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<SealFormData>({
    resolver: zodResolver(sealSchema),
    defaultValues: {
      loteId: defaultLoteId || "",
      produtor: defaultProdutor || "",
      certificacao: "",
      dataColheita: "",
      variedade: "",
      processo: "",
      quantidade: "10" as any,
    },
  });

  const onSubmit = async (data: SealFormData) => {
    setIsGenerating(true);
    try {
      await generateMultipleSeals(
        {
          loteId: data.loteId,
          produtor: data.produtor,
          certificacao: data.certificacao,
          dataColheita: data.dataColheita,
          variedade: data.variedade,
          processo: data.processo,
        },
        data.quantidade
      );
      
      toast.success(`${data.quantidade} selos gerados com sucesso!`);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao gerar selos. Tente novamente.");
      console.error("Erro ao gerar selos:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="loteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código do Lote</FormLabel>
                <FormControl>
                  <Input placeholder="LOT-2025-001" {...field} />
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
                <FormLabel>Nome do Produtor</FormLabel>
                <FormControl>
                  <Input placeholder="Fazenda Santa Clara" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Certificação</FormLabel>
                <FormControl>
                  <Input placeholder="CERT-2025-001" {...field} />
                </FormControl>
                <FormDescription>
                  Número único de certificação do lote
                </FormDescription>
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
            name="variedade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variedade</FormLabel>
                <FormControl>
                  <Input placeholder="Bourbon Amarelo" {...field} />
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
                <FormLabel>Processo</FormLabel>
                <FormControl>
                  <Input placeholder="Natural" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="quantidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Selos</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="100" 
                  placeholder="10" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Máximo de 100 selos por geração (20 selos por página A4)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-coffee hover:opacity-90"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando Selos...
            </>
          ) : (
            "Gerar Selos"
          )}
        </Button>
      </form>
    </Form>
  );
}
