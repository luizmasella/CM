// FILE: src/context/PericiasContext.tsx
// VERSÃO MELHORADA COM PERSISTÊNCIA E DADOS INICIAIS

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";

// --- TIPOS ---
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
  addPericia: (novaPericia: Omit<Pericia, "id">) => void;
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

// --- DADOS INICIAIS COMPLETOS ---
const PERICIAS_INICIAIS: Pericia[] = [
  {
    id: 1,
    numeroProcesso: "0001234-56.2025.5.02.0001",
    reclamante: "João Silva Santos",
    reclamadas: ["Empresa ABC Ltda", "Seguradora XYZ S.A."],
    data: "2025-10-15",
    hora: "09:00",
    tipo: "Médica",
    vara: "1ª Vara do Trabalho",
    juiz: "Dr. João Silva",
    local: "Fórum Central",
    regiao: "TRT 2ª Região - SP",
    status: "aguarda_ato_pericial",
    justicaGratuita: false,
    honorariosSolicitados: 2500.0,
    honorariosDeferidos: 2000.0,
    prazoLaudo: "2025-10-30",
    prazoQuesitos: null,
    observacoes: "Perícia médica trabalhista - Lesão no joelho",
    historico: [
      { data: "2025-10-01", acao: "Perícia agendada", usuario: "Sistema" },
    ],
  },
  {
    id: 2,
    numeroProcesso: "0002345-67.2025.5.02.0002",
    reclamante: "Maria Oliveira Costa",
    reclamadas: ["Indústria DEF S.A."],
    data: "2025-10-12",
    hora: "14:00",
    tipo: "Ortopédica",
    vara: "2ª Vara do Trabalho",
    juiz: "Dra. Maria Santos",
    local: "Fórum Trabalhista",
    regiao: "TRT 2ª Região - SP",
    status: "aguarda_laudo",
    justicaGratuita: true,
    honorariosSolicitados: 3000.0,
    honorariosDeferidos: 2500.0,
    prazoLaudo: "2025-10-08",
    prazoQuesitos: null,
    observacoes: "Lesão na coluna vertebral",
    historico: [
      { data: "2025-09-15", acao: "Perícia realizada", usuario: "Dr. Silva" },
    ],
  },
  {
    id: 3,
    numeroProcesso: "0003456-78.2025.5.02.0003",
    reclamante: "Pedro Henrique Souza",
    reclamadas: ["Construções GHI Ltda"],
    data: "2025-10-20",
    hora: "10:30",
    tipo: "Psiquiátrica",
    vara: "3ª Vara do Trabalho",
    juiz: "Dr. Carlos Eduardo",
    local: "Fórum Regional",
    regiao: "TRT 2ª Região - SP",
    status: "aguarda_quesitos",
    justicaGratuita: false,
    honorariosSolicitados: 3500.0,
    honorariosDeferidos: 3000.0,
    prazoLaudo: null,
    prazoQuesitos: "2025-10-05",
    observacoes: "Avaliação de burnout e estresse ocupacional",
    historico: [
      { data: "2025-09-28", acao: "Laudo enviado", usuario: "Dr. Pereira" },
    ],
  },
  {
    id: 4,
    numeroProcesso: "0004567-89.2025.5.02.0004",
    reclamante: "Ana Paula Ferreira",
    reclamadas: ["Logística JKL S.A.", "Transportes MNO"],
    data: "2025-11-05",
    hora: "11:00",
    tipo: "Cardiológica",
    vara: "1ª Vara do Trabalho",
    juiz: "Dr. João Silva",
    local: "Fórum Central",
    regiao: "TRT 2ª Região - SP",
    status: "aguarda_sentenca",
    justicaGratuita: false,
    honorariosSolicitados: 4000.0,
    honorariosDeferidos: 3500.0,
    prazoLaudo: null,
    prazoQuesitos: null,
    observacoes: "Infarto relacionado ao trabalho",
    historico: [
      { data: "2025-09-20", acao: "Quesitos respondidos", usuario: "Sistema" },
    ],
  },
  {
    id: 5,
    numeroProcesso: "0005678-90.2025.5.02.0005",
    reclamante: "Carlos Alberto Lima",
    reclamadas: ["Metalúrgica PQR Ltda"],
    data: "2025-10-25",
    hora: "15:30",
    tipo: "Neurológica",
    vara: "4ª Vara do Trabalho",
    juiz: "Dra. Paula Campos",
    local: "Fórum Trabalhista",
    regiao: "TRT 2ª Região - SP",
    status: "aguarda_pagamento",
    justicaGratuita: true,
    honorariosSolicitados: 5000.0,
    honorariosDeferidos: 4500.0,
    prazoLaudo: null,
    prazoQuesitos: null,
    observacoes: "Lesão cerebral por acidente de trabalho",
    historico: [
      { data: "2025-09-10", acao: "Sentença proferida", usuario: "Juíza" },
    ],
  },
  {
    id: 6,
    numeroProcesso: "0006789-01.2024.5.02.0006",
    reclamante: "Juliana Rodrigues",
    reclamadas: ["Comércio STU S.A."],
    data: "2024-12-15",
    hora: "09:30",
    tipo: "Médica",
    vara: "2ª Vara do Trabalho",
    juiz: "Dr. Roberto Alves",
    local: "Fórum Regional",
    regiao: "TRT 2ª Região - SP",
    status: "concluida",
    justicaGratuita: false,
    honorariosSolicitados: 2800.0,
    honorariosDeferidos: 2800.0,
    prazoLaudo: null,
    prazoQuesitos: null,
    observacoes: "Perícia concluída - Honorários pagos",
    historico: [
      { data: "2024-11-30", acao: "Processo finalizado", usuario: "Sistema" },
      { data: "2024-12-10", acao: "Pagamento recebido", usuario: "Financeiro" },
    ],
  },
];

