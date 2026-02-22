'use client';

import React from 'react';
import { usePhysicsEngine } from '@/hooks/usePhysicsEngine';
import { PhaseMap2D } from '@/components/visualizer/PhaseMap2D';
import { MetaArray3D } from '@/components/visualizer/MetaArray3D';
import { RecentProjects } from '@/components/dashboard/RecentProjects';

export default function DashboardPage() {
    const { params, updateParams, simulationResult, lensRadius, gridConfig, updateGrid } = usePhysicsEngine(
        { focalLength: 100, wavelength: 0.532, numericalAperture: 0.5 },
        { size: 120, resolution: 2.0, padding: 0 }
    );

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Sidebar: 광학 파라미터 입력 */}
            <aside className="w-80 border-r border-slate-800/60 p-6 flex flex-col gap-6 bg-slate-900/40 backdrop-blur-2xl shadow-2xl z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                        MetaDesigner
                    </h1>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="space-y-5 bg-slate-900/50 p-5 rounded-2xl border border-slate-800/60 shadow-inner">
                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-slate-400 group-hover:text-blue-400 transition-colors uppercase tracking-wider">
                                    Focal Length
                                </label>
                                <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{params.focalLength} μm</span>
                            </div>
                            <input
                                type="range" min="10" max="1000" step="10"
                                value={params.focalLength}
                                onChange={(e) => updateParams({ focalLength: Number(e.target.value) })}
                                className="w-full accent-blue-500 hover:accent-blue-400 transition-all"
                            />
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors uppercase tracking-wider">
                                    Wavelength
                                </label>
                                <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{params.wavelength} μm</span>
                            </div>
                            <input
                                type="range" min="0.3" max="1.6" step="0.01"
                                value={params.wavelength}
                                onChange={(e) => updateParams({ wavelength: Number(e.target.value) })}
                                className="w-full accent-cyan-500 hover:accent-cyan-400 transition-all"
                            />
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition-colors uppercase tracking-wider">
                                    Numerical Aperture
                                </label>
                                <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{params.numericalAperture}</span>
                            </div>
                            <input
                                type="range" min="0.1" max="0.9" step="0.05"
                                value={params.numericalAperture}
                                onChange={(e) => updateParams({ numericalAperture: Number(e.target.value) })}
                                className="w-full accent-indigo-500 hover:accent-indigo-400 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-800/60 shadow-inner">
                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors uppercase tracking-wider">
                                    Grid Resolution
                                </label>
                                <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{gridConfig.resolution} μm</span>
                            </div>
                            <input
                                type="range" min="0.5" max="5.0" step="0.1"
                                value={gridConfig.resolution}
                                onChange={(e) => updateGrid({ resolution: Number(e.target.value) })}
                                className="w-full transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <RecentProjects
                            projects={[
                                { id: '1', name: 'Visible Metalens A', params: { f: 100, wavelength: 0.532, na: 0.5 }, date: '2026.02.13' },
                                { id: '2', name: 'Near-IR Concentrator', params: { f: 500, wavelength: 1.55, na: 0.3 }, date: '2026.02.12' }
                            ]}
                            onLoad={() => { }}
                        />
                    </div>
                </div>

                <div className="mt-auto p-4 bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/20 rounded-xl backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h4 className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></div>
                        Live Design Stats
                    </h4>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Calculated Radius</span>
                        <span className="font-mono text-blue-300 font-semibold">{lensRadius.toFixed(2)} μm</span>
                    </div>
                </div>
            </aside>

            {/* Main Content: 시각화 패널 */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 lg:space-y-10 relative">
                {/* Background decorative elements */}
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <header className="flex justify-between items-end pb-4 border-b border-slate-800/60">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Inverse Design Engine</h2>
                        <p className="text-slate-400 text-sm">Real-time meta-atom placement & phase profiling via Neural Surrogate Model</p>
                    </div>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25 border border-blue-400/20 active:scale-[0.98] flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export GDSII Setup
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                    <PhaseMap2D data={simulationResult} lensRadius={lensRadius} />

                    <div className="space-y-6">
                        <div className="p-7 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"></div>
                            <h3 className="text-slate-100 text-base font-bold mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Mathematical formulation
                            </h3>
                            <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                                <p>
                                    The target phase profile is continuously recalculated based on your current inputs. We apply the hyperbolic phase equation:
                                </p>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-center text-blue-300 shadow-inner">
                                    Φ(x,y) = -(2π/λ) * [√(x² + y² + f²) - f]
                                </div>
                                <p className="text-slate-400 text-xs">
                                    Our PyTorch surrogate model simultaneously queries the database to match the optimal cylindrical nanopillars to this phase map perfectly.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center text-center gap-2">
                                <div className="text-2xl font-bold text-slate-200">99.8<span className="text-base text-slate-500 ml-1">%</span></div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Phase Match</div>
                            </div>
                            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center text-center gap-2">
                                <div className="text-2xl font-bold text-slate-200">12<span className="text-base text-slate-500 ml-1">ms</span></div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Inference Latency</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-200">3D Nanostructure Preview</h3>
                        <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                            GPU Rendering Active
                        </div>
                    </div>
                    <MetaArray3D data={simulationResult} lensRadius={lensRadius} />
                </div>
            </main>
        </div>
    );
}

