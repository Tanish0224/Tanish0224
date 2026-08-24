import React, { useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
// Note: In actual implementation, ScrollTrigger will be registered here
import CubeSatProxy from './StructureScene/CubeSatProxy.jsx';
import GarudProxy from './MotionScene/GarudProxy.jsx';
import { NARRATIVE_RANGES } from '../../constants/narrative.js';

export default function SceneController() {
  const timeline = useRef();
  
  const cubeRef = useRef();
  const garudRef = useRef();

  useLayoutEffect(() => {
    // We bind a timeline directly to the native window scroll.
    // Assuming 0 to 1 progress maps to the scrollable height of the document.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      
      // Map ranges from constants
      const sStart = NARRATIVE_RANGES.structure[0];
      const sEnd = NARRATIVE_RANGES.structure[1];
      const mStart = NARRATIVE_RANGES.motion[0];
      const mEnd = NARRATIVE_RANGES.motion[1];
      
      // Structure: CubeSat scales out
      tl.to(cubeRef.current.scale, { x: 0, y: 0, z: 0, duration: sEnd - sStart }, sStart);
      
      // Motion: Garud scales in
      tl.fromTo(garudRef.current.scale, 
        { x: 0, y: 0, z: 0 }, 
        { x: 1, y: 1, z: 1, duration: mEnd - mStart }, mStart);
        
      timeline.current = tl;
      
      // Normalize document scroll to 0-1
      const updateScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
        if (timeline.current) {
          timeline.current.progress(progress);
        }
      };
      
      window.addEventListener('scroll', updateScroll, { passive: true });
      updateScroll();
      
      return () => window.removeEventListener('scroll', updateScroll);
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <group>
      <group ref={cubeRef}>
        <CubeSatProxy />
      </group>
      <group ref={garudRef}>
        <GarudProxy />
      </group>
    </group>
  );
}
