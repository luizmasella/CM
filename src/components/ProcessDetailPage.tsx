// FILE: src/components/ProcessDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { statusConfig, tiposPericia, regioesList } from '../config/constants';
import { ChevronRight, User, Calendar, Edit2, CheckCircle, X, FileText, CalendarDays, ClipboardList, Activity, DollarSign, Clock, Gavel, FileQuestion, MapPin, Briefcase, AlertTriangle } from 'lucide-react';

export default function ProcessDetailPage() {
  const { updatePericia, isPrazoVencido } = usePericias();
  const { currentPericia, closeProcessPage } = useUI();
  
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
                      <label className="block text-sm font-medium mb-1">Número do Processo</label>
                      <input 
                        value={localPericia.numeroProcesso} 
                        onChange={e => setLocalPericia(d => ({...d, numeroProcesso: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Vara</label>
                      <input 
                        value={localPericia.vara} 
                        onChange={e => setLocalPericia(d => ({...d, vara: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Juiz(a)</label>
                      <input 
                        value={localPericia.juiz} 
                        onChange={e => setLocalPericia(d => ({...d, juiz: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Região</label>
                      <select 
                        value={localPericia.regiao} 
                        onChange={e => setLocalPericia(d => ({...d, regiao: e.target.value}))}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      >
                        {regioesList.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Vara</p>
                    <p className="font-semibold">{localPericia.vara}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Juiz(a)</p>
                    <p className="font-semibold">{localPericia.juiz}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Região</p>
                    <p className="font-semibold">{localPericia.regiao}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tipo de Perícia</p>
                    <p className="font-semibold">{localPericia.tipo}</p>
                  </div>
                </div>
              )}
            </div>

            {/* PARTES DO PROCESSO */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="text-green-600" />
                Partes do Processo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-green-700 font-semibold mb-2">👤 Reclamante</p>
                  <p className="font-bold text-lg">{localPericia.reclamante}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <p className="text-sm text-red-700 font-semibold mb-2">🏢 Reclamada(s)</p>
                  {localPericia.reclamadas.map((r: string, i: number) => (
                    <p key={i} className="font-medium">• {r}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* DATA E LOCAL */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-purple-600" />
                Data e Local
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 font-semibold mb-1">📅 Data</p>
                  <p className="font-bold">{new Date(localPericia.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 font-semibold mb-1">🕐 Hora</p>
                  <p className="font-bold">{localPericia.hora}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 font-semibold mb-1">📍 Local</p>
                  <p className="font-bold">{localPericia.local}</p>
                </div>
              </div>
            </div>

            {/* HONORÁRIOS */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="text-green-600" />
                Honorários
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-green-700 font-semibold mb-2">💵 Solicitados</p>
                  <p className="text-3xl font-bold text-green-800">
                    R$ {localPericia.honorariosSolicitados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-blue-700 font-semibold mb-2">✅ Deferidos</p>
                  <p className="text-3xl font-bold text-blue-800">
                    R$ {localPericia.honorariosDeferidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              {localPericia.justicaGratuita && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-sm font-bold text-yellow-800 flex items-center gap-2">
                    ⚖️ Justiça Gratuita Concedida
                  </p>
                </div>
              )}
            </div>

            {/* OBSERVAÇÕES */}
            {localPericia.observacoes && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ClipboardList className="text-gray-600" />
                  Observações
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{localPericia.observacoes}</p>
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA - STATUS E PRAZOS */}
          <div className="space-y-6">
            {/* STATUS */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="text-blue-600" />
                Status
              </h2>
              {isEditing ? (
                <select 
                  value={localPericia.status} 
                  onChange={e => setLocalPericia(d => ({...d, status: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg p-3"
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option value={key} key={key}>{config.label}</option>
                  ))}
                </select>
              ) : (
                <div className={`p-4 rounded-lg ${statusConfig[localPericia.status]?.color} flex items-center gap-3`}>
                  {StatusIcon && <StatusIcon size={24} />}
                  <span className="font-bold text-lg">{statusConfig[localPericia.status]?.label}</span>
                </div>
              )}
            </div>

            {/* PRAZOS */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="text-orange-600" />
                Prazos
              </h2>
              <div className="space-y-3">
                {localPericia.prazoLaudo && (
                  <div className={`p-4 rounded-lg ${isPrazoVencido(localPericia.prazoLaudo) ? 'bg-red-50 border-2 border-red-300' : 'bg-blue-50 border-2 border-blue-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={18} className={isPrazoVencido(localPericia.prazoLaudo) ? 'text-red-600' : 'text-blue-600'} />
                      <p className="text-sm font-bold">Prazo do Laudo</p>
                    </div>
                    <p className="text-lg font-bold">{new Date(localPericia.prazoLaudo).toLocaleDateString('pt-BR')}</p>
                    {isPrazoVencido(localPericia.prazoLaudo) && (
                      <p className="text-red-600 text-sm mt-2 font-semibold">
                        ⚠️ Vencido há {diasAtraso(localPericia.prazoLaudo)} dias
                      </p>
                    )}
                  </div>
                )}
                {localPericia.prazoQuesitos && (
                  <div className={`p-4 rounded-lg ${isPrazoVencido(localPericia.prazoQuesitos) ? 'bg-red-50 border-2 border-red-300' : 'bg-orange-50 border-2 border-orange-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FileQuestion size={18} className={isPrazoVencido(localPericia.prazoQuesitos) ? 'text-red-600' : 'text-orange-600'} />
                      <p className="text-sm font-bold">Prazo dos Quesitos</p>
                    </div>
                    <p className="text-lg font-bold">{new Date(localPericia.prazoQuesitos).toLocaleDateString('pt-BR')}</p>
                    {isPrazoVencido(localPericia.prazoQuesitos) && (
                      <p className="text-red-600 text-sm mt-2 font-semibold">
                        ⚠️ Vencido há {diasAtraso(localPericia.prazoQuesitos)} dias
                      </p>
                    )}
                  </div>
                )}
                {!localPericia.prazoLaudo && !localPericia.prazoQuesitos && (
                  <p className="text-gray-500 text-sm text-center py-4">Nenhum prazo definido</p>
                )}
              </div>
            </div>

            {/* HISTÓRICO */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CalendarDays className="text-purple-600" />
                Histórico
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {localPericia.historico.map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{h.acao}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {h.usuario} • {new Date(h.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
                {localPericia.historico.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">Nenhum histórico registrado</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
