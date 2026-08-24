import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CubeSatProxy({ proxyState }) {
  const pxRef = useRef();
  const nxRef = useRef();
  const pyRef = useRef();
  const nyRef = useRef();

  // Pre-compute geometries and edges to save memory allocations
  const coreGeo = useMemo(() => new THREE.BoxGeometry(0.95, 0.95, 0.95), []);
  const coreEdges = useMemo(() => new THREE.EdgesGeometry(coreGeo), [coreGeo]);
  
  const sideGeo = useMemo(() => new THREE.BoxGeometry(0.05, 0.9, 0.9), []);
  const sideEdges = useMemo(() => new THREE.EdgesGeometry(sideGeo), [sideGeo]);
  
  const topGeo = useMemo(() => new THREE.BoxGeometry(0.9, 0.05, 0.9), []);
  const topEdges = useMemo(() => new THREE.EdgesGeometry(topGeo), [topGeo]);

  useFrame(() => {
    if (!proxyState?.current) return;
    
    const explode = proxyState.current.explodeProgress;
    
    if (pxRef.current && nxRef.current && pyRef.current && nyRef.current) {
      pxRef.current.position.x = 0.5 + explode;
      nxRef.current.position.x = -0.5 - explode;
      pyRef.current.position.y = 0.5 + explode;
      nyRef.current.position.y = -0.5 - explode;
    }
  });

  return (
    <group>
      {/* Structural frame */}
      <group>
        <mesh geometry={coreGeo}>
          <meshStandardMaterial color="#111827" roughness={0.7} metalness={0.5} transparent opacity={0.8} depthWrite={false} />
        </mesh>
        <lineSegments geometry={coreEdges}>
          <lineBasicMaterial color="#4b5563" />
        </lineSegments>
      </group>
      
      {/* +X Component */}
      <group ref={pxRef} position={[0.5, 0, 0]}>
        <mesh geometry={sideGeo}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        <lineSegments geometry={sideEdges}>
          <lineBasicMaterial color="#fb923c" transparent opacity={0.6} />
        </lineSegments>
      </group>
      
      {/* -X Component */}
      <group ref={nxRef} position={[-0.5, 0, 0]}>
        <mesh geometry={sideGeo}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        <lineSegments geometry={sideEdges}>
          <lineBasicMaterial color="#fb923c" transparent opacity={0.6} />
        </lineSegments>
      </group>
      
      {/* +Y Component */}
      <group ref={pyRef} position={[0, 0.5, 0]}>
        <mesh geometry={topGeo}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        <lineSegments geometry={topEdges}>
          <lineBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </lineSegments>
      </group>
      
      {/* -Y Component */}
      <group ref={nyRef} position={[0, -0.5, 0]}>
        <mesh geometry={topGeo}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        <lineSegments geometry={topEdges}>
          <lineBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </lineSegments>
      </group>
    </group>
  );
}
