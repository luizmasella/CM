// FILE: src/components/Dashboard.tsx (APAGUE TUDO E COLE ISTO)

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { TrendingUp, FileText, Calendar, AlertTriangle, Clock, Target, CheckCircle, DollarSign, FileQuestion, Gavel } from 'lucide-react';

export default function Dashboard() {
    const { stats, periciasAtrasadas } = usePericias();
    const { setActiveTab } = useUI();

    const handleCardClick = (filterType: string, value: string | null) => {
        // Futuramente, essa lógica de filtro também irá para o PericiasContext
        setActiveTab('pericias');
    };

    // VERIFICAÇÃO IMPORTANTE: Garante que o componente não quebre se as stats ainda não foram calculadas
    if (!stats) return <div className="p-6 text-center">Carregando estatísticas...</div>;

    return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Visão Geral
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onClick={() => handleCardClick('total', null)} className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl"><p>Total</p><p className="text-3xl font-bold">{stats.total}</p></div>
                <div onClick={() => handleCardClick('hoje', null)} className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white cursor-pointer hover:shadow-xl"><p>Hoje</p><p className="text-3xl font-bold">{stats.hojeAgendadas}</p></div>
                <div onClick={() => handleCardClick('prazos_vencidos', null)} className={`p-6 rounded-xl cursor-pointer ${periciasAtrasadas.length > 0 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}><p>Prazos Vencidos</p><p className="text-3xl font-bold">{stats.prazosVencidos}</p></div>
                <div onClick={() => handleCardClick('status', 'aguarda_ato_pericial')} className="bg-blue-100 p-6 rounded-xl cursor-pointer"><p>Aguardando Ato Pericial</p><p className="text-3xl font-bold">{stats.aguarda_ato_pericial}</p></div>
            </div>
            {/* ...outros cards de stats... */}
          </div>
        </div>
    );
}
