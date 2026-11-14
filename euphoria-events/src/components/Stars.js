'use client';

import { useEffect, useRef } from 'react';

/**
 * Golden shooting stars that streak across the hero and burst into sparks.
 * Sits behind the hero collage; Motion.js fades it in as the collage forms.
 * Only animates while visible, and never for visitors who prefer reduced motion.
 */
const GOLD = ['255, 214, 120', '255, 190, 70', '255, 236, 180', '255, 160, 90'];

export default function Stars() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = canvas.getContext('2d');
    let w = 0; let h = 0; let dpr = 1;
    let raf = 0; let visible = false; let last = 0; let nextSpawn = 0; let running = false;
    const stars = []; const sparks = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.5 : 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      // Enter from the top or left edge, travel down and across
      const fromTop = Math.random() < 0.65;
      const x = fromTop ? Math.random() * w * 0.9 : -20;
      const y = fromTop ? -20 : Math.random() * h * 0.5;
      const angle = (Math.PI / 180) * (18 + Math.random() * 34);
      const speed = (w / 1.1) * (0.9 + Math.random() * 0.6);
      stars.push({
        x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0,
        burstAt: 0.45 + Math.random() * 0.55,   // seconds until it explodes
        tail: 90 + Math.random() * 120,
        col: GOLD[(Math.random() * GOLD.length) | 0],
      });
    };

    const burst = s => {
      const n = 34 + ((Math.random() * 22) | 0);
      for (let i = 0; i < n; i += 1) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.3;
        const v = 60 + Math.random() * 190;
        sparks.push({
          x: s.x, y: s.y, px: s.x, py: s.y,
          vx: Math.cos(a) * v + s.vx * 0.08, vy: Math.sin(a) * v + s.vy * 0.08,
          life: 0, max: 0.7 + Math.random() * 0.7,
          col: GOLD[(Math.random() * GOLD.length) | 0],
          size: 1.4 + Math.random() * 2,
        });
      }
    };

    const frame = t => {
      if (!visible) { running = false; return; }      // sleep while the hero is off screen
      raf = requestAnimationFrame(frame);
      const dt = Math.min((t - (last || t)) / 1000, 0.05);
      last = t;
      // Motion.js drives the layer's opacity; stay idle while it is hidden
      // The scroll animation writes opacity inline; reading it does not force a style recalculation
      const op = parseFloat(canvas.style.opacity) || 0;
      if (op < 0.02) { if (stars.length || sparks.length) { stars.length = 0; sparks.length = 0; ctx.clearRect(0, 0, w, h); } return; }

      if (t > nextSpawn && stars.length < 6) { spawn(); nextSpawn = t + 260 + Math.random() * 520; }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = stars.length - 1; i >= 0; i -= 1) {
        const s = stars[i];
        s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
        const len = Math.hypot(s.vx, s.vy);
        const tx = s.x - (s.vx / len) * s.tail; const ty = s.y - (s.vy / len) * s.tail;
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
        g.addColorStop(0, `rgba(${s.col}, 0)`);
        g.addColorStop(0.7, `rgba(${s.col}, 0.45)`);
        g.addColorStop(1, 'rgba(255, 250, 230, 1)');
        ctx.strokeStyle = g; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke();
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 14);
        glow.addColorStop(0, 'rgba(255, 245, 210, 0.95)'); glow.addColorStop(1, `rgba(${s.col}, 0)`);
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(s.x, s.y, 14, 0, Math.PI * 2); ctx.fill();
        if (s.life > s.burstAt || s.x > w + 40 || s.y > h + 40) {
          if (s.life > s.burstAt) burst(s);
          stars.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const p = sparks[i];
        p.life += dt;
        p.px = p.x; p.py = p.y;
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 140 * dt; // drag and gravity
        p.x += p.vx * dt; p.y += p.vy * dt;
        const k = 1 - p.life / p.max;
        if (k <= 0) { sparks.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(${p.col}, ${0.9 * k})`;
        ctx.lineWidth = p.size * k + 0.4;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    resize();
    window.addEventListener('resize', resize);
    const start = () => { if (!running && visible) { running = true; last = 0; raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }, { threshold: 0 });
    io.observe(canvas);

    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} id="heroStars" className="hero-stars" aria-hidden="true" />;
}
