// src/utils/validation.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { PericiaValidator } from './validation';

describe('PericiaValidator', () => {
  let validator: PericiaValidator;

  beforeEach(() => {
    validator = new PericiaValidator();
  });

  // Testes para validateNumeroProcesso
  describe('validateNumeroProcesso', () => {
    it('should return true for a valid CNJ process number', () => {
      const isValid = validator.validateNumeroProcesso('1234567-89.2023.4.05.8300');
      expect(isValid).toBe(true);
      expect(validator.getFieldError('numeroProcesso')).toBeNull();
    });

    it('should return false for an empty process number', () => {
      const isValid = validator.validateNumeroProcesso('');
      expect(isValid).toBe(false);
      expect(validator.getFieldError('numeroProcesso')).toBe('Número do processo é obrigatório');
    });

    it('should return false for a process number with incorrect format', () => {
      const isValid = validator.validateNumeroProcesso('12345-67.2023.4.05.8300');
      expect(isValid).toBe(false);
      expect(validator.getFieldError('numeroProcesso')).toBe('Formato inválido. Use: NNNNNNN-DD.AAAA.J.TT.OOOO');
    });

    it('should return false for a process number with letters', () => {
      const isValid = validator.validateNumeroProcesso('abcdefg-ab.cdef.g.hi.jklm');
      expect(isValid).toBe(false);
      expect(validator.getFieldError('numeroProcesso')).toBe('Formato inválido. Use: NNNNNNN-DD.AAAA.J.TT.OOOO');
    });
  });
});
