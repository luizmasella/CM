// FILE: src/utils/errorHandler.ts
// Sistema centralizado de tratamento de erros

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  VALIDATION = 'validation',
  STORAGE = 'storage',
  NETWORK = 'network',
  PROCESSING = 'processing',
  USER_ACTION = 'user_action',
  UNKNOWN = 'unknown'
}

export interface ErrorLog {
  timestamp: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: string;
  message: string;
  stack?: string;
  userMessage: string;
}

class ErrorHandler {
  private logs: ErrorLog[] = [];
  private readonly MAX_LOGS = 100;

  /**
   * Registra um erro no sistema
   */
  logError(
    category: ErrorCategory,
    severity: ErrorSeverity,
    context: string,
    error: unknown,
    userMessage?: string
  ): ErrorLog {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      category,
      severity,
      context,
      message: this.extractErrorMessage(error),
      stack: error instanceof Error ? error.stack : undefined,
      userMessage: userMessage || this.getDefaultUserMessage(category, severity)
    };

    this.logs.push(errorLog);

    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // Console log em desenvolvimento
    if (import.meta.env.DEV) {
      this.consoleLog(errorLog);
    }

    // Erros críticos
    if (severity === ErrorSeverity.CRITICAL) {
      this.handleCriticalError(errorLog);
    }

    return errorLog;
  }

  /**
   * Extrai mensagem de erro
   */
  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      return JSON.stringify(error);
    }
    return 'Erro desconhecido';
  }

  /**
   * Mensagem padrão para o usuário
   */
  private getDefaultUserMessage(category: ErrorCategory, severity: ErrorSeverity): string {
    const messages: Record<ErrorCategory, Record<ErrorSeverity, string>> = {
      [ErrorCategory.VALIDATION]: {
        [ErrorSeverity.LOW]: 'Por favor, verifique os dados informados.',
        [ErrorSeverity.MEDIUM]: 'Alguns campos contêm valores inválidos.',
        [ErrorSeverity.HIGH]: 'Não foi possível validar os dados.',
        [ErrorSeverity.CRITICAL]: 'Erro crítico na validação.'
      },
      [ErrorCategory.STORAGE]: {
        [ErrorSeverity.LOW]: 'Dados salvos temporariamente.',
        [ErrorSeverity.MEDIUM]: 'Problema ao salvar. Suas alterações podem não persistir.',
        [ErrorSeverity.HIGH]: 'Não foi possível salvar. Recomendamos fazer backup.',
        [ErrorSeverity.CRITICAL]: 'ERRO CRÍTICO: Faça backup imediatamente!'
      },
      [ErrorCategory.NETWORK]: {
        [ErrorSeverity.LOW]: 'Pequeno problema de conexão.',
        [ErrorSeverity.MEDIUM]: 'Problema de conexão detectado.',
        [ErrorSeverity.HIGH]: 'Sem conexão com o servidor.',
        [ErrorSeverity.CRITICAL]: 'Falha crítica de conexão.'
      },
      [ErrorCategory.PROCESSING]: {
        [ErrorSeverity.LOW]: 'Pequeno problema ao processar.',
        [ErrorSeverity.MEDIUM]: 'Erro ao processar dados.',
        [ErrorSeverity.HIGH]: 'Não foi possível processar a operação.',
        [ErrorSeverity.CRITICAL]: 'Falha crítica no processamento.'
      },
      [ErrorCategory.USER_ACTION]: {
        [ErrorSeverity.LOW]: 'Ação não pôde ser completada.',
        [ErrorSeverity.MEDIUM]: 'Erro ao executar ação.',
        [ErrorSeverity.HIGH]: 'Operação falhou. Tente novamente.',
        [ErrorSeverity.CRITICAL]: 'Falha crítica na operação.'
      },
      [ErrorCategory.UNKNOWN]: {
        [ErrorSeverity.LOW]: 'Algo deu errado.',
        [ErrorSeverity.MEDIUM]: 'Erro inesperado.',
        [ErrorSeverity.HIGH]: 'Erro grave. Tente novamente.',
        [ErrorSeverity.CRITICAL]: 'Erro crítico no sistema.'
      }
    };

    return messages[category][severity];
  }

  /**
   * Log no console (desenvolvimento)
   */
  private consoleLog(errorLog: ErrorLog): void {
    const emoji = {
      [ErrorSeverity.LOW]: '⚠️',
      [ErrorSeverity.MEDIUM]: '⚠️',
      [ErrorSeverity.HIGH]: '🔴',
      [ErrorSeverity.CRITICAL]: '💥'
    };

    const color = {
      [ErrorSeverity.LOW]: 'color: orange',
      [ErrorSeverity.MEDIUM]: 'color: orange',
      [ErrorSeverity.HIGH]: 'color: red',
      [ErrorSeverity.CRITICAL]: 'color: red; font-weight: bold'
    };

    console.group(`${emoji[errorLog.severity]} [${errorLog.category}] ${errorLog.context}`);
    console.log('%c' + errorLog.message, color[errorLog.severity]);
    if (errorLog.stack) {
      console.log('Stack:', errorLog.stack);
    }
    console.log('User Message:', errorLog.userMessage);
    console.log('Timestamp:', errorLog.timestamp);
    console.groupEnd();
  }

  /**
   * Tratamento de erros críticos
   */
  private handleCriticalError(errorLog: ErrorLog): void {
    // Em produção, poderia enviar para serviço de monitoramento
    console.error('💥 ERRO CRÍTICO:', errorLog);
    
    // Salva no localStorage para análise posterior
    try {
      const criticalLogs = JSON.parse(
        localStorage.getItem('critical_errors') || '[]'
      );
      criticalLogs.push(errorLog);
      localStorage.setItem('critical_errors', JSON.stringify(criticalLogs.slice(-10)));
    } catch (e) {
      console.error('Não foi possível salvar erro crítico:', e);
    }
  }

  /**
   * Retorna todos os logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Retorna logs por severidade
   */
  getLogsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Retorna logs por categoria
   */
  getLogsByCategory(category: ErrorCategory): ErrorLog[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Limpa todos os logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Exporta logs como JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton
export const errorHandler = new ErrorHandler();

/**
 * Wrapper para executar funções com tratamento de erro
 */
export async function safeExecute<T>(
  fn: () => T | Promise<T>,
  context: string,
  category: ErrorCategory = ErrorCategory.PROCESSING,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): Promise<{ success: boolean; data?: T; error?: ErrorLog }> {
  try {
    const result = await Promise.resolve(fn());
    return { success: true, data: result };
  } catch (error) {
    const errorLog = errorHandler.logError(category, severity, context, error);
    return { success: false, error: errorLog };
  }
}

/**
 * Hook para tratamento de erros com toast
 */
export function useErrorHandler() {
  const logAndToast = (
    category: ErrorCategory,
    severity: ErrorSeverity,
    context: string,
    error: unknown,
    toastFn?: (message: string) => void,
    customUserMessage?: string
  ): ErrorLog => {
    const errorLog = errorHandler.logError(
      category,
      severity,
      context,
      error,
      customUserMessage
    );

    if (toastFn) {
      toastFn(errorLog.userMessage);
    }

    return errorLog;
  };

  return {
    logError: errorHandler.logError.bind(errorHandler),
    logAndToast,
    getLogs: errorHandler.getLogs.bind(errorHandler),
    clearLogs: errorHandler.clearLogs.bind(errorHandler),
    exportLogs: errorHandler.exportLogs.bind(errorHandler)
  };
}
