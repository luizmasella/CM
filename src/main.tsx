// FILE: src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Linha crucial para carregar os estilos

import { PericiasProvider } from './context/PericiasContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PericiasProvider>
      <App />
    </PericiasProvider>
  </React.StrictMode>
);
