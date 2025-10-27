import jsPDF from "jspdf";
import QRCode from "qrcode";

interface SealData {
  loteId: string;
  produtor: string;
  certificacao: string;
  dataColheita: string;
  variedade: string;
  processo: string;
}

// Função auxiliar para gerar QR Code como data URL
const generateQRCode = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: 200,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err);
    return "";
  }
};

// Função para desenhar borda de selo (formato stamp)
const drawStampBorder = (doc: jsPDF, x: number, y: number, width: number, height: number) => {
  const notchSize = 2; // Tamanho dos "dentes" do selo
  const notchSpacing = 3; // Espaçamento entre os dentes
  
  doc.setLineWidth(0.2);
  doc.setDrawColor(180, 180, 180);
  
  // Desenhar bordas com efeito de selo postal
  // Borda superior
  for (let i = x; i < x + width; i += notchSpacing) {
    doc.circle(i, y, notchSize / 2, "S");
  }
  
  // Borda inferior
  for (let i = x; i < x + width; i += notchSpacing) {
    doc.circle(i, y + height, notchSize / 2, "S");
  }
  
  // Borda esquerda
  for (let i = y; i < y + height; i += notchSpacing) {
    doc.circle(x, i, notchSize / 2, "S");
  }
  
  // Borda direita
  for (let i = y; i < y + height; i += notchSpacing) {
    doc.circle(x + width, i, notchSize / 2, "S");
  }
};

export const generateCoffeeSeal = async (data: SealData) => {
  // Selo no formato 5cm x 5cm (50mm x 50mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [50, 50]
  });
  
  // Fundo branco
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 50, 50, "F");
  
  // Borda decorativa tipo selo postal
  drawStampBorder(doc, 2, 2, 46, 46);
  
  // Faixa marrom superior - "CERTIFICADO DE QUALIDADE SUPERIOR"
  doc.setFillColor(101, 67, 33); // Marrom
  doc.rect(3, 8, 44, 8, "F");
  
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICADO DE", 25, 11.5, { align: "center" });
  doc.text("QUALIDADE SUPERIOR", 25, 14.5, { align: "center" });
  
  // Faixa vermelha - "ORIGEM: ANGOLA"
  doc.setFillColor(206, 17, 38); // Vermelho da bandeira de Angola
  doc.rect(3, 16, 44, 5, "F");
  
  doc.setFontSize(5.5);
  doc.setTextColor(255, 255, 255);
  doc.text("ORIGEM: ANGOLA", 25, 19.5, { align: "center" });
  
  // Área central - Bandeira de Angola (círculo)
  doc.setFillColor(206, 17, 38); // Vermelho superior
  doc.circle(15, 30, 6, "F");
  
  // Metade inferior preta
  doc.setFillColor(0, 0, 0);
  doc.rect(9, 30, 12, 6, "F");
  
  // Símbolo simplificado (estrela amarela)
  doc.setFillColor(255, 206, 0); // Amarelo
  doc.setFontSize(8);
  doc.text("★", 15, 31.5, { align: "center" });
  
  // QR Code
  const qrCodeData = await generateQRCode(`SNRCAFE-${data.loteId}-${data.certificacao}`);
  if (qrCodeData) {
    doc.addImage(qrCodeData, "PNG", 28, 24, 15, 15);
  }
  
  // Informações do lote
  doc.setFontSize(5);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  
  let yPos = 41;
  
  doc.text(`Lote: ${data.loteId}`, 25, yPos, { align: "center" });
  yPos += 3;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(4.5);
  doc.text(data.produtor, 25, yPos, { align: "center" });
  yPos += 2.5;
  
  // Rodapé - INCA FDCA MINAGRIF
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80);
  doc.text("INCA FDCA MINAGRIF", 25, 46.5, { align: "center" });
  
  return doc;
};

// Função para gerar múltiplos selos em uma página A4
export const generateMultipleSeals = async (data: SealData, quantity: number) => {
  // A4 = 210mm x 297mm
  // Cada selo = 50mm x 50mm
  // Podemos colocar 4 colunas x 5 linhas = 20 selos por página
  const sealsPerRow = 4;
  const sealsPerColumn = 5;
  const sealsPerPage = sealsPerRow * sealsPerColumn;
  
  const sealWidth = 50;
  const sealHeight = 50;
  const marginX = 5;
  const marginY = 23.5; // Ajustado para centralizar verticalmente
  
  const totalPages = Math.ceil(quantity / sealsPerPage);
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  let sealCount = 0;
  
  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      doc.addPage();
    }
    
    const sealsInThisPage = Math.min(sealsPerPage, quantity - sealCount);
    
    for (let i = 0; i < sealsInThisPage; i++) {
      const row = Math.floor(i / sealsPerRow);
      const col = i % sealsPerRow;
      
      const x = marginX + col * sealWidth;
      const y = marginY + row * sealHeight;
      
      // Desenhar cada selo
      // Fundo branco
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, sealWidth, sealHeight, "F");
      
      // Borda decorativa tipo selo postal
      drawStampBorder(doc, x + 2, y + 2, 46, 46);
      
      // Faixa marrom superior
      doc.setFillColor(101, 67, 33);
      doc.rect(x + 3, y + 8, 44, 8, "F");
      
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFICADO DE", x + 25, y + 11.5, { align: "center" });
      doc.text("QUALIDADE SUPERIOR", x + 25, y + 14.5, { align: "center" });
      
      // Faixa vermelha
      doc.setFillColor(206, 17, 38);
      doc.rect(x + 3, y + 16, 44, 5, "F");
      
      doc.setFontSize(5.5);
      doc.setTextColor(255, 255, 255);
      doc.text("ORIGEM: ANGOLA", x + 25, y + 19.5, { align: "center" });
      
      // Bandeira de Angola
      doc.setFillColor(206, 17, 38);
      doc.circle(x + 15, y + 30, 6, "F");
      
      // Metade inferior preta
      doc.setFillColor(0, 0, 0);
      doc.rect(x + 9, y + 30, 12, 6, "F");
      
      doc.setFillColor(255, 206, 0);
      doc.setFontSize(8);
      doc.text("★", x + 15, y + 31.5, { align: "center" });
      
      // QR Code
      const qrCodeData = await generateQRCode(`SNRCAFE-${data.loteId}-${data.certificacao}`);
      if (qrCodeData) {
        doc.addImage(qrCodeData, "PNG", x + 28, y + 24, 15, 15);
      }
      
      // Informações
      doc.setFontSize(5);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(`Lote: ${data.loteId}`, x + 25, y + 41, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4.5);
      doc.text(data.produtor.substring(0, 25), x + 25, y + 43.5, { align: "center" });
      
      doc.setFontSize(5.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80);
      doc.text("INCA FDCA MINAGRIF", x + 25, y + 46.5, { align: "center" });
      
      sealCount++;
    }
  }
  
  doc.save(`selos-${data.loteId}-${quantity}unidades.pdf`);
};
