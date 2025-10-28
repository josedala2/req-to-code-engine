import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { divisaoAdministrativaAngola } from "@/data/angolaDivisaoAdministrativa";

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
  totalTrabalhadores: z.string().min(1, "Total de funcionários é obrigatório"),
  trabalhadoresEfetivosHomens: z.string().min(1, "Obrigatório"),
  trabalhadoresEfetivosMulheres: z.string().min(1, "Obrigatório"),
  trabalhadoresColaboradoresHomens: z.string().min(1, "Obrigatório"),
  trabalhadoresColaboradoresMulheres: z.string().min(1, "Obrigatório"),
  observacoes: z.string().max(500, "Observações devem ter no máximo 500 caracteres").optional(),
});

type ProdutorFormData = z.infer<typeof produtorSchema>;

interface ProdutorFormProps {
  onSuccess?: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function ProdutorForm({ onSuccess, initialData, isEditing = false }: ProdutorFormProps) {
  const [selectedProvincia, setSelectedProvincia] = useState<string>("");
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>("");
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [comunas, setComunas] = useState<string[]>([]);
  const [documentoBI, setDocumentoBI] = useState<File | null>(null);
  const [fotografia, setFotografia] = useState<File | null>(null);
  const [documentoPosseTerra, setDocumentoPosseTerra] = useState<File | null>(null);

  const form = useForm<ProdutorFormData>({
    resolver: zodResolver(produtorSchema),
    defaultValues: initialData ? {
      nome: initialData.nome || "",
      nif: initialData.nif || "",
      email: initialData.email || "",
      telefone: initialData.telefone || "",
      identificacaoFazenda: initialData.identificacao_fazenda || "",
      nomeFazenda: initialData.nome_fazenda || "",
      georeferencia: initialData.georeferencia || "",
      provincia: initialData.provincia || "",
      municipio: initialData.municipio || "",
      comuna: initialData.comuna || "",
      localizacao: initialData.localizacao || "",
      area: initialData.area || "",
      altitude: initialData.altitude || "",
      formaAquisicao: initialData.forma_aquisicao || undefined,
      variedades: Array.isArray(initialData.variedades) ? initialData.variedades.join(", ") : "",
      tipoProducao: initialData.tipo_producao || undefined,
      totalTrabalhadores: ((initialData.trabalhadores_efetivos_homens || 0) + (initialData.trabalhadores_efetivos_mulheres || 0) + (initialData.trabalhadores_colaboradores_homens || 0) + (initialData.trabalhadores_colaboradores_mulheres || 0)).toString(),
      trabalhadoresEfetivosHomens: (initialData.trabalhadores_efetivos_homens || 0).toString(),
      trabalhadoresEfetivosMulheres: (initialData.trabalhadores_efetivos_mulheres || 0).toString(),
      trabalhadoresColaboradoresHomens: (initialData.trabalhadores_colaboradores_homens || 0).toString(),
      trabalhadoresColaboradoresMulheres: (initialData.trabalhadores_colaboradores_mulheres || 0).toString(),
      observacoes: initialData.observacoes || "",
    } : {
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
      totalTrabalhadores: "0",
      trabalhadoresEfetivosHomens: "0",
      trabalhadoresEfetivosMulheres: "0",
      trabalhadoresColaboradoresHomens: "0",
      trabalhadoresColaboradoresMulheres: "0",
      observacoes: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setSelectedProvincia(initialData.provincia || "");
      setSelectedMunicipio(initialData.municipio || "");
    }
  }, [initialData]);

  useEffect(() => {
    if (selectedProvincia) {
      const provincia = divisaoAdministrativaAngola.find((p) => p.nome === selectedProvincia);
      if (provincia) {
        setMunicipios(provincia.municipios.map((m) => m.nome));
        setSelectedMunicipio("");
        setComunas([]);
        form.setValue("municipio", "");
        form.setValue("comuna", "");
      }
    } else {
      setMunicipios([]);
      setComunas([]);
    }
  }, [selectedProvincia, form]);

  useEffect(() => {
    if (selectedProvincia && selectedMunicipio) {
      const provincia = divisaoAdministrativaAngola.find((p) => p.nome === selectedProvincia);
      if (provincia) {
        const municipio = provincia.municipios.find((m) => m.nome === selectedMunicipio);
        if (municipio) {
          setComunas(municipio.comunas.map((c) => c.nome));
          form.setValue("comuna", "");
        }
      }
    } else {
      setComunas([]);
    }
  }, [selectedMunicipio, selectedProvincia, form]);

  // Watch form values for auto-calculation
  const totalTrabalhadores = form.watch("totalTrabalhadores");
  const trabalhadoresEfetivosHomens = form.watch("trabalhadoresEfetivosHomens");
  const trabalhadoresColaboradoresHomens = form.watch("trabalhadoresColaboradoresHomens");

  // Auto-calculate women when men value changes for Efetivos
  useEffect(() => {
    const total = parseInt(totalTrabalhadores || "0");
    const homens = parseInt(trabalhadoresEfetivosHomens || "0");
    const mulheres = total - homens;
    if (mulheres >= 0) {
      form.setValue("trabalhadoresEfetivosMulheres", mulheres.toString(), { shouldValidate: false });
    }
  }, [trabalhadoresEfetivosHomens, totalTrabalhadores, form]);

  // Auto-calculate women when men value changes for Colaboradores
  useEffect(() => {
    const total = parseInt(totalTrabalhadores || "0");
    const homens = parseInt(trabalhadoresColaboradoresHomens || "0");
    const mulheres = total - homens;
    if (mulheres >= 0) {
      form.setValue("trabalhadoresColaboradoresMulheres", mulheres.toString(), { shouldValidate: false });
    }
  }, [trabalhadoresColaboradoresHomens, totalTrabalhadores, form]);

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from("producer-documents")
      .upload(path, file, { upsert: true });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from("producer-documents")
      .getPublicUrl(path);

    return publicUrl;
  };

