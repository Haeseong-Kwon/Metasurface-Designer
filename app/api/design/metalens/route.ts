import { NextRequest, NextResponse } from 'next/server';
import { PhaseCalculator } from '@/lib/physics/engine';
import { MetaAtomMapper } from '@/lib/physics/mapping';
import { OpticalParameters, GridConfig, MetaAtom } from '@/types/physics';

/**
 * @api {post} /api/design/metalens Metalens Layout Design
 * 사용자의 광학 파라미터를 받아 전체 메타렌즈 레이아웃을 생성합니다.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { focalLength, wavelength, numericalAperture, size, resolution } = body;

        // 1. 파라미터 유틸리티 설정
        const opticalParams: OpticalParameters = { focalLength, wavelength, numericalAperture };
        const gridConfig: GridConfig = { size, resolution, padding: 0 };

        // 2. 위상 계산기 초기화 및 위상 맵 생성
        const calculator = new PhaseCalculator(opticalParams);
        const { phaseMap, gridX, gridY } = calculator.generatePhaseMap(gridConfig);

        // 3. 메타 아톰 라이브러리 (Mock 데이터 또는 Supabase 조회)
        // 실제 구현에서는 Supabase에서 library를 fetch 해와야 함
        const mockLibrary: MetaAtom[] = [
            { id: '1', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.05 }, phase: 0.5, transmission: 0.95 },
            { id: '2', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.10 }, phase: 2.1, transmission: 0.92 },
            { id: '3', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.15 }, phase: 4.2, transmission: 0.88 },
            { id: '4', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.20 }, phase: 5.8, transmission: 0.85 },
        ];

        const mapper = new MetaAtomMapper(mockLibrary);

        // 4. 레이아웃 매핑
        const layout = phaseMap.map((row, i) =>
            row.map((phase, j) => {
                const x = gridX[i];
                const y = gridY[j];
                const r = Math.sqrt(x * x + y * y);
                const lensRadius = focalLength * Math.tan(Math.asin(numericalAperture));

                if (r > lensRadius) return null; // Aperture 밖은 배치하지 않음

                const mappingResult = mapper.mapPhaseToGeometry(phase);

                // 검증을 위한 로깅 (콘솔 출력 및 응답 포함)
                console.log(`[Mapping] coord: (${x.toFixed(2)}, ${y.toFixed(2)}), target: ${phase.toFixed(3)}, result_err: ${mappingResult.error.toFixed(4)}`);

                return {
                    x,
                    y,
                    targetPhase: phase,
                    ...mappingResult
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: {
                layout,
                stats: {
                    totalAtoms: layout.flat().filter(a => a !== null).length,
                    apertureSize: (focalLength * Math.tan(Math.asin(numericalAperture)) * 2).toFixed(2)
                }
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
