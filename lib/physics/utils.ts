/**
 * Normalizes a given phase angle to the range [-PI, PI].
 * This is a standard and often more useful range for phase calculations
 * than [0, 2PI].
 *
 * @param phase The input phase in radians.
 * @returns The phase normalized to the [-PI, PI] range.
 */
export const normalizePhase = (phase: number): number => {
  // A robust mathematical formula to normalize the phase angle.
  // It correctly handles positive, negative, and large angles.
  return phase - 2 * Math.PI * Math.floor((phase + Math.PI) / (2 * Math.PI));
};
