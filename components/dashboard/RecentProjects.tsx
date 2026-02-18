'use client';

import React from 'react';

interface Project {
    id: string;
    name: string;
    params: {
        f: number;
        wavelength: number;
        na: number;
    };
    date: string;
}

interface RecentProjectsProps {
    projects: Project[];
    onLoad: (project: Project) => void;
}

/**
 * RecentProjects
 * 사용자의 과거 설계 이력을 표시하고 불러올 수 있는 섹션입니다.
 */
export function RecentProjects({ projects, onLoad }: RecentProjectsProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    Design History
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">{projects.length}</span>
                </h4>
                <button className="text-[9px] text-blue-500 hover:text-blue-400 font-bold uppercase transition-colors">
                    View All
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="py-8 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center">
                    <p className="text-slate-600 text-[10px] leading-relaxed">
                        저장된 설계 이력이 없습니다.<br />
                        새로운 렌즈 설계를 시작하세요.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => onLoad(p)}
                            className="group p-4 bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-xl transition-all cursor-pointer flex justify-between items-center"
                        >
                            <div>
                                <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{p.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">
                                    f={p.params.f}um | λ={p.params.wavelength}um | NA={p.params.na}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-slate-600 font-mono mb-1">{p.date}</div>
                                <div className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    RELOAD →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
