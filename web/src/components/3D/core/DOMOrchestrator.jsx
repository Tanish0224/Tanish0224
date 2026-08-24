import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { scrollState } from './scrollState.js';
import { NARRATIVE_CHAPTERS } from '../../../constants/narrative.js';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DOMOrchestrator() {
  useLayoutEffect(() => {
    const triggers = [];
    
    Object.keys(NARRATIVE_CHAPTERS).forEach((key) => {
      const chapter = NARRATIVE_CHAPTERS[key];
      const el = document.getElementById(chapter.id);
      
      if (el) {
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom', 
          end: 'bottom top',   
          onUpdate: (self) => {
            scrollState[key] = self.progress;
          }
        });
        triggers.push(st);
      }
    });
    
    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  return null;
}
