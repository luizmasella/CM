// FILE: src/components/RelatoriosPage.tsx
import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { PieChart, Download, Clock, FileText, FileQuestion, Gavel, DollarSign, CheckCircle } from 'lucide-react';

export default function RelatoriosPage() {
  const { stats } = usePericias();
  const exportarRelatorio = () => alert('Exportando...');

  if (!stats) return <div className="p-6 text-center">Carregando relatórios...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><PieChart className="text-blue-600" />Relatório Completo do Sistema</h2>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-6 text-center">
        <p className="text-lg">Total de Perícias Cadastradas</p><p className="text-6xl font-bold">{stats.total}</p>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Distribuição por Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3"><Clock className="text-blue-600" size={24} /><span className="font-medium">Aguardando Ato Pericial</span></div>
                <p className="text-3xl font-bold text-blue-700">{stats.aguarda_ato_pericial}</p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3"><FileText className="text-purple-600" size={24} /><span className="font-medium">Aguardando Laudo</span></div>
                <p className="text-3xl font-bold text-purple-700">{stats.aguarda_laudo}</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3"><CheckCircle className="text-green-600" size={24} /><span className="font-medium">Concluídas</span></div>
                <p className="text-3xl font-bold text-green-700">{stats.concluidas}</p>
            </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Análise Financeira</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow"><p>Honorários Solicitados</p><p className="text-2xl font-bold">R$ {stats.totalHonorariosSolicitados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
            <div className="bg-white p-4 rounded-lg shadow"><p>Honorários Deferidos</p><p className="text-2xl font-bold text-blue-600">R$ {stats.totalHonorariosDeferidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
            <div className="bg-white p-4 rounded-lg shadow"><p>A Receber</p><p className="text-2xl font-bold text-yellow-600">R$ {stats.honorariosAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
            <div className="bg-white p-4 rounded-lg shadow"><p>Já Recebidos</p><p className="text-2xl font-bold text-green-600">R$ {stats.totalHonorariosPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
        </div>
      </div>
      <div className="text-center">
        <button onClick={exportarRelatorio} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-green-700"><Download size={20} />Exportar Relatório</button>
      </div>
    </div>
  );
}
