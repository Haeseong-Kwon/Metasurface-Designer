/**
 * @file physics.ts
 * @description 메타렌즈 물리 엔진에서 사용되는 도메인 타입 정의
 */

export type Unit = 'um' | 'nm' | 'mm';

export interface OpticalParameters {
    focalLength: number; // Unit: um
    wavelength: number;  // Unit: um
    numericalAperture: number; // NA
}

export interface GridConfig {
    size: number;        // Total lens diameter (um)
    resolution: number;  // Grid spacing (um)
    padding: number;     // Simulation padding (um)
}

export interface MetaAtom {
    id: string;
    geometry: 'cylinder' | 'rectangular' | 'cross' | 'hole';
    material: string;
    dimensions: {
        [key: string]: number;
    };
    phase: number;        // Phase shift (rad)
    transmission: number; // Transmission efficiency (0-1)
}

export interface SimulationResult {
    phaseMap: number[][];
    gridX: number[];
    gridY: number[];
}
