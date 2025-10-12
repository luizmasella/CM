// FILE: src/context/PericiasContext.tsx

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

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
  filteredPericias: Pericia[];
  stats: any;
  periciasAtrasadas: Pericia[];
}

const PericiasContext = createContext<IPericiasContext | undefined>(undefined);

interface PericiasProviderProps {
  children: ReactNode;
}

export function PericiasProvider({ children }: PericiasProviderProps) {
  const [pericias, setPericias] = useState<Pericia[]>([
    {
        id: 1,
        numeroProcesso: '0001234-56.2025.5.02.0001',
        reclamante: 'João Silva Santos',
        reclamadas: ['Empresa ABC Ltda', 'Seguradora XYZ S.A.'],
        data: '2025-10-15',
        hora: '09:00',
        tipo: 'Médica',
        vara: '1ª Vara do Trabalho',
        juiz: 'Dr. João Silva',
        local: 'Fórum Central',
        regiao: 'TRT 2ª Região - SP',
        status: 'aguarda_ato_pericial',
        justicaGratuita: false,
        honorariosSolicitados: 2500.00,
        honorariosDeferidos: 2000.00,
        prazoLaudo: '2025-10-30',
        prazoQuesitos: null,
        observacoes: 'Perícia médica trabalhista - Lesão no joelho',
        historico: [
          { data: '2025-10-01', acao: 'Perícia agendada', usuario: 'Sistema' }
        ]
      },
      {
        id: 2,
        numeroProcesso: '0002345-67.2025.5.02.0002',
        reclamante: 'Maria Oliveira da Silva',
        reclamadas: ['Indústria Beta S.A.'],
        data: '2025-10-12',
        hora: '14:30',
        tipo: 'Psiquiátrica',
        vara: '2ª Vara do Trabalho',
        juiz: 'Dra. Maria Santos',
        local: 'Consultório Médico',
        regiao: 'TRT 2ª Região - SP',
        status: 'aguarda_laudo',
        justicaGratuita: false,
        honorariosSolicitados: 3000.00,
        honorariosDeferidos: 2800.00,
        prazoLaudo: '2025-10-08',
        prazoQuesitos: null,
        observacoes: 'Avaliação psiquiátrica - Síndrome de Burnout',
        historico: [
          { data: '2025-10-05', acao: 'Perícia agendada', usuario: 'Sistema' },
          { data: '2025-10-12', acao: 'Perícia realizada', usuario: 'Dr. Carlos' }
        ]
      },
      {
        id: 3,
        numeroProcesso: '0003456-78.2025.5.02.0003',
        reclamante: 'Pedro Santos Ferreira',
        reclamadas: ['Construtora Gama Ltda'],
        data: '2025-10-20',
        hora: '10:00',
        tipo: 'Ortopédica',
        vara: '3ª Vara Cível',
        juiz: 'Dr. Carlos Oliveira',
        local: 'Hospital das Clínicas',
        regiao: 'TRT 2ª Região - SP',
        status: 'aguarda_ato_pericial',
        justicaGratuita: true,
        honorariosSolicitados: 1000.00,
        honorariosDeferidos: 1000.00,
        prazoLaudo: '2025-11-05',
        prazoQuesitos: null,
        observacoes: 'Avaliação ortopédica - Acidente de trabalho - Justiça Gratuita',
        historico: [
          { data: '2025-10-01', acao: 'Perícia agendada', usuario: 'Sistema' }
        ]
      },
      {
        id: 4,
        numeroProcesso: '0004567-89.2025.5.02.0004',
        reclamante: 'Ana Costa Rodrigues',
        reclamadas: ['Supermercado Delta S.A.', 'Seguradora Beta'],
        data: '2025-09-15',
        hora: '15:00',
        tipo: 'Médica',
        vara: '1ª Vara do Trabalho',
        juiz: 'Dr. João Silva',
        local: 'Fórum Central',
        regiao: 'TRT 2ª Região - SP',
        status: 'aguarda_quesitos',
        justicaGratuita: false,
        honorariosSolicitados: 2200.00,
        honorariosDeferidos: 2000.00,
        prazoLaudo: '2025-10-30',
        prazoQuesitos: '2025-10-05',
        observacoes: 'Perícia médica - LER/DORT',
        historico: [
          { data: '2025-09-01', acao: 'Perícia agendada', usuario: 'Sistema' },
          { data: '2025-09-15', acao: 'Perícia realizada', usuario: 'Dr. Roberto' },
          { data: '2025-09-20', acao: 'Laudo entregue', usuario: 'Dr. Roberto' }
        ]
      },
      {
        id: 5,
        numeroProcesso: '0005678-90.2025.5.02.0005',
        reclamante: 'Carlos Eduardo Lima',
        reclamadas: ['Transportadora Épsilon Ltda'],
        data: '2025-08-10',
        hora: '11:00',
        tipo: 'Neurológica',
        vara: '2ª Vara do Trabalho',
        juiz: 'Dra. Maria Santos',
        local: 'Consultório Médico',
        regiao: 'TRT 2ª Região - SP',
        status: 'aguarda_sentenca',
        justicaGratuita: false,
        honorariosSolicitados: 3500.00,
        honorariosDeferidos: 3200.00,
        prazoLaudo: '2025-08-25',
        prazoQuesitos: null,
        observacoes: 'Avaliação neurológica - Lesão cerebral',
        historico: [
          { data: '2025-08-01', acao: 'Perícia agendada', usuario: 'Sistema' },
          { data: '2025-08-10', acao: 'Perícia realizada', usuario: 'Dr. Silva' },
          { data: '2025-08-20', acao: 'Laudo entregue', usuario: 'Dr. Silva' },
          { data: '2025-09-05', acao: 'Quesitos respondidos', usuario: 'Dr. Silva' }
        ]
      },
      {
        id: 6,
        numeroProcesso: '0006789-01.2025.5.02.0006',
        reclamante: 'Fernanda Souza Almeida',
        reclamadas: ['Banco Zeta S.A.'],
        data: '2025-07-05',
        hora: '09:30',
        tipo: 'Psiquiátrica',
        vara: '1ª Vara do Trabalho',
        juiz: 'Dr. João Silva',
        local: 'Consultório Médico',
        regiao: 'TRT 2ª Região - SP',
        status: 'aguarda_pagamento',
        justicaGratuita: false,
        honorariosSolicitados: 3200.00,
        honorariosDeferidos: 3000.00,
        prazoLaudo: '2025-07-20',
        prazoQuesitos: null,
        observacoes: 'Avaliação psiquiátrica - Assédio moral',
        historico: [
          { data: '2025-07-01', acao: 'Perícia agendada', usuario: 'Sistema' },
          { data: '2025-07-05', acao: 'Perícia realizada', usuario: 'Dra. Martins' },
          { data: '2025-07-15', acao: 'Laudo entregue', usuario: 'Dra. Martins' },
          { data: '2025-09-10', acao: 'Sentença proferida', usuario: 'Sistema' }
        ]
      },
      {
        id: 7,
        numeroProcesso: '0007890-12.2025.5.02.0007',
        reclamante: 'Roberto Oliveira Santos',
        reclamadas: ['Metalúrgica Eta Ltda'],
        data: '2025-06-20',
        hora: '14:00',
        tipo: 'Médica',
        vara: '2ª Vara do Trabalho',
        juiz: 'Dra. Maria Santos',
        local: 'Hospital das Clínicas',
        regiao: 'TRT 2ª Região - SP',
        status: 'concluida',
        justicaGratuita: false,
        honorariosSolicitados: 2600.00,
        honorariosDeferidos: 2400.00,
        prazoLaudo: '2025-07-05',
        prazoQuesitos: null,
        observacoes: 'Perícia médica - Perda auditiva',
        historico: [
          { data: '2025-06-01', acao: 'Perícia agendada', usuario: 'Sistema' },
          { data: '2025-06-20', acao: 'Perícia realizada', usuario: 'Dr. Ferreira' },
          { data: '2025-06-30', acao: 'Laudo entregue', usuario: 'Dr. Ferreira' },
          { data: '2025-08-15', acao: 'Sentença proferida', usuario: 'Sistema' },
          { data: '2025-09-20', acao: 'Pagamento realizado', usuario: 'Sistema' }
        ]
      },
      {
        id: 8,
        numeroProcesso: '0008901-23.2025.5.02.0008',
        reclamante: 'Juliana Pereira Costa',
        reclamadas: ['Indústria Theta S.A.', 'Seguradora Gama'],
        data: '2025-10-18',
        hora: '16:00',
        tipo: 'Cardiológica',
        vara: '3ª Vara Cível',
        juiz: 'Dr. Carlos Oliveira',
        local: 'Consultório Médico',
        regiao: 'TRT 2ª Região - SP',
        status: 'aguarda_ato_pericial',
        justicaGratuita: true,
        honorariosSolicitados: 1000.00,
        honorariosDeferidos: 1000.00,
        prazoLaudo: '2025-11-02',
        prazoQuesitos: null,
        observacoes: 'Avaliação cardiológica - Infarto relacionado ao trabalho - Justiça Gratuita',
        historico: [
          { data: '2025-10-05', acao: 'Perícia agendada', usuario: 'Sistema' }
        ]
      },
      {
        id: 9,
        numeroProcesso: '0009012-34.2025.5.02.0009',
        reclamante: 'Marcos Antonio Silva',
        reclamadas: ['Construtora Iota Ltda'],
        data: '2025-05-10',
        hora: '10:30',
        tipo: 'Ortopédica',
        vara: '1ª Vara do Trabalho',
        juiz: 'Dra. Ana Paula Costa',
        local: 'Hospital das Clínicas',
        regiao: 'TRT 2ª Região - SP',
        status: 'concluida',
        justicaGratuita: false,
        honorariosSolicitados: 2700.00,
        honorariosDeferidos: 2500.00,
        prazoLaudo: '2025-05-25',
        prazoQuesitos: null,
        observacoes: 'Avaliação ortopédica - Fratura de coluna',
        historico: [
          { data: '2025-05-01', acao: 'Perícia agendada', usuario: 'Sistema' },
          { data: '2025-05-10', acao: 'Perícia realizada', usuario: 'Dr. Mendes' },
          { data: '2025-05-20', acao: 'Laudo entregue', usuario: 'Dr. Mendes' },
          { data: '2025-07-10', acao: 'Sentença proferida', usuario: 'Sistema' },
          { data: '2025-08-15', acao: 'Pagamento realizado', usuario: 'Sistema' }
        ]
      },
      {
        id: 10,
        numeroProcesso: '0010123-45.2025.5.02.0010',
        reclamante: 'Patrícia Fernandes Rocha',
        reclamadas: ['Call Center Kappa S.A.'],
        data: '2025-09-25',
        hora: '13:00',
        tipo: 'Psiquiátrica',
        vara: '2ª Vara do Trabalho',
        juiz: 'Dra. Ana Paula Costa',
        local: 'Consultório Médico',
        regiao: 'TRT 2ª Região - SP',
        status: 'aguarda_sentenca',
        justicaGratuita: false,
        honorariosSolicitados: 3100.00,
        honorariosDeferidos: 2900.00,
        prazoLaudo: '2025-10-10',
        prazoQuesitos: null,
        observacoes: 'Avaliação psiquiátrica - Síndrome do pânico',
        historico: [
          { data: '2025-09-10', acao: 'Perícia agendada', usuario: 'Sistema' },
          { data: '2025-09-25', acao: 'Perícia realizada', usuario: 'Dra. Lima' },
          { data: '2025-10-05', acao: 'Laudo entregue', usuario: 'Dra. Lima' }
        ]
      }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const addPericia = (novaPericia: Omit<Pericia, 'id'>) => {
    const newId = pericias.length > 0 ? Math.max(...pericias.map(p => p.id)) + 1 : 1;
    setPericias(prevPericias => [...prevPericias, { id: newId, ...novaPericia }]);
  };
  const updatePericia = (periciaAtualizada: Pericia) => {
    setPericias(prevPericias => prevPericias.map(p => (p.id === periciaAtualizada.id ? periciaAtualizada : p)));
  };
  const deletePericia = (id: number) => {
    if (window.confirm('Deseja realmente excluir esta perícia?')) {
      setPericias(prevPericias => prevPericias.filter(p => p.id !== id));
      alert('Perícia excluída com sucesso!');
    }
  };

  const isPrazoVencido = (prazo: string | null): boolean => { if (!prazo) return false; const hoje = new Date(); hoje.setHours(0, 0, 0, 0); const dataPrazo = new Date(prazo); return dataPrazo < hoje; };

  const periciasAtrasadas = useMemo(() => pericias.filter(p => (p.status === 'aguarda_laudo' && isPrazoVencido(p.prazoLaudo)) || (p.status === 'aguarda_quesitos' && isPrazoVencido(p.prazoQuesitos))), [pericias]);
  
  const filteredPericias = useMemo(() => {
    return pericias.filter(p => {
      const matchesSearch = (p.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) || p.reclamante.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'todos' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [pericias, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    total: pericias.length,
    aguarda_ato_pericial: pericias.filter(p => p.status === 'aguarda_ato_pericial').length,
    prazosVencidos: periciasAtrasadas.length,
    aguarda_laudo: pericias.filter(p => p.status === 'aguarda_laudo').length,
    aguarda_quesitos: pericias.filter(p => p.status === 'aguarda_quesitos').length,
    aguarda_sentenca: pericias.filter(p => p.status === 'aguarda_sentenca').length,
    aguarda_pagamento: pericias.filter(p => p.status === 'aguarda_pagamento').length,
    concluidas: pericias.filter(p => p.status === 'concluida').length,
    hojeAgendadas: pericias.filter(p => p.data === new Date().toISOString().split('T')[0]).length,
    totalHonorariosSolicitados: pericias.reduce((sum, p) => sum + (p.honorariosSolicitados || 0), 0),
    totalHonorariosDeferidos: pericias.reduce((sum, p) => sum + (p.honorariosDeferidos || 0), 0),
    honorariosAReceber: pericias.filter(p => p.status === 'aguarda_pagamento').reduce((sum, p) => sum + p.honorariosDeferidos, 0),
    totalHonorariosPagos: pericias.filter(p => p.status === 'concluida').reduce((sum, p) => sum + p.honorariosDeferidos, 0),
  }), [pericias, periciasAtrasadas]);

  const value = useMemo(() => ({
    pericias,
    addPericia,
    updatePericia,
    deletePericia,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredPericias,
    stats,
    periciasAtrasadas,
  }), [pericias, searchTerm, filterStatus]);

  return (
    <PericiasContext.Provider value={value}>
      {children}
    </PericiasContext.Provider>
  );
}

export function usePericias() {
  const context = useContext(PericiasContext);
  if (context === undefined) {
    throw new Error('usePericias deve ser usado dentro de um PericiasProvider');
  }
  return context;
}
