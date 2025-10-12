// FILE: src/context/UIContext.tsx

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { usePericias } from './PericiasContext'; // Importamos o PericiasContext aqui

interface UIContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showForm: boolean;
  editingId: number | null;
  handleShowNewForm: () => void;
  handleEdit: (pericia: any) => void;
  closeForm: () => void;
  showDetails: boolean;
  selectedPericia: any | null;
  handleViewDetails: (pericia: any) => void;
  closeDetails: () => void;
  processDetailView: boolean;
  currentPericia: any | null;
  openProcessPage: (pericia: any) => void;
  closeProcessPage: () => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  handleCardClick: (filterType: string, value: string | null) => void; // A função de clique agora vive aqui
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPericia, setSelectedPericia] = useState<any | null>(null);
  const [processDetailView, setProcessDetailView] = useState(false);
  const [currentPericia, setCurrentPericia] = useState<any | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Como esta função precisa alterar tanto o estado dos filtros (PericiasContext)
  // quanto o estado da UI (UIContext), ela precisa de acesso a ambos.
  // No entanto, para evitar complexidade, por enquanto, vamos apenas controlar a aba.
  const handleCardClick = (filterType: string, value: string | null) => {
    // A lógica de setar os filtros será passada diretamente nos componentes por enquanto
    setActiveTab('pericias');
  };

  const handleShowNewForm = () => { setEditingId(null); setShowForm(true); };
  const handleEdit = (pericia: any) => { setEditingId(pericia.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingId(null); };
  const handleViewDetails = (pericia: any) => { setSelectedPericia(pericia); setShowDetails(true); };
  const closeDetails = () => { setShowDetails(false); setSelectedPericia(null); };
  const openProcessPage = (pericia: any) => { setCurrentPericia(pericia); setProcessDetailView(true); };
  const closeProcessPage = () => { setProcessDetailView(false); setCurrentPericia(null); };

  const value = useMemo(() => ({ activeTab, setActiveTab, showForm, editingId, handleShowNewForm, handleEdit, closeForm, showDetails, selectedPericia, handleViewDetails, closeDetails, processDetailView, currentPericia, openProcessPage, closeProcessPage, showNotifications, setShowNotifications, handleCardClick }), [activeTab, showForm, editingId, showDetails, selectedPericia, processDetailView, currentPericia, showNotifications]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() { const context = useContext(UIContext); if (!context) throw new Error('useUI must be used within a UIProvider'); return context; }
