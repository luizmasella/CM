// FILE: src/components/PericiasManager.tsx
import React from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { statusConfig } from '../config/constants';
import { Plus, Download, Edit2, Trash2, Search, Filter } from 'lucide-react';

export default function PericiasManager() {
  const { deletePericia, filteredPericias, pericias, searchTerm, setSearchTerm, filterStatus, setFilterStatus } = usePericias();
  const { handleShowNewForm, handleEdit, handleViewDetails } = useUI();
  const exportarRelatorio = () => alert('Exportando...');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Perícias</h2>
        <div className="flex gap-2">
          <button onClick={exportarRelatorio} className="..."><Download size={18}/> Exportar</button>
          <button onClick={handleShowNewForm} className="..."><Plus size={20}/> Nova Perícia</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar..." className="w-full border p-2 rounded"/>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full border p-2 rounded">
            <option value="todos">Todos</option>
            {Object.entries(statusConfig).map(([key, config]) => <option key={key} value={key}>{config.label}</option>)}
        </select>
      </div>
      <table className="w-full">
        <thead><tr><th>Processo</th><th>Reclamante</th><th>Ações</th></tr></thead>
        <tbody>
          {filteredPericias.map(pericia => (
            <tr key={pericia.id} onClick={() => handleViewDetails(pericia)} className="cursor-pointer hover:bg-gray-100">
              <td>{pericia.numeroProcesso}</td>
              <td>{pericia.reclamante}</td>
              <td className="flex gap-2">
                <button onClick={e => {e.stopPropagation(); handleEdit(pericia);}}><Edit2/></button>
                <button onClick={e => {e.stopPropagation(); deletePericia(pericia.id);}}><Trash2/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
