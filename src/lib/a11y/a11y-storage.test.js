import { beforeEach, describe, expect, it } from 'vitest';
import { loadA11y, saveA11y } from './a11y-storage';

describe('a11y-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Accessibility settings should be saved and recalled', () => {
    const mockSettings = { fontSize: 'large', highContrast: true };

    saveA11y(mockSettings);
    const loaded = loadA11y();

    expect(loaded).toEqual(mockSettings);
  });

  it('should return null when no settings are saved', () => {
    const loaded = loadA11y();
    expect(loaded).toBeNull();
  });
});
