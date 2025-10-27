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
import { supabase } from "@/integrations/supabase/client";

const sealSchema = z.object({
  loteId: z.string().min(3, "Código do lote é obrigatório"),
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
}

export function SealForm({ onSuccess, defaultLoteId }: SealFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<SealFormData>({
    resolver: zodResolver(sealSchema),
    defaultValues: {
      loteId: defaultLoteId || "",
      quantidade: "10" as any,
    },
  });

  const onSubmit = async (data: SealFormData) => {
    setIsGenerating(true);
    try {
      // Buscar dados do lote no banco
      const { data: loteData, error } = await supabase
        .from("lotes")
        .select("*")
        .eq("codigo", data.loteId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar lote:", error);
        toast.error("Erro ao buscar lote. Tente novamente.");
        setIsGenerating(false);
        return;
      }

      if (!loteData) {
        toast.error("Lote não encontrado. Verifique o código ou cadastre o lote primeiro.");
        setIsGenerating(false);
        return;
      }

      // Gerar selos com os dados do lote
      await generateMultipleSeals(
        {
          loteId: loteData.codigo,
          produtor: loteData.produtor_nome,
          certificacao: loteData.certificacao || "SEM-CERT",
          dataColheita: new Date(loteData.data_colheita).toLocaleDateString('pt-BR'),
          variedade: loteData.variedade,
          processo: loteData.processo,
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
        <FormField
          control={form.control}
          name="loteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código do Lote</FormLabel>
              <FormControl>
                <Input placeholder="LOT-2025-001" {...field} />
              </FormControl>
              <FormDescription>
                Digite o código do lote cadastrado no sistema
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
