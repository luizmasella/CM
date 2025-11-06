// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, LogIn, UserPlus } from 'lucide-react';

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <main className="text-center p-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Activity size={48} className="text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">
            Sistema de Perícias Médicas
          </h1>
        </div>
        <p className="max-w-xl mx-auto text-lg text-gray-600 mb-10">
          Bem-vindo! Gerencie suas perícias judiciais de forma eficiente, organizada e segura. Acesse sua conta ou registre-se para começar.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="flex items-center gap-2 px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            <LogIn size={20} />
            Fazer Login
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 px-8 py-3 font-semibold text-gray-800 bg-white border-2 border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            <UserPlus size={20} />
            Registrar
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Sistema de Perícias Médicas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
