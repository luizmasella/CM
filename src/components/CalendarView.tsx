// FILE: src/components/CalendarView.tsx
// ✅ VERSÃO CORRIGIDA - Ícones de prazos maiores e mais visíveis

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import { CalendarDays, ChevronRight, Calendar, AlertTriangle, XCircle, Clock, AlertCircle, FileText, FileQuestion } from 'lucide-react';

export default function CalendarView() {
  const { 
    pericias, 
    periciasAtrasadas, 
    prazos7Dias, 
    prazos15Dias, 
    setFilterDate, 
    setFilterPrazo, 
    clearAllFilters,
    isPrazoVencido,
    getPrazoStatus
  } = usePericias();
  
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
  
  const getPrazosForDate = (dateString: string) => {
    const prazos: Array<{pericia: any, tipo: 'laudo' | 'quesitos', prazo: string}> = [];
    
    pericias.forEach(p => {
      if (p.prazoLaudo === dateString) {
        prazos.push({ pericia: p, tipo: 'laudo', prazo: p.prazoLaudo });
      }
      if (p.prazoQuesitos === dateString) {
        prazos.push({ pericia: p, tipo: 'quesitos', prazo: p.prazoQuesitos });
      }
    });
    
    return prazos;
  };
  
  const formatDateString = (year: number, month: number, day: number) => 
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
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
    
    clearAllFilters();
    setFilterDate(dateString);
    setActiveTab('pericias');
    
    const total = periciasNoDia.length + prazosNoDia.length;
    const msg = [];
    if (periciasNoDia.length > 0) msg.push(`${periciasNoDia.length} perícia(s)`);
    if (prazosNoDia.length > 0) msg.push(`${prazosNoDia.length} prazo(s)`);
    
    toast.success(`✅ ${msg.join(' e ')} em ${new Date(dateString).toLocaleDateString('pt-BR')}`);
  };
  
  const handlePrazosClick = (tipo: 'vencidos' | '7dias' | '15dias') => {
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

        {/* CALENDÁRIO */}
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
              
              // Separa prazos por tipo e status
              const prazosLaudo = prazosNoDia.filter(p => p.tipo === 'laudo');
              const prazosQuesitos = prazosNoDia.filter(p => p.tipo === 'quesitos');
              
              const temPrazoVencido = prazosNoDia.some(p => isPrazoVencido(p.prazo));
              const temConteudo = periciasNoDia.length > 0 || prazosNoDia.length > 0;

              return (
                <div 
                  key={day} 
                  onClick={() => handleDayClick(dateString)} 
                  className={`aspect-square p-2 rounded-lg transition-all ${
                    temConteudo ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                  } ${
                    isHoje 
                      ? 'bg-green-100 border-2 border-green-500 ring-2 ring-green-300' 
                      : temConteudo
                      ? 'bg-blue-50 border-2 border-blue-300' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{day}</div>
                  <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {/* Perícias agendadas */}
                    {periciasNoDia.length > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium text-blue-700">
                          {periciasNoDia.length}
                        </span>
                      </div>
                    )}
                    
                    {/* ✅ CORRIGIDO: Prazos de Laudo com ícones MAIORES (14px) */}
                    {prazosLaudo.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText size={14} className={`${temPrazoVencido ? 'text-red-600 animate-pulse' : 'text-purple-600'}`} />
                        <span className={`text-xs font-medium ${temPrazoVencido ? 'text-red-700' : 'text-purple-700'}`}>
                          L:{prazosLaudo.length}
                        </span>
                      </div>
                    )}
                    
                    {/* ✅ CORRIGIDO: Prazos de Quesitos com ícones MAIORES (14px) */}
                    {prazosQuesitos.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileQuestion size={14} className={`${temPrazoVencido ? 'text-red-600 animate-pulse' : 'text-orange-600'}`} />
                        <span className={`text-xs font-medium ${temPrazoVencido ? 'text-red-700' : 'text-orange-700'}`}>
                          Q:{prazosQuesitos.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* ✅ LEGENDA MELHORADA com ícones maiores */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3">Legenda:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-700"></div>
              <span className="text-gray-700 font-medium">Hoje</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Perícias agendadas</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-purple-600" />
              <span className="text-gray-700">Prazo de Laudo (L)</span>
            </div>
            <div className="flex items-center gap-2">
              <FileQuestion size={16} className="text-orange-600" />
              <span className="text-gray-700">Prazo de Quesitos (Q)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">Prazo vencido</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS DE RESUMO */}
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
              {periciasNoMes.slice(0, 5).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => openProcessPage(p)} 
                  className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors border border-blue-200"
                >
                  <p className="font-semibold text-sm">
                    {new Date(p.data).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-700 truncate">{p.reclamante}</p>
                  <p className="text-xs text-gray-500">{p.numeroProcesso}</p>
                </div>
              ))}
              {periciasNoMes.length > 5 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  + {periciasNoMes.length - 5} perícia(s)
                </p>
              )}
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
              {periciasAtrasadas.slice(0, 5).map(p => {
                const prazoLaudoVencido = p.prazoLaudo && isPrazoVencido(p.prazoLaudo);
                const prazoQuesitosVencido = p.prazoQuesitos && isPrazoVencido(p.prazoQuesitos);
                
                return (
                  <div 
                    key={p.id} 
                    onClick={() => handlePrazosClick('vencidos')}
                    className="p-3 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors border border-red-200 animate-pulse"
                  >
                    <p className="font-semibold text-sm text-red-800">{p.numeroProcesso}</p>
                    <div className="flex flex-col gap-1 mt-1">
                      {prazoLaudoVencido && (
                        <p className="text-xs text-red-700 flex items-center gap-1">
                          <FileText size={12} /> Laudo: {new Date(p.prazoLaudo!).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                      {prazoQuesitosVencido && (
                        <p className="text-xs text-red-700 flex items-center gap-1">
                          <FileQuestion size={12} /> Quesitos: {new Date(p.prazoQuesitos!).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {periciasAtrasadas.length > 5 && (
                <p className="text-xs text-red-600 text-center pt-2 font-medium">
                  + {periciasAtrasadas.length - 5} vencido(s)
                </p>
              )}
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
              {prazos7Dias.slice(0, 5).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handlePrazosClick('7dias')}
                  className="p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 cursor-pointer transition-colors border border-yellow-200"
                >
                  <p className="font-semibold text-sm text-yellow-800">{p.numeroProcesso}</p>
                  <div className="flex flex-col gap-1 mt-1">
                    {p.prazoLaudo && getPrazoStatus(p.prazoLaudo) === '7dias' && (
                      <p className="text-xs text-gray-700 flex items-center gap-1">
                        <FileText size={12} /> {new Date(p.prazoLaudo).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    {p.prazoQuesitos && getPrazoStatus(p.prazoQuesitos) === '7dias' && (
                      <p className="text-xs text-gray-700 flex items-center gap-1">
                        <FileQuestion size={12} /> {new Date(p.prazoQuesitos).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {prazos7Dias.length > 5 && (
                <p className="text-xs text-yellow-600 text-center pt-2">
                  + {prazos7Dias.length - 5} prazo(s)
                </p>
              )}
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
              {prazos15Dias.slice(0, 5).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handlePrazosClick('15dias')}
                  className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer transition-colors border border-orange-200"
                >
                  <p className="font-semibold text-sm text-orange-800">{p.numeroProcesso}</p>
                  <div className="flex flex-col gap-1 mt-1">
                    {p.prazoLaudo && getPrazoStatus(p.prazoLaudo) === '15dias' && (
                      <p className="text-xs text-gray-700 flex items-center gap-1">
                        <FileText size={12} /> {new Date(p.prazoLaudo).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    {p.prazoQuesitos && getPrazoStatus(p.prazoQuesitos) === '15dias' && (
                      <p className="text-xs text-gray-700 flex items-center gap-1">
                        <FileQuestion size={12} /> {new Date(p.prazoQuesitos).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {prazos15Dias.length > 5 && (
                <p className="text-xs text-orange-600 text-center pt-2">
                  + {prazos15Dias.length - 5} prazo(s)
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum prazo 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}
