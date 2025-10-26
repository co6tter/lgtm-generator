/**
 * Canvas Generator Tests
 * Manual verification tests for image generation
 */

import { generateLGTMImage } from '../generator';
import { DEFAULT_CONFIG } from '@/constants';
import type { LGTMConfig } from '@/types';

/**
 * Test configurations for different scenarios
 */
export const TEST_CONFIGS: LGTMConfig[] = [
  // Default configuration
  DEFAULT_CONFIG,

  // Classic template with custom text
  {
    ...DEFAULT_CONFIG,
    text: 'Looks Good!',
    template: 'classic',
  },

  // Dark template
  {
    ...DEFAULT_CONFIG,
    text: 'APPROVED ✓',
    template: 'dark',
  },

  // Minimal template
  {
    ...DEFAULT_CONFIG,
    text: 'Ship it! 🚀',
    template: 'minimal',
  },

  // Vibrant template with multi-line
  {
    ...DEFAULT_CONFIG,
    text: 'Great Work!\nLGTM',
    template: 'vibrant',
  },

  // Retro template with position
  {
    ...DEFAULT_CONFIG,
    text: 'LGTM',
    template: 'retro',
    textPosition: 'bottom',
  },

  // Large font size
  {
    ...DEFAULT_CONFIG,
    text: 'LGTM',
    fontSize: 'large',
  },

  // Small font size
  {
    ...DEFAULT_CONFIG,
    text: 'Looks Good To Me',
    fontSize: 'small',
  },
];

/**
 * Verify that image generation works correctly
 * This is a manual test - run in browser console
 */
export async function testImageGeneration() {
  console.log('🧪 Testing Canvas Image Generation...\n');

  for (let i = 0; i < TEST_CONFIGS.length; i++) {
    const config = TEST_CONFIGS[i];
    console.log(`Test ${i + 1}/${TEST_CONFIGS.length}: ${config.template} template`);

    try {
      const result = await generateLGTMImage(config);

      if (result.success && result.dataUrl && result.blob) {
        console.log(`✅ Success - Blob size: ${result.blob.size} bytes`);
      } else {
        console.error(`❌ Failed - ${result.error}`);
      }
    } catch (error) {
      console.error(`❌ Error:`, error);
    }
  }

  console.log('\n✅ All tests completed!');
}

// Note: This test file is for development/manual testing only
// Actual unit tests would use a proper testing framework
