import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Calendar, FileCheck, AlertCircle, Building } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const certificationData = {
  "CERT-001": {
    id: "CERT-001",
    type: "Orgânico",
    certifier: "IBD Certificações",
    producer: "Fazenda Santa Clara",
    issueDate: "15/03/2024",
    expiryDate: "15/03/2025",
    status: "Ativa",
    certificateNumber: "BR-BIO-001-2024",
    scope: "Produção de café arábica orgânico",
    standards: [
      "Regulamento CE 834/2007",
      "USDA NOP",
      "JAS (Japão)",
      "Instrução Normativa 19/2009 (Brasil)",
    ],
    requirements: [
      "Ausência de agrotóxicos sintéticos",
      "Não utilização de fertilizantes químicos",
      "Preservação de áreas de mata nativa",
      "Manejo sustentável do solo",
      "Rastreabilidade completa da produção",
    ],
    audits: [
      {
        date: "10/03/2024",
        type: "Auditoria de Renovação",
        result: "Aprovado",
        auditor: "Carlos Mendes - IBD",
      },
      {
        date: "15/09/2023",
        type: "Auditoria de Acompanhamento",
        result: "Aprovado",
        auditor: "Ana Paula Santos - IBD",
      },
    ],
    documents: [
      "Certificado Orgânico 2024-2025",
      "Relatório de Auditoria",
      "Plano de Manejo Orgânico",
      "Registro de Insumos Permitidos",
    ],
    benefits: [
      "Acesso a mercados premium",
      "Valorização do produto (20-30%)",
      "Diferenciação no mercado",
      "Sustentabilidade ambiental",
    ],
  },
};

export default function CertificacaoDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const cert = certificationData[id as keyof typeof certificationData] || certificationData["CERT-001"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "bg-success/10 text-success border-success/20";
      case "Pendente":
        return "bg-warning/10 text-warning border-warning/20";
      case "Expirada":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/certificacoes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  {cert.type}
                </CardTitle>
                <CardDescription className="text-lg mt-2">{cert.producer}</CardDescription>
              </div>
              <Badge variant="outline" className={`${getStatusColor(cert.status)} text-lg px-4 py-2`}>
                {cert.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Certificadora</p>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  <p className="font-medium">{cert.certifier}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Número do Certificado</p>
                <p className="font-mono font-medium">{cert.certificateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Emissão</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="font-medium">{cert.issueDate}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Validade</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="font-medium">{cert.expiryDate}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Escopo da Certificação
              </h3>
              <p className="text-muted-foreground">{cert.scope}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Normas e Regulamentos</h3>
              <div className="flex flex-wrap gap-2">
                {cert.standards.map((standard) => (
                  <Badge key={standard} variant="secondary">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Requisitos Principais
              </h3>
              <ul className="space-y-2">
                {cert.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Benefícios</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cert.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cert.documents.map((doc) => (
                  <Button key={doc} variant="outline" className="w-full justify-start" size="sm">
                    <FileCheck className="h-4 w-4 mr-2" />
                    {doc}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Histórico de Auditorias</CardTitle>
          <CardDescription>Registro de inspeções e avaliações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cert.audits.map((audit, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{audit.type}</p>
                  <Badge className="bg-success/10 text-success border-success/20">
                    {audit.result}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data: </span>
                    <span className="font-medium">{audit.date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auditor: </span>
                    <span className="font-medium">{audit.auditor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
