// ✅ VERSÃO MELHORADA - Lógica mais clara e organizada

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
import Layout from './components/Layout';
import ConfiguracaoPage from './components/ConfiguracaoPage';
import CadastroPage from './components/CadastroPage';
import TrocarSenhaPage from './components/TrocarSenhaPage';

export default function App() {
  const { activeTab, processDetailView, showForm, showDetails } = useUI();

  // ✅ CORRIGIDO: Se está na página de detalhes completos, renderiza apenas ela
  if (processDetailView) {
    return <ProcessDetailPage />;
  }

  // ✅ Renderização do layout principal
  return (
    <Layout>
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header fixo no topo */}
        <Header />

        {/* Navbar com abas */}
        <Navbar />

        {/* Conteúdo principal baseado na aba ativa */}
        <main className="container mx-auto px-4 py-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'pericias' && <PericiasManager />}
          {activeTab === 'calendario' && <CalendarView />}
          {activeTab === 'relatorios' && <RelatoriosPage />}
          {activeTab === 'notificacoes' && <NotificacoesPage />}
          {activeTab === 'config' && <ConfiguracaoPage />}
          {activeTab === 'cadastro' && <CadastroPage />}
          {activeTab === 'trocar-senha' && <TrocarSenhaPage />}
        </main>

        {/* ✅ Modais sobrepostos (renderizam apenas quando necessário) */}
        {showForm && <PericiaForm />}
        {showDetails && <PericiaDetails />}
      </div>
    </Layout>
  );
}
