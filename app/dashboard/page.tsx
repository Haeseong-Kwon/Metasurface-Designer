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
        <div className="flex h-screen bg-slate-950 text-slate-200">
            {/* Sidebar: 광학 파라미터 입력 */}
            <aside className="w-80 border-r border-slate-800 p-6 flex flex-col gap-6 bg-slate-900/50 backdrop-blur-xl">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Metalens Designer
                </h1>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 block">
                            Focal Length (μm)
                        </label>
                        <input
                            type="range" min="10" max="1000" step="10"
                            value={params.focalLength}
                            onChange={(e) => updateParams({ focalLength: Number(e.target.value) })}
                            className="w-full accent-blue-500"
                        />
                        <div className="text-right text-sm font-mono mt-1">{params.focalLength} μm</div>
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 block">
                            Wavelength (μm)
                        </label>
                        <input
                            type="range" min="0.3" max="1.6" step="0.01"
                            value={params.wavelength}
                            onChange={(e) => updateParams({ wavelength: Number(e.target.value) })}
                            className="w-full accent-cyan-500"
                        />
                        <div className="text-right text-sm font-mono mt-1">{params.wavelength} μm</div>
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 block">
                            Numerical Aperture (NA)
                        </label>
                        <input
                            type="range" min="0.1" max="0.9" step="0.05"
                            value={params.numericalAperture}
                            onChange={(e) => updateParams({ numericalAperture: Number(e.target.value) })}
                            className="w-full accent-indigo-500"
                        />
                        <div className="text-right text-sm font-mono mt-1">{params.numericalAperture}</div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 block">
                            Grid Resolution (μm)
                        </label>
                        <input
                            type="range" min="0.5" max="5.0" step="0.1"
                            value={gridConfig.resolution}
                            onChange={(e) => updateGrid({ resolution: Number(e.target.value) })}
                            className="w-full accent-slate-500"
                        />
                        <div className="text-right text-sm font-mono mt-1">{gridConfig.resolution} μm</div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 overflow-y-auto custom-scrollbar flex-1">
                    <RecentProjects
                        projects={[
                            { id: '1', name: 'Visible Metalens A', params: { f: 100, wavelength: 0.532, na: 0.5 }, date: '2026.02.13' },
                            { id: '2', name: 'Near-IR Concentrator', params: { f: 500, wavelength: 1.55, na: 0.3 }, date: '2026.02.12' }
                        ]}
                        onLoad={() => { }}
                    />
                </div>

                <div className="mt-auto p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-xs font-bold text-blue-400 mb-1">Optical Metrics</h4>
                    <div className="flex justify-between text-sm">
                        <span>Lens Radius:</span>
                        <span className="font-mono">{lensRadius.toFixed(2)} μm</span>
                    </div>
                </div>
            </aside>

            {/* Main Content: 시각화 패널 */}
            <main className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PhaseMap2D data={simulationResult} lensRadius={lensRadius} />

                    <div className="space-y-4">
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg shadow-xl">
                            <h3 className="text-slate-200 text-sm font-semibold mb-4">Design Summary</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                현재 설정된 광학 파라미터를 기반으로 하이퍼볼릭 위상 프로파일을 실시간 계산 중입니다.
                                2D 맵을 통해 위상 분포를 확인하고, 아래 3D 뷰어에서 메타 원자의 배치를 미리 볼 수 있습니다.
                            </p>
                        </div>

                        <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20">
                            Export GDSII Layout
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <MetaArray3D data={simulationResult} lensRadius={lensRadius} />
                </div>
            </main>
        </div>
    );
}
