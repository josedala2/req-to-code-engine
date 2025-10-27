import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Phone, Mail } from "lucide-react";

const producers = [
  {
    id: 1,
    name: "Fazenda Santa Clara",
    owner: "João Silva",
    location: "Minas Gerais - Carmo de Minas",
    area: "85 hectares",
    varieties: ["Bourbon Amarelo", "Catuaí Vermelho"],
    certifications: ["Orgânico", "Fair Trade"],
    contact: {
      phone: "(35) 3295-1234",
      email: "contato@fazendasantaclara.com.br",
    },
  },
  {
    id: 2,
    name: "Sítio Bela Vista",
    owner: "Maria Santos",
    location: "São Paulo - Franca",
    area: "42 hectares",
    varieties: ["Catuaí Vermelho", "Mundo Novo"],
    certifications: ["UTZ", "Rainforest Alliance"],
    contact: {
      phone: "(16) 3702-5678",
      email: "maria@sitiobelavista.com.br",
    },
  },
  {
    id: 3,
    name: "Fazenda São José",
    owner: "Carlos Oliveira",
    location: "Espírito Santo - Venda Nova",
    area: "120 hectares",
    varieties: ["Conilon", "Robusta"],
    certifications: ["4C", "Orgânico"],
    contact: {
      phone: "(27) 3740-9012",
      email: "carlos@fazendasaojose.com.br",
    },
  },
];

export default function Produtores() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Produtores</h2>
          <p className="text-muted-foreground">Gestão de produtores e fazendas</p>
        </div>
        <Button className="bg-gradient-coffee hover:opacity-90 shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produtor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtor por nome, localização ou certificação..."
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {producers.map((producer) => (
          <Card key={producer.id} className="shadow-elegant hover:shadow-glow transition-all">
            <CardHeader>
              <CardTitle className="text-lg">{producer.name}</CardTitle>
              <CardDescription>{producer.owner}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{producer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{producer.contact.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground break-all">{producer.contact.email}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium mb-2">Área: {producer.area}</p>
                <p className="text-sm font-medium mb-2">Variedades:</p>
                <div className="flex flex-wrap gap-2">
                  {producer.varieties.map((variety) => (
                    <Badge key={variety} variant="secondary">
                      {variety}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium mb-2">Certificações:</p>
                <div className="flex flex-wrap gap-2">
                  {producer.certifications.map((cert) => (
                    <Badge key={cert} className="bg-gradient-natural text-secondary-foreground">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
