// FILE: src/utils/export.ts
// ATUALIZADO: Sistema de exportação com tratamento de erros robusto

import { errorHandler, ErrorCategory, ErrorSeverity } from './errorHandler';

interface Pericia {
  id: number;
  numeroProcesso: string;
  reclamante: string;
  reclamadas: string[];
  data: string;
  hora: string;
  tipo: string;
  vara: string;
  juiz: string;
  local: string;
  regiao: string;
  status: string;
  justicaGratuita: boolean;
  honorariosSolicitados: number;
  honorariosDeferidos: number;
  prazoLaudo: string | null;
  prazoQuesitos: string | null;
  observacoes: string;
}

export class ExportService {
  /**
   * Formata data para exibição
   */
  private formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'FormatDate',
        error
      );
      return dateString;
    }
  }

  /**
   * Formata valor monetário
   */
  private formatCurrency(value: number): string {
    try {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'FormatCurrency',
        error
      );
      return `R$ ${value.toFixed(2)}`;
    }
  }

  /**
   * Traduz status para português
   */
  private translateStatus(status: string): string {
    try {
      const statusMap: Record<string, string> = {
        aguarda_ato_pericial: "Aguarda Ato Pericial",
        aguarda_laudo: "Aguarda Laudo",
        aguarda_quesitos: "Aguarda Quesitos",
        aguarda_sentenca: "Aguarda Sentença",
        aguarda_pagamento: "Aguarda Pagamento",
        concluida: "Concluída",
        cancelada: "Cancelada",
        recusada: "Recusada",
      };
      return statusMap[status] || status;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'TranslateStatus',
        error
      );
      return status;
    }
  }

  /**
   * Valida dados antes de exportar
   */
  private validateData(pericias: Pericia[]): boolean {
    try {
      if (!Array.isArray(pericias)) {
        throw new Error('Dados não são um array');
      }

      if (pericias.length === 0) {
        throw new Error('Nenhuma perícia para exportar');
      }

      // Valida estrutura básica
      const isValid = pericias.every(p => 
        p && typeof p === 'object' && 'id' in p && 'numeroProcesso' in p
      );

      if (!isValid) {
        throw new Error('Estrutura de dados inválida');
      }

      return true;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM,
        'ValidateExportData',
        error,
        'Dados inválidos para exportação.'
      );
      return false;
    }
  }

  /**
   * Exporta para CSV
   */
  exportToCSV(pericias: Pericia[], filename = "pericias"): boolean {
    try {
      // Valida dados
      if (!this.validateData(pericias)) {
        return false;
      }

      const headers = [
        "Nº Processo", "Reclamante", "Reclamadas", "Data", "Hora", "Tipo",
        "Vara", "Juiz", "Local", "Região", "Status", "Justiça Gratuita",
        "Hon. Solicitados", "Hon. Deferidos", "Prazo Laudo", "Prazo Quesitos", "Observações",
      ];

      const rows = pericias.map((p) => [
        p.numeroProcesso,
        p.reclamante,
        p.reclamadas.join("; "),
        this.formatDate(p.data),
        p.hora,
        p.tipo,
        p.vara,
        p.juiz,
        p.local,
        p.regiao,
        this.translateStatus(p.status),
        p.justicaGratuita ? "Sim" : "Não",
        this.formatCurrency(p.honorariosSolicitados),
        this.formatCurrency(p.honorariosDeferidos),
        p.prazoLaudo ? this.formatDate(p.prazoLaudo) : "-",
        p.prazoQuesitos ? this.formatDate(p.prazoQuesitos) : "-",
        p.observacoes || "-",
      ]);

      // Cria o conteúdo CSV
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      // Adiciona BOM para UTF-8
      const bom = "\uFEFF";
      const blob = new Blob([bom + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      this.downloadFile(blob, `${filename}.csv`);
      return true;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'ExportCSV',
        error,
        'Erro ao exportar CSV. Tente novamente.'
      );
      return false;
    }
  }

  /**
   * Exporta para Excel
   */
  exportToExcel(pericias: Pericia[], filename = "pericias"): boolean {
    try {
      // Valida dados
      if (!this.validateData(pericias)) {
        return false;
      }

      const headers = [
        "Nº Processo", "Reclamante", "Reclamadas", "Data", "Hora", "Tipo",
        "Vara", "Juiz", "Local", "Região", "Status", "Justiça Gratuita",
        "Hon. Solicitados", "Hon. Deferidos", "Prazo Laudo", "Prazo Quesitos", "Observações",
      ];

      let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4472C4; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .currency { text-align: right; }
            .date { text-align: center; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                ${headers.map((h) => `<th>${h}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
      `;

      pericias.forEach((p) => {
        html += `
          <tr>
            <td>${p.numeroProcesso}</td>
            <td>${p.reclamante}</td>
            <td>${p.reclamadas.join("; ")}</td>
            <td class="date">${this.formatDate(p.data)}</td>
            <td class="date">${p.hora}</td>
            <td>${p.tipo}</td>
            <td>${p.vara}</td>
            <td>${p.juiz}</td>
            <td>${p.local}</td>
            <td>${p.regiao}</td>
            <td>${this.translateStatus(p.status)}</td>
            <td>${p.justicaGratuita ? "Sim" : "Não"}</td>
            <td class="currency">${this.formatCurrency(p.honorariosSolicitados)}</td>
            <td class="currency">${this.formatCurrency(p.honorariosDeferidos)}</td>
            <td class="date">${p.prazoLaudo ? this.formatDate(p.prazoLaudo) : "-"}</td>
            <td class="date">${p.prazoQuesitos ? this.formatDate(p.prazoQuesitos) : "-"}</td>
            <td>${p.observacoes || "-"}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([html], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });

      this.downloadFile(blob, `${filename}.xls`);
      return true;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'ExportExcel',
        error,
        'Erro ao exportar Excel. Tente novamente.'
      );
      return false;
    }
  }

  /**
   * Exporta relatório em PDF (HTML para impressão)
   */
  exportToPDF(pericias: Pericia[], stats: any, filename = "relatorio-pericias"): boolean {
    try {
      // Valida dados
      if (!this.validateData(pericias)) {
        return false;
      }

      if (!stats || typeof stats !== 'object') {
        throw new Error('Estatísticas inválidas');
      }

      const hoje = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Relatório de Perícias</title>
          <style>
            @page { margin: 2cm; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              color: #666;
              margin: 5px 0;
            }
            .stats {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-card {
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            .stat-card h3 {
              margin: 0;
              font-size: 14px;
              color: #666;
            }
            .stat-card p {
              margin: 5px 0 0;
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #2563eb;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            @media print {
              .no-print { display: none; }
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 Relatório de Perícias Médicas</h1>
            <p>Gerado em ${hoje}</p>
          </div>

          <div class="stats">
            <div class="stat-card">
              <h3>Total de Perícias</h3>
              <p>${stats.total}</p>
            </div>
            <div class="stat-card">
              <h3>Concluídas</h3>
              <p>${stats.concluidas}</p>
            </div>
            <div class="stat-card">
              <h3>Prazos Vencidos</h3>
              <p>${stats.prazosVencidos}</p>
            </div>
            <div class="stat-card">
              <h3>Hon. Deferidos</h3>
              <p>${this.formatCurrency(stats.totalHonorariosDeferidos)}</p>
            </div>
          </div>

          <h2 style="color: #2563eb; margin-top: 30px;">Perícias Cadastradas</h2>
          <table>
            <thead>
              <tr>
                <th>Processo</th>
                <th>Reclamante</th>
                <th>Data</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Honorários</th>
              </tr>
            </thead>
            <tbody>
              ${pericias
                .map(
                  (p) => `
                <tr>
                  <td>${p.numeroProcesso}</td>
                  <td>${p.reclamante}</td>
                  <td>${this.formatDate(p.data)}</td>
                  <td>${p.tipo}</td>
                  <td>${this.translateStatus(p.status)}</td>
                  <td>${this.formatCurrency(p.honorariosDeferidos)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Sistema de Gerenciamento de Perícias Médicas | © 2025</p>
            <button class="no-print" onclick="window.print()" 
              style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
              🖨️ Imprimir / Salvar PDF
            </button>
          </div>
        </body>
        </html>
      `;

      // Abre em nova janela para impressão
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        return true;
      } else {
        throw new Error('Não foi possível abrir janela de impressão');
      }
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'ExportPDF',
        error,
        'Erro ao gerar PDF. Verifique se pop-ups estão habilitados.'
      );
      return false;
    }
  }

  /**
   * Função auxiliar para download
   */
  private downloadFile(blob: Blob, filename: string): void {
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'DownloadFile',
        error,
        'Erro ao baixar arquivo.'
      );
      throw error;
    }
  }
}

/**
 * Hook para usar o serviço de exportação com tratamento de erros
 */
export function useExport() {
  const exportService = new ExportService();

  return {
    exportToCSV: (pericias: Pericia[]) => {
      try {
        return exportService.exportToCSV(pericias);
      } catch (error) {
        errorHandler.logError(
          ErrorCategory.PROCESSING,
          ErrorSeverity.HIGH,
          'useExport-CSV',
          error
        );
        return false;
      }
    },
    exportToExcel: (pericias: Pericia[]) => {
      try {
        return exportService.exportToExcel(pericias);
      } catch (error) {
        errorHandler.logError(
          ErrorCategory.PROCESSING,
          ErrorSeverity.HIGH,
          'useExport-Excel',
          error
        );
        return false;
      }
    },
    exportToPDF: (pericias: Pericia[], stats: any) => {
      try {
        return exportService.exportToPDF(pericias, stats);
      } catch (error) {
        errorHandler.logError(
          ErrorCategory.PROCESSING,
          ErrorSeverity.HIGH,
          'useExport-PDF',
          error
        );
        return false;
      }
    },
  };
}
