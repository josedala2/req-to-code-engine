import jsPDF from "jspdf";
import QRCode from "qrcode";
import seloMukafe from "@/assets/selo-mukafe.png";

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

// Função para desenhar borda de selo (formato stamp) - Círculos perfeitos
const drawStampBorder = (doc: jsPDF, x: number, y: number, width: number, height: number) => {
  const notchRadius = 1.5; // Raio dos semicírculos
  const notchSpacing = 3.5; // Espaçamento entre os dentes
  
  doc.setFillColor(255, 255, 255);
  
  // Borda superior - semicírculos
  for (let i = x + notchSpacing; i < x + width; i += notchSpacing) {
    doc.circle(i, y, notchRadius, "F");
  }
  
  // Borda inferior - semicírculos
  for (let i = x + notchSpacing; i < x + width; i += notchSpacing) {
    doc.circle(i, y + height, notchRadius, "F");
  }
  
  // Borda esquerda - semicírculos
  for (let i = y + notchSpacing; i < y + height; i += notchSpacing) {
    doc.circle(x, i, notchRadius, "F");
  }
  
  // Borda direita - semicírculos
  for (let i = y + notchSpacing; i < y + height; i += notchSpacing) {
    doc.circle(x + width, i, notchRadius, "F");
  }
};

export const generateCoffeeSeal = async (data: SealData) => {
  // Selo no formato 5cm x 5cm (50mm x 50mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [50, 50]
  });
  
  // Adicionar a imagem do selo base
  doc.addImage(seloMukafe, "PNG", 0, 0, 50, 50);
  
  // Adicionar QR Code sobrepondo o QR da imagem original
  const qrCodeData = await generateQRCode(
    `${window.location.origin}/lote-publico/${data.loteId}`
  );
  if (qrCodeData) {
    doc.addImage(qrCodeData, "PNG", 29.5, 24.5, 15.5, 15.5);
  }
  
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
      
      // Adicionar a imagem do selo base
      doc.addImage(seloMukafe, "PNG", x, y, sealWidth, sealHeight);
      
      // Adicionar QR Code sobrepondo o QR da imagem original
      const qrCodeData = await generateQRCode(
        `${window.location.origin}/lote-publico/${data.loteId}`
      );
      if (qrCodeData) {
        doc.addImage(qrCodeData, "PNG", x + 29.5, y + 24.5, 15.5, 15.5);
      }
      
      sealCount++;
    }
  }
  
  doc.save(`selos-${data.loteId}-${quantity}unidades.pdf`);
};
