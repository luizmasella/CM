// FILE: src/components/PericiaForm.tsx
import React, { useState, useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
import { X } from 'lucide-react';

export default function PericiaForm() {
  const { pericias, addPericia, updatePericia } = usePericias();
  const { editingId, closeForm } = useUI();

  const [formData, setFormData] = useState({ /* ... estado inicial do formulário ... */ });

  useEffect(() => {
    if (editingId) {
      const pericia = pericias.find(p => p.id === editingId);
      if (pericia) setFormData(pericia as any);
    } else {
      // Reset form
    }
  }, [editingId, pericias]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePericia({ id: editingId, ...formData } as any);
    } else {
      addPericia(formData as any);
    }
    closeForm();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <h2 className="text-2xl mb-4">{editingId ? 'Editar' : 'Nova'} Perícia</h2>
        <form onSubmit={handleSubmit}>
          {/* ... campos do formulário ... */}
          <button type="submit">Salvar</button>
          <button type="button" onClick={closeForm}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}
