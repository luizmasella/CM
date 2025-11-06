// src/components/FileUploadSection.tsx
import React, { useState } from 'react';
import { AttachedFile } from '../types';
import { fileService } from '../services/fileService';
import { Upload, X, Paperclip, Loader2 } from 'lucide-react';

interface FileUploadSectionProps {
  files: AttachedFile[];
  onFilesChange: (files: AttachedFile[]) => void;
}

export default function FileUploadSection({ files, onFilesChange }: FileUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    const result = await fileService.uploadFile(selectedFile);
    setIsUploading(false);

    if (result.success && result.file) {
      onFilesChange([...files, result.file]);
    } else {
      setError(result.message);
    }

    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  };

  const handleFileDelete = async (fileToDelete: AttachedFile) => {
    // Optimistic UI update
    const updatedFiles = files.filter(file => file.url !== fileToDelete.url);
    onFilesChange(updatedFiles);

    const result = await fileService.deleteFile(fileToDelete.url);
    if (!result.success) {
      // Revert if the deletion fails
      onFilesChange(files);
      setError('Falha ao deletar o arquivo. Tente novamente.');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Anexos</h3>

      {/* File Input */}
      <div className="relative mb-4">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`
            flex items-center justify-center w-full px-4 py-3 text-sm
            border-2 border-dashed border-gray-300 rounded-lg cursor-pointer
            transition-colors
            ${isUploading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-400'
            }
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2" size={18} />
              Adicionar Arquivo
            </>
          )}
        </label>
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {/* Attached Files List */}
      <div className="space-y-2">
        {files.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">Nenhum arquivo anexado.</p>
        )}
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md border">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 hover:underline truncate"
            >
              <Paperclip size={16} className="text-gray-500" />
              <span className="truncate">{file.name}</span>
            </a>
            <button
              onClick={() => handleFileDelete(file)}
              className="p-1 text-red-500 hover:bg-red-100 rounded-full"
              title="Deletar anexo"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
