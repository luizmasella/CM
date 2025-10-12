// FILE: src/components/Dashboard.tsx (VERSÃO COMPLETA E CORRIGIDA)

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { TrendingUp, FileText, Calendar, AlertTriangle, Clock, Target, CheckCircle, DollarSign, FileQuestion, Gavel } from 'lucide-react';

export default function Dashboard() {
    const { stats, periciasAtrasadas } = usePericias();
    const { setActiveTab } = useUI();

    const handleCardClick = (filterType: string, value: string | null) => {
        // Futuramente, esta lógica de filtro pode ser movida para o PericiasContext
        // Por exemplo: setFilter({ type: filterType, value: value });
        setActiveTab('pericias');
    };

    // Verificação de segurança: não tenta renderizar se os dados ainda não foram calculados
    if (!stats) return <div className="p-6 text-center">Carregando estatísticas...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-600" />
                Visão Geral
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onClick={() => handleCardClick('total', null)} className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between"><div><p className="text-blue-100 text-sm font-medium">Total</p><p className="text-3xl font-bold mt-2">{stats.total}</p><p className="text-xs text-blue-100 mt-1">Todas as perícias</p></div><FileText className="opacity-50" size={40} /></div>
                </div>
                <div onClick={() => handleCardClick('hoje', null)} className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between"><div><p className="text-orange-100 text-sm font-medium">Hoje</p><p className="text-3xl font-bold mt-2">{stats.hojeAgendadas}</p><p className="text-xs text-orange-100 mt-1">Perícias agendadas</p></div><Calendar className="opacity-50" size={40} /></div>
                </div>
                <div onClick={() => handleCardClick('prazos_vencidos', null)} className={`p-6 rounded-xl cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 ${periciasAtrasadas.length > 0 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white animate-pulse' : 'bg-white border-2 border-gray-200'}`}>
                  <div className="flex items-center justify-between"><div><p className={`text-sm font-medium ${periciasAtrasadas.length > 0 ? 'text-red-100' : 'text-gray-600'}`}>Prazos Vencidos</p><p className={`text-3xl font-bold mt-2 ${periciasAtrasadas.length > 0 ? 'text-white' : 'text-gray-800'}`}>{stats.prazosVencidos}</p><p className={`text-xs mt-1 ${periciasAtrasadas.length > 0 ? 'text-red-100' : 'text-gray-500'}`}>Atenção necessária</p></div><AlertTriangle className={periciasAtrasadas.length > 0 ? 'text-white opacity-50' : 'text-gray-400'} size={40} /></div>
                </div>
                <div onClick={() => handleCardClick('status', 'aguarda_ato_pericial')} className="bg-white border-2 border-blue-200 p-6 rounded-xl cursor-pointer hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between"><div><p className="text-gray-600 text-sm font-medium">Aguardando</p><p className="text-3xl font-bold text-blue-600 mt-2">{stats.aguarda_ato_pericial}</p><p className="text-xs text-gray-500 mt-1">Ato Pericial</p></div><Clock className="text-blue-400" size={40} /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                <div onClick={() => handleCardClick('status', 'aguarda_laudo')} className="bg-white border-2 border-purple-200 p-4 rounded-xl cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"><div className="flex items-center justify-between"><div><p className="text-gray-600 text-xs font-medium">Aguardando</p><p className="text-2xl font-bold text-purple-600">{stats.aguarda_laudo}</p><p className="text-xs text-gray-500">Laudo</p></div><FileText className="text-purple-400" size={30} /></div></div>
                <div onClick={() => handleCardClick('status', 'aguarda_quesitos')} className="bg-white border-2 border-orange-200 p-4 rounded-xl cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"><div className="flex items-center justify-between"><div><p className="text-gray-600 text-xs font-medium">Aguardando</p><p className="text-2xl font-bold text-orange-600">{stats.aguarda_quesitos}</p><p className="text-xs text-gray-500">Quesitos</p></div><FileQuestion className="text-orange-400" size={30} /></div></div>
                <div onClick={() => handleCardClick('status', 'aguarda_sentenca')} className="bg-white border-2 border-indigo-200 p-4 rounded-xl cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"><div className="flex items-center justify-between"><div><p className="text-gray-600 text-xs font-medium">Aguardando</p><p className="text-2xl font-bold text-indigo-600">{stats.aguarda_sentenca}</p><p className="text-xs text-gray-500">Sentença</p></div><Gavel className="text-indigo-400" size={30} /></div></div>
                <div onClick={() => handleCardClick('status', 'aguarda_pagamento')} className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl text-white cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"><div className="flex items-center justify-between"><div><p className="text-yellow-100 text-xs font-medium">Aguardando</p><p className="text-2xl font-bold">{stats.aguarda_pagamento}</p><p className="text-xs text-yellow-100">Pagamento</p></div><DollarSign className="opacity-80" size={30} /></div></div>
                <div onClick={() => handleCardClick('status', 'concluida')} className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"><div className="flex items-center justify-between"><div><p className="text-green-100 text-xs font-medium">Perícias</p><p className="text-2xl font-bold">{stats.concluidas}</p><p className="text-xs text-green-100">Finalizadas</p></div><CheckCircle className="opacity-80" size={30} /></div></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"><div className="flex items-center justify-between"><div><p className="text-green-700 text-sm font-medium">Hon. Solicitados</p><p className="text-xl font-bold text-green-800 mt-1">R$ {stats.totalHonorariosSolicitados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><Target className="text-green-500" size={30} /></div></div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"><div className="flex items-center justify-between"><div><p className="text-blue-700 text-sm font-medium">Hon. Deferidos</p><p className="text-xl font-bold text-blue-800 mt-1">R$ {stats.totalHonorariosDeferidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><CheckCircle className="text-blue-500" size={30} /></div></div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200"><div className="flex items-center justify-between"><div><p className="text-yellow-700 text-sm font-medium">A Receber</p><p className="text-xl font-bold text-yellow-800 mt-1">R$ {stats.honorariosAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><Clock className="text-yellow-500" size={30} /></div></div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200"><div className="flex items-center justify-between"><div><p className="text-purple-700 text-sm font-medium">Já Recebidos</p><p className="text-xl font-bold text-purple-800 mt-1">R$ {stats.totalHonorariosPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><DollarSign className="text-purple-500" size={30} /></div></div>
              </div>
            </div>
        </div>
    );
}
