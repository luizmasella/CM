// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PericiasManager from './components/PericiasManager';
import CalendarView from './components/CalendarView';
import RelatoriosPage from './components/RelatoriosPage';
import NotificacoesPage from './components/NotificacoesPage';
import ProcessDetailPage from './components/ProcessDetailPage';
import { useUI } from './context/UIContext';

export function AppRoutes() {
  const { processDetailView } = useUI();

  // This logic is kept to handle the specific case of the process detail view,
  // which takes over the full screen. A more advanced routing setup could
  // handle this with nested routes.
  if (processDetailView) {
    return <ProcessDetailPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pericias" element={<PericiasManager />} />
      <Route path="/calendario" element={<CalendarView />} />
      <Route path="/relatorios" element={<RelatoriosPage />} />
      <Route path="/notificacoes" element={<NotificacoesPage />} />
    </Routes>
  );
}
