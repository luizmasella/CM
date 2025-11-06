// src/components/PericiaForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useUI } from '../context/UIContext';
// ... other imports

export default function PericiaForm() {
  // ... existing state and hooks
  const { editingId, closeForm, triggerElementRef } = useUI();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap logic
  useEffect(() => {
    // Set focus on the close button when the modal opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancelClick();
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    const currentModalRef = modalRef.current;
    currentModalRef?.addEventListener('keydown', handleKeyDown);

    // Return focus to the trigger element when the modal closes
    return () => {
      currentModalRef?.removeEventListener('keydown', handleKeyDown);
      triggerElementRef?.current?.focus();
    };
  }, []);

  // ... rest of the component logic (handleSubmit, etc.)

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
    >
        <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-8 max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg shadow-sm">
                <div>
                  <h2 id="form-title" className="text-2xl font-bold">
                    {editingId ? '✏️ Editar Perícia' : '➕ Nova Perícia'}
                  </h2>
                  {/* ... subtitle */}
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={handleCancelClick}
                  className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isSubmitting || isDeleting}
                  aria-label="Fechar formulário"
                >
                  <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* ... Form sections ... */}
                <FileUploadSection files={files} onFilesChange={handleFilesChange} />
                {/* ... Action buttons ... */}
            </form>
        </div>
        {/* ... Confirmation Modals ... */}
    </div>
  );
}
