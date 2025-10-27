import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Mail, Leaf, Award, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const producerData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Fazenda Santa Clara",
    owner: "João Silva",
    location: "Huíla - Chibia",
    area: "85 hectares",
    varieties: ["Bourbon Amarelo", "Catuaí Vermelho"],
    certifications: ["Orgânico", "Fair Trade"],
    contact: {
      phone: "+244 923 456 789",
      email: "contato@fazendasantaclara.ao",
    },
    history: "Fundada em 1985, a Fazenda Santa Clara é pioneira na produção de cafés especiais na região de Chibia. Com foco em sustentabilidade e qualidade, a fazenda implementou práticas orgânicas desde 2005.",
    production: {
      annual: "2.500 sacas",
      quality: "85% Premium, 15% Gourmet",
      mainMarkets: ["Europa", "Ásia", "América do Norte"],
    },
    infrastructure: {
      processing: "Terreiros suspensos, Secadores mecânicos",
      storage: "Armazém climatizado 500 sacas",
      equipment: "Despolpador, Lavador, Classificadora eletrônica",
    },
  },
};

export default function ProdutorDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const producer = (id && producerData[id]) || producerData["1"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/produtores")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-3xl">{producer.name}</CardTitle>
            <CardDescription className="text-lg">{producer.owner}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-muted-foreground">{producer.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-muted-foreground">{producer.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-muted-foreground">{producer.contact.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-muted-foreground leading-relaxed">{producer.history}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
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

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {producer.certifications.map((cert) => (
                  <Badge key={cert} className="bg-gradient-natural text-secondary-foreground">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Variedades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {producer.varieties.map((variety) => (
                  <Badge key={variety} variant="secondary">
                    {variety}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="production" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="production">Produção</TabsTrigger>
          <TabsTrigger value="infrastructure">Infraestrutura</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="mt-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Informações de Produção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-1">Produção Anual</p>
                <p className="text-2xl font-bold text-primary">{producer.production.annual}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Distribuição de Qualidade</p>
                <p className="text-muted-foreground">{producer.production.quality}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Principais Mercados</p>
                <div className="flex flex-wrap gap-2">
                  {producer.production.mainMarkets.map((market) => (
                    <Badge key={market} variant="outline">{market}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="mt-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Infraestrutura da Fazenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-1">Processamento</p>
                <p className="text-muted-foreground">{producer.infrastructure.processing}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Armazenamento</p>
                <p className="text-muted-foreground">{producer.infrastructure.storage}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Equipamentos</p>
                <p className="text-muted-foreground">{producer.infrastructure.equipment}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
