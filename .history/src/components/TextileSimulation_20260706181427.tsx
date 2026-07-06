"use client";

import React, { useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function TextileSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Thread configuration
    const verticalThreadsCount = 24;
    const horizontalThreadsCount = 22;
    let time = 0;

    const drawSimulation = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.005;

      const isDark = theme === "dark";
      // Color definitions
      const threadColorPrimary = isDark
        ? "rgba(212, 175, 55, 0.15)"  // gold for dark mode
        : "rgba(184, 156, 114, 0.18)"; // muted gold for light mode
      const threadColorSecondary = isDark
        ? "rgba(255, 255, 255, 0.04)"
        : "rgba(0, 0, 0, 0.03)";
      const highlightColor = isDark
        ? "rgba(212, 175, 55, 0.4)"
        : "rgba(184, 156, 114, 0.5)";

      // Draw vertical threads
      for (let i = 0; i <= verticalThreadsCount; i++) {
        const xBase = (width / verticalThreadsCount) * i;
        ctx.beginPath();
        
        // Highlight some threads
        const isSpecial = i % 5 === 0;
        ctx.strokeStyle = isSpecial ? threadColorPrimary : threadColorSecondary;
        ctx.lineWidth = isSpecial ? 1.5 : 1;

        for (let y = 0; y <= height; y += 10) {
          // Wave movement
          const wave = Math.sin(y * 0.01 + time + i * 0.5) * 15;
          let currentX = xBase + wave;

          // Mouse displacement
          if (mouse.active) {
            const dx = mouse.x - currentX;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const force = (150 - dist) / 150;
              currentX -= (dx / dist) * force * 40;
              
              if (isSpecial && dist < 80) {
                ctx.strokeStyle = highlightColor;
              }
            }
          }

          if (y === 0) {
            ctx.moveTo(currentX, y);
          } else {
            ctx.lineTo(currentX, y);
          }
        }
        ctx.stroke();
      }

      // Draw horizontal threads
      for (let j = 0; j <= horizontalThreadsCount; j++) {
        const yBase = (height / horizontalThreadsCount) * j;
        ctx.beginPath();

        const isSpecial = j % 6 === 0;
        ctx.strokeStyle = isSpecial ? threadColorPrimary : threadColorSecondary;
        ctx.lineWidth = isSpecial ? 1.5 : 1;

        for (let x = 0; x <= width; x += 10) {
          // Wave movement
          const wave = Math.cos(x * 0.01 + time + j * 0.5) * 15;
          let currentY = yBase + wave;

          // Mouse displacement
          if (mouse.active) {
            const dx = mouse.x - x;
            const dy = mouse.y - currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const force = (150 - dist) / 150;
              currentY -= (dy / dist) * force * 40;
              
              if (isSpecial && dist < 80) {
                ctx.strokeStyle = highlightColor;
              }
            }
          }

          if (x === 0) {
            ctx.moveTo(x, currentY);
          } else {
            ctx.lineTo(x, currentY);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(drawSimulation);
    };

    drawSimulation();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80 transition-opacity duration-500"
    />
  );
}
