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
                    // 위상에 따른 높이 또는 색상 변화 (시각적 구분)
                    const height = 0.6; // 고정 높이 (um)
                    const hue = (phase / (2 * Math.PI)) * 280;
                    const color = new THREE.Color(`hsl(${hue}, 70%, 50%)`);

                    tempInstances.push({
                        position: [x, 0, y] as [number, number, number],
                        color: color,
                        scale: 1
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
        <div className="w-full h-[600px] border rounded-lg bg-slate-900 overflow-hidden shadow-inner">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[50, 50, 50]} fov={50} />
                <OrbitControls makeDefault />
                <ambientLight intensity={0.5} />
                <pointLight position={[100, 100, 100]} intensity={1} castShadow />
                <gridHelper args={[200, 20]} />

                <React.Suspense fallback={null}>
                    <MetaAtoms data={data} lensRadius={lensRadius} />
                </React.Suspense>
            </Canvas>
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm pointer-events-none">
                3D Preview (GPU Accelerated)
            </div>
        </div>
    );
};
