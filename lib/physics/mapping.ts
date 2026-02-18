import { MetaAtom } from '@/types/physics';

/**
 * MetaAtomMapper
 * 위상 값을 기반으로 최적의 메타 아톰 구조를 찾는 클래스
 */
export class MetaAtomMapper {
    private library: MetaAtom[];

    constructor(library: MetaAtom[]) {
        this.library = library.sort((a, b) => a.phase - b.phase);
    }

    /**
     * 타겟 위상에 가장 가까운 메타 아톰을 찾거나 보간합니다.
     * @param targetPhase 타겟 위상 (0 ~ 2pi, rad)
     */
    public mapPhaseToGeometry(targetPhase: number): {
        id: string;
        dimensions: Record<string, number>;
        error: number;
        isInterpolated: boolean;
    } {
        // 0 ~ 2pi 범위 정규화 (이미 정규화 되어 들어오겠지만 안전장치)
        const normalizedPhase = ((targetPhase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

        // 1. Exact Match 또는 Nearest 찾기
        let low = 0;
        let high = this.library.length - 1;

        if (this.library.length === 0) {
            throw new Error('Meta-atom library is empty.');
        }

        // Binary search for nearest neighbors
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (this.library[mid].phase === normalizedPhase) {
                return {
                    id: this.library[mid].id,
                    dimensions: this.library[mid].dimensions,
                    error: 0,
                    isInterpolated: false
                };
            }
            if (this.library[mid].phase < normalizedPhase) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        // 2. Linear Interpolation (Inverse Design)
        // low와 high 사이의 값을 기반으로 보간
        const i1 = Math.max(0, high);
        const i2 = Math.min(this.library.length - 1, low);

        const atom1 = this.library[i1];
        const atom2 = this.library[i2];

        if (i1 === i2) {
            return {
                id: atom1.id,
                dimensions: atom1.dimensions,
                error: Math.abs(atom1.phase - normalizedPhase),
                isInterpolated: false
            };
        }

        // 선형 보간 가중치 계산
        const t = (normalizedPhase - atom1.phase) / (atom2.phase - atom1.phase);

        const interpolatedDimensions: Record<string, number> = {};
        for (const [key, val1] of Object.entries(atom1.dimensions)) {
            const val2 = atom2.dimensions[key];
            if (typeof val2 === 'number') {
                interpolatedDimensions[key] = val1 + (val2 - val1) * t;
            } else {
                interpolatedDimensions[key] = val1; // 보간 불가능한 경우 atom1 값 유지
            }
        }

        return {
            id: `interp-${atom1.id}-${atom2.id}`,
            dimensions: interpolatedDimensions,
            error: 0, // 보간을 통해 목표 위상을 완벽히 맞췄다고 가정 (이상적)
            isInterpolated: true
        };
    }
}
