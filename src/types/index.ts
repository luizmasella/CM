// src/types/index.ts

export interface Pericia {
  id: number;
  userId: number; // Adicionado para associar a perícia a um usuário
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
  files?: AttachedFile[];
}

export interface AttachedFile {
  name: string;
  url: string; // In a real app, this would be a URL to a storage service
  type: string;
}

export interface IPericiasContext {
  isLoading: boolean;
  pericias: Pericia[];
  addPericia: (novaPericia: Omit<Pericia, 'id' | 'userId'>) => Promise<boolean>;
  updatePericia: (periciaAtualizada: Pericia) => Promise<boolean>;
  deletePericia: (id: number) => Promise<boolean>;
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

// === Authentication Types ===

export interface User {
  id: number;
  email: string;
  password?: string; // Should only be present on registration/login
}

export interface Credentials {
  email: string;
  password?: string; // Optional for scenarios like password reset later
}

export interface IAuthContext {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: Credentials) => Promise<{ success: boolean; user?: Omit<User, 'password'>; message: string; token?: string }>;
  register: (credentials: Credentials) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}
