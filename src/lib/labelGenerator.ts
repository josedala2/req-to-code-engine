import jsPDF from "jspdf";
import mukafeLogo from "@/assets/mukafe-logo.jpeg";

interface LabelData {
  loteId: string;
  produtor: string;
  fazenda: string;
  variedade: string;
  processo: string;
  safra: string;
  altitude: string;
  certificacoes: string[];
  peso: string;
  notaQualidade?: string;
}

export const generateCoffeeLabel = (data: LabelData) => {
  // Etiqueta no formato 10cm x 15cm (100mm x 150mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 150]
  });
  
  // Fundo branco
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 100, 150, "F");
  
  // Borda decorativa verde
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(0.5);
  doc.rect(3, 3, 94, 144);
  
  // Logo Mukafe no topo
  doc.addImage(mukafeLogo, "JPEG", 35, 8, 30, 30);
  
  // Nome Mukafe
  doc.setFontSize(14);
  doc.setTextColor(34, 139, 34);
  doc.text("Mukafe", 50, 43, { align: "center" });
  
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text("Sistema Nacional de Rastreabilidade do Café", 50, 47, { align: "center" });
  
  // Linha separadora
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(0.3);
  doc.line(10, 50, 90, 50);
  
  // Título "Café Especial de Angola"
  doc.setFontSize(12);
  doc.setTextColor(34, 139, 34);
  doc.text("CAFÉ ESPECIAL DE ANGOLA", 50, 56, { align: "center" });
  
  // Informações principais
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  
  let yPos = 64;
  
  // Variedade
  doc.text(`Variedade: ${data.variedade}`, 10, yPos);
  yPos += 6;
  
  // Processo
  doc.text(`Processo: ${data.processo}`, 10, yPos);
  yPos += 6;
  
  // Safra
  doc.text(`Safra: ${data.safra}`, 10, yPos);
  yPos += 6;
  
  // Altitude
  doc.text(`Altitude: ${data.altitude}`, 10, yPos);
  yPos += 6;
  
  // Nota de qualidade (se disponível)
  if (data.notaQualidade) {
    doc.setTextColor(34, 139, 34);
    doc.text(`Nota SCA: ${data.notaQualidade} pontos`, 10, yPos);
    doc.setTextColor(0);
    yPos += 6;
  }
  
  // Peso
  doc.setFontSize(11);
  doc.text(`Peso: ${data.peso}`, 10, yPos);
  yPos += 8;
  
  // Linha separadora
  doc.setDrawColor(200);
  doc.setLineWidth(0.2);
  doc.line(10, yPos, 90, yPos);
  yPos += 6;
  
  // Produtor
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PRODUTOR", 10, yPos);
  yPos += 4;
  
  doc.setFont("helvetica", "normal");
  doc.text(data.produtor, 10, yPos);
  yPos += 4;
  doc.text(data.fazenda, 10, yPos);
  yPos += 6;
  
  // Certificações
  if (data.certificacoes.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICAÇÕES", 10, yPos);
    yPos += 4;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    data.certificacoes.forEach((cert) => {
      doc.text(`• ${cert}`, 12, yPos);
      yPos += 3.5;
    });
    yPos += 2;
  }
  
  // Linha separadora
  doc.setDrawColor(200);
  doc.setLineWidth(0.2);
  doc.line(10, yPos, 90, yPos);
  yPos += 5;
  
  // Código de rastreabilidade
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text("Rastreabilidade:", 10, yPos);
  yPos += 4;
  
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text(data.loteId, 10, yPos);
  
  // QR Code (área reservada)
  doc.setDrawColor(200);
  doc.setLineWidth(0.2);
  doc.rect(65, yPos - 15, 20, 20);
  doc.setFontSize(6);
  doc.setTextColor(150);
  doc.text("QR CODE", 75, yPos - 3, { align: "center" });
  
  // Rodapé
  doc.setFontSize(6);
  doc.setTextColor(100);
  doc.text("Produto 100% angolano", 50, 145, { align: "center" });
  
  doc.save(`etiqueta-${data.loteId}.pdf`);
};

// Função auxiliar para gerar etiqueta a partir de um lote específico
export const generateLabelFromBatch = (loteId: string) => {
  // Dados de exemplo - em produção, estes viriam do banco de dados
  const batchData: LabelData = {
    loteId: loteId,
    produtor: "João Silva",
    fazenda: "Fazenda Boa Vista",
    variedade: "Arábica Bourbon",
    processo: "Natural",
    safra: "2024",
    altitude: "1200m",
    certificacoes: ["Orgânico ECOCERT", "Rainforest Alliance"],
    peso: "250g",
    notaQualidade: "85.5"
  };
  
  generateCoffeeLabel(batchData);
};
