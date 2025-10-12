// FILE: src/context/PericiasContext.tsx

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
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
  addPericia: (novaPericia: Omit<Pericia, 'id'>) => void; 
  updatePericia: (periciaAtualizada: Pericia) => void; 
  deletePericia: (id: number) => void; 
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
}

const PericiasContext = createContext<IPericiasContext | undefined>(undefined);

export function PericiasProvider({ children }: { children: ReactNode }) {
  const [pericias, setPericias] = useState<Pericia[]>(periciasIniciais);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDate, setFilterDate] = useState('');
  const [filterPrazo, setFilterPrazo] = useState('todos');

  const addPericia = (novaPericia: Omit<Pericia, 'id'>) => { 
    const newId = pericias.length > 0 ? Math.max(...pericias.map(p => p.id)) + 1 : 1; 
    setPericias(prev => [...prev, { id: newId, ...novaPericia }]); 
  };
  
  const updatePericia = (periciaAtualizada: Pericia) => { 
    setPericias(prev => prev.map(p => (p.id === periciaAtualizada.id ? periciaAtualizada : p))); 
  };
  
  const deletePericia = (id: number) => { 
    if (window.confirm('Deseja excluir esta perícia?')) { 
      setPericias(prev => prev.filter(p => p.id !== id)); 
    } 
  };

  const isPrazoVencido = (prazo: string | null): boolean => { 
    if (!prazo) return false; 
    const hoje = new Date(); 
    hoje.setHours(0, 0, 0, 0); 
    const [ano, mes, dia] = prazo.split('-').map(Number); 
    const dataPrazo = new Date(ano, mes - 1, dia);
    dataPrazo.setHours(0, 0, 0, 0);
    return dataPrazo < hoje; 
  };

  // Nova função: verifica se prazo vence em X dias
  const diasParaPrazo = (prazo: string | null): number => {
    if (!prazo) return 999;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const [ano, mes, dia] = prazo.split('-').map(Number);
    const dataPrazo = new Date(ano, mes - 1, dia);
    dataPrazo.setHours(0, 0, 0, 0);
    const diffTime = dataPrazo.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Nova função: retorna status do prazo
  const getPrazoStatus = (prazo: string | null): 'vencido' | '7dias' | '15dias' | 'normal' => {
    if (!prazo) return 'normal';
    const dias = diasParaPrazo(prazo);
    if (dias < 0) return 'vencido';
    if (dias >= 0 && dias <= 7) return '7dias';
    if (dias > 7 && dias <= 15) return '15dias';
    return 'normal';
  };

  // Perícias com prazos vencidos
  const periciasAtrasadas = useMemo(() => 
    pericias.filter(p => 
      (p.prazoLaudo && isPrazoVencido(p.prazoLaudo)) || 
      (p.prazoQuesitos && isPrazoVencido(p.prazoQuesitos))
    ), 
    [pericias]
  );

  // Perícias com prazos a vencer em 7 dias
  const prazos7Dias = useMemo(() => 
    pericias.filter(p => {
      const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
      return prazos.some(prazo => {
        const dias = diasParaPrazo(prazo);
        return dias >= 0 && dias <= 7;
      });
    }),
    [pericias]
  );

  // Perícias com prazos a vencer em 15 dias
  const prazos15Dias = useMemo(() => 
    pericias.filter(p => {
      const prazos = [p.prazoLaudo, p.prazoQuesitos].filter(Boolean);
      return prazos.some(prazo => {
        const dias = diasParaPrazo(prazo);
        return dias > 7 && dias <= 15;
      });
    }),
    [pericias]
  );
  
  const filteredPericias = useMemo(() => {
    return pericias.filter(p => {
      // FILTRO 1: Busca por texto
      const matchesSearch = (
        p.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.reclamante.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // FILTRO 2: Status
      const matchesStatus = filterStatus === 'todos' || p.status === filterStatus;
      
      // FILTRO 3: Data específica
      const matchesDate = filterDate === '' || p.data === filterDate;
      
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
  }, [pericias, searchTerm, filterStatus, filterDate, filterPrazo]);

  const stats = useMemo(() => ({ 
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
    honorariosAReceber: pericias.filter(p => p.status === 'aguarda_pagamento').reduce((sum, p) => sum + p.honorariosDeferidos, 0), 
    totalHonorariosPagos: pericias.filter(p => p.status === 'concluida').reduce((sum, p) => sum + p.honorariosDeferidos, 0), 
  }), [pericias, periciasAtrasadas, prazos7Dias, prazos15Dias]);

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
    getPrazoStatus
  }), [pericias, searchTerm, filterStatus, filterDate, filterPrazo, filteredPericias, stats, periciasAtrasadas, prazos7Dias, prazos15Dias]);

  return <PericiasContext.Provider value={value}>{children}</PericiasContext.Provider>;
}

export function usePericias() { 
  const context = useContext(PericiasContext); 
  if (!context) throw new Error('usePericias must be used within a PericiasProvider'); 
  return context; 
}
