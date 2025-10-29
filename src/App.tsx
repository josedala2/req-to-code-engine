import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Produtores from "./pages/Produtores";
import Lotes from "./pages/Lotes";
import Qualidade from "./pages/Qualidade";
import Certificacoes from "./pages/Certificacoes";
import Relatorios from "./pages/Relatorios";
import Auditorias from "./pages/Auditorias";
import AuditoriaDetalhes from "./pages/AuditoriaDetalhes";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProdutorDetalhes from "./pages/ProdutorDetalhes";
import LoteDetalhes from "./pages/LoteDetalhes";
import QualidadeDetalhes from "./pages/QualidadeDetalhes";
import CertificacaoDetalhes from "./pages/CertificacaoDetalhes";
import Auth from "./pages/Auth";
import AprovacaoProdutores from "./pages/AprovacaoProdutores";
import LotePublico from "./pages/LotePublico";
import ConfiguracoesUsuarios from "./pages/ConfiguracoesUsuarios";
import EmpresaAuth from "./pages/EmpresaAuth";
import EmpresaDashboard from "./pages/EmpresaDashboard";
import SolicitarCertificacao from "./pages/SolicitarCertificacao";
import EmpresaPedidoDetalhes from "./pages/EmpresaPedidoDetalhes";
import AprovarEmpresa from "./pages/AprovarEmpresa";
import AprovarPedidoCertificacao from "./pages/AprovarPedidoCertificacao";
import Aprovacoes from "./pages/Aprovacoes";
import AprovacaoEmpresas from "./pages/AprovacaoEmpresas";
import AprovacaoPedidos from "./pages/AprovacaoPedidos";
import Marketplace from "./pages/Marketplace";
import MinhasOfertas from "./pages/MinhasOfertas";
import Negociacoes from "./pages/Negociacoes";
import CertificadosExportacao from "./pages/CertificadosExportacao";
import CertificadoExportacaoForm from "./components/forms/CertificadoExportacaoForm";
import CertificadoExportacaoDetalhes from "./pages/CertificadoExportacaoDetalhes";
import CertificadoExportacaoEditar from "./pages/CertificadoExportacaoEditar";
import CertificadoExportacaoPublico from "./pages/CertificadoExportacaoPublico";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/negociacoes" element={<Negociacoes />} />
          <Route path="/lote-publico/:codigo" element={<LotePublico />} />
          <Route path="/certificado-exportacao/:numero" element={<CertificadoExportacaoPublico />} />
          <Route path="/empresa/auth" element={<EmpresaAuth />} />
          <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
          <Route path="/empresa/pedido/:id" element={<EmpresaPedidoDetalhes />} />
          <Route path="/solicitar-certificacao" element={<SolicitarCertificacao />} />
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/produtores" element={<Produtores />} />
                <Route path="/produtores/:id" element={<ProdutorDetalhes />} />
                <Route path="/aprovacoes" element={<Aprovacoes />} />
                <Route path="/aprovacao-produtores" element={<AprovacaoProdutores />} />
                <Route path="/aprovacao-empresas" element={<AprovacaoEmpresas />} />
                <Route path="/aprovacao-pedidos" element={<AprovacaoPedidos />} />
                <Route path="/aprovar-empresa/:id" element={<AprovarEmpresa />} />
                <Route path="/aprovar-pedido/:id" element={<AprovarPedidoCertificacao />} />
                <Route path="/lotes" element={<Lotes />} />
                <Route path="/lotes/:id" element={<LoteDetalhes />} />
                <Route path="/qualidade" element={<Qualidade />} />
                <Route path="/qualidade/:id" element={<QualidadeDetalhes />} />
                <Route path="/certificacoes" element={<Certificacoes />} />
                <Route path="/certificacoes/:id" element={<CertificacaoDetalhes />} />
                <Route path="/auditorias" element={<Auditorias />} />
                <Route path="/auditorias/:id" element={<AuditoriaDetalhes />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/minhas-ofertas" element={<MinhasOfertas />} />
                <Route path="/certificados-exportacao" element={<CertificadosExportacao />} />
                <Route path="/certificados-exportacao/novo" element={<CertificadoExportacaoForm />} />
                <Route path="/certificados-exportacao/:id" element={<CertificadoExportacaoDetalhes />} />
                <Route path="/certificados-exportacao/:id/editar" element={<CertificadoExportacaoEditar />} />
                <Route path="/configuracoes-usuarios" element={<ConfiguracoesUsuarios />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
