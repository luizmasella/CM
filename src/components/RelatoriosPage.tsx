// FILE: src/components/RelatoriosPage.tsx

import React from 'react';
import { 
  PieChart, 
  Clock, 
  FileText, 
  FileQuestion, 
  Gavel, 
  DollarSign, 
  CheckCircle,
  Download 
} from 'lucide-react';

interface RelatoriosPageProps {
  stats: any;
  exportarRelatorio: () => void;
}

export default function RelatoriosPage({ stats, exportarRelatorio }: RelatoriosPageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <PieChart className="text-blue-600" />
          Relatório Completo do Sistema
        </h2>
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-6">
          <div className="text-center">
            <p className="text-blue-100 text-lg mb-2">Total de Perícias Cadastradas</p>
            <p className="text-6xl font-bold">{stats.total}</p>
            <p className="text-blue-200 mt-2">Perícias no Sistema</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Distribuição por Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Aguardando Ato Pericial */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="text-blue-600" size={24} />
                <span className="font-medium text-gray-700">Aguardando Ato Pericial</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-700">{stats.aguarda_ato_pericial}</p>
                  <p className="text-sm text-gray-600">perícias</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.total > 0 ? ((stats.aguarda_ato_pericial / stats.total) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.aguarda_ato_pericial / stats.total * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Outros Status */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <FileText className="text-purple-600" size={24} />
                    <span className="font-medium text-gray-700">Aguardando Laudo</span>
                </div>
                <p className="text-3xl font-bold text-purple-700">{stats.aguarda_laudo}</p>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <FileQuestion className="text-orange-600" size={24} />
                    <span className="font-medium text-gray-700">Aguardando Quesitos</span>
                </div>
                <p className="text-3xl font-bold text-orange-700">{stats.aguarda_quesitos}</p>
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Gavel className="text-indigo-600" size={24} />
                    <span className="font-medium text-gray-700">Aguardando Sentença</span>
                </div>
                <p className="text-3xl font-bold text-indigo-700">{stats.aguarda_sentenca}</p>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="text-yellow-600" size={24} />
                    <span className="font-medium text-gray-700">Aguardando Pagamento</span>
                </div>
                <p className="text-3xl font-bold text-yellow-700">{stats.aguarda_pagamento}</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="text-green-600" size={24} />
                    <span className="font-medium text-gray-700">Concluídas</span>
                </div>
                <p className="text-3xl font-bold text-green-700">{stats.concluidas}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Análise Financeira
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Honorários Solicitados</p>
              <p className="text-2xl font-bold text-gray-800">
                R$ {stats.totalHonorariosSolicitados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Honorários Deferidos</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {stats.totalHonorariosDeferidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">A Receber</p>
              <p className="text-2xl font-bold text-yellow-600">
                R$ {stats.honorariosAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Já Recebidos</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {stats.totalHonorariosPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={exportarRelatorio}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:from-green-700 hover:to-green-800 transition-all shadow-md mx-auto"
          >
            <Download size={20} />
            Exportar Relatório em CSV
          </button>
        </div>
      </div>
    </div>
  );
}
