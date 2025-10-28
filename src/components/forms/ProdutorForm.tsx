import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const produtorSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  nif: z.string().min(9, "NIF deve ter pelo menos 9 caracteres").max(20, "NIF deve ter no máximo 20 caracteres"),
  email: z.string().email("Email inválido").max(255),
  telefone: z.string().min(10, "Telefone inválido").max(20),
  identificacaoFazenda: z.string().min(3, "Identificação da fazenda deve ter pelo menos 3 caracteres").max(50),
  nomeFazenda: z.string().min(3, "Nome da fazenda deve ter pelo menos 3 caracteres").max(100),
  georeferencia: z.string().min(5, "Georreferência inválida").max(100),
  provincia: z.string().min(2, "Província é obrigatória").max(100),
  municipio: z.string().min(2, "Município é obrigatório").max(100),
  comuna: z.string().min(2, "Comuna é obrigatória").max(100),
  localizacao: z.string().min(5, "Localização deve ter pelo menos 5 caracteres").max(200),
  area: z.string().min(1, "Área é obrigatória"),
  altitude: z.string().min(1, "Altitude é obrigatória"),
  formaAquisicao: z.enum(["heranca", "comprada", "ocupacao"], {
    required_error: "Forma de aquisição é obrigatória",
  }),
  variedades: z.string().min(3, "Tipos de café devem ter pelo menos 3 caracteres").max(200),
  tipoProducao: z.enum(["com_sombra", "sem_sombra"], {
    required_error: "Tipo de produção é obrigatório",
  }),
  trabalhadoresEfetivosHomens: z.string().min(1, "Obrigatório"),
  trabalhadoresEfetivosMulheres: z.string().min(1, "Obrigatório"),
  trabalhadoresColaboradoresHomens: z.string().min(1, "Obrigatório"),
  trabalhadoresColaboradoresMulheres: z.string().min(1, "Obrigatório"),
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
      nif: "",
      email: "",
      telefone: "",
      identificacaoFazenda: "",
      nomeFazenda: "",
      georeferencia: "",
      provincia: "",
      municipio: "",
      comuna: "",
      localizacao: "",
      area: "",
      altitude: "",
      formaAquisicao: undefined,
      variedades: "",
      tipoProducao: undefined,
      trabalhadoresEfetivosHomens: "0",
      trabalhadoresEfetivosMulheres: "0",
      trabalhadoresColaboradoresHomens: "0",
      trabalhadoresColaboradoresMulheres: "0",
      observacoes: "",
    },
  });

  const onSubmit = async (data: ProdutorFormData) => {
    try {
      const { error } = await supabase.from("produtores").insert({
        nome: data.nome,
        nif: data.nif,
        email: data.email,
        telefone: data.telefone,
        identificacao_fazenda: data.identificacaoFazenda,
        nome_fazenda: data.nomeFazenda,
        georeferencia: data.georeferencia,
        provincia: data.provincia,
        municipio: data.municipio,
        comuna: data.comuna,
        localizacao: data.localizacao,
        area: data.area,
        altitude: data.altitude,
        forma_aquisicao: data.formaAquisicao,
        variedades: data.variedades ? data.variedades.split(",").map((v) => v.trim()) : [],
        tipo_producao: data.tipoProducao,
        trabalhadores_efetivos_homens: parseInt(data.trabalhadoresEfetivosHomens),
        trabalhadores_efetivos_mulheres: parseInt(data.trabalhadoresEfetivosMulheres),
        trabalhadores_colaboradores_homens: parseInt(data.trabalhadoresColaboradoresHomens),
        trabalhadores_colaboradores_mulheres: parseInt(data.trabalhadoresColaboradoresMulheres),
        observacoes: data.observacoes,
        status: "pendente",
      });

      if (error) throw error;

      toast.success("Cadastro enviado! Aguarde aprovação do administrador.");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao cadastrar produtor. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dados Pessoais</h3>
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
              name="nif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIF</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
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
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dados da Fazenda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="identificacaoFazenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificação da Fazenda</FormLabel>
                  <FormControl>
                    <Input placeholder="FZ-001" {...field} />
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
              name="georeferencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Georreferência</FormLabel>
                  <FormControl>
                    <Input placeholder="-12.3456, -78.9012" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provincia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Província</FormLabel>
                  <FormControl>
                    <Input placeholder="Huambo" {...field} />
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
                    <Input placeholder="Chipindo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comuna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comuna</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhara" {...field} />
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
                  <FormLabel>Localização Detalhada</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição adicional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="formaAquisicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Aquisição</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecione...</option>
                      <option value="heranca">Herança</option>
                      <option value="comprada">Comprada</option>
                      <option value="ocupacao">Ocupação</option>
                    </select>
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Produção de Café</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="variedades"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipos de Café Produzido</FormLabel>
                  <FormControl>
                    <Input placeholder="Arábica, Robusta, Bourbon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipoProducao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Produção</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecione...</option>
                      <option value="com_sombra">Com Sombra</option>
                      <option value="sem_sombra">Sem Sombra</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recursos Humanos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <h4 className="text-sm font-medium mb-2">Trabalhadores Efetivos</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trabalhadoresEfetivosHomens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Homens</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trabalhadoresEfetivosMulheres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Mulheres</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="col-span-2">
              <h4 className="text-sm font-medium mb-2">Trabalhadores Colaboradores</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trabalhadoresColaboradoresHomens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Homens</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trabalhadoresColaboradoresMulheres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Mulheres</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

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
