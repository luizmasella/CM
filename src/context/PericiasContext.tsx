// FILE: src/context/PericiasContext.tsx

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { periciasIniciais } from '../config/initialData'; // Usaremos um arquivo separado para os dados iniciais

// Tipos
interface Pericia { id: number; numeroProcesso: string; reclamante: string; reclamadas: string[]; data: string; hora: string; tipo: string; vara: string; juiz: string; local: string; regiao: string; status: string; justicaGratuita: boolean; honorariosSolicitados: number; honorariosDeferidos: number; prazoLaudo: string | null; prazoQuesitos: string | null; observacoes: string; historico: any[]; }
interface IPericiasContext { pericias: Pericia[]; addPericia: (novaPericia: Omit<Pericia, 'id'>) => void; updatePericia: (periciaAtualizada: Pericia) => void; deletePericia: (id: number) => void; searchTerm: string; setSearchTerm: React.Dispatch<React.SetStateAction<string>>; filterStatus: string; setFilterStatus: React.Dispatch<React.SetStateAction<string>>; filteredPericias: Pericia[]; stats: any; periciasAtrasadas: Pericia[]; }

const PericiasContext = createContext<IPericiasContext | undefined>(undefined);

export function PericiasProvider({ children }: { children: ReactNode }) {
  const [pericias, setPericias] = useState<Pericia[]>(periciasIniciais);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const addPericia = (novaPericia: Omit<Pericia, 'id'>) => { const newId = pericias.length > 0 ? Math.max(...pericias.map(p => p.id)) + 1 : 1; setPericias(prev => [...prev, { id: newId, ...novaPericia }]); };
  const updatePericia = (periciaAtualizada: Pericia) => { setPericias(prev => prev.map(p => (p.id === periciaAtualizada.id ? periciaAtualizada : p))); };
  const deletePericia = (id: number) => { if (window.confirm('Deseja excluir?')) { setPericias(prev => prev.filter(p => p.id !== id)); } };

  const isPrazoVencido = (prazo: string | null): boolean => { if (!prazo) return false; const hoje = new Date(); hoje.setHours(0, 0, 0, 0); const [ano, mes, dia] = prazo.split('-').map(Number); return new Date(ano, mes - 1, dia) < hoje; };

  const periciasAtrasadas = useMemo(() => pericias.filter(p => (p.status === 'aguarda_laudo' && isPrazoVencido(p.prazoLaudo)) || (p.status === 'aguarda_quesitos' && isPrazoVencido(p.prazoQuesitos))), [pericias]);
  const filteredPericias = useMemo(() => pericias.filter(p => (p.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) || p.reclamante.toLowerCase().includes(searchTerm.toLowerCase())) && (filterStatus === 'todos' || p.status === filterStatus)), [pericias, searchTerm, filterStatus]);
  const stats = useMemo(() => ({
    total: pericias.length,
    aguarda_ato_pericial: pericias.filter(p => p.status === 'aguarda_ato_pericial').length,
    aguarda_laudo: pericias.filter(p => p.status === 'aguarda_laudo').length,
    aguarda_quesitos: pericias.filter(p => p.status === 'aguarda_quesitos').length,
    aguarda_sentenca: pericias.filter(p => p.status === 'aguarda_sentenca').length,
    aguarda_pagamento: pericias.filter(p => p.status === 'aguarda_pagamento').length,
    concluidas: pericias.filter(p => p.status === 'concluida').length,
    prazosVencidos: periciasAtrasadas.length,
    hojeAgendadas: pericias.filter(p => p.data === new Date().toISOString().split('T')[0]).length,
    totalHonorariosSolicitados: pericias.reduce((sum, p) => sum + (p.honorariosSolicitados || 0), 0),
    totalHonorariosDeferidos: pericias.reduce((sum, p) => sum + (p.honorariosDeferidos || 0), 0),
    honorariosAReceber: pericias.filter(p => p.status === 'aguarda_pagamento').reduce((sum, p) => sum + p.honorariosDeferidos, 0),
    totalHonorariosPagos: pericias.filter(p => p.status === 'concluida').reduce((sum, p) => sum + p.honorariosDeferidos, 0),
  }), [pericias, periciasAtrasadas]);

  const value = useMemo(() => ({ pericias, addPericia, updatePericia, deletePericia, searchTerm, setSearchTerm, filterStatus, setFilterStatus, filteredPericias, stats, periciasAtrasadas }), [pericias, searchTerm, filterStatus]);

  return <PericiasContext.Provider value={value}>{children}</PericiasContext.Provider>;
}

export function usePericias() { const context = useContext(PericiasContext); if (!context) throw new Error('usePericias must be used within a PericiasProvider'); return context; }
