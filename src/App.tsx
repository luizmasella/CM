// FILE: src/App.tsx

import React from 'react';
import { usePericias } from './context/PericiasContext';
import { useUI } from './context/UIContext';

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

import { statusConfig, tiposPericia, regioesList } from './config/constants';

export default function App() {
  const { 
    activeTab, 
    processDetailView, 
    currentPericia, 
    closeProcessPage,
    showForm,
    showDetails,
  } = useUI();
  
  const { 
    pericias, 
    updatePericia,
    filteredPericias, 
    stats, 
    periciasAtrasadas,
  } = usePericias();

  const isPrazoVencido = (prazo: string | null): boolean => { 
    if (!prazo) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const [ano, mes, dia] = prazo.split('-').map(Number);
    const dataPrazo = new Date(ano, mes - 1, dia);
    return dataPrazo < hoje;
  };
  const diasAtraso = (prazo: string | null): number => { 
    if (!prazo) return 0;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const [ano, mes, dia] = prazo.split('-').map(Number);
    const dataPrazo = new Date(ano, mes - 1, dia);
    const diffTime = hoje.getTime() - dataPrazo.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const exportarRelatorio = () => alert('Exportando...');

  const [notifications, setNotifications] = React.useState<any[]>([]);
  
  if (processDetailView && currentPericia) {
    return (
      <ProcessDetailPage 
        isPrazoVencido={isPrazoVencido}
        diasAtraso={diasAtraso}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header notifications={notifications} />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'pericias' && <PericiasManager statusConfig={statusConfig} exportarRelatorio={exportarRelatorio} />}
        {activeTab === 'calendario' && <CalendarView isPrazoVencido={isPrazoVencido} diasAtraso={diasAtraso} />}
        {activeTab === 'relatorios' && <RelatoriosPage stats={stats} exportarRelatorio={exportarRelatorio} />}
        {activeTab === 'notificacoes' && <NotificacoesPage notifications={notifications} />}
      </main>

      {showForm && <PericiaForm />}
      {showDetails && <PericiaDetails statusConfig={statusConfig} tiposPericia={tiposPericia} isPrazoVencido={isPrazoVencido} diasAtraso={diasAtraso} />}
    </div>
  );
}
