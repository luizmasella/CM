// src/context/RegioesContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface RegioesContextType {
  regioes: string[];
  addRegiao: (regiao: string) => void;
}

const RegioesContext = createContext<RegioesContextType | undefined>(undefined);

const REGIOES_PADRAO = [
  'TRT 1ª Região - RJ',
  'TRT 2ª Região - SP',
  'TRT 3ª Região - MG',
  // ... suas regiões padrão
];

export function RegioesProvider({ children }: { children: ReactNode }) {
  const [regioes, setRegioes] = useState<string[]>(() => {
    const stored = localStorage.getItem('regioes');
    return stored ? JSON.parse(stored) : REGIOES_PADRAO;
  });

  useEffect(() => {
    localStorage.setItem('regioes', JSON.stringify(regioes));
  }, [regioes]);

  const addRegiao = (novaRegiao: string) => {
    const regiaoTrimmed = novaRegiao.trim();
    if (!regiaoTrimmed) return;
    
    const jaExiste = regioes.some(
      r => r.toLowerCase() === regiaoTrimmed.toLowerCase()
    );
    
    if (!jaExiste) {
      setRegioes(prev => [...prev, regiaoTrimmed].sort());
    }
  };

  return (
    <RegioesContext.Provider value={{ regioes, addRegiao }}>
      {children}
    </RegioesContext.Provider>
  );
}

export function useRegioes() {
  const context = useContext(RegioesContext);
  if (!context) throw new Error('useRegioes must be used within RegioesProvider');
  return context;
}
