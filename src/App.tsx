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
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProdutorDetalhes from "./pages/ProdutorDetalhes";
import LoteDetalhes from "./pages/LoteDetalhes";
import QualidadeDetalhes from "./pages/QualidadeDetalhes";
import CertificacaoDetalhes from "./pages/CertificacaoDetalhes";
import Auth from "./pages/Auth";
import AprovacaoProdutores from "./pages/AprovacaoProdutores";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/produtores" element={<Layout><Produtores /></Layout>} />
          <Route path="/produtores/:id" element={<Layout><ProdutorDetalhes /></Layout>} />
          <Route path="/aprovacao-produtores" element={<Layout><AprovacaoProdutores /></Layout>} />
          <Route path="/lotes" element={<Layout><Lotes /></Layout>} />
          <Route path="/lotes/:id" element={<Layout><LoteDetalhes /></Layout>} />
          <Route path="/qualidade" element={<Layout><Qualidade /></Layout>} />
          <Route path="/qualidade/:id" element={<Layout><QualidadeDetalhes /></Layout>} />
          <Route path="/certificacoes" element={<Layout><Certificacoes /></Layout>} />
          <Route path="/certificacoes/:id" element={<Layout><CertificacaoDetalhes /></Layout>} />
          <Route path="/relatorios" element={<Layout><Relatorios /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
