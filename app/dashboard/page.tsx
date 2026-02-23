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
        <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Sidebar: 광학 파라미터 입력 */}
            <aside className="w-85 border-r border-white/5 flex flex-col glass-panel z-20 shrink-0">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-300 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight uppercase">
                                MetaDesigner
                            </h1>
                            <p className="text-[9px] text-blue-400/80 font-black tracking-[0.3em] uppercase">Enterprise Research v2</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4 space-y-10">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Design Parameters
                            </label>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Focal Length', value: params.focalLength, unit: 'μm', min: 10, max: 1000, step: 10, key: 'focalLength', description: 'Distance to focal point' },
                                { label: 'Wavelength', value: params.wavelength, unit: 'μm', min: 0.3, max: 1.6, step: 0.01, key: 'wavelength', description: 'Target illumination wavelength' },
                                { label: 'Aperture (NA)', value: params.numericalAperture, unit: '', min: 0.1, max: 0.9, step: 0.05, key: 'numericalAperture', description: 'Light-gathering ability' }
                            ].map((item) => (
                                <div key={item.key} className="premium-card p-4 group border-white/5 bg-white/[0.015]">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-400 transition-colors uppercase tracking-wider">{item.label}</span>
                                            <p className="text-[9px] text-slate-500 font-medium mt-0.5">{item.description}</p>
                                        </div>
                                        <span className="text-[11px] font-mono text-blue-400 font-bold">{item.value}{item.unit}</span>
                                    </div>
                                    <div className="mt-4">
                                        <input
                                            type="range" min={item.min} max={item.max} step={item.step}
                                            value={item.value}
                                            onChange={(e) => updateParams({ [item.key]: Number(e.target.value) })}
                                            className="w-full accent-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Solver Settings
                            </label>
                        </div>
                        <div className="premium-card p-4 group border-white/5 bg-white/[0.015]">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">Grid Resolution</span>
                                    <p className="text-[9px] text-slate-500 font-medium mt-0.5">Computational step size</p>
                                </div>
                                <span className="text-[11px] font-mono text-emerald-400 font-bold">{gridConfig.resolution}μm</span>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="range" min="0.5" max="5.0" step="0.1"
                                    value={gridConfig.resolution}
                                    onChange={(e) => updateGrid({ resolution: Number(e.target.value) })}
                                    className="w-full accent-emerald-500"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="p-8 pt-0 border-t border-white/5">
                    <div className="mt-6 premium-card p-5 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/5 border-blue-500/20 shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-blue-500/20 transition-colors"></div>
                        <h4 className="text-[9px] font-black text-blue-400 mb-3 flex items-center gap-2 uppercase tracking-[0.2em] relative z-10">
                            Effective Aperture
                        </h4>
                        <div className="flex items-baseline justify-between relative z-10">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Radius</span>
                            <span className="font-mono text-3xl text-white font-light tracking-tighter tabular-nums">
                                {lensRadius.toFixed(2)}
                                <span className="text-xs ml-1 text-slate-500 font-bold uppercase">μm</span>
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content: 시각화 패널 */}
            <main className="flex-1 overflow-y-auto scroll-smooth relative">
                {/* Background Decor */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-[1600px] mx-auto p-10 lg:p-14 space-y-12 relative z-10">
                    <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">
                                    Inverse Design AI Core
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    HPC Cluster Connection Active
                                </span>
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.9]">
                                Simulation <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500">Dashboard</span>
                            </h2>
                            <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
                                Advanced neural surrogate inference for high-precision metalens design.
                                Instantly matching meta-atom geometries to target phase distributions.
                            </p>
                        </div>
                        <button className="lg:mb-2 group relative px-8 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_rgba(255,255,255,0.15)] flex items-center gap-3">
                            <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export GDSII File
                        </button>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        <div className="xl:col-span-12 2xl:col-span-8 space-y-10">
                            {/* 2D Phase Map */}
                            <div className="premium-card p-1.5 bg-gradient-to-b from-white/[0.08] to-transparent">
                                <PhaseMap2D data={simulationResult} lensRadius={lensRadius} />
                            </div>

                            {/* 3D Structure Preview */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Spatial Atomic Arrangement</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                            3D Renderer Live
                                        </div>
                                    </div>
                                </div>
                                <div className="premium-card p-1.5 bg-gradient-to-b from-white/[0.08] to-transparent">
                                    <MetaArray3D data={simulationResult} lensRadius={lensRadius} />
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-12 2xl:col-span-4 space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: 'Phase Error (MSE)', value: '0.012', unit: 'rad', color: 'blue' },
                                    { label: 'Device Yield', value: '98.5', unit: '%', color: 'indigo' },
                                    { label: 'Matching Rank', value: 'Top 1', unit: '', color: 'violet' },
                                    { label: 'Compute Time', value: '14.5', unit: 'ms', color: 'cyan' }
                                ].map((stat) => (
                                    <div key={stat.label} className="premium-card p-6 flex flex-col items-center justify-center text-center gap-3 group border-white/5">
                                        <div className="text-3xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl font-mono">
                                            {stat.value}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] group-hover:text-blue-400 transition-colors">
                                            {stat.label} {stat.unit && `(${stat.unit})`}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Theory Card */}
                            <div className="premium-card p-10 relative group border-white/10 bg-white/[0.01]">
                                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>
                                <h3 className="text-white text-base font-black mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                                    Interference Theory
                                </h3>
                                <div className="text-slate-400 text-sm leading-relaxed space-y-8 font-medium">
                                    <p>
                                        The meta-atom layout is synthesized to satisfy the phase-matching condition for a perfect focal spot:
                                    </p>
                                    <div className="relative p-8 rounded-2xl bg-slate-950 border border-white/5 font-mono text-base text-center text-blue-300 shadow-inner group-hover:border-blue-500/30 transition-colors">
                                        Φ(r) = -(2π/λ) * [√(r² + f²) - f]
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                                            Surrogate Engine: CNN-Transformer Hybrid <br />
                                            Library: α-Silicon Nanopillar (5:1 AR)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


