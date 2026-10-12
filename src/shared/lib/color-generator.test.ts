import { describe, it, expect } from 'vitest';
import { generateMakeColor, generateMakeHue } from './color-generator';

describe('color-generator', () => {
  describe('generateMakeHue', () => {
    it('should generate consistent hue for the same string', () => {
      const hue1 = generateMakeHue('Tesla');
      const hue2 = generateMakeHue('Tesla');
      expect(hue1).toBe(hue2);
    });

    it('should generate different hues for different strings (mostly)', () => {
      // Note: Hash collisions are possible but unlikely for small set of distinct strings
      const hue1 = generateMakeHue('Tesla');
      const hue2 = generateMakeHue('BMW');
      expect(hue1).not.toBe(hue2);
    });

    it('should return a value between 0 and 360', () => {
      const hue = generateMakeHue('RandomString123');
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    });
  });

  describe('generateMakeColor', () => {
    it('should return a valid HSL string', () => {
      const color = generateMakeColor('Tesla');
      expect(color).toMatch(/^hsl\(\d+(\.\d+)?, 100%, 50%\)$/);
    });

    it('should use the hue from generateMakeHue', () => {
      const hue = generateMakeHue('Tesla');
      const color = generateMakeColor('Tesla');
      expect(color).toBe(`hsl(${hue}, 100%, 50%)`);
    });
  });
});
