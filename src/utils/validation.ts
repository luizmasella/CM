// FILE: src/utils/validation.ts
// Sistema de validação robusto

export interface ValidationError {
  field: string;
  message: string;
}

export interface PericiaFormData {
  numeroProcesso: string;
  reclamante: string;
  reclamadas: string[];
  data: string;
  hora: string;
  tipo: string;
  vara: string;
  juiz: string;
  local: string;
  regiao: string;
  status: string;
  justicaGratuita: boolean;
  honorariosSolicitados: string;
  honorariosDeferidos: string;
  prazoLaudo: string;
  prazoQuesitos: string;
  observacoes: string;
}

export class PericiaValidator {
  private errors: ValidationError[] = [];

  // Validação de número de processo (formato CNJ)
  validateNumeroProcesso(value: string): boolean {
    this.errors = this.errors.filter((e) => e.field !== "numeroProcesso");
    
    if (!value || value.trim() === "") {
      this.errors.push({
        field: "numeroProcesso",
        message: "Número do processo é obrigatório",
      });
      return false;
    }

    // Formato CNJ: NNNNNNN-DD.AAAA.J.TT.OOOO
    const cnJFormat = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/;
    if (!cnJFormat.test(value)) {
      this.errors.push({
        field: "numeroProcesso",
        message: "Formato inválido. Use: NNNNNNN-DD.AAAA.J.TT.OOOO",
      });
      return false;
    }

    return true;
  }

  // Validação de nome (reclamante/juiz)
  validateNome(field: string, value: string, label: string): boolean {
    this.errors = this.errors.filter((e) => e.field !== field);

    if (!value || value.trim() === "") {
      this.errors.push({
        field,
        message: `${label} é obrigatório`,
      });
      return false;
    }

    if (value.trim().length < 3) {
      this.errors.push({
        field,
        message: `${label} deve ter no mínimo 3 caracteres`,
      });
      return false;
    }

    // Verifica se tem pelo menos nome e sobrenome
    const palavras = value.trim().split(/\s+/);
    if (palavras.length < 2) {
      this.errors.push({
        field,
        message: `${label} deve conter nome e sobrenome`,
      });
      return false;
    }

    return true;
  }

  // Validação de reclamadas
  validateReclamadas(reclamadas: string[]): boolean {
    this.errors = this.errors.filter((e) => e.field !== "reclamadas");

    const reclamadasValidas = reclamadas.filter((r) => r.trim() !== "");
    
    if (reclamadasValidas.length === 0) {
      this.errors.push({
        field: "reclamadas",
        message: "Pelo menos uma reclamada é obrigatória",
      });
      return false;
    }

    for (let i = 0; i < reclamadasValidas.length; i++) {
      if (reclamadasValidas[i].trim().length < 3) {
        this.errors.push({
          field: "reclamadas",
          message: `Reclamada ${i + 1} deve ter no mínimo 3 caracteres`,
        });
        return false;
      }
    }

    return true;
  }

  // Validação de data
  validateData(value: string): boolean {
    this.errors = this.errors.filter((e) => e.field !== "data");

    if (!value || value.trim() === "") {
      this.errors.push({
        field: "data",
        message: "Data é obrigatória",
      });
      return false;
    }

    const data = new Date(value);
    const hoje = new Date();
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(hoje.getFullYear() - 1);
    const doisAnosFrente = new Date();
    doisAnosFrente.setFullYear(hoje.getFullYear() + 2);

    if (data < umAnoAtras) {
      this.errors.push({
        field: "data",
        message: "Data não pode ser anterior a 1 ano atrás",
      });
      return false;
    }

    if (data > doisAnosFrente) {
      this.errors.push({
        field: "data",
        message: "Data não pode ser posterior a 2 anos no futuro",
      });
      return false;
    }

    return true;
  }

  // Validação de hora
  validateHora(value: string): boolean {
    this.errors = this.errors.filter((e) => e.field !== "hora");

    if (!value || value.trim() === "") {
      this.errors.push({
        field: "hora",
        message: "Hora é obrigatória",
      });
      return false;
    }

    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!horaRegex.test(value)) {
      this.errors.push({
        field: "hora",
        message: "Formato de hora inválido (HH:MM)",
      });
      return false;
    }

