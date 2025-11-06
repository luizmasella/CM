// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await register({ email, password });
    if (response.success) {
      navigate('/login');
    }
  };

  const errorId = 'register-error';

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <main className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Registrar</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              required
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              required
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          {error && (
            <p id={errorId} className="text-sm text-red-600" aria-live="polite">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Já tem uma conta? <Link to="/login" className="text-blue-600 hover:underline">Faça login</Link>
        </p>
      </main>
    </div>
  );
}