// --- CRIAÇÃO DO CONTEXTO ---
const PericiasContext = createContext<IPericiasContext | undefined>(undefined);

// --- CONSTANTE PARA CHAVE DO LOCALSTORAGE ---
const STORAGE_KEY = "pericias_data";

// --- PROVEDOR ---
interface PericiasProviderProps {
  children: ReactNode;
}

export function PericiasProvider({ children }: PericiasProviderProps) {
  // Inicializa com dados do localStorage ou dados iniciais
  const [pericias, setPericias] = useState<Pericia[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
    }
    return PERICIAS_INICIAIS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Salva no localStorage sempre que pericias mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pericias));
    } catch (error) {
      console.error("Erro ao salvar dados no localStorage:", error);
    }
  }, [pericias]);

  const addPericia = (novaPericia: Omit<Pericia, "id">) => {
    const newId =
      pericias.length > 0 ? Math.max(...pericias.map((p) => p.id)) + 1 : 1;
    
    const periciaComHistorico = {
      ...novaPericia,
      id: newId,
      historico: [
        {
          data: new Date().toISOString().split("T")[0],
          acao: "Perícia cadastrada",
          usuario: "Sistema",
        },
      ],
    };

    setPericias((prevPericias) => [...prevPericias, periciaComHistorico]);
  };

  const updatePericia = (periciaAtualizada: Pericia) => {
    setPericias((prevPericias) =>
      prevPericias.map((p) => {
        if (p.id === periciaAtualizada.id) {
          // Adiciona entrada no histórico
          const novoHistorico = [
            ...p.historico,
            {
              data: new Date().toISOString().split("T")[0],
              acao: "Perícia atualizada",
              usuario: "Sistema",
            },
          ];
          return { ...periciaAtualizada, historico: novoHistorico };
        }
        return p;
      })
    );
  };

  const deletePericia = (id: number) => {
    if (window.confirm("Deseja realmente excluir esta perícia?")) {
      setPericias((prevPericias) => prevPericias.filter((p) => p.id !== id));
      alert("Perícia excluída com sucesso!");
    }
  };

  const isPrazoVencido = (prazo: string | null): boolean => {
    if (!prazo) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataPrazo = new Date(prazo);
    return dataPrazo < hoje;
  };

  const periciasAtrasadas = useMemo(
    () =>
      pericias.filter(
        (p) =>
          (p.status === "aguarda_laudo" && isPrazoVencido(p.prazoLaudo)) ||
          (p.status === "aguarda_quesitos" && isPrazoVencido(p.prazoQuesitos))
      ),
    [pericias]
  );

  const filteredPericias = useMemo(() => {
    return pericias.filter((p) => {
      const matchesSearch =
        p.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reclamante.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "todos" || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [pericias, searchTerm, filterStatus]);

  const stats = useMemo(
    () => ({
      total: pericias.length,
      aguarda_ato_pericial: pericias.filter(
        (p) => p.status === "aguarda_ato_pericial"
      ).length,
      prazosVencidos: periciasAtrasadas.length,
      aguarda_laudo: pericias.filter((p) => p.status === "aguarda_laudo")
        .length,
      aguarda_quesitos: pericias.filter((p) => p.status === "aguarda_quesitos")
        .length,
      aguarda_sentenca: pericias.filter((p) => p.status === "aguarda_sentenca")
        .length,
      aguarda_pagamento: pericias.filter(
        (p) => p.status === "aguarda_pagamento"
      ).length,
      concluidas: pericias.filter((p) => p.status === "concluida").length,
      hojeAgendadas: pericias.filter(
        (p) => p.data === new Date().toISOString().split("T")[0]
      ).length,
      totalHonorariosSolicitados: pericias.reduce(
        (sum, p) => sum + (p.honorariosSolicitados || 0),
        0
      ),
      totalHonorariosDeferidos: pericias.reduce(
        (sum, p) => sum + (p.honorariosDeferidos || 0),
        0
      ),
      honorariosAReceber: pericias
        .filter((p) => p.status === "aguarda_pagamento")
        .reduce((sum, p) => sum + p.honorariosDeferidos, 0),
      totalHonorariosPagos: pericias
        .filter((p) => p.status === "concluida")
        .reduce((sum, p) => sum + p.honorariosDeferidos, 0),
    }),
    [pericias, periciasAtrasadas]
  );

  const value = useMemo(
    () => ({
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
    }),
    [pericias, searchTerm, filterStatus, filteredPericias, stats, periciasAtrasadas]
  );

  return (
    <PericiasContext.Provider value={value}>
      {children}
    </PericiasContext.Provider>
  );
}

// --- HOOK CUSTOMIZADO ---
export function usePericias() {
  const context = useContext(PericiasContext);
  if (context === undefined) {
    throw new Error("usePericias deve ser usado dentro de um PericiasProvider");
  }
  return context;
}
