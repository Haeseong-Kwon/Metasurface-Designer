import { useState, useCallback, useMemo, useEffect } from 'react';
import { OpticalParameters, GridConfig, SimulationResult } from '@/types/physics';
import { PhaseCalculator } from '@/lib/physics/engine';

/**
 * usePhysicsEngine
 * 클라이언트 사이드에서 광학 파라미터를 관리하고 
 * 즉각적인 위상 재계산을 수행하는 커스텀 훅
 */
export function usePhysicsEngine(initialParams: OpticalParameters, initialGrid: GridConfig) {
    const [params, setParams] = useState<OpticalParameters>(initialParams);
    const [gridConfig, setGridConfig] = useState<GridConfig>(initialGrid);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // 파라미터 업데이트 함수
    const updateParams = useCallback((newParams: Partial<OpticalParameters>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    }, []);

    const updateGrid = useCallback((newConfig: Partial<GridConfig>) => {
        setGridConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    // Web Worker를 통한 비동기 계산
    useEffect(() => {
        const worker = new Worker(new URL('../workers/physics.worker.ts', import.meta.url));

        setIsCalculating(true);
        worker.postMessage({ params, gridConfig });

        worker.onmessage = (e) => {
            if (e.data.type === 'DONE') {
                setSimulationResult(e.data.result);
            } else if (e.data.type === 'ERROR') {
                console.error('Worker error:', e.data.message);
            }
            setIsCalculating(false);
            worker.terminate();
        };

        return () => worker.terminate();
    }, [params, gridConfig]);

    return {
        params,
        gridConfig,
        updateParams,
        updateGrid,
        simulationResult,
        isCalculating,
        lensRadius: params.focalLength * Math.tan(Math.asin(params.numericalAperture))
    };
}
