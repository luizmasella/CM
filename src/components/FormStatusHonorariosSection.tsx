// src/components/FormStatusHonorariosSection.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { statusConfig } from '../config/constants';

interface FormStatusHonorariosSectionProps {
  formData: any;
  errors: { [key: string]: string };
  touchedFields: Set<string>;
  isSubmitting: boolean;
  isDeleting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (field: string) => void;
  getFieldClassName: (field: string) => string;
}

export default function FormStatusHonorariosSection({
  formData,
  errors,
  touchedFields,
  isSubmitting,
  isDeleting,
  handleChange,
  handleBlur,
  getFieldClassName,
}: FormStatusHonorariosSectionProps) {
  return (
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
          disabled={isSubmitting || isDeleting}
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
            disabled={isSubmitting || isDeleting}
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
            disabled={isSubmitting || isDeleting}
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
            disabled={isSubmitting || isDeleting}
          />
          <span className="text-sm font-medium text-gray-700">
            ⚖️ Processo com Justiça Gratuita
          </span>
        </label>
      </div>
    </div>
  );
}
