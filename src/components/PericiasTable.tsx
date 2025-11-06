// src/components/PericiasTable.tsx
import React from 'react';
import { Pericia } from '../types';
import { statusConfig } from '../config/constants';
import { Edit2, Trash2 } from 'lucide-react';

interface PericiasTableProps {
  pericias: Pericia[];
  deletingId: number | null;
  onViewDetails: (pericia: Pericia) => void;
  onOpenProcess: (pericia: Pericia) => void;
  onEdit: (pericia: Pericia) => void;
  onDelete: (id: number, numeroProcesso: string) => void;
  renderPrazoIndicator: (prazo: string | null, tipo: 'laudo' | 'quesitos') => React.ReactNode;
}

export default function PericiasTable({
  pericias,
  deletingId,
  onViewDetails,
  onOpenProcess,
  onEdit,
  onDelete,
  renderPrazoIndicator,
}: PericiasTableProps) {
  return (
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
        {pericias.map(pericia => {
          const StatusIcon = statusConfig[pericia.status]?.icon;
          const isDeleting = deletingId === pericia.id;

          return (
            <tr
              key={pericia.id}
              onClick={() => onViewDetails(pericia)}
              className={`hover:bg-gray-50 transition-colors cursor-pointer ${isDeleting ? 'opacity-50' : ''}`}
            >
              <td className="px-3 py-3 whitespace-nowrap">
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenProcess(pericia); }}
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
                    onClick={(e) => { e.stopPropagation(); onEdit(pericia); }}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                    title="Editar"
                    disabled={isDeleting}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(pericia.id, pericia.numeroProcesso); }}
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
  );
}
