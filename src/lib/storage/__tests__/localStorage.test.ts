import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveConfig,
  getRecentConfigs,
  deleteConfig,
  clearRecentConfigs,
  getLastConfig,
  isLocalStorageAvailable,
} from '../localStorage';
import { DEFAULT_CONFIG } from '@/constants';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-' + Math.random(),
});

describe('localStorage utils', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveConfig', () => {
    it('should save a config', () => {
      const result = saveConfig(DEFAULT_CONFIG);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBeDefined();
      expect(result.data?.createdAt).toBeDefined();
    });

    it('should add config to recent configs', () => {
      saveConfig(DEFAULT_CONFIG);
      const recent = getRecentConfigs();
      expect(recent).toHaveLength(1);
      expect(recent[0].text).toBe(DEFAULT_CONFIG.text);
    });

    it('should limit to 20 recent configs (FIFO)', () => {
      // Add 25 configs
      for (let i = 0; i < 25; i++) {
        saveConfig({ ...DEFAULT_CONFIG, text: `Config ${i}` });
      }

      const recent = getRecentConfigs();
      expect(recent).toHaveLength(20);
      // Most recent should be Config 24
      expect(recent[0].text).toBe('Config 24');
      // Oldest should be Config 5 (0-4 were removed)
      expect(recent[19].text).toBe('Config 5');
    });

    it('should update last config', () => {
      saveConfig(DEFAULT_CONFIG);
      const last = getLastConfig();
      expect(last).toBeDefined();
      expect(last?.text).toBe(DEFAULT_CONFIG.text);
    });
  });

  describe('getRecentConfigs', () => {
    it('should return empty array when no configs', () => {
      const configs = getRecentConfigs();
      expect(configs).toEqual([]);
    });

    it('should return saved configs', () => {
      saveConfig({ ...DEFAULT_CONFIG, text: 'First' });
      saveConfig({ ...DEFAULT_CONFIG, text: 'Second' });

      const configs = getRecentConfigs();
      expect(configs).toHaveLength(2);
      expect(configs[0].text).toBe('Second'); // Most recent first
      expect(configs[1].text).toBe('First');
    });

    it('should handle corrupted data', () => {
      localStorageMock.setItem('lgtm-recent-configs', 'invalid json');
      const configs = getRecentConfigs();
      expect(configs).toEqual([]);
    });
  });

  describe('deleteConfig', () => {
    it('should delete a specific config', () => {
      saveConfig({ ...DEFAULT_CONFIG, text: 'Keep' });
      const result2 = saveConfig({ ...DEFAULT_CONFIG, text: 'Delete' });

      deleteConfig(result2.data!.id!);

      const configs = getRecentConfigs();
      expect(configs).toHaveLength(1);
      expect(configs[0].text).toBe('Keep');
    });

    it('should handle non-existent id', () => {
      saveConfig(DEFAULT_CONFIG);
      const result = deleteConfig('non-existent-id');
      expect(result.success).toBe(true);
      expect(getRecentConfigs()).toHaveLength(1);
    });
  });

  describe('clearRecentConfigs', () => {
    it('should clear all configs', () => {
      saveConfig({ ...DEFAULT_CONFIG, text: 'First' });
      saveConfig({ ...DEFAULT_CONFIG, text: 'Second' });

      const result = clearRecentConfigs();
      expect(result.success).toBe(true);
      expect(getRecentConfigs()).toEqual([]);
      expect(getLastConfig()).toBeNull();
    });
  });

  describe('getLastConfig', () => {
    it('should return null when no config', () => {
      expect(getLastConfig()).toBeNull();
    });

    it('should return last saved config', () => {
      saveConfig({ ...DEFAULT_CONFIG, text: 'First' });
      saveConfig({ ...DEFAULT_CONFIG, text: 'Last' });

      const last = getLastConfig();
      expect(last?.text).toBe('Last');
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });
  });
});
