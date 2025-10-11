// FILE: src/utils/export.ts
// Sistema de exportação para Excel e PDF

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
  // Formata data para exibição
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  // Formata valor monetário
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  // Traduz status para português
  private translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      aguarda_ato_pericial: "Aguarda Ato Pericial",
      aguarda_laudo: "Aguarda Laudo",
      aguarda_quesitos: "Aguarda Quesitos",
      aguarda_sentenca: "Aguarda Sentença",
      aguarda_pagamento: "Aguarda Pagamento",
      concluida: "Concluída",
    };
    return statusMap[status] || status;
  }

  // Exporta para CSV
  exportToCSV(pericias: Pericia[], filename = "pericias"): void {
    const headers = [
      "Nº Processo",
      "Reclamante",
      "Reclamadas",
      "Data",
      "Hora",
      "Tipo",
      "Vara",
      "Juiz",
      "Local",
      "Região",
      "Status",
      "Justiça Gratuita",
      "Hon. Solicitados",
      "Hon. Deferidos",
      "Prazo Laudo",
      "Prazo Quesitos",
      "Observações",
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
  }

  // Exporta para Excel (formato HTML que o Excel reconhece)
  exportToExcel(pericias: Pericia[], filename = "pericias"): void {
    const headers = [
      "Nº Processo",
      "Reclamante",
      "Reclamadas",
      "Data",
      "Hora",
      "Tipo",
      "Vara",
      "Juiz",
      "Local",
      "Região",
      "Status",
      "Justiça Gratuita",
      "Hon. Solicitados",
      "Hon. Deferidos",
      "Prazo Laudo",
      "Prazo Quesitos",
      "Observações",
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
  }

  // Exporta relatório em PDF (HTML para impressão)
  exportToPDF(pericias: Pericia[], stats: any, filename = "relatorio-pericias"): void {
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
    }
  }

  // Exporta resumo estatístico
  exportStatsReport(stats: any, pericias: Pericia[]): void {
    const hoje = new Date().toLocaleDateString("pt-BR");
    
    const content = `
RELATÓRIO ESTATÍSTICO DE PERÍCIAS
Gerado em: ${hoje}
═══════════════════════════════════════════════════════════

RESUMO GERAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total de Perícias:              ${stats.total}
Perícias Concluídas:            ${stats.concluidas}
Aguardando Ato Pericial:        ${stats.aguarda_ato_pericial}
Aguardando Laudo:               ${stats.aguarda_laudo}
Aguardando Quesitos:            ${stats.aguarda_quesitos}
Aguardando Sentença:            ${stats.aguarda_sentenca}
Aguardando Pagamento:           ${stats.aguarda_pagamento}
Prazos Vencidos:                ${stats.prazosVencidos} ⚠️

FINANCEIRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Honorários Solicitados:         ${this.formatCurrency(stats.totalHonorariosSolicitados)}
Honorários Deferidos:           ${this.formatCurrency(stats.totalHonorariosDeferidos)}
A Receber:                      ${this.formatCurrency(stats.honorariosAReceber)}
Já Recebidos:                   ${this.formatCurrency(stats.totalHonorariosPagos)}
Taxa de Deferimento:            ${((stats.totalHonorariosDeferidos / stats.totalHonorariosSolicitados) * 100).toFixed(1)}%

DISTRIBUIÇÃO POR TIPO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${this.getDistributionByType(pericias)}

═══════════════════════════════════════════════════════════
Sistema de Gerenciamento de Perícias Médicas
    `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    this.downloadFile(blob, `relatorio-estatistico-${hoje}.txt`);
  }

  // Obtém distribuição por tipo
  private getDistributionByType(pericias: Pericia[]): string {
    const tipos = pericias.reduce((acc, p) => {
      acc[p.tipo] = (acc[p.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tipos)
      .map(([tipo, count]) => `${tipo}: ${count}`)
      .join("\n");
  }

  // Função auxiliar para download
  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Hook para usar o serviço de exportação
export function useExport() {
  const exportService = new ExportService();

  return {
    exportToCSV: (pericias: Pericia[]) => exportService.exportToCSV(pericias),
    exportToExcel: (pericias: Pericia[]) => exportService.exportToExcel(pericias),
    exportToPDF: (pericias: Pericia[], stats: any) => exportService.exportToPDF(pericias, stats),
    exportStatsReport: (stats: any, pericias: Pericia[]) => exportService.exportStatsReport(stats, pericias),
  };
}
