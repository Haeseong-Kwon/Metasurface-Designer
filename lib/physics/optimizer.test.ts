import { describe, it, expect } from 'vitest';
import { InverseDesignOptimizer } from './optimizer';
import { OpticalParameters } from '@/types/physics';

describe('InverseDesignOptimizer', () => {
  // Mock parameters and library for initialization
  const mockParams: OpticalParameters = {
    focalLength: 100,
    wavelength: 0.532,
    numericalAperture: 0.5,
  };
  const mockLibrary = [];

  describe('calculateMSE', () => {
    const optimizer = new InverseDesignOptimizer(mockParams, mockLibrary);
    const PI = Math.PI;

    it('should return 0 for identical phase arrays', () => {
      const phases = [0.1, PI / 2, PI];
      expect(optimizer.calculateMSE(phases, phases)).toBe(0);
    });

    it('should calculate MSE correctly for small differences', () => {
      const target = [0.5, 1.0, 1.5];
      const actual = [0.6, 1.1, 1.4];
      const expectedMSE = ((0.1 ** 2) + (0.1 ** 2) + (0.1 ** 2)) / 3;
      expect(optimizer.calculateMSE(target, actual)).toBeCloseTo(expectedMSE);
    });

    it('should handle wraparound (circular) differences correctly', () => {
      const target = [0.1]; // close to 0
      const actual = [2 * PI - 0.2]; // close to 2*PI, which is also close to 0
      const diff = 0.1 - (-0.2); // Wraparound difference is 0.3
      const expectedMSE = (diff ** 2) / 1;
      expect(optimizer.calculateMSE(target, actual)).toBeCloseTo(expectedMSE);
    });
    
    it('should handle wraparound near PI correctly', () => {
      const target = [PI - 0.1];
      const actual = [-PI + 0.2]; // equivalent to PI + 0.2
      const diff = 0.3; // The shortest distance between the angles
      const expectedMSE = (diff ** 2) / 1;
      // Note: The implementation calculates diff slightly differently, so we test its output
      // a = PI - 0.1, b = -PI + 0.2 -> diff = abs(a-b) = 2*PI-0.3 -> wrapped_diff = 2*PI - (2*PI-0.3) = 0.3
      expect(optimizer.calculateMSE(target, actual)).toBeCloseTo(expectedMSE);
    });

    it('should return Infinity if array lengths differ', () => {
        const target = [1, 2];
        const actual = [1];
        expect(optimizer.calculateMSE(target, actual)).toBe(Infinity);
    });
  });
});
