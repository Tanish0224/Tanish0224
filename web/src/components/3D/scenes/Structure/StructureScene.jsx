import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import CubeSatProxy from '../../proxies/CubeSatProxy.jsx';
import { scrollState } from '../../core/scrollState.js';
import * as THREE from 'three';

const ACTIVE_EPSILON = 0.001;

export default function StructureScene() {
  const groupRef = useRef();
  
  // Mutable state specifically for passing sub-scene local progress to proxies
  // avoiding per-frame React re-renders.
  const proxyState = useRef({ explodeProgress: 0 });

  useFrame(() => {
    const progress = scrollState.structure;
    
    // Explicit scene visibility / lifecycle boundary
    if (progress <= ACTIVE_EPSILON) {
      groupRef.current.visible = false;
      groupRef.current.scale.setScalar(0.001);
      // Reset local proxy state
      proxyState.current.explodeProgress = 0;
      return;
    }
    
    groupRef.current.visible = true;
    
    // Scale Logic
    if (progress <= 0.15) {
      // Phase A: Entry
      const p = progress / 0.15;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, p));
    } else if (progress >= 0.85) {
      // Phase E: Exit
      const p = (progress - 0.85) / 0.15;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.001, p));
    } else {
      groupRef.current.scale.setScalar(1);
    }

    // Deterministic Rotation Logic (replaces time-driven rotation)
    let rotationY = 0;
    if (progress > 0.15 && progress <= 0.35) {
      // Phase B: Form examination rotation
      const p = (progress - 0.15) / 0.20;
      // Smoothstep easing for a mechanical, deliberate feel
      const smoothP = p * p * (3 - 2 * p);
      rotationY = smoothP * Math.PI * 0.5; // Rotate 90 degrees
    } else if (progress > 0.35) {
      // Hold rotation during explosion and exit
      rotationY = Math.PI * 0.5; 
    }
    groupRef.current.rotation.y = rotationY;

    // Exploded View Logic (Phase C)
    let explode = 0;
    if (progress > 0.35 && progress <= 0.65) {
      const p = (progress - 0.35) / 0.30;
      // Sine curve: starts at 0, peaks at 1 (when p=0.5), returns to 0
      explode = Math.sin(p * Math.PI) * 0.8; 
    }
    
    // Write purely to mutable ref, bypassing React render overhead
    proxyState.current.explodeProgress = explode;
  });

  return (
    <group ref={groupRef}>
      <CubeSatProxy proxyState={proxyState} />
    </group>
  );
}
