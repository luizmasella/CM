// src/services/authService.ts
import apiClient from './apiClient';
import { User, Credentials } from '../types';
import bcrypt from 'bcryptjs';

// Função para registrar um novo usuário
async function register(credentials: Credentials): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Verifica se o e-mail já existe
    const { data: existingUsers } = await apiClient.get<User[]>(`/users?email=${credentials.email}`);
    if (existingUsers.length > 0) {
      return { success: false, message: 'Este e-mail já está em uso.' };
    }

    // 2. Hash da senha (simulando uma prática de segurança real)
    // Em um app real, o backend faria isso. Aqui, faremos no cliente para simular.
    const hashedPassword = await bcrypt.hash(credentials.password!, 10);

    // 3. Cria o novo usuário
    const newUser = { email: credentials.email, password: hashedPassword };
    await apiClient.post('/users', newUser);

    return { success: true, message: 'Usuário registrado com sucesso!' };

  } catch (error) {
    console.error('Erro no registro:', error);
    return { success: false, message: 'Ocorreu um erro durante o registro. Tente novamente.' };
  }
}

// Função para logar um usuário
async function login(credentials: Credentials): Promise<{ success: boolean; user?: Omit<User, 'password'>; message: string; token?: string }> {
  try {
    // 1. Busca o usuário pelo e-mail
    const { data: users } = await apiClient.get<User[]>(`/users?email=${credentials.email}`);
    const user = users[0];

    if (!user) {
      return { success: false, message: 'Credenciais inválidas.' };
    }

    // 2. Compara a senha com o hash armazenado
    const isPasswordValid = await bcrypt.compare(credentials.password!, user.password!);

    if (!isPasswordValid) {
      return { success: false, message: 'Credenciais inválidas.' };
    }

    // 3. Simula a criação de um token JWT
    // Em uma aplicação real, o backend geraria e retornaria esse token.
    const token = `fake-jwt-token-for-user-${user.id}`;

    // Remove a senha do objeto de usuário antes de retorná-lo
    const { password, ...userWithoutPassword } = user;

    return { success: true, user: userWithoutPassword, token, message: 'Login bem-sucedido!' };

  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false, message: 'Ocorreu um erro durante o login. Tente novamente.' };
  }
}

// Função para logout
// No nosso caso, o logout será gerenciado no lado do cliente (removendo o token).
// Esta função é um placeholder para uma futura chamada de invalidação de token no backend.
async function logout(): Promise<{ success: boolean }> {
  return Promise.resolve({ success: true });
}

export const authService = {
  register,
  login,
  logout,
};
