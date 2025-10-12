// FILE: src/context/PericiasContext.tsx
// ATUALIZAÇÃO: Adicionado tratamento robusto de erros

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { periciasIniciais } from '../config/initialData';

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

// Função auxiliar para logs de erro (pode ser expandida para enviar para serviço de monitoramento)
const logError = (context: string, error: any) => {
  console.error(`[PericiasContext - ${context}]`, {
    message: error?.message || 'Erro desconhecido',
    error,
    timestamp: new Date().toISOString()
  });
};

export function PericiasProvider({ children }: { children: ReactNode }) {
  const [pericias, setPericias] = useState<Pericia[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Validação básica dos dados
        if (!Array.isArray(parsed)) {
          logError('InitialLoad', new Error('Dados armazenados não são um array'));
          return periciasIniciais;
        }
        
        // Valida estrutura básica de cada perícia
        const isValid = parsed.every(p => 
          p && 
          typeof p === 'object' && 
          'id' in p && 
          'numeroProcesso' in p
        );
        
        if (!isValid) {
          logError('InitialLoad', new Error('Estrutura de dados inválida'));
          return periciasIniciais;
        }
        
        return parsed.length > 0 ? parsed : periciasIniciais;
      }
      return periciasIniciais;
    } catch (error) {
      logError('InitialLoad', error);
      // Em caso de erro, retorna dados iniciais
      return periciasIniciais;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDate, setFilterDate] = useState('');
  const [filterPrazo, setFilterPrazo] = useState('todos');

  // Salvamento automático com tratamento de erro
  useEffect(() => {
    try {
      const dataToSave = JSON.stringify(pericias);
      
      // Verifica se há espaço disponível
      if (dataToSave.length > 5000000) { // ~5MB
        logError('AutoSave', new Error('Dados muito grandes para localStorage'));
        console.warn('⚠️ Aviso: Quantidade de dados muito grande. Considere fazer backup!');
        return;
      }
      
      localStorage.setItem(STORAGE_KEY, dataToSave);
    } catch (error) {
      logError('AutoSave', error);
      
      // Se erro de quota, tenta limpar e salvar novamente
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        try {
          localStorage.clear();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(pericias));
          console.warn('⚠️ localStorage estava cheio. Dados foram limpos e salvos novamente.');
        } catch (retryError) {
          logError('AutoSave-Retry', retryError);
        }
      }
    }
  }, [pericias]);

  const clearAllFilters = () => {
    try {
      setSearchTerm('');
      setFilterStatus('todos');
      setFilterDate('');
      setFilterPrazo('todos');
    } catch (error) {
      logError('ClearFilters', error);
    }
  };

  const addPericia = (novaPericia: Omit<Pericia, 'id'>): boolean => { 
    try {
      // Validação básica
      if (!novaPericia.numeroProcesso || novaPericia.numeroProcesso.trim() === '') {
        throw new Error('Número do processo é obrigatório');
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
      logError('AddPericia', error);
      return false;
    }
  };
  
  const updatePericia = (periciaAtualizada: Pericia): boolean => { 
    try {
      // Validação básica
      if (!periciaAtualizada.id) {
        throw new Error('ID da perícia é obrigatório para atualização');
      }
      
      if (!periciaAtualizada.numeroProcesso || periciaAtualizada.numeroProcesso.trim() === '') {
        throw new Error('Número do processo é obrigatório');
      }
      
      // Verifica se a perícia existe
      const exists = pericias.some(p => p.id === periciaAtualizada.id);
      if (!exists) {
        throw new Error(`Perícia com ID ${periciaAtualizada.id} não encontrada`);
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
      logError('UpdatePericia', error);
      return false;
    }
  };
  
  const deletePericia = (id: number): boolean => { 
    try {
      // Validação
      if (!id || id <= 0) {
        throw new Error('ID inválido para exclusão');
      }
      
      // Verifica se a perícia existe
      const exists = pericias.some(p => p.id === id);
      if (!exists) {
        throw new Error(`Perícia com ID ${id} não encontrada`);
      }
      
      setPericias(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      logError('DeletePericia', error);
      return false;
    }
  };

  const exportData = (): string | null => {
    try {
      const jsonString = JSON.stringify(pericias, null, 2);
      
      // Validação do tamanho
      if (jsonString.length === 0) {
        throw new Error('Nenhum dado para exportar');
      }
      
      return jsonString;
    } catch (error) {
      logError('ExportData', error);
      return null;
    }
  };

  const importData = (jsonString: string): boolean => {
    try {
      // Validação de entrada
      if (!jsonString || jsonString.trim() === '') {
        throw new Error('Dados de importação vazios');
      }
      
      const data = JSON.parse(jsonString);
      
      // Validação de estrutura
      if (!Array.isArray(data)) {
        throw new Error('Formato inválido: esperado um array');
      }
      
      // Validação de cada item
      const isValid = data.every(item => 
        item && 
        typeof item === 'object' && 
        'id' in item && 
        'numeroProcesso' in item
      );
      
      if (!isValid) {
        throw new Error('Estrutura de dados inválida no arquivo');
      }
      
      setPericias(data);
      return true;
    } catch (error) {
      logError('ImportData', error);
      return false;
    }
  };

  const clearAllData = (): boolean => {
    try {
      setPericias(periciasIniciais);
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      logError('ClearAllData', error);
      return false;
    }
  };

  const isPrazoVencido = (prazo: string | null): boolean => { 
    try {
      if (!prazo) return false;
      
      const hoje = new Date(); 
      hoje.setHours(0, 0, 0, 0);
      
      const [ano, mes, dia] = prazo.split('-').map(Number);
      
      // Validação de data
      if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
        throw new Error(`Data inválida: ${prazo}`);
      }
      
      const dataPrazo = new Date(ano, mes - 1, dia);
      dataPrazo.setHours(0, 0, 0, 0);
      
      return dataPrazo < hoje;
    } catch (error) {
      logError('IsPrazoVencido', error);
      return false;
    }
  };

  const diasParaPrazo = (prazo: string | null): number => {
    try {
      if (!prazo) return 999;
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const [ano, mes, dia] = prazo.split('-').map(Number);
      
      // Validação de data
      if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
        throw new Error(`Data inválida: ${prazo}`);
      }
      
      const dataPrazo = new Date(ano, mes - 1, dia);
      dataPrazo.setHours(0, 0, 0, 0);
      
      const diffTime = dataPrazo.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      logError('DiasParaPrazo', error);
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
      logError('GetPrazoStatus', error);
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
      logError('PericiasAtrasadas', error);
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
      logError('Prazos7Dias', error);
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
      logError('Prazos15Dias', error);
      return [];
    }
  }, [pericias]);
  
  const filteredPericias = useMemo(() => {
    try {
      return pericias.filter(p => {
        // FILTRO 1: Busca por texto
        const matchesSearch = (
          p.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.reclamante.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // FILTRO 2: Status
        const matchesStatus = filterStatus === 'todos' || p.status === filterStatus;
        
        // FILTRO 3: Data específica
        let matchesDate = true;
        if (filterDate !== '') {
          matchesDate = 
            p.data === filterDate ||
            p.prazoLaudo === filterDate ||
            p.prazoQuesitos === filterDate;
        }
        
        // FILTRO 4: Prazos
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
      logError('FilteredPericias', error);
      return pericias; // Retorna todas em caso de erro
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
      logError('Stats', error);
      // Retorna stats vazios em caso de erro
      return {
        total: 0,
        aguarda_ato_pericial: 0,
        aguarda_laudo: 0,
        aguarda_quesitos: 0,
        aguarda_sentenca: 0,
        aguarda_pagamento: 0,
        concluidas: 0,
        prazosVencidos: 0,
        prazos7Dias: 0,
        prazos15Dias: 0,
        hojeAgendadas: 0,
        totalHonorariosSolicitados: 0,
        totalHonorariosDeferidos: 0,
        honorariosAReceber: 0,
        totalHonorariosPagos: 0,
      };
    }
  }, [pericias, periciasAtrasadas, prazos7Dias, prazos15Dias]);

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
    getPrazoStatus,
    clearAllFilters,
    exportData,
    importData,
    clearAllData
  }), [pericias, searchTerm, filterStatus, filterDate, filterPrazo, filteredPericias, stats, periciasAtrasadas, prazos7Dias, prazos15Dias]);

  return <PericiasContext.Provider value={value}>{children}</PericiasContext.Provider>;
}

export function usePericias() { 
  const context = useContext(PericiasContext); 
  if (!context) throw new Error('usePericias must be used within a PericiasProvider'); 
  return context; 
}
