// FILE: src/context/UIContext.tsx

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// --- TIPOS ---
interface UIContextProps {
  // Estado das Abas
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Estado dos Modais e Formulários
  showForm: boolean;
  editingId: number | null;
  handleShowNewForm: () => void;
  handleEdit: (pericia: any) => void;
  closeForm: () => void;

  // Estado do Modal de Detalhes
  showDetails: boolean;
  selectedPericia: any | null;
  handleViewDetails: (pericia: any) => void;
  closeDetails: () => void;

  // Estado da Página de Detalhes do Processo
  processDetailView: boolean;
  currentPericia: any | null;
  openProcessPage: (pericia: any) => void;
  closeProcessPage: () => void;

  // Estado das Notificações (apenas a UI)
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

// --- CRIAÇÃO DO CONTEXTO ---
const UIContext = createContext<UIContextProps | undefined>(undefined);

// --- PROVEDOR ---
interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  // TODOS OS ESTADOS DE UI QUE ESTAVAM NO APP.TSX AGORA VIVEM AQUI
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPericia, setSelectedPericia] = useState<any | null>(null);
  const [processDetailView, setProcessDetailView] = useState(false);
  const [currentPericia, setCurrentPericia] = useState<any | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // FUNÇÕES QUE MANIPULAM O ESTADO DA UI
  const handleShowNewForm = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (pericia: any) => {
    setEditingId(pericia.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleViewDetails = (pericia: any) => {
    setSelectedPericia(pericia);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedPericia(null);
  };

  const openProcessPage = (pericia: any) => {
    setCurrentPericia(pericia);
    setProcessDetailView(true);
  };
  
  const closeProcessPage = () => {
    setProcessDetailView(false);
    setCurrentPericia(null);
  };

  const value = useMemo(() => ({
    activeTab,
    setActiveTab,
    showForm,
    editingId,
    handleShowNewForm,
    handleEdit,
    closeForm,
    showDetails,
    selectedPericia,
    handleViewDetails,
    closeDetails,
    processDetailView,
    currentPericia,
    openProcessPage,
    closeProcessPage,
    showNotifications,
    setShowNotifications,
  }), [
    activeTab, showForm, editingId, showDetails, selectedPericia, 
    processDetailView, currentPericia, showNotifications
  ]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

// --- HOOK CUSTOMIZADO ---
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI deve ser usado dentro de um UIProvider');
  }
  return context;
}
