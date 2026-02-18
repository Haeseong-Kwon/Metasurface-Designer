import { OpticalParameters, GridConfig, SimulationResult } from '@/types/physics';

/**
 * PhaseCalculator
 * 하이퍼볼릭 위상 프로파일을 계산하고 메타렌즈의 위상 맵을 생성합니다.
 */
export class PhaseCalculator {
    private params: OpticalParameters;

    constructor(params: OpticalParameters) {
        this.validateParameters(params);
        this.params = params;
    }

    /**
     * 입력 파라미터 유효성 검사
     */
    private validateParameters(params: OpticalParameters): void {
        if (params.focalLength <= 0) throw new Error('Focal length must be positive.');
        if (params.wavelength <= 0) throw new Error('Wavelength must be positive.');
        if (params.numericalAperture <= 0 || params.numericalAperture >= 1) {
            throw new Error('Numerical Aperture (NA) must be between 0 and 1.');
        }
    }

    /**
     * 하이퍼볼릭 위상 수식 적용
     * phi(r) = -(2pi/lambda) * (sqrt(r^2 + f^2) - f)
     * @param r 중심으로부터의 거리 (um)
     */
    public calculatePhaseAt(r: number): number {
        const { wavelength, focalLength } = this.params;
        const phase = -(2 * Math.PI / wavelength) * (Math.sqrt(Math.pow(r, 2) + Math.pow(focalLength, 2)) - focalLength);

        // Wrap phase into [0, 2pi] range for meta-atom mapping
        return ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    }

    /**
     * 그리드 기반 위상 맵 생성
     */
    public generatePhaseMap(config: GridConfig): SimulationResult {
        const { size, resolution } = config;
        const steps = Math.floor(size / resolution);
        const start = -size / 2;

        const gridX: number[] = [];
        const gridY: number[] = [];
        const phaseMap: number[][] = [];

        for (let i = 0; i <= steps; i++) {
            const x = start + i * resolution;
            gridX.push(x);

            const row: number[] = [];
            for (let j = 0; j <= steps; j++) {
                const y = start + j * resolution;
                if (i === 0) gridY.push(y);

                const r = Math.sqrt(x * x + y * y);
                // 렌즈 반경(NA 기반)을 벗어나는 영역 처리
                const lensRadius = this.params.focalLength * Math.tan(Math.asin(this.params.numericalAperture));

                if (r <= lensRadius) {
                    row.push(this.calculatePhaseAt(r));
                } else {
                    row.push(0); // Out of aperture
                }
            }
            phaseMap.push(row);
        }

        return { phaseMap, gridX, gridY };
    }
}

/**
 * UnitCellMapper
 * 계산된 위상 값을 Meta-Atom Library와 매핑하여 최적의 구조를 선택합니다.
 */
export class UnitCellMapper {
    // TODO: Supabase 연동 로직 및 최적화 검색 알고리즘 구현
}
