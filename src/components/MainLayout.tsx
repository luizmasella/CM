// src/components/MainLayout.tsx
import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import PericiaForm from './PericiaForm';
import PericiaDetails from './PericiaDetails';
import { AppRoutes } from '../AppRoutes';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

export function MainLayout() {
  const { showForm, showDetails } = useUI();
  const { currentUser } = useAuth();

  // Activate the notification system for the logged-in user.
  useNotifications();

  if (!currentUser) {
    // This should ideally not be reached if PrivateRoute is working,
    // but serves as an extra layer of protection.
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      {showForm && <PericiaForm />}
      {showDetails && <PericiaDetails />}
    </div>
  );
}