  const onSubmit = async (data: ProdutorFormData) => {
    // Validate that sum does not exceed total
    const total = parseInt(data.totalTrabalhadores || "0");
    const totalEfetivos = parseInt(data.trabalhadoresEfetivosHomens || "0") + parseInt(data.trabalhadoresEfetivosMulheres || "0");
    const totalColaboradores = parseInt(data.trabalhadoresColaboradoresHomens || "0") + parseInt(data.trabalhadoresColaboradoresMulheres || "0");

    if (totalEfetivos > total) {
      toast.error("A soma de trabalhadores efetivos não pode ser superior ao total de funcionários.");
      return;
    }

    if (totalColaboradores > total) {
      toast.error("A soma de trabalhadores colaboradores não pode ser superior ao total de funcionários.");
      return;
    }

    try {
      // Upload documents if provided
      let documentoBIUrl = null;
      let fotografiaUrl = null;
      let documentoPosseTerraUrl = null;

      if (documentoBI) {
        const timestamp = Date.now();
        documentoBIUrl = await uploadFile(documentoBI, `bi/${timestamp}_${documentoBI.name}`);
      }

      if (fotografia) {
        const timestamp = Date.now();
        fotografiaUrl = await uploadFile(fotografia, `fotos/${timestamp}_${fotografia.name}`);
      }

      if (documentoPosseTerra) {
        const timestamp = Date.now();
        documentoPosseTerraUrl = await uploadFile(documentoPosseTerra, `posse_terra/${timestamp}_${documentoPosseTerra.name}`);
      }

      const produtorData = {
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
        ...(documentoBIUrl && { documento_bi: documentoBIUrl }),
        ...(fotografiaUrl && { fotografia: fotografiaUrl }),
        ...(documentoPosseTerraUrl && { documento_posse_terra: documentoPosseTerraUrl }),
      };

      let error;
      if (isEditing && initialData?.id) {
        const result = await supabase
          .from("produtores")
          .update(produtorData)
          .eq("id", initialData.id);
        error = result.error;
      } else {
        const result = await supabase.from("produtores").insert({
          ...produtorData,
          status: "pendente" as const
        });
        error = result.error;
      }

      if (error) throw error;

      toast.success(isEditing ? "Produtor atualizado com sucesso!" : "Cadastro enviado! Aguarde aprovação do administrador.");
      form.reset();
      setDocumentoBI(null);
      setFotografia(null);
      setDocumentoPosseTerra(null);
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedProvincia(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a província" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {divisaoAdministrativaAngola.map((provincia) => (
                        <SelectItem key={provincia.nome} value={provincia.nome}>
                          {provincia.nome}
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
              name="municipio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Município</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedMunicipio(value);
                    }}
                    value={field.value}
                    disabled={!selectedProvincia}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o município" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {municipios.map((municipio) => (
                        <SelectItem key={municipio} value={municipio}>
                          {municipio}
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
              name="comuna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comuna</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedMunicipio}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a comuna" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {comunas.map((comuna) => (
                        <SelectItem key={comuna} value={comuna}>
                          {comuna}
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
          
          <FormField
            control={form.control}
            name="totalTrabalhadores"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total de Funcionários</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                        <Input type="number" min="0" placeholder="0" {...field} />
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
                      <FormLabel>Total Mulheres (calculado automaticamente)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} disabled className="bg-muted" />
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
                        <Input type="number" min="0" placeholder="0" {...field} />
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
                      <FormLabel>Total Mulheres (calculado automaticamente)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} disabled className="bg-muted" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Documentos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormLabel>Bilhete de Identidade (BI)</FormLabel>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocumentoBI(e.target.files?.[0] || null)}
                className="mt-2"
              />
              {documentoBI && (
                <p className="text-sm text-muted-foreground mt-1">
                  {documentoBI.name}
                </p>
              )}
            </div>

            <div>
              <FormLabel>Fotografia</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFotografia(e.target.files?.[0] || null)}
                className="mt-2"
              />
              {fotografia && (
                <p className="text-sm text-muted-foreground mt-1">
                  {fotografia.name}
                </p>
              )}
            </div>

            <div>
              <FormLabel>Documento de Posse da Terra</FormLabel>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocumentoPosseTerra(e.target.files?.[0] || null)}
                className="mt-2"
              />
              {documentoPosseTerra && (
                <p className="text-sm text-muted-foreground mt-1">
                  {documentoPosseTerra.name}
                </p>
              )}
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
