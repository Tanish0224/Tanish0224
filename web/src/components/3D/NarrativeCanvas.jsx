import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneController from './SceneController.jsx';

export default function NarrativeCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]} // Adaptive pixel ratio baseline
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Suspense fallback={null}>
        <SceneController />
      </Suspense>
    </Canvas>
  );
}
