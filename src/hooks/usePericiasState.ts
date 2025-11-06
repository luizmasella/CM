// src/hooks/usePericiasState.ts
import { useState, useEffect } from 'react';
import { Pericia } from '../types';
import { periciasIniciais } from '../config/initialData';
import { errorHandler, ErrorCategory, ErrorSeverity, safeExecute } from '../utils/errorHandler';

const STORAGE_KEY = 'pericias_medicas_data';

export function usePericiasState() {
  const [pericias, setPericias] = useState<Pericia[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.STORAGE,
        ErrorSeverity.HIGH,
        'InitialLoad',
        error,
        'Erro ao carregar dados. Usando dados iniciais.'
      );
      return periciasIniciais;
    }
  });

  useEffect(() => {
    const saveData = async () => {
      await safeExecute(
        () => {
          const dataToSave = JSON.stringify(pericias);
          if (dataToSave.length > 5000000) { // 5MB limit
            throw new Error('Dados muito grandes (>5MB)');
          }
          localStorage.setItem(STORAGE_KEY, dataToSave);
          return true;
        },
        'AutoSave',
        ErrorCategory.STORAGE,
        ErrorSeverity.MEDIUM
      );
    };
    saveData();
  }, [pericias]);

  return { pericias, setPericias };
}