    return true;
  }

  // Validação de honorários
  validateHonorarios(
    solicitados: string,
    deferidos: string
  ): boolean {
    this.errors = this.errors.filter(
      (e) =>
        e.field !== "honorariosSolicitados" && e.field !== "honorariosDeferidos"
    );

    const valorSolicitado = parseFloat(solicitados);
    const valorDeferido = parseFloat(deferidos);

    if (isNaN(valorSolicitado) || valorSolicitado < 0) {
      this.errors.push({
        field: "honorariosSolicitados",
        message: "Valor de honorários solicitados inválido",
      });
      return false;
    }

    if (isNaN(valorDeferido) || valorDeferido < 0) {
      this.errors.push({
        field: "honorariosDeferidos",
        message: "Valor de honorários deferidos inválido",
      });
      return false;
    }

    if (valorDeferido > valorSolicitado) {
      this.errors.push({
        field: "honorariosDeferidos",
        message: "Honorários deferidos não podem ser maiores que os solicitados",
      });
      return false;
    }

    if (valorSolicitado > 100000) {
      this.errors.push({
        field: "honorariosSolicitados",
        message: "Valor de honorários muito alto (máximo: R$ 100.000,00)",
      });
      return false;
    }

    return true;
  }

  // Validação de prazos
  validatePrazos(prazoLaudo: string, prazoQuesitos: string, dataPeriicia: string): boolean {
    this.errors = this.errors.filter(
      (e) => e.field !== "prazoLaudo" && e.field !== "prazoQuesitos"
    );

    const dataPer = new Date(dataPeriicia);

    if (prazoLaudo && prazoLaudo.trim() !== "") {
      const dataLaudo = new Date(prazoLaudo);
      if (dataLaudo < dataPer) {
        this.errors.push({
          field: "prazoLaudo",
          message: "Prazo do laudo não pode ser anterior à data da perícia",
        });
        return false;
      }
    }

    if (prazoQuesitos && prazoQuesitos.trim() !== "") {
      const dataQuesitos = new Date(prazoQuesitos);
      if (dataQuesitos < dataPer) {
        this.errors.push({
          field: "prazoQuesitos",
          message: "Prazo dos quesitos não pode ser anterior à data da perícia",
        });
        return false;
      }
    }

    return true;
  }

  // Validação de campo obrigatório genérico
  validateRequired(field: string, value: string, label: string): boolean {
    this.errors = this.errors.filter((e) => e.field !== field);

    if (!value || value.trim() === "") {
      this.errors.push({
        field,
        message: `${label} é obrigatório`,
      });
      return false;
    }

    return true;
  }

  // Valida todos os campos do formulário
  validateAll(formData: PericiaFormData): boolean {
    this.errors = [];

    this.validateNumeroProcesso(formData.numeroProcesso);
    this.validateNome("reclamante", formData.reclamante, "Reclamante");
    this.validateReclamadas(formData.reclamadas);
    this.validateData(formData.data);
    this.validateHora(formData.hora);
    this.validateRequired("tipo", formData.tipo, "Tipo de perícia");
    this.validateRequired("vara", formData.vara, "Vara");
    this.validateRequired("local", formData.local, "Local");
    this.validateHonorarios(
      formData.honorariosSolicitados,
      formData.honorariosDeferidos
    );
    
    if (formData.prazoLaudo || formData.prazoQuesitos) {
      this.validatePrazos(
        formData.prazoLaudo,
        formData.prazoQuesitos,
        formData.data
      );
    }

    return this.errors.length === 0;
  }

  // Retorna todos os erros
  getErrors(): ValidationError[] {
    return this.errors;
  }

  // Retorna erro de um campo específico
  getFieldError(field: string): string | null {
    const error = this.errors.find((e) => e.field === field);
    return error ? error.message : null;
  }

  // Limpa todos os erros
  clearErrors(): void {
    this.errors = [];
  }

  // Limpa erro de um campo específico
  clearFieldError(field: string): void {
    this.errors = this.errors.filter((e) => e.field !== field);
  }
}

// Hook personalizado para usar o validator
import { useState, useCallback } from "react";

export function useFormValidation() {
  const [validator] = useState(() => new PericiaValidator());
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = useCallback(
    (formData: PericiaFormData) => {
      const isValid = validator.validateAll(formData);
      setErrors(validator.getErrors());
      return isValid;
    },
    [validator]
  );

  const getFieldError = useCallback(
    (field: string) => {
      return validator.getFieldError(field);
    },
    [validator]
  );

  const clearErrors = useCallback(() => {
    validator.clearErrors();
    setErrors([]);
  }, [validator]);

  const clearFieldError = useCallback(
    (field: string) => {
      validator.clearFieldError(field);
      setErrors(validator.getErrors());
    },
    [validator]
  );

  return {
    validate,
    errors,
    getFieldError,
    clearErrors,
    clearFieldError,
  };
}
