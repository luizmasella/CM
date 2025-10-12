// FILE: src/components/CalendarView.tsx

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import { CalendarDays, ChevronRight, Calendar, AlertTriangle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function CalendarView() {
  const { pericias, periciasAtrasadas, prazos7Dias, prazos15Dias, setFilterDate, setFilterPrazo, setFilterStatus, isPrazoVencido, clearAllFilters } = usePericias();
  const { setActiveTab, openProcessPage } = useUI();
  const { toast } = useToast();
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => { 
    const year = date.getFullYear(); 
    const month = date.getMonth(); 
    const firstDay = new Date(year, month, 1); 
    const lastDay = new Date(year, month + 1, 0); 
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay(), year, month }; 
  };

  const getPericiasForDate = (dateString: string) => pericias.filter(p => p.data === dateString);
  const getPrazosForDate = (dateString: string) => pericias.filter(p => p.prazoLaudo === dateString || p.prazoQuesitos === dateString);
  const formatDateString = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  const isToday = (year: number, month: number, day: number) => {
    const hoje = new Date();
    return hoje.getFullYear() === year && hoje.getMonth() === month && hoje.getDate() === day;
  };
  
  const navigateMonth = (direction: number) => setCurrentMonth(prev => {
    const newDate = new Date(prev);
    newDate.setMonth(prev.getMonth() + direction);
    return newDate;
  });
  
  const goToToday = () => setCurrentMonth(new Date());

  const handleDayClick = (dateString: string) => {
    const periciasNoDia = getPericiasForDate(dateString);
    const prazosNoDia = getPrazosForDate(dateString);
    
    if (periciasNoDia.length === 0 && prazosNoDia.length === 0) {
      toast.info('📅 Nenhuma perícia ou prazo nesta data');
      return;
    }
    
    // CORREÇÃO: Limpa TODOS os filtros antes de aplicar o novo
    clearAllFilters();
    setFilterDate(dateString);
    setActiveTab('pericias');
    
    toast.success(`✅ Filtrando ${periciasNoDia.length + prazosNoDia.length} item(ns) de ${new Date(dateString).toLocaleDateString('pt-BR')}`);
  };
  
  const handlePrazosClick = (tipo: 'vencidos' | '7dias' | '15dias') => {
    // CORREÇÃO: Limpa TODOS os filtros antes de aplicar o novo
    clearAllFilters();
    setFilterPrazo(tipo);
    setActiveTab('pericias');
    
    const quantidade = tipo === 'vencidos' ? periciasAtrasadas.length : tipo === '7dias' ? prazos7Dias.length : prazos15Dias.length;
    const mensagens = {
      'vencidos': `⚠️ Mostrando ${quantidade} perícia(s) com prazos vencidos`,
      '7dias': `⚡ Mostrando ${quantidade} perícia(s) com prazos nos próximos 7 dias`,
      '15dias': `📋 Mostrando ${quantidade} perícia(s) com prazos nos próximos 15 dias`
    };
    
    if (quantidade > 0) {
      toast.warning(mensagens[tipo]);
    } else {
      toast.info('🎉 Nenhum prazo nesta categoria!');
    }
  };

  const periciasNoMes = pericias.filter(p => {
    const dataPericia = new Date(p.data);
    return dataPericia.getMonth() === currentMonth.getMonth() && 
           dataPericia.getFullYear() === currentMonth.getFullYear();
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="text-blue-600" />
            Calendário de Perícias e Prazos
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={goToToday} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Calendar size={18} />
              Hoje
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateMonth(-1)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <h3 className="text-xl font-bold">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            onClick={() => navigateMonth(1)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">{day}</div>
          ))}
          
          {(() => {
            const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
            const days: (number|null)[] = Array(startingDayOfWeek).fill(null);
            for (let i = 1; i <= daysInMonth; i++) { days.push(i); }
            
            return days.map((day, index) => {
              if (day === null) { 
                return <div key={`empty-${index}`} className="aspect-square p-2 bg-gray-50 rounded-lg"></div>; 
              }
              
              const dateString = formatDateString(year, month, day);
              const periciasNoDia = getPericiasForDate(dateString);
              const prazosNoDia = getPrazosForDate(dateString);
              const isHoje = isToday(year, month, day);
              
              const temPrazoVencido = prazosNoDia.some(p => 
                (p.prazoLaudo === dateString && isPrazoVencido(p.prazoLaudo)) ||
                (p.prazoQuesitos === dateString && isPrazoVencido(p.prazoQuesitos))
              );

              return (
                <div 
                  key={day} 
                  onClick={() => handleDayClick(dateString)} 
                  className={`aspect-square p-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    isHoje 
                      ? 'bg-green-100 border-2 border-green-500 ring-2 ring-green-300' 
                      : periciasNoDia.length > 0 || prazosNoDia.length > 0
                      ? 'bg-blue-50 border-2 border-blue-300' 
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{day}</div>
                  <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {periciasNoDia.length > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium text-blue-700">
                          {periciasNoDia.length}
                        </span>
                      </div>
                    )}
                    {prazosNoDia.length > 0 && (
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${temPrazoVencido ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <span className={`text-xs font-medium ${temPrazoVencido ? 'text-red-700' : 'text-yellow-700'}`}>
                          {prazosNoDia.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* CARDS DE RESUMO - AGORA COM 4 COLUNAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PERÍCIAS NO MÊS */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Perícias no Mês
          </h3>
          <div className="mb-3 bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
            <p className="text-3xl font-bold text-blue-700">{periciasNoMes.length}</p>
            <p className="text-sm text-blue-600">agendadas</p>
          </div>
          {periciasNoMes.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {periciasNoMes.slice(0, 3).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => openProcessPage(p)} 
                  className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors border border-blue-200"
                >
                  <p className="font-semibold text-sm">
                    {new Date(p.data).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-700">{p.reclamante}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma perícia</p>
          )}
        </div>

        {/* PRAZOS VENCIDOS */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <XCircle className="text-red-600" />
            Vencidos
          </h3>
          <div className="mb-3 bg-red-50 p-3 rounded-lg border-2 border-red-200">
            <p className="text-3xl font-bold text-red-700">{periciasAtrasadas.length}</p>
            <p className="text-sm text-red-600">atrasados</p>
          </div>
          {periciasAtrasadas.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {periciasAtrasadas.slice(0, 3).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handlePrazosClick('vencidos')}
                  className="p-3 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors border border-red-200 animate-pulse"
                >
                  <p className="font-semibold text-sm text-red-800">{p.numeroProcesso}</p>
                  <p className="text-xs text-red-700">⚠️ Vencido</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum vencido 🎉</p>
          )}
        </div>

        {/* PRAZOS 7 DIAS */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="text-yellow-600" />
            7 Dias
          </h3>
          <div className="mb-3 bg-yellow-50 p-3 rounded-lg border-2 border-yellow-200">
            <p className="text-3xl font-bold text-yellow-700">{prazos7Dias.length}</p>
            <p className="text-sm text-yellow-600">próximos</p>
          </div>
          {prazos7Dias.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {prazos7Dias.slice(0, 3).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handlePrazosClick('7dias')}
                  className="p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 cursor-pointer transition-colors border border-yellow-200"
                >
                  <p className="font-semibold text-sm text-yellow-800">{p.numeroProcesso}</p>
                  <p className="text-xs text-gray-700">
                    {p.prazoLaudo && new Date(p.prazoLaudo).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum prazo 🎉</p>
          )}
        </div>

        {/* PRAZOS 15 DIAS */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertCircle className="text-orange-600" />
            15 Dias
          </h3>
          <div className="mb-3 bg-orange-50 p-3 rounded-lg border-2 border-orange-200">
            <p className="text-3xl font-bold text-orange-700">{prazos15Dias.length}</p>
            <p className="text-sm text-orange-600">próximos</p>
          </div>
          {prazos15Dias.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {prazos15Dias.slice(0, 3).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handlePrazosClick('15dias')}
                  className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer transition-colors border border-orange-200"
                >
                  <p className="font-semibold text-sm text-orange-800">{p.numeroProcesso}</p>
                  <p className="text-xs text-gray-700">
                    {p.prazoLaudo && new Date(p.prazoLaudo).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum prazo 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}
