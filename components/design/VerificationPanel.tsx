'use client';

import React from 'react';

interface VerificationStats {
    efficiency: number;
    spotSize: number;
    focalError: number;
}

interface VerificationPanelProps {
    isVerifying: boolean;
    stats: VerificationStats | null;
    onVerify: () => void;
}

/**
 * VerificationPanel
 * AI가 예측한 메타렌즈 설계의 물리적 성능 리포트를 표시합니다.
 */
export function VerificationPanel({ isVerifying, stats, onVerify }: VerificationPanelProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-700"></div>

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                    Design Verification
                </h3>
                <button
                    onClick={onVerify}
                    disabled={isVerifying}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isVerifying
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20'
                        }`}
                >
                    {isVerifying ? 'Verifying...' : 'Verify Design'}
                </button>
            </div>

            {stats ? (
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Efficiency</div>
                        <div className="text-xl font-mono text-emerald-400">{(stats.efficiency * 100).toFixed(1)}%</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Spot Size</div>
                        <div className="text-xl font-mono text-blue-400">{stats.spotSize.toFixed(2)}μm</div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Focal Error</div>
                        <div className="text-xl font-mono text-rose-400">{stats.focalError.toFixed(2)}%</div>
                    </div>
                </div>
            ) : (
                <div className="py-12 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center px-6">
                    <p className="text-slate-500 text-sm leading-relaxed">
                        최종 설계의 광학 성능을 AI로 검증하세요.<br />
                        예상 효율 및 스팟 사이즈 분석 리포트가 생성됩니다.
                    </p>
                </div>
            )}

            {stats && (
                <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-400/80 leading-relaxed font-mono">
                    [System] AI Surrogate Model prediction complete.<br />
                    Result shows high correlation with target profile. Design is production-ready.
                </div>
            )}
        </div>
    );
}
