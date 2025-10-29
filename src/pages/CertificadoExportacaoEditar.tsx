import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Loader2, ArrowLeft, Package, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { paisesECidades } from "@/data/paisesECidades";
import { tiposCertificacao } from "@/data/certificacoesCafe";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  destino_pais: z.string().min(2, "País de destino é obrigatório"),
  destino_cidade: z.string().optional(),
  importador_nome: z.string().min(2, "Nome do importador é obrigatório"),
  importador_documento: z.string().optional(),
  valor_total: z.string().optional(),
  moeda: z.string().default("AOA"),
  data_validade: z.string().min(1, "Data de validade é obrigatória"),
  observacoes: z.string().optional(),
});

export default function CertificadoExportacaoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedLotes, setSelectedLotes] = useState<any[]>([]);
  const [normasSelecionadas, setNormasSelecionadas] = useState<string[]>([]);
  const [novaNorma, setNovaNorma] = useState("");
  const [selectedPais, setSelectedPais] = useState<string>("");
  const [certificacoesSelecionadas, setCertificacoesSelecionadas] = useState<string[]>([]);
  const [certificado, setCertificado] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(formSchema),
  });

  // Carregar dados do certificado
  useEffect(() => {
    const fetchCertificado = async () => {
      try {
        setLoadingData(true);
        const { data, error } = await supabase
          .from("certificados_exportacao")
          .select(`
            *,
            produtores (nome, nome_fazenda)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        
        setCertificado(data);
        
        // Preencher formulário
        setValue("destino_pais", data.destino_pais);
        setValue("destino_cidade", data.destino_cidade || "");
        setValue("importador_nome", data.importador_nome);
        setValue("importador_documento", data.importador_documento || "");
        setValue("valor_total", data.valor_total?.toString() || "");
        setValue("moeda", data.moeda || "AOA");
        setValue("data_validade", data.data_validade);
        setValue("observacoes", data.observacoes || "");
        
        setSelectedPais(data.destino_pais);
        
        // Processar normas e certificações
        if (data.normas_cumpridas && data.normas_cumpridas.length > 0) {
          const certValues: string[] = [];
          const normasExtras: string[] = [];
          
          data.normas_cumpridas.forEach((norma: string) => {
            const cert = tiposCertificacao.find(c => c.label === norma);
            if (cert) {
              certValues.push(cert.value);
            } else {
              normasExtras.push(norma);
            }
          });
          
          setCertificacoesSelecionadas(certValues);
          setNormasSelecionadas(normasExtras);
        }

        // Carregar lotes
        const { data: lotesData, error: lotesError } = await supabase
          .from("lotes")
          .select("*")
          .in("id", data.lotes_ids);

        if (lotesError) throw lotesError;
        setSelectedLotes(lotesData || []);
      } catch (error) {
        console.error("Erro ao carregar certificado:", error);
        toast.error("Erro ao carregar dados do certificado");
        navigate("/certificados-exportacao");
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchCertificado();
    }
  }, [id, navigate, setValue]);

  const toggleCertificacao = (value: string) => {
    setCertificacoesSelecionadas((prev) => {
      if (prev.includes(value)) {
        return prev.filter((c) => c !== value);
      } else {
        return [...prev, value];
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
    try {
      setLoading(true);

      const updateData: any = {
        destino_pais: formData.destino_pais,
        importador_nome: formData.importador_nome,
        data_validade: formData.data_validade,
      };

      if (formData.destino_cidade) updateData.destino_cidade = formData.destino_cidade;
      if (formData.importador_documento) updateData.importador_documento = formData.importador_documento;
      if (formData.valor_total) updateData.valor_total = parseFloat(formData.valor_total);
      if (formData.moeda) updateData.moeda = formData.moeda;
      
      // Combinar normas e certificações
      const todasNormas = [...normasSelecionadas];
      if (certificacoesSelecionadas.length > 0) {
        const labelsCertificacoes = certificacoesSelecionadas.map(
          (value) => tiposCertificacao.find((c) => c.value === value)?.label || value
        );
        todasNormas.push(...labelsCertificacoes);
      }
      if (todasNormas.length > 0) updateData.normas_cumpridas = todasNormas;
      
      if (formData.observacoes) updateData.observacoes = formData.observacoes;

      const { error } = await supabase
        .from("certificados_exportacao")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Certificado atualizado com sucesso!");
      navigate(`/certificados-exportacao/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar certificado:", error);
      toast.error("Erro ao atualizar certificado");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!certificado) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Certificado não encontrado</p>
            <Button onClick={() => navigate("/certificados-exportacao")} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate(`/certificados-exportacao/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Certificado</h1>
            <p className="text-muted-foreground">{certificado.numero_certificado}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações do Produtor (apenas exibição) */}
          <Card>
            <CardHeader>
              <CardTitle>Exportador</CardTitle>
              <CardDescription>Informações não editáveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-semibold">Nome:</span> {certificado.produtores?.nome}</p>
                <p><span className="font-semibold">Fazenda:</span> {certificado.produtores?.nome_fazenda}</p>
              </div>
            </CardContent>
          </Card>

          {/* Lotes (apenas exibição) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Lotes Selecionados
              </CardTitle>
              <CardDescription>Não é possível alterar os lotes após a criação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedLotes.map((lote) => (
                  <div key={lote.id} className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-mono font-semibold text-primary">{lote.codigo}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {lote.variedade?.join(", ")} - {lote.processo}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{lote.quantidade} {lote.unidade}</Badge>
                          <Badge variant="secondary">{lote.safra}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Destino e Importador */}
          <Card>
            <CardHeader>
              <CardTitle>Destino e Importador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destino_pais">País de Destino *</Label>
                  <Select 
                    value={selectedPais}
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
                    value={certificado.destino_cidade || ""}
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

          {/* Certificações de Café */}
          <Card>
            <CardHeader>
              <CardTitle>Certificações de Café</CardTitle>
              <CardDescription>Selecione as certificações do café exportado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tiposCertificacao.map((cert) => (
                  <div key={cert.value} className="flex items-start space-x-3 space-y-0">
                    <Checkbox
                      id={cert.value}
                      checked={certificacoesSelecionadas.includes(cert.value)}
                      onCheckedChange={() => toggleCertificacao(cert.value)}
                    />
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor={cert.value}
                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cert.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {cert.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Normas Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Normas Adicionais</CardTitle>
              <CardDescription>Adicione outras normas ou padrões cumpridos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: ISO 9001, HACCP, BRC..."
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
                  <Select defaultValue={certificado.moeda || "AOA"} onValueChange={(value) => setValue("moeda", value)}>
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
            <Button type="button" variant="outline" onClick={() => navigate(`/certificados-exportacao/${id}`)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
