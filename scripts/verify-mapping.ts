import { PhaseCalculator } from '../lib/physics/engine';
import { MetaAtomMapper } from '../lib/physics/mapping';
import { MetaAtom, OpticalParameters } from '../types/physics';

async function verifyMapping() {
    console.log('--- Phase-to-Geometry Mapping Verification ---');

    const params: OpticalParameters = {
        focalLength: 100,      // 100 um
        wavelength: 0.532,     // 532 nm (Green)
        numericalAperture: 0.5 // NA 0.5
    };

    const mockLibrary: MetaAtom[] = [
        { id: '1', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.05 }, phase: 0.0, transmission: 0.95 },
        { id: '2', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.10 }, phase: 1.5, transmission: 0.92 },
        { id: '3', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.15 }, phase: 3.14, transmission: 0.88 },
        { id: '4', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.20 }, phase: 4.7, transmission: 0.85 },
        { id: '5', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.25 }, phase: 6.28, transmission: 0.82 },
    ];

    const calculator = new PhaseCalculator(params);
    const mapper = new MetaAtomMapper(mockLibrary);

    // 특정 반지름(r)에서의 위상 계산 및 매핑 테스트
    const testRadii = [0, 10, 25, 50];

    testRadii.forEach(r => {
        const targetPhase = calculator.calculatePhaseAt(r);
        const result = mapper.mapPhaseToGeometry(targetPhase);

        console.log(`\nRadius: ${r} um`);
        console.log(`Target Phase: ${targetPhase.toFixed(4)} rad`);
        console.log(`Matched ID: ${result.id}`);
        console.log(`Interpolated: ${result.isInterpolated}`);
        console.log(`Result Radius: ${result.dimensions.radius.toFixed(4)} um`);
        console.log(`Mapping Error: ${result.error.toFixed(6)}`);
    });
}

verifyMapping();
