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
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
            <meshStandardMaterial
                metalness={0.7}
                roughness={0.2}
                emissive={new THREE.Color(0x000000)}
                envMapIntensity={1}
            />
        </instancedMesh>
    );
}

export const MetaArray3D: React.FC<MetaArray3DProps> = ({ data, lensRadius }) => {
    return (
        <div className="w-full h-[650px] border border-white/5 rounded-3xl bg-slate-950 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative group cursor-move">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[60, 45, 60]} fov={45} />
                <OrbitControls
                    makeDefault
                    enableDamping={true}
                    dampingFactor={0.05}
                    maxPolarAngle={Math.PI / 2.1}
                />

                <ambientLight intensity={0.4} />
                <pointLight position={[100, 100, 100]} intensity={2} color="#ffffff" castShadow />
                <spotLight position={[-50, 100, 50]} intensity={1.5} angle={0.3} penumbra={1} color="#6366f1" />
                <directionalLight position={[0, 10, 0]} intensity={0.5} />

                <gridHelper args={[240, 48, '#1e293b', '#0f172a']} position={[0, -0.1, 0]} />

                <React.Suspense fallback={null}>
                    <MetaAtoms data={data} lensRadius={lensRadius} />
                </React.Suspense>
            </Canvas>

            <div className="absolute top-6 left-6 flex flex-col gap-1 pointer-events-none">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Unit Cell Visualization</span>
                <span className="text-xs font-bold text-slate-200">Nanopillar Array Preview</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
                <div className="bg-slate-900/60 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/5 backdrop-blur-xl shadow-2xl flex items-center gap-3">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                    </div>
                    Rotate: Left Click / Zoom: Scroll / Pan: Right Click
                </div>
            </div>
        </div>
    );
};
