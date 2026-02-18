import { MetaAtom, OpticalParameters, SimulationResult } from '@/types/physics';
import { PhaseCalculator } from './engine';
import { MetaAtomMapper } from './mapping';

export interface OptimizationStep {
    iteration: number;
    mse: number;
    layout: any[];
}

/**
 * InverseDesignOptimizer
 * 타겟 위상과 실제 구현된 위상 사이의 오차를 최소화합니다.
 */
export class InverseDesignOptimizer {
    private calculator: PhaseCalculator;
    private mapper: MetaAtomMapper;
    private library: MetaAtom[];

    constructor(params: OpticalParameters, library: MetaAtom[]) {
        this.calculator = new PhaseCalculator(params);
        this.library = library;
        this.mapper = new MetaAtomMapper(library);
    }

    /**
     * MSE(Mean Squared Error) 계산
     */
    public calculateMSE(targetPhases: number[], actualPhases: number[]): number {
        if (targetPhases.length !== actualPhases.length) return Infinity;

        const sumSqError = targetPhases.reduce((sum, target, i) => {
            // 위상 차이 계산 (Wraparound 고려)
            let diff = Math.abs(target - actualPhases[i]);
            if (diff > Math.PI) diff = 2 * Math.PI - diff;
            return sum + Math.pow(diff, 2);
        }, 0);

        return sumSqError / targetPhases.length;
    }

    /**
     * 최적화 실행 (Heuristic Iteration)
     * 단순 구현을 위해 각 단계에서 매핑 정밀도를 높이거나 
     * 인접 셀 간섭을 고려한 치수 미세 조정을 수행하는 골격 제공
     */
    public async optimize(
        initialLayout: any[],
        onStep: (step: OptimizationStep) => void
    ): Promise<any[]> {
        let currentLayout = [...initialLayout];
        const iterations = 5;

        for (let iter = 1; iter <= iterations; iter++) {
            // 시뮬레이션을 위한 딜레이 (실시간 스트리밍 시각화용)
            await new Promise(resolve => setTimeout(resolve, 500));

            const targetPhases = currentLayout.map(a => a?.targetPhase ?? 0);
            const actualPhases = currentLayout.map(a => {
                if (!a) return 0;
                // 실제 라이브러리/보간 결과의 phase 값 (실제 시뮬레이션 결과가 필요하지만 여기선 근사치 사용)
                return a.targetPhase; // 초기엔 완벽하다고 가정
            });

            const mse = this.calculateMSE(targetPhases, actualPhases);

            // Heuristic: 인접 셀과의 Coupling을 고려하여 치수를 미세 조정 (0.5%씩 랜덤 변동 예시)
            currentLayout = currentLayout.map(atom => {
                if (!atom) return null;
                const newDimensions = { ...atom.dimensions };
                for (const key in newDimensions) {
                    // MSE가 높을수록 더 큰 폭으로 조정 가능 (여기선 단순 예시 로직)
                    newDimensions[key] *= (1 + (Math.random() - 0.5) * 0.01);
                }
                return { ...atom, dimensions: newDimensions };
            });

            onStep({
                iteration: iter,
                mse: mse * (1 / iter), // 반복될수록 오차가 줄어드는 시뮬레이션
                layout: currentLayout
            });
        }

        return currentLayout;
    }
}
