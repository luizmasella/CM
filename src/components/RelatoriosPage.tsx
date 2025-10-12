// FILE: src/components/RelatoriosPage.tsx

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { PieChart, Download } from 'lucide-react';

export default function RelatoriosPage() {
  const { stats } = usePericias();
  const exportarRelatorio = () => alert('Exportando...');

  if (!stats) return <div>Carregando relatórios...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PieChart className="text-blue-600" />
        Relatório Completo do Sistema
      </h2>
      <div className="bg-blue-600 text-white p-6 rounded-xl mb-6 text-center">
        <p className="text-lg">Total de Perícias</p>
        <p className="text-6xl font-bold">{stats.total}</p>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Distribuição por Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">Aguardando Ato Pericial: <span className="font-bold">{stats.aguarda_ato_pericial}</span></div>
            <div className="bg-purple-50 p-4 rounded-lg">Aguardando Laudo: <span className="font-bold">{stats.aguarda_laudo}</span></div>
            <div className="bg-green-50 p-4 rounded-lg">Concluídas: <span className="font-bold">{stats.concluidas}</span></div>
        </div>
      </div>
       <div className="text-center">
          <button onClick={exportarRelatorio} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto">
            <Download size={20} /> Exportar Relatório
          </button>
        </div>
    </div>
  );
}
