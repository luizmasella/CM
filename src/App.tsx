// FILE: src/App.tsx
// VERSÃO INTEGRADA COM TODAS AS 4 MELHORIAS

import React, { useMemo } from "react";
import { usePericias } from "./context/PericiasContext";
import { useToast } from "./hooks/useToast";
import { useExport } from "./utils/export";
import { ToastContainer } from "./components/ToastContainer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import PericiasManager from "./components/PericiasManager";
import CalendarView from "./components/CalendarView";
import PericiaForm from "./components/PericiaForm";
import PericiaDetails from "./components/PericiaDetails";
import ProcessDetailPage from "./components/ProcessDetailPage";
import AdvancedFilters, { FilterValues } from "./components/AdvancedFilters";

import {
  Clock,
  FileText,
  FileQuestion,
  Gavel,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function App() {
  // ESTADOS DA INTERFACE
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [showDetails, setShowDetails] = React.useState(false);
  const [selectedPericia, setSelectedPericia] = React.useState<any | null>(null);
  const [processDetailView, setProcessDetailView] = React.useState(false);
  const [currentPericia, setCurrentPericia] = React.useState<any | null>(null);

  // DADOS DO CONTEXTO
  const {
    pericias,
    updatePericia,
    stats,
    periciasAtrasadas,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  } = usePericias();

  // HOOKS DE MELHORIAS
  const { toasts, removeToast, toast } = useToast();
  const { exportToCSV, exportToExcel, exportToPDF, exportStatsReport } = useExport();

  // FILTROS AVANÇADOS
  const [advancedFilters, setAdvancedFilters] = React.useState<FilterValues>({
    searchTerm: "",
    status: "todos",
    tipo: "todos",
    regiao: "todas",
    dataInicio: "",
    dataFim: "",
    honorariosMin: "",
    honorariosMax: "",
    justicaGratuita: "todas",
    prazoVencido: false,
  });

  // APLICAR FILTROS AVANÇADOS
  const filteredPericias = useMemo(() => {
    return pericias.filter((p) => {
      // Busca por texto
      if (advancedFilters.searchTerm) {
        const searchLower = advancedFilters.searchTerm.toLowerCase();
        const matchesSearch =
          p.numeroProcesso.toLowerCase().includes(searchLower) ||
          p.reclamante.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtro de status
      if (advancedFilters.status !== "todos" && p.status !== advancedFilters.status) {
        return false;
      }

      // Filtro de tipo
      if (advancedFilters.tipo !== "todos" && p.tipo !== advancedFilters.tipo) {
        return false;
      }

      // Filtro de região
      if (advancedFilters.regiao !== "todas" && p.regiao !== advancedFilters.regiao) {
        return false;
      }

      // Filtro de data início
      if (advancedFilters.dataInicio && p.data < advancedFilters.dataInicio) {
        return false;
      }

      // Filtro de data fim
      if (advancedFilters.dataFim && p.data > advancedFilters.dataFim) {
        return false;
      }

      // Filtro de honorários mínimo
      if (advancedFilters.honorariosMin) {
        const min = parseFloat(advancedFilters.honorariosMin);
        if (p.honorariosDeferidos < min) return false;
      }

      // Filtro de honorários máximo
      if (advancedFilters.honorariosMax) {
        const max = parseFloat(advancedFilters.honorariosMax);
        if (p.honorariosDeferidos > max) return false;
      }

      // Filtro de justiça gratuita
      if (advancedFilters.justicaGratuita !== "todas") {
        const isGratuita = advancedFilters.justicaGratuita === "sim";
        if (p.justicaGratuita !== isGratuita) return false;
      }

      // Filtro de prazo vencido
      if (advancedFilters.prazoVencido) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const prazoLaudoVencido = p.prazoLaudo && new Date(p.prazoLaudo) < hoje;
        const prazoQuesitosVencido = p.prazoQuesitos && new Date(p.prazoQuesitos) < hoje;
        
        if (!prazoLaudoVencido && !prazoQuesitosVencido) return false;
      }

      return true;
    });
  }, [pericias, advancedFilters]);

  // CONFIGURAÇÕES
  const statusConfig = {
    aguarda_ato_pericial: {
      label: "Aguarda Ato Pericial",
      color: "bg-blue-100 text-blue-800",
      icon: Clock,
    },
    aguarda_laudo: {
      label: "Aguarda Laudo",
      color: "bg-purple-100 text-purple-800",
      icon: FileText,
    },
    aguarda_quesitos: {
      label: "Aguarda Quesitos",
      color: "bg-orange-100 text-orange-800",
      icon: FileQuestion,
    },
    aguarda_sentenca: {
      label: "Aguarda Sentença",
      color: "bg-indigo-100 text-indigo-800",
      icon: Gavel,
    },
    aguarda_pagamento: {
      label: "Aguarda Pagamento",
      color: "bg-yellow-100 text-yellow-800",
      icon: DollarSign,
    },
    concluida: {
      label: "Concluída",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
  };

  const [tiposPericia] = React.useState([
    "Médica",
    "Psiquiátrica",
    "Ortopédica",
    "Cardiológica",
    "Neurológica",
  ]);

  const [regioesList] = React.useState([
    "TRT 2ª Região - SP",
    "TRT 15ª Região - Campinas",
    "TJ-SP",
  ]);

  // FUNÇÕES AUXILIARES
  const isPrazoVencido = (prazo: string | null): boolean => {
    if (!prazo) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataPrazo = new Date(prazo);
    return dataPrazo < hoje;
  };

  const diasAtraso = (prazo: string | null): number => {
    if (!prazo) return 0;
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    const diffTime = hoje.getTime() - dataPrazo.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // HANDLERS DA INTERFACE
  const handleEdit = (pericia: any) => {
    setEditingId(pericia.id);
    setShowForm(true);
  };

  const handleShowNewForm = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleCardClick = (filterType: string, value: string | null) => {
    if (filterType === "status") {
      setAdvancedFilters((prev) => ({ ...prev, status: value || "todos" }));
    }
    setActiveTab("pericias");
  };

  const handleViewDetails = (pericia: any) => {
    setSelectedPericia(pericia);
    setShowDetails(true);
  };

  const openProcessPage = (pericia: any) => {
    setCurrentPericia(pericia);
    setProcessDetailView(true);
  };

  const closeProcessPage = () => {
    setProcessDetailView(false);
    setCurrentPericia(null);
  };

  const handleSaveDetails = (updatedData: any) => {
    updatePericia(updatedData);
    setSelectedPericia(updatedData);
    toast.success("Perícia atualizada com sucesso!");
  };

  // HANDLERS DE EXPORTAÇÃO
  const handleExport = (format: "csv" | "excel" | "pdf" | "stats") => {
    try {
      switch (format) {
        case "csv":
          exportToCSV(filteredPericias);
          toast.success("Relatório CSV exportado com sucesso!");
          break;
        case "excel":
          exportToExcel(filteredPericias);
          toast.success("Relatório Excel exportado com sucesso!");
          break;
        case "pdf":
          exportToPDF(filteredPericias, stats);
          toast.info("Abrindo visualização para impressão/PDF...");
          break;
        case "stats":
          exportStatsReport(stats, pericias);
          toast.success("Relatório estatístico exportado!");
          break;
      }
    } catch (error) {
      toast.error("Erro ao exportar relatório. Tente novamente.");
    }
  };

  // HANDLERS DE FILTROS
  const handleApplyFilters = (filters: FilterValues) => {
    setAdvancedFilters(filters);
    toast.info(`Filtros aplicados: ${filteredPericias.length} resultado(s)`);
  };

  const handleClearFilters = () => {
    setAdvancedFilters({
      searchTerm: "",
      status: "todos",
      tipo: "todos",
      regiao: "todas",
      dataInicio: "",
      dataFim: "",
      honorariosMin: "",
      honorariosMax: "",
      justicaGratuita: "todas",
      prazoVencido: false,
    });
    toast.success("Filtros limpos!");
  };

  // DADOS PLACEHOLDER
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const notificacoesNaoLidas = 0;
  const marcarComoLida = (id: number) => {};
  const marcarTodasComoLidas = () => {};
  const limparNotificacoes = () => {};
  const abrirPericiaNotificacao = (notificacao: any) => {};

  // CALENDAR HELPERS
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const navigateMonth = (direction: number) =>
    setCurrentMonth(
      (prev) => new Date(new Date(prev).setMonth(prev.getMonth() + direction))
    );
  const goToToday = () => setCurrentMonth(new Date());
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
      year,
      month,
    };
  };
  const getPericiasForDate = (dateString: string) =>
    pericias.filter((p) => p.data === dateString);
  const getPrazosForDate = (dateString: string) =>
    pericias.filter(
      (p) => p.prazoLaudo === dateString || p.prazoQuesitos === dateString
    );
  const formatDateString = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const isToday = (year: number, month: number, day: number) =>
    new Date().getFullYear() === year &&
    new Date().getMonth() === month &&
    new Date().getDate() === day;

  // RENDERIZAÇÃO
  if (processDetailView && currentPericia) {
    return (
      <>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <ProcessDetailPage
          currentPericia={currentPericia}
          closeProcessPage={closeProcessPage}
          statusConfig={statusConfig}
          tiposPericia={tiposPericia}
          regioesList={regioesList}
          isPrazoVencido={isPrazoVencido}
          diasAtraso={diasAtraso}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50
