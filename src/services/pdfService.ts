// src/services/pdfService.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Pericia } from '../types';
import { statusConfig } from '../config/constants';

// Extend the jsPDF interface to include the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Generates a PDF report from a list of pericias.
 * @param pericias The list of pericias to include in the report.
 * @param title The title of the report (e.g., "Relatório de Perícias Ativas").
 */
function generatePericiasReport(pericias: Pericia[], title: string): void {
  const doc = new jsPDF();

  // 1. Add Header
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

  // 2. Define Table Columns and Rows
  const head = [
    ['Processo', 'Reclamante', 'Status', 'Data da Perícia', 'Prazo Laudo']
  ];

  const body = pericias.map(p => [
    p.numeroProcesso,
    p.reclamante,
    statusConfig[p.status]?.label || 'Não definido',
    p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '-',
    p.prazoLaudo ? new Date(p.prazoLaudo).toLocaleDateString('pt-BR') : '-',
  ]);

  // 3. Create the Table
  doc.autoTable({
    startY: 40,
    head: head,
    body: body,
    theme: 'striped',
    headStyles: {
      fillColor: [22, 160, 133] // A nice teal color
    },
    didDrawPage: (data: any) => {
      // Add a footer to each page
      const pageCount = doc.internal.pages.length;
      doc.setFontSize(10);
      doc.text(`Página ${data.pageNumber} de ${pageCount - 1}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
  });

  // 4. Save the PDF
  const fileName = `relatorio_pericias_${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

export const pdfService = {
  generatePericiasReport,
};
