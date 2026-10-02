"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({
        x: (clientX / window.innerWidth - 0.5) * 40,
        y: (clientY / window.innerHeight - 0.5) * 40,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05060A]">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
      <div className="absolute top-[30%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-violet-600/[0.04] blur-[160px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-blue-600/[0.03] blur-[150px]" />

      {/* Cyber Grid with soft radial mask */}
      <div 
        className="absolute inset-0 bg-tech-grid opacity-[0.25]"
        style={{
          maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)",
        }}
      />

      {/* Interactive Cursor Spotlight */}
      <motion.div
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-400/[0.025] blur-[120px]"
      />

      {/* Subtle scanline / top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05060A]/40 to-[#05060A]" />
    </div>
  );
}
