import React, { useState, useEffect } from 'react';
import NarrativeCanvas from './NarrativeCanvas.jsx';
import DOMOrchestrator from './DOMOrchestrator.jsx';

// Safely get initial preference on client-side
const getInitialReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

export default function NarrativeCanvasWrapper() {
  const [reducedMotion, setReducedMotion] = useState(getInitialReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (reducedMotion) {
    return null; // Clean fallback: completely prevents WebGL overhead
  }

  return (
    <>
      <DOMOrchestrator />
      <NarrativeCanvas />
    </>
  );
}
