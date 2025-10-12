// FILE: src/components/PericiaDetails.tsx
import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import { useRegioes } from '../context/RegioesContext';
import ConfirmationModal from './ConfirmationModal';
import { statusConfig, tiposPericia } from '../config/constants';
import { Edit2, X, AlertTriangle, User, Calendar, Briefcase, DollarSign, ClipboardList, Clock, Save, Trash2, PlusCircle } from 'lucide-react';

export default function PericiaDetails() {
  const { updatePericia, deletePericia, isPrazoVencido } = usePericias();
  const { showDetails, selectedPericia, closeDetails } = useUI();
  const { toast } = useToast();
  const { regioes, addRegiao } = useRegioes();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { 
    if (selectedPericia) { 
      setEditData({
        ...selectedPericia,
        honorariosSolicitados: String(selectedPericia.honorariosSolicitados),
        honorariosDeferidos: String(selectedPericia.honorariosDeferidos),
        prazoLaudo: selectedPericia.prazoLaudo || '',
        prazoQuesitos: selectedPericia.prazoQuesitos || '',
      }); 
    } 
  }, [selectedPericia]);

  if (!showDetails || !selectedPericia || !editData) { return null; }

  const handleSave = () => { 
    const periciaAtualizada = {
      ...editData,
      honorariosSolicitados: parseFloat(editData.honorariosSolicitados) || 0,
      honorariosDeferidos: parseFloat(editData.honorariosDeferidos) || 0,
      reclamadas: editData.reclamadas.filter((r: string) => r.trim() !== ''),
      prazoLaudo: editData.prazoLaudo || null,
      prazoQuesitos: editData.prazoQuesitos || null,
    };
    
    if (editData.regiao && !regioes.includes(editData.regiao)) {
      addRegiao(editData.regiao);
    }
    
    updatePericia(periciaAtualizada); 
    setIsEditing(false);
    toast.success('✅ Perícia atualizada com sucesso!');
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deletePericia(selectedPericia.id);
      setShowDeleteModal(false);
      closeDetails();
      toast.success('✅ Perícia excluída com sucesso!');
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setEditData((prev: any) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setEditData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleReclamadaChange = (index: number, value: string) => {
    const newReclamadas = [...editData.reclamadas];
    newReclamadas[index] = value;
    setEditData((prev: any) => ({ ...prev, reclamadas: newReclamadas }));
  };

  const addReclamadaField = () => {
    setEditData((prev: any) => ({ ...prev, reclamadas: [...prev.reclamadas, ''] }));
  };

  const removeReclamadaField = (index: number) => {
    const newReclamadas = editData.reclamadas.filter((_: string, i: number) => i !== index);
    setEditData((prev: any) => ({ ...prev, reclamadas: newReclamadas.length > 0 ? newReclamadas : [''] }));
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
              {!isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Edit2 size={18} /> Editar
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={18} /> Excluir
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleSave} 
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save size={18} /> Salvar
                  </button>
                  <button 
                    onClick={() => { 
                      setEditData({
                        ...selectedPericia,
                        honorariosSolicitados: String(selectedPericia.honorariosSolicitados),
                        honorariosDeferidos: String(selectedPericia.honorariosDeferidos),
                        prazoLaudo: selectedPericia.prazoLaudo || '',
                        prazoQuesitos: selectedPericia.prazoQuesitos || '',
                      }); 
                      setIsEditing(false); 
                    }} 
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <X size={18} /> Cancelar
                  </button>
                </>
              )}
              <button 
                onClick={closeDetails} 
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
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

          {isEditing ? (
            <div className="space-y-6">
              {/* DADOS DO PROCESSO */}
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                  <ClipboardList size={18} /> Dados do Processo
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Número do Processo</label>
                    <input 
                      name="numeroProcesso"
                      value={editData.numeroProcesso} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Vara</label>
                    <input 
                      name="vara"
                      value={editData.vara} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1ª Vara do Trabalho"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Juiz(a)</label>
                    <input 
                      name="juiz"
                      value={editData.juiz} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Dr(a). Nome Completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Região</label>
                    <input 
                      name="regiao"
                      value={editData.regiao} 
                      onChange={handleChange}
                      list="regioes-list"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite ou selecione..."
                    />
                    <datalist id="regioes-list">
                      {regioes.map(r => <option key={r} value={r} />)}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* PARTES */}
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                  <User size={18} /> Partes do Processo
                </h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Reclamante</label>
                  <input 
                    name="reclamante"
                    value={editData.reclamante} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reclamada(s)</label>
                  {editData.reclamadas.map((reclamada: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input 
                        value={reclamada} 
                        onChange={(e) => handleReclamadaChange(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder={`Reclamada ${index + 1}`}
                      />
                      {editData.reclamadas.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeReclamadaField(index)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={addReclamadaField}
                    className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center gap-1 font-medium hover:bg-green-100 px-3 py-1 rounded-lg"
                  >
                    <PlusCircle size={16} /> Adicionar reclamada
                  </button>
                </div>
              </div>

              {/* DATA E LOCAL */}
              <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-800">
                  <Calendar size={18} /> Data e Local
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Data</label>
                    <input 
                      type="date"
                      name="data"
                      value={editData.data} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora</label>
                    <input 
                      type="time"
                      name="hora"
                      value={editData.hora} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <input 
                      name="tipo"
                      value={editData.tipo} 
                      onChange={handleChange}
                      list="tipos-list"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Médica, Ortopédica..."
                    />
                    <datalist id="tipos-list">
                      {tiposPericia.map(t => <option key={t} value={t} />)}
                    </datalist>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Local</label>
                  <input 
                    name="local"
                    value={editData.local} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Fórum Central, Hospital..."
                  />
                </div>
              </div>

              {/* STATUS E HONORÁRIOS */}
              <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-800">
                  <DollarSign size={18} /> Status e Honorários
                </h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    name="status"
                    value={editData.status} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Honorários Solicitados (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      name="honorariosSolicitados"
                      value={editData.honorariosSolicitados} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Honorários Deferidos (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      name="honorariosDeferidos"
                      value={editData.honorariosDeferidos} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      name="justicaGratuita"
                      checked={editData.justicaGratuita} 
                      onChange={handleChange}
                      className="w-5 h-5 text-yellow-600 focus:ring-2 focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium">⚖️ Justiça Gratuita</span>
                  </label>
                </div>
              </div>

              {/* PRAZOS */}
              <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-orange-800">
                  <Clock size={18} /> Prazos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prazo do Laudo</label>
                    <input 
                      type="date"
                      name="prazoLaudo"
                      value={editData.prazoLaudo} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prazo dos Quesitos</label>
                    <input 
                      type="date"
                      name="prazoQuesitos"
                      value={editData.prazoQuesitos} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* OBSERVAÇÕES */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <h4 className="font-semibold mb-3">📝 Observações</h4>
                <textarea 
                  name="observacoes"
                  value={editData.observacoes} 
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                  placeholder="Informações adicionais..."
                ></textarea>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User size={18} /> Partes
                  </h4>
                  <p className="mb-2"><strong>Reclamante:</strong> {selectedPericia.reclamante}</p>
                  <p><strong>Reclamada(s):</strong></p>
                  {selectedPericia.reclamadas.map((r: string) => (
                    <p key={r} className="ml-2">• {r}</p>
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
          )}
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
