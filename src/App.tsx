// FILE: src/App.tsx
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
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
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function AuthenticatedApp() {
  const { activeTab, processDetailView, showForm, showDetails } = useUI();

  if (processDetailView) {
    return <ProcessDetailPage />;
  }

  return (
    <Layout>
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <Navbar />
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
        {showForm && <PericiaForm />}
        {showDetails && <PericiaDetails />}
      </div>
    </Layout>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    if (showRegister) {
      return <RegisterPage onNavigateToLogin={() => setShowRegister(false)} />;
    }
    return <LoginPage onNavigateToRegister={() => setShowRegister(true)} />;
  }

  return <AuthenticatedApp />;
}
