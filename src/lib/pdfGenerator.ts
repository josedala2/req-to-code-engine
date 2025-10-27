import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateProdutoresPDF = () => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.setTextColor(101, 67, 33);
  doc.text("Relatório de Produtores", 14, 20);
  
  // Data de geração
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);
  
  // Dados dos produtores
  const produtores = [
    ["João Silva", "Fazenda Boa Vista", "São Paulo, SP", "120 ha", "Ativo"],
    ["Maria Santos", "Sítio das Flores", "Minas Gerais, MG", "85 ha", "Ativo"],
    ["Carlos Oliveira", "Fazenda Esperança", "Bahia, BA", "200 ha", "Ativo"],
    ["Ana Costa", "Café Montanha", "Espírito Santo, ES", "65 ha", "Ativo"],
  ];
  
  autoTable(doc, {
    head: [["Produtor", "Fazenda", "Localização", "Área", "Status"]],
    body: produtores,
    startY: 35,
    theme: "grid",
    headStyles: { fillColor: [101, 67, 33] },
  });
  
  // Salvar PDF
  doc.save("relatorio-produtores.pdf");
};

export const generateLotesPDF = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(101, 67, 33);
  doc.text("Relatório de Lotes", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);
  
  const lotes = [
    ["LOTE-2024-001", "João Silva", "Arábica", "Natural", "2024", "5000 kg"],
    ["LOTE-2024-002", "Maria Santos", "Bourbon", "Lavado", "2024", "3500 kg"],
    ["LOTE-2024-003", "Carlos Oliveira", "Catuaí", "Honey", "2024", "8000 kg"],
    ["LOTE-2024-004", "Ana Costa", "Mundo Novo", "Natural", "2024", "4200 kg"],
  ];
  
  autoTable(doc, {
    head: [["Código", "Produtor", "Variedade", "Processo", "Safra", "Quantidade"]],
    body: lotes,
    startY: 35,
    theme: "grid",
    headStyles: { fillColor: [101, 67, 33] },
  });
  
  doc.save("relatorio-lotes.pdf");
};

export const generateQualidadePDF = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(101, 67, 33);
  doc.text("Relatório de Análises de Qualidade", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);
  
  const analises = [
    ["LOTE-2024-001", "85.5", "Especial", "Maria Lima", "15/01/2024"],
    ["LOTE-2024-002", "87.0", "Especial", "João Santos", "16/01/2024"],
    ["LOTE-2024-003", "83.0", "Superior", "Maria Lima", "17/01/2024"],
    ["LOTE-2024-004", "86.5", "Especial", "Pedro Souza", "18/01/2024"],
  ];
  
  autoTable(doc, {
    head: [["Lote", "Nota Final", "Classificação", "Q-Grader", "Data"]],
    body: analises,
    startY: 35,
    theme: "grid",
    headStyles: { fillColor: [101, 67, 33] },
  });
  
  doc.save("relatorio-qualidade.pdf");
};

export const generateCertificacoesPDF = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(101, 67, 33);
  doc.text("Relatório de Certificações", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 28);
  
  const certificacoes = [
    ["João Silva", "Orgânico", "IBD Certificações", "Válida", "31/12/2024"],
    ["Maria Santos", "Fair Trade", "FLO-CERT", "Válida", "15/06/2025"],
    ["Carlos Oliveira", "Rainforest Alliance", "RA-Cert", "Válida", "30/11/2024"],
    ["Ana Costa", "UTZ Certified", "UTZ", "Válida", "28/02/2025"],
  ];
  
  autoTable(doc, {
    head: [["Produtor", "Tipo", "Certificadora", "Status", "Validade"]],
    body: certificacoes,
    startY: 35,
    theme: "grid",
    headStyles: { fillColor: [101, 67, 33] },
  });
  
  doc.save("relatorio-certificacoes.pdf");
};

export const generateRastreabilidadePDF = (loteId: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(101, 67, 33);
  doc.text("Relatório de Rastreabilidade", 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Lote: ${loteId}`, 14, 32);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 40);
  
  // Informações do Produtor
  doc.setFontSize(14);
  doc.setTextColor(101, 67, 33);
  doc.text("Informações do Produtor", 14, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Nome: João Silva", 14, 63);
  doc.text("Fazenda: Fazenda Boa Vista", 14, 70);
  doc.text("Localização: São Paulo, SP", 14, 77);
  doc.text("Altitude: 1200m", 14, 84);
  
  // Informações do Lote
  doc.setFontSize(14);
  doc.setTextColor(101, 67, 33);
  doc.text("Informações do Lote", 14, 99);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Variedade: Arábica Bourbon", 14, 107);
  doc.text("Processo: Natural", 14, 114);
  doc.text("Safra: 2024", 14, 121);
  doc.text("Data de Colheita: 15/05/2024", 14, 128);
  doc.text("Quantidade: 5000 kg", 14, 135);
  
  // Análise de Qualidade
  doc.setFontSize(14);
  doc.setTextColor(101, 67, 33);
  doc.text("Análise de Qualidade", 14, 150);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Nota Final: 85.5 pontos", 14, 158);
  doc.text("Classificação: Café Especial", 14, 165);
  doc.text("Q-Grader: Maria Lima", 14, 172);
  doc.text("Data da Análise: 20/05/2024", 14, 179);
  
  // Certificações
  doc.setFontSize(14);
  doc.setTextColor(101, 67, 33);
  doc.text("Certificações", 14, 194);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("• Orgânico (IBD Certificações)", 14, 202);
  doc.text("• Rainforest Alliance", 14, 209);
  
  // QR Code ou código de barras (área reservada)
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Código de Rastreabilidade:", 14, 230);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(loteId, 14, 238);
  
  doc.save(`rastreabilidade-${loteId}.pdf`);
};
