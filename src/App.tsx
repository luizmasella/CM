// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PrivateRoute } from './components/PrivateRoute';
import { MainLayout } from './components/MainLayout';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { loading } = useAuth();

  // Mostra um indicador de carregamento global enquanto o estado de autenticação é verificado
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Carregando aplicação...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rota Privada para o Layout Principal */}
        <Route path="/*" element={<PrivateRoute />}>
          {/* O `path` aqui continua de onde o PrivateRoute parou */}
          <Route path="dashboard/*" element={<MainLayout />} />
          <Route path="pericias/*" element={<MainLayout />} />
          <Route path="calendario/*" element={<MainLayout />} />
          <Route path="relatorios/*" element={<MainLayout />} />
          <Route path="notificacoes/*" element={<MainLayout />} />
        </Route>
      </Routes>
    </Router>
  );
}
