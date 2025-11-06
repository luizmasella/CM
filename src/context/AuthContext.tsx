// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Credentials, IAuthContext } from '../types';
import { authService } from '../services/authService';
import apiClient from '../services/apiClient';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true para verificar o token inicial
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lógica para verificar o token ao carregar a aplicação
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        // Adiciona o token ao cabeçalho do apiClient para as próximas requisições
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Em um app real, você validaria o token com o backend aqui.
        // Como estamos com um json-server, vamos decodificar o token falso
        // para obter o ID do usuário e buscar seus dados.
        try {
          const userId = parseInt(token.split('-').pop() || '', 10);
          if (userId) {
            const { data: user } = await apiClient.get<User>(`/users/${userId}`);
            if (user) {
              const { password, ...userWithoutPassword } = user;
              setCurrentUser(userWithoutPassword);
            }
          }
        } catch (e) {
          // Se o token for inválido ou o usuário não for encontrado, limpa tudo
          localStorage.removeItem(AUTH_TOKEN_KEY);
          delete apiClient.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: Credentials) => {
    setLoading(true);
    setError(null);
    const response = await authService.login(credentials);
    if (response.success && response.user && response.token) {
      // Login bem-sucedido: armazena o token e atualiza o estado
      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      setCurrentUser(response.user);
    } else {
      setError(response.message);
    }
    setLoading(false);
    return response;
  };

  const register = async (credentials: Credentials) => {
    setLoading(true);
    setError(null);
    const response = await authService.register(credentials);
    if (!response.success) {
      setError(response.message);
    }
    setLoading(false);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    // Limpa o estado e o armazenamento local
    setCurrentUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
