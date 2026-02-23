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
 * Professional-grade visualization using high-fidelity materials and optimized instancing.
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
                    const normPhase = phase / (2 * Math.PI);

                    // Radius modulation for realistic nanopillars (50nm to 200nm)
                    const scale = 0.5 + normPhase * 1.5;

                    // Match Professional Colormap from 2D view
                    const hue = 280 - (normPhase * 280);
                    const saturation = 85 + (Math.sin(normPhase * Math.PI) * 15);
                    const lightness = 45 + (Math.cos(normPhase * Math.PI - Math.PI) * 15);
                    const color = new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);

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

    useFrame(() => {
        if (!meshRef.current) return;
        const matrix = new THREE.Matrix4();
        instances.forEach((inst, i) => {
            matrix.makeScale(inst.scale, 1, inst.scale);
            matrix.setPosition(inst.position[0], inst.position[1], inst.position[2]);
            meshRef.current?.setMatrixAt(i, matrix);
            meshRef.current?.setColorAt(i, inst.color);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 24]} />
            <meshStandardMaterial
                metalness={0.9}
                roughness={0.1}
                envMapIntensity={2}
            />
        </instancedMesh>
    );
}

export const MetaArray3D: React.FC<MetaArray3DProps> = ({ data, lensRadius }) => {
    return (
        <div className="w-full h-[650px] border border-white/5 rounded-2xl bg-slate-950 overflow-hidden shadow-2xl relative group cursor-move transition-all duration-500 hover:border-blue-500/20">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[50, 40, 50]} fov={35} />
                <OrbitControls
                    makeDefault
                    enableDamping={true}
                    dampingFactor={0.06}
                    maxPolarAngle={Math.PI / 2.2}
                />

                <ambientLight intensity={0.5} />
                <pointLight position={[60, 100, 60]} intensity={3} color="#ffffff" castShadow />
                <spotLight position={[-30, 80, 20]} intensity={2} angle={0.4} penumbra={1} color="#6366f1" />
                <directionalLight position={[0, 20, 0]} intensity={0.8} color="#94a3b8" />

                <gridHelper args={[300, 60, '#1e293b', '#0f172a']} position={[0, -0.4, 0]} />

                <React.Suspense fallback={null}>
                    <MetaAtoms data={data} lensRadius={lensRadius} />
                </React.Suspense>
            </Canvas>

            <div className="absolute top-8 left-8 flex flex-col gap-1 pointer-events-none">
                <span className="text-[10px] font-black text-blue-500/80 uppercase tracking-[0.4em]">Spatial preview</span>
                <span className="text-sm font-black text-white uppercase tracking-tight">Cylindrical α-Si Array</span>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex justify-center items-center pointer-events-none">
                <div className="bg-slate-900/60 text-slate-400 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-white/5 backdrop-blur-xl shadow-2xl flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"></div> Rotate (Left)</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-indigo-500"></div> Zoom (Scroll)</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-violet-500"></div> Pan (Right)</span>
                </div>
            </div>
        </div>
    );
};
