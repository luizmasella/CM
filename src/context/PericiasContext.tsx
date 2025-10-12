// FILE: src/context/PericiasContext.tsx
// ATUALIZADO: Tratamento de erros robusto em TODAS as operações

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { periciasIniciais } from '../config/initialData';
import { errorHandler, ErrorCategory, ErrorSeverity, safeExecute } from '../utils/errorHandler';

// Tipos
interface Pericia { 
  id: number; 
  numeroProcesso: string; 
  reclamante: string; 
  reclamadas: string[]; 
  data: string; 
  hora: string; 
  tipo: string; 
  vara: string; 
  juiz: string; 
  local: string; 
  regiao: string; 
  status: string; 
  justicaGratuita: boolean; 
  honorariosSolicitados: number; 
  honorariosDeferidos: number; 
  prazoLaudo: string | null; 
  prazoQuesitos: string | null; 
  observacoes: string; 
  historico: any[]; 
}

interface IPericiasContext { 
  pericias: Pericia[]; 
  addPericia: (novaPericia: Omit<Pericia, 'id'>) => boolean; 
  updatePericia: (periciaAtualizada: Pericia) => boolean; 
  deletePericia: (id: number) => boolean; 
  searchTerm: string; 
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>; 
  filterStatus: string; 
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>; 
  filterDate: string; 
  setFilterDate: React.Dispatch<React.SetStateAction<string>>; 
  filterPrazo: string; 
  setFilterPrazo: React.Dispatch<React.SetStateAction<string>>; 
  filteredPericias: Pericia[]; 
  stats: any; 
  periciasAtrasadas: Pericia[]; 
  prazos7Dias: Pericia[];
  prazos15Dias: Pericia[];
  isPrazoVencido: (prazo: string | null) => boolean;
  getPrazoStatus: (prazo: string | null) => 'vencido' | '7dias' | '15dias' | 'normal';
  clearAllFilters: () => void;
  exportData: () => string | null;
  importData: (jsonString: string) => boolean;
  clearAllData: () => boolean;
}

const PericiasContext = createContext<IPericiasContext | undefined>(undefined);

const STORAGE_KEY = 'pericias_medicas_data';

