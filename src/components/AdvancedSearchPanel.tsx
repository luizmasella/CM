// src/components/AdvancedSearchPanel.tsx
import React from 'react';
import { Filter, X, Clock, Calendar } from 'lucide-react';

interface AdvancedFilters {
  vara: string;
  juiz: string;
  regiao: string;
  reclamada: string;
  tipo: string;
  tipoPrazo: string;
  statusPrazo: string;
}

interface UniqueValues {
  varas: string[];
  juizes: string[];
  regioes: string[];
  tipos: string[];
}

interface AdvancedSearchPanelProps {
  advancedFilters: AdvancedFilters;
  onFilterChange: (filters: AdvancedFilters) => void;
  uniqueValues: UniqueValues;
}

export default function AdvancedSearchPanel({
  advancedFilters,
  onFilterChange,
  uniqueValues,
}: AdvancedSearchPanelProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...advancedFilters, [name]: value });
  };

  const handleClearAdvancedFilters = () => {
    onFilterChange({
      vara: '', juiz: '', regiao: '', reclamada: '', tipo: '',
      tipoPrazo: 'todos', statusPrazo: 'todos'
    });
  };

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4 space-y-4">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Filter size={18} />
        Filtros Avançados
      </h3>

      {/* Linha 1: Vara, Juiz, Região */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vara</label>
          <select
            name="vara"
            value={advancedFilters.vara}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Todas as Varas</option>
            {uniqueValues.varas.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Juiz(a)</label>
          <select
            name="juiz"
            value={advancedFilters.juiz}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Todos os Juízes</option>
            {uniqueValues.juizes.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
          <select
            name="regiao"
            value={advancedFilters.regiao}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Todas as Regiões</option>
            {uniqueValues.regioes.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Linha 2: Reclamada, Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reclamada (busca parcial)</label>
          <input
            type="text"
            name="reclamada"
            value={advancedFilters.reclamada}
            onChange={handleChange}
            placeholder="Digite parte do nome..."
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Perícia</label>
          <select
            name="tipo"
            value={advancedFilters.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="">Todos os Tipos</option>
            {uniqueValues.tipos.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Linha 3: Filtros de Prazos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="inline mr-1" size={14} />
            Tipo de Prazo
          </label>
          <select
            name="tipoPrazo"
            value={advancedFilters.tipoPrazo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="todos">Todos</option>
            <option value="laudo">Apenas com Prazo de Laudo</option>
            <option value="quesitos">Apenas com Prazo de Quesitos</option>
            <option value="ambos">Com Ambos os Prazos</option>
            <option value="sem_prazo">Sem Prazos Definidos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline mr-1" size={14} />
            Status do Prazo
          </label>
          <select
            name="statusPrazo"
            value={advancedFilters.statusPrazo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          >
            <option value="todos">Todos</option>
            <option value="vencido">Vencidos</option>
            <option value="7dias">Próximos 7 Dias</option>
            <option value="15dias">Próximos 15 Dias</option>
            <option value="normal">Normal (Mais de 15 dias)</option>
          </select>
        </div>
      </div>

      {/* Botão Limpar Filtros Avançados */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleClearAdvancedFilters}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
        >
          <X size={14} />
          Limpar Filtros Avançados
        </button>
      </div>
    </div>
  );
}
