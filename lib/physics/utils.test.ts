import { describe, it, expect } from 'vitest';
import { normalizePhase } from './utils';

describe('normalizePhase', () => {
  const PI = Math.PI;

  // Test cases for values already within the [-PI, PI) range
  it('should return the same value if it is within the [-PI, PI) range', () => {
    expect(normalizePhase(0)).toBe(0);
    // The upper bound PI is exclusive, so it wraps to -PI.
    expect(normalizePhase(PI)).toBeCloseTo(-PI);
    expect(normalizePhase(-PI)).toBe(-PI);
    expect(normalizePhase(PI / 2)).toBeCloseTo(PI / 2);
    expect(normalizePhase(-PI / 2)).toBeCloseTo(-PI / 2);
  });

  // Test cases for values in the [0, 2PI] range that need conversion
  it('should normalize values from [PI, 2PI] to [-PI, 0]', () => {
    expect(normalizePhase(1.1 * PI)).toBeCloseTo(-0.9 * PI);
    expect(normalizePhase(1.5 * PI)).toBeCloseTo(-0.5 * PI);
    expect(normalizePhase(1.9 * PI)).toBeCloseTo(-0.1 * PI);
    expect(normalizePhase(2 * PI)).toBe(0);
  });

  // Test cases for large positive values (multiple wraps)
  it('should handle large positive angles correctly', () => {
    expect(normalizePhase(3 * PI)).toBeCloseTo(-PI);
    expect(normalizePhase(4 * PI)).toBe(0);
    expect(normalizePhase(4.5 * PI)).toBeCloseTo(0.5 * PI);
  });

  // Test cases for large negative values (multiple wraps)
  it('should handle large negative angles correctly', () => {
    expect(normalizePhase(-2.5 * PI)).toBeCloseTo(-0.5 * PI);
    expect(normalizePhase(-3 * PI)).toBeCloseTo(-PI);
    expect(normalizePhase(-4 * PI)).toBe(0);
  });

  // Edge cases
  it('should handle edge cases around PI and -PI', () => {
    // A value slightly greater than PI should wrap to slightly greater than -PI
    expect(normalizePhase(PI + 1e-9)).toBeCloseTo(-PI + 1e-9);
    // A value slightly less than 2*PI should wrap to slightly less than 0
    expect(normalizePhase(2 * PI - 1e-9)).toBeCloseTo(-1e-9);
     // A value slightly less than or equal to -PI should not wrap
    expect(normalizePhase(-PI)).toBe(-PI);
    expect(normalizePhase(-PI - 1e-9)).toBeCloseTo(PI - 1e-9);
  });
});
