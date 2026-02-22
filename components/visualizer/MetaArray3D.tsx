'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Instances, Instance, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationResult } from '@/types/physics';

interface MetaArray3DProps {
    data: SimulationResult | null;
    lensRadius: number;
}

/**
 * MetaAtoms
 * InstancedMesh를 사용하여 수만 개의 나노 기둥을 효율적으로 렌더링합니다.
 */
function MetaAtoms({ data, lensRadius }: MetaArray3DProps) {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const { instances, count } = useMemo(() => {
        if (!data) return { instances: [], count: 0 };

        const { phaseMap, gridX, gridY } = data;
        const tempInstances = [];
        let atomCount = 0;

        for (let i = 0; i < gridX.length; i++) {
            for (let j = 0; j < gridY.length; j++) {
                const x = gridX[i];
                const y = gridY[j];
                const phase = phaseMap[i][j];

                const r = Math.sqrt(x * x + y * y);
                if (r <= lensRadius) {
                    // Normalize phase [0, 2pi] -> [0, 1]
                    const normPhase = phase / (2 * Math.PI);

                    // Dynamic radius modulation: phase가 클수록 기둥이 두꺼워지도록 (또는 작아지도록)
                    // 현실적인 디자인: Radius 50nm ~ 200nm (0.05 ~ 0.2 um)
                    const scale = 0.4 + normPhase * 1.2;

                    // Color sync with 2D map
                    const hue = 240 - (normPhase * 240);
                    const color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);

                    tempInstances.push({
                        position: [x, 0, y] as [number, number, number],
                        color: color,
                        scale: scale
                    });
                    atomCount++;
                }
            }
        }
        return { instances: tempInstances, count: atomCount };
    }, [data, lensRadius]);

    // InstancedMesh 직접 제어 (성능 극대화)
    useFrame(() => {
        if (!meshRef.current) return;
        const matrix = new THREE.Matrix4();
        instances.forEach((inst, i) => {
            // Apply scale to the matrix
            matrix.makeScale(inst.scale, 1, inst.scale);
            matrix.setPosition(inst.position[0], inst.position[1], inst.position[2]);
            meshRef.current?.setMatrixAt(i, matrix);
            meshRef.current?.setColorAt(i, inst.color);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
            <meshStandardMaterial />
        </instancedMesh>
    );
}

export const MetaArray3D: React.FC<MetaArray3DProps> = ({ data, lensRadius }) => {
    return (
        <div className="w-full h-[600px] border border-slate-700/50 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative group cursor-move">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[50, 50, 50]} fov={50} />
                <OrbitControls makeDefault enablePan={true} enableZoom={true} maxPolarAngle={Math.PI / 2} />
                <ambientLight intensity={0.6} />
                <pointLight position={[100, 100, 100]} intensity={1.5} castShadow />
                <directionalLight position={[-50, 50, -50]} intensity={0.5} />
                <gridHelper args={[200, 40, '#334155', '#1e293b']} />

                <React.Suspense fallback={null}>
                    <MetaAtoms data={data} lensRadius={lensRadius} />
                </React.Suspense>
            </Canvas>

            <div className="absolute bottom-5 right-5 flex gap-2 pointer-events-none">
                <div className="bg-slate-900/80 text-slate-300 px-4 py-2 rounded-lg text-xs font-medium border border-slate-700/50 backdrop-blur-md shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                    Drag to rotate, scroll to zoom
                </div>
            </div>
        </div>
    );
};
