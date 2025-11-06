// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { PericiasProvider } from './context/PericiasContext.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { RegioesProvider } from './context/RegioesContext.tsx';

// Conditionally import and initialize axe-core for accessibility testing
if (import.meta.env.DEV) {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RegioesProvider>
        <UIProvider>
          <AuthProvider>
            <PericiasProvider>
              <App />
            </PericiasProvider>
          </AuthProvider>
        </UIProvider>
      </RegioesProvider>
    </ToastProvider>
  </React.StrictMode>
);
