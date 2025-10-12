// FILE: src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Importamos nosso novo Provedor de Contexto
import { PericiasProvider } from './context/PericiasContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolvemos o <App /> com o <PericiasProvider> */}
    <PericiasProvider>
      <App />
    </PericiasProvider>
  </React.StrictMode>
);
