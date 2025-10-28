import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEmpresaAuth } from "@/hooks/useEmpresaAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Award, Package, TrendingUp } from "lucide-react";
import mukafeLogo from "@/assets/mukafe-logo.png";

export default function SolicitarCertificacao() {
  const navigate = useNavigate();
  const { user, empresa, loading } = useEmpresaAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tipoCertificacao, setTipoCertificacao] = useState("");
  const [quantidadeLotes, setQuantidadeLotes] = useState("");
  const [volumeEstimado, setVolumeEstimado] = useState("");
  const [unidadeVolume, setUnidadeVolume] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !empresa) {
      toast.error("É necessário fazer login como empresa");
      navigate("/empresa/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("pedidos_certificacao")
        .insert([{
          empresa_id: empresa.id,
          numero_pedido: '',
          tipo_certificacao: tipoCertificacao as any,
          quantidade_lotes: parseInt(quantidadeLotes),
          volume_estimado: parseFloat(volumeEstimado),
          unidade_volume: unidadeVolume,
          observacoes: observacoes || null,
        }]);

      if (error) throw error;

      toast.success("Pedido de certificação enviado com sucesso!");
      navigate("/empresa/dashboard");
    } catch (error: any) {
      console.error("Erro ao enviar pedido:", error);
      toast.error("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !empresa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={mukafeLogo} alt="MUKAFE" className="h-16 w-auto" />
            </div>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              É necessário fazer login como empresa para solicitar certificação
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => navigate("/empresa/auth")}>
              Fazer Login
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 p-4">
      <div className="max-w-3xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/empresa/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Solicitar Certificação</CardTitle>
                <CardDescription>
                  Empresa: {empresa.nome_empresa}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Certificação</Label>
                <Select value={tipoCertificacao} onValueChange={setTipoCertificacao} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organico">Orgânico</SelectItem>
                    <SelectItem value="fair_trade">Fair Trade</SelectItem>
                    <SelectItem value="rainforest_alliance">Rainforest Alliance</SelectItem>
                    <SelectItem value="utz">UTZ</SelectItem>
                    <SelectItem value="cafe_especial">Café Especial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade de Lotes</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="quantidade"
                      type="number"
                      min="1"
                      placeholder="Ex: 5"
                      value={quantidadeLotes}
                      onChange={(e) => setQuantidadeLotes(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade de Volume</Label>
                  <Select value={unidadeVolume} onValueChange={setUnidadeVolume} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                      <SelectItem value="sacas">Sacas (60kg)</SelectItem>
                      <SelectItem value="ton">Toneladas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Volume Estimado Total</Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="volume"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 5000"
                    value={volumeEstimado}
                    onChange={(e) => setVolumeEstimado(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (Opcional)</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre o pedido..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Próximos Passos</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Análise da documentação enviada</li>
                  <li>Agendamento da auditoria</li>
                  <li>Realização da auditoria in loco</li>
                  <li>Emissão do certificado</li>
                  <li>Disponibilização dos selos de embalagem</li>
                </ol>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
