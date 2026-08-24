import { useFrame, useThree } from '@react-three/fiber';
import { scrollState } from './scrollState.js';
import * as THREE from 'three';

const ACTIVE_EPSILON = 0.001;

// Deterministic dominant-chapter selection strategy based on the largest active progress
const getDominantChapter = (state) => {
  const chapters = [
    ['structure', state.structure],
    ['motion', state.motion],
    ['flow', state.flow],
    ['computation', state.computation],
    ['evidence', state.evidence]
  ];

  let dominant = 'neutral';
  let maxProgress = ACTIVE_EPSILON;

  for (const [name, progress] of chapters) {
    if (progress > maxProgress) {
      dominant = name;
      maxProgress = progress;
    }
  }

  return dominant;
};

export default function CameraController() {
  const { camera } = useThree();

  useFrame(() => {
    const dom = getDominantChapter(scrollState);
    const sProg = scrollState.structure;
    const mProg = scrollState.motion;
    const fProg = scrollState.flow;
    const cProg = scrollState.computation;
    
    // Default neutral handoff state
    let desiredPos = [0, 0, 5];
    let desiredTarget = [0, 0, 0];

    if (dom === 'structure') {
      if (sProg <= 0.15) {
        const p = sProg / 0.15;
        desiredPos = [
          THREE.MathUtils.lerp(3, 2, p),
          THREE.MathUtils.lerp(2, 1, p),
          THREE.MathUtils.lerp(6, 4, p)
        ];
      } else if (sProg <= 0.35) {
        const p = (sProg - 0.15) / 0.20;
        const smoothP = p * (2 - p);
        desiredPos = [
          THREE.MathUtils.lerp(2, 1.5, smoothP),
          THREE.MathUtils.lerp(1, 0.5, smoothP),
          THREE.MathUtils.lerp(4, 3, smoothP)
        ];
      } else if (sProg <= 0.65) {
        desiredPos = [1.5, 0.5, 3];
      } else if (sProg <= 0.85) {
        const p = (sProg - 0.65) / 0.20;
        desiredPos = [
          THREE.MathUtils.lerp(1.5, 2, p),
          THREE.MathUtils.lerp(0.5, 1, p),
          THREE.MathUtils.lerp(3, 4, p)
        ];
      } else {
        const p = (sProg - 0.85) / 0.15;
        desiredPos = [
          THREE.MathUtils.lerp(2, 0, p),
          THREE.MathUtils.lerp(1, 0, p),
          THREE.MathUtils.lerp(4, 5, p)
        ];
      }
    } 
    else if (dom === 'motion') {
      if (mProg <= 0.15) {
        const p = mProg / 0.15;
        desiredPos = [
          THREE.MathUtils.lerp(0, 2.2, p),
          THREE.MathUtils.lerp(0, 0.8, p),
          THREE.MathUtils.lerp(5, 4.2, p)
        ];
      } else if (mProg <= 0.35) {
        const p = (mProg - 0.15) / 0.20;
        const smoothP = p * (2 - p);
        desiredPos = [
          THREE.MathUtils.lerp(2.2, 1.5, smoothP),
          THREE.MathUtils.lerp(0.8, -0.5, smoothP),
          THREE.MathUtils.lerp(4.2, 3.0, smoothP)
        ];
      } else if (mProg <= 0.65) {
        desiredPos = [1.5, -0.5, 3.0];
      } else if (mProg <= 0.85) {
        const p = (mProg - 0.65) / 0.20;
        const smoothP = p * (2 - p);
        desiredPos = [
          THREE.MathUtils.lerp(1.5, 2.0, smoothP),
          THREE.MathUtils.lerp(-0.5, 0.0, smoothP),
          THREE.MathUtils.lerp(3.0, 4.0, smoothP)
        ];
      } else {
        const p = (mProg - 0.85) / 0.15;
        desiredPos = [
          THREE.MathUtils.lerp(2.0, 0, p),
          THREE.MathUtils.lerp(0.0, 0, p),
          THREE.MathUtils.lerp(4.0, 5, p)
        ];
      }
    }
    else if (dom === 'flow') {
      if (fProg <= 0.15) {
        const p = fProg / 0.15;
        desiredPos = [
          THREE.MathUtils.lerp(0, 2.4, p),
          THREE.MathUtils.lerp(0, 1.2, p),
          THREE.MathUtils.lerp(5, 4.5, p)
        ];
      } else if (fProg <= 0.35) {
        const p = (fProg - 0.15) / 0.20;
        const smoothP = p * (2 - p);
        desiredPos = [
          THREE.MathUtils.lerp(2.4, 2.0, smoothP),
          THREE.MathUtils.lerp(1.2, 0.5, smoothP),
          THREE.MathUtils.lerp(4.5, 3.2, smoothP)
        ];
      } else if (fProg <= 0.65) {
        desiredPos = [2.0, 0.5, 3.2];
      } else if (fProg <= 0.85) {
        const p = (fProg - 0.65) / 0.20;
        const smoothP = p * (2 - p);
        desiredPos = [
          THREE.MathUtils.lerp(2.0, 1.2, smoothP),
          THREE.MathUtils.lerp(0.5, 0.5, smoothP),
          THREE.MathUtils.lerp(3.2, 4.0, smoothP)
        ];
      } else {
        const p = (fProg - 0.85) / 0.15;
        desiredPos = [
          THREE.MathUtils.lerp(1.2, 0, p),
          THREE.MathUtils.lerp(0.5, 0, p),
          THREE.MathUtils.lerp(4.0, 5, p)
        ];
      }
    }
    else if (dom === 'computation') {
      if (cProg <= 0.15) {
        const p = cProg / 0.15;
        desiredPos = [
          THREE.MathUtils.lerp(0, 2.5, p),
          THREE.MathUtils.lerp(0, 2.0, p),
          THREE.MathUtils.lerp(5, 4.0, p)
        ];
      } else if (cProg <= 0.35) {
        const p = (cProg - 0.15) / 0.20;
        const smoothP = p * (2 - p);
        desiredPos = [
          THREE.MathUtils.lerp(2.5, 1.8, smoothP),
          THREE.MathUtils.lerp(2.0, 1.2, smoothP),
          THREE.MathUtils.lerp(4.0, 3.5, smoothP)
        ];
      } else if (cProg <= 0.65) {
        // Hold steady to examine MPI parallel decomposition
        desiredPos = [1.8, 1.2, 3.5];
      } else if (cProg <= 0.85) {
        const p = (cProg - 0.65) / 0.20;
        const smoothP = p * (2 - p);
        desiredPos = [
          THREE.MathUtils.lerp(1.8, 1.5, smoothP),
          THREE.MathUtils.lerp(1.2, 0.8, smoothP),
          THREE.MathUtils.lerp(3.5, 3.0, smoothP)
        ];
      } else {
        const p = (cProg - 0.85) / 0.15;
        desiredPos = [
          THREE.MathUtils.lerp(1.5, 0, p),
          THREE.MathUtils.lerp(0.8, 0, p),
          THREE.MathUtils.lerp(3.0, 5, p)
        ];
      }
    }

    camera.position.set(desiredPos[0], desiredPos[1], desiredPos[2]);
    camera.lookAt(desiredTarget[0], desiredTarget[1], desiredTarget[2]);
  });
  
  return null;
}
