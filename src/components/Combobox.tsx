// FILE: src/components/Combobox.tsx
import React, { useState, useMemo, useEffect } from 'react';

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onAddNew: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function Combobox({
  value,
  onChange,
  options,
  onAddNew,
  placeholder = 'Digite ou selecione...',
  label
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    return options.filter(opt =>
      opt.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (inputValue.trim()) {
      onAddNew(inputValue.trim());
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue && filteredOptions.length === 0) {
      e.preventDefault();
      handleAddNew();
    }
  };

  const isNewValue = inputValue && !options.some(
    opt => opt.toLowerCase() === inputValue.toLowerCase()
  );

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : inputValue ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm mb-2">
                Nenhuma região encontrada
              </p>
              {isNewValue && (
                <button
                  onClick={handleAddNew}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar "{inputValue}"
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              Digite para buscar ou adicionar
            </div>
          )}
        </div>
      )}

      {isNewValue && (
        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Pressione Enter para adicionar nova região
        </p>
      )}
    </div>
  );
}
