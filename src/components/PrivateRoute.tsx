// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute() {
  const { currentUser } = useAuth();

  // Se o usuário não estiver logado, redireciona para a HomePage
  return currentUser ? <Outlet /> : <Navigate to="/" />;
}
