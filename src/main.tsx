import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PericiasProvider } from './context/PericiasContext.tsx';
import { UIProvider } from './context/UIContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UIProvider>
      <PericiasProvider>
        <App />
      </PericiasProvider>
    </UIProvider>
  </React.StrictMode>
);
