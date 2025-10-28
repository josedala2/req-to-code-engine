import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Mail, Leaf, Award, TrendingUp, Users, Edit, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FarmMap from "@/components/FarmMap";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProdutorForm } from "@/components/forms/ProdutorForm";
import { useUserRole } from "@/hooks/useUserRole";

export default function ProdutorDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [producer, setProducer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { isAdmin, loading: roleLoading } = useUserRole();

  const fetchProducer = async () => {
    try {
      const { data, error } = await supabase
        .from('produtores')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProducer(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
      navigate('/produtores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProducer();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('produtores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Produtor excluído",
        description: "O produtor foi excluído com sucesso.",
      });
      navigate('/produtores');
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    if (id) {
      fetchProducer();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!producer) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/produtores")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Produtor</DialogTitle>
                  <DialogDescription>
                    Atualize os dados do produtor e da propriedade
                  </DialogDescription>
                </DialogHeader>
                <ProdutorForm 
                  initialData={producer} 
                  isEditing={true}
                  onSuccess={handleEditSuccess} 
                />
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl">{producer.nome_fazenda}</CardTitle>
            <CardDescription className="text-lg">{producer.nome}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-muted-foreground">{producer.provincia} - {producer.municipio} - {producer.comuna}</p>
                </div>
              </div>
              {producer.telefone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-muted-foreground">{producer.telefone}</p>
                  </div>
                </div>
              )}
              {producer.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-muted-foreground">{producer.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Recursos Humanos</p>
                  <p className="text-muted-foreground">
                    Efetivos: {producer.trabalhadores_efetivos_homens || 0}H / {producer.trabalhadores_efetivos_mulheres || 0}M
                    <br />
                    Colaboradores: {producer.trabalhadores_colaboradores_homens || 0}H / {producer.trabalhadores_colaboradores_mulheres || 0}M
                  </p>
                </div>
              </div>
            </div>

            {producer.observacoes && (
              <div className="pt-4 border-t">
                <p className="text-muted-foreground leading-relaxed">{producer.observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {producer.area && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Área Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{producer.area}</p>
              </CardContent>
            </Card>
          )}

          {producer.certificacoes && producer.certificacoes.length > 0 && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {producer.certificacoes.map((cert: string) => (
                    <Badge key={cert} className="bg-gradient-natural text-secondary-foreground">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {producer.variedades && producer.variedades.length > 0 && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Variedades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {producer.variedades.map((variety: string) => (
                    <Badge key={variety} variant="secondary">
                      {variety}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {producer.identificacao_fazenda && (
            <div>
              <p className="font-medium mb-1">Identificação da Fazenda</p>
              <p className="text-muted-foreground">{producer.identificacao_fazenda}</p>
            </div>
          )}
          {producer.forma_aquisicao && (
            <div>
              <p className="font-medium mb-1">Forma de Aquisição</p>
              <p className="text-muted-foreground">{producer.forma_aquisicao}</p>
            </div>
          )}
          {producer.tipo_producao && (
            <div>
              <p className="font-medium mb-1">Tipo de Produção</p>
              <p className="text-muted-foreground">{producer.tipo_producao}</p>
            </div>
          )}
          {producer.altitude && (
            <div>
              <p className="font-medium mb-1">Altitude</p>
              <p className="text-muted-foreground">{producer.altitude}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Section */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Localização da Fazenda</CardTitle>
          <CardDescription>{producer.nome_fazenda}</CardDescription>
        </CardHeader>
        <CardContent>
          <FarmMap 
            georeferencia={producer.georeferencia} 
            nomeFazenda={producer.nome_fazenda}
          />
        </CardContent>
      </Card>
    </div>
  );
}
