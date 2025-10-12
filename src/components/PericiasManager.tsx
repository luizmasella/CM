// FILE: src/components/PericiasManager.tsx (APAGUE TUDO E COLE ISTO)

import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { statusConfig } from '../config/constants';
import { Plus, Download, Edit2, Trash2, AlertCircle, Search, Filter } from 'lucide-react';

export default function PericiasManager() {
  const { deletePericia, filteredPericias, pericias, searchTerm, setSearchTerm, filterStatus, setFilterStatus } = usePericias();
  const { handleShowNewForm, handleEdit, handleViewDetails, openProcessPage } = useUI();
  
  const exportarRelatorio = () => alert('Exportando...');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Gerenciar Perícias</h2>
            <div className="flex gap-3">
                <button onClick={exportarRelatorio} className="..."><Download /> Exportar</button>
                <button onClick={handleShowNewForm} className="..."><Plus /> Nova Perícia</button>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." className="..." />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="...">
                <option value="todos">Todos</option>
                {Object.entries(statusConfig).map(([key, config]) => <option key={key} value={key}>{config.label}</option>)}
            </select>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>...</thead>
                <tbody>
                    {filteredPericias.map(pericia => (
                        <tr key={pericia.id} onClick={() => handleViewDetails(pericia)}>
                            <td>{pericia.numeroProcesso}</td>
                            <td>{pericia.reclamante}</td>
                            <td>{new Date(pericia.data).toLocaleDateString('pt-BR')}</td>
                            <td>{pericia.tipo}</td>
                            <td>{statusConfig[pericia.status].label}</td>
                            <td>
                                <button onClick={(e) => { e.stopPropagation(); handleEdit(pericia); }}><Edit2 /></button>
                                <button onClick={(e) => { e.stopPropagation(); deletePericia(pericia.id); }}><Trash2 /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}
