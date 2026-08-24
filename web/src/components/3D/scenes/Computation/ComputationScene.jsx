import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import ComputationProxy from '../../proxies/ComputationProxy.jsx';
import { scrollState } from '../../core/scrollState.js';
import * as THREE from 'three';

const ACTIVE_EPSILON = 0.001;

export default function ComputationScene() {
  const groupRef = useRef();
  
  const proxyState = useRef({
    discretizeProgress: 0,
    decomposeProgress: 0,
    solveProgress: 0,
    intensity: 0
  });

  useFrame(() => {
    const progress = scrollState.computation;
    
    if (progress <= ACTIVE_EPSILON) {
      groupRef.current.visible = false;
      groupRef.current.scale.setScalar(0.001);
      
      proxyState.current.discretizeProgress = 0;
      proxyState.current.decomposeProgress = 0;
      proxyState.current.solveProgress = 0;
      proxyState.current.intensity = 0;
      return;
    }
    
    groupRef.current.visible = true;

    let discretize = 0;
    let decompose = 0;
    let solve = 0;
    let intensity = 1.0;

    // Phase A & E: Scale
    if (progress <= 0.15) {
      const p = progress / 0.15;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, p));
    } else if (progress >= 0.85) {
      const p = (progress - 0.85) / 0.15;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.001, p));
      discretize = 1;
      // Note: decompose is 0 here to return it to a solved solid block
      decompose = 0;
      solve = 1;
      intensity = 1.0 - p;
    } else {
      groupRef.current.scale.setScalar(1);
    }

    // Phase B: Discretization (0.15 -> 0.35)
    if (progress > 0.15 && progress <= 0.35) {
      const p = (progress - 0.15) / 0.20;
      discretize = p * (2 - p); // ease out
    } else if (progress > 0.35 && progress < 0.85) {
      discretize = 1.0;
    }

    // Phase C: Parallel Decomposition (0.35 -> 0.65)
    if (progress > 0.35 && progress <= 0.65) {
      const p = (progress - 0.35) / 0.30;
      // Splits apart and returns to unified field (0 -> 1 -> 0)
      decompose = Math.sin(p * Math.PI); 
    }

    // Phase D: Solver Output (0.65 -> 0.85)
    if (progress > 0.65 && progress <= 0.85) {
      const p = (progress - 0.65) / 0.20;
      solve = p * (2 - p);
    } else if (progress > 0.85) {
      solve = 1.0;
    }
    
    // Deterministic engineering examination rotation
    let rotY = 0;
    let rotX = 0;
    if (progress > 0.15 && progress <= 0.85) {
        const p = (progress - 0.15) / 0.70;
        rotY = p * Math.PI * 0.25; // 45 degree slow pan
        rotX = p * Math.PI * 0.05; // slight tilt
    } else if (progress > 0.85) {
        rotY = Math.PI * 0.25;
        rotX = Math.PI * 0.05;
    }
    groupRef.current.rotation.set(rotX, rotY, 0);

    proxyState.current.discretizeProgress = discretize;
    proxyState.current.decomposeProgress = decompose;
    proxyState.current.solveProgress = solve;
    proxyState.current.intensity = intensity;
  });

  return (
    <group ref={groupRef}>
      <ComputationProxy proxyState={proxyState} />
    </group>
  );
}
