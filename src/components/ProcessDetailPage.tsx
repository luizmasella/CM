// FILE: src/components/ProcessDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { statusConfig, tiposPericia, regioesList } from '../config/constants';
import { ChevronRight, User, Calendar, Edit2, CheckCircle, X, FileText } from 'lucide-react';

export default function ProcessDetailPage() {
  const { updatePericia } = usePericias();
  const { currentPericia, closeProcessPage } = useUI();
  
  const [isEditing, setIsEditing] = useState(false);
  const [localPericia, setLocalPericia] = useState(currentPericia);

  useEffect(() => { setLocalPericia(currentPericia); }, [currentPericia]);
  if (!currentPericia) return null;

  const saveChanges = () => { updatePericia(localPericia); setIsEditing(false); };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <button onClick={closeProcessPage} className="flex items-center gap-2 text-blue-600 hover:text-blue-800"><ChevronRight size={20} className="rotate-180" />Voltar</button>
      </div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-xl p-6 text-white">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold mb-2">{localPericia.numeroProcesso}</h1>
                <div className="flex items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-2"><User size={18} /><span>{localPericia.reclamante}</span></div>
                    <div className="flex items-center gap-2"><Calendar size={18} /><span>{new Date(localPericia.data).toLocaleDateString('pt-BR')}</span></div>
                </div>
            </div>
            <div className="flex gap-2">
                {!isEditing ? <button onClick={() => setIsEditing(true)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2"><Edit2 size={18} /> Editar</button> : (
                    <>
                        <button onClick={saveChanges} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"><CheckCircle size={18} /> Salvar</button>
                        <button onClick={() => { setLocalPericia(currentPericia); setIsEditing(false); }} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"><X size={18} /> Cancelar</button>
                    </>
                )}
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="text-blue-600" />Informações do Processo</h2>
            {isEditing ? <input value={localPericia.numeroProcesso} onChange={e => setLocalPericia(d => ({...d, numeroProcesso: e.target.value}))} /> : <p>{localPericia.numeroProcesso}</p>}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Status</h2>
            {isEditing ? <select value={localPericia.status} onChange={e => setLocalPericia(d => ({...d, status: e.target.value}))}>{Object.entries(statusConfig).map(([key, config]) => <option value={key} key={key}>{config.label}</option>)}</select> : <div>{statusConfig[localPericia.status]?.label}</div>}
        </div>
      </div>
    </div>
  );
}
