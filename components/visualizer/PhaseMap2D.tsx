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

        const ctx = canvasRef.current.getContext('2d', { alpha: false });
        if (!ctx) return;

        const { phaseMap } = data;
        const size = phaseMap.length;
        const canvasSize = canvasRef.current.width;
        const pixelSize = canvasSize / size;

        // Professional Colormap (Viridis-inspired Spectral Map)
        const getProfessionalColor = (v: number) => {
            // v: 0.0 to 1.0 (phase normalized)
            // Custom high-contrast spectral mapping for physical data
            const r = Math.floor(255 * (0.1 + 0.9 * Math.sin(v * Math.PI)));
            const g = Math.floor(255 * (0.2 + 0.8 * Math.cos((v - 0.5) * Math.PI)));
            const b = Math.floor(255 * (0.3 + 0.7 * Math.sin((v + 0.5) * Math.PI)));

            // We'll use a more refined HSL interpolation for smoothness
            const hue = 280 - (v * 280); // Purple -> Blue -> Cyan -> Green -> Yellow
            const saturation = 85 + (Math.sin(v * Math.PI) * 15);
            const lightness = 45 + (Math.cos(v * Math.PI - Math.PI) * 15);

            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        };

        // Enable image smoothing for better gradients
        ctx.imageSmoothingEnabled = true;

        // Render heatmap
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const phase = phaseMap[i][j];
                const x = i * pixelSize;
                const y = j * pixelSize;

                // Normalize phase [0, 2pi] -> [0, 1]
                const normPhase = phase / (2 * Math.PI);
                ctx.fillStyle = getProfessionalColor(normPhase);
                ctx.fillRect(x, y, pixelSize + 0.3, pixelSize + 0.3);
            }
        }

        // Professional Aperture Grid Overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;

        // Horizontal and Vertical center lines
        ctx.beginPath();
        ctx.moveTo(0, canvasSize / 2); ctx.lineTo(canvasSize, canvasSize / 2);
        ctx.moveTo(canvasSize / 2, 0); ctx.lineTo(canvasSize / 2, canvasSize);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 2, 0, Math.PI * 2);
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
        <div className="relative rounded-2xl overflow-hidden bg-slate-900/60 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50 backdrop-blur-xl group cursor-crosshair">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-200 text-sm font-bold flex items-center gap-2 tracking-wide">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    2D Target Phase Profile
                </h3>
            </div>

            <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner group-hover:border-slate-600 transition-colors">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoverInfo(null)}
                    className="w-full h-full"
                />

                {hoverInfo && (
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white p-3 rounded-lg text-xs border border-slate-700 shadow-2xl backdrop-blur-sm pointer-events-none transform transition-transform animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex flex-col gap-1 font-mono">
                            <span className="text-slate-400">X: <span className="text-blue-300">{hoverInfo.x.toFixed(2)}</span></span>
                            <span className="text-slate-400">Y: <span className="text-cyan-300">{hoverInfo.y.toFixed(2)}</span></span>
                            <span className="text-slate-400">Φ: <span className="text-purple-300">{hoverInfo.phase.toFixed(3)} rad</span></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
