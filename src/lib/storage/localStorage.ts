/**
 * LocalStorage Utilities
 * Handles persistent storage of LGTM configurations and user preferences
 */

import type { LGTMConfig, StorageResult } from "@/types";
import { STORAGE_KEYS, VALIDATION, CURRENT_VERSION } from "@/constants";

/**
 * User preferences interface
 */
export interface UserPreferences {
  defaultTemplate?: string;
  language?: "en" | "ja";
  theme?: "light" | "dark";
}

/**
 * Save LGTM configuration to recent configs
 * Maintains a maximum of 20 recent configurations (FIFO)
 */
export function saveConfig(config: LGTMConfig): StorageResult<LGTMConfig> {
  try {
    const recent = getRecentConfigs();
    const newConfig: LGTMConfig = {
      ...config,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to beginning and limit to max
    recent.unshift(newConfig);
    const limited = recent.slice(0, VALIDATION.MAX_RECENT_CONFIGS);

    localStorage.setItem(STORAGE_KEYS.RECENT_CONFIGS, JSON.stringify(limited));
    localStorage.setItem(STORAGE_KEYS.LAST_CONFIG, JSON.stringify(newConfig));

    return {
      success: true,
      data: newConfig,
    };
  } catch (error) {
    console.error("Failed to save config:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save configuration",
    };
  }
}

/**
 * Get recent configurations from LocalStorage
 */
export function getRecentConfigs(): LGTMConfig[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_CONFIGS);
    if (!data) return [];

    const configs = JSON.parse(data) as LGTMConfig[];
    return Array.isArray(configs) ? configs : [];
  } catch (error) {
    console.error("Failed to load recent configs:", error);
    return [];
  }
}

/**
 * Get the last used configuration
 */
export function getLastConfig(): LGTMConfig | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_CONFIG);
    if (!data) return null;

    return JSON.parse(data) as LGTMConfig;
  } catch (error) {
    console.error("Failed to load last config:", error);
    return null;
  }
}

/**
 * Clear all recent configurations
 */
export function clearRecentConfigs(): StorageResult {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_CONFIGS);
    localStorage.removeItem(STORAGE_KEYS.LAST_CONFIG);

    return { success: true };
  } catch (error) {
    console.error("Failed to clear recent configs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear configurations",
    };
  }
}

/**
 * Save user preferences
 */
export function saveUserPreferences(preferences: UserPreferences): StorageResult<UserPreferences> {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));

    return {
      success: true,
      data: preferences,
    };
  } catch (error) {
    console.error("Failed to save preferences:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save preferences",
    };
  }
}

/**
 * Get user preferences
 */
export function getUserPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (!data) return {};

    return JSON.parse(data) as UserPreferences;
  } catch (error) {
    console.error("Failed to load preferences:", error);
    return {};
  }
}

/**
 * Migrate LocalStorage data to current version
 */
export function migrateLocalStorage(): void {
  try {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);

    if (version === CURRENT_VERSION.toString()) {
      return; // Already up to date
    }

    // Perform migration if needed
    // Currently at version 1, no migration needed yet

    // Update version
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION.toString());
  } catch (error) {
    console.error("Migration failed:", error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEYS.RECENT_CONFIGS);
    localStorage.removeItem(STORAGE_KEYS.LAST_CONFIG);
  }
}

/**
 * Check if LocalStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
