// FILE: src/components/ProcessDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useRegioes } from '../context/RegioesContext';
import { statusConfig, tiposPericia } from '../config/constants';
import { ChevronRight, User, Calendar, Edit2, CheckCircle, X, FileText, CalendarDays, ClipboardList, Activity, DollarSign, Clock, Gavel, FileQuestion, MapPin, Briefcase, AlertTriangle } from 'lucide-react';

export default function ProcessDetailPage() {
  const { updatePericia, isPrazoVencido } = usePericias();
  const { currentPericia, closeProcessPage } = useUI();
  const { regioes } = useRegioes();
  
  const [isEditing, setIsEditing] = useState(false);
  const [localPericia, setLocalPericia] = useState(currentPericia);

  useEffect(() => { 
    setLocalPericia(currentPericia); 
  }, [currentPericia]);
  
  if (!currentPericia || !localPericia) return null;

  const diasAtraso = (prazo: string | null): number => { 
    if (!prazo) return 0; 
    const hoje = new Date(); 
    hoje.setHours(0, 0, 0, 0); 
    const [ano, mes, dia] = prazo.split('-').map(Number); 
    const dataPrazo = new Date(ano, mes - 1, dia); 
    const diffTime = hoje.getTime() - dataPrazo.getTime(); 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 0; 
  };

  const saveChanges = () => { 
    updatePericia(localPericia); 
    setIsEditing(false);
    alert('✅ Perícia atualizada com sucesso!');
  };

  const StatusIcon = statusConfig[localPericia.status]?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* BOTÃO VOLTAR */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <button 
            onClick={closeProcessPage} 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ChevronRight size={20} className="rotate-180" />
            Voltar para Lista
          </button>
        </div>

        {/* HEADER DO PROCESSO */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{localPericia.numeroProcesso}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{localPericia.reclamante}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{new Date(localPericia.data).toLocaleDateString('pt-BR')} às {localPericia.hora}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} />
                  <span>{localPericia.tipo}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit2 size={18} /> Editar
                </button>
              ) : (
                <>
                  <button 
                    onClick={saveChanges} 
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle size={18} /> Salvar
                  </button>
                  <button 
                    onClick={() => { 
                      setLocalPericia(currentPericia); 
                      setIsEditing(false); 
                    }} 
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <X size={18} /> Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ALERTAS DE PRAZOS VENCIDOS */}
        {(isPrazoVencido(localPericia.prazoLaudo) || isPrazoVencido(localPericia.prazoQuesitos)) && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3 animate-pulse">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-red-800 text-lg">⚠️ Atenção: Prazo(s) Vencido(s)!</p>
              {isPrazoVencido(localPericia.prazoLaudo) && (
                <p className="text-red-700 mt-1">
                  • Laudo vencido há <span className="font-bold">{diasAtraso(localPericia.prazoLaudo)} dias</span>
                </p>
              )}
              {isPrazoVencido(localPericia.prazoQuesitos) && (
                <p className="text-red-700 mt-1">
                  • Quesitos vencidos há <span className="font-bold">{diasAtraso(localPericia.prazoQuesitos)} dias</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUNA ESQUERDA - INFORMAÇÕES PRINCIPAIS */}
          <div className="lg:col-span-2 space-y-6">
            {/* INFORMAÇÕES DO PROCESSO */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="text-blue-600" />
                Informações do Processo
              </h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
