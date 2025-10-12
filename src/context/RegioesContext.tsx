// FILE: src/context/RegioesContext.tsx
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
  'TRT 4ª Região - RS',
  'TRT 5ª Região - BA',
  'TRT 15ª Região - Campinas',
  'TJ-SP',
  'TJ-RJ',
  'TJ-MG',
];

export function RegioesProvider({ children }: { children: ReactNode }) {
  const [regioes, setRegioes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('regioes');
      return stored ? JSON.parse(stored) : REGIOES_PADRAO;
    } catch {
      return REGIOES_PADRAO;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('regioes', JSON.stringify(regioes));
    } catch (error) {
      console.error('Erro ao salvar regiões:', error);
    }
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
  if (!context) {
    throw new Error('useRegioes must be used within RegioesProvider');
  }
  return context;
}
