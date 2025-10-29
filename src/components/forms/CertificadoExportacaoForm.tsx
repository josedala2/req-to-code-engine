import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { paisesECidades } from "@/data/paisesECidades";

const formSchema = z.object({
  produtor_id: z.string().min(1, "Selecione um produtor"),
  destino_pais: z.string().min(2, "País de destino é obrigatório"),
  destino_cidade: z.string().optional(),
  importador_nome: z.string().min(2, "Nome do importador é obrigatório"),
  importador_documento: z.string().optional(),
  valor_total: z.string().optional(),
  moeda: z.string().default("AOA"),
  data_validade: z.string().min(1, "Data de validade é obrigatória"),
  observacoes: z.string().optional(),
});

export default function CertificadoExportacaoForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedLotes, setSelectedLotes] = useState<any[]>([]);
  const [selectedProdutorId, setSelectedProdutorId] = useState<string>("");
  const [normasSelecionadas, setNormasSelecionadas] = useState<string[]>([]);
  const [novaNorma, setNovaNorma] = useState("");
  const [selectedPais, setSelectedPais] = useState<string>("");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(formSchema),
  });

  const { data: produtores } = useQuery({
    queryKey: ["produtores-aprovados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtores")
        .select("*")
        .eq("status", "aprovado");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: lotes, isLoading: lotesLoading, refetch: refetchLotes } = useQuery({
    queryKey: ["lotes-produtor", selectedProdutorId],
    queryFn: async () => {
      if (!selectedProdutorId) return [];
      
      const { data, error } = await supabase
        .from("lotes")
        .select("*")
        .eq("produtor_id", selectedProdutorId)
        .eq("status", "ativo");
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedProdutorId,
  });

  const handleProdutorChange = (produtorId: string) => {
    setSelectedProdutorId(produtorId);
    setSelectedLotes([]);
    setValue("produtor_id", produtorId);
    // Força reload dos lotes
    setTimeout(() => refetchLotes(), 100);
  };

  const toggleLote = (lote: any) => {
    setSelectedLotes((prev) => {
      const exists = prev.find((l) => l.id === lote.id);
      if (exists) {
        return prev.filter((l) => l.id !== lote.id);
      } else {
        return [...prev, lote];
      }
    });
  };

  const addNorma = () => {
    if (novaNorma.trim()) {
      setNormasSelecionadas([...normasSelecionadas, novaNorma.trim()]);
      setNovaNorma("");
    }
  };

  const removeNorma = (index: number) => {
    setNormasSelecionadas(normasSelecionadas.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData: any) => {
    if (selectedLotes.length === 0) {
      toast.error("Selecione pelo menos um lote");
      return;
    }

    try {
      setLoading(true);

      const quantidadeTotal = selectedLotes.reduce((acc, lote) => acc + parseFloat(lote.quantidade), 0);
      const unidade = selectedLotes[0].unidade;

      const insertData: any = {
        lotes_ids: selectedLotes.map((l) => l.id),
        destino_pais: formData.destino_pais,
        importador_nome: formData.importador_nome,
        quantidade_total: quantidadeTotal,
        unidade: unidade,
        data_validade: formData.data_validade,
        status: "pendente"
      };

      if (formData.produtor_id) insertData.produtor_id = formData.produtor_id;
      if (formData.destino_cidade) insertData.destino_cidade = formData.destino_cidade;
      if (formData.importador_documento) insertData.importador_documento = formData.importador_documento;
      if (formData.valor_total) insertData.valor_total = parseFloat(formData.valor_total);
      if (formData.moeda) insertData.moeda = formData.moeda;
      if (normasSelecionadas.length > 0) insertData.normas_cumpridas = normasSelecionadas;
      if (formData.observacoes) insertData.observacoes = formData.observacoes;

      const { data, error } = await supabase
        .from("certificados_exportacao")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Certificado de exportação criado com sucesso!");
      navigate("/certificados-exportacao");
    } catch (error) {
      console.error("Erro ao criar certificado:", error);
      toast.error("Erro ao criar certificado de exportação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Novo Certificado de Exportação</h1>
          <p className="text-muted-foreground">Preencha os dados para solicitar autorização de exportação</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Seleção de Produtor */}
          <Card>
            <CardHeader>
              <CardTitle>Exportador</CardTitle>
              <CardDescription>Selecione o produtor/exportador</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="produtor">Produtor *</Label>
                <Select onValueChange={handleProdutorChange}>
                  <SelectTrigger id="produtor">
                    <SelectValue placeholder="Selecione um produtor" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtores?.map((produtor) => (
                      <SelectItem key={produtor.id} value={produtor.id}>
                        {produtor.nome} - {produtor.nome_fazenda}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.produtor_id && (
                  <p className="text-sm text-destructive">{errors.produtor_id.message as string}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Lotes */}
          {selectedProdutorId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Lotes para Exportação
                </CardTitle>
                <CardDescription>Selecione os lotes que serão exportados</CardDescription>
              </CardHeader>
              <CardContent>
                {lotesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Carregando lotes...</span>
                  </div>
                ) : !lotes || lotes.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="font-medium text-muted-foreground mb-1">
                      Nenhum lote ativo encontrado
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Este produtor não possui lotes ativos cadastrados no sistema.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/lotes")}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Cadastrar Lotes
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3">
                      {lotes.map((lote) => (
                        <div
                          key={lote.id}
                          onClick={() => toggleLote(lote)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedLotes.find((l) => l.id === lote.id)
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/50 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-mono font-semibold text-primary">{lote.codigo}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {lote.variedade?.join(", ")} - {lote.processo}
                              </p>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                <Badge variant="outline">{lote.quantidade} {lote.unidade}</Badge>
                                <Badge variant="secondary">{lote.safra}</Badge>
                                {lote.certificacao && <Badge>{lote.certificacao}</Badge>}
                              </div>
                            </div>
                            {selectedLotes.find((l) => l.id === lote.id) && (
                              <Badge className="bg-primary">✓ Selecionado</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedLotes.length > 0 && (
                      <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-lg">
                              Total: {selectedLotes.reduce((acc, l) => acc + parseFloat(l.quantidade), 0).toFixed(2)} {selectedLotes[0].unidade}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedLotes.length} lote(s) selecionado(s)
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLotes([])}
                          >
                            Limpar Seleção
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informações do Importador */}
          <Card>
            <CardHeader>
              <CardTitle>Destino e Importador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destino_pais">País de Destino *</Label>
                  <Select 
                    onValueChange={(value) => {
                      setSelectedPais(value);
                      setValue("destino_pais", value);
                      setValue("destino_cidade", "");
                    }}
                  >
                    <SelectTrigger id="destino_pais">
                      <SelectValue placeholder="Selecione um país" />
                    </SelectTrigger>
                    <SelectContent>
                      {paisesECidades.map((pais) => (
                        <SelectItem key={pais.codigo} value={pais.nome}>
                          {pais.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.destino_pais && (
                    <p className="text-sm text-destructive">{errors.destino_pais.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destino_cidade">Cidade de Destino</Label>
                  <Select 
                    onValueChange={(value) => setValue("destino_cidade", value)}
                    disabled={!selectedPais}
                  >
                    <SelectTrigger id="destino_cidade">
                      <SelectValue placeholder={selectedPais ? "Selecione uma cidade" : "Selecione um país primeiro"} />
                    </SelectTrigger>
                    <SelectContent>
                      {paisesECidades
                        .find((p) => p.nome === selectedPais)
                        ?.cidades.map((cidade) => (
                          <SelectItem key={cidade.nome} value={cidade.nome}>
                            {cidade.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="importador_nome">Nome do Importador *</Label>
                <Input id="importador_nome" {...register("importador_nome")} />
                {errors.importador_nome && (
                  <p className="text-sm text-destructive">{errors.importador_nome.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="importador_documento">Documento do Importador</Label>
                <Input id="importador_documento" placeholder="NIF, CNPJ, etc." {...register("importador_documento")} />
              </div>
            </CardContent>
          </Card>

          {/* Normas e Certificações */}
          <Card>
            <CardHeader>
              <CardTitle>Normas e Certificações</CardTitle>
              <CardDescription>Adicione as normas e certificações cumpridas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: ISO 9001, Orgânico, Fair Trade..."
                  value={novaNorma}
                  onChange={(e) => setNovaNorma(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNorma())}
                />
                <Button type="button" onClick={addNorma}>Adicionar</Button>
              </div>
              {normasSelecionadas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {normasSelecionadas.map((norma, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {norma}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeNorma(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor_total">Valor Total</Label>
                  <Input id="valor_total" type="number" step="0.01" {...register("valor_total")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moeda">Moeda</Label>
                  <Select defaultValue="AOA" onValueChange={(value) => setValue("moeda", value)}>
                    <SelectTrigger id="moeda">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AOA">AOA (Kwanza)</SelectItem>
                      <SelectItem value="USD">USD (Dólar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_validade">Data de Validade *</Label>
                  <Input id="data_validade" type="date" {...register("data_validade")} />
                  {errors.data_validade && (
                    <p className="text-sm text-destructive">{errors.data_validade.message as string}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  rows={4}
                  placeholder="Informações adicionais sobre a exportação..."
                  {...register("observacoes")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/certificados-exportacao")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Certificado"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
