import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Bem-vindo ao Sistema de Gestão de Perícias</h1>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Login
        </Link>
        <Link to="/register" className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">
          Registrar
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
