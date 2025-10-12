// FILE: src/App.tsx (VERSÃO FINAL COM NOTIFICAÇÕES CORRIGIDAS)

import React from 'react';
import { usePericias } from './context/PericiasContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PericiasManager from './components/PericiasManager';
import CalendarView from './components/CalendarView';
import PericiaForm from './components/PericiaForm';
import PericiaDetails from './components/PericiaDetails';
import ProcessDetailPage from './components/ProcessDetailPage';
import RelatoriosPage from './components/RelatoriosPage';
import NotificacoesPage from './components/NotificacoesPage';
import { Clock, FileText, FileQuestion, Gavel, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [showDetails, setShowDetails] = React.useState(false);
  const [selectedPericia, setSelectedPericia] = React.useState<any | null>(null);
  const [processDetailView, setProcessDetailView] = React.useState(false);
  const [currentPericia, setCurrentPericia] = React.useState<any | null>(null);

  const { 
    pericias, 
    updatePericia,
    filteredPericias, 
    stats, 
    periciasAtrasadas,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  } = usePericias();
  
  const [tiposPericia] = React.useState(['Médica', 'Psiquiátrica', 'Ortopédica', 'Cardiológica', 'Neurológica']);
  const [regioesList] = React.useState(['TRT 2ª Região - SP', 'TRT 15ª Região - Campinas', 'TJ-SP']);
  const statusConfig = {
    aguarda_ato_pericial: { label: 'Aguardando Ato Pericial', color: 'bg-blue-100 text-blue-800', icon: Clock },
    aguarda_laudo: { label: 'Aguardando Laudo', color: 'bg-purple-100 text-purple-800', icon: FileText },
    aguarda_quesitos: { label: 'Aguardando Quesitos Complementares', color: 'bg-orange-100 text-orange-800', icon: FileQuestion },
    aguarda_sentenca: { label: 'Aguardando Sentença', color: 'bg-indigo-100 text-indigo-800', icon: Gavel },
    aguarda_pagamento: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800', icon: DollarSign },
    concluida: { label: 'Concluída', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle },
    recusada: { label: 'Recusada', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
  };

  // 1. FUNÇÃO isPrazoVencido CORRIGIDA PARA EVITAR PROBLEMAS DE FUSO HORÁRIO
  const isPrazoVencido = (prazo: string | null): boolean => {
    if (!prazo) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora de hoje para comparar apenas a data
    
    // Converte a string 'YYYY-MM-DD' para uma data local segura
    const [ano, mes, dia] = prazo.split('-').map(Number);
    const dataPrazo = new Date(ano, mes - 1, dia);
    
    return dataPrazo < hoje;
  };

  const diasAtraso = (prazo: string | null): number => { if (!prazo) return 0; const hoje = new Date(); hoje.setHours(0, 0, 0, 0); const [ano, mes, dia] = prazo.split('-').map(Number); const dataPrazo = new Date(ano, mes - 1, dia); const diffTime = hoje.getTime() - dataPrazo.getTime(); const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); return diffDays > 0 ? diffDays : 0; };
  
  const handleEdit = (pericia: any) => { setEditingId(pericia.id); setShowForm(true); };
  const handleShowNewForm = () => { setEditingId(null); setShowForm(true); };
  const handleCardClick = (filterType: string, value: string | null) => { 
    if (filterType === 'status') { setFilterStatus(value || 'todos'); }
    if (filterType === 'prazos_vencidos') { /* Lógica de filtro de prazo pode ser adicionada no contexto */ }
    setActiveTab('pericias'); 
  };
  const handleViewDetails = (pericia: any) => { setSelectedPericia(pericia); setShowDetails(true); };
  const openProcessPage = (pericia: any) => { setCurrentPericia(pericia); setProcessDetailView(true); };
  const closeProcessPage = () => { setProcessDetailView(false); setCurrentPericia(null); };
  const handleSaveDetails = (updatedData: any) => { updatePericia(updatedData); setSelectedPericia(updatedData); };
  const exportarRelatorio = () => alert('Exportando...');
  
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  
  // 2. useEffect CORRIGIDO PARA GERAR TODAS AS NOTIFICAÇÕES
  React.useEffect(() => {
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const novasNotificacoes: any[] = [];
    let notificationId = 1;

    pericias.forEach((pericia) => {
        // Notificação para prazo de laudo vencido
        if(pericia.prazoLaudo && isPrazoVencido(pericia.prazoLaudo)) {
            novasNotificacoes.push({ id: notificationId++, tipo: 'prazo_vencido', titulo: '🔴 Prazo de Laudo Vencido!', mensagem: `Processo ${pericia.numeroProcesso}`, pericia, data: new Date().toISOString(), lida: false, prioridade: 'urgente' });
        }
        // Notificação para prazo de quesitos vencido
        if(pericia.prazoQuesitos && isPrazoVencido(pericia.prazoQuesitos)) {
            novasNotificacoes.push({ id: notificationId++, tipo: 'prazo_vencido', titulo: '🔴 Prazo de Quesitos Vencido!', mensagem: `Processo ${pericia.numeroProcesso}`, pericia, data: new Date().toISOString(), lida: false, prioridade: 'urgente' });
        }
    });
    setNotifications(novasNotificacoes);
  }, [pericias]); // A dependência está correta

  const notificacoesNaoLidas = notifications.filter(n => !n.lida).length;
  const marcarComoLida = (id: number) => setNotifications(notifs => notifs.map(n => n.id === id ? { ...n, lida: true } : n));
  const marcarTodasComoLidas = () => setNotifications(notifs => notifs.map(n => ({ ...n, lida: true })));
  const limparNotificacoes = () => setNotifications(notifs => notifs.filter(n => !n.lida));
  const abrirPericiaNotificacao = (notificacao: any) => { openProcessPage(notificacao.pericia); marcarComoLida(notificacao.id); };
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const navigateMonth = (direction: number) => setCurrentMonth(prev => new Date(new Date(prev).setMonth(prev.getMonth() + direction)));
  const goToToday = () => setCurrentMonth(new Date());
  const getDaysInMonth = (date: Date) => { const year = date.getFullYear(); const month = date.getMonth(); const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0); return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay(), year, month }; };
  const getPericiasForDate = (dateString: string) => pericias.filter(p => p.data === dateString);
  const getPrazosForDate = (dateString: string) => pericias.filter(p => p.prazoLaudo === dateString || p.prazoQuesitos === dateString);
  const formatDateString = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isToday = (year: number, month: number, day: number) => new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === day;

  if (processDetailView && currentPericia) {
    return ( <ProcessDetailPage currentPericia={currentPericia} closeProcessPage={closeProcessPage} statusConfig={statusConfig} tiposPericia={tiposPericia} regioesList={regioesList} isPrazoVencido={isPrazoVencido} diasAtraso={diasAtraso}/> )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header periciasAtrasadas={periciasAtrasadas} notificacoesNaoLidas={notificacoesNaoLidas} showNotifications={showNotifications} notifications={notifications} handleCardClick={handleCardClick} setShowNotifications={setShowNotifications} abrirPericiaNotificacao={abrirPericiaNotificacao} marcarTodasComoLidas={marcarTodasComoLidas} limparNotificacoes={limparNotificacoes} marcarComoLida={marcarComoLida}/>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} periciasAtrasadas={periciasAtrasadas} notificacoesNaoLidas={notificacoesNaoLidas}/>
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard stats={stats} periciasAtrasadas={periciasAtrasadas} handleCardClick={handleCardClick}/>}
        {activeTab === 'pericias' && <PericiasManager filteredPericias={filteredPericias} pericias={pericias} statusConfig={statusConfig} exportarRelatorio={exportarRelatorio} handleShowNewForm={handleShowNewForm} handleViewDetails={handleViewDetails} openProcessPage={openProcessPage} handleEdit={handleEdit} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus}/>}
        {activeTab === 'calendario' && <CalendarView currentMonth={currentMonth} pericias={pericias} periciasAtrasadas={periciasAtrasadas} navigateMonth={navigateMonth} goToToday={goToToday} getDaysInMonth={getDaysInMonth} formatDateString={formatDateString} getPericiasForDate={getPericiasForDate} getPrazosForDate={getPrazosForDate} isToday={isToday} isPrazoVencido={isPrazoVencido} diasAtraso={diasAtraso} setSelectedDate={() => {}} setFilterDate={() => {}} setActiveTab={setActiveTab} openProcessPage={openProcessPage}/>}
        {activeTab === 'relatorios' && <RelatoriosPage stats={stats} exportarRelatorio={exportarRelatorio}/>}
        {activeTab === 'notificacoes' && <NotificacoesPage notifications={notifications} notificacoesNaoLidas={notificacoesNaoLidas} marcarTodasComoLidas={marcarTodasComoLidas} limparNotificacoes={limparNotificacoes} abrirPericiaNotificacao={abrirPericiaNotificacao} marcarComoLida={marcarComoLida}/>}
      </main>
      {showForm && <PericiaForm setShowForm={setShowForm} editingId={editingId} setEditingId={setEditingId}/>}
      <PericiaDetails showDetails={showDetails} selectedPericia={selectedPericia} setShowDetails={setShowDetails} setSelectedPericia={setSelectedPericia} statusConfig={statusConfig} tiposPericia={tiposPericia} isPrazoVencido={isPrazoVencido} diasAtraso={diasAtraso} handleSaveDetails={handleSaveDetails}/>
    </div>
  );
}
