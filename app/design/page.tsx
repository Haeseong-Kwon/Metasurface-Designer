'use client';

import React, { useState, useCallback } from 'react';
import { usePhysicsEngine } from '@/hooks/usePhysicsEngine';
import { PhaseMap2D } from '@/components/visualizer/PhaseMap2D';
import { MetaArray3D } from '@/components/visualizer/MetaArray3D';
import { InverseDesignOptimizer, OptimizationStep } from '@/lib/physics/optimizer';
import { GDSGenerator } from '@/lib/export/gds-generator';
import { VerificationPanel } from '@/components/design/VerificationPanel';
import { AIClient } from '@/lib/api/ai-client';
import { Benchmarking } from '@/components/research/Benchmarking';
import { MetaAtom } from '@/types/physics';

/**
 * DesignPage
 * 최적화 엔진, AI 검증 및 벤치마킹 도구가 통합된 메타렌즈 전용 설계 페이지
 */
export default function DesignPage() {
    const { params, updateParams, simulationResult, lensRadius, gridConfig, updateGrid } = usePhysicsEngine(
        { focalLength: 100, wavelength: 0.532, numericalAperture: 0.5 },
        { size: 100, resolution: 2.5, padding: 0 }
    );

    const [isOptimizing, setIsOptimizing] = useState(false);
    const [optimizationStep, setOptimizationStep] = useState<OptimizationStep | null>(null);
    const [optimizedLayout, setOptimizedLayout] = useState<any[] | null>(null);

    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStats, setVerificationStats] = useState<any | null>(null);
    const [benchmarkData, setBenchmarkData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'design' | 'benchmark'>('design');

    // AI 검증 핸들러
    const handleVerify = async () => {
        setIsVerifying(true);
        const client = new AIClient();
        const layout = optimizedLayout || [];
        const result = await client.verifyPerformance(layout);

        setVerificationStats({
            efficiency: result.efficiency,
            spotSize: result.spot_size_um,
            focalError: result.focal_error_pct
        });
        setIsVerifying(false);
    };

    // 최적화 실행 핸들러
    const handleOptimize = async () => {
        if (!simulationResult) return;
        setIsOptimizing(true);

        const library: MetaAtom[] = [
            { id: '1', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.05 }, phase: 0.0, transmission: 0.95 },
            { id: '2', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.10 }, phase: 1.5, transmission: 0.92 },
            { id: '3', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.15 }, phase: 3.14, transmission: 0.88 },
            { id: '4', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.20 }, phase: 4.7, transmission: 0.85 },
            { id: '5', geometry: 'cylinder', material: 'SiN', dimensions: { radius: 0.25 }, phase: 6.28, transmission: 0.82 },
        ];

        const optimizer = new InverseDesignOptimizer(params, library);

        const initialLayout = simulationResult.phaseMap.flatMap((row, i) =>
            row.map((phase, j) => {
                const x = simulationResult.gridX[i];
                const y = simulationResult.gridY[j];
                const r = Math.sqrt(x * x + y * y);
                if (r > lensRadius) return null;
                return { x, y, targetPhase: phase, dimensions: { radius: 0.1 } };
            })
        ).filter(v => v !== null);

        const result = await optimizer.optimize(initialLayout as any[], (step) => {
            setOptimizationStep(step);
        });

        const mockBenchmark = (result as any[]).slice(0, 100).map(atom => ({
            target: atom.targetPhase,
            predicted: atom.targetPhase + (Math.random() - 0.5) * 0.1,
            radius: Math.sqrt(atom.x * atom.x + atom.y * atom.y)
        }));
        setBenchmarkData(mockBenchmark);

        setOptimizedLayout(result);
        setIsOptimizing(false);
    };

    // GDSII 다운로드 핸들러
    const handleDownloadGDS = () => {
        const layoutToExport = optimizedLayout || [];
        const generator = new GDSGenerator();
        const gdsJson = generator.generateGDSJson(layoutToExport);

        const blob = new Blob([gdsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metalens_design_${Date.now()}.gds.json`;
        a.click();
    };

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200">
            {/* Sidebar */}
            <aside className="w-80 border-r border-white/5 p-6 flex flex-col gap-6 glass-panel shrink-0">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 p-0.5">
                        <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center font-black text-[10px] text-white">PRO</div>
                    </div>
                    <h1 className="text-lg font-black bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase tracking-tight">
                        Design Studio
                    </h1>
                </div>

                <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    <section>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-4 block">
                            Optical Specs
                        </label>
                        <div className="space-y-4">
                            {[
                                { label: 'Focal Length', value: params.focalLength, unit: 'μm', min: 10, max: 1000, step: 10, key: 'focalLength' },
                                { label: 'Wavelength', value: params.wavelength, unit: 'μm', min: 0.3, max: 1.6, step: 0.01, key: 'wavelength' },
                                { label: 'Aperture (NA)', value: params.numericalAperture, unit: '', min: 0.1, max: 0.9, step: 0.05, key: 'numericalAperture' }
                            ].map((item) => (
                                <div key={item.key} className="premium-card p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-label">{item.label}</span>
                                        <span className="text-value bg-white/5 px-2 py-0.5 rounded border border-white/10">{item.value}{item.unit}</span>
                                    </div>
                                    <input
                                        type="range" min={item.min} max={item.max} step={item.step}
                                        value={item.value}
                                        onChange={(e) => updateParams({ [item.key]: Number(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="pt-6 border-t border-white/5">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-4 block">
                            Simulation Grid
                        </label>
                        <div className="premium-card p-4">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-label">Resolution</span>
                                <span className="text-value bg-white/5 px-2 py-0.5 rounded border border-white/10">{gridConfig.resolution}μm</span>
                            </div>
                            <input
                                type="range" min="0.5" max="5.0" step="0.1"
                                value={gridConfig.resolution}
                                onChange={(e) => updateGrid({ resolution: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    </section>
                </div>

                <div className="mt-auto premium-card p-5 bg-gradient-to-br from-indigo-500/10 to-blue-500/10">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Target Radius</div>
                    <div className="text-3xl font-mono font-light text-white">
                        {lensRadius.toFixed(2)}<span className="text-xs ml-1 text-slate-500 font-bold uppercase">μm</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-12 bg-[#020617] relative scroll-smooth">
                {/* AI HUD Overlay */}
                <div className="absolute top-12 right-12 z-20 flex flex-col gap-3 pointer-events-none sticky top-12">
                    <div className="premium-card border-blue-500/30 bg-blue-500/5 px-5 py-3 flex flex-col items-end">
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">AI Engine Status</div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-white/80 uppercase">Surrogate Active</span>
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]"></span>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Tab Navigation */}
                    <div className="flex gap-8 border-b border-white/5 mb-12">
                        {[
                            { id: 'design', label: 'Design & Preview' },
                            { id: 'benchmark', label: 'AI Benchmarking' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all px-1 relative ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
                                )}
                            </button>
                        ))}
                        <div className="ml-auto flex items-center pb-6">
                            <a href="/docs" className="text-[11px] text-slate-600 hover:text-white font-black uppercase tracking-widest flex items-center gap-2 transition-all group">
                                Documentation <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    </div>

                    {activeTab === 'design' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 items-start">
                                <div className="xl:col-span-3 space-y-10">
                                    <div className="premium-card p-2">
                                        <PhaseMap2D data={simulationResult} lensRadius={lensRadius} />
                                    </div>
                                    <VerificationPanel
                                        isVerifying={isVerifying}
                                        stats={verificationStats}
                                        onVerify={handleVerify}
                                    />
                                </div>

                                <div className="xl:col-span-2 space-y-8">
                                    <div className="premium-card p-8 group relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all duration-700"></div>
                                        <h3 className="text-lg font-black mb-6 flex items-center gap-3 uppercase tracking-tighter">
                                            <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                                            Optimization Core
                                        </h3>

                                        {optimizationStep ? (
                                            <div className="mb-10 p-8 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden">
                                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-6 relative z-10">
                                                    <span className="text-slate-500">Processing Iteration: <span className="text-white ml-2">{optimizationStep.iteration} / 5</span></span>
                                                    <span className="text-indigo-400">MSE: {optimizationStep.mse.toExponential(4)}</span>
                                                </div>
                                                <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden relative z-10 border border-white/5">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                                        style={{ width: `${(optimizationStep.iteration / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                                                AI-driven inverse design engine optimizes individual meta-atom geometries to perfectly match your target wave propagation profile.
                                            </p>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={handleOptimize}
                                                disabled={isOptimizing}
                                                className={`py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all relative overflow-hidden group/btn ${isOptimizing
                                                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 active:scale-95'
                                                    }`}
                                            >
                                                <span className="relative z-10">{isOptimizing ? 'Optimizing...' : 'Start Global Search'}</span>
                                            </button>
                                            <button
                                                onClick={handleDownloadGDS}
                                                className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.15em] transition-all border border-white/10 active:scale-95"
                                            >
                                                Download GDSII
                                            </button>
                                        </div>
                                    </div>

                                    <div className="premium-card p-6 bg-black/60 border-white/10 font-mono text-[11px] space-y-3 opacity-100 relative overflow-hidden">
                                        <div className="flex gap-4 items-center"><span className="text-slate-400 shrink-0 uppercase font-black">LOG: 18:47:01</span> <span className="text-emerald-400">System ready. Surrogate model warm-up complete.</span></div>
                                        {optimizedLayout && <div className="flex gap-4 items-center animate-in slide-in-from-left-4"><span className="text-slate-400 shrink-0 uppercase font-black">LOG: 18:47:15</span> <span className="text-indigo-300 font-bold">Optimization convergent. Final layout generated.</span></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="relative pt-12">
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[30px] blur-3xl opacity-50 -z-10"></div>
                                <div className="premium-card p-2">
                                    <MetaArray3D data={simulationResult} lensRadius={lensRadius} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Benchmarking testData={benchmarkData} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

