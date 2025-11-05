import { describe, it, expect } from 'vitest';
import { validateLGTMConfig, sanitizeText, sanitizeColor } from '../validation';
import { DEFAULT_CONFIG } from '@/constants';

describe('validation utils', () => {
  describe('validateLGTMConfig', () => {
    it('should validate a valid config', () => {
      const result = validateLGTMConfig(DEFAULT_CONFIG);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject text exceeding max length', () => {
      const config = { ...DEFAULT_CONFIG, text: 'a'.repeat(51) };
      const result = validateLGTMConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should accept valid templates', () => {
      const templates: Array<'classic' | 'dark' | 'minimal' | 'vibrant' | 'retro'> = ['classic', 'dark', 'minimal', 'vibrant', 'retro'];
      templates.forEach((template) => {
        const config = { ...DEFAULT_CONFIG, template };
        const result = validateLGTMConfig(config);
        expect(result.isValid).toBe(true);
      });
    });

    it('should accept valid font sizes', () => {
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      sizes.forEach((size) => {
        const config = { ...DEFAULT_CONFIG, fontSize: size };
        const result = validateLGTMConfig(config);
        expect(result.isValid).toBe(true);
      });
    });

    it('should accept valid text positions', () => {
      const positions: Array<'top' | 'center' | 'bottom'> = ['top', 'center', 'bottom'];
      positions.forEach((position) => {
        const config = { ...DEFAULT_CONFIG, textPosition: position };
        const result = validateLGTMConfig(config);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('sanitizeText', () => {
    it('should trim whitespace', () => {
      expect(sanitizeText('  LGTM  ')).toBe('LGTM');
    });

    it('should limit to 50 characters', () => {
      const longText = 'a'.repeat(100);
      expect(sanitizeText(longText)).toHaveLength(50);
    });

    it('should handle empty string', () => {
      expect(sanitizeText('')).toBe('');
    });

    it('should handle normal text', () => {
      expect(sanitizeText('LGTM')).toBe('LGTM');
    });
  });

  describe('sanitizeColor', () => {
    it('should add # prefix if missing', () => {
      expect(sanitizeColor('FFFFFF')).toBe('#FFFFFF');
      expect(sanitizeColor('000000')).toBe('#000000');
    });

    it('should uppercase hex values', () => {
      expect(sanitizeColor('#abc123')).toBe('#ABC123');
      expect(sanitizeColor('def456')).toBe('#DEF456');
    });

    it('should return default color for invalid input', () => {
      expect(sanitizeColor('invalid')).toBe('#000000');
      expect(sanitizeColor('gg0000')).toBe('#000000');
      expect(sanitizeColor('')).toBe('#000000');
    });

    it('should only accept 6-digit hex colors', () => {
      // 3-digit hex codes are not supported, returns default
      expect(sanitizeColor('#FFF')).toBe('#000000');
      // Valid 6-digit hex code
      expect(sanitizeColor('#FFFFFF')).toBe('#FFFFFF');
    });
  });
});
