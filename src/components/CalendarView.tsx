// FILE: src/components/CalendarView.tsx
import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { CalendarDays, ChevronRight, Calendar, AlertTriangle, XCircle } from 'lucide-react';

export default function CalendarView() {
  const { pericias, periciasAtrasadas } = usePericias();
  const { setActiveTab, openProcessPage } = useUI();
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const isPrazoVencido = (prazo: string | null): boolean => { if (!prazo) return false; const hoje = new Date(); hoje.setHours(0, 0, 0, 0); const [ano, mes, dia] = prazo.split('-').map(Number); return new Date(ano, mes - 1, dia) < hoje; };
  const getDaysInMonth = (date: Date) => { const year = date.getFullYear(); const month = date.getMonth(); const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0); return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay(), year, month }; };
  const getPericiasForDate = (dateString: string) => pericias.filter(p => p.data === dateString);
  const getPrazosForDate = (dateString: string) => pericias.filter(p => p.prazoLaudo === dateString || p.prazoQuesitos === dateString);
  const formatDateString = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isToday = (year: number, month: number, day: number) => new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === day;
  const navigateMonth = (direction: number) => setCurrentMonth(prev => new Date(new Date(prev).setMonth(prev.getMonth() + direction)));
  const goToToday = () => setCurrentMonth(new Date());

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><CalendarDays className="text-blue-600" />Calendário</h2>
        <button onClick={goToToday} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><Calendar size={18} /> Hoje</button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigateMonth(-1)}><ChevronRight className="rotate-180"/></button>
        <h3 className="text-xl font-bold">{currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={() => navigateMonth(1)}><ChevronRight/></button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => <div key={d} className="text-center font-bold text-gray-500">{d}</div>)}
        {(() => {
            const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
            let days = Array(startingDayOfWeek).fill(null);
            for(let i = 1; i <= daysInMonth; i++) { days.push(i); }
            return days.map((day, index) => (
                <div key={index} className={`p-2 h-24 border rounded ${day ? 'bg-white' : 'bg-gray-50'}`}>
                    <span className={`${day && isToday(year, month, day) ? 'bg-blue-600 text-white rounded-full px-2' : ''}`}>{day}</span>
                    {/* ... Lógica para mostrar eventos no dia ... */}
                </div>
            ))
        })()}
      </div>
    </div>
  );
}