export function PericiasProvider({ children }: { children: ReactNode }) {
  const [pericias, setPericias] = useState<Pericia[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        if (!Array.isArray(parsed)) {
          errorHandler.logError(
            ErrorCategory.STORAGE,
            ErrorSeverity.MEDIUM,
            'InitialLoad',
            new Error('Dados armazenados não são um array'),
            'Dados corrompidos. Usando dados iniciais.'
          );
          return periciasIniciais;
        }
        
        const isValid = parsed.every(p => 
          p && typeof p === 'object' && 'id' in p && 'numeroProcesso' in p
        );
        
        if (!isValid) {
          errorHandler.logError(
            ErrorCategory.STORAGE,
            ErrorSeverity.MEDIUM,
            'InitialLoad',
            new Error('Estrutura de dados inválida'),
            'Estrutura inválida. Usando dados iniciais.'
          );
          return periciasIniciais;
        }
        
        return parsed.length > 0 ? parsed : periciasIniciais;
      }
      return periciasIniciais;
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDate, setFilterDate] = useState('');
  const [filterPrazo, setFilterPrazo] = useState('todos');

  // Salvamento automático com tratamento de erro robusto
  useEffect(() => {
    const saveData = async () => {
      const result = await safeExecute(
        () => {
          const dataToSave = JSON.stringify(pericias);
          
          // Verifica tamanho
          if (dataToSave.length > 5000000) {
            throw new Error('Dados muito grandes (>5MB)');
          }
          
          localStorage.setItem(STORAGE_KEY, dataToSave);
          return true;
        },
        'AutoSave',
        ErrorCategory.STORAGE,
        ErrorSeverity.MEDIUM
      );

      // Se erro de quota, tenta limpar e salvar novamente
      if (!result.success && result.error?.message.includes('QuotaExceededError')) {
        try {
          localStorage.clear();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(pericias));
          console.warn('⚠️ localStorage cheio. Dados limpos e salvos.');
        } catch (retryError) {
          errorHandler.logError(
            ErrorCategory.STORAGE,
            ErrorSeverity.CRITICAL,
            'AutoSave-Retry',
            retryError,
            'ERRO CRÍTICO: Não foi possível salvar dados!'
          );
        }
      }
    };

    saveData();
  }, [pericias]);

  const clearAllFilters = () => {
    try {
      setSearchTerm('');
      setFilterStatus('todos');
      setFilterDate('');
      setFilterPrazo('todos');
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.USER_ACTION,
        ErrorSeverity.LOW,
        'ClearFilters',
        error
      );
    }
  };

  const addPericia = (novaPericia: Omit<Pericia, 'id'>): boolean => { 
    try {
      // Validação obrigatória
      if (!novaPericia.numeroProcesso || novaPericia.numeroProcesso.trim() === '') {
        errorHandler.logError(
          ErrorCategory.VALIDATION,
          ErrorSeverity.MEDIUM,
          'AddPericia',
          new Error('Número do processo obrigatório'),
          'Número do processo é obrigatório.'
        );
        return false;
      }
      
      const newId = pericias.length > 0 ? Math.max(...pericias.map(p => p.id)) + 1 : 1; 
      const now = new Date().toISOString();
      
      const periciaComHistorico = {
        ...novaPericia,
        id: newId,
        historico: [
          { data: now, acao: 'Perícia cadastrada', usuario: 'Sistema' }
        ]
      };
      
      setPericias(prev => [...prev, periciaComHistorico]);
      return true;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'AddPericia',
        error,
        'Erro ao adicionar perícia. Tente novamente.'
      );
      return false;
    }
  };
  
  const updatePericia = (periciaAtualizada: Pericia): boolean => { 
    try {
      // Validações
      if (!periciaAtualizada.id) {
        throw new Error('ID da perícia obrigatório');
      }
      
      if (!periciaAtualizada.numeroProcesso?.trim()) {
        throw new Error('Número do processo obrigatório');
      }
      
      const exists = pericias.some(p => p.id === periciaAtualizada.id);
      if (!exists) {
        throw new Error(`Perícia ID ${periciaAtualizada.id} não encontrada`);
      }
      
      const now = new Date().toISOString();
      const periciaComHistorico = {
        ...periciaAtualizada,
        historico: [
          ...(periciaAtualizada.historico || []),
          { data: now, acao: 'Perícia atualizada', usuario: 'Sistema' }
        ]
      };
      
      setPericias(prev => prev.map(p => (p.id === periciaAtualizada.id ? periciaComHistorico : p)));
      return true;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'UpdatePericia',
        error,
        'Erro ao atualizar perícia. Tente novamente.'
      );
      return false;
    }
  };
  
  const deletePericia = (id: number): boolean => { 
    try {
      if (!id || id <= 0) {
        throw new Error('ID inválido para exclusão');
      }
      
      const exists = pericias.some(p => p.id === id);
      if (!exists) {
        throw new Error(`Perícia ID ${id} não encontrada`);
      }
      
      setPericias(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.USER_ACTION,
        ErrorSeverity.HIGH,
        'DeletePericia',
        error,
        'Erro ao excluir perícia. Tente novamente.'
      );
      return false;
    }
  };

  const exportData = (): string | null => {
    try {
      const jsonString = JSON.stringify(pericias, null, 2);
      
      if (jsonString.length === 0) {
        throw new Error('Nenhum dado para exportar');
      }
      
      return jsonString;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.MEDIUM,
        'ExportData',
        error,
        'Erro ao exportar dados.'
      );
      return null;
    }
  };

  const importData = (jsonString: string): boolean => {
    try {
      if (!jsonString?.trim()) {
        throw new Error('Dados de importação vazios');
      }
      
      const data = JSON.parse(jsonString);
      
      if (!Array.isArray(data)) {
        throw new Error('Formato inválido: esperado um array');
      }
      
      const isValid = data.every(item => 
        item && typeof item === 'object' && 'id' in item && 'numeroProcesso' in item
      );
      
      if (!isValid) {
        throw new Error('Estrutura de dados inválida');
      }
      
      setPericias(data);
      return true;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'ImportData',
        error,
        'Erro ao importar dados. Verifique o arquivo.'
      );
      return false;
    }
  };

  const clearAllData = (): boolean => {
    try {
      setPericias(periciasIniciais);
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.STORAGE,
        ErrorSeverity.CRITICAL,
        'ClearAllData',
        error,
        'ERRO ao limpar dados!'
      );
      return false;
    }
  };

  const isPrazoVencido = (prazo: string | null): boolean => { 
    try {
      if (!prazo) return false;
      
      const hoje = new Date(); 
      hoje.setHours(0, 0, 0, 0);
      
      const [ano, mes, dia] = prazo.split('-').map(Number);
      
      if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
        throw new Error(`Data inválida: ${prazo}`);
      }
      
      const dataPrazo = new Date(ano, mes - 1, dia);
      dataPrazo.setHours(0, 0, 0, 0);
      
      return dataPrazo < hoje;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'IsPrazoVencido',
        error
      );
      return false;
    }
  };

  const diasParaPrazo = (prazo: string | null): number => {
    try {
      if (!prazo) return 999;
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const [ano, mes, dia] = prazo.split('-').map(Number);
      
      if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
        throw new Error(`Data inválida: ${prazo}`);
      }
      
      const dataPrazo = new Date(ano, mes - 1, dia);
      dataPrazo.setHours(0, 0, 0, 0);
      
      const diffTime = dataPrazo.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'DiasParaPrazo',
        error
      );
      return 999;
    }
  };

  const getPrazoStatus = (prazo: string | null): 'vencido' | '7dias' | '15dias' | 'normal' => {
    try {
      if (!prazo) return 'normal';
      
      const dias = diasParaPrazo(prazo);
      
      if (dias < 0) return 'vencido';
      if (dias >= 0 && dias <= 7) return '7dias';
      if (dias > 7 && dias <= 15) return '15dias';
      
      return 'normal';
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'GetPrazoStatus',
        error
      );
      return 'normal';
    }
  };

  const periciasAtrasadas = useMemo(() => {
    try {
      return pericias.filter(p => 
        (p.prazoLaudo && isPrazoVencido(p.prazoLaudo)) || 
        (p.prazoQuesitos && isPrazoVencido(p.prazoQuesitos))
      );
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'PericiasAtrasadas',
        error
      );
      return [];
    }
  }, [pericias]);

  const prazos7Dias = useMemo(() => {
    try {
      return pericias.filter(p => {
        const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
        return prazos.some(prazo => {
          const dias = diasParaPrazo(prazo);
          return dias >= 0 && dias <= 7;
        });
      });
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'Prazos7Dias',
        error
      );
      return [];
    }
  }, [pericias]);

  const prazos15Dias = useMemo(() => {
    try {
      return pericias.filter(p => {
        const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
        return prazos.some(prazo => {
          const dias = diasParaPrazo(prazo);
          return dias > 7 && dias <= 15;
        });
      });
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'Prazos15Dias',
        error
      );
      return [];
    }
  }, [pericias]);
  
  const filteredPericias = useMemo(() => {
    try {
      return pericias.filter(p => {
        const matchesSearch = (
          p.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.reclamante.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const matchesStatus = filterStatus === 'todos' || p.status === filterStatus;
        
        let matchesDate = true;
        if (filterDate !== '') {
          matchesDate = 
            p.data === filterDate ||
            p.prazoLaudo === filterDate ||
            p.prazoQuesitos === filterDate;
        }
        
        let matchesPrazo = true;
        if (filterPrazo === 'vencidos') {
          matchesPrazo = (
            (p.prazoLaudo && isPrazoVencido(p.prazoLaudo)) || 
            (p.prazoQuesitos && isPrazoVencido(p.prazoQuesitos))
          );
        } else if (filterPrazo === '7dias') {
          const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
          matchesPrazo = prazos.some(prazo => {
            const dias = diasParaPrazo(prazo);
            return dias >= 0 && dias <= 7;
          });
        } else if (filterPrazo === '15dias') {
          const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
          matchesPrazo = prazos.some(prazo => {
            const dias = diasParaPrazo(prazo);
            return dias > 7 && dias <= 15;
          });
        }
        
        return matchesSearch && matchesStatus && matchesDate && matchesPrazo;
      });
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.MEDIUM,
        'FilteredPericias',
        error
      );
      return pericias;
    }
  }, [pericias, searchTerm, filterStatus, filterDate, filterPrazo]);

  const stats = useMemo(() => {
    try {
      return { 
        total: pericias.length, 
        aguarda_ato_pericial: pericias.filter(p => p.status === 'aguarda_ato_pericial').length, 
        aguarda_laudo: pericias.filter(p => p.status === 'aguarda_laudo').length, 
        aguarda_quesitos: pericias.filter(p => p.status === 'aguarda_quesitos').length, 
        aguarda_sentenca: pericias.filter(p => p.status === 'aguarda_sentenca').length, 
        aguarda_pagamento: pericias.filter(p => p.status === 'aguarda_pagamento').length, 
        concluidas: pericias.filter(p => p.status === 'concluida').length, 
        prazosVencidos: periciasAtrasadas.length,
        prazos7Dias: prazos7Dias.length,
        prazos15Dias: prazos15Dias.length,
        hojeAgendadas: pericias.filter(p => p.data === new Date().toISOString().split('T')[0]).length, 
        totalHonorariosSolicitados: pericias.reduce((sum, p) => sum + (p.honorariosSolicitados || 0), 0), 
        totalHonorariosDeferidos: pericias.reduce((sum, p) => sum + (p.honorariosDeferidos || 0), 0), 
        honorariosAReceber: pericias.filter(p => p.status === 'aguarda_pagamento').reduce((sum, p) => sum + (p.honorariosDeferidos || 0), 0), 
        totalHonorariosPagos: pericias.filter(p => p.status === 'concluida').reduce((sum, p) => sum + (p.honorariosDeferidos || 0), 0), 
      };
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.MEDIUM,
        'Stats',
        error
      );
      return {
        total: 0, aguarda_ato_pericial: 0, aguarda_laudo: 0, aguarda_quesitos: 0,
        aguarda_sentenca: 0, aguarda_pagamento: 0, concluidas: 0, prazosVencidos: 0,
        prazos7Dias: 0, prazos15Dias: 0, hojeAgendadas: 0, totalHonorariosSolicitados: 0,
        totalHonorariosDeferidos: 0, honorariosAReceber: 0, totalHonorariosPagos: 0
      };
    }
  }, [pericias, periciasAtrasadas, prazos7Dias, prazos15Dias]);

  const value = useMemo(() => ({ 
    pericias, addPericia, updatePericia, deletePericia, searchTerm, setSearchTerm, 
    filterStatus, setFilterStatus, filterDate, setFilterDate, filterPrazo, setFilterPrazo, 
    filteredPericias, stats, periciasAtrasadas, prazos7Dias, prazos15Dias,
    isPrazoVencido, getPrazoStatus, clearAllFilters, exportData, importData, clearAllData
  }), [pericias, searchTerm, filterStatus, filterDate, filterPrazo, filteredPericias, stats, periciasAtrasadas, prazos7Dias, prazos15Dias]);

  return <PericiasContext.Provider value={value}>{children}</PericiasContext.Provider>;
}

export function usePericias() { 
  const context = useContext(PericiasContext); 
  if (!context) throw new Error('usePericias must be used within a PericiasProvider'); 
  return context; 
}
