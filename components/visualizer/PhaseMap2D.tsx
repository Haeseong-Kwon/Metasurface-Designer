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

        // Professional Colormap (Scientific Spectral Map)
        const getProfessionalColor = (v: number) => {
            // High-fidelity spectral mapping for phase data [0, 2pi]
            const hue = 280 - (v * 280);
            const saturation = 85 + (Math.sin(v * Math.PI) * 15);
            const lightness = 45 + (Math.cos(v * Math.PI - Math.PI) * 12);
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        };

        ctx.imageSmoothingEnabled = true;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const phase = phaseMap[i][j];
                const x = i * pixelSize;
                const y = j * pixelSize;

                const normPhase = phase / (2 * Math.PI);
                ctx.fillStyle = getProfessionalColor(normPhase);
                ctx.fillRect(x, y, pixelSize + 0.3, pixelSize + 0.3);
            }
        }

        // Professional Aperture Grid Overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, canvasSize / 2); ctx.lineTo(canvasSize, canvasSize / 2);
        ctx.moveTo(canvasSize / 2, 0); ctx.lineTo(canvasSize / 2, canvasSize);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
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
        <div className="relative rounded-2xl overflow-hidden bg-slate-950/40 p-6 border border-white/5 backdrop-blur-2xl group transition-all duration-500 hover:border-blue-500/20">
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    </div>
                    <h3 className="text-white text-sm font-black uppercase tracking-widest">
                        Wavefront Distribution
                    </h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    Target Phase 2D
                </div>
            </div>

            <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden border border-white/5 shadow-2xl transition-all group-hover:border-white/10">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoverInfo(null)}
                    className="w-full h-full cursor-crosshair active:scale-[0.99] transition-transform"
                />

                {hoverInfo && (
                    <div className="absolute top-4 right-4 bg-slate-900/80 text-white p-4 rounded-xl text-[10px] border border-white/10 shadow-2xl backdrop-blur-md pointer-events-none transform animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col gap-2 font-mono">
                            <div className="flex justify-between gap-4 border-b border-white/5 pb-2 mb-1">
                                <span className="text-slate-500 font-bold">COORDINATES</span>
                                <span className="text-blue-400 font-black">{hoverInfo.x.toFixed(2)}, {hoverInfo.y.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500 font-bold">PHASE VALUE</span>
                                <span className="text-cyan-400 font-black">{hoverInfo.phase.toFixed(4)} rad</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
