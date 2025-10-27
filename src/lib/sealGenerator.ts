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
  
  // Fundo bege claro
  doc.setFillColor(245, 240, 235);
  doc.rect(0, 0, 50, 50, "F");
  
  // Borda cinza interna
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(2, 2, 46, 46, "S");
  
  // Borda decorativa tipo selo postal
  drawStampBorder(doc, 2, 2, 46, 46);
  
  // Grão de café 3D no canto superior esquerdo
  // Sombra do grão
  doc.setFillColor(90, 60, 30);
  doc.ellipse(9, 7.5, 3, 2.5, "F");
  
  // Grão principal
  doc.setFillColor(120, 80, 50);
  doc.ellipse(8.5, 7, 3, 2.5, "F");
  
  // Rachadura central do grão
  doc.setDrawColor(80, 50, 30);
  doc.setLineWidth(0.4);
  doc.line(7.5, 6, 9.5, 8);
  
  // Destaque claro no grão
  doc.setFillColor(150, 110, 80);
  doc.ellipse(7.5, 6.5, 1, 0.8, "F");
  
  // Faixa marrom escura superior - "CERTIFICADO DE QUALIDADE SUPERIOR"
  doc.setFillColor(80, 40, 20); // Marrom chocolate escuro
  doc.rect(4.5, 10.5, 41, 6, "F");
  
  // Linha branca decorativa superior
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(6, 16.2, 44, 16.2);
  
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICADO DE", 25, 13, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("QUALIDADE SUPERIOR", 25, 15.5, { align: "center" });
  
  // Faixa cinza - "ORIGEM: ANGOLA"
  doc.setFillColor(120, 120, 120);
  doc.rect(4.5, 17, 41, 4.5, "F");
  
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("ORIGEM: ANGOLA", 25, 20, { align: "center" });
  
  // Logo Mukafé central com círculo laranja
  const logoX = 16;
  const logoY = 32;
  const logoRadius = 7;
  
  // Círculo externo branco (fundo)
  doc.setFillColor(255, 255, 255);
  doc.circle(logoX, logoY, logoRadius + 0.5, "F");
  
  // Círculo laranja/dourado (borda)
  doc.setDrawColor(220, 120, 0);
  doc.setLineWidth(1);
  doc.circle(logoX, logoY, logoRadius, "S");
  
  // Texto circular superior "SISTEMA NACIONAL DE RASTREABILIDADE DO"
  doc.setFontSize(2.8);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  const curveText = "SISTEMA NACIONAL DE RASTREABILIDADE DO";
  const angleStep = 6;
  let startAngle = 180;
  
  for (let i = 0; i < curveText.length; i++) {
    const angle = (startAngle + i * angleStep) * Math.PI / 180;
    const textX = logoX + (logoRadius - 1.5) * Math.cos(angle);
    const textY = logoY + (logoRadius - 1.5) * Math.sin(angle);
    doc.text(curveText[i], textX, textY, { 
      angle: (angle * 180 / Math.PI) + 90,
      align: "center" 
    });
  }
  
  // Texto circular inferior "CAFÉ"
  doc.setFontSize(3.5);
  const cafeText = "CAFÉ";
  startAngle = 340;
  for (let i = 0; i < cafeText.length; i++) {
    const angle = (startAngle + i * 10) * Math.PI / 180;
    const textX = logoX + (logoRadius - 1.5) * Math.cos(angle);
    const textY = logoY + (logoRadius - 1.5) * Math.sin(angle);
    doc.text(cafeText[i], textX, textY, { 
      angle: (angle * 180 / Math.PI) + 90,
      align: "center" 
    });
  }
  
  // Desenho simplificado do grão de café com planta no centro
  // Grão de café marrom
  doc.setFillColor(120, 70, 30);
  doc.ellipse(logoX, logoY, 2.5, 2, "F");
  
  // Folhas verdes
  doc.setFillColor(50, 150, 50);
  doc.ellipse(logoX - 1, logoY - 2, 0.8, 1.5, "F");
  doc.ellipse(logoX + 1, logoY - 2, 0.8, 1.5, "F");
  
  // Texto "Mukafé" em verde
  doc.setFontSize(7);
  doc.setTextColor(34, 139, 34); // Verde escuro
  doc.setFont("helvetica", "bold");
  doc.text("Mukafé", logoX, logoY + 6, { align: "center" });
  
  // QR Code
  const qrCodeData = await generateQRCode(
    `${window.location.origin}/lote-publico/${data.loteId}`
  );
  if (qrCodeData) {
    doc.setFillColor(255, 255, 255);
    doc.rect(30, 26, 14, 14, "F");
    doc.addImage(qrCodeData, "PNG", 30.5, 26.5, 13, 13);
  }
  
  // Rodapé - INSTITUTO NACIONAL DO CAFÉ DE ANGOLA (NCA)
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("INSTITUTO NACIONAL DO CAFÉ DE ANGOLA (NCA)", 25, 45, { align: "center" });
  
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
      // Fundo bege claro
      doc.setFillColor(245, 240, 235);
      doc.rect(x, y, sealWidth, sealHeight, "F");
      
      // Borda cinza interna
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(x + 2, y + 2, 46, 46, "S");
      
      // Borda decorativa tipo selo postal
      drawStampBorder(doc, x + 2, y + 2, 46, 46);
      
      // Grão de café 3D
      doc.setFillColor(90, 60, 30);
      doc.ellipse(x + 9, y + 7.5, 3, 2.5, "F");
      doc.setFillColor(120, 80, 50);
      doc.ellipse(x + 8.5, y + 7, 3, 2.5, "F");
      doc.setDrawColor(80, 50, 30);
      doc.setLineWidth(0.4);
      doc.line(x + 7.5, y + 6, x + 9.5, y + 8);
      doc.setFillColor(150, 110, 80);
      doc.ellipse(x + 7.5, y + 6.5, 1, 0.8, "F");
      
      // Faixa marrom escura superior
      doc.setFillColor(80, 40, 20);
      doc.rect(x + 4.5, y + 10.5, 41, 6, "F");
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.line(x + 6, y + 16.2, x + 44, y + 16.2);
      
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFICADO DE", x + 25, y + 13, { align: "center" });
      doc.setFontSize(7.5);
      doc.text("QUALIDADE SUPERIOR", x + 25, y + 15.5, { align: "center" });
      
      // Faixa cinza
      doc.setFillColor(120, 120, 120);
      doc.rect(x + 4.5, y + 17, 41, 4.5, "F");
      doc.setFontSize(6);
      doc.text("ORIGEM: ANGOLA", x + 25, y + 20, { align: "center" });
      
      // Logo Mukafé
      const logoX = x + 16;
      const logoY = y + 32;
      const logoRadius = 7;
      
      doc.setFillColor(255, 255, 255);
      doc.circle(logoX, logoY, logoRadius + 0.5, "F");
      doc.setDrawColor(220, 120, 0);
      doc.setLineWidth(1);
      doc.circle(logoX, logoY, logoRadius, "S");
      
      // Texto circular
      doc.setFontSize(2.8);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      const curveText = "SISTEMA NACIONAL DE RASTREABILIDADE DO";
      const angleStep = 6;
      let startAngle = 180;
      
      for (let i = 0; i < curveText.length; i++) {
        const angle = (startAngle + i * angleStep) * Math.PI / 180;
        const textX = logoX + (logoRadius - 1.5) * Math.cos(angle);
        const textY = logoY + (logoRadius - 1.5) * Math.sin(angle);
        doc.text(curveText[i], textX, textY, { 
          angle: (angle * 180 / Math.PI) + 90,
          align: "center" 
        });
      }
      
      doc.setFontSize(3.5);
      const cafeText = "CAFÉ";
      startAngle = 340;
      for (let i = 0; i < cafeText.length; i++) {
        const angle = (startAngle + i * 10) * Math.PI / 180;
        const textX = logoX + (logoRadius - 1.5) * Math.cos(angle);
        const textY = logoY + (logoRadius - 1.5) * Math.sin(angle);
        doc.text(cafeText[i], textX, textY, { 
          angle: (angle * 180 / Math.PI) + 90,
          align: "center" 
        });
      }
      
      // Grão central com planta
      doc.setFillColor(120, 70, 30);
      doc.ellipse(logoX, logoY, 2.5, 2, "F");
      doc.setFillColor(50, 150, 50);
      doc.ellipse(logoX - 1, logoY - 2, 0.8, 1.5, "F");
      doc.ellipse(logoX + 1, logoY - 2, 0.8, 1.5, "F");
      
      doc.setFontSize(7);
      doc.setTextColor(34, 139, 34);
      doc.setFont("helvetica", "bold");
      doc.text("Mukafé", logoX, logoY + 6, { align: "center" });
      
      // QR Code
      const qrCodeData = await generateQRCode(
        `${window.location.origin}/lote-publico/${data.loteId}`
      );
      if (qrCodeData) {
        doc.setFillColor(255, 255, 255);
        doc.rect(x + 30, y + 26, 14, 14, "F");
        doc.addImage(qrCodeData, "PNG", x + 30.5, y + 26.5, 13, 13);
      }
      
      // Rodapé
      doc.setFontSize(5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("INSTITUTO NACIONAL DO CAFÉ DE ANGOLA (NCA)", x + 25, y + 45, { align: "center" });
      
      sealCount++;
    }
  }
  
  doc.save(`selos-${data.loteId}-${quantity}unidades.pdf`);
};
