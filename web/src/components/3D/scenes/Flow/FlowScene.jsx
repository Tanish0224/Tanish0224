import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import FlowProxy from '../../proxies/FlowProxy.jsx';
import { scrollState } from '../../core/scrollState.js';
import * as THREE from 'three';

const ACTIVE_EPSILON = 0.001;

export default function FlowScene() {
  const groupRef = useRef();
  
  const proxyState = useRef({
    revealProgress: 0,
    analysisProgress: 0,
    flowIntensity: 0
  });

  useFrame(() => {
    const progress = scrollState.flow;
    
    if (progress <= ACTIVE_EPSILON) {
      groupRef.current.visible = false;
      groupRef.current.scale.setScalar(0.001);
      proxyState.current.revealProgress = 0;
      proxyState.current.analysisProgress = 0;
      proxyState.current.flowIntensity = 0;
      return;
    }
    
    groupRef.current.visible = true;

    let reveal = 0;
    let analysis = 0;
    let intensity = 1.0;

    // Phase A & E: Scale
    if (progress <= 0.15) {
      // Phase A: Domain Arrival
      const p = progress / 0.15;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, p));
      reveal = 0;
    } else if (progress >= 0.85) {
      // Phase E: Exit / Handoff
      const p = (progress - 0.85) / 0.15;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.001, p));
      intensity = 1.0 - p;
      reveal = 1;
      analysis = 1;
    } else {
      groupRef.current.scale.setScalar(1);
    }

    // Phase B: Flow Field Formation (0.15 -> 0.35)
    if (progress > 0.15 && progress <= 0.35) {
      reveal = (progress - 0.15) / 0.20;
    } else if (progress > 0.35 && progress < 0.85) {
      reveal = 1.0;
    }

    // Phase D: Analysis / Computational Transition (0.65 -> 0.85)
    if (progress > 0.65 && progress <= 0.85) {
      analysis = (progress - 0.65) / 0.20;
      // Fade flow intensity slightly to prioritize the computational mesh
      intensity = THREE.MathUtils.lerp(1.0, 0.3, analysis);
    } else if (progress > 0.85) {
      analysis = 1.0;
      intensity = 0.3; // Final baseline before exit fade
    }

    proxyState.current.revealProgress = reveal;
    proxyState.current.analysisProgress = analysis;
    proxyState.current.flowIntensity = intensity;
  });

  return (
    <group ref={groupRef}>
      <FlowProxy proxyState={proxyState} />
    </group>
  );
}
