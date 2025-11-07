// FILE: src/components/Dashboard.tsx

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import {
    TrendingUp, FileText, Calendar, AlertTriangle, Clock, Target,
    CheckCircle, DollarSign, FileQuestion, Gavel, AlertCircle, Briefcase
} from 'lucide-react';
import { InfoCard } from './InfoCard';

// Helper component for stat cards to reduce repetition
const StatCard = ({ title, value, Icon, colorClass, onClick, extraInfo = '' }) => (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-transform hover:-translate-y-1 border-l-4"
      style={{ borderLeftColor: colorClass }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="p-2 rounded-full" style={{ backgroundColor: `${colorClass}20`}}>
              <Icon className="h-6 w-6" style={{ color: colorClass }}/>
           </div>
           <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
           </div>
        </div>
        {extraInfo && <p className="text-xs text-gray-400">{extraInfo}</p>}
      </div>
    </div>
);


export default function Dashboard() {
    const { stats, periciasAtrasadas, prazos7Dias, prazos15Dias, setFilterStatus, setFilterDate, setFilterPrazo, clearAllFilters } = usePericias();
    const { setActiveTab } = useUI();

    const handleCardClick = (filterType: string, value: string | null) => {
        clearAllFilters();
        
        if (filterType === 'status') { 
            setFilterStatus(value || 'todos'); 
        } else if (filterType === 'hoje') {
            setFilterDate(new Date().toISOString().split('T')[0]); 
        } else if (filterType === 'prazo') {
            setFilterPrazo(value || 'todos'); 
        }
        
        setActiveTab('pericias');
    };

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-full p-6">
                <p className="text-lg text-gray-500">Carregando estatísticas...</p>
            </div>
        );
    }

    // Define colors for consistency
    const colors = {
      blue: '#3b82f6',
      orange: '#f97316',
      red: '#ef4444',
      yellow: '#eab308',
      purple: '#8b5cf6',
      indigo: '#6366f1',
      green: '#22c55e',
      gray: '#6b7280'
    };


    return (
        <div className="bg-gray-50 p-6 rounded-lg">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <TrendingUp className="text-indigo-500" />
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Sua visão geral sobre perícias e prazos.</p>
          </div>

          {/* CARDS PRINCIPAIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard
                  title="Total de Perícias"
                  value={stats.total}
                  Icon={Briefcase}
                  color="text-indigo-600"
                  bgColor="bg-indigo-100"
                  onClick={() => { clearAllFilters(); setActiveTab('pericias'); }}
              />
              <InfoCard
                  title="Agendadas para Hoje"
                  value={stats.hojeAgendadas}
                  Icon={Calendar}
                  color="text-orange-600"
                  bgColor="bg-orange-100"
                  onClick={() => handleCardClick('hoje', null)}
              />
              <InfoCard
                  title="Prazos Vencidos"
                  value={stats.prazosVencidos}
                  Icon={AlertTriangle}
                  color="text-white"
                  bgColor={periciasAtrasadas.length > 0 ? "bg-red-500 animate-pulse" : "bg-red-200"}
                  onClick={() => handleCardClick('prazo', 'vencidos')}
              />
              <InfoCard
                  title="Aguardando Ato"
                  value={stats.aguarda_ato_pericial}
                  Icon={Clock}
                  color="text-blue-600"
                  bgColor="bg-blue-100"
                  onClick={() => handleCardClick('status', 'aguarda_ato_pericial')}
              />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna de Prazos e Status */}
            <div className="lg:col-span-2 space-y-8">
                {/* PRAZOS */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Prazos Importantes</h3>
                  <div className="space-y-4">
                      <StatCard
                          title="Prazos Vencidos"
                          value={stats.prazosVencidos}
                          Icon={AlertTriangle}
                          colorClass={colors.red}
                          onClick={() => handleCardClick('prazo', 'vencidos')}
                          extraInfo={periciasAtrasadas.length > 0 ? 'Ação imediata necessária!' : 'Nenhum prazo vencido'}
                      />
                      <StatCard
                          title="Vencem nos Próximos 7 Dias"
                          value={stats.prazos7Dias}
                          Icon={Clock}
                          colorClass={colors.yellow}
                          onClick={() => handleCardClick('prazo', '7dias')}
                          extraInfo={prazos7Dias.length > 0 ? 'Atenção necessária' : 'Nenhum prazo para os próximos 7 dias'}
                      />
                      <StatCard
                          title="Vencem nos Próximos 15 Dias"
                          value={stats.prazos15Dias}
                          Icon={AlertCircle}
                          colorClass={colors.orange}
                          onClick={() => handleCardClick('prazo', '15dias')}
                          extraInfo={prazos15Dias.length > 0 ? 'Planejamento recomendado' : 'Nenhum prazo para os próximos 15 dias'}
                      />
                  </div>
                </div>

                {/* STATUS */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Status das Perícias</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatCard title="Aguardando Laudo" value={stats.aguarda_laudo} Icon={FileText} colorClass={colors.purple} onClick={() => handleCardClick('status', 'aguarda_laudo')} />
                        <StatCard title="Aguardando Quesitos" value={stats.aguarda_quesitos} Icon={FileQuestion} colorClass={colors.orange} onClick={() => handleCardClick('status', 'aguarda_quesitos')} />
                        <StatCard title="Aguardando Sentença" value={stats.aguarda_sentenca} Icon={Gavel} colorClass={colors.indigo} onClick={() => handleCardClick('status', 'aguarda_sentenca')} />
                        <StatCard title="Aguardando Pagamento" value={stats.aguarda_pagamento} Icon={DollarSign} colorClass={colors.yellow} onClick={() => handleCardClick('status', 'aguarda_pagamento')} />
                        <StatCard title="Concluídas" value={stats.concluidas} Icon={CheckCircle} colorClass={colors.green} onClick={() => handleCardClick('status', 'concluida')} />
                    </div>
                </div>
            </div>

            {/* Coluna de Honorários */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Financeiro</h3>
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Target className="text-green-500" />
                            <p className="text-gray-600">Hon. Solicitados</p>
                        </div>
                        <p className="font-bold text-gray-800">R$ {stats.totalHonorariosSolicitados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-blue-500" />
                            <p className="text-gray-600">Hon. Deferidos</p>
                        </div>
                        <p className="font-bold text-gray-800">R$ {stats.totalHonorariosDeferidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="text-yellow-500" />
                            <p className="text-gray-600">A Receber</p>
                        </div>
                        <p className="font-bold text-yellow-700">R$ {stats.honorariosAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DollarSign className="text-purple-500" />
                            <p className="text-gray-600">Já Recebidos</p>
                        </div>
                        <p className="font-bold text-purple-700">R$ {stats.totalHonorariosPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
}
