import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Calendar, Weight, MapPin, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoteForm } from "@/components/forms/LoteForm";
import { generateLotesPDF } from "@/lib/pdfGenerator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const batches = [
  {
    id: "LOT-2025-001",
    producer: "Fazenda Santa Clara",
    variety: "Bourbon Amarelo",
    harvestDate: "15/01/2025",
    quantity: "1.200 kg",
    process: "Natural",
    quality: "Premium",
    status: "Em processamento",
    location: "Secador 3",
  },
  {
    id: "LOT-2025-002",
    producer: "Sítio Bela Vista",
    variety: "Catuaí Vermelho",
    harvestDate: "12/01/2025",
    quantity: "850 kg",
    process: "Cereja Descascado",
    quality: "Gourmet",
    status: "Pronto",
    location: "Armazém B",
  },
  {
    id: "LOT-2024-458",
    producer: "Fazenda São José",
    variety: "Mundo Novo",
    harvestDate: "28/12/2024",
    quantity: "2.100 kg",
    process: "Lavado",
    quality: "Premium",
    status: "Exportado",
    location: "Container 45HC",
  },
  {
    id: "LOT-2025-003",
    producer: "Fazenda Santa Clara",
    variety: "Catuaí Vermelho",
    harvestDate: "18/01/2025",
    quantity: "950 kg",
    process: "Natural",
    quality: "Especial",
    status: "Em processamento",
    location: "Terreiro 2",
  },
  {
    id: "LOT-2024-459",
    producer: "Sítio Bela Vista",
    variety: "Bourbon Amarelo",
    harvestDate: "30/12/2024",
    quantity: "1.450 kg",
    process: "Honey",
    quality: "Premium",
    status: "Pronto",
    location: "Armazém A",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Em processamento":
      return "bg-warning/10 text-warning border-warning/20";
    case "Pronto":
      return "bg-success/10 text-success border-success/20";
    case "Exportado":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getQualityColor = (quality: string) => {
  switch (quality) {
    case "Premium":
      return "bg-gradient-coffee text-primary-foreground";
    case "Gourmet":
      return "bg-gradient-natural text-secondary-foreground";
    case "Especial":
      return "bg-accent/80 text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Lotes() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Lotes de Café</h2>
          <p className="text-muted-foreground">Rastreamento completo da produção</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateLotesPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-coffee hover:opacity-90 shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Novo Lote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Lote</DialogTitle>
                <DialogDescription>
                  Registre um novo lote de café para rastreabilidade
                </DialogDescription>
              </DialogHeader>
              <LoteForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por código, produtor, variedade ou status..."
          className="pl-10"
        />
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Todos os Lotes</CardTitle>
          <CardDescription>Visualize e gerencie todos os lotes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Código</TableHead>
                  <TableHead className="font-bold">Produtor</TableHead>
                  <TableHead className="font-bold">Variedade</TableHead>
                  <TableHead className="font-bold">Colheita</TableHead>
                  <TableHead className="font-bold">Quantidade</TableHead>
                  <TableHead className="font-bold">Processo</TableHead>
                  <TableHead className="font-bold">Qualidade</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Localização</TableHead>
                  <TableHead className="font-bold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-semibold text-primary">
                      {batch.id}
                    </TableCell>
                    <TableCell>{batch.producer}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{batch.variety}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {batch.harvestDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        {batch.quantity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{batch.process}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getQualityColor(batch.quality)}>
                        {batch.quality}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{batch.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/lotes/${batch.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
