// FILE: src/components/PericiasManager.tsx
// VERSÃO COMPLETA COM EXPORTAÇÃO E TODAS AS FUNCIONALIDADES

import React, { useState } from "react";
import {
  Plus,
  Download,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import { usePericias } from "../context/PericiasContext";

// Importe o hook de exportação (você criará esse arquivo)
// import { useExport } from "../utils/export";

interface PericiasManagerProps {
  handleShowNewForm: () => void;
  handleEdit: (pericia: any) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
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
  const { deletePericia, stats } = usePericias();
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Descomente quando criar o arquivo export.ts
  // const { exportToCSV, exportToExcel, exportToPDF, exportStatsReport } = useExport();

  // Função temporária de exportação (substitua depois)
  const handleExportCSV = () => {
    // Implementação básica de CSV
    const headers = ["Processo", "Reclamante", "Tipo", "Data", "Status", "Honorários"];
    const rows = filteredPericias.map(p => [
      p.numeroProcesso,
      p.reclamante,
      p.tipo,
      new Date(p.data).toLocaleDateString("pt-BR"),
      statusConfig[p.status]?.label || p.status,
      `R$ ${p.honorariosDeferidos.toFixed(2)}`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pericias.csv";
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    alert("Função de exportação Excel - Implemente com o arquivo export.ts");
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    window.print();
    setShowExportMenu(false);
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Perícias</h2>
        <div className="flex gap-3">
          {/* Botão de exportação com menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Download size={18} /> Exportar
            </button>

            {/* Menu de exportação */}
            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-2">
                  <button
                    onClick={handleExportCSV}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-gray-900">Exportar CSV</p>
                      <p className="text-xs text-gray-500">Excel, Sheets</p>
                    </div>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="font-medium text-gray-900">Exportar Excel</p>
                      <p className="text-xs text-gray-500">Formato XLS</p>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-2xl">📑</span>
                    <div>
                      <p className="font-medium text-gray-900">Imprimir/PDF</p>
                      <p className="text-xs text-gray-500">Relatório completo</p>
                    </div>
                  </button>
                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => {
                      alert("Relatório estatístico - Implemente com export.ts");
                      setShowExportMenu(false);
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="font-medium text-gray-900">Relatório Estatístico</p>
                      <p className="text-xs text-gray-500">Resumo em TXT</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleShowNewForm}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            <Plus size={20} /> Nova Perícia
          </button>
        </div>
      </div>

      {/* FILTROS */}
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

      {/* CONTADOR DE RESULTADOS */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando <span className="font-semibold">{filteredPericias.length}</span> de{" "}
        <span className="font-semibold">{pericias.length}</span> perícias
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Processo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reclamante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Honorários
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPericias.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={48} className="text-gray-300" />
                    <p className="text-lg font-medium">Nenhuma perícia encontrada</p>
                    <p className="text-sm">
                      {searchTerm || filterStatus !== "todos"
                        ? "Tente ajustar os filtros de busca"
                        : "Clique em 'Nova Perícia' para começar"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPericias.map((pericia) => {
                const status = statusConfig[pericia.status] || {};
                const StatusIcon = status.icon || FileText;

                return (
                  <tr
                    key={pericia.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openProcessPage(pericia)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pericia.numeroProcesso}
                      </div>
                      <div className="text-xs text-gray-500">{pericia.vara}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {pericia.reclamante}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pericia.reclamadas.length} reclamada(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pericia.tipo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(pericia.data)}
                      </div>
                      <div className="text-xs text-gray-500">{pericia.hora}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {StatusIcon && <StatusIcon size={12} className="mr-1" />}
                        {status.label || pericia.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        R${" "}
                        {pericia.honorariosDeferidos.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        Solicitado: R${" "}
                        {pericia.honorariosSolicitados.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(pericia);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(pericia);
                          }}
                          className="text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-yellow-50 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePericia(pericia.id);
                          }}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* RODAPÉ COM RESUMO */}
      {filteredPericias.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">Total de Perícias</p>
              <p className="text-lg font-bold text-blue-700">
                {filteredPericias.length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">Hon. Deferidos</p>
              <p className="text-lg font-bold text-green-700">
                R${" "}
                {filteredPericias
                  .reduce((sum, p) => sum + p.honorariosDeferidos, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">Hon. Solicitados</p>
              <p className="text-lg font-bold text-yellow-700">
                R${" "}
                {filteredPericias
                  .reduce((sum, p) => sum + p.honorariosSolicitados, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">Taxa de Deferimento</p>
              <p className="text-lg font-bold text-purple-700">
                {filteredPericias.length > 0
                  ? (
                      (filteredPericias.reduce(
                        (sum, p) => sum + p.honorariosDeferidos,
                        0
                      ) /
                        filteredPericias.reduce(
                          (sum, p) => sum + p.honorariosSolicitados,
                          0
                        )) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

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

      {/* FILTROS */}
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

      {/* CONTADOR DE RESULTADOS */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando <span className="font-semibold">{filteredPericias.length}</span> de{" "}
        <span className="font-semibold">{pericias.length}</span> perícias
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Processo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reclamante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Honorários
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPericias.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={48} className="text-gray-300" />
                    <p className="text-lg font-medium">Nenhuma perícia encontrada</p>
                    <p className="text-sm">
                      {searchTerm || filterStatus !== "todos"
                        ? "Tente ajustar os filtros de busca"
                        : "Clique em 'Nova Perícia' para começar"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPericias.map((pericia) => {
                const status = statusConfig[pericia.status] || {};
                const StatusIcon = status.icon || FileText;

                return (
                  <tr
                    key={pericia.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openProcessPage(pericia)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {pericia.numeroProcesso}
                      </div>
                      <div className="text-xs text-gray-500">{pericia.vara}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {pericia.reclamante}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pericia.reclamadas.length} reclamada(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pericia.tipo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(pericia.data)}
                      </div>
                      <div className="text-xs text-gray-500">{pericia.hora}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {StatusIcon && <StatusIcon size={12} className="mr-1" />}
                        {status.label || pericia.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        R${" "}
                        {pericia.honorariosDeferidos.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        Solicitado: R${" "}
                        {pericia.honorariosSolicitados.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(pericia);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(pericia);
                          }}
                          className="text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-yellow-50 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePericia(pericia.id);
                          }}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* RODAPÉ COM RESUMO */}
      {filteredPericias.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">Total de Perícias</p>
              <p className="text-lg font-bold text-blue-700">
                {filteredPericias.length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">Hon. Deferidos</p>
              <p className="text-lg font-bold text-green-700">
                R${" "}
                {filteredPericias
                  .reduce((sum, p) => sum + p.honorariosDeferidos, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">Hon. Solicitados</p>
              <p className="text-lg font-bold text-yellow-700">
                R${" "}
                {filteredPericias
                  .reduce((sum, p) => sum + p.honorariosSolicitados, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">Taxa de Deferimento</p>
              <p className="text-lg font-bold text-purple-700">
                {filteredPericias.length > 0
                  ? (
                      (filteredPericias.reduce(
                        (sum, p) => sum + p.honorariosDeferidos,
                        0
                      ) /
                        filteredPericias.reduce(
                          (sum, p) => sum + p.honorariosSolicitados,
                          0
                        )) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
