import React, { useEffect, useState, useRef } from 'react';

export const AutumnLogo3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    let animId: number;
    let t = 0;

    // Gentle ambient floating animation when user is not actively interacting
    const animateIdle = () => {
      if (!isInteracting) {
        t += 0.02;
        setRotate({
          x: Math.sin(t) * 3,
          y: Math.cos(t * 0.8) * 4
        });
      }
      animId = requestAnimationFrame(animateIdle);
    };

    animId = requestAnimationFrame(animateIdle);

    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (clientY - centerY) / (window.innerHeight / 2);

      const maxAngle = 14;
      const targetRotateY = Math.max(-maxAngle, Math.min(maxAngle, deltaX * maxAngle));
      const targetRotateX = Math.max(-maxAngle, Math.min(maxAngle, -deltaY * maxAngle));

      setIsInteracting(true);
      setRotate({ x: targetRotateX, y: targetRotateY });
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onEnd = () => {
      setIsInteracting(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isInteracting]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center py-4 sm:py-6 select-none cursor-pointer w-full max-w-full overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Dynamic glow aura */}
      <div
        className="absolute -inset-6 sm:-inset-10 rounded-full bg-gradient-to-r from-amber-600/20 via-orange-500/25 to-amber-700/20 blur-2xl sm:blur-3xl pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isInteracting ? 0.9 : 0.6,
          transform: `translate(${rotate.y * 1.5}px, ${-rotate.x * 1.5}px)`
        }}
      />

      {/* 3D tracking container */}
      <div
        className="relative transition-transform ease-out duration-150 max-w-full px-2"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floating Minecraft crown */}
        <div
          className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2"
          style={{ transform: 'translateZ(30px)' }}
        >
          <span className="text-lg sm:text-2xl filter drop-shadow-[0_2px_8px_rgba(249,115,22,0.8)]">🍂</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] font-mono font-bold text-amber-400/90 bg-amber-950/80 border border-amber-500/40 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-sm shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            Vanilla SMP • 26.2
          </span>
          <span className="text-lg sm:text-2xl filter drop-shadow-[0_2px_8px_rgba(249,115,22,0.8)]">🍁</span>
        </div>

        {/* Big 3D Title "AUTUMN" */}
        <div
          className="relative text-center font-black tracking-normal sm:tracking-wider leading-none"
          style={{ transform: 'translateZ(25px)' }}
        >
          {/* Deep 3D extrusion shadows */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 w-full text-transparent font-['Unbounded'] text-4xl sm:text-6xl md:text-8xl select-none"
            style={{
              textShadow: `
                0 1px 0 #7c2d12,
                0 2px 0 #7c2d12,
                0 3px 0 #431407,
                0 4px 0 #431407,
                0 6px 12px rgba(0,0,0,0.9),
                0 10px 24px rgba(249,115,22,0.3)
              `,
              transform: 'translateZ(10px)',
            }}
          >
            AUTUMN
          </span>

          {/* Front gradient & glowing text */}
          <span
            className="relative inline-block font-['Unbounded'] text-4xl sm:text-6xl md:text-8xl bg-gradient-to-b from-amber-200 via-orange-400 to-amber-600 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(251,146,60,0.6)]"
            style={{
              transform: 'translateZ(35px)',
              textShadow: '0 0 20px rgba(249,115,22,0.4)'
            }}
          >
            AUTUMN
          </span>
        </div>

        {/* Volumetric Sub-plate "MINECRAFT SERVER" */}
        <div
          className="mt-2.5 sm:mt-3 flex items-center justify-center gap-2 sm:gap-3"
          style={{ transform: 'translateZ(35px)' }}
        >
          <div className="h-0.5 w-6 sm:w-16 bg-gradient-to-r from-transparent via-amber-500 to-orange-500" />
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-sm bg-stone-900/90 border border-orange-500/50 shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            <span className="w-1.5 h-1.5 rounded-xs bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse" />
            <span className="font-['Unbounded'] text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-orange-200 uppercase">
              SERVER
            </span>
            <span className="w-1.5 h-1.5 rounded-xs bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse" />
          </div>
          <div className="h-0.5 w-6 sm:w-16 bg-gradient-to-l from-transparent via-amber-500 to-orange-500" />
        </div>

        {/* 15 Custom Plugins badge */}
        <div
          className="mt-2 text-center"
          style={{ transform: 'translateZ(25px)' }}
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-amber-300/85 bg-orange-950/60 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            15 уникальных самописных плагинов
          </span>
        </div>
      </div>
    </div>
  );
};
