import { describe, expect, it } from 'vitest';
import { A11yContrast, A11yContrastClass, A11yTextSize, A11yTextSizeClass } from './a11yEnums';

describe('a11yEnums', () => {
  describe('A11yContrastClass', () => {
    it('The "a11y-contrast-high" class must be returned at the HIGH(3) level', () => {
      expect(A11yContrastClass(A11yContrast.HIGH)).toBe('a11y-contrast-high');
    });

    it('The empty string must be returned at the NORMAL(0) level', () => {
      expect(A11yContrastClass(A11yContrast.NORMAL)).toBe('');
    });
  });

  describe('A11yTextSizeClass', () => {
    it('The "a11y-text-size-2" class must be returned at the LARGER(2) level', () => {
      expect(A11yTextSizeClass(A11yTextSize.LARGER)).toBe('a11y-text-size-2');
    });

    it('The empty string must be returned at the NORMAL(0) level', () => {
      expect(A11yTextSizeClass(A11yTextSize.NORMAL)).toBe('');
    });
  });
});
