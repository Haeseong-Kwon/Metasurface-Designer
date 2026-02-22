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
            <aside className="w-80 border-r border-white/5 p-6 flex flex-col gap-6 glass-panel z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-indigo-500 p-[1px] shadow-lg shadow-blue-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-lg font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter uppercase">
                            MetaDesigner
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Research Alpha</p>
                    </div>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <section className="space-y-6">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">
                            Optical Parameters
                        </label>

                        <div className="space-y-4">
                            {[
                                { label: 'Focal Length', value: params.focalLength, unit: 'μm', min: 10, max: 1000, step: 10, color: 'blue', key: 'focalLength' },
                                { label: 'Wavelength', value: params.wavelength, unit: 'μm', min: 0.3, max: 1.6, step: 0.01, color: 'cyan', key: 'wavelength' },
                                { label: 'Aperture (NA)', value: params.numericalAperture, unit: '', min: 0.1, max: 0.9, step: 0.05, color: 'indigo', key: 'numericalAperture' }
                            ].map((item) => (
                                <div key={item.key} className="group premium-card p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider">{item.label}</span>
                                        <span className="text-xs font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/10">{item.value}{item.unit}</span>
                                    </div>
                                    <input
                                        type="range" min={item.min} max={item.max} step={item.step}
                                        value={item.value}
                                        onChange={(e) => updateParams({ [item.key]: Number(e.target.value) })}
                                        className="w-full transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 block">
                            System Config
                        </label>
                        <div className="premium-card p-4">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grid Resolution</span>
                                <span className="text-xs font-mono text-white bg-white/5 px-2 py-1 rounded border border-white/10">{gridConfig.resolution}μm</span>
                            </div>
                            <input
                                type="range" min="0.5" max="5.0" step="0.1"
                                value={gridConfig.resolution}
                                onChange={(e) => updateGrid({ resolution: Number(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    </section>

                    <RecentProjects
                        projects={[
                            { id: '1', name: 'Visible Metalens A', params: { f: 100, wavelength: 0.532, na: 0.5 }, date: '2026.02.13' },
                            { id: '2', name: 'Near-IR Concentrator', params: { f: 500, wavelength: 1.55, na: 0.3 }, date: '2026.02.12' }
                        ]}
                        onLoad={() => { }}
                    />
                </div>

                <div className="mt-auto premium-card p-5 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10">
                    <h4 className="text-[10px] font-black text-blue-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></div>
                        Live Analysis
                    </h4>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">calculated Radius</span>
                        <span className="font-mono text-lg text-white font-light">{lensRadius.toFixed(2)}<span className="text-[10px] ml-1 text-slate-500">μm</span></span>
                    </div>
                </div>
            </aside>

            {/* Main Content: 시각화 패널 */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 relative bg-[#020617]">
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -ml-48 -mb-48"></div>

                <header className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">Inverse Design Engine</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">v2.4.0</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Core Simulation</h2>
                        <p className="text-slate-500 text-sm font-medium">Real-time meta-atom placement & phase profiling via Neural Surrogate Model</p>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] flex items-center gap-2">
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
                                <p className="text-xs text-slate-500 italic">
                                    Our PyTorch surrogate model simultaneously queries the database to match the optimal cylindrical nanopillars to this phase map perfectly.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Phase Match', value: '99.8', unit: '%' },
                                { label: 'Inference', value: '12', unit: 'ms' }
                            ].map((stat) => (
                                <div key={stat.label} className="premium-card p-6 flex flex-col items-center justify-center text-center gap-2 group hover:bg-white/5 transition-colors">
                                    <div className="text-3xl font-black text-white">{stat.value}<span className="text-sm text-slate-500 ml-1 font-bold">{stat.unit}</span></div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{stat.label}</div>
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


