import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ComputationProxy({ proxyState }) {
  const meshRef = useRef();

  const { instanceCount, instanceData, dx, dy, dz } = useMemo(() => {
    // 20 x 10 x 10 = 2000 cells
    const nx = 20, ny = 10, nz = 10;
    const count = nx * ny * nz;
    const data = [];
    
    // Domain physical dimensions
    const sizeX = 2.0, sizeY = 1.0, sizeZ = 1.0;
    const dX = sizeX / nx, dY = sizeY / ny, dZ = sizeZ / nz;

    const baseColor = new THREE.Color("#1f2937"); // Darker neutral gray for premium look
    
    // Scalar field color mapper (blue -> cyan -> yellow -> orange)
    const colorScale = (val) => {
      const c = new THREE.Color();
      // hue from 0.6 (blue) to 0.05 (orange)
      c.setHSL((1 - val) * 0.55 + 0.05, 1.0, 0.5); 
      return c;
    };

    let i = 0;
    for (let x = 0; x < nx; x++) {
      for (let y = 0; y < ny; y++) {
        for (let z = 0; z < nz; z++) {
          const px = -sizeX/2 + dX/2 + x * dX;
          const py = -sizeY/2 + dY/2 + y * dY;
          const pz = -sizeZ/2 + dZ/2 + z * dZ;
          
          const pxIdx = Math.floor(x / (nx / 4)); 
          const pyIdx = Math.floor(y / (ny / 2)); 
          const pzIdx = Math.floor(z / (nz / 2)); 
          
          const pDirX = -1.5 + pxIdx; 
          const pDirY = -0.5 + pyIdx; 
          const pDirZ = -0.5 + pzIdx; 
          const dir = new THREE.Vector3(pDirX, pDirY, pDirZ).normalize();

          const r = Math.sqrt(py*py + pz*pz);
          const jetCore = Math.max(0, 1 - (r / 0.4));
          const decay = Math.max(0, 1 - ((px + 1) / 2.5));
          const scalarVal = Math.pow(jetCore * decay, 0.8);
          
          data.push({
            index: i++,
            basePos: new THREE.Vector3(px, py, pz),
            dir: dir,
            baseColor: baseColor,
            targetColor: colorScale(scalarVal)
          });
        }
      }
    }
    return { instanceCount: count, instanceData: data, dx: dX, dy: dY, dz: dZ };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  
  // Allocate reusable vectors outside of the frame loop to prevent massive GC pauses (120,000 allocations/sec)
  const _offset = useMemo(() => new THREE.Vector3(), []);
  const _pos = useMemo(() => new THREE.Vector3(), []);
  
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  useFrame(() => {
    if (!proxyState?.current || !meshRef.current) return;
    
    const { discretizeProgress, decomposeProgress, solveProgress, intensity } = proxyState.current;
    
    meshRef.current.visible = intensity > 0.01;

    for (let i = 0; i < instanceCount; i++) {
      const data = instanceData[i];
      
      // Zero-allocation vector math
      _offset.copy(data.dir).multiplyScalar(decomposeProgress * 0.4);
      _pos.copy(data.basePos).add(_offset);
      
      const cellScale = discretizeProgress - (decomposeProgress * 0.15);

      dummy.position.copy(_pos);
      dummy.scale.set(
        dx * 0.9 * cellScale, 
        dy * 0.9 * cellScale, 
        dz * 0.9 * cellScale
      ); 
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      color.lerpColors(data.baseColor, data.targetColor, solveProgress);
      meshRef.current.setColorAt(i, color);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    
    meshRef.current.material.opacity = Math.min(intensity, 0.85); 
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, null, instanceCount]}>
      <meshStandardMaterial 
        transparent={true}
        depthWrite={false}
        roughness={0.2}
        metalness={0.6}
        blending={THREE.NormalBlending}
      />
    </instancedMesh>
  );
}
