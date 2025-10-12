// FILE: src/components/PericiaForm.tsx
import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { PlusCircle, X } from 'lucide-react';
import { tiposPericia as tiposDefault, regioesList } from '../config/constants';

export default function PericiaForm() {
  const { pericias, addPericia, updatePericia } = usePericias();
  const { editingId, closeForm } = useUI();
  
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
  }, [editingId, pericias]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
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
  };

  const addReclamadaField = () => setFormData(prev => ({ ...prev, reclamadas: [...prev.reclamadas, ''] }));
  const removeReclamadaField = (index: number) => {
    const newReclamadas = formData.reclamadas.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, reclamadas: newReclamadas.length > 0 ? newReclamadas : [''] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
        alert('Perícia atualizada com sucesso!');
    } else {
        addPericia(periciaData);
        alert('Perícia cadastrada com sucesso!');
    }
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-8">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg">
                <h2 className="text-2xl font-bold">{editingId ? 'Editar Perícia' : 'Nova Perícia'}</h2>
                <button onClick={closeForm} className="text-gray-500 hover:text-gray-800">
                  <X size={24} />
                </button>
            </div>
            
            <div className="p-6 space-y-6">
                {/* SEÇÃO 1: DADOS DO PROCESSO */}
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-lg mb-4 text-blue-800 flex items-center gap-2">
                      📋 Dados do Processo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Número do Processo*
                            </label>
                            <input 
                              type="text" 
                              name="numeroProcesso" 
                              value={formData.numeroProcesso} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                              placeholder="0000000-00.0000.0.00.0000"
                              required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vara*
                            </label>
                            <input 
                              type="text" 
                              name="vara" 
                              value={formData.vara} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                              placeholder="1ª Vara do Trabalho"
                              required 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Juiz(a)*
                            </label>
                            <input 
                              type="text" 
                              name="juiz" 
                              value={formData.juiz} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                              placeholder="Dr(a). Nome Completo"
                              required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Região*
                            </label>
                            <select 
                              name="regiao" 
                              value={formData.regiao} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            >
                                <option value="">Selecione...</option>
                                {regioesList.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO 2: PARTES */}
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
                      👥 Partes do Processo
                    </h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reclamante*
                        </label>
                        <input 
                          type="text" 
                          name="reclamante" 
                          value={formData.reclamante} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                          placeholder="Nome Completo do Reclamante"
                          required 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reclamada(s)*
                        </label>
                        {formData.reclamadas.map((reclamada, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input 
                                  type="text" 
                                  value={reclamada} 
                                  onChange={(e) => handleReclamadaChange(index, e.target.value)} 
                                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                                  placeholder={`Reclamada ${index + 1}`}
                                  required
                                />
                                {formData.reclamadas.length > 1 && (
                                    <button 
                                      type="button" 
                                      onClick={() => removeReclamadaField(index)} 
                                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                      <X size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={addReclamadaField} 
                          className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center gap-1 font-medium hover:bg-green-100 px-3 py-1 rounded-lg transition-colors"
                        >
                          <PlusCircle size={16} /> Adicionar Reclamada
                        </button>
                    </div>
                </div>

                {/* SEÇÃO 3: DATA E LOCAL */}
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                    <h3 className="font-bold text-lg mb-4 text-purple-800 flex items-center gap-2">
                      📅 Data e Local da Perícia
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Data*
                            </label>
                            <input 
                              type="date" 
                              name="data" 
                              value={formData.data} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                              required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hora*
                            </label>
                            <input 
                              type="time" 
                              name="hora" 
                              value={formData.hora} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                              required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo*
                            </label>
                            <input 
                              type="text" 
                              name="tipo" 
                              value={formData.tipo} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                              list="tipos-pericia" 
                              placeholder="Médica, Ortopédica..."
                              required
                            />
                            <datalist id="tipos-pericia">
                                {tiposPericia.map(t => <option key={t} value={t} />)}
                            </datalist>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Local da Perícia*
                        </label>
                        <input 
                          type="text" 
                          name="local" 
                          value={formData.local} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                          placeholder="Fórum, Hospital, Consultório..."
                          required 
                        />
                    </div>
                </div>

                {/* SEÇÃO 4: HONORÁRIOS E PRAZOS */}
                <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                    <h3 className="font-bold text-lg mb-4 text-yellow-800 flex items-center gap-2">
                      💰 Honorários e Prazos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Honorários Solicitados (R$)*
                            </label>
                            <input 
                              type="number" 
                              step="0.01" 
                              name="honorariosSolicitados" 
                              value={formData.honorariosSolicitados} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                              placeholder="2500.00"
                              required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Honorários Deferidos (R$)*
                            </label>
                            <input 
                              type="number" 
                              step="0.01" 
                              name="honorariosDeferidos" 
                              value={formData.honorariosDeferidos} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                              placeholder="2000.00"
                              required 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Prazo do Laudo
                            </label>
                            <input 
                              type="date" 
                              name="prazoLaudo" 
                              value={formData.prazoLaudo} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Prazo dos Quesitos
                            </label>
                            <input 
                              type="date" 
                              name="prazoQuesitos" 
                              value={formData.prazoQuesitos} 
                              onChange={handleChange} 
                              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                            />
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="justicaGratuita" 
                              checked={formData.justicaGratuita} 
                              onChange={handleChange} 
                              className="rounded w-4 h-4 text-yellow-600 focus:ring-2 focus:ring-yellow-500" 
                            />
                            <span className="text-sm font-medium text-gray-700">
                              ⚖️ Justiça Gratuita
                            </span>
                        </label>
                    </div>
                </div>

                {/* SEÇÃO 5: OBSERVAÇÕES */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 Observações
                    </label>
                    <textarea 
                      name="observacoes" 
                      value={formData.observacoes} 
                      onChange={handleChange} 
                      rows={4} 
                      className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-gray-400 focus:border-transparent" 
                      placeholder="Informações adicionais sobre a perícia..."
                    ></textarea>
                </div>

                {/* BOTÕES */}
                <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
                    <button 
                      type="button" 
                      onClick={closeForm} 
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button"
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md font-medium flex items-center gap-2"
                    >
                      {editingId ? '💾 Salvar Alterações' : '➕ Cadastrar Perícia'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
