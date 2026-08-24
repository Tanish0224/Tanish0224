import React from 'react';

export default function RecruiterIndex() {
  return (
    <nav className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 text-xs font-mono z-50 pointer-events-auto text-gray-500">
      <a href="#structure" className="hover:text-white transition-colors flex flex-col items-end group">
        <span className="text-[10px] text-gray-700 group-hover:text-gray-400 transition-colors">01</span>
        <span className="tracking-widest uppercase">Structure</span>
      </a>
      <a href="#motion" className="hover:text-white transition-colors flex flex-col items-end group">
        <span className="text-[10px] text-gray-700 group-hover:text-gray-400 transition-colors">02</span>
        <span className="tracking-widest uppercase">Motion</span>
      </a>
      <a href="#flow" className="hover:text-white transition-colors flex flex-col items-end group">
        <span className="text-[10px] text-gray-700 group-hover:text-gray-400 transition-colors">03</span>
        <span className="tracking-widest uppercase">Flow</span>
      </a>
      <a href="#computation" className="hover:text-white transition-colors flex flex-col items-end group">
        <span className="text-[10px] text-gray-700 group-hover:text-gray-400 transition-colors">04</span>
        <span className="tracking-widest uppercase">Computation</span>
      </a>
      <a href="#evidence" className="hover:text-white transition-colors flex flex-col items-end group mt-4 pt-4 border-t border-gray-800">
        <span className="text-[10px] text-gray-700 group-hover:text-gray-400 transition-colors">05</span>
        <span className="tracking-widest uppercase text-gray-400 group-hover:text-white">Selected Work</span>
      </a>
    </nav>
  );
}
