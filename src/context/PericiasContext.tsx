// src/context/PericiasContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Pericia, IPericiasContext } from '../types';
import { usePericiasState } from '../hooks/usePericiasState';
import { useDerivedPericiasData, getPrazoStatus } from '../hooks/useDerivedPericiasData';
import { errorHandler, ErrorCategory, ErrorSeverity } from '../utils/errorHandler';

const PericiasContext = createContext<IPericiasContext | undefined>(undefined);

export function PericiasProvider({ children }: { children: ReactNode }) {
  const { pericias, setPericias } = usePericiasState();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDate, setFilterDate] = useState('');
  const [filterPrazo, setFilterPrazo] = useState('todos');

  const {
    stats,
    filteredPericias,
    periciasAtrasadas,
    prazos7Dias,
    prazos15Dias,
    isPrazoVencido,
  } = useDerivedPericiasData(pericias, searchTerm, filterStatus, filterDate, filterPrazo);

  const addPericia = (novaPericia: Omit<Pericia, 'id'>): boolean => {
    try {
      if (!novaPericia.numeroProcesso || novaPericia.numeroProcesso.trim() === '') {
        throw new Error('Número do processo é obrigatório.');
      }
      const newId = pericias.length > 0 ? Math.max(...pericias.map(p => p.id)) + 1 : 1;
      const periciaComHistorico = {
        ...novaPericia,
        id: newId,
        historico: [{ data: new Date().toISOString(), acao: 'Perícia cadastrada' }],
      };
      setPericias(prev => [...prev, periciaComHistorico]);
      return true;
    } catch (error) {
      errorHandler.logError(ErrorCategory.PROCESSING, ErrorSeverity.HIGH, 'AddPericia', error);
      return false;
    }
  };

  const updatePericia = (periciaAtualizada: Pericia): boolean => {
    try {
      if (!periciaAtualizada.id) throw new Error('ID da perícia obrigatório');
      
      const periciaComHistorico = {
        ...periciaAtualizada,
        historico: [
          ...(periciaAtualizada.historico || []),
          { data: new Date().toISOString(), acao: 'Perícia atualizada' }
        ]
      };

      setPericias(prev => prev.map(p => (p.id === periciaAtualizada.id ? periciaComHistorico : p)));
      return true;
    } catch (error) {
      errorHandler.logError(ErrorCategory.PROCESSING, ErrorSeverity.HIGH, 'UpdatePericia', error);
      return false;
    }
  };
  
  const deletePericia = (id: number): boolean => {
    try {
      if (!id) throw new Error('ID inválido para exclusão');
      setPericias(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      errorHandler.logError(ErrorCategory.USER_ACTION, ErrorSeverity.HIGH, 'DeletePericia', error);
      return false;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterStatus('todos');
    setFilterDate('');
    setFilterPrazo('todos');
  };

  const exportData = (): string | null => {
    try {
      return JSON.stringify(pericias, null, 2);
    } catch (error) {
      errorHandler.logError(ErrorCategory.PROCESSING, ErrorSeverity.MEDIUM, 'ExportData', error);
      return null;
    }
  };

  const importData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data)) throw new Error('Formato de importação inválido');
      setPericias(data);
      return true;
    } catch (error) {
      errorHandler.logError(ErrorCategory.PROCESSING, ErrorSeverity.HIGH, 'ImportData', error);
      return false;
    }
  };

  const clearAllData = (): boolean => {
    try {
      setPericias([]);
      return true;
    } catch (error) {
      errorHandler.logError(ErrorCategory.STORAGE, ErrorSeverity.CRITICAL, 'ClearAllData', error);
      return false;
    }
  };

  const value = useMemo(() => ({
    pericias,
    addPericia,
    updatePericia,
    deletePericia,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    filterPrazo,
    setFilterPrazo,
    filteredPericias,
    stats,
    periciasAtrasadas,
    prazos7Dias,
    prazos15Dias,
    isPrazoVencido,
    getPrazoStatus, // A função agora é importada diretamente do hook de dados derivados
    clearAllFilters,
    exportData,
    importData,
    clearAllData,
  }), [pericias, searchTerm, filterStatus, filterDate, filterPrazo, filteredPericias, stats, periciasAtrasadas, prazos7Dias, prazos15Dias]);

  return <PericiasContext.Provider value={value}>{children}</PericiasContext.Provider>;
}

export function usePericias() {
  const context = useContext(PericiasContext);
  if (!context) {
    throw new Error('usePericias must be used within a PericiasProvider');
  }
  return context;
}
