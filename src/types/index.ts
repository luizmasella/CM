// src/types/index.ts

export interface Pericia {
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

export interface IPericiasContext {
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
