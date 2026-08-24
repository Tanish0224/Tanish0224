import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import GarudProxy from '../../proxies/GarudProxy.jsx';
import { scrollState } from '../../core/scrollState.js';
import * as THREE from 'three';

const ACTIVE_EPSILON = 0.001;

export default function MotionScene() {
  const groupRef = useRef();
  
  // Mutable ref for local TVC state to prevent React re-renders
  const proxyState = useRef({
    nozzlePitch: 0,
    nozzleYaw: 0,
    thrustIntensity: 0
  });

  useFrame(() => {
    const progress = scrollState.motion;
    
    if (progress <= ACTIVE_EPSILON) {
      groupRef.current.visible = false;
      groupRef.current.scale.setScalar(0.001);
      
      // Reset proxy state cleanly
      proxyState.current.nozzlePitch = 0;
      proxyState.current.nozzleYaw = 0;
      proxyState.current.thrustIntensity = 0;
      return;
    }
    
    groupRef.current.visible = true;

    // Phase A & E: Scale Entry and Exit
    if (progress <= 0.15) {
      const p = progress / 0.15;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, p));
    } else if (progress >= 0.85) {
      const p = (progress - 0.85) / 0.15;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.001, p));
    } else {
      groupRef.current.scale.setScalar(1);
    }

    // Deterministic attitude evaluation variables
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    let nPitch = 0;
    let nYaw = 0;
    let tIntensity = 0;

    // Phase B: Attitude Examination (0.15 -> 0.35)
    if (progress > 0.15 && progress <= 0.35) {
      const p = (progress - 0.15) / 0.20;
      const smoothP = p * p * (3 - 2 * p); // smoothstep
      // Rotate 90 degrees to reveal fins profile
      rotY = smoothP * Math.PI * 0.5;
      // Slight technical tilt
      rotX = smoothP * Math.PI * 0.05;
    } else if (progress > 0.35) {
      rotY = Math.PI * 0.5;
      rotX = Math.PI * 0.05;
    }

    // Phase C: Thrust Vectoring (0.35 -> 0.65)
    if (progress > 0.35 && progress <= 0.65) {
      const p = (progress - 0.35) / 0.30;
      
      // Thrust visualization ramping (in/sustain/out)
      if (p < 0.2) tIntensity = p / 0.2;
      else if (p > 0.8) tIntensity = 1.0 - ((p - 0.8) / 0.2);
      else tIntensity = 1.0;

      // Deflection sequence
      if (p < 0.33) {
        // Pitch positive
        nPitch = Math.sin((p / 0.33) * Math.PI) * 0.25;
      } else if (p < 0.66) {
        // Yaw positive
        nYaw = Math.sin(((p - 0.33) / 0.33) * Math.PI) * 0.25;
      } else {
        // Pitch negative combination
        nPitch = Math.sin(((p - 0.66) / 0.34) * Math.PI) * -0.15;
      }
    }

    // Phase D: Directional Response (0.65 -> 0.85)
    if (progress > 0.65 && progress <= 0.85) {
      const p = (progress - 0.65) / 0.20;
      const smoothP = p * (2 - p); // ease out
      // Rocket body responds to the final thrust pitch
      rotZ = smoothP * -Math.PI * 0.15; // Vehicle tilts visually
    } else if (progress > 0.85) {
      rotZ = -Math.PI * 0.15;
    }

    // Apply strict determinism to the rocket body
    groupRef.current.rotation.set(rotX, rotY, rotZ);

    // Write to proxy state
    proxyState.current.nozzlePitch = nPitch;
    proxyState.current.nozzleYaw = nYaw;
    proxyState.current.thrustIntensity = tIntensity;
  });

  return (
    <group ref={groupRef}>
      <GarudProxy proxyState={proxyState} />
    </group>
  );
}
