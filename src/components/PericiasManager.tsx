// FILE: src/components/PericiasManager.tsx

import React from 'react';
import { Plus, Download, Edit2, Trash2, AlertCircle, Search, Filter } from 'lucide-react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';

interface PericiasManagerProps {
  statusConfig: any;
  exportarRelatorio: () => void;
}

export default function PericiasManager({ statusConfig, exportarRelatorio }: PericiasManagerProps) {
  const { deletePericia, filteredPericias, pericias, searchTerm, setSearchTerm, filterStatus, setFilterStatus } = usePericias();
  const { handleShowNewForm, handleEdit, handleViewDetails, openProcessPage } = useUI();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Perícias</h2>
        <div className="flex gap-3">
          <button onClick={exportarRelatorio} className="..."><Download size={18} /> Exportar</button>
          <button onClick={handleShowNewForm} className="..."><Plus size={20} /> Nova Perícia</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="..." />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="...">
            <option value="todos">Todos os Status</option>
            {Object.entries(statusConfig).map(([key, config]: [string, any]) => (<option key={key} value={key}>{config.label}</option>))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
            {/* ... Tabela ... */}
            <tbody>
                {filteredPericias.map(pericia => (
                    <tr key={pericia.id} onClick={() => handleViewDetails(pericia)}>
                        {/* ... Células ... */}
                        <td>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(pericia); }}> <Edit2 size={18} /> </button>
                            <button onClick={(e) => { e.stopPropagation(); deletePericia(pericia.id); }}> <Trash2 size={18} /> </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
