import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCode from "qrcode";

interface LoteInfo {
  codigo: string;
  variedade: string[];
  processo: string;
  quantidade: number;
  unidade: string;
  safra: string;
  certificacao?: string;
  produtor_nome: string;
}

interface CertificadoData {
  numero_certificado: string;
  data_emissao: string;
  data_validade: string;
  produtor_nome: string;
  produtor_nif?: string;
  produtor_localizacao: string;
  destino_pais: string;
  destino_cidade?: string;
  importador_nome: string;
  importador_documento?: string;
  quantidade_total: number;
  unidade: string;
  valor_total?: number;
  moeda?: string;
  lotes: LoteInfo[];
  normas_cumpridas: string[];
  observacoes?: string;
}

export const generateExportCertificate = async (data: CertificadoData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Cabeçalho - República de Angola
  doc.setFillColor(218, 41, 28); // Vermelho da bandeira
  doc.rect(0, 0, pageWidth, 15, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("REPÚBLICA DE ANGOLA", pageWidth / 2, 10, { align: "center" });

  yPos = 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Ministério da Agricultura e Florestas", pageWidth / 2, yPos, { align: "center" });
  
  yPos += 5;
  doc.text("Instituto Nacional do Café de Angola (INCA)", pageWidth / 2, yPos, { align: "center" });

  // Título do Certificado
  yPos += 15;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(218, 41, 28);
  doc.text("CERTIFICADO DE AUTORIZAÇÃO DE EXPORTAÇÃO", pageWidth / 2, yPos, { align: "center" });

  // Número do Certificado
  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Nº ${data.numero_certificado}`, pageWidth / 2, yPos, { align: "center" });

  // Gerar QR Code
  const qrCodeUrl = await QRCode.toDataURL(
    `${window.location.origin}/certificado-exportacao/${data.numero_certificado}`,
    { width: 80 }
  );
  doc.addImage(qrCodeUrl, "PNG", pageWidth - 30, 50, 20, 20);

  // Informações do Produtor/Exportador
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
  doc.text("EXPORTADOR", 12, yPos, { align: "left" });

  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nome: ${data.produtor_nome}`, 12, yPos);
  
  yPos += 5;
  if (data.produtor_nif) {
    doc.text(`NIF: ${data.produtor_nif}`, 12, yPos);
    yPos += 5;
  }
  doc.text(`Localização: ${data.produtor_localizacao}`, 12, yPos);

  // Informações do Importador
  yPos += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
  doc.text("IMPORTADOR/DESTINO", 12, yPos);

  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nome: ${data.importador_nome}`, 12, yPos);
  
  yPos += 5;
  if (data.importador_documento) {
    doc.text(`Documento: ${data.importador_documento}`, 12, yPos);
    yPos += 5;
  }
  doc.text(`Destino: ${data.destino_cidade ? `${data.destino_cidade}, ` : ""}${data.destino_pais}`, 12, yPos);

  // Informações dos Lotes
  yPos += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
  doc.text(`LOTES INCLUÍDOS (${data.lotes.length} ${data.lotes.length === 1 ? "Lote" : "Lotes"})`, 12, yPos);

  yPos += 10;
  
  // Tabela de Lotes
  const loteTableData = data.lotes.map((lote) => [
    lote.codigo,
    lote.variedade.join(", "),
    lote.processo,
    `${lote.quantidade} ${lote.unidade}`,
    lote.safra,
    lote.certificacao || "N/A"
  ]);

  (doc as any).autoTable({
    startY: yPos,
    head: [["Código", "Variedade", "Processo", "Quantidade", "Safra", "Certificação"]],
    body: loteTableData,
    theme: "grid",
    headStyles: { fillColor: [218, 41, 28], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 }
    },
    margin: { left: 10, right: 10 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Quantidade Total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Quantidade Total: ${data.quantidade_total} ${data.unidade}`, 12, yPos);
  
  if (data.valor_total) {
    yPos += 5;
    doc.text(`Valor Total: ${data.valor_total.toLocaleString()} ${data.moeda || "AOA"}`, 12, yPos);
  }

  // Normas Cumpridas
  yPos += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPos - 5, pageWidth - 20, 8, "F");
  doc.text("NORMAS E CERTIFICAÇÕES CUMPRIDAS", 12, yPos);

  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  if (data.normas_cumpridas && data.normas_cumpridas.length > 0) {
    data.normas_cumpridas.forEach((norma) => {
      doc.text(`• ${norma}`, 15, yPos);
      yPos += 5;
    });
  } else {
    doc.text("Nenhuma certificação especial declarada", 15, yPos);
    yPos += 5;
  }

  // Observações
  if (data.observacoes) {
    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Observações:", 12, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const obsLines = doc.splitTextToSize(data.observacoes, pageWidth - 24);
    doc.text(obsLines, 12, yPos);
    yPos += obsLines.length * 5;
  }

  // Declaração
  yPos += 10;
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  const declaracao = "Este certificado atesta que os lotes de café acima descritos foram produzidos em conformidade com as normas e regulamentos vigentes da República de Angola e estão autorizados para exportação.";
  const declaracaoLines = doc.splitTextToSize(declaracao, pageWidth - 24);
  doc.text(declaracaoLines, 12, yPos);
  yPos += declaracaoLines.length * 5;

  // Dados de Emissão
  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Data de Emissão: ${new Date(data.data_emissao).toLocaleDateString("pt-PT")}`, 12, yPos);
  yPos += 5;
  doc.text(`Data de Validade: ${new Date(data.data_validade).toLocaleDateString("pt-PT")}`, 12, yPos);

  // Assinatura
  yPos += 20;
  doc.setFontSize(10);
  doc.text("_______________________________", pageWidth / 2, yPos, { align: "center" });
  yPos += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Autoridade Competente", pageWidth / 2, yPos, { align: "center" });
  yPos += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Instituto Nacional do Café de Angola", pageWidth / 2, yPos, { align: "center" });

  // Rodapé
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Documento gerado eletronicamente em ${new Date().toLocaleString("pt-PT")}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  return doc;
};
