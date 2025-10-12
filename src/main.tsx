// FILE: src/main.tsx (VERSÃO ATUALIZADA)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { PericiasProvider } from './context/PericiasContext.tsx';
import { UIProvider } from './context/UIContext.tsx'; // <-- 1. Importamos o novo provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Aninhamos os providers. A ordem aqui não importa muito. */}
    <UIProvider>
      <PericiasProvider>
        <App />
      </PericiasProvider>
    </UIProvider>
  </React.StrictMode>
);
