// FILE: src/components/PericiaForm.tsx
import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import { useRegioes } from '../context/RegioesContext';
import Combobox from './Combobox';
import { PlusCircle, X, AlertCircle } from 'lucide-react';
import { tiposPericia as tiposDefault, statusConfig } from '../config/constants';

export default function PericiaForm() {
  const { pericias, addPericia, updatePericia } = usePericias();
  const { editingId, closeForm } = useUI();
  const { toast } = useToast();
  const { regioes, addRegiao } = useRegioes();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const initialState = {
    numeroProcesso: '', reclamante: '', reclamadas: [''], data: '', hora: '',
    tipo: '', vara: '', juiz: '', local: '', regiao: '', status: 'aguarda_ato_pericial',
    justicaGratuita: false, honorariosSolicitados: '', honorariosDeferidos: '',
    prazoLaudo: '', prazoQuesitos: '', observacoes: '', historico: []
  };
  
  const [formData, setFormData] = useState(initialState);
  const [tiposPericia] = useState(tiposDefault);

  useEffect(() => {
    if (editingId !== null) {
      const periciaToEdit = pericias.find(p => p.id === editingId);
      if (periciaToEdit) {
        setFormData({
            ...periciaToEdit,
            honorariosSolicitados: String(periciaToEdit.honorariosSolicitados),
            honorariosDeferidos: String(periciaToEdit.honorariosDeferidos),
            prazoLaudo: periciaToEdit.prazoLaudo || '',
            prazoQuesitos: periciaToEdit.prazoQuesitos || '',
        });
      }
    } else {
        setFormData(initialState);
    }
    setErrors({});
  }, [editingId, pericias]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleReclamadaChange = (index: number, value: string) => {
    const newReclamadas = [...formData.reclamadas];
    newReclamadas[index] = value;
    setFormData(prev => ({ ...prev, reclamadas: newReclamadas }));
    
    // Limpa erro ao digitar
    if (errors.reclamadas) {
      setErrors(prev => ({ ...prev, reclamadas: '' }));
    }
  };

  const addReclamadaField = () => setFormData(prev => ({ ...prev, reclamadas: [...prev.reclamadas, ''] }));
  
  const removeReclamadaField = (index: number) => {
    const newReclamadas = formData.reclamadas.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, reclamadas: newReclamadas.length > 0 ? newReclamadas : [''] }));
  };

  // VALIDAÇÃO BÁSICA
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Número do processo (obrigatório)
    if (!formData.numeroProcesso || formData.numeroProcesso.trim() === '') {
      newErrors.numeroProcesso = 'Número do processo é obrigatório';
    }
    
    // Reclamante (opcional mas se preenchido, mínimo 3 caracteres)
    if (formData.reclamante && formData.reclamante.trim().length < 3) {
      newErrors.reclamante = 'Nome deve ter no mínimo 3 caracteres';
    }
    
    // Reclamadas (opcional mas se preenchido, mínimo 3 caracteres)
    const reclamadasValidas = formData.reclamadas.filter(r => r.trim() !== '');
    if (reclamadasValidas.length > 0) {
      for (let i = 0; i < reclamadasValidas.length; i++) {
        if (reclamadasValidas[i].trim().length < 3) {
          newErrors.reclamadas = 'Cada reclamada deve ter no mínimo 3 caracteres';
          break;
        }
      }
    }
    
    // Data (opcional mas se preenchida, não pode ser muito antiga)
    if (formData.data) {
      const dataPericia = new Date(formData.data);
      const umAnoAtras = new Date();
      umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);
      if (dataPericia < umAnoAtras) {
        newErrors.data = 'Data muito antiga (máximo 1 ano atrás)';
      }
    }
    
    // Honorários (se preenchidos, devem ser válidos)
    if (formData.honorariosSolicitados) {
      const valor = parseFloat(formData.honorariosSolicitados);
      if (isNaN(valor) || valor < 0) {
        newErrors.honorariosSolicitados = 'Valor inválido';
      }
    }
    
    if (formData.honorariosDeferidos) {
      const valorSol = parseFloat(formData.honorariosSolicitados) || 0;
      const valorDef = parseFloat(formData.honorariosDeferidos);
      if (isNaN(valorDef) || valorDef < 0) {
        newErrors.honorariosDeferidos = 'Valor inválido';
      } else if (valorDef > valorSol) {
        newErrors.honorariosDeferidos = 'Não pode ser maior que o solicitado';
      }
    }
    
    // Prazos (se preenchidos e tem data, não podem ser antes da perícia)
    if (formData.prazoLaudo && formData.data) {
      const dataPer = new Date(formData.data);
      const dataPrazo = new Date(formData.prazoLaudo);
      if (dataPrazo < dataPer) {
        newErrors.prazoLaudo = 'Não pode ser antes da data da perícia';
      }
    }
    
    if (formData.prazoQuesitos && formData.data) {
      const dataPer = new Date(formData.data);
      const dataPrazo = new Date(formData.prazoQuesitos);
      if (dataPrazo < dataPer) {
        newErrors.prazoQuesitos = 'Não pode ser antes da data da perícia';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!validateForm()) {
      toast.error('❌ Corrija os erros no formulário!');
      // Scroll para o primeiro erro
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    // Simula um pequeno delay para mostrar loading
    setTimeout(() => {
      if (formData.regiao && !regioes.includes(formData.regiao)) {
        addRegiao(formData.regiao);
      }
      
      const periciaData = {
        ...formData, 
        honorariosSolicitados: parseFloat(formData.honorariosSolicitados) || 0, 
        honorariosDeferidos: parseFloat(formData.honorariosDeferidos) || 0, 
        reclamadas: formData.reclamadas.filter(r => r.trim() !== ''),
        prazoLaudo: formData.prazoLaudo || null,
        prazoQuesitos: formData.prazoQuesitos || null,
      };
      
      if(editingId !== null) {
          updatePericia({ id: editingId, ...periciaData });
          toast.success('✅ Perícia atualizada com sucesso!');
      } else {
          addPericia(periciaData);
          toast.success('✅ Perícia cadastrada com sucesso!');
      }
      
      setIsSubmitting(false);
      closeForm();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-8 max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg shadow-sm">
                <div>
                  <h2 className="text-2xl font-bold">{editingId ? 'Editar Perícia' : 'Nova Perícia'}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Apenas o número do processo é obrigatório. <span className="text-red-500">*</span>
                  </p>
                </div>
                <button 
                  onClick={closeForm} 
                  className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-lg mb-4 text-blue-800 flex items-center gap-2">
                      📋 Dados do Processo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Número do Processo <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text" 
                              name="numeroProcesso" 
                              value={formData.numeroProcesso} 
                              onChange={handleChange} 
                              className={`w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.numeroProcesso ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="0000000-00.0000.0.00.0000"
                              disabled={isSubmitting}
                            />
                            {errors.numeroProcesso && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.numeroProcesso}
                              </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vara
                            </label>
                            <input 
                              type="text" 
                              name="vara" 
                              value={formData.vara} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                              placeholder="1ª Vara do Trabalho"
                              disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Juiz(a) Responsável
                            </label>
                            <input 
                              type="text" 
                              name="juiz" 
                              value={formData.juiz} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                              placeholder="Dr(a). Nome Completo"
                              disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <Combobox
                              label="Região/Tribunal"
                              value={formData.regiao}
                              onChange={(value) => setFormData(prev => ({...prev, regiao: value}))}
                              options={regioes}
                              onAddNew={addRegiao}
                              placeholder="Digite ou selecione uma região..."
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
                      👥 Partes do Processo
                    </h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reclamante (Autor)
                        </label>
                        <input 
                          type="text" 
                          name="reclamante" 
                          value={formData.reclamante} 
                          onChange={handleChange} 
                          className={`w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.reclamante ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Nome completo do reclamante"
                          disabled={isSubmitting}
                        />
                        {errors.reclamante && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.reclamante}
                          </p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reclamada(s) (Réu)
                        </label>
                        {formData.reclamadas.map((reclamada, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input 
                                  type="text" 
                                  value={reclamada} 
                                  onChange={(e) => handleReclamadaChange(index, e.target.value)} 
                                  className={`w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                    errors.reclamadas ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  placeholder={`Nome da reclamada ${index + 1}`}
                                  disabled={isSubmitting}
                                />
                                {formData.reclamadas.length > 1 && (
                                    <button 
                                      type="button" 
                                      onClick={() => removeReclamadaField(index)} 
                                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
                                      title="Remover reclamada"
                                      disabled={isSubmitting}
                                    >
                                      <X size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {errors.reclamadas && (
                          <p className="text-xs text-red-600 mb-2 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.reclamadas}
                          </p>
                        )}
                        <button 
                          type="button" 
                          onClick={addReclamadaField} 
                          className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center gap-1 font-medium hover:bg-green-100 px-3 py-1 rounded-lg transition-colors"
                          disabled={isSubmitting}
                        >
                          <PlusCircle size={16} /> Adicionar outra reclamada
                        </button>
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                    <h3 className="font-bold text-lg mb-4 text-purple-800 flex items-center gap-2">
                      📅 Data e Local da Perícia
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Data da Perícia
                            </label>
                            <input 
                              type="date" 
                              name="data" 
                              value={formData.data} 
                              onChange={handleChange} 
                              className={`w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                errors.data ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={isSubmitting}
                            />
                            {errors.data && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.data}
                              </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Horário
                            </label>
                            <input 
                              type="time" 
                              name="hora" 
                              value={formData.hora} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                              disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo de Perícia
                            </label>
                            <input 
                              type="text" 
                              name="tipo" 
                              value={formData.tipo} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                              list="tipos-pericia" 
                              placeholder="Ex: Médica, Ortopédica..."
                              disabled={isSubmitting}
                            />
                            <datalist id="tipos-pericia">
                                {tiposPericia.map(t => <option key={t} value={t} />)}
                            </datalist>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Local da Perícia
                        </label>
                        <input 
                          type="text" 
                          name="local" 
                          value={formData.local} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                          placeholder="Ex: Fórum Central, Hospital das Clínicas, Consultório..."
                          disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                    <h3 className="font-bold text-lg mb-4 text-yellow-800 flex items-center gap-2">
                      💰 Status e Honorários
                    </h3>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status Atual do Processo
                        </label>
                        <select 
                          name="status" 
                          value={formData.status} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          disabled={isSubmitting}
                        >
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Honorários Solicitados (R$)
                            </label>
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0"
                              name="honorariosSolicitados" 
                              value={formData.honorariosSolicitados} 
                              onChange={handleChange} 
                              className={`w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                                errors.honorariosSolicitados ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Ex: 2500.00"
                              disabled={isSubmitting}
                            />
                            {errors.honorariosSolicitados && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.honorariosSolicitados}
                              </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Honorários Deferidos (R$)
                            </label>
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0"
                              name="honorariosDeferidos" 
                              value={formData.honorariosDeferidos} 
                              onChange={handleChange} 
                              className={`w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                                errors.honorariosDeferidos ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Ex: 2000.00"
                              disabled={isSubmitting}
                            />
                            {errors.honorariosDeferidos && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.honorariosDeferidos}
                              </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <label className="flex items-center gap-2 cursor-pointer p-3 bg-white rounded-lg border border-yellow-300 hover:bg-yellow-100 transition-colors">
                            <input 
                              type="checkbox" 
                              name="justicaGratuita" 
                              checked={formData.justicaGratuita} 
                              onChange={handleChange} 
                              className="rounded w-5 h-5 text-yellow-600 focus:ring-2 focus:ring-yellow-500"
                              disabled={isSubmitting}
                            />
                            <span className="text-sm font-medium text-gray-700">
                              ⚖️ Processo com Justiça Gratuita
                            </span>
                        </label>
                    </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                    <h3 className="font-bold text-lg mb-4 text-orange-800 flex items-center gap-2">
                      ⏰ Prazos Processuais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Prazo para Entrega do Laudo
                            </label>
                            <input 
                              type="date" 
                              name="prazoLaudo" 
                              value={formData.prazoLaudo} 
                              onChange={handleChange} 
                              className={`w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                errors.prazoLaudo ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={isSubmitting}
                            />
                            {errors.prazoLaudo && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.prazoLaudo}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Data limite para envio do laudo pericial</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Prazo para Resposta de Quesitos
                            </label>
                            <input 
                              type="date" 
                              name="prazoQuesitos" 
                              value={formData.prazoQuesitos} 
                              onChange={handleChange} 
                              className={`w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                errors.prazoQuesitos ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={isSubmitting}
                            />
                            {errors.prazoQuesitos && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.prazoQuesitos}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Data limite para resposta dos quesitos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 Observações e Anotações
                    </label>
                    <textarea 
                      name="observacoes" 
                      value={formData.observacoes} 
                      onChange={handleChange} 
                      rows={5} 
                      className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-gray-400 focus:border-transparent" 
                      placeholder="Informações adicionais, observações importantes, detalhes do caso, contatos relevantes, etc..."
                      disabled={isSubmitting}
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Campo livre para anotações gerais sobre o processo</p>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200 bg-white sticky bottom-0 pb-4">
                    <button 
                      type="button" 
                      onClick={closeForm} 
                      className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          {editingId ? '💾 Salvar Alterações' : '✅ Cadastrar Perícia'}
                        </>
                      )}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
