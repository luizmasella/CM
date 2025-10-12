// FILE: src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PericiasProvider } from './context/PericiasContext.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';

// Importação condicional para evitar erro
let RegioesProvider: any;
try {
  const module = await import('./context/RegioesContext.tsx');
  RegioesProvider = module.RegioesProvider;
} catch (error) {
  console.error('Erro ao carregar RegioesContext:', error);
  // Provider fallback
  RegioesProvider = ({ children }: any) => <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RegioesProvider>
        <UIProvider>
          <PericiasProvider>
            <App />
          </PericiasProvider>
        </UIProvider>
      </RegioesProvider>
    </ToastProvider>
  </React.StrictMode>
);
