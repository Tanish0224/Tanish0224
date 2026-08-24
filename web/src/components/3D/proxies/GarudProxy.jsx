import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GarudProxy({ proxyState }) {
  const tvcGroupRef = useRef();
  const thrustRef = useRef();

  // Geometries and Edges
  const bodyGeo = useMemo(() => new THREE.CylinderGeometry(0.2, 0.2, 2, 16), []);
  const bodyEdges = useMemo(() => new THREE.EdgesGeometry(bodyGeo), [bodyGeo]);

  const finSideGeo = useMemo(() => new THREE.BoxGeometry(0.05, 0.4, 0.3), []);
  const finSideEdges = useMemo(() => new THREE.EdgesGeometry(finSideGeo), [finSideGeo]);

  const finFrontGeo = useMemo(() => new THREE.BoxGeometry(0.3, 0.4, 0.05), []);
  const finFrontEdges = useMemo(() => new THREE.EdgesGeometry(finFrontGeo), [finFrontGeo]);

  const nozzleGeo = useMemo(() => new THREE.CylinderGeometry(0.1, 0.15, 0.3, 16), []);
  const nozzleEdges = useMemo(() => new THREE.EdgesGeometry(nozzleGeo), [nozzleGeo]);

  const thrustGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.15, 1, 16);
    geo.rotateX(Math.PI);
    geo.translate(0, -0.5, 0); 
    return geo;
  }, []);
  useFrame(() => {
    if (!proxyState?.current) return;
    const state = proxyState.current;
    
    if (tvcGroupRef.current) {
      tvcGroupRef.current.rotation.x = state.nozzlePitch || 0;
      tvcGroupRef.current.rotation.z = state.nozzleYaw || 0;
    }
    
    if (thrustRef.current) {
      const intensity = state.thrustIntensity || 0;
      thrustRef.current.scale.set(1, intensity, 1);
      thrustRef.current.material.opacity = intensity * 0.8;
      thrustRef.current.visible = intensity > 0.01;
    }
  });

  return (
    <group>
      {/* Rocket Body */}
      <group position={[0, 0.5, 0]}>
        <mesh geometry={bodyGeo}>
          <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.7} transparent opacity={0.8} />
        </mesh>
        <lineSegments geometry={bodyEdges}>
          <lineBasicMaterial color="#6b7280" opacity={0.5} transparent />
        </lineSegments>
      </group>
      
      {/* Fins */}
      <group position={[0, -0.3, 0.2]}>
        <mesh geometry={finSideGeo}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <lineSegments geometry={finSideEdges}>
          <lineBasicMaterial color="#38bdf8" opacity={0.6} transparent />
        </lineSegments>
      </group>
      
      <group position={[0, -0.3, -0.2]}>
        <mesh geometry={finSideGeo}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <lineSegments geometry={finSideEdges}>
          <lineBasicMaterial color="#38bdf8" opacity={0.6} transparent />
        </lineSegments>
      </group>

      <group position={[0.2, -0.3, 0]}>
        <mesh geometry={finFrontGeo}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <lineSegments geometry={finFrontEdges}>
          <lineBasicMaterial color="#38bdf8" opacity={0.6} transparent />
        </lineSegments>
      </group>

      <group position={[-0.2, -0.3, 0]}>
        <mesh geometry={finFrontGeo}>
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <lineSegments geometry={finFrontEdges}>
          <lineBasicMaterial color="#38bdf8" opacity={0.6} transparent />
        </lineSegments>
      </group>

      {/* TVC Mechanism & Nozzle */}
      <group ref={tvcGroupRef} position={[0, -0.5, 0]}>
        {/* Nozzle */}
        <group position={[0, -0.15, 0]}>
          <mesh geometry={nozzleGeo}>
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </mesh>
          <lineSegments geometry={nozzleEdges}>
            <lineBasicMaterial color="#fb923c" opacity={0.8} transparent />
          </lineSegments>
        </group>
        
        {/* Thrust Visualizer */}
        <mesh ref={thrustRef} geometry={thrustGeo} position={[0, -0.3, 0]}>
          <meshBasicMaterial color="#fb923c" transparent={true} opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
}

