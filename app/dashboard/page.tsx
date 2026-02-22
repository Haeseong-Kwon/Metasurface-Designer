'use client';

import React from 'react';
import { usePhysicsEngine } from '@/hooks/usePhysicsEngine';
import { PhaseMap2D } from '@/components/visualizer/PhaseMap2D';
import { MetaArray3D } from '@/components/visualizer/MetaArray3D';
import { RecentProjects } from '@/components/dashboard/RecentProjects';

export default function DashboardPage() {
    const { params, updateParams, simulationResult, lensRadius, gridConfig, updateGrid } = usePhysicsEngine(
        { focalLength: 100, wavelength: 0.532, numericalAperture: 0.5 },
        { size: 100, resolution: 0.5, padding: 0 }
    );

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
            {/* Sidebar: 광학 파라미터 입력 */}
            <aside className="w-85 border-r border-white/5 p-8 flex flex-col gap-8 glass-panel z-10 shrink-0">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-600 p-[1.5px] shadow-2xl shadow-blue-500/30">
                        <div className="w-full h-full bg-slate-950 rounded-[14.5px] flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-300 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight uppercase">
                            MetaDesigner
                        </h1>
                        <p className="text-[10px] text-blue-500/80 font-black tracking-[0.3em] uppercase">Enterprise Research v2</p>
                    </div>
                </div>

                <div className="space-y-10 flex-1 overflow-y-auto custom-scrollbar pr-3">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                Design Parameters
                            </label>
                        </div>

                        <div className="space-y-5">
                            {[
                                { label: 'Focal Length', value: params.focalLength, unit: 'μm', min: 10, max: 1000, step: 10, key: 'focalLength', description: 'Distance to focal point' },
                                { label: 'Wavelength', value: params.wavelength, unit: 'μm', min: 0.3, max: 1.6, step: 0.01, key: 'wavelength', description: 'Target illumination wavelength' },
                                { label: 'Aperture (NA)', value: params.numericalAperture, unit: '', min: 0.1, max: 0.9, step: 0.05, key: 'numericalAperture', description: 'Light-gathering ability' }
                            ].map((item) => (
                                <div key={item.key} className="premium-card p-5 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[11px] font-bold text-slate-300 group-hover:text-blue-400 transition-colors uppercase tracking-wider">{item.label}</span>
                                            <p className="text-[9px] text-slate-500 font-medium mt-0.5">{item.description}</p>
                                        </div>
                                        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">{item.value}{item.unit}</span>
                                    </div>
                                    <div className="mt-4">
                                        <input
                                            type="range" min={item.min} max={item.max} step={item.step}
                                            value={item.value}
                                            onChange={(e) => updateParams({ [item.key]: Number(e.target.value) })}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                Solver Settings
                            </label>
                        </div>
                        <div className="premium-card p-5 group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">Grid Resolution</span>
                                    <p className="text-[9px] text-slate-500 font-medium mt-0.5">Computational step size</p>
                                </div>
                                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">{gridConfig.resolution}μm</span>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="range" min="0.5" max="5.0" step="0.1"
                                    value={gridConfig.resolution}
                                    onChange={(e) => updateGrid({ resolution: Number(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                    <div className="premium-card p-6 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 border-blue-500/20 shadow-blue-900/10">
                        <h4 className="text-[10px] font-black text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-[0.3em]">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse"></div>
                            Calculated Radius
                        </h4>
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Effective</span>
                            <span className="font-mono text-3xl text-white font-light tracking-tighter tabular-nums">
                                {lensRadius.toFixed(2)}
                                <span className="text-sm ml-1 text-slate-500 font-bold uppercase">μm</span>
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content: 시각화 패널 */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 relative bg-[#020617]">
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -ml-48 -mb-48"></div>

                <header className="flex justify-between items-end relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">
                                Inverse Design Core
                            </div>
                            <div className="px-3 py-1 rounded-full bg-slate-900 border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                HPC Instance: AWS-P4D.24XL
                            </div>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter text-white mb-4 uppercase">
                            Simulation <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Dashboard</span>
                        </h2>
                        <p className="text-slate-400 text-base font-medium max-w-2xl leading-relaxed">
                            Generating optimal meta-atom layouts through neural surrogate inference.
                            Real-time phase matching and geometric parameter synthesis active.
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export GDSII
                    </button>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 items-start relative z-10">
                    <div className="xl:col-span-3 premium-card p-2">
                        <PhaseMap2D data={simulationResult} lensRadius={lensRadius} />
                    </div>

                    <div className="xl:col-span-2 space-y-8">
                        <div className="premium-card p-8 relative group">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"></div>
                            <h3 className="text-white text-sm font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-2 h-2 rounded bg-blue-500"></div>
                                Physical Theory
                            </h3>
                            <div className="text-slate-400 text-sm leading-relaxed space-y-6 font-medium">
                                <p>
                                    The target phase profile is continuously recalculated based on your current inputs using the hyperbolic phase equation:
                                </p>
                                <div className="bg-black/80 p-6 rounded-2xl border border-white/10 font-mono text-sm text-center text-blue-300 shadow-inner">
                                    Φ(x,y) = -(2π/λ) * [√(x² + y² + f²) - f]
                                </div>
                                <p className="text-xs text-slate-500 italic leading-loose">
                                    Our PyTorch surrogate model (ResNet-18 modified) queries the meta-atom library to match the optimal cylindrical nanopillars to this phase map with minimal quantization error.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Phase Correlation', value: '99.82', unit: '%', color: 'blue' },
                                { label: 'Inference Latency', value: '12.4', unit: 'ms', color: 'indigo' }
                            ].map((stat) => (
                                <div key={stat.label} className="premium-card p-6 flex flex-col items-center justify-center text-center gap-3 group">
                                    <div className="text-3xl font-black text-white tracking-tighter tabular-nums">
                                        {stat.value}
                                        <span className="text-xs text-slate-500 ml-1 font-black uppercase">{stat.unit}</span>
                                    </div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative pt-8 z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-white uppercase tracking-widest">3D Atomic Structure Preview</h3>
                        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                            Simulation Engine Active
                        </div>
                    </div>
                    <div className="premium-card p-2">
                        <MetaArray3D data={simulationResult} lensRadius={lensRadius} />
                    </div>
                </div>
            </main>
        </div>
    );
}


