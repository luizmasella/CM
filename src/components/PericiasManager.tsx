// FILE: src/components/PericiasManager.tsx
import React, { useState, useMemo } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import { statusConfig } from '../config/constants';
import { Plus, Download, Edit2, Trash2, AlertCircle, Search, Filter, X, ChevronDown, ChevronUp, Calendar, Clock } from 'lucide-react';

export default function PericiasManager() {
  const { 
    deletePericia, 
    pericias, 
    searchTerm, 
    setSearchTerm, 
    filterStatus, 
    setFilterStatus, 
    filterDate,
    setFilterDate,
    clearAllFilters,
    filteredPericias: contextFilteredPericias,
    isPrazoVencido,
    getPrazoStatus
  } = usePericias();
  
  const { handleShowNewForm, handleEdit, handleViewDetails, openProcessPage } = useUI();
  const { toast } = useToast();
  
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  // Filtros avançados locais
  const [advancedFilters, setAdvancedFilters] = useState({
    vara: '',
    juiz: '',
    regiao: '',
    reclamada: '',
    tipo: '',
    tipoPrazo: 'todos', // NOVO: laudo, quesitos, todos
    statusPrazo: 'todos' // NOVO: vencido, 7dias, 15dias, normal, todos
  });

  // Extrai valores únicos para os dropdowns
  const uniqueValues = useMemo(() => {
    const varas = new Set<string>();
    const juizes = new Set<string>();
    const regioes = new Set<string>();
    const tipos = new Set<string>();

    pericias.forEach(p => {
      if (p.vara) varas.add(p.vara);
      if (p.juiz) juizes.add(p.juiz);
      if (p.regiao) regioes.add(p.regiao);
      if (p.tipo) tipos.add(p.tipo);
    });

    return {
      varas: Array.from(varas).sort(),
      juizes: Array.from(juizes).sort(),
      regioes: Array.from(regioes).sort(),
      tipos: Array.from(tipos).sort()
    };
  }, [pericias]);

  // Filtra com filtros avançados + filtros de prazos
  const filteredPericias = useMemo(() => {
    let result = contextFilteredPericias;

    // Filtros avançados existentes
    if (advancedFilters.vara) {
      result = result.filter(p =>
        p.vara.toLowerCase().includes(advancedFilters.vara.toLowerCase())
      );
    }

    if (advancedFilters.juiz) {
      result = result.filter(p =>
        p.juiz.toLowerCase().includes(advancedFilters.juiz.toLowerCase())
      );
    }

    if (advancedFilters.regiao) {
      result = result.filter(p =>
        p.regiao.toLowerCase().includes(advancedFilters.regiao.toLowerCase())
      );
    }

    if (advancedFilters.reclamada) {
      result = result.filter(p =>
        p.reclamadas.some(r =>
          r.toLowerCase().includes(advancedFilters.reclamada.toLowerCase())
        )
      );
    }

    if (advancedFilters.tipo) {
      result = result.filter(p =>
        p.tipo.toLowerCase().includes(advancedFilters.tipo.toLowerCase())
      );
    }

    // NOVO: Filtro por tipo de prazo
    if (advancedFilters.tipoPrazo !== 'todos') {
      result = result.filter(p => {
        if (advancedFilters.tipoPrazo === 'laudo') {
          return p.prazoLaudo !== null && p.prazoLaudo !== '';
        }
        if (advancedFilters.tipoPrazo === 'quesitos') {
          return p.prazoQuesitos !== null && p.prazoQuesitos !== '';
        }
        if (advancedFilters.tipoPrazo === 'ambos') {
          return (p.prazoLaudo !== null && p.prazoLaudo !== '') && 
                 (p.prazoQuesitos !== null && p.prazoQuesitos !== '');
        }
        if (advancedFilters.tipoPrazo === 'sem_prazo') {
          return (p.prazoLaudo === null || p.prazoLaudo === '') && 
                 (p.prazoQuesitos === null || p.prazoQuesitos === '');
        }
        return true;
      });
    }

    // NOVO: Filtro por status do prazo
    if (advancedFilters.statusPrazo !== 'todos') {
      result = result.filter(p => {
        const statusLaudo = getPrazoStatus(p.prazoLaudo);
        const statusQuesitos = getPrazoStatus(p.prazoQuesitos);
        
        // Se qualquer um dos prazos tem o status procurado
        return statusLaudo === advancedFilters.statusPrazo || 
               statusQuesitos === advancedFilters.statusPrazo;
      });
    }

    return result;
  }, [contextFilteredPericias, advancedFilters, getPrazoStatus]);
  
  const exportarRelatorio = () => {
    toast.info('📊 Funcionalidade de exportação está na aba Relatórios');
  };

  const handleDelete = async (id: number, numeroProcesso: string) => {
    const confirmed = window.confirm(
      `⚠️ Deseja realmente excluir a perícia?\n\nProcesso: ${numeroProcesso}\n\nEsta ação não pode ser desfeita!`
    );
    
    if (confirmed) {
      setDeletingId(id);
      
      setTimeout(() => {
        deletePericia(id);
        setDeletingId(null);
        toast.success('✅ Perícia excluída com sucesso!');
      }, 300);
    }
  };

  const handleClearAllFilters = () => {
    clearAllFilters();
    setAdvancedFilters({
      vara: '',
      juiz: '',
      regiao: '',
      reclamada: '',
      tipo: '',
      tipoPrazo: 'todos',
      statusPrazo: 'todos'
    });
    toast.info('🔄 Todos os filtros foram limpos');
  };

  // NOVO: Função para renderizar indicador de prazo
  const renderPrazoIndicator = (prazo: string | null, tipo: 'laudo' | 'quesitos') => {
    if (!prazo) return null;
    
    const status = getPrazoStatus(prazo);
    const dataFormatada = new Date(prazo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    const configs = {
      'vencido': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: '🔴' },
      '7dias': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', icon: '⚡' },
      '15dias': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', icon: '⏰' },
      'normal': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', icon: '✅' }
    };
    
    const config = configs[status];
    const label = tipo === 'laudo' ? 'L' : 'Q';
    
    return (
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.bg} ${config.text} border ${config.border}`}>
        <span>{config.icon}</span>
        <span className="font-medium">{label}:</span>
        <span>{dataFormatada}</span>
      </div>
    );
  };

  const hasActiveFilters = 
    searchTerm !== '' || 
    filterStatus !== 'todos' ||
    filterDate !== '' ||
    advancedFilters.vara !== '' ||
    advancedFilters.juiz !== '' ||
    advancedFilters.regiao !== '' ||
    advancedFilters.reclamada !== '' ||
    advancedFilters.tipo !== '' ||
    advancedFilters.tipoPrazo !== 'todos' ||
    advancedFilters.statusPrazo !== 'todos';

  const activeFiltersCount = 
    (searchTerm ? 1 : 0) +
    (filterStatus !== 'todos' ? 1 : 0) +
    (filterDate ? 1 : 0) +
    (advancedFilters.vara ? 1 : 0) +
    (advancedFilters.juiz ? 1 : 0) +
    (advancedFilters.regiao ? 1 : 0) +
    (advancedFilters.reclamada ? 1 : 0) +
    (advancedFilters.tipo ? 1 : 0) +
    (advancedFilters.tipoPrazo !== 'todos' ? 1 : 0) +
    (advancedFilters.statusPrazo !== 'todos' ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Gerenciar Perícias</h2>
          <div className="flex gap-3">
              <button 
                onClick={exportarRelatorio} 
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Download size={18} /> 
                Exportar
              </button>
              <button 
                onClick={handleShowNewForm} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                <Plus size={20} /> 
                Nova Perícia
              </button>
          </div>
      </div>
    
      {/* FILTROS BÁSICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por processo ou reclamante..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Limpar busca"
                >
                  <X size={18} />
                </button>
              )}
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

      {/* BOTÃO BUSCA AVANÇADA */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
        >
          {showAdvancedSearch ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          Busca Avançada
          {activeFiltersCount > 2 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              +{activeFiltersCount - 2}
            </span>
          )}
        </button>
      </div>

      {/* FILTROS AVANÇADOS */}
      {showAdvancedSearch && (
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Search size={18} />
            Filtros Avançados
          </h3>
          
          {/* Linha 1: Filtros básicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vara</label>
              <div className="relative">
                <input
                  type="text"
                  list="varas-list"
                  placeholder="Digite ou selecione..."
                  value={advancedFilters.vara}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, vara: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pr-8"
                />
                <datalist id="varas-list">
                  {uniqueValues.varas.map(vara => (
                    <option key={vara} value={vara} />
                  ))}
                </datalist>
                {advancedFilters.vara && (
                  <button
                    onClick={() => setAdvancedFilters(prev => ({ ...prev, vara: '' }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Limpar"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{uniqueValues.varas.length} vara(s)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Juiz(a)</label>
              <div className="relative">
                <input
                  type="text"
                  list="juizes-list"
                  placeholder="Digite ou selecione..."
                  value={advancedFilters.juiz}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, juiz: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pr-8"
                />
                <datalist id="juizes-list">
                  {uniqueValues.juizes.map(juiz => (
                    <option key={juiz} value={juiz} />
                  ))}
                </datalist>
                {advancedFilters.juiz && (
                  <button
                    onClick={() => setAdvancedFilters(prev => ({ ...prev, juiz: '' }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Limpar"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{uniqueValues.juizes.length} juiz(a)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
              <div className="relative">
                <input
                  type="text"
                  list="regioes-list"
                  placeholder="Digite ou selecione..."
                  value={advancedFilters.regiao}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, regiao: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pr-8"
                />
                <datalist id="regioes-list">
                  {uniqueValues.regioes.map(regiao => (
                    <option key={regiao} value={regiao} />
                  ))}
                </datalist>
                {advancedFilters.regiao && (
                  <button
                    onClick={() => setAdvancedFilters(prev => ({ ...prev, regiao: '' }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Limpar"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{uniqueValues.regioes.length} região(ões)</p>
            </div>
          </div>

          {/* Linha 2: Reclamada e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reclamada</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o nome..."
                  value={advancedFilters.reclamada}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, reclamada: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pr-8"
                />
                {advancedFilters.reclamada && (
                  <button
                    onClick={() => setAdvancedFilters(prev => ({ ...prev, reclamada: '' }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Limpar"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Busca por texto livre</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <div className="relative">
                <input
                  type="text"
                  list="tipos-list"
                  placeholder="Digite ou selecione..."
                  value={advancedFilters.tipo}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 pr-8"
                />
                <datalist id="tipos-list">
                  {uniqueValues.tipos.map(tipo => (
                    <option key={tipo} value={tipo} />
                  ))}
                </datalist>
                {advancedFilters.tipo && (
                  <button
                    onClick={() => setAdvancedFilters(prev => ({ ...prev, tipo: '' }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Limpar"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{uniqueValues.tipos.length} tipo(s)</p>
            </div>
          </div>

          {/* NOVO: Linha 3 - Filtros de Prazos */}
          <div className="border-t-2 border-gray-300 pt-4 mt-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock size={16} />
              Filtros de Prazos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Prazo</label>
                <select
                  value={advancedFilters.tipoPrazo}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, tipoPrazo: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2"
                >
                  <option value="todos">Todos</option>
                  <option value="laudo">Apenas Laudo</option>
                  <option value="quesitos">Apenas Quesitos</option>
                  <option value="ambos">Laudo E Quesitos</option>
                  <option value="sem_prazo">Sem Prazo Definido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status do Prazo</label>
                <select
                  value={advancedFilters.statusPrazo}
                  onChange={(e) => setAdvancedFilters(prev => ({ ...prev, statusPrazo: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2"
                >
                  <option value="todos">Todos</option>
                  <option value="vencido">🔴 Vencidos</option>
                  <option value="7dias">⚡ Próximos 7 dias</option>
                  <option value="15dias">⏰ Próximos 15 dias</option>
                  <option value="normal">✅ Normal (mais de 15 dias)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dica de uso */}
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
            <p className="text-xs text-blue-800">
              <strong>💡 Dica:</strong> Use os filtros de prazos para encontrar rapidamente perícias com prazos urgentes. 
              L = Laudo, Q = Quesitos.
            </p>
          </div>
        </div>
      )}

      {/* Indicador de Filtros Ativos */}
      {hasActiveFilters && (
        <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="text-blue-600" size={18} />
            <span className="text-sm text-blue-800 font-medium">
              {activeFiltersCount} filtro(s) ativo(s):
            </span>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  Busca: "{searchTerm}"
                </span>
              )}
              {filterStatus !== 'todos' && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  Status: {statusConfig[filterStatus]?.label}
                </span>
              )}
              {filterDate && (
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                  📅 Data: {new Date(filterDate).toLocaleDateString('pt-BR')}
                </span>
              )}
              {advancedFilters.vara && (
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                  Vara: {advancedFilters.vara}
                </span>
              )}
              {advancedFilters.juiz && (
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                  Juiz: {advancedFilters.juiz}
                </span>
              )}
              {advancedFilters.regiao && (
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                  Região: {advancedFilters.regiao}
                </span>
              )}
              {advancedFilters.reclamada && (
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                  Reclamada: {advancedFilters.reclamada}
                </span>
              )}
              {advancedFilters.tipo && (
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                  Tipo: {advancedFilters.tipo}
                </span>
              )}
              {advancedFilters.tipoPrazo !== 'todos' && (
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                  Prazo: {advancedFilters.tipoPrazo}
                </span>
              )}
              {advancedFilters.statusPrazo !== 'todos' && (
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                  Status: {advancedFilters.statusPrazo}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleClearAllFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 ml-4"
          >
            <X size={16} />
            Limpar Todos
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
          <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Processo</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reclamante</th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Data</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Prazos</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tipo</th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Ações</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPericias.map(pericia => {
                      const StatusIcon = statusConfig[pericia.status]?.icon;
                      const isDeleting = deletingId === pericia.id;
                      
                      return (
                          <tr 
                            key={pericia.id} 
                            onClick={() => handleViewDetails(pericia)} 
                            className={`hover:bg-gray-50 transition-colors cursor-pointer ${isDeleting ? 'opacity-50' : ''}`}
                          >
                              <td className="px-3 py-3 whitespace-nowrap">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); openProcessPage(pericia); }} 
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline transition-colors"
                                  >
                                    {pericia.numeroProcesso}
                                  </button>
                              </td>
                              <td className="px-3 py-3">
                                <p className="text-sm font-medium text-gray-900">{pericia.reclamante}</p>
                              </td>
                              <td className="px-3 py-3 text-center whitespace-nowrap">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {new Date(pericia.data).toLocaleDateString('pt-BR')}
                                  </p>
                                  <p className="text-xs text-gray-500">{pericia.hora}</p>
                                </div>
                              </td>
                              {/* NOVA COLUNA DE PRAZOS */}
                              <td className="px-3 py-3">
                                <div className="flex flex-col gap-1">
                                  {renderPrazoIndicator(pericia.prazoLaudo, 'laudo')}
                                  {renderPrazoIndicator(pericia.prazoQuesitos, 'quesitos')}
                                  {!pericia.prazoLaudo && !pericia.prazoQuesitos && (
                                    <span className="text-xs text-gray-400">Sem prazo</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {pericia.tipo}
                                </span>
                              </td>
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
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleEdit(pericia); }} 
                                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded" 
                                        title="Editar"
                                        disabled={isDeleting}
                                      >
                                        <Edit2 size={18} />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(pericia.id, pericia.numeroProcesso); }} 
                                        className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed" 
                                        title="Excluir"
                                        disabled={isDeleting}
                                      >
                                        {isDeleting ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                        ) : (
                                          <Trash2 size={18} />
                                        )}
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      );
                  })}
              </tbody>
          </table>
          
          {filteredPericias.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500 font-medium">Nenhuma perícia encontrada</p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Limpar filtros e ver todas
                </button>
              )}
            </div>
          )}
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <p>
          Mostrando <span className="font-semibold">{filteredPericias.length}</span> de{' '}
          <span className="font-semibold">{pericias.length}</span> perícias
        </p>
        {hasActiveFilters && (
          <p className="text-blue-600 font-medium">
            ✓ {activeFiltersCount} filtro(s) aplicado(s)
          </p>
        )}
      </div>
    </div>
  );
}
