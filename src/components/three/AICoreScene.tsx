"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AICore3D } from "./AICore3D";
import { Sparkles, Loader2 } from "lucide-react";

function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 animate-pulse">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
      <span className="text-xs font-mono tracking-widest text-cyan-300/80 uppercase">
        Initializing AI Core...
      </span>
    </div>
  );
}

export function AICoreScene() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[420px] lg:min-h-[560px] flex items-center justify-center relative">
        <CanvasLoader />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[420px] lg:min-h-[580px] relative flex items-center justify-center">
      {/* Background Soft Glow Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-violet-500/10 blur-[90px] animate-pulse-slow" />
      </div>

      <Canvas
        camera={{ position: [0, 0, isMobile ? 7 : 5.8], fov: 45 }}
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00F0FF" />
        <Suspense fallback={null}>
          <AICore3D />
        </Suspense>
      </Canvas>

      {/* Futuristic Floating Telemetry Overlay Tag */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono text-slate-300">
            CORE: <span className="text-cyan-300 font-semibold">AUTONOMOUS</span>
          </span>
        </div>
      </div>
    </div>
  );
}
