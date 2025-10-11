// FILE: src/components/PericiasManager.tsx (VERSÃO FINAL COM FILTROS)

import React from "react";
import {
  Plus,
  Download,
  Edit2,
  Trash2,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { usePericias } from "../context/PericiasContext";

interface PericiasManagerProps {
  // ... (outras props continuam as mesmas)
  handleShowNewForm: () => void;
  handleEdit: (pericia: any) => void;

  // NOVAS PROPS PARA OS FILTROS
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;

  // Dados que ainda vem do App
  filteredPericias: any[];
  pericias: any[];
  statusConfig: any;
  exportarRelatorio: () => void;
  handleViewDetails: (pericia: any) => void;
  openProcessPage: (pericia: any) => void;
}

export default function PericiasManager({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filteredPericias,
  pericias,
  statusConfig,
  exportarRelatorio,
  handleShowNewForm,
  handleViewDetails,
  openProcessPage,
  handleEdit,
}: PericiasManagerProps) {
  const { deletePericia } = usePericias();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Perícias</h2>
        <div className="flex gap-3">
          <button
            onClick={exportarRelatorio}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Download size={18} /> Exportar
          </button>
          <button
            onClick={handleShowNewForm}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            <Plus size={20} /> Nova Perícia
          </button>
        </div>
      </div>

      {/* AQUI ESTÃO OS NOVOS CAMPOS DE FILTRO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por processo ou reclamante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pl-10"
          />
        </div>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pl-10 appearance-none"
          >
            <option value="todos">Todos os Status</option>
            {Object.entries(statusConfig).map(
              ([key, config]: [string, any]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* ... (O resto do componente com a tabela continua exatamente o mesmo) ... */}
        {/* ... */}
      </div>
    </div>
  );
}
