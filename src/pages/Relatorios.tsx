import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, TrendingUp, Filter, Users, Package, Award } from "lucide-react";
import { 
  generateProdutoresPDF, 
  generateLotesPDF, 
  generateQualidadePDF, 
  generateCertificacoesPDF 
} from "@/lib/pdfGenerator";
import { toast } from "sonner";

const reports = [
  {
    id: 1,
    title: "Relatório de Produção Mensal",
    description: "Análise completa da produção de janeiro/2025",
    period: "Janeiro 2025",
    type: "Produção",
    generatedAt: "01/02/2025",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Análise de Qualidade Trimestral",
    description: "Resumo das análises de qualidade Q4 2024",
    period: "Out-Dez 2024",
    type: "Qualidade",
    generatedAt: "15/01/2025",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Rastreabilidade por Lote",
    description: "Histórico completo de rastreabilidade dos lotes",
    period: "2024",
    type: "Rastreabilidade",
    generatedAt: "05/01/2025",
    size: "5.2 MB",
  },
  {
    id: 4,
    title: "Certificações e Conformidades",
    description: "Status de todas as certificações ativas",
    period: "Janeiro 2025",
    type: "Certificações",
    generatedAt: "20/01/2025",
    size: "890 KB",
  },
];

const quickReports = [
  {
    name: "Produção por Produtor",
    description: "Quantidade produzida por cada fazenda",
    icon: TrendingUp,
  },
  {
    name: "Qualidade Média",
    description: "Score médio de qualidade por período",
    icon: TrendingUp,
  },
  {
    name: "Status de Lotes",
    description: "Distribuição de lotes por status",
    icon: TrendingUp,
  },
  {
    name: "Certificações Ativas",
    description: "Lista completa de certificações válidas",
    icon: TrendingUp,
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "Produção":
      return "bg-primary/10 text-primary border-primary/20";
    case "Qualidade":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "Rastreabilidade":
      return "bg-accent/10 text-accent border-accent/20";
    case "Certificações":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function Relatorios() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Relatórios</h2>
          <p className="text-muted-foreground">Análises e exportação de dados</p>
        </div>
        <Button className="bg-gradient-coffee hover:opacity-90 shadow-glow">
          <FileText className="h-4 w-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      {/* Quick Reports */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Relatórios Rápidos</CardTitle>
          <CardDescription>Gere relatórios instantâneos com dados actualizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Produtores</Badge>
                </div>
                <CardTitle className="mt-4">Produtores</CardTitle>
                <CardDescription>Lista completa de produtores cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => {
                  generateProdutoresPDF();
                  toast.success("Relatório gerado com sucesso!");
                }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Package className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Lotes</Badge>
                </div>
                <CardTitle className="mt-4">Lotes</CardTitle>
                <CardDescription>Histórico de todos os lotes produzidos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => {
                  generateLotesPDF();
                  toast.success("Relatório gerado com sucesso!");
                }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Qualidade</Badge>
                </div>
                <CardTitle className="mt-4">Qualidade</CardTitle>
                <CardDescription>Análises e pontuações de qualidade</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => {
                  generateQualidadePDF();
                  toast.success("Relatório gerado com sucesso!");
                }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Award className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">Certificações</Badge>
                </div>
                <CardTitle className="mt-4">Certificações</CardTitle>
                <CardDescription>Status de todas as certificações</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => {
                  generateCertificacoesPDF();
                  toast.success("Relatório gerado com sucesso!");
                }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="shadow-elegant">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar por Tipo
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Filtrar por Período
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="shadow-elegant hover:shadow-glow transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <Badge variant="outline" className={getTypeColor(report.type)}>
                        {report.type}
                      </Badge>
                    </div>
                    <CardDescription className="mb-3">{report.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {report.period}
                      </div>
                      <span>•</span>
                      <span>Gerado em {report.generatedAt}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-coffee hover:opacity-90">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Export Options */}
      <Card className="shadow-elegant bg-gradient-subtle">
        <CardHeader>
          <CardTitle>Opções de Exportação</CardTitle>
          <CardDescription>Os relatórios são exportados em formato PDF com tabelas e gráficos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => {
              generateProdutoresPDF();
              toast.success("Relatório de produtores exportado!");
            }}>
              <Download className="mr-2 h-4 w-4" />
              Produtores PDF
            </Button>
            <Button variant="outline" onClick={() => {
              generateLotesPDF();
              toast.success("Relatório de lotes exportado!");
            }}>
              <Download className="mr-2 h-4 w-4" />
              Lotes PDF
            </Button>
            <Button variant="outline" onClick={() => {
              generateQualidadePDF();
              toast.success("Relatório de qualidade exportado!");
            }}>
              <Download className="mr-2 h-4 w-4" />
              Qualidade PDF
            </Button>
            <Button variant="outline" onClick={() => {
              generateCertificacoesPDF();
              toast.success("Relatório de certificações exportado!");
            }}>
              <Download className="mr-2 h-4 w-4" />
              Certificações PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
