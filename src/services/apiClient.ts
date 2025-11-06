// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // O proxy do Vite irá redirecionar isso para http://localhost:3333
  headers: {
    'Content-Type': 'application/json',
  },
});

// Futuramente, podemos adicionar um interceptador aqui para injetar
// o token de autenticação em todas as requisições.
//
// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('auth_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;
