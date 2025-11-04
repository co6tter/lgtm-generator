import { describe, it, expect, beforeEach } from 'vitest';
import { encodeConfigToURL, decodeConfigFromURL } from '../url';
import { DEFAULT_CONFIG } from '@/constants';
import type { LGTMConfig } from '@/types';

describe('URL encoding/decoding', () => {
  describe('encodeConfigToURL', () => {
    it('should encode config to URL with query parameters', () => {
      const config: LGTMConfig = {
        text: 'LGTM',
        template: 'classic',
        fontSize: 'medium',
        textColor: '#FFFFFF',
        backgroundColor: '#3B82F6',
        textPosition: 'center',
      };

      const url = encodeConfigToURL(config);
      expect(url).toContain('text=LGTM');
      expect(url).toContain('tpl=classic');
      expect(url).toContain('size=medium');
      expect(url).toContain('tc=FFFFFF'); // without #
      expect(url).toContain('bg=3B82F6'); // without #
      expect(url).toContain('pos=center');
    });

    it('should encode spaces in text', () => {
      const config = { ...DEFAULT_CONFIG, text: 'Looks Good' };
      const url = encodeConfigToURL(config);
      // URLSearchParams can encode spaces as + or %20
      expect(url).toMatch(/text=Looks[\+%20]Good/);
    });

    it('should remove # from colors', () => {
      const config = {
        ...DEFAULT_CONFIG,
        textColor: '#ABC123',
        backgroundColor: '#DEF456',
      };
      const url = encodeConfigToURL(config);
      expect(url).toContain('tc=ABC123');
      expect(url).toContain('bg=DEF456');
      expect(url).not.toContain('#');
    });
  });

  describe('decodeConfigFromURL', () => {
    beforeEach(() => {
      // Reset location mock
      delete (window as any).location;
      (window as any).location = {
        href: 'http://localhost:3000',
        search: ''
      };
    });

    it('should return null when no parameters', () => {
      (window as any).location.href = 'http://localhost:3000';
      const config = decodeConfigFromURL();
      expect(config).toBeNull();
    });

    it('should decode basic parameters', () => {
      (window as any).location.href = 'http://localhost:3000?text=Test&tpl=dark&size=medium&tc=FFFFFF&bg=000000&pos=center';
      const config = decodeConfigFromURL();
      expect(config).toBeDefined();
      expect(config?.text).toBe('Test');
      expect(config?.template).toBe('dark');
    });

    it('should add # to colors', () => {
      (window as any).location.href = 'http://localhost:3000?text=LGTM&tpl=classic&size=medium&tc=FF0000&bg=00FF00&pos=center';
      const config = decodeConfigFromURL();
      expect(config?.textColor).toBe('#FF0000');
      expect(config?.backgroundColor).toBe('#00FF00');
    });

    it('should decode URL-encoded text', () => {
      (window as any).location.href = 'http://localhost:3000?text=Hello+World&tpl=classic&size=medium&tc=FFFFFF&bg=000000&pos=center';
      const config = decodeConfigFromURL();
      expect(config?.text).toBe('Hello World');
    });
  });

  describe('round-trip encoding/decoding', () => {
    it('should preserve config through encode/decode cycle', () => {
      const original: LGTMConfig = {
        text: 'Test',
        template: 'vibrant',
        fontSize: 'large',
        textColor: '#FF6B6B',
        backgroundColor: '#4ECDC4',
        textPosition: 'bottom',
      };

      // Encode with explicit base URL
      const url = encodeConfigToURL(original, 'http://localhost:3000');

      // Decode using the generated URL
      const decoded = decodeConfigFromURL(url);

      expect(decoded?.text).toBe(original.text);
      expect(decoded?.template).toBe(original.template);
      expect(decoded?.fontSize).toBe(original.fontSize);
      expect(decoded?.textColor).toBe(original.textColor);
      expect(decoded?.backgroundColor).toBe(original.backgroundColor);
      expect(decoded?.textPosition).toBe(original.textPosition);
    });
  });
});
