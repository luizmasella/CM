// FILE: src/App.tsx (APAGUE TUDO E COLE ISTO)

import React from 'react';
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

export default function App() {
  const { 
    activeTab, 
    processDetailView, 
    showForm,
    showDetails,
  } = useUI();
  
  if (processDetailView) {
    return <ProcessDetailPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'pericias' && <PericiasManager />}
        {activeTab === 'calendario' && <CalendarView />}
        {activeTab === 'relatorios' && <RelatoriosPage />}
        {activeTab === 'notificacoes' && <NotificacoesPage />}
      </main>

      {showForm && <PericiaForm />}
      {showDetails && <PericiaDetails />}
    </div>
  );
}
