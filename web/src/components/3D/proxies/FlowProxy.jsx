import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FlowProxy({ proxyState }) {
  const pointsRef = useRef();
  const inletRef = useRef();
  const gridRef = useRef();

  // Generate static flow field points once to avoid per-frame allocations
  const { positions, count } = useMemo(() => {
    const ptCount = 3000;
    const pts = [];
    
    // Inlet at x=-1, downstream to x=1.5
    for(let i = 0; i < ptCount; i++) {
      const x = -1 + Math.random() * 2.5;
      // Spread rate increases downstream
      const spread = 0.1 + ((x + 1) / 2.5) * 0.4;
      // Concentrate towards centerline using square root distribution
      const r = Math.pow(Math.random(), 0.5) * spread; 
      const theta = Math.random() * Math.PI * 2;
      
      pts.push({ x, y: r * Math.cos(theta), z: r * Math.sin(theta) });
    }
    
    // Sort by X coordinate so we can use setDrawRange to reveal the flow downstream
    pts.sort((a, b) => a.x - b.x);
    
    const posArray = new Float32Array(ptCount * 3);
    for(let i = 0; i < ptCount; i++) {
      posArray[i * 3] = pts[i].x;
      posArray[i * 3 + 1] = pts[i].y;
      posArray[i * 3 + 2] = pts[i].z;
    }
    
    return { positions: posArray, count: ptCount };
  }, []);

  useFrame(() => {
    if (!proxyState?.current) return;
    const state = proxyState.current;
    
    if (pointsRef.current) {
      // Deterministically reveal points based on scroll progress
      const drawCount = Math.floor(state.revealProgress * count);
      pointsRef.current.geometry.setDrawRange(0, drawCount);
      pointsRef.current.material.opacity = state.flowIntensity * 0.8;
      pointsRef.current.visible = state.flowIntensity > 0.01 && drawCount > 0;
    }

    if (inletRef.current) {
      inletRef.current.material.opacity = state.flowIntensity * 0.5;
      inletRef.current.visible = state.flowIntensity > 0.01;
    }

    if (gridRef.current) {
      gridRef.current.visible = state.analysisProgress > 0.01;
      // Fade in the analysis grid
      const gridOpacity = Math.min(state.analysisProgress * 0.5, 0.5);
      // Hack to set opacity on GridHelper which uses LineBasicMaterial internally
      gridRef.current.material.opacity = gridOpacity;
      gridRef.current.material.transparent = true;
    }
  });

  return (
    <group>
      {/* Inlet boundary plane */}
      <mesh ref={inletRef} position={[-1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent={true} opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Static Flow Field Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={count} 
            array={positions} 
            itemSize={3} 
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#06b6d4" 
          size={0.02} 
          transparent={true} 
          opacity={0} 
          depthWrite={false} 
        />
      </points>

      {/* Computational Transition Grid */}
      <gridHelper 
        ref={gridRef} 
        args={[3, 10, 0x8b5cf6, 0x8b5cf6]} 
        position={[0.25, -0.5, 0]} 
        visible={false} 
      />
    </group>
  );
}
