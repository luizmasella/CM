// FILE: src/components/PericiasManager.tsx

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Gerenciar Perícias</h2>
            <div className="flex gap-3">
                <button onClick={exportarRelatorio} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"><Download size={18} /> Exportar</button>
                <button onClick={handleShowNewForm} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"><Plus size={20} /> Nova Perícia</button>
            </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text"
                    placeholder="Buscar por processo ou reclamante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pl-10"
                />
            </div>
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pl-10 appearance-none"
                >
                    <option value="todos">Todos os Status</option>
                    {Object.entries(statusConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Processo</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reclamante</th>
                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Data</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tipo</th>
                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPericias.map(pericia => {
                        const StatusIcon = statusConfig[pericia.status]?.icon;
                        return (
                            <tr key={pericia.id} onClick={() => handleViewDetails(pericia)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                <td className="px-3 py-3 whitespace-nowrap">
                                    <button onClick={(e) => { e.stopPropagation(); openProcessPage(pericia); }} className="text-sm font-medium text-blue-600 hover:text-blue-800 underline transition-colors">{pericia.numeroProcesso}</button>
                                </td>
                                <td className="px-3 py-3"><p className="text-sm font-medium text-gray-900">{pericia.reclamante}</p></td>
                                <td className="px-3 py-3 text-center whitespace-nowrap"><div><p className="text-sm font-medium text-gray-900">{new Date(pericia.data).toLocaleDateString('pt-BR')}</p><p className="text-xs text-gray-500">{pericia.hora}</p></div></td>
                                <td className="px-3 py-3 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{pericia.tipo}</span></td>
                                <td className="px-3 py-3 whitespace-nowrap text-center">
                                    {statusConfig[pericia.status] && (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[pericia.status].color}`}>
                                            {StatusIcon && <StatusIcon size={12} className="mr-1" />}
                                            {statusConfig[pericia.status].label}
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(pericia); }} className="text-blue-600 hover:text-blue-900 transition-colors" title="Editar"><Edit2 size={18} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deletePericia(pericia.id); }} className="text-red-600 hover:text-red-900 transition-colors" title="Excluir"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {filteredPericias.length === 0 && <div className="text-center py-12"><AlertCircle className="mx-auto text-gray-400 mb-3" size={48} /><p className="text-gray-500">Nenhuma perícia encontrada</p></div>}
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600"><p>Mostrando <span className="font-semibold">{filteredPericias.length}</span> de <span className="font-semibold">{pericias.length}</span> perícias</p></div>
    </div>
  );
}
