// FILE: src/components/CalendarView.tsx

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { CalendarDays, ChevronRight, Calendar, AlertTriangle, XCircle } from 'lucide-react';

export default function CalendarView() {
  const { pericias, periciasAtrasadas, setFilterDate, setFilterPrazo, isPrazoVencido } = usePericias();
  const { setActiveTab, openProcessPage } = useUI();
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => { const year = date.getFullYear(); const month = date.getMonth(); const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0); return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay(), year, month }; };
  const getPericiasForDate = (dateString: string) => pericias.filter(p => p.data === dateString);
  const getPrazosForDate = (dateString: string) => pericias.filter(p => p.prazoLaudo === dateString || p.prazoQuesitos === dateString);
  const formatDateString = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isToday = (year: number, month: number, day: number) => new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === day;
  const navigateMonth = (direction: number) => setCurrentMonth(prev => new Date(new Date(prev).setMonth(prev.getMonth() + direction)));
  const goToToday = () => setCurrentMonth(new Date());

  const handleDayClick = (dateString: string) => {
    setFilterDate(dateString);
    setActiveTab('pericias');
  };
  
  const handlePrazosVencidosClick = () => {
    setFilterPrazo('vencidos');
    setActiveTab('pericias');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><CalendarDays className="text-blue-600" />Calendário de Perícias e Prazos</h2>
          <div className="flex gap-2"><button onClick={goToToday} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"><Calendar size={18} />Hoje</button></div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={24} className="rotate-180" /></button>
          <h3 className="text-xl font-bold">{currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={24} /></button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day} className="text-center font-bold text-gray-600 py-2">{day}</div>)}
          {(() => {
            const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
            const days: (number|null)[] = Array(startingDayOfWeek).fill(null);
            for (let i = 1; i <= daysInMonth; i++) { days.push(i); }
            return days.map((day, index) => {
              if (day === null) { return <div key={`empty-${index}`} className="aspect-square p-2 bg-gray-50 rounded-lg"></div>; }
              const dateString = formatDateString(year, month, day);
              const periciasNoDia = getPericiasForDate(dateString);
              const prazosNoDia = getPrazosForDate(dateString);
              const isHoje = isToday(year, month, day);
              const temPrazoVencido = prazosNoDia.some(p => isPrazoVencido(dateString));
              return (
                <div key={day} onClick={() => handleDayClick(dateString)} className={`aspect-square p-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${isHoje ? 'bg-green-100 border-2 border-green-500' : periciasNoDia.length > 0 ? 'bg-blue-50 border-2 border-blue-300' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
                  <div className="text-sm font-semibold mb-1">{day}</div>
                  <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {periciasNoDia.length > 0 && <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span className="text-xs font-medium text-blue-700">{periciasNoDia.length} perícia{periciasNoDia.length > 1 ? 's' : ''}</span></div>}
                    {prazosNoDia.length > 0 && <div className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${temPrazoVencido ? 'bg-red-500' : 'bg-yellow-500'}`}></div><span className={`text-xs font-medium ${temPrazoVencido ? 'text-red-700' : 'text-yellow-700'}`}>{prazosNoDia.length} prazo{prazosNoDia.length > 1 ? 's' : ''}</span></div>}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Calendar className="text-blue-600" />Perícias no Mês</h3>
          {pericias.filter(p => new Date(p.data).getMonth() === currentMonth.getMonth()).slice(0,5).map(p => <div key={p.id} onClick={() => openProcessPage(p)} className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"><p className="font-semibold text-sm">{new Date(p.data).toLocaleDateString('pt-BR')}</p><p className="text-xs">{p.reclamante}</p></div>) }
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle className="text-yellow-600" />Prazos Próximos</h3>
          <p className="text-gray-500 text-sm">Nenhum prazo nos próximos 7 dias.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><XCircle className="text-red-600" />Prazos Vencidos</h3>
          {periciasAtrasadas.length > 0 ? periciasAtrasadas.slice(0,5).map(p => <div key={p.id} onClick={handlePrazosVencidosClick} className="p-3 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer"><p className="font-semibold text-sm text-red-800">{p.numeroProcesso}</p></div>) : <p className="text-gray-500 text-sm">Nenhum prazo vencido!</p>}
        </div>
      </div>
    </div>
  );
}
