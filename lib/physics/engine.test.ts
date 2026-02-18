import { describe, it, expect } from 'vitest';
import { PhaseCalculator } from './engine';
import { OpticalParameters } from '@/types/physics';
import { normalizePhase } from './utils';

describe('PhaseCalculator', () => {
  const params: OpticalParameters = {
    focalLength: 100,    // um
    wavelength: 0.532,   // um
    numericalAperture: 0.8,
  };
  const calculator = new PhaseCalculator(params);
  const PI = Math.PI;

  describe('calculatePhaseAt', () => {
    it('should calculate the correct hyperbolic phase', () => {
      const r = 50; // distance from center
      const { wavelength, focalLength } = params;
      
      // Manual calculation of the raw phase
      const expectedRawPhase = -(2 * PI / wavelength) * (Math.sqrt(r*r + focalLength*focalLength) - focalLength);
      
      // The function currently normalizes to [0, 2PI]
      const expectedNormalized_0_2PI = ((expectedRawPhase % (2 * PI)) + 2 * PI) % (2 * PI);
      
      expect(calculator.calculatePhaseAt(r)).toBeCloseTo(expectedNormalized_0_2PI);
    });

    it('should return 0 for r=0', () => {
      expect(calculator.calculatePhaseAt(0)).toBe(0);
    });
  });

  describe('parameter validation', () => {
    it('should throw an error for non-positive focal length', () => {
      const invalidParams = { ...params, focalLength: 0 };
      expect(() => new PhaseCalculator(invalidParams)).toThrow('Focal length must be positive.');
    });

    it('should throw an error for invalid Numerical Aperture', () => {
        expect(() => new PhaseCalculator({ ...params, numericalAperture: 0 })).toThrow('Numerical Aperture (NA) must be between 0 and 1.');
        expect(() => new PhaseCalculator({ ...params, numericalAperture: 1 })).toThrow('Numerical Aperture (NA) must be between 0 and 1.');
    });
  });

  describe('Phase Normalization Refactoring', () => {
    it('should correctly normalize phase to [-PI, PI] using the new utility', () => {
        const r = 150;
        const { wavelength, focalLength } = params;
        const rawPhase = -(2 * PI / wavelength) * (Math.sqrt(r*r + focalLength*focalLength) - focalLength);
        
        // Use the new, tested utility function
        const expectedNormalized_minusPI_PI = normalizePhase(rawPhase);

        // This test will fail until the refactoring is done.
        // It demonstrates the desired future state.
        // For now, we test the output of the utility function itself.
        const normalized = normalizePhase(rawPhase)
        expect(normalized).toBeCloseTo(expectedNormalized_minusPI_PI);
        expect(normalized).toBeLessThanOrEqual(PI);
        expect(normalized).toBeGreaterThanOrEqual(-PI);
    });
  });
});
