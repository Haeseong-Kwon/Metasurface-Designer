'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

/**
 * DocsPage
 * 프로젝트 연구 문서 및 매뉴얼을 렌더링합니다.
 */
export default function DocsPage() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 실제 환경에서는 API나 로컬 파일에서 읽어옴
        // 여기서는 목업 데이터를 직접 사용하거나 fetch 시뮬레이션
        const doc = `
# Metasurface Designer Technical Documentation

AI 기반 메타렌즈 설계 플랫폼에 오신 것을 환영합니다. 이 문서는 설계 알고리즘과 물리적 배경에 대한 상세 정보를 제공합니다.

## 시스템 워크플로우

1. **Parameter Input**: 사용자가 초점 거리($f$), 파장($\\lambda$), 수치 구경($NA$)을 입력합니다.
2. **Phase Calculation**: 하이퍼볼릭 위상 프로파일을 그리드 좌표계에 생성합니다.
3. **AI Design**: Surrogate 모델을 통해 타겟 위상에 최적화된 메타 아톰 치수를 예측합니다.
4. **Verification**: AI 엔진이 설계된 전체 레이아웃의 효율($Efficiency$)을 재검증합니다.
5. **GDSII Export**: 반도체 공정용 레이아웃 데이터를 추출합니다.

## 핵심 수식 (LaTeX)

초점 거리 보존을 위한 위상 분포:
$$ \\Phi(r) = \\frac{2\\pi}{\\lambda} (f - \\sqrt{r^2 + f^2}) $$

AI 모델 손실 함수:
$$ \\mathcal{L} = \\text{MSE}(\\Phi_{pred}, \\Phi_{target}) + \\alpha(1 - T_{pred}) $$
    `;
        setContent(doc);
        setLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pt-20">
            <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"></div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <article className="prose prose-invert prose-slate max-w-none 
            prose-headings:text-indigo-300 prose-a:text-cyan-400 
            prose-strong:text-white prose-code:text-emerald-400">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {content}
                        </ReactMarkdown>
                    </article>
                )}
            </div>

            <div className="max-w-4xl mx-auto mt-8 flex justify-center">
                <a
                    href="/dashboard"
                    className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                    ← Back to Designer Dashboard
                </a>
            </div>
        </div>
    );
}
