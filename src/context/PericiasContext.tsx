// FILE: src/context/PericiasContext.tsx (VERSÃO CORRIGIDA)

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
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

// --- CRIAÇÃO DO CONTEXTO ---
const PericiasContext = createContext<IPericiasContext | undefined>(undefined);

// --- PROVEDOR ---
interface PericiasProviderProps {
  children: ReactNode;
}

export function PericiasProvider({ children }: PericiasProviderProps) {
  const [pericias, setPericias] = useState<Pericia[]>([
    // NÃO ESQUEÇA DE COLAR SUA LISTA COMPLETA DE PERÍCIAS AQUI
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
    // ... COLE O RESTO DAS SUAS PERÍCIAS AQUI ...
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const addPericia = (novaPericia: Omit<Pericia, "id">) => {
    const newId =
      pericias.length > 0 ? Math.max(...pericias.map((p) => p.id)) + 1 : 1;
    setPericias((prevPericias) => [
      ...prevPericias,
      { id: newId, ...novaPericia },
    ]);
  };
  const updatePericia = (periciaAtualizada: Pericia) => {
    setPericias((prevPericias) =>
      prevPericias.map((p) =>
        p.id === periciaAtualizada.id ? periciaAtualizada : p
      )
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
      // adicione os outros cálculos de stats aqui
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

  // A CORREÇÃO ESTÁ AQUI: a lista de dependências agora só contém os dados de origem.
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
    [pericias, searchTerm, filterStatus]
  ); // Dependências corrigidas!

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
