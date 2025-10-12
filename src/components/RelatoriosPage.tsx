// FILE: src/components/RelatoriosPage.tsx
// ATUALIZADO: Com tratamento de erros robusto

import React, { useRef, useState } from 'react';
import { usePericias } from '../context/PericiasContext';
import { useToast } from '../context/ToastContext';
import { errorHandler, ErrorCategory, ErrorSeverity } from '../utils/errorHandler';
import ConfirmationModal from './ConfirmationModal';
import { PieChart, Download, Upload, Trash2, Database } from 'lucide-react';
import { ExportService } from '../utils/export';

export default function RelatoriosPage() {
  const { stats, pericias, exportData, importData, clearAllData } = usePericias();
  const { toast } = useToast();
  const exportService = new ExportService();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados dos modais
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [pendingFileData, setPendingFileData] = useState<string | null>(null);

  // Loading states
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
    setIsExporting(true);
    try {
      const success = exportService.exportToCSV(pericias);
      if (success) {
        toast.success('✅ Relatório CSV exportado com sucesso!');
      } else {
        toast.error('❌ Erro ao exportar CSV');
      }
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'ExportCSV-Button',
        error
      );
      toast.error('❌ Erro ao exportar CSV. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const success = exportService.exportToExcel(pericias);
      if (success) {
        toast.success('✅ Relatório Excel exportado com sucesso!');
      } else {
        toast.error('❌ Erro ao exportar Excel');
      }
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'ExportExcel-Button',
        error
      );
      toast.error('❌ Erro ao exportar Excel. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const success = exportService.exportToPDF(pericias, stats);
      if (success) {
        toast.info('📄 Abrindo janela de impressão/PDF...');
      } else {
        toast.error('❌ Erro ao gerar PDF');
      }
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'ExportPDF-Button',
        error
      );
      toast.error('❌ Erro ao gerar PDF. Verifique se pop-ups estão habilitados.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const jsonData = exportData();
      
      if (!jsonData) {
        throw new Error('Falha ao exportar dados');
      }

      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `backup-pericias-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('✅ Backup criado com sucesso!');
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.STORAGE,
        ErrorSeverity.HIGH,
        'ExportBackup',
        error
      );
      toast.error('❌ Erro ao criar backup. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Valida tipo de arquivo
    if (!file.name.endsWith('.json')) {
      toast.error('❌ Formato inválido! Use um arquivo .json');
      errorHandler.logError(
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM,
        'ImportBackup',
        new Error('Formato de arquivo inválido')
      );
      return;
    }

    // Valida tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('❌ Arquivo muito grande! Máximo: 10MB');
      errorHandler.logError(
        ErrorCategory.VALIDATION,
        ErrorSeverity.MEDIUM,
        'ImportBackup',
        new Error('Arquivo maior que 10MB')
      );
      return;
    }

    setIsImporting(true);

    const reader = new FileReader();
    
    reader.onerror = () => {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.HIGH,
        'ImportBackup-FileReader',
        new Error('Erro ao ler arquivo')
      );
      toast.error('❌ Erro ao ler arquivo. Tente novamente.');
      setIsImporting(false);
    };

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (!content || content.trim() === '') {
          throw new Error('Arquivo vazio');
        }

        // Valida se é JSON válido
        JSON.parse(content);
        
        // Armazena o conteúdo e mostra o modal
        setPendingFileData(content);
        setShowRestoreModal(true);
        
      } catch (error) {
        errorHandler.logError(
          ErrorCategory.VALIDATION,
          ErrorSeverity.HIGH,
          'ImportBackup-Parse',
          error
        );
        toast.error('❌ Arquivo inválido! Use um backup JSON válido.');
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmRestore = async () => {
    if (!pendingFileData) return;
    
    setIsImporting(true);
    
    try {
      const success = importData(pendingFileData);
      if (success) {
        toast.success('✅ Backup restaurado com sucesso!');
        setPendingFileData(null);
        setShowRestoreModal(false);
      } else {
        toast.error('❌ Erro ao restaurar backup!');
      }
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.STORAGE,
        ErrorSeverity.CRITICAL,
        'RestoreBackup',
        error
      );
      toast.error('❌ Erro crítico ao restaurar backup!');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearClick = () => {
    setShowClearModal(true);
  };

  const confirmClear = async () => {
    setIsClearing(true);
    
    try {
      const success = clearAllData();
      if (success) {
        setShowClearModal(false);
        toast.warning('⚠️ Todos os dados foram resetados!');
      } else {
        toast.error('❌ Erro ao limpar dados!');
      }
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.STORAGE,
        ErrorSeverity.CRITICAL,
        'ClearAllData',
        error
      );
      toast.error('❌ Erro crítico ao limpar dados!');
    } finally {
      setIsClearing(false);
    }
  };

  const calcularPercentual = (valor: number, total: number) => {
    try {
      if (total === 0) return 0;
      return ((valor / total) * 100).toFixed(1);
    } catch (error) {
      errorHandler.logError(
        ErrorCategory.PROCESSING,
        ErrorSeverity.LOW,
        'CalcularPercentual',
        error
      );
      return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER COM BOTÕES DE EXPORTAÇÃO */}
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
              disabled={isExporting || pericias.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {isExporting ? 'Gerando...' : 'Gerar PDF'}
            </button>
          </div>
        </div>

        {/* CARD DESTAQUE - TOTAL */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-xl mb-6 text-center shadow-xl">
          <p className="text-lg mb-2">Total de Perícias Cadastradas</p>
          <p className="text-6xl font-bold">{stats.total}</p>
          <p className="text-blue-100 mt-2">no sistema</p>
        </div>
      </div>

      {/* SEÇÃO DE BACKUP/RESTAURAÇÃO */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="text-purple-600" />
          Gerenciamento de Dados
        </h3>
        <p className="text-gray-600 mb-4">
          Crie backups dos seus dados ou restaure de um arquivo anterior. Seus dados são salvos automaticamente no navegador.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Criar Backup */}
          <div className="bg-white p-6 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Download className="text-purple-600" size={24} />
              <h4 className="font-bold text-gray-800">Criar Backup</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Exporta todos os dados em arquivo JSON para backup externo.
            </p>
            <button
              onClick={handleExportBackup}
              disabled={isExporting || pericias.length === 0}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {isExporting ? 'Criando...' : 'Baixar Backup'}
            </button>
          </div>

          {/* Restaurar Backup */}
          <div className="bg-white p-6 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Upload className="text-blue-600" size={24} />
              <h4 className="font-bold text-gray-800">Restaurar Backup</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Importa dados de um arquivo de backup anterior.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              disabled={isImporting}
              className="hidden"
              id="import-backup"
            />
            <label
              htmlFor="import-backup"
              className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload size={18} />
              {isImporting ? 'Carregando...' : 'Carregar Backup'}
            </label>
          </div>

          {/* Limpar Dados */}
          <div className="bg-white p-6 rounded-lg border-2 border-red-200 hover:border-red-400 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="text-red-600" size={24} />
              <h4 className="font-bold text-gray-800">Resetar Sistema</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Remove todos os dados e volta aos dados iniciais.
            </p>
            <button
              onClick={handleClearClick}
              disabled={isClearing}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
              {isClearing ? 'Limpando...' : 'Limpar Tudo'}
            </button>
          </div>
        </div>

        {/* Informação sobre localStorage */}
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Dica:</strong> Seus dados são salvos automaticamente no navegador (localStorage). 
            Recomendamos criar backups regularmente para segurança extra!
          </p>
        </div>
      </div>

      {/* ALERTAS */}
      {stats.prazosVencidos > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 flex items-center gap-4 animate-pulse">
          <div className="text-red-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-red-800 text-lg">⚠️ Atenção Necessária</h4>
            <p className="text-red-700">
              Existem <span className="font-bold">{stats.prazosVencidos}</span> prazo(s) vencido(s) que necessitam de ação imediata.
            </p>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Restaurar Backup */}
      <ConfirmationModal
        isOpen={showRestoreModal}
        title="Restaurar Backup?"
        message={`⚠️ ATENÇÃO!\n\nAo restaurar o backup, TODOS os dados atuais serão substituídos pelos dados do arquivo.\n\nRecomendamos criar um backup dos dados atuais antes de continuar.\n\nDeseja prosseguir com a restauração?`}
        confirmText={isImporting ? "Restaurando..." : "Sim, restaurar"}
        cancelText="Cancelar"
        onConfirm={confirmRestore}
        onCancel={() => {
          setShowRestoreModal(false);
          setPendingFileData(null);
        }}
        type="warning"
      />

      {/* Modal de Confirmação para Limpar Dados */}
      <ConfirmationModal
        isOpen={showClearModal}
        title="Resetar Sistema?"
        message={`🔴 ATENÇÃO CRÍTICA!\n\nEsta ação irá:\n• APAGAR TODOS os dados atuais\n• Restaurar os dados de exemplo iniciais\n• NÃO PODE ser desfeita\n\nFaça um backup antes de prosseguir!\n\nTem CERTEZA ABSOLUTA que deseja continuar?`}
        confirmText={isClearing ? "Resetando..." : "Sim, RESETAR TUDO"}
        cancelText="Não, cancelar"
        onConfirm={confirmClear}
        onCancel={() => setShowClearModal(false)}
        type="danger"
      />
    </div>
  );
}
