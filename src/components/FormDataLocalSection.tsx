// src/components/FormDataLocalSection.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormDataLocalSectionProps {
  formData: any;
  errors: { [key: string]: string };
  touchedFields: Set<string>;
  isSubmitting: boolean;
  isDeleting: boolean;
  tiposPericia: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: string) => void;
  getFieldClassName: (field: string) => string;
}

export default function FormDataLocalSection({
  formData,
  errors,
  touchedFields,
  isSubmitting,
  isDeleting,
  tiposPericia,
  handleChange,
  handleBlur,
  getFieldClassName,
}: FormDataLocalSectionProps) {
  return (
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
            disabled={isSubmitting || isDeleting}
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
            disabled={isSubmitting || isDeleting}
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
            disabled={isSubmitting || isDeleting}
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
          disabled={isSubmitting || isDeleting}
        />
      </div>
    </div>
  );
}
