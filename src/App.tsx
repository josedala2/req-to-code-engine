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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          <Route path="/produtores" element={<Produtores />} />
          <Route path="/produtores/:id" element={<ProdutorDetalhes />} />
          <Route path="/lotes" element={<Lotes />} />
          <Route path="/lotes/:id" element={<LoteDetalhes />} />
          <Route path="/qualidade" element={<Qualidade />} />
          <Route path="/qualidade/:id" element={<QualidadeDetalhes />} />
          <Route path="/certificacoes" element={<Certificacoes />} />
          <Route path="/certificacoes/:id" element={<CertificacaoDetalhes />} />
          <Route path="/relatorios" element={<Relatorios />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
