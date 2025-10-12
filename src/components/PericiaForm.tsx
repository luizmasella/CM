// FILE: src/components/PericiaForm.tsx
import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { useToast } from '../context/ToastContext';
import { useRegioes } from '../context/RegioesContext';
import Combobox from './Combobox';
import { PlusCircle, X, AlertCircle } from 'lucide-react';
import { tiposPericia as tiposDefault, statusConfig } from '../config/constants';
import { PericiaValidator } from '../utils/validation';

export default function PericiaForm() {
  const { pericias, addPericia, updatePericia } = usePericias();
  const { editingId, closeForm } = useUI();
  const { toast } = useToast();
  const { regioes, addRegiao } = useRegioes();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validator] = useState(() => new PericiaValidator());
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
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
    setTouchedFields(new Set());
  }, [editingId, pericias]);

  // Marca campo como tocado ao perder foco
  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
    validateField(fieldName);
  };

  // Valida um campo específico
  const validateField = (fieldName: string) => {
    const newErrors = { ...errors };
    
    switch(fieldName) {
      case 'numeroProcesso':
        if (!validator.validateNumeroProcesso(formData.numeroProcesso)) {
          newErrors.numeroProcesso = validator.getFieldError('numeroProcesso') || '';
        } else {
          delete newErrors.numeroProcesso;
        }
        break;
      
      case 'reclamante':
        if (formData.reclamante.trim() !== '') {
          if (!validator.validateNome('reclamante', formData.reclamante, 'Reclamante')) {
            newErrors.reclamante = validator.getFieldError('reclamante') || '';
          } else {
            delete newErrors.reclamante;
          }
        } else {
          delete newErrors.reclamante;
        }
        break;
      
      case 'juiz':
        if (formData.juiz.trim() !== '') {
          if (!validator.validateNome('juiz', formData.juiz, 'Juiz(a)')) {
            newErrors.juiz = validator.getFieldError('juiz') || '';
          } else {
            delete newErrors.juiz;
          }
        } else {
          delete newErrors.juiz;
        }
        break;
      
      case 'reclamadas':
        const reclamadasValidas = formData.reclamadas.filter(r => r.trim() !== '');
        if (reclamadasValidas.length > 0) {
          if (!validator.validateReclamadas(formData.reclamadas)) {
            newErrors.reclamadas = validator.getFieldError('reclamadas') || '';
          } else {
            delete newErrors.reclamadas;
          }
        } else {
          delete newErrors.reclamadas;
        }
        break;
      
      case 'data':
        if (formData.data) {
          if (!validator.validateData(formData.data)) {
            newErrors.data = validator.getFieldError('data') || '';
          } else {
            delete newErrors.data;
          }
        } else {
          delete newErrors.data;
        }
        break;
      
      case 'hora':
        if (formData.hora) {
          if (!validator.validateHora(formData.hora)) {
            newErrors.hora = validator.getFieldError('hora') || '';
          } else {
            delete newErrors.hora;
          }
        } else {
          delete newErrors.hora;
        }
        break;
      
      case 'honorariosSolicitados':
      case 'honorariosDeferidos':
        if (formData.honorariosSolicitados || formData.honorariosDeferidos) {
          if (!validator.validateHonorarios(formData.honorariosSolicitados, formData.honorariosDeferidos)) {
            const errorSol = validator.getFieldError('honorariosSolicitados');
            const errorDef = validator.getFieldError('honorariosDeferidos');
            if (errorSol) newErrors.honorariosSolicitados = errorSol;
            if (errorDef) newErrors.honorariosDeferidos = errorDef;
          } else {
            delete newErrors.honorariosSolicitados;
            delete newErrors.honorariosDeferidos;
          }
        }
        break;
      
      case 'prazoLaudo':
      case 'prazoQuesitos':
        if ((formData.prazoLaudo || formData.prazoQuesitos) && formData.data) {
          if (!validator.validatePrazos(formData.prazoLaudo, formData.prazoQuesitos, formData.data)) {
            const errorLaudo = validator.getFieldError('prazoLaudo');
            const errorQuesitos = validator.getFieldError('prazoQuesitos');
            if (errorLaudo) newErrors.prazoLaudo = errorLaudo;
            if (errorQuesitos) newErrors.prazoQuesitos = errorQuesitos;
          } else {
            delete newErrors.prazoLaudo;
            delete newErrors.prazoQuesitos;
          }
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Valida em tempo real se o campo já foi tocado
    if (touchedFields.has(name)) {
      setTimeout(() => validateField(name), 300);
    }
  };

  const handleReclamadaChange = (index: number, value: string) => {
    const newReclamadas = [...formData.reclamadas];
    newReclamadas[index] = value;
    setFormData(prev => ({ ...prev, reclamadas: newReclamadas }));
    
    if (touchedFields.has('reclamadas')) {
      setTimeout(() => validateField('reclamadas'), 300);
    }
  };

  const addReclamadaField = () => setFormData(prev => ({ ...prev, reclamadas: [...prev.reclamadas, ''] }));
  
  const removeReclamadaField = (index: number) => {
    const newReclamadas = formData.reclamadas.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, reclamadas: newReclamadas.length > 0 ? newReclamadas : [''] }));
  };

  // Validação completa do formulário
  const validateForm = (): boolean => {
    validator.clearErrors();
    
    // Valida apenas número do processo como OBRIGATÓRIO
    const isNumeroProcessoValid = validator.validateNumeroProcesso(formData.numeroProcesso);
    
    // Valida outros campos apenas se preenchidos
    if (formData.reclamante.trim()) {
      validator.validateNome('reclamante', formData.reclamante, 'Reclamante');
    }
    
    if (formData.juiz.trim()) {
      validator.validateNome('juiz', formData.juiz, 'Juiz(a)');
    }
    
    const reclamadasValidas = formData.reclamadas.filter(r => r.trim() !== '');
    if (reclamadasValidas.length > 0) {
      validator.validateReclamadas(formData.reclamadas);
    }
    
    if (formData.data) {
      validator.validateData(formData.data);
    }
    
    if (formData.hora) {
      validator.validateHora(formData.hora);
    }
    
    if (formData.honorariosSolicitados || formData.honorariosDeferidos) {
      validator.validateHonorarios(
        formData.honorariosSolicitados || '0',
        formData.honorariosDeferidos || '0'
      );
    }
    
    if ((formData.prazoLaudo || formData.prazoQuesitos) && formData.data) {
      validator.validatePrazos(formData.prazoLaudo, formData.prazoQuesitos, formData.data);
    }
    
    const validationErrors = validator.getErrors();
    const errorsMap: {[key: string]: string} = {};
    validationErrors.forEach(error => {
      errorsMap[error.field] = error.message;
    });
    
    setErrors(errorsMap);
    
    // Marca todos os campos como tocados ao tentar submeter
    const allFields = new Set([
      'numeroProcesso', 'reclamante', 'juiz', 'reclamadas', 
      'data', 'hora', 'honorariosSolicitados', 'honorariosDeferidos',
      'prazoLaudo', 'prazoQuesitos'
    ]);
    setTouchedFields(allFields);
    
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('❌ Corrija os erros no formulário!');
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
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

  const getFieldClassName = (fieldName: string) => {
    const baseClass = "w-full border rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
    
    if (touchedFields.has(fieldName) && errors[fieldName]) {
      return `${baseClass} border-red-500 bg-red-50`;
    }
    
    if (touchedFields.has(fieldName) && !errors[fieldName]) {
      return `${baseClass} border-green-500 bg-green-50`;
    }
    
    return `${baseClass} border-gray-300`;
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
                              onBlur={() => handleBlur('numeroProcesso')}
                              className={getFieldClassName('numeroProcesso')}
                              placeholder="0000000-00.0000.0.00.0000"
                              disabled={isSubmitting}
                            />
                            {touchedFields.has('numeroProcesso') && errors.numeroProcesso && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1 animate-pulse">
                                <AlertCircle size={12} />
                                {errors.numeroProcesso}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Formato CNJ: NNNNNNN-DD.AAAA.J.TT.OOOO</p>
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
                              onBlur={() => handleBlur('juiz')}
                              className={getFieldClassName('juiz')}
                              placeholder="Dr(a). Nome Completo"
                              disabled={isSubmitting}
                            />
                            {touchedFields.has('juiz') && errors.juiz && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.juiz}
                              </p>
                            )}
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
                          onBlur={() => handleBlur('reclamante')}
                          className={getFieldClassName('reclamante')}
                          placeholder="Nome completo do reclamante"
                          disabled={isSubmitting}
                        />
                        {touchedFields.has('reclamante') && errors.reclamante && (
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
                                  onBlur={() => handleBlur('reclamadas')}
                                  className={getFieldClassName('reclamadas')}
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
                        {touchedFields.has('reclamadas') && errors.reclamadas && (
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
                              onBlur={() => handleBlur('data')}
                              className={getFieldClassName('data')}
                              disabled={isSubmitting}
                            />
                            {touchedFields.has('data') && errors.data && (
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
                              onBlur={() => handleBlur('hora')}
                              className={getFieldClassName('hora')}
                              disabled={isSubmitting}
                            />
                            {touchedFields.has('hora') && errors.hora && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.hora}
                              </p>
                            )}
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
                              onBlur={() => handleBlur('honorariosSolicitados')}
                              className={getFieldClassName('honorariosSolicitados')}
                              placeholder="Ex: 2500.00"
                              disabled={isSubmitting}
                            />
                            {touchedFields.has('honorariosSolicitados') && errors.honorariosSolicitados && (
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
                              onBlur={() => handleBlur('honorariosDeferidos')}
                              className={getFieldClassName('honorariosDeferidos')}
                              placeholder="Ex: 2000.00"
                              disabled={isSubmitting}
                            />
                            {touchedFields.has('honorariosDeferidos') && errors.honorariosDeferidos && (
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
                              onBlur={() => handleBlur('prazoLaudo')}
                              className={getFieldClassName('prazoLaudo')}
                              disabled={isSubmitting}
                            />
                            {touchedFields.has('prazoLaudo') && errors.prazoLaudo && (
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
                              onBlur={() => handleBlur('prazoQuesitos')}
                              className={getFieldClassName('prazoQuesitos')}
                              disabled={isSubmitting}
                            />
                            {touchedFields.has('prazoQuesitos') && errors.prazoQuesitos && (
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
