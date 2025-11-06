// src/hooks/usePericiasState.ts
import { useState } from 'react';
import { Pericia } from '../types';

/**
 * Um hook simplificado para gerenciar o estado local das perícias dentro do PericiasContext.
 * A lógica de busca de dados foi movida para o próprio contexto para melhor encapsulamento.
 */
export function usePericiasState() {
  const [pericias, setPericias] = useState<Pericia[]>([]);
  const [isLoading, setIsLoading] = useState(true); // O carregamento inicial é gerenciado pelo contexto
  const [error, setError] = useState<string | null>(null);

  return {
    pericias,
    setPericias,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
}
