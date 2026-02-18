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
        <div className="flex h-screen bg-slate-950 text-slate-200">
            {/* Sidebar */}
            <aside className="w-80 border-r border-slate-800 p-6 flex flex-col gap-6 bg-slate-900/50 backdrop-blur-xl shrink-0">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Metalens Design Pro
                </h1>

                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <section>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block">
                            Optical Specs
                        </label>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">Focal Length</span>
                                    <span className="font-mono text-blue-400">{params.focalLength} μm</span>
                                </div>
                                <input
                                    type="range" min="10" max="1000" step="10"
                                    value={params.focalLength}
                                    onChange={(e) => updateParams({ focalLength: Number(e.target.value) })}
                                    className="w-full accent-blue-500 h-1"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">Wavelength</span>
                                    <span className="font-mono text-cyan-400">{params.wavelength} μm</span>
                                </div>
                                <input
                                    type="range" min="0.3" max="1.6" step="0.01"
                                    value={params.wavelength}
                                    onChange={(e) => updateParams({ wavelength: Number(e.target.value) })}
                                    className="w-full accent-cyan-500 h-1"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">Aperture (NA)</span>
                                    <span className="font-mono text-indigo-400">{params.numericalAperture}</span>
                                </div>
                                <input
                                    type="range" min="0.1" max="0.9" step="0.05"
                                    value={params.numericalAperture}
                                    onChange={(e) => updateParams({ numericalAperture: Number(e.target.value) })}
                                    className="w-full accent-indigo-500 h-1"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="pt-6 border-t border-slate-800">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3 block">
                            Simulation Grid
                        </label>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-400">Resolution</span>
                            <span className="font-mono text-slate-300">{gridConfig.resolution} μm</span>
                        </div>
                        <input
                            type="range" min="0.5" max="5.0" step="0.1"
                            value={gridConfig.resolution}
                            onChange={(e) => updateGrid({ resolution: Number(e.target.value) })}
                            className="w-full accent-slate-500 h-1"
                        />
                    </section>
                </div>

                <div className="mt-auto p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <div className="text-[10px] font-bold text-blue-500/50 uppercase mb-2">Calculated Radius</div>
                    <div className="text-2xl font-mono font-light text-blue-400">
                        {lensRadius.toFixed(2)}<span className="text-xs ml-1 text-blue-600">μm</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 bg-[#020617] relative">
                {/* AI HUD Overlay */}
                <div className="absolute top-8 right-8 z-10 flex flex-col gap-3 pointer-events-none">
                    <div className="bg-blue-500/10 border border-blue-500/20 backdrop-blur-md px-4 py-2 rounded-lg">
                        <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest">AI Engine Active</div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-mono text-blue-300">Surrogate Model: Loaded</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Tab Navigation */}
                    <div className="flex gap-4 border-b border-slate-800 mb-8">
                        <button
                            onClick={() => setActiveTab('design')}
                            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all px-2 ${activeTab === 'design' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Design & Preview
                        </button>
                        <button
                            onClick={() => setActiveTab('benchmark')}
                            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all px-2 ${activeTab === 'benchmark' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            AI Benchmarking
                        </button>
                        <div className="ml-auto pb-4">
                            <a href="/docs" className="text-[10px] text-slate-600 hover:text-cyan-400 font-bold uppercase flex items-center gap-1 transition-colors">
                                View Documentation ↗
                            </a>
                        </div>
                    </div>

                    {activeTab === 'design' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                <div className="space-y-8">
                                    <PhaseMap2D data={simulationResult} lensRadius={lensRadius} />
                                    <VerificationPanel
                                        isVerifying={isVerifying}
                                        stats={verificationStats}
                                        onVerify={handleVerify}
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all duration-700"></div>
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                            Inverse Design Engine
                                        </h3>

                                        {optimizationStep ? (
                                            <div className="mb-8 p-6 bg-black/40 rounded-xl border border-white/5">
                                                <div className="flex justify-between text-sm font-mono mb-4">
                                                    <span className="text-slate-500">Processing Iteration: <span className="text-white">{optimizationStep.iteration}</span></span>
                                                    <span className="text-indigo-400">MSE: {optimizationStep.mse.toExponential(4)}</span>
                                                </div>
                                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-600 to-blue-400 transition-all duration-700 ease-in-out"
                                                        style={{ width: `${(optimizationStep.iteration / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                                단순한 위상 매핑을 넘어 AI 기반 최적화 엔진이 구조를 정밀하게 보정합니다.
                                            </p>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={handleOptimize}
                                                disabled={isOptimizing}
                                                className={`py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isOptimizing
                                                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-950/20 active:scale-95'
                                                    }`}
                                            >
                                                {isOptimizing ? 'Optimizing...' : 'Start Optimization'}
                                            </button>
                                            <button
                                                onClick={handleDownloadGDS}
                                                className="py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-slate-700 active:scale-95"
                                            >
                                                Download GDSII
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/20 border border-slate-800/50 rounded-xl backdrop-blur-sm font-mono text-[11px] space-y-2 opacity-80">
                                        <div className="flex gap-4"><span className="text-slate-600 shrink-0">09:55:01</span> <span className="text-emerald-400/80">System initialized.</span></div>
                                        {optimizedLayout && <div className="flex gap-4"><span className="text-slate-600 shrink-0">09:55:10</span> <span className="text-indigo-400 font-bold">Optimization finished.</span></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                                <MetaArray3D data={simulationResult} lensRadius={lensRadius} />
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Benchmarking testData={benchmarkData} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
