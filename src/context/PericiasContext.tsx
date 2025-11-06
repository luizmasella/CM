// src/context/PericiasContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Pericia, IPericiasContext } from '../types';
import { usePericiasState } from '../hooks/usePericiasState';
import { useDerivedPericiasData } from '../hooks/useDerivedPericiasData';
import { periciaService } from '../services/periciaService';
import { useAuth } from './AuthContext';
import { errorHandler, ErrorCategory, ErrorSeverity } from '../utils/errorHandler';

const PericiasContext = createContext<IPericiasContext | undefined>(undefined);

export function PericiasProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const {
    pericias,
    setPericias,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = usePericiasState();

  // Efeito para buscar os dados da API quando o usuário muda
  useEffect(() => {
    if (currentUser) {
      const fetchPericias = async () => {
        try {
          setIsLoading(true);
          const userPericias = await periciaService.getPericias(currentUser.id);
          setPericias(userPericias);
          setError(null);
        } catch (e) {
          setError('Falha ao carregar as perícias.');
          errorHandler.logError(ErrorCategory.API, ErrorSeverity.CRITICAL, 'FetchPericias', e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPericias();
    } else {
      // Limpa os dados se o usuário fizer logout
      setPericias([]);
    }
  }, [currentUser, setPericias, setIsLoading, setError]);

  // Derivação de dados (filtros, estatísticas)
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
    getPrazoStatus,
  } = useDerivedPericiasData(pericias, searchTerm, filterStatus, filterDate, filterPrazo);

  // Funções CRUD que interagem com a API
  const addPericia = async (novaPericia: Omit<Pericia, 'id' | 'userId'>): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const periciaComHistorico = {
        ...novaPericia,
        historico: [{ data: new Date().toISOString(), acao: 'Perícia cadastrada' }],
      };
      const novaPericiaDaApi = await periciaService.createPericia(periciaComHistorico, currentUser.id);
      setPericias(prev => [...prev, novaPericiaDaApi]);
      return true;
    } catch (e) {
      errorHandler.logError(ErrorCategory.API, ErrorSeverity.HIGH, 'AddPericia', e);
      return false;
    }
  };

  const updatePericia = async (periciaAtualizada: Pericia): Promise<boolean> => {
    try {
      const periciaComHistorico = {
        ...periciaAtualizada,
        historico: [
          ...(periciaAtualizada.historico || []),
          { data: new Date().toISOString(), acao: 'Perícia atualizada' }
        ]
      };
      const periciaAtualizadaDaApi = await periciaService.updatePericia(periciaAtualizada.id, periciaComHistorico);
      setPericias(prev => prev.map(p => (p.id === periciaAtualizada.id ? periciaAtualizadaDaApi : p)));
      return true;
    } catch (e) {
      errorHandler.logError(ErrorCategory.API, ErrorSeverity.HIGH, 'UpdatePericia', e);
      return false;
    }
  };
  
  const deletePericia = async (id: number): Promise<boolean> => {
    // Atualização otimista: remove do estado local primeiro
    const originalPericias = [...pericias];
    setPericias(prev => prev.filter(p => p.id !== id));
    try {
      await periciaService.deletePericia(id);
      return true;
    } catch (e) {
      // Se a chamada de API falhar, reverte o estado
      setPericias(originalPericias);
      errorHandler.logError(ErrorCategory.API, ErrorSeverity.HIGH, 'DeletePericia', e);
      return false;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterStatus('todos');
    setFilterDate('');
    setFilterPrazo('todos');
  };

  // As funções de import/export/clear agora são obsoletas e serão removidas
  // Elas podem ser reimplementadas no futuro para interagir com a API se necessário

  const value = useMemo(() => ({
    isLoading,
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
    getPrazoStatus,
    clearAllFilters,
    exportData: () => JSON.stringify(pericias), // Mantido para relatórios locais
    importData: () => false, // Obsoleto
    clearAllData: () => false, // Obsoleto
  }), [pericias, searchTerm, filterStatus, filterDate, filterPrazo, filteredPericias, stats, isLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><p>Carregando perícias...</p></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen"><p className="text-red-500">{error}</p></div>;
  }

  return <PericiasContext.Provider value={value}>{children}</PericiasContext.Provider>;
}

export function usePericias() {
  const context = useContext(PericiasContext);
  if (!context) {
    throw new Error('usePericias must be used within a PericiasProvider');
  }
  return context;
}
