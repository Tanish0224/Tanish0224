import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraController from './CameraController.jsx';
import StructureScene from '../scenes/Structure/StructureScene.jsx';
import MotionScene from '../scenes/Motion/MotionScene.jsx';
import FlowScene from '../scenes/Flow/FlowScene.jsx';
import ComputationScene from '../scenes/Computation/ComputationScene.jsx';

export default function NarrativeCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]} 
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      {/* Clean engineering visualization lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      
      <Suspense fallback={null}>
        <CameraController />
        <StructureScene />
        <MotionScene />
        <FlowScene />
        <ComputationScene />
      </Suspense>
    </Canvas>
  );
}
