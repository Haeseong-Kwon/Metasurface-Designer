'use client';

import React, { useRef, useEffect, useState } from 'react';
import { SimulationResult } from '@/types/physics';

interface PhaseMap2DProps {
    data: SimulationResult | null;
    lensRadius: number;
}

/**
 * PhaseMap2D
 * Canvas API를 사용하여 메타렌즈의 위상 분포 히트맵을 렌더링합니다.
 */
export const PhaseMap2D: React.FC<PhaseMap2DProps> = ({ data, lensRadius }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; phase: number } | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !data) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const { phaseMap, gridX, gridY } = data;
        const size = phaseMap.length;
        const canvasSize = canvasRef.current.width;
        const pixelSize = canvasSize / size;

        // Clear canvas
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Render heatmap
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const phase = phaseMap[i][j];
                const x = i * pixelSize;
                const y = j * pixelSize;

                // 위상값(0 ~ 2pi)을 HSL 색상으로 매핑 (Spectral colormap 느낌)
                const hue = (phase / (2 * Math.PI)) * 280; // 0 (Red) ~ 280 (Purple)
                ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;

                ctx.fillRect(x, y, pixelSize + 0.5, pixelSize + 0.5);
            }
        }

        // Aperture Circle Overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
        ctx.stroke();

    }, [data]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || !data) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x_pixel = e.clientX - rect.left;
        const y_pixel = e.clientY - rect.top;

        const size = data.phaseMap.length;
        const i = Math.floor((x_pixel / rect.width) * size);
        const j = Math.floor((y_pixel / rect.height) * size);

        if (i >= 0 && i < size && j >= 0 && j < size) {
            setHoverInfo({
                x: data.gridX[i],
                y: data.gridY[j],
                phase: data.phaseMap[i][j]
            });
        }
    };

    return (
        <div className="relative border rounded-lg overflow-hidden bg-slate-950 p-4 shadow-xl">
            <h3 className="text-slate-200 text-sm font-semibold mb-2">2D Phase Distribution</h3>
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverInfo(null)}
                className="cursor-crosshair w-full aspect-square"
            />

            {hoverInfo && (
                <div className="absolute bottom-6 left-6 bg-black/80 text-white p-3 rounded-md text-xs border border-white/20 backdrop-blur-md pointer-events-none">
                    <p>Coord: ({hoverInfo.x.toFixed(2)}, {hoverInfo.y.toFixed(2)}) μm</p>
                    <p>Phase: {hoverInfo.phase.toFixed(3)} rad</p>
                </div>
            )}
        </div>
    );
};
