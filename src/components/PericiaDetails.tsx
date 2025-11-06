// src/components/PericiaDetails.tsx
import React, { useState } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from './ConfirmationModal';
import { statusConfig } from '../config/constants';
import { Edit2, X, AlertTriangle, User, Calendar, Briefcase, DollarSign, Clock, Trash2, Paperclip } from 'lucide-react';

export default function PericiaDetails() {
  const { deletePericia, isPrazoVencido } = usePericias();
  const { showDetails, selectedPericia, closeDetails, handleEdit, setActiveTab } = useUI();
  const { toast } = useToast();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!showDetails || !selectedPericia) { return null; }

  const handleEditClick = () => {
    closeDetails();
    handleEdit(selectedPericia);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    
    try {
      setTimeout(() => {
        const success = deletePericia(selectedPericia.id);
        
        if (success) {
          setShowDeleteModal(false);
          closeDetails();
          toast.success('✅ Perícia excluída com sucesso!');
        } else {
          setIsDeleting(false);
          toast.error('❌ Erro ao excluir perícia. Tente novamente.');
        }
      }, 500);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setIsDeleting(false);
      setShowDeleteModal(false);
      toast.error('❌ Erro inesperado ao excluir perícia!');
    }
  };

  const diasAtraso = (prazo: string | null): number => { 
    if (!prazo) return 0; 
    const hoje = new Date(); 
    hoje.setHours(0, 0, 0, 0); 
    const [ano, mes, dia] = prazo.split('-').map(Number); 
    const dataPrazo = new Date(ano, mes - 1, dia); 
    const diffTime = hoje.getTime() - dataPrazo.getTime(); 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 0; 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl z-10">
          {/* Header content... */}
        </div>

        <div className="p-6">
          {/* Prazo Vencido alert... */}

          <div className="space-y-6">
            {/* Partes and Datas sections... */}

            {/* Informações Processuais and Honorários sections... */}

            {selectedPericia.observacoes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">📝 Observações</h4>
                <p className="whitespace-pre-wrap">{selectedPericia.observacoes}</p>
              </div>
            )}

            {selectedPericia.files && selectedPericia.files.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Paperclip size={18} /> Anexos
                </h4>
                <div className="space-y-2">
                  {selectedPericia.files.map((file, index) => (
                    <a
                      key={index}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-white p-2 rounded-md border"
                    >
                      <Paperclip size={16} className="text-gray-500" />
                      <span className="truncate">{file.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Excluir Perícia?"
        message={`Tem certeza que deseja excluir permanentemente a perícia do processo:\n\n${selectedPericia.numeroProcesso}\n\nReclamante: ${selectedPericia.reclamante}\n\nEsta ação NÃO pode ser desfeita!`}
        confirmText={isDeleting ? "Excluindo..." : "Sim, excluir"}
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </div>
  );
}
