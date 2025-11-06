// FILE: src/components/Dashboard.tsx

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { TrendingUp, FileText, Calendar, AlertTriangle, Clock, Target, CheckCircle, DollarSign, FileQuestion, Gavel, AlertCircle, PlusCircle } from 'lucide-react';

// Novo componente para o estado vazio
const EmptyStateDashboard = () => {
    const { setShowForm, setActiveTab } = useUI();

    const handleAddNew = () => {
        setActiveTab('pericias');
        setShowForm(true);
    };

    return (
        <div className="text-center p-12 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
            <FileText size={60} className="mx-auto text-gray-400" />
            <h3 className="text-xl font-bold text-gray-700 mt-4">Nenhuma Perícia Cadastrada</h3>
            <p className="text-gray-500 mt-2 mb-6">Comece adicionando sua primeira perícia para ver suas estatísticas aqui.</p>
            <button
                onClick={handleAddNew}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
                <PlusCircle size={20} />
                Adicionar Primeira Perícia
            </button>
        </div>
    );
};


export default function Dashboard() {
    const { stats, periciasAtrasadas, prazos7Dias, prazos15Dias, setFilterStatus, setFilterDate, setFilterPrazo, clearAllFilters } = usePericias();
    const { setActiveTab } = useUI();

    const handleCardClick = (filterType: string, value: string | null) => {
        // CORREÇÃO: Limpa TODOS os filtros antes de aplicar novo
        clearAllFilters();
        
        if (filterType === 'status') { 
            setFilterStatus(value || 'todos'); 
        }
        if (filterType === 'hoje') { 
            setFilterDate(new Date().toISOString().split('T')[0]); 
        }
        if (filterType === 'prazo') { 
            setFilterPrazo(value || 'todos'); 
        }
        
        setActiveTab('pericias');
    };

    if (!stats) return <div className="p-6 text-center">Carregando estatísticas...</div>;

    // Condição para exibir o estado vazio
    if (stats.total === 0) {
        return <EmptyStateDashboard />;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" />
            Visão Geral
          </h2>
          
          {/* CARDS PRINCIPAIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => { clearAllFilters(); setActiveTab('pericias'); }} 
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-100">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText size={40} className="opacity-50"/>
              </div>
            </div>

            <div 
              onClick={() => handleCardClick('hoje', null)} 
              className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-orange-100">Hoje</p>
                  <p className="text-3xl font-bold">{stats.hojeAgendadas}</p>
                </div>
                <Calendar size={40} className="opacity-50"/>
              </div>
            </div>

            <div 
              onClick={() => handleCardClick('prazo', 'vencidos')} 
              className={`p-6 rounded-xl cursor-pointer transition-shadow ${periciasAtrasadas.length > 0 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-xl animate-pulse' : 'bg-gray-200 text-gray-600'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={periciasAtrasadas.length > 0 ? 'text-red-100' : 'text-gray-500'}>Vencidos</p>
                  <p className="text-3xl font-bold">{stats.prazosVencidos}</p>
                </div>
                <AlertTriangle size={40} className="opacity-50"/>
              </div>
            </div>

            <div 
              onClick={() => handleCardClick('status', 'aguarda_ato_pericial')} 
              className="bg-blue-100 p-6 rounded-xl cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-700">Aguardando Ato</p>
                  <p className="text-3xl font-bold text-blue-800">{stats.aguarda_ato_pericial}</p>
                </div>
                <Clock size={40} className="opacity-50 text-blue-500"/>
              </div>
            </div>
          </div>

          {/* CARDS DE PRAZOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div 
              onClick={() => handleCardClick('prazo', 'vencidos')} 
              className={`p-5 rounded-xl cursor-pointer transition-all ${
                periciasAtrasadas.length > 0 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-xl animate-pulse' 
                  : 'bg-red-50 border-2 border-red-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={periciasAtrasadas.length > 0 ? 'text-white' : 'text-red-500'} size={24} />
                  <span className={`font-bold ${periciasAtrasadas.length > 0 ? 'text-white' : 'text-red-800'}`}>
                    Prazos Vencidos
                  </span>
                </div>
              </div>
              <p className={`text-4xl font-bold ${periciasAtrasadas.length > 0 ? 'text-white' : 'text-red-700'}`}>
                {stats.prazosVencidos}
              </p>
              <p className={`text-sm mt-1 ${periciasAtrasadas.length > 0 ? 'text-red-100' : 'text-red-600'}`}>
                {periciasAtrasadas.length > 0 ? '⚠️ Ação imediata necessária' : '✅ Nenhum prazo vencido'}
              </p>
            </div>

            <div 
              onClick={() => handleCardClick('prazo', '7dias')} 
              className={`p-5 rounded-xl cursor-pointer transition-all ${
                prazos7Dias.length > 0 
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:shadow-xl' 
                  : 'bg-yellow-50 border-2 border-yellow-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className={prazos7Dias.length > 0 ? 'text-white' : 'text-yellow-500'} size={24} />
                  <span className={`font-bold ${prazos7Dias.length > 0 ? 'text-white' : 'text-yellow-800'}`}>
                    Próximos 7 Dias
                  </span>
                </div>
              </div>
              <p className={`text-4xl font-bold ${prazos7Dias.length > 0 ? 'text-white' : 'text-yellow-700'}`}>
                {stats.prazos7Dias}
              </p>
              <p className={`text-sm mt-1 ${prazos7Dias.length > 0 ? 'text-yellow-100' : 'text-yellow-600'}`}>
                {prazos7Dias.length > 0 ? '⚡ Atenção urgente' : '✅ Nenhum prazo próximo'}
              </p>
            </div>

            <div 
              onClick={() => handleCardClick('prazo', '15dias')} 
              className={`p-5 rounded-xl cursor-pointer transition-all ${
                prazos15Dias.length > 0 
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl' 
                  : 'bg-orange-50 border-2 border-orange-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className={prazos15Dias.length > 0 ? 'text-white' : 'text-orange-500'} size={24} />
                  <span className={`font-bold ${prazos15Dias.length > 0 ? 'text-white' : 'text-orange-800'}`}>
                    Próximos 15 Dias
                  </span>
                </div>
              </div>
              <p className={`text-4xl font-bold ${prazos15Dias.length > 0 ? 'text-white' : 'text-orange-700'}`}>
                {stats.prazos15Dias}
              </p>
              <p className={`text-sm mt-1 ${prazos15Dias.length > 0 ? 'text-orange-100' : 'text-orange-600'}`}>
                {prazos15Dias.length > 0 ? '📋 Planejamento necessário' : '✅ Nenhum prazo'}
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            <div 
              onClick={() => handleCardClick('status', 'aguarda_laudo')} 
              className="bg-white border-2 border-purple-200 p-4 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aguard. Laudo</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.aguarda_laudo}</p>
                </div>
                <FileText className="text-purple-400" size={30} />
              </div>
            </div>

            <div 
              onClick={() => handleCardClick('status', 'aguarda_quesitos')} 
              className="bg-white border-2 border-orange-200 p-4 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aguard. Quesitos</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.aguarda_quesitos}</p>
                </div>
                <FileQuestion className="text-orange-400" size={30} />
              </div>
            </div>

            <div 
              onClick={() => handleCardClick('status', 'aguarda_sentenca')} 
              className="bg-white border-2 border-indigo-200 p-4 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aguard. Sentença</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.aguarda_sentenca}</p>
                </div>
                <Gavel className="text-indigo-400" size={30} />
              </div>
            </div>

            <div 
              onClick={() => handleCardClick('status', 'aguarda_pagamento')} 
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl text-white cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-100">Aguard. Pagamento</p>
                  <p className="text-2xl font-bold">{stats.aguarda_pagamento}</p>
                </div>
                <DollarSign className="opacity-80" size={30} />
              </div>
            </div>

            <div 
              onClick={() => handleCardClick('status', 'concluida')} 
              className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Finalizadas</p>
                  <p className="text-2xl font-bold">{stats.concluidas}</p>
                </div>
                <CheckCircle className="opacity-80" size={30} />
              </div>
            </div>
          </div>

          {/* HONORÁRIOS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Hon. Solicitados</p>
                  <p className="text-xl font-bold text-green-800 mt-1">
                    R$ {stats.totalHonorariosSolicitados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Target className="text-green-500" size={30} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Hon. Deferidos</p>
                  <p className="text-xl font-bold text-blue-800 mt-1">
                    R$ {stats.totalHonorariosDeferidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <CheckCircle className="text-blue-500" size={30} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">A Receber</p>
                  <p className="text-xl font-bold text-yellow-800 mt-1">
                    R$ {stats.honorariosAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Clock className="text-yellow-500" size={30} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Já Recebidos</p>
                  <p className="text-xl font-bold text-purple-800 mt-1">
                    R$ {stats.totalHonorariosPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="text-purple-500" size={30} />
              </div>
            </div>
          </div>
        </div>
    );
}
