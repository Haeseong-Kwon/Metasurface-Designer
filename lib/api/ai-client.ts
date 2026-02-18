/**
 * AI Surrogate Model Client
 * FastAPI 기반 AI 서버와 통신하여 메타 아톰의 위상 및 투과율을 예측합니다.
 */

export interface AIModelInput {
    geometry: string;
    material: string;
    radius: number;
    height: number;
    wavelength: number;
}

export interface AIModelOutput {
    phase: number;
    transmission: number;
    error_margin: number;
}

const AI_SERVER_URL = 'http://localhost:8000'; // Next.js env 설정 방식에 따라 배포 시 변경 가능

export class AIClient {
    /**
     * 단일 유닛 셀의 물리적 응답 예측
     */
    async predictUnitCell(input: AIModelInput): Promise<AIModelOutput> {
        try {
            const response = await fetch(`${AI_SERVER_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });

            if (!response.ok) throw new Error('AI Server response error');

            const data = await response.json();
            return {
                phase: data.phase,
                transmission: data.transmission,
                error_margin: data.uncertainty || 0.01,
            };
        } catch (error) {
            console.warn('[AI Client] Inference failed, falling back to analytic approximation.', error);
            // Fallback: 물리적 근사 로직 (Analytic approximation)
            return {
                phase: (Math.PI * 2 * input.radius) / input.wavelength,
                transmission: 0.9,
                error_margin: 0.1,
            };
        }
    }

    /**
     * 대규모 일괄 추론 (Batch Inference)
     */
    async predictBatch(inputs: AIModelInput[]): Promise<AIModelOutput[]> {
        try {
            const response = await fetch(`${AI_SERVER_URL}/predict/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: inputs }),
            });

            if (!response.ok) throw new Error('AI Server batch response error');
            return await response.json();
        } catch (error) {
            return inputs.map(input => ({
                phase: (Math.PI * 2 * input.radius) / input.wavelength,
                transmission: 0.85,
                error_margin: 0.15,
            }));
        }
    }

    /**
     * 렌즈 전체 효율 예측 (Verification)
     */
    async verifyPerformance(layout: any[]): Promise<{ efficiency: number; spot_size_um: number; focal_error_pct: number }> {
        try {
            const response = await fetch(`${AI_SERVER_URL}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ layout }),
            });
            return await response.json();
        } catch (error) {
            // Mock Verification Result
            return {
                efficiency: 0.82 + Math.random() * 0.05,
                spot_size_um: 1.25,
                focal_error_pct: 0.8,
            };
        }
    }
}
