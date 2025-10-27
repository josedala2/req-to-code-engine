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
  
  // Fundo branco com gradiente suave (simulado)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 50, 50, "F");
  
  // Borda decorativa tipo selo postal (mais refinada)
  drawStampBorder(doc, 1.5, 1.5, 47, 47);
  
  // Grão de café decorativo no canto superior
  doc.setFillColor(101, 67, 33);
  doc.circle(8, 6, 2.5, "F");
  doc.setDrawColor(80, 50, 20);
  doc.setLineWidth(0.3);
  doc.line(8, 4, 8, 8);
  
  // Faixa marrom superior - "CERTIFICADO DE QUALIDADE SUPERIOR"
  doc.setFillColor(101, 67, 33); // Marrom café
  doc.rect(3, 10, 44, 9, "F");
  
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICADO DE", 25, 13, { align: "center" });
  doc.setFontSize(8);
  doc.text("QUALIDADE SUPERIOR", 25, 16.5, { align: "center" });
  
  // Faixa vermelha - "ORIGEM: ANGOLA" com bordas arredondadas
  doc.setFillColor(206, 17, 38); // Vermelho da bandeira
  doc.roundedRect(3, 20, 44, 6, 1, 1, "F");
  
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("ORIGEM: ANGOLA", 25, 24, { align: "center" });
  
  // Bandeira de Angola aprimorada
  const flagX = 15;
  const flagY = 33;
  const flagRadius = 7;
  
  // Círculo vermelho
  doc.setFillColor(206, 17, 38);
  doc.circle(flagX, flagY, flagRadius, "F");
  
  // Metade inferior preta
  doc.setFillColor(0, 0, 0);
  doc.rect(flagX - flagRadius, flagY, flagRadius * 2, flagRadius, "F");
  
  // Estrela amarela com brilho
  doc.setFillColor(255, 206, 0);
  doc.setFontSize(10);
  doc.text("★", flagX, flagY + 1.5, { align: "center" });
  
  // Machado e engrenagem simplificados
  doc.setDrawColor(255, 206, 0);
  doc.setLineWidth(0.4);
  doc.line(flagX - 2, flagY + 2, flagX + 2, flagY - 2);
  
  // QR Code com moldura
  const qrCodeData = await generateQRCode(
    `${window.location.origin}/lote-publico/${data.loteId}`
  );
  if (qrCodeData) {
    // Moldura branca do QR code
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(27, 28, 17, 17, 0.5, 0.5, "F");
    doc.addImage(qrCodeData, "PNG", 28, 29, 15, 15);
  }
  
  // Informações do lote com melhor tipografia
  doc.setFontSize(5.5);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  
  let yPos = 41;
  
  // Código do lote destacado
  doc.setFontSize(6);
  doc.text(`Lote: ${data.loteId}`, 25, yPos, { align: "center" });
  yPos += 3;
  
  // Certificação
  doc.setFontSize(4.5);
  doc.setTextColor(101, 67, 33);
  doc.text(`Cert: ${data.certificacao}`, 25, yPos, { align: "center" });
  yPos += 2.5;
  
  // Nome do produtor
  doc.setFont("helvetica", "normal");
  doc.setFontSize(4);
  doc.setTextColor(60);
  const produtorText = data.produtor.length > 28 ? data.produtor.substring(0, 25) + "..." : data.produtor;
  doc.text(produtorText, 25, yPos, { align: "center" });
  
  // Linha decorativa
  doc.setDrawColor(206, 17, 38);
  doc.setLineWidth(0.3);
  doc.line(8, 46, 42, 46);
  
  // Rodapé - INCA FDCA MINAGRIF
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80);
  doc.text("INCA FDCA MINAGRIF", 25, 48, { align: "center" });
  
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
      
      // Grão de café decorativo
      doc.setFillColor(101, 67, 33);
      doc.circle(x + 8, y + 6, 2.5, "F");
      doc.setDrawColor(80, 50, 20);
      doc.setLineWidth(0.3);
      doc.line(x + 8, y + 4, x + 8, y + 8);
      
      // Faixa marrom superior
      doc.setFillColor(101, 67, 33);
      doc.rect(x + 3, y + 10, 44, 9, "F");
      
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFICADO DE", x + 25, y + 13, { align: "center" });
      doc.setFontSize(8);
      doc.text("QUALIDADE SUPERIOR", x + 25, y + 16.5, { align: "center" });
      
      // Faixa vermelha
      doc.setFillColor(206, 17, 38);
      doc.roundedRect(x + 3, y + 20, 44, 6, 1, 1, "F");
      
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text("ORIGEM: ANGOLA", x + 25, y + 24, { align: "center" });
      
      // Bandeira de Angola aprimorada
      const flagX = x + 15;
      const flagY = y + 33;
      const flagRadius = 7;
      
      doc.setFillColor(206, 17, 38);
      doc.circle(flagX, flagY, flagRadius, "F");
      
      doc.setFillColor(0, 0, 0);
      doc.rect(flagX - flagRadius, flagY, flagRadius * 2, flagRadius, "F");
      
      doc.setFillColor(255, 206, 0);
      doc.setFontSize(10);
      doc.text("★", flagX, flagY + 1.5, { align: "center" });
      
      doc.setDrawColor(255, 206, 0);
      doc.setLineWidth(0.4);
      doc.line(flagX - 2, flagY + 2, flagX + 2, flagY - 2);
      
      // QR Code com moldura
      const qrCodeData = await generateQRCode(
        `${window.location.origin}/lote-publico/${data.loteId}`
      );
      if (qrCodeData) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x + 27, y + 28, 17, 17, 0.5, 0.5, "F");
        doc.addImage(qrCodeData, "PNG", x + 28, y + 29, 15, 15);
      }
      
      // Informações do lote
      doc.setFontSize(6);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(`Lote: ${data.loteId}`, x + 25, y + 41, { align: "center" });
      
      doc.setFontSize(4.5);
      doc.setTextColor(101, 67, 33);
      doc.text(`Cert: ${data.certificacao}`, x + 25, y + 43.5, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4);
      doc.setTextColor(60);
      const produtorText = data.produtor.length > 28 ? data.produtor.substring(0, 25) + "..." : data.produtor;
      doc.text(produtorText, x + 25, y + 46, { align: "center" });
      
      // Linha decorativa
      doc.setDrawColor(206, 17, 38);
      doc.setLineWidth(0.3);
      doc.line(x + 8, y + 46, x + 42, y + 46);
      
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80);
      doc.text("INCA FDCA MINAGRIF", x + 25, y + 48, { align: "center" });
      
      sealCount++;
    }
  }
  
  doc.save(`selos-${data.loteId}-${quantity}unidades.pdf`);
};
