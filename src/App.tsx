// FILE: src/App.tsx (A VERSÃO MAIS LIMPA DE TODAS)

import React from 'react';
import { usePericias } from './context/PericiasContext';
import { useUI } from './context/UIContext'; // Importa nosso novo hook de UI

// Nossos Componentes
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

// Dados de Configuração (poderiam ir para um arquivo separado no futuro)
import { statusConfig, tiposPericia, regioesList } from './config/constants';

export default function App() {
  // Pegando o estado da UI do UIContext
  const { 
    activeTab, 
    processDetailView, 
    currentPericia, 
    closeProcessPage,
    showForm,
    showDetails,
  } = useUI();
  
  // Pegando o estado dos dados do PericiasContext
  const { pericias, stats, periciasAtrasadas } = usePericias();

  // Funções e dados que ainda são necessários no nível do App
  const isPrazoVencido = (prazo: string | null): boolean => { /* ... */ return false; }; // Simplificado
  const diasAtraso = (prazo: string | null): number => { /* ... */ return 0; };
  const exportarRelatorio = () => alert('Exportando...');

  // Lógica de Notificações (ainda vive aqui por enquanto)
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const notificacoesNaoLidas = 0;
  
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
        {activeTab === 'calendario' && <CalendarView pericias={pericias} periciasAtrasadas={periciasAtrasadas} isPrazoVencido={isPrazoVencido} diasAtraso={diasAtraso} />}
        {activeTab === 'relatorios' && <RelatoriosPage stats={stats} exportarRelatorio={exportarRelatorio} />}
        {activeTab === 'notificacoes' && <NotificacoesPage notifications={notifications} notificacoesNaoLidas={notificacoesNaoLidas} />}
      </main>

      {showForm && <PericiaForm />}
      {showDetails && <PericiaDetails statusConfig={statusConfig} tiposPericia={tiposPericia} isPrazoVencido={isPrazoVencido} diasAtraso={diasAtraso} />}
    </div>
  );
}
