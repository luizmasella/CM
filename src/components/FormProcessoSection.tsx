// src/components/FormProcessoSection.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import Combobox from './Combobox';

interface FormProcessoSectionProps {
  formData: any;
  errors: { [key: string]: string };
  touchedFields: Set<string>;
  isSubmitting: boolean;
  isDeleting: boolean;
  regioes: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (field: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  addRegiao: (regiao: string) => void;
  getFieldClassName: (field: string) => string;
}

export default function FormProcessoSection({
  formData,
  errors,
  touchedFields,
  isSubmitting,
  isDeleting,
  regioes,
  handleChange,
  handleBlur,
  setFormData,
  addRegiao,
  getFieldClassName,
}: FormProcessoSectionProps) {
  return (
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
            disabled={isSubmitting || isDeleting}
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
            disabled={isSubmitting || isDeleting}
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
            disabled={isSubmitting || isDeleting}
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
            onChange={(value) => setFormData(prev => ({ ...prev, regiao: value }))}
            options={regioes}
            onAddNew={addRegiao}
            placeholder="Digite ou selecione uma região..."
          />
        </div>
      </div>
    </div>
  );
}
