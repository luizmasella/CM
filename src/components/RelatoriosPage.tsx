// src/components/RelatoriosPage.tsx
import React, { useRef, useState } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useToast } from '../context/ToastContext';
import { errorHandler, ErrorCategory, ErrorSeverity } from '../utils/errorHandler';
import ConfirmationModal from './ConfirmationModal';
import { PieChart, Download, Upload, Trash2, Database } from 'lucide-react';
import { ExportService } from '../utils/export';
import { pdfService } from '../services/pdfService'; // Import the new service

export default function RelatoriosPage() {
  const { stats, pericias, filteredPericias, exportData, importData, clearAllData } = usePericias();
  const { toast } = useToast();
  const exportService = new ExportService();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [pendingFileData, setPendingFileData] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  if (!stats) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Carregando relatórios...</p>
      </div>
    );
  }

  const handleExportCSV = async () => {
    // ... existing implementation
  };

  const handleExportExcel = async () => {
    // ... existing implementation
  };

  // Replace the old PDF export with the new one
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      if (filteredPericias.length === 0) {
        toast.warning('⚠️ Nenhuma perícia para exportar. Aplique filtros diferentes se necessário.');
        return;
      }
      pdfService.generatePericiasReport(filteredPericias, "Relatório de Perícias");
      toast.success('✅ Relatório PDF gerado com sucesso!');
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'GeneratePDFReport',
        error
      );
      toast.error('❌ Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportBackup = async () => {
    // ... existing implementation
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... existing implementation
  };

  const confirmRestore = async () => {
    // ... existing implementation
  };

  const handleClearClick = () => {
    // ... existing implementation
  };

  const confirmClear = async () => {
    // ... existing implementation
  };

  const calcularPercentual = (valor: number, total: number) => {
    // ... existing implementation
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PieChart className="text-blue-600" />
            Relatório Completo do Sistema
          </h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleExportCSV}
              disabled={isExporting || pericias.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {isExporting ? 'Exportando...' : 'Exportar CSV'}
            </button>
            <button 
              onClick={handleExportExcel}
              disabled={isExporting || pericias.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {isExporting ? 'Exportando...' : 'Exportar Excel'}
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={isExporting || filteredPericias.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {isExporting ? 'Gerando...' : 'Gerar PDF'}
            </button>
          </div>
        </div>
        
        {/* Rest of the component remains the same */}
      </div>

      {/* Other sections and modals... */}
    </div>
  );
}
