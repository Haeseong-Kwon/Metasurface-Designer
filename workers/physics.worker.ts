/* eslint-disable no-restricted-globals */
import { PhaseCalculator } from '../lib/physics/engine';
import { OpticalParameters, GridConfig } from '../types/physics';

/**
 * Physics Worker
 * 메인 스레드 차단 없이 대규모 그리드의 위상 맵을 계산합니다.
 */
self.onmessage = (e: MessageEvent) => {
    const { params, gridConfig } = e.data as { params: OpticalParameters; gridConfig: GridConfig };

    try {
        const calculator = new PhaseCalculator(params);
        const result = calculator.generatePhaseMap(gridConfig);

        // 연산 완료 메시지 전송
        self.postMessage({ type: 'DONE', result });
    } catch (error: any) {
        self.postMessage({ type: 'ERROR', message: error.message });
    }
};
