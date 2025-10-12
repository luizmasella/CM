// FILE: src/components/Dashboard.tsx

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { TrendingUp, FileText, Calendar, AlertTriangle, Clock, Target, CheckCircle, DollarSign, FileQuestion, Gavel } from 'lucide-react';

export default function Dashboard() {
    const { stats, periciasAtrasadas } = usePericias();
    const { setActiveTab } = useUI();

    // Esta função agora vive aqui, pois é específica deste componente
    const handleCardClick = (filterType: string, value: string | null) => {
        // Futuramente, esta lógica pode ser movida para o PericiasContext
        // Por exemplo: setFilter({ type: filterType, value: value });
        setActiveTab('pericias');
    };

    // Verificação de segurança: não tenta renderizar se os dados ainda não foram calculados
    if (!stats) return <div className="p-6 text-center">Carregando estatísticas...</div>;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-blue-600" />Visão Geral</h2>
          {/* O resto do JSX do Dashboard, que você já tem, continua aqui... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div onClick={() => handleCardClick('total', null)} className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white cursor-pointer"><div className="flex justify-between items-center"><p>Total</p><FileText size={40} className="opacity-50"/></div><p className="text-3xl font-bold">{stats.total}</p></div>
            <div onClick={() => handleCardClick('hoje', null)} className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white cursor-pointer"><div className="flex justify-between items-center"><p>Hoje</p><Calendar size={40} className="opacity-50"/></div><p className="text-3xl font-bold">{stats.hojeAgendadas}</p></div>
            <div onClick={() => handleCardClick('prazos_vencidos', null)} className={`p-6 rounded-xl cursor-pointer ${periciasAtrasadas.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}><div className="flex justify-between items-center"><p>Prazos Vencidos</p><AlertTriangle size={40} className="opacity-50"/></div><p className="text-3xl font-bold">{stats.prazosVencidos}</p></div>
            <div onClick={() => handleCardClick('status', 'aguarda_ato_pericial')} className="bg-blue-100 p-6 rounded-xl cursor-pointer"><div className="flex justify-between items-center"><p>Aguardando Ato</p><Clock size={40} className="opacity-50"/></div><p className="text-3xl font-bold">{stats.aguarda_ato_pericial}</p></div>
          </div>
        </div>
    );
}
