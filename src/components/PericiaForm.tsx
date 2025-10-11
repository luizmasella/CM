import { useFormValidation } from "../utils/validation";
import { useToast } from "../hooks/useToast";

// Dentro do componente:
const { validate, errors, getFieldError, clearFieldError } = useFormValidation();
const { toast } = useToast();
// FILE: src/components/PericiaForm.tsx

import React, { useState, useEffect } from "react";
import { usePericias } from "../context/PericiasContext";
import { PlusCircle, X } from "lucide-react";

interface PericiaFormProps {
  setShowForm: (show: boolean) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}

export default function PericiaForm({
  setShowForm,
  editingId,
  setEditingId,
}: PericiaFormProps) {
  const { pericias, addPericia, updatePericia } = usePericias();

  const [formData, setFormData] = useState({
    numeroProcesso: "",
    reclamante: "",
    reclamadas: [""],
    data: "",
    hora: "",
    tipo: "",
    vara: "",
    juiz: "",
    local: "",
    regiao: "",
    status: "aguarda_ato_pericial",
    justicaGratuita: false,
    honorariosSolicitados: "",
    honorariosDeferidos: "",
    prazoLaudo: "",
    prazoQuesitos: "",
    observacoes: "",
    historico: [],
  });

  useEffect(() => {
    if (editingId !== null) {
      const periciaToEdit = pericias.find((p) => p.id === editingId);
      if (periciaToEdit) {
        setFormData({
          ...periciaToEdit,
          honorariosSolicitados: String(periciaToEdit.honorariosSolicitados),
          honorariosDeferidos: String(periciaToEdit.honorariosDeferidos),
        });
      }
    }
  }, [editingId, pericias]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReclamadaChange = (index: number, value: string) => {
    const newReclamadas = [...formData.reclamadas];
    newReclamadas[index] = value;
    setFormData((prev) => ({ ...prev, reclamadas: newReclamadas }));
  };

  const addReclamadaField = () => {
    setFormData((prev) => ({ ...prev, reclamadas: [...prev.reclamadas, ""] }));
  };

  const removeReclamadaField = (index: number) => {
    const newReclamadas = formData.reclamadas.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      reclamadas: newReclamadas.length > 0 ? newReclamadas : [""],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Valida o formulário
  if (!validate(formData)) {
    toast.error("Por favor, corrija os erros no formulário");
    return;
  }

  // Continua com o cadastro...
  const periciaData = {
    ...formData,
    honorariosSolicitados: parseFloat(formData.honorariosSolicitados) || 0,
    honorariosDeferidos: parseFloat(formData.honorariosDeferidos) || 0,
    reclamadas: formData.reclamadas.filter((r) => r.trim() !== ""),
  };

  if (editingId !== null) {
    updatePericia({ id: editingId, ...periciaData });
    toast.success("Perícia atualizada com sucesso!");
  } else {
    addPericia(periciaData);
    toast.success("Perícia cadastrada com sucesso!");
  }

  closeForm();
};

    const periciaData = {
      ...formData,
      honorariosSolicitados: parseFloat(formData.honorariosSolicitados) || 0,
      honorariosDeferidos: parseFloat(formData.honorariosDeferidos) || 0,
      reclamadas: formData.reclamadas.filter((r) => r.trim() !== ""),
    };

    if (editingId !== null) {
      updatePericia({ id: editingId, ...periciaData });
      alert("Perícia atualizada com sucesso!");
    } else {
      addPericia(periciaData);
      alert("Perícia cadastrada com sucesso!");
    }

    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {editingId ? "Editar Perícia" : "Nova Perícia"}
          </h2>
          <button
            onClick={closeForm}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* LINHA 1: PROCESSO E RECLAMANTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número do Processo*
              </label>
              <input
                type="text"
                name="numeroProcesso"
                value={formData.numeroProcesso}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reclamante*
              </label>
              <input
                type="text"
                name="reclamante"
                value={formData.reclamante}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>

          {/* LINHA 2: RECLAMADAS */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reclamada(s)*
            </label>
            {formData.reclamadas.map((reclamada, index) => (
              <div key={index} className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={reclamada}
                  onChange={(e) => handleReclamadaChange(index, e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {formData.reclamadas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReclamadaField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addReclamadaField}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <PlusCircle size={16} /> Adicionar Reclamada
            </button>
          </div>

          {/* LINHA 3: DATA E HORA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data da Perícia*
              </label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora da Perícia*
              </label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>

          {/* OUTROS CAMPOS... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Perícia*
            </label>
            <input
              type="text"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingId ? "Salvar Alterações" : "Cadastrar Perícia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
