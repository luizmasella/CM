// FILE: src/components/PericiaDetails.tsx
// CORREÇÃO FINAL - Agora chama o formulário correto!

import React, { useState } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from './ConfirmationModal';
import { statusConfig } from '../config/constants';
import { Edit2, X, AlertTriangle, User, Calendar, Briefcase, DollarSign, Clock, Trash2 } from 'lucide-react';

export default function PericiaDetails() {
  const { deletePericia, isPrazoVencido } = usePericias();
  const { showDetails, selectedPericia, closeDetails, handleEdit, setActiveTab } = useUI();
  const { toast } = useToast();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!showDetails || !selectedPericia) { return null; }

  const handleEditClick = () => {
    // CORREÇÃO: Fecha modal e abre o FORMULÁRIO (PericiaForm.tsx)
    closeDetails();
    handleEdit(selectedPericia); // Isso define editingId e abre showForm
    toast.success('📝 Abrindo formulário de edição completo...');
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
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">Detalhes da Perícia</h3>
              <p className="text-blue-100 mt-1">Processo: {selectedPericia.numeroProcesso}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleEditClick}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                disabled={isDeleting}
              >
                <Edit2 size={18} /> Editar
              </button>
              <button 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                <Trash2 size={18} /> 
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
              <button 
                onClick={closeDetails} 
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {(isPrazoVencido(selectedPericia.prazoLaudo) || isPrazoVencido(selectedPericia.prazoQuesitos)) && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3 mb-6 animate-pulse">
              <AlertTriangle className="text-red-600" size={24} />
              <div>
                <p className="font-semibold text-red-800">Prazo Vencido!</p>
                {isPrazoVencido(selectedPericia.prazoLaudo) && (
                  <p className="text-red-700">Laudo vencido há {diasAtraso(selectedPericia.prazoLaudo)} dias</p>
                )}
                {isPrazoVencido(selectedPericia.prazoQuesitos) && (
                  <p className="text-red-700">Quesitos vencido há {diasAtraso(selectedPericia.prazoQuesitos)} dias</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User size={18} /> Partes
                </h4>
                <p className="mb-2"><strong>Reclamante:</strong> {selectedPericia.reclamante}</p>
                <p><strong>Reclamada(s):</strong></p>
                {selectedPericia.reclamadas.map((r: string, idx: number) => (
                  <p key={idx} className="ml-2">• {r}</p>
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar size={18} /> Datas
                </h4>
                <p className="mb-2"><strong>Data:</strong> {new Date(selectedPericia.data).toLocaleDateString('pt-BR')}</p>
                <p className="mb-2"><strong>Hora:</strong> {selectedPericia.hora}</p>
                {selectedPericia.prazoLaudo && (
                  <p className="mb-2"><strong>Prazo Laudo:</strong> {new Date(selectedPericia.prazoLaudo).toLocaleDateString('pt-BR')}</p>
                )}
                {selectedPericia.prazoQuesitos && (
                  <p><strong>Prazo Quesitos:</strong> {new Date(selectedPericia.prazoQuesitos).toLocaleDateString('pt-BR')}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase size={18} /> Informações Processuais
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Vara:</strong> {selectedPericia.vara}</p>
                <p><strong>Juiz(a):</strong> {selectedPericia.juiz}</p>
                <p><strong>Região:</strong> {selectedPericia.regiao}</p>
                <p><strong>Tipo:</strong> {selectedPericia.tipo}</p>
                <p><strong>Local:</strong> {selectedPericia.local}</p>
                <p><strong>Status:</strong> {statusConfig[selectedPericia.status]?.label}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign size={18} /> Honorários
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Solicitados:</strong> R$ {selectedPericia.honorariosSolicitados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p><strong>Deferidos:</strong> R$ {selectedPericia.honorariosDeferidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              {selectedPericia.justicaGratuita && (
                <p className="mt-2 text-yellow-700 font-medium">⚖️ Justiça Gratuita</p>
              )}
            </div>

            {selectedPericia.observacoes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">📝 Observações</h4>
                <p className="whitespace-pre-wrap">{selectedPericia.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação para Deletar */}
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
