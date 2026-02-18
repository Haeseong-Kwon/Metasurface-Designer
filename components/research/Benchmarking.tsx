'use client';

import React, { useMemo } from 'react';

interface BenchmarkingProps {
    testData: {
        target: number;
        predicted: number;
        radius: number;
    }[];
}

/**
 * Benchmarking Dashboard
 * AI 모델의 예측값과 수치 해석 결과(Ground Truth)를 비교 분석합니다.
 */
export function Benchmarking({ testData }: BenchmarkingProps) {
    // 통계 지표 계산
    const stats = useMemo(() => {
        if (testData.length === 0) return null;

        let sumErrorSq = 0;
        let sumTarget = 0;
        let sumTargetSq = 0;
        let sumPred = 0;
        let sumTargetPred = 0;

        testData.forEach(d => {
            const error = d.target - d.predicted;
            sumErrorSq += error * error;
            sumTarget += d.target;
            sumTargetSq += d.target * d.target;
            sumPred += d.predicted;
            sumTargetPred += d.target * d.predicted;
        });

        const mse = sumErrorSq / testData.length;
        const rmse = Math.sqrt(mse);

        // R-squared (단순 계산)
        const n = testData.length;
        const numerator = n * sumTargetPred - sumTarget * sumPred;
        const denominator = Math.sqrt((n * sumTargetSq - sumTarget * sumTarget) * (n * testData.reduce((s, d) => s + d.predicted * d.predicted, 0) - sumPred * sumPred));
        const r2 = Math.pow(numerator / denominator, 2);

        return { mse, rmse, r2 };
    }, [testData]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                AI Model Benchmarking
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-black/40 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase font-black mb-2">Mean Squared Error</div>
                    <div className="text-2xl font-mono text-indigo-400">{stats?.mse.toExponential(4)}</div>
                </div>
                <div className="p-6 bg-black/40 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase font-black mb-2">RMSE (Phase)</div>
                    <div className="text-2xl font-mono text-blue-400">{stats?.rmse.toFixed(4)} rad</div>
                </div>
                <div className="p-6 bg-black/40 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase font-black mb-2">R-Squared Score</div>
                    <div className="text-2xl font-mono text-emerald-400">{(stats?.r2 || 0).toFixed(4)}</div>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Error Distribution by Radius</h4>
                <div className="h-48 flex items-end gap-1 px-2 border-b border-l border-slate-800">
                    {testData.slice(0, 50).map((d, i) => {
                        const error = Math.abs(d.target - d.predicted);
                        const height = Math.min(100, (error / 0.5) * 100);
                        return (
                            <div
                                key={i}
                                className="flex-1 bg-indigo-500/40 hover:bg-indigo-500 transition-colors rounded-t-sm"
                                style={{ height: `${height}%` }}
                                title={`Error: ${error.toFixed(4)} rad at radius ${d.radius.toFixed(2)}um`}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                    <span>Center (0um)</span>
                    <span>Lens Edge</span>
                </div>
            </div>

            <div className="mt-10 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-xs text-indigo-300/80 leading-relaxed">
                <p>
                    <strong>[Note]</strong> 이 벤치마킹 데이터는 Surrogate 모델이 실제 시뮬레이션 결과와 얼마나 일치하는지를 나타냅니다.
                    R2 값이 0.95 이상일 경우 연구용으로 충분한 신뢰도를 확보한 것으로 간주합니다.
                </p>
            </div>
        </div>
    );
}
