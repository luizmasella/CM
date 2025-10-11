// FILE: src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 1. Importe o nosso novo Provedor de Contexto
import { PericiasProvider } from "./context/PericiasContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 2. Envolva o <App /> com o <PericiasProvider> */}
    <PericiasProvider>
      <App />
    </PericiasProvider>
  </React.StrictMode>
);
