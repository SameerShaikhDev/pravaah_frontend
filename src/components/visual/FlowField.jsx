import React, { useEffect, useRef } from "react";

const rgb = (triplet) => triplet.trim().split(/\s+/).join(",");

/**
 * "Pravaah" = flow. A lightweight Canvas2D field of luminous ribbons that bend toward the cursor.
 * No WebGL / three.js dependency (≈2 KB) — it pauses off-screen / in background tabs, caps DPR at 2,
 * re-reads brand colours when the theme flips, and renders one still frame for reduced-motion users.
 */
export default function FlowField({ lines = 15, interactive = true, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0,
      h = 0,
      raf = 0,
      t = 0,
      visible = true;
    let accent = "124,108,255",
      flow = "46,230,208",
      light = false;
    const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999 };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      accent = rgb(cs.getPropertyValue("--accent"));
      flow = rgb(cs.getPropertyValue("--flow"));
      light = document.documentElement.dataset.theme === "light";
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.parentElement.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";
      pointer.sx += (pointer.x - pointer.sx) * 0.08;
      pointer.sy += (pointer.y - pointer.sy) * 0.08;

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, `rgba(${accent},0)`);
      grad.addColorStop(0.25, `rgba(${accent},1)`);
      grad.addColorStop(0.75, `rgba(${flow},1)`);
      grad.addColorStop(1, `rgba(${flow},0)`);
      ctx.strokeStyle = grad;

      const step = Math.max(6, w / 140);
      for (let i = 0; i < lines; i++) {
        const k = i / (lines - 1);
        const baseY = h * (0.3 + 0.45 * k);
        const amp = h * (0.05 + 0.08 * Math.sin(k * 3.1 + 1));
        ctx.beginPath();
        for (let x = 0; x <= w + step; x += step) {
          const nx = x / w;
          let y = baseY + Math.sin(nx * 5 + t * 0.6 + k * 4) * amp + Math.sin(nx * 11 - t * 0.4 + k * 7) * amp * 0.35;
          const dx = x - pointer.sx,
            dy = y - pointer.sy;
          y += (pointer.sy - y) * Math.exp(-(dx * dx + dy * dy) / (2 * 150 * 150)) * 0.4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = (light ? 0.35 : 0.5) * (0.35 + 0.65 * Math.sin(k * Math.PI));
        ctx.lineWidth = 1.1 + k * 0.9;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (visible && !document.hidden) {
        t += 0.012;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };

    readColors();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      readColors();
      if (reduce) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (interactive && !reduce) window.addEventListener("pointermove", onMove, { passive: true });
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [lines, interactive]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 w-full h-full ${className}`} />;
}
