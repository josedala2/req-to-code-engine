import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditData {
  codigo: string;
  data_auditoria: string;
  auditor_nome: string;
  auditor_certificacao?: string;
  tipo_auditoria: string;
  status: string;
  produtor_nome?: string;
  lote_codigo?: string;
  criterios_avaliados?: any[];
  pontuacao_total?: number;
  pontuacao_maxima?: number;
  conformidades?: string[];
  nao_conformidades?: string[];
  observacoes?: string;
  recomendacoes?: string;
  resultado?: string;
  certificado_emitido: boolean;
  validade_certificado?: string;
}

export const generateAuditReport = async (data: AuditData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Cabeçalho
  doc.setFillColor(139, 69, 19);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("RELATÓRIO DE AUDITORIA", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Código: ${data.codigo}`, pageWidth / 2, 32, { align: "center" });

  yPosition = 55;
  doc.setTextColor(0, 0, 0);

  // Informações Gerais
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 69, 19);
  doc.text("Informações da Auditoria", 15, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const dataAuditoria = data.data_auditoria 
    ? format(new Date(data.data_auditoria), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "N/A";

  const infoData = [
    ["Data da Auditoria", dataAuditoria],
    ["Tipo de Auditoria", data.tipo_auditoria],
    ["Auditor", data.auditor_nome],
    ["Certificação do Auditor", data.auditor_certificacao || "N/A"],
    ["Status", data.status.toUpperCase()],
    ["Produtor", data.produtor_nome || "N/A"],
    ["Lote", data.lote_codigo || "N/A"],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [],
    body: infoData,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Pontuação
  if (data.pontuacao_total !== undefined && data.pontuacao_maxima !== undefined) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 69, 19);
    doc.text("Pontuação", 15, yPosition);
    yPosition += 10;

    const percentual = ((data.pontuacao_total / data.pontuacao_maxima) * 100).toFixed(1);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Pontuação: ${data.pontuacao_total} / ${data.pontuacao_maxima} (${percentual}%)`, 15, yPosition);
    yPosition += 15;
  }

  // Conformidades
  if (data.conformidades && data.conformidades.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0);
    doc.text("Conformidades", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    data.conformidades.forEach((item, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${item}`, 20, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  // Não Conformidades
  if (data.nao_conformidades && data.nao_conformidades.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 53, 69);
    doc.text("Não Conformidades", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    data.nao_conformidades.forEach((item, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${item}`, 20, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  // Observações
  if (data.observacoes) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 69, 19);
    doc.text("Observações", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const obsLines = doc.splitTextToSize(data.observacoes, pageWidth - 30);
    obsLines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 15, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  // Recomendações
  if (data.recomendacoes) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 69, 19);
    doc.text("Recomendações", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const recLines = doc.splitTextToSize(data.recomendacoes, pageWidth - 30);
    recLines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 15, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  // Resultado Final
  if (data.resultado) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 69, 19);
    doc.text("Resultado Final", 15, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(data.resultado, 15, yPosition);
    yPosition += 10;

    if (data.certificado_emitido) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const validadeTexto = data.validade_certificado
        ? `Válido até: ${format(new Date(data.validade_certificado), "dd/MM/yyyy")}`
        : "";
      doc.text(`Certificado emitido. ${validadeTexto}`, 15, yPosition);
    }
  }

  // Rodapé
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Relatório gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" });
  }

  doc.save(`relatorio-auditoria-${data.codigo}.pdf`);
};
