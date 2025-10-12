// FILE: src/components/Dashboard.tsx (VERSÃO COMPLETA E CORRIGIDA)

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { TrendingUp, FileText, Calendar, AlertTriangle, Clock, Target, CheckCircle, DollarSign, FileQuestion, Gavel } from 'lucide-react';

export default function Dashboard() {
    const { stats, periciasAtrasadas, setFilterStatus, setFilterDate, setFilterPrazo } = usePericias();
    const { handleCardClick } = useUI();

    const onCardClick = (filterType: string, value: string | null) => {
        // Zera outros filtros para evitar conflitos
        setFilterStatus('todos');
        setFilterDate('');
        setFilterPrazo('todos');

        if (filterType === 'status') { setFilterStatus(value || 'todos'); }
        if (filterType === 'hoje') { setFilterDate(new Date().toISOString().split('T')[0]); }
        if (filterType === 'prazos_vencidos') { setFilterPrazo('vencidos'); }
        
        handleCardClick(filterType, value); // Chama a função do UIContext para mudar de aba
    };

    if (!stats) return <div className="p-6 text-center">Carregando estatísticas...</div>;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-blue-600" />Visão Geral</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div onClick={() => onCardClick('total', null)} className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl"><div className="flex justify-between items-center"><div><p>Total</p><p className="text-3xl font-bold">{stats.total}</p></div><FileText size={40} className="opacity-50"/></div></div>
            <div onClick={() => onCardClick('hoje', null)} className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl"><div className="flex justify-between items-center"><div><p>Hoje</p><p className="text-3xl font-bold">{stats.hojeAgendadas}</p></div><Calendar size={40} className="opacity-50"/></div></div>
            <div onClick={() => onCardClick('prazos_vencidos', null)} className={`p-6 rounded-xl cursor-pointer ${periciasAtrasadas.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}><div className="flex justify-between items-center"><div><p>Prazos Vencidos</p><p className="text-3xl font-bold">{stats.prazosVencidos}</p></div><AlertTriangle size={40} className="opacity-50"/></div></div>
            <div onClick={() => onCardClick('status', 'aguarda_ato_pericial')} className="bg-blue-100 p-6 rounded-xl cursor-pointer"><div className="flex justify-between items-center"><div><p>Aguardando Ato</p><p className="text-3xl font-bold">{stats.aguarda_ato_pericial}</p></div><Clock size={40} className="opacity-50"/></div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            <div onClick={() => onCardClick('status', 'aguarda_laudo')} className="bg-white border-2 border-purple-200 p-4 rounded-xl cursor-pointer"><div className="flex items-center justify-between"><div><p>Aguard. Laudo</p><p className="text-2xl font-bold text-purple-600">{stats.aguarda_laudo}</p></div><FileText className="text-purple-400" size={30} /></div></div>
            <div onClick={() => onCardClick('status', 'aguarda_quesitos')} className="bg-white border-2 border-orange-200 p-4 rounded-xl cursor-pointer"><div className="flex items-center justify-between"><div><p>Aguard. Quesitos</p><p className="text-2xl font-bold text-orange-600">{stats.aguarda_quesitos}</p></div><FileQuestion className="text-orange-400" size={30} /></div></div>
            <div onClick={() => onCardClick('status', 'aguarda_sentenca')} className="bg-white border-2 border-indigo-200 p-4 rounded-xl cursor-pointer"><div className="flex items-center justify-between"><div><p>Aguard. Sentença</p><p className="text-2xl font-bold text-indigo-600">{stats.aguarda_sentenca}</p></div><Gavel className="text-indigo-400" size={30} /></div></div>
            <div onClick={() => onCardClick('status', 'aguarda_pagamento')} className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl text-white cursor-pointer"><div className="flex items-center justify-between"><div><p>Aguard. Pagamento</p><p className="text-2xl font-bold">{stats.aguarda_pagamento}</p></div><DollarSign className="opacity-80" size={30} /></div></div>
            <div onClick={() => onCardClick('status', 'concluida')} className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white cursor-pointer"><div className="flex items-center justify-between"><div><p>Finalizadas</p><p className="text-2xl font-bold">{stats.concluidas}</p></div><CheckCircle className="opacity-80" size={30} /></div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200"><div className="flex items-center justify-between"><div><p>Hon. Solicitados</p><p className="text-xl font-bold text-green-800 mt-1">R$ {stats.totalHonorariosSolicitados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><Target className="text-green-500" size={30} /></div></div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"><div className="flex items-center justify-between"><div><p>Hon. Deferidos</p><p className="text-xl font-bold text-blue-800 mt-1">R$ {stats.totalHonorariosDeferidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><CheckCircle className="text-blue-500" size={30} /></div></div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200"><div className="flex items-center justify-between"><div><p>A Receber</p><p className="text-xl font-bold text-yellow-800 mt-1">R$ {stats.honorariosAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><Clock className="text-yellow-500" size={30} /></div></div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200"><div className="flex items-center justify-between"><div><p>Já Recebidos</p><p className="text-xl font-bold text-purple-800 mt-1">R$ {stats.totalHonorariosPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div><DollarSign className="text-purple-500" size={30} /></div></div>
          </div>
        </div>
    );
}
