// src/components/FormPartesSection.tsx
import React from 'react';
import { AlertCircle, PlusCircle, X } from 'lucide-react';

interface FormPartesSectionProps {
  formData: any;
  errors: { [key: string]: string };
  touchedFields: Set<string>;
  isSubmitting: boolean;
  isDeleting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: string) => void;
  handleReclamadaChange: (index: number, value: string) => void;
  addReclamadaField: () => void;
  removeReclamadaField: (index: number) => void;
  getFieldClassName: (field: string) => string;
}

export default function FormPartesSection({
  formData,
  errors,
  touchedFields,
  isSubmitting,
  isDeleting,
  handleChange,
  handleBlur,
  handleReclamadaChange,
  addReclamadaField,
  removeReclamadaField,
  getFieldClassName,
}: FormPartesSectionProps) {
  return (
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
          disabled={isSubmitting || isDeleting}
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
        {formData.reclamadas.map((reclamada: string, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={reclamada}
              onChange={(e) => handleReclamadaChange(index, e.target.value)}
              onBlur={() => handleBlur('reclamadas')}
              className={getFieldClassName('reclamadas')}
              placeholder={`Nome da reclamada ${index + 1}`}
              disabled={isSubmitting || isDeleting}
            />
            {formData.reclamadas.length > 1 && (
              <button
                type="button"
                onClick={() => removeReclamadaField(index)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
                title="Remover reclamada"
                disabled={isSubmitting || isDeleting}
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
          disabled={isSubmitting || isDeleting}
        >
          <PlusCircle size={16} /> Adicionar outra reclamada
        </button>
      </div>
    </div>
  );
}
