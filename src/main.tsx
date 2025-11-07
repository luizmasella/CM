// FILE: src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PericiasProvider } from './context/PericiasContext.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { RegioesProvider } from './context/RegioesContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RegioesProvider>
        <AuthProvider>
          <UIProvider>
            <PericiasProvider>
              <App />
            </PericiasProvider>
          </UIProvider>
        </AuthProvider>
      </RegioesProvider>
    </ToastProvider>
  </React.StrictMode>
);
