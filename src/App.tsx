import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PericiasManager from './components/PericiasManager';
import CalendarView from './components/CalendarView';
import RelatoriosPage from './components/RelatoriosPage';
import NotificacoesPage from './components/NotificacoesPage';
import { useUI } from './context/UIContext';
import PericiaForm from './components/PericiaForm';
import PericiaDetails from './components/PericiaDetails';
import ProcessDetailPage from './components/ProcessDetailPage';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const MainLayout = () => {
  const { activeTab, processDetailView, showForm, showDetails } = useUI();

  if (processDetailView) {
    return <ProcessDetailPage />;
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
};

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
