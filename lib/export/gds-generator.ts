export interface GDSIIConfig {
    unitSize: number; // um
    databaseUnit: number; // nm (보통 1nm)
    layer: number;
    criticalDimension: number; // um (최소 선폭)
}

/**
 * GDSGenerator
 * 메타렌즈 레이아웃을 제작용 도면 데이터로 변환합니다.
 */
export class GDSGenerator {
    private config: GDSIIConfig;

    constructor(config: GDSIIConfig = { unitSize: 1, databaseUnit: 1, layer: 1, criticalDimension: 0.05 }) {
        this.config = config;
    }

    /**
     * 레이아웃 데이터를 SVG path 형식으로 변환 (GDSII 구조의 시각적 대용)
     */
    public generateSVG(layout: any[]): string {
        const flatLayout = layout.flat().filter(a => a !== null);

        // SVG 헤더 생성
        let svg = `<svg viewBox="-75 -75 150 150" xmlns="http://www.w3.org/2000/svg" style="background: #000;">`;

        flatLayout.forEach(atom => {
            const { x, y, dimensions } = atom;
            const r = dimensions.radius || dimensions.r || 0.1;

            // CD(Critical Dimension) 유효성 검사
            const color = r * 2 < this.config.criticalDimension ? '#ff4444' : '#44ff44';

            svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" fill-opacity="0.8" />`;
        });

        svg += `</svg>`;
        return svg;
    }

    /**
     * GDSII 호환 JSON 구조 생성
     */
    public generateGDSJson(layout: any[]): string {
        const flatLayout = layout.flat().filter(a => a !== null);

        const gdsData = {
            header: { version: 600, unit: this.config.databaseUnit },
            elements: flatLayout.map(atom => ({
                type: 'boundary',
                layer: this.config.layer,
                xy: this.generateCirclePoints(atom.x, atom.y, atom.dimensions.radius || 0.1, 16)
            }))
        };

        return JSON.stringify(gdsData, null, 2);
    }

    /**
     * 원형 구조를 위한 폴리곤 좌표 생성
     */
    private generateCirclePoints(cx: number, cy: number, r: number, segments: number): number[][] {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push([
                cx + r * Math.cos(theta),
                cy + r * Math.sin(theta)
            ]);
        }
        return points;
    }

    /**
     * CD Check 및 리포트 생성
     */
    public checkCD(layout: any[]): { valid: boolean; violations: number } {
        const flatLayout = layout.flat().filter(a => a !== null);
        const violations = flatLayout.filter(atom => {
            const r = atom.dimensions.radius || 0.1;
            return r * 2 < this.config.criticalDimension;
        }).length;

        return {
            valid: violations === 0,
            violations
        };
    }
}
