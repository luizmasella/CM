// src/components/PericiasTable.tsx
import React, { useRef } from 'react';
import { Pericia } from '../types';
import { statusConfig } from '../config/constants';
import { Edit2, Trash2 } from 'lucide-react';

interface PericiasTableProps {
  pericias: Pericia[];
  deletingId: number | null;
  onViewDetails: (pericia: Pericia) => void;
  onOpenProcess: (pericia: Pericia) => void;
  onEdit: (pericia: Pericia, triggerRef: React.MutableRefObject<HTMLElement | null>) => void;
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

  // Create a ref for each row's edit button
  const editButtonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  return (
    <table className="w-full">
      {/* ... thead ... */}
      <tbody className="bg-white divide-y divide-gray-200">
        {pericias.map((pericia, index) => {
          const StatusIcon = statusConfig[pericia.status]?.icon;
          const isDeleting = deletingId === pericia.id;

          return (
            <tr
              key={pericia.id}
              onClick={() => onViewDetails(pericia)}
              className={`hover:bg-gray-50 transition-colors cursor-pointer ${isDeleting ? 'opacity-50' : ''}`}
            >
              {/* ... other tds ... */}
              <td className="px-3 py-3 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    ref={el => editButtonRefs.current[index] = el}
                    onClick={(e) => {
                      e.stopPropagation();
                      const ref = { current: editButtonRefs.current[index] };
                      onEdit(pericia, ref);
                    }}
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
