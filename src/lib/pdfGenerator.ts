import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper para adicionar cabeçalho Mukafe em todos os PDFs
const addMukafeHeader = (doc: jsPDF, titulo: string) => {
  // Título do sistema
  doc.setFontSize(10);
  doc.setTextColor(34, 139, 34); // Verde Mukafe
  doc.text("Mukafe", 14, 15);
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("Sistema Nacional de Rastreabilidade do Café", 14, 20);
  
  // Linha separadora
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(0.5);
  doc.line(14, 23, 196, 23);
  
  // Título do documento
  doc.setFontSize(16);
  doc.setTextColor(34, 139, 34);
  doc.text(titulo, 14, 32);
};

export const generateProdutoresPDF = () => {
  const doc = new jsPDF();
  
  addMukafeHeader(doc, "Relatório de Produtores");
  
  // Data de geração
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 38);
  
  // Dados dos produtores
  const produtores = [
    ["João Silva", "Fazenda Boa Vista", "Huíla, Chibia", "120 ha", "Ativo"],
    ["Maria Santos", "Quinta das Flores", "Huambo, Huambo", "85 ha", "Ativo"],
    ["Carlos Oliveira", "Fazenda Esperança", "Benguela, Lobito", "200 ha", "Ativo"],
    ["Ana Costa", "Café Montanha", "Cuanza Sul, Sumbe", "65 ha", "Ativo"],
  ];
  
  autoTable(doc, {
    head: [["Produtor", "Fazenda", "Localização", "Área", "Status"]],
    body: produtores,
    startY: 45,
    theme: "grid",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  // Salvar PDF
  doc.save("relatorio-produtores.pdf");
};

export const generateLotesPDF = () => {
  const doc = new jsPDF();
  
  addMukafeHeader(doc, "Relatório de Lotes");
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 38);
  
  const lotes = [
    ["LOTE-2024-001", "João Silva", "Arábica", "Natural", "2024", "5000 kg"],
    ["LOTE-2024-002", "Maria Santos", "Bourbon", "Lavado", "2024", "3500 kg"],
    ["LOTE-2024-003", "Carlos Oliveira", "Catuaí", "Honey", "2024", "8000 kg"],
    ["LOTE-2024-004", "Ana Costa", "Mundo Novo", "Natural", "2024", "4200 kg"],
  ];
  
  autoTable(doc, {
    head: [["Código", "Produtor", "Variedade", "Processo", "Safra", "Quantidade"]],
    body: lotes,
    startY: 45,
    theme: "grid",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  doc.save("relatorio-lotes.pdf");
};

export const generateQualidadePDF = () => {
  const doc = new jsPDF();
  
  addMukafeHeader(doc, "Relatório de Análises de Qualidade");
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 38);
  
  const analises = [
    ["LOTE-2024-001", "85.5", "Especial", "Maria Lima", "15/01/2024"],
    ["LOTE-2024-002", "87.0", "Especial", "João Santos", "16/01/2024"],
    ["LOTE-2024-003", "83.0", "Superior", "Maria Lima", "17/01/2024"],
    ["LOTE-2024-004", "86.5", "Especial", "Pedro Souza", "18/01/2024"],
  ];
  
  autoTable(doc, {
    head: [["Lote", "Nota Final", "Classificação", "Q-Grader", "Data"]],
    body: analises,
    startY: 45,
    theme: "grid",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  doc.save("relatorio-qualidade.pdf");
};

export const generateCertificacoesPDF = () => {
  const doc = new jsPDF();
  
  addMukafeHeader(doc, "Relatório de Certificações");
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 38);
  
  const certificacoes = [
    ["João Silva", "Orgânico", "ECOCERT Angola", "Válida", "31/12/2024"],
    ["Maria Santos", "Fair Trade", "FLO-CERT", "Válida", "15/06/2025"],
    ["Carlos Oliveira", "Rainforest Alliance", "RA-Cert", "Válida", "30/11/2024"],
    ["Ana Costa", "UTZ Certified", "UTZ", "Válida", "28/02/2025"],
  ];
  
  autoTable(doc, {
    head: [["Produtor", "Tipo", "Certificadora", "Status", "Validade"]],
    body: certificacoes,
    startY: 45,
    theme: "grid",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  doc.save("relatorio-certificacoes.pdf");
};

export const generateRastreabilidadePDF = (loteId: string) => {
  const doc = new jsPDF();
  
  addMukafeHeader(doc, "Relatório de Rastreabilidade");
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Lote: ${loteId}`, 14, 42);
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 50);
  
  // Informações do Produtor
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("Informações do Produtor", 14, 62);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Nome: João Silva", 14, 70);
  doc.text("Fazenda: Fazenda Boa Vista", 14, 77);
  doc.text("Localização: Huíla, Chibia", 14, 84);
  doc.text("Altitude: 1200m", 14, 91);
  
  // Informações do Lote
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("Informações do Lote", 14, 106);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Variedade: Arábica Bourbon", 14, 114);
  doc.text("Processo: Natural", 14, 121);
  doc.text("Safra: 2024", 14, 128);
  doc.text("Data de Colheita: 15/05/2024", 14, 135);
  doc.text("Quantidade: 5000 kg", 14, 142);
  
  // Análise de Qualidade
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("Análise de Qualidade", 14, 157);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Nota Final: 85.5 pontos", 14, 165);
  doc.text("Classificação: Café Especial", 14, 172);
  doc.text("Q-Grader: Maria Lima", 14, 179);
  doc.text("Data da Análise: 20/05/2024", 14, 186);
  
  // Certificações
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("Certificações", 14, 201);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("• Orgânico (ECOCERT Angola)", 14, 209);
  doc.text("• Rainforest Alliance", 14, 216);
  
  // QR Code ou código de barras (área reservada)
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Código de Rastreabilidade:", 14, 230);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(loteId, 14, 238);
  
  doc.save(`rastreabilidade-${loteId}.pdf`);
};

export const generateCertificadoOrganicoPDF = (certId: string) => {
  const doc = new jsPDF();
  
  // Logo e identificação Mukafe
  doc.setFontSize(12);
  doc.setTextColor(34, 139, 34);
  doc.text("Mukafe", 105, 15, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("Sistema Nacional de Rastreabilidade do Café", 105, 20, { align: "center" });
  
  // Cabeçalho
  doc.setFontSize(22);
  doc.setTextColor(34, 139, 34);
  doc.text("CERTIFICADO ORGÂNICO", 105, 35, { align: "center" });
  
  // Linha decorativa
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
  
  // Número do certificado
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Certificado Nº: AO-BIO-001-2024`, 105, 50, { align: "center" });
  
  // Corpo do certificado
  doc.setFontSize(11);
  doc.text("Certificamos que:", 20, 65);
  
  doc.setFontSize(16);
  doc.setTextColor(34, 139, 34);
  doc.text("Fazenda Santa Clara", 105, 75, { align: "center" });
  
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("Produtor: João Silva", 105, 85, { align: "center" });
  doc.text("NIF: 123456789", 105, 93, { align: "center" });
  
  doc.text("Atende aos requisitos da produção orgânica conforme:", 20, 110);
  
  // Lista de normas
  const normas = [
    "• Regulamento CE 834/2007 (União Europeia)",
    "• USDA NOP (Estados Unidos)",
    "• JAS - Japanese Agricultural Standard (Japão)",
    "• Normas ECOCERT para África"
  ];
  
  let yPos = 120;
  normas.forEach((norma) => {
    doc.text(norma, 30, yPos);
    yPos += 8;
  });
  
  // Escopo
  doc.text("Escopo: Produção de café arábica orgânico", 20, yPos + 10);
  
  // Datas
  doc.setFontSize(10);
  doc.text("Data de Emissão: 15/03/2024", 20, yPos + 25);
  doc.text("Validade: 15/03/2025", 20, yPos + 33);
  
  // Certificadora
  doc.setFontSize(12);
  doc.setTextColor(34, 139, 34);
  doc.text("ECOCERT Angola", 105, yPos + 50, { align: "center" });
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("_______________________________", 105, yPos + 60, { align: "center" });
  doc.text("Diretor Técnico", 105, yPos + 65, { align: "center" });
  
  doc.save(`certificado-organico-${certId}.pdf`);
};

export const generateRelatorioAuditoriaPDF = (certId: string) => {
  const doc = new jsPDF();
  
  addMukafeHeader(doc, "Relatório de Auditoria de Certificação Orgânica");
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 38);
  
  // Informações da auditoria
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("Tipo: Auditoria de Renovação", 14, 48);
  doc.text("Data: 10/03/2024", 14, 56);
  doc.text("Auditor: Carlos Mendes - ECOCERT Angola", 14, 64);
  
  // Produtor
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("Produtor Auditado", 14, 78);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Nome: João Silva", 14, 86);
  doc.text("Fazenda: Fazenda Santa Clara", 14, 93);
  doc.text("NIF: 123456789", 14, 100);
  doc.text("Localização: Huíla, Chibia", 14, 107);
  
  // Critérios avaliados
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("Critérios Avaliados", 14, 121);
  
  const criterios = [
    ["Ausência de agrotóxicos sintéticos", "Conforme"],
    ["Não utilização de fertilizantes químicos", "Conforme"],
    ["Preservação de áreas de mata nativa", "Conforme"],
    ["Manejo sustentável do solo", "Conforme"],
    ["Rastreabilidade da produção", "Conforme"],
    ["Separação de produtos orgânicos/convencionais", "Conforme"],
  ];
  
  autoTable(doc, {
    head: [["Critério", "Status"]],
    body: criterios,
    startY: 126,
    theme: "grid",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  // Conclusão
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(12);
  doc.setTextColor(34, 139, 34);
  doc.text("Conclusão", 14, finalY + 15);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("A propriedade atende a todos os requisitos para certificação orgânica.", 14, finalY + 23);
  doc.text("Status: APROVADO", 14, finalY + 31);
  
  doc.save(`relatorio-auditoria-${certId}.pdf`);
};

export const generatePlanoManejoOrganicoPDF = (certId: string) => {
  const doc = new jsPDF();
  
  addMukafeHeader(doc, "Plano de Manejo Orgânico");
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Safra 2024 | Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 38);
  
  // Produtor
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("Produtor: João Silva - Fazenda Santa Clara", 14, 48);
  doc.text("NIF: 123456789", 14, 56);
  
  // Práticas de manejo
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("1. Práticas de Manejo do Solo", 14, 70);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  const praticasSolo = [
    "• Adubação verde com leguminosas",
    "• Compostagem de resíduos da propriedade",
    "• Cobertura morta entre as linhas de café",
    "• Rotação de culturas nas áreas disponíveis",
  ];
  
  let yPos = 78;
  praticasSolo.forEach((pratica) => {
    doc.text(pratica, 20, yPos);
    yPos += 7;
  });
  
  // Controle de pragas
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("2. Controle de Pragas e Doenças", 14, yPos + 8);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  const controlePragas = [
    "• Controle biológico com predadores naturais",
    "• Caldas permitidas (bordalesa, sulfocálcica)",
    "• Armadilhas para broca-do-café",
    "• Monitoramento semanal de pragas",
  ];
  
  yPos += 16;
  controlePragas.forEach((pratica) => {
    doc.text(pratica, 20, yPos);
    yPos += 7;
  });
  
  // Fertilização
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("3. Programa de Fertilização", 14, yPos + 8);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("• Composto orgânico: 3 ton/ha (aplicação anual)", 20, yPos + 16);
  doc.text("• Bokashi: 500 kg/ha (2x ao ano)", 20, yPos + 23);
  doc.text("• Biofertilizante foliar: aplicações mensais", 20, yPos + 30);
  
  // Conservação
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("4. Conservação Ambiental", 14, yPos + 44);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("• Preservação de 30% da área com mata nativa", 20, yPos + 52);
  doc.text("• Corredores ecológicos entre talhões", 20, yPos + 59);
  doc.text("• Proteção de nascentes e cursos d'água", 20, yPos + 66);
  
  doc.save(`plano-manejo-organico-${certId}.pdf`);
};

export const generateRegistroInsumosPDF = (certId: string) => {
  const doc = new jsPDF();
  
  addMukafeHeader(doc, "Registro de Insumos Permitidos");
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Safra 2024 | Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 38);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Produtor: João Silva - Fazenda Santa Clara", 14, 48);
  doc.text("Certificação: Orgânico BR-BIO-001-2024", 14, 55);
  
  // Fertilizantes
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("Fertilizantes e Condicionadores de Solo", 14, 68);
  
  const fertilizantes = [
    ["Composto Orgânico", "Fazenda própria", "ECOCERT Aprovado", "3 ton/ha"],
    ["Bokashi", "Fornecedor Local", "ECOCERT Aprovado", "500 kg/ha"],
    ["Biofertilizante", "Fazenda própria", "ECOCERT Aprovado", "Aplicação foliar"],
    ["Farinha de Ossos", "AgroOrgânico Ltda", "ECOCERT Aprovado", "200 kg/ha"],
  ];
  
  autoTable(doc, {
    head: [["Produto", "Fornecedor", "Certificação", "Dosagem"]],
    body: fertilizantes,
    startY: 73,
    theme: "grid",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  // Controle fitossanitário
  let finalY1 = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(13);
  doc.setTextColor(34, 139, 34);
  doc.text("Produtos para Controle Fitossanitário", 14, finalY1 + 12);
  
  const fitossanitarios = [
    ["Calda Bordalesa", "Fazenda própria", "ECOCERT Aprovado", "1% concentração"],
    ["Calda Sulfocálcica", "CaldaVerde", "ECOCERT Aprovado", "0.5% concentração"],
    ["Óleo de Neem", "NaturalPest", "ECOCERT Aprovado", "2 ml/L água"],
    ["Bacillus thuringiensis", "BioCafe", "ECOCERT Aprovado", "Conforme bula"],
  ];
  
  autoTable(doc, {
    head: [["Produto", "Fornecedor", "Certificação", "Dosagem"]],
    body: fitossanitarios,
    startY: finalY1 + 17,
    theme: "grid",
    headStyles: { fillColor: [34, 139, 34] },
  });
  
  // Observações
  const finalY2 = (doc as any).lastAutoTable.finalY || 200;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Todos os insumos listados são certificados para uso em agricultura orgânica.", 14, finalY2 + 12);
  doc.text("Registros de aplicação mantidos em caderno de campo.", 14, finalY2 + 19);
  
  doc.save(`registro-insumos-${certId}.pdf`);
};
