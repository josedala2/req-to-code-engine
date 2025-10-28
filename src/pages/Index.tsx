import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Building2, Shield, Coffee, Award } from "lucide-react";
import mukafeLogo from "@/assets/mukafe-logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <img src={mukafeLogo} alt="MUKAFE" className="h-24 w-auto mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-coffee bg-clip-text text-transparent">
            Sistema Nacional de Rastreabilidade do Café
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma integrada para certificação, rastreabilidade e gestão de qualidade do café angolano
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Portal Empresas */}
          <Card className="shadow-elegant hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Portal de Empresas</CardTitle>
                  <CardDescription>Para empresas e exportadores</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Solicite certificações, acompanhe auditorias e obtenha selos de qualidade para seus produtos.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Solicitação de certificações
                </li>
                <li className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-primary" />
                  Acompanhamento de processos
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Download de selos e certificados
                </li>
              </ul>
              <div className="flex flex-col gap-2 pt-4">
                <Button 
                  className="w-full bg-gradient-coffee hover:opacity-90"
                  onClick={() => navigate("/empresa/auth")}
                >
                  Entrar / Registar Empresa
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/solicitar-certificacao")}
                >
                  Solicitar Certificação
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sistema Administrativo */}
          <Card className="shadow-elegant hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Sistema Administrativo</CardTitle>
                  <CardDescription>Para gestores e auditores</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Gerencie produtores, lotes, auditorias, análises de qualidade e emita certificações.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-primary" />
                  Gestão de produtores e lotes
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Controle de certificações
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Auditorias e relatórios
                </li>
              </ul>
              <div className="flex flex-col gap-2 pt-4">
                <Button 
                  className="w-full"
                  onClick={() => navigate("/auth")}
                >
                  Acesso Administrativo
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Funcionalidades do Sistema</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center shadow-elegant">
              <CardContent className="pt-6">
                <Coffee className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Rastreabilidade Completa</h3>
                <p className="text-sm text-muted-foreground">
                  Do produtor ao consumidor, cada lote totalmente rastreável
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-elegant">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Certificações Internacionais</h3>
                <p className="text-sm text-muted-foreground">
                  Orgânico, Fair Trade, Rainforest Alliance e mais
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-elegant">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Garantia de Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Análises rigorosas e controle de qualidade em cada etapa
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
