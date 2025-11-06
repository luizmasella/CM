// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PrivateRoute } from './components/PrivateRoute';
import { MainLayout } from './components/MainLayout';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { currentUser, loading } = useAuth();

  // Show a global loading indicator while checking auth status
  if (loading && !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Carregando aplicação...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<PrivateRoute />}>
          <Route path="/*" element={<MainLayout />} />
        </Route>
      </Routes>
    </Router>
  );
}
