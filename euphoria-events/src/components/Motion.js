'use client';

import { useEffect } from 'react';

/**
 * Client-only motion layer. Everything here is progressive: the page is fully
 * readable and usable without it, and it does nothing for visitors who ask for
 * reduced motion.
 *
 * Hooks used in markup:
 *   .split            heading whose words rise in on scroll (hero h1 on load)
 *   [data-rv]         block that fades up once on enter
 *   [data-fill]       paragraph whose words light up as it scrolls through
 *   [data-marq]       continuous marquee (value = seconds per loop, negative reverses)
 *   [data-tint]       section that shifts the ambient stage lighting
 *   [data-card]       story collage photo (value = depth in px)
 *   [data-strip]      gallery row whose speed follows scroll velocity
 *   [data-cur]        element that shows a labelled cursor on hover
 *   #heroStage, #spinStage, .svc-panel, #endStage: scroll-driven scenes
 */
export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanups = [];

    // Cursor (fine pointers only, independent of reduced motion since it follows the user)
    if (fine) cleanups.push(initCursor());

    if (reduce) {
      return () => cleanups.forEach(fn => fn && fn());
    }

    let cancelled = false;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('lenis'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      document.documentElement.classList.add('motion');

      // Smooth scroll
      const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const tick = time => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        const isMobile = () => window.innerWidth <= 760;

        /* ---------------- Ambient stage lighting ---------------- */
        const TINTS = {
          pink:   ['255, 60, 172', '120, 75, 210'],
          violet: ['140, 70, 255', '255, 60, 172'],
          gold:   ['255, 170, 60', '255, 60, 140'],
          cyan:   ['40, 200, 230', '140, 70, 255'],
        };
        gsap.utils.toArray('[data-tint]').forEach(sec => {
          const [t1, t2] = TINTS[sec.dataset.tint] || TINTS.pink;
          ScrollTrigger.create({
            trigger: sec, start: 'top 55%', end: 'bottom 55%',
            onToggle: self => { if (self.isActive) gsap.to(document.documentElement, { '--t1': t1, '--t2': t2, duration: 1.8, ease: 'sine.inOut', overwrite: 'auto' }); },
          });
        });

        /* ---------------- Hero ---------------- */
        gsap.timeline({ delay: 0.15 })
          .from('.hero h1 .w > span', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.07 })
          .from('.hero .h-in:not(.hero-lede)', { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, '-=0.9')
          // The lede is the largest text on load, so it moves in but is visible from the first frame
          .from('.hero .hero-lede', { y: 24, duration: 1.1, ease: 'expo.out' }, '<');

        const stage = document.getElementById('heroStage');
        if (stage) {
          const fans = gsap.utils.toArray('.fan');
          const r = stage.getBoundingClientRect();
          const tl = gsap.timeline({
            scrollTrigger: { trigger: stage, start: 'top top', end: '+=120%', pin: true, scrub: 0.8, anticipatePin: 1 },
          });
          tl.to('#heroCopy', { y: -80, opacity: 0, ease: 'power2.in', duration: 0.4 }, 0)
            .to('#heroTop', { y: -40, opacity: 0, duration: 0.3 }, 0)
            .fromTo('#heroFrame',
              { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
              { clipPath: () => (isMobile() ? 'inset(24% 14% 24% 14% round 18px)' : 'inset(20% 31% 20% 31% round 18px)'), ease: 'power2.inOut', duration: 1 }, 0)
            .fromTo('#heroSlides', { scale: 1 }, { scale: 1.12, ease: 'none', duration: 1 }, 0);
          fans.forEach((f, i) => {
            const b = f.getBoundingClientRect();
            const dx = (r.left + r.width / 2) - (b.left + b.width / 2);
            const dy = (r.top + r.height / 2) - (b.top + b.height / 2);
            tl.fromTo(f, { x: dx * 0.7, y: dy * 0.7, scale: 0.5, opacity: 0, rotate: (i % 2 ? 6 : -6) },
              { x: 0, y: 0, scale: 1, opacity: 1, rotate: (i % 2 ? -2 : 2), ease: 'power3.out', duration: 0.7 }, 0.25 + i * 0.04);
          });
          tl.fromTo('#heroMid', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, 0.7);
          // Golden shooting stars fade in behind the collage as it forms
          tl.fromTo('#heroStars', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0.3);

          // Pointer parallax: the photo and the collage drift in opposite directions
          const px = gsap.quickTo('#heroSlides', 'x', { duration: 1.2, ease: 'power3' });
          const py = gsap.quickTo('#heroSlides', 'y', { duration: 1.2, ease: 'power3' });
          const fx = gsap.quickTo('.hero-fan', 'x', { duration: 1.4, ease: 'power3' });
          const fy = gsap.quickTo('.hero-fan', 'y', { duration: 1.4, ease: 'power3' });
          const onMove = e => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            px(nx * -24); py(ny * -16); fx(nx * 16); fy(ny * 14);
          };
          stage.addEventListener('pointermove', onMove);
        }

        /* ---------------- 360° ring ---------------- */
        const ring = document.getElementById('ring');
        const ringWrap = document.getElementById('ringWrap');
        const degEl = document.getElementById('spinDeg');
        if (ring && ringWrap) {
          const st = { s: 0, d: 0, tilt: -6 };
          // Cards fade out as they turn side-on, so no thin slivers show at the edges
          const cards = Array.from(ring.children);
          const step = 360 / cards.length;
          const render = () => {
            const rot = st.s + st.d;
            ring.style.transform = `rotateX(${st.tilt}deg) rotateY(${rot}deg)`;
            cards.forEach((card, i) => {
              const ang = ((((i * step + rot) % 360) + 540) % 360) - 180;
              const facing = Math.cos((ang * Math.PI) / 180);
              const o = Math.min(1, Math.max(0, (facing - 0.38) / 0.4));
              card.style.opacity = o.toFixed(3);
              card.style.visibility = o < 0.01 ? 'hidden' : 'visible';
            });
          };
          render();
          gsap.timeline({
            scrollTrigger: {
              trigger: '#spinStage', start: 'top top', end: '+=180%', pin: true, scrub: 0.6, anticipatePin: 1,
              onUpdate: self => {
                st.s = -360 * self.progress;
                if (degEl) degEl.textContent = Math.round(360 * self.progress);
                render();
              },
            },
          })
            .fromTo(ringWrap, { scale: 0.8, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out' }, 0)
            .fromTo(st, { tilt: -22 }, { tilt: -6, duration: 0.3, onUpdate: render }, 0)
            .to(ringWrap, { scale: 1.08, duration: 0.75, ease: 'none' }, 0.25);

          // Drag to spin it by hand
          let startX = 0; let startD = 0; let dragging = false;
          ringWrap.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; startD = st.d; ringWrap.setPointerCapture(e.pointerId); });
          ringWrap.addEventListener('pointermove', e => {
            if (!dragging) return;
            gsap.to(st, { d: startD + (e.clientX - startX) * 0.35, duration: 0.8, ease: 'power3.out', onUpdate: render, overwrite: 'auto' });
          });
          const stop = () => { dragging = false; };
          ringWrap.addEventListener('pointerup', stop);
          ringWrap.addEventListener('pointercancel', stop);
        }

        /* ---------------- Section headings and blocks ---------------- */
        gsap.utils.toArray('.split:not(.hero h1)').forEach(el => {
          gsap.from(el.querySelectorAll('.w > span'), {
            yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.06,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
        gsap.utils.toArray('[data-rv]').forEach(el => {
          gsap.from(el, {
            y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', delay: parseFloat(el.dataset.rv) || 0,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });

        /* ---------------- Story ---------------- */
        gsap.utils.toArray('[data-fill]').forEach(el => {
          gsap.to(el.querySelectorAll('.wd'), {
            color: '#ffffff', stagger: 0.1, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
          });
        });
        // Collage: the photos start as a tight, tilted stack and deal out into place as you scroll,
        // each at its own depth, then keep drifting at different speeds.
        const cardsBox = document.getElementById('storyCards');
        if (cardsBox) {
          const cards = gsap.utils.toArray('[data-card]');
          const box = cardsBox.getBoundingClientRect();
          const deal = gsap.timeline({
            scrollTrigger: { trigger: cardsBox, start: 'top 92%', end: 'center 50%', scrub: 0.9 },
          });
          cards.forEach((card, i) => {
            const r = card.getBoundingClientRect();
            const dx = (box.left + box.width / 2) - (r.left + r.width / 2);
            const dy = (box.top + box.height / 2) - (r.top + r.height / 2);
            const z = parseFloat(card.dataset.card) || 0;
            deal.fromTo(card,
              { x: dx, y: dy, z: -200, rotation: [-14, 10, -6, 16][i % 4], rotationY: [-35, 30, -20, 40][i % 4], scale: 0.55, opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 18px)' },
              { x: 0, y: 0, z, rotation: [-2, 3, -1.5, 4][i % 4], rotationY: 0, scale: 1, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 18px)', ease: 'power3.out', duration: 1 },
              i * 0.12);
            deal.fromTo(card.querySelector('.fit') || card.querySelector('img'), { scale: 1.45 }, { scale: 1, ease: 'power2.out', duration: 1 }, i * 0.12);
            gsap.fromTo(card, { yPercent: 8 + i * 6 }, {
              yPercent: -(8 + i * 6), ease: 'none',
              scrollTrigger: { trigger: cardsBox, start: 'top bottom', end: 'bottom top', scrub: true },
            });
          });

          // Pointer tilts the whole collage in 3D; deeper cards appear to move more
          const rx = gsap.quickTo('#scStage', 'rotationX', { duration: 1, ease: 'power3' });
          const ry = gsap.quickTo('#scStage', 'rotationY', { duration: 1, ease: 'power3' });
          cardsBox.addEventListener('pointermove', e => {
            const b = cardsBox.getBoundingClientRect();
            ry(((e.clientX - b.left) / b.width - 0.5) * 16);
            rx(((e.clientY - b.top) / b.height - 0.5) * -12);
          });
          cardsBox.addEventListener('pointerleave', () => { rx(0); ry(0); });
        }

        /* ---------------- Services: stacked panels ---------------- */
        const panels = gsap.utils.toArray('.svc-panel');
        panels.forEach((panel, i) => {
          const media = panel.querySelector('[data-svc-media]');
          const img = media.querySelector('img');
          const copy = panel.querySelector('[data-svc-copy]');
          // Exact scroll tracking (no smoothing lag) so the photo always reaches the panel edges,
          // and it is locked to full size once the panel is in place.
          const enter = {
            trigger: panel, start: 'top bottom', end: 'top top', scrub: true,
            onLeave: () => gsap.set(media, { clipPath: 'none' }),
            onEnterBack: () => gsap.set(media, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }),
          };
          gsap.fromTo(media, { clipPath: 'inset(16% 12% 16% 12% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: enter });
          gsap.fromTo(img, { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: enter });
          gsap.fromTo(copy.querySelectorAll('.svc-top, h3, .svc-bottom p, .svc-side'), { y: 80, opacity: 0 }, {
            y: 0, opacity: 1, ease: 'power2.out', stagger: 0.08,
            scrollTrigger: { trigger: panel, start: 'top 55%', end: 'top 5%', scrub: 0.6 },
          });
          if (i > 0) {
            const prev = panels[i - 1];
            gsap.to(prev.querySelector('[data-svc-dim]'), { opacity: 0.65, ease: 'none', scrollTrigger: enter });
            gsap.to(prev.querySelector('[data-svc-media]'), { scale: 0.9, ease: 'none', scrollTrigger: enter });
          }
        });

        /* ---------------- Gallery: film strip that follows scroll speed ---------------- */
        const loops = [];
        gsap.utils.toArray('[data-strip]').forEach(row => {
          const inner = row.querySelector('.strip-in');
          const dir = parseFloat(row.dataset.strip) || -1;
          const tw = gsap.fromTo(inner, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 70, ease: 'none', repeat: -1 });
          const item = { tw, hover: false };
          row.addEventListener('mouseenter', () => { item.hover = true; gsap.to(tw, { timeScale: 0.12, duration: 0.8, overwrite: true }); });
          row.addEventListener('mouseleave', () => { item.hover = false; gsap.to(tw, { timeScale: 1, duration: 0.8, overwrite: true }); });
          loops.push(item);
        });
        gsap.utils.toArray('[data-marq]').forEach(el => {
          const secs = parseFloat(el.dataset.marq) || 30;
          const tw = gsap.fromTo(el, { xPercent: secs < 0 ? -50 : 0 }, { xPercent: secs < 0 ? 0 : -50, duration: Math.abs(secs), ease: 'none', repeat: -1 });
          const item = { tw, hover: false };
          // Reviews slow almost to a stop while hovered, so they can be read
          const row = el.closest('[data-rev-row]');
          if (row) {
            row.addEventListener('mouseenter', () => { item.hover = true; gsap.to(tw, { timeScale: 0.05, duration: 0.8, overwrite: true }); });
            row.addEventListener('mouseleave', () => { item.hover = false; gsap.to(tw, { timeScale: 1, duration: 0.8, overwrite: true }); });
          }
          loops.push(item);
        });
        const skew = gsap.quickTo('#strips', 'skewX', { duration: 0.6, ease: 'power3' });
        let settle;
        ScrollTrigger.create({
          start: 0, end: 'max',
          onUpdate: self => {
            const v = self.getVelocity();
            const boost = gsap.utils.clamp(-8, 8, v / 250);
            loops.forEach(l => { if (!l.hover) gsap.to(l.tw, { timeScale: 1 + boost, duration: 0.3, overwrite: true }); });
            skew(gsap.utils.clamp(-7, 7, v / -400));
            clearTimeout(settle);
            settle = setTimeout(() => {
              loops.forEach(l => { if (!l.hover) gsap.to(l.tw, { timeScale: 1, duration: 1.2, overwrite: true }); });
              skew(0);
            }, 120);
          },
        });
        gsap.fromTo('#strips', { y: 120, opacity: 0.2 }, {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: '#strips', start: 'top bottom', end: 'top 50%', scrub: 0.6 },
        });

        /* ---------------- Albums: pinned strips, each event expands in turn ---------------- */
        mm.add('(min-width: 961px)', () => {
          const box = document.getElementById('albStrips');
          if (!box) return undefined;
          const strips = gsap.utils.toArray('[data-alb]');
          const n = strips.length;
          box.classList.add('alb-live');
          const paint = p => {
            const pos = p * (n - 1);
            strips.forEach((el, i) => {
              const w = Math.max(0, 1 - Math.abs(pos - i));        // 1 when centred on this event
              el.style.flexGrow = String(1 + 5.5 * w);
              el.style.setProperty('--w', w.toFixed(3));
            });
          };
          paint(0);
          const st = ScrollTrigger.create({
            trigger: '#albumsPin', start: 'top 8%', end: () => `+=${(n - 1) * window.innerHeight * 0.55}`,
            pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: self => paint(self.progress),
          });
          return () => { st.kill(); box.classList.remove('alb-live'); strips.forEach(el => { el.style.flexGrow = ''; el.style.removeProperty('--w'); }); };
        });

        /* ---------------- Packages ---------------- */
        gsap.utils.toArray('[data-pkg]').forEach((card, i) => {
          gsap.fromTo(card, { y: 140, rotateX: 22, opacity: 0, transformOrigin: '50% 100%' }, {
            y: 0, rotateX: 0, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: '#pkgGrid', start: `top ${95 - i * 6}%`, end: `top ${50 - i * 6}%`, scrub: 0.6 },
          });
        });

        /* ---------------- Booking card ---------------- */
        gsap.fromTo('#bookCard', { scale: 0.88, y: 80, borderRadius: 56 }, {
          scale: 1, y: 0, borderRadius: 24, ease: 'none',
          scrollTrigger: { trigger: '#bookCard', start: 'top bottom', end: 'top 25%', scrub: 0.6 },
        });

        /* ---------------- FAQ rows slide in ---------------- */
        gsap.utils.toArray('.qa-i').forEach((row, i) => {
          gsap.from(row, { x: 60, opacity: 0, duration: 1.1, ease: 'expo.out', delay: i * 0.06, scrollTrigger: { trigger: '.qa', start: 'top 85%', once: true } });
        });

        /* ---------------- Closing photo opens to full screen ---------------- */
        const endTrig = { trigger: '#endStage', start: 'top bottom', end: 'top top', scrub: 0.6 };
        gsap.fromTo('#endMedia', { clipPath: 'inset(18% 22% 18% 22% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: endTrig });
        gsap.fromTo('#endMedia img', { scale: 1.4 }, { scale: 1, ease: 'none', scrollTrigger: endTrig });
        gsap.fromTo('.flogo .w', { yPercent: 70, opacity: 0.2 }, {
          yPercent: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: '.flogo', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        });

        // Footer wordmark: the foil catches the light once as it rises into view
        ScrollTrigger.create({
          trigger: '.flogo', start: 'top 85%', once: true,
          onEnter: () => document.getElementById('footWord')?.classList.add('shine'),
        });
        // The Euphoria package price does the same when the packages arrive
        gsap.utils.toArray('[data-foil-once]').forEach(el => {
          ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => el.classList.add('shine') });
        });

        /* ---------------- Nav ---------------- */
        ScrollTrigger.create({
          start: 40, end: 'max',
          onUpdate: self => {
            document.getElementById('nav')?.classList.toggle('solid', self.scroll() > 40);
            gsap.set('#navProg', { scaleX: self.progress });
          },
        });
        const label = document.getElementById('secLabel');
        gsap.utils.toArray('[data-label]').forEach(sec => {
          ScrollTrigger.create({
            trigger: sec, start: 'top 50%', end: 'bottom 50%',
            onToggle: self => { if (self.isActive && label) label.textContent = sec.dataset.label; },
          });
        });

        return () => mm.revert();
      });

      // Re-measure every scroll effect whenever the page height changes after start-up
      // (late fonts such as the ₦ glyphs, deferred photos, the booking calendar loading).
      // Without this, effects lower down, such as the closing photo, can fire too early.
      let settledHeight = 0; let timer = 0;
      const refresh = () => { ScrollTrigger.refresh(); settledHeight = document.documentElement.scrollHeight; };
      const onResize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (Math.abs(document.documentElement.scrollHeight - settledHeight) > 2) refresh();
        }, 250);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(document.body);
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh);
      document.fonts?.addEventListener?.('loadingdone', onResize);

      cleanups.push(() => {
        window.removeEventListener('load', refresh);
        ro.disconnect(); clearTimeout(timer);
        document.fonts?.removeEventListener?.('loadingdone', onResize);
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.__lenis;
        document.documentElement.classList.remove('motion');
      });
    })();

    return () => {
      cancelled = true;
      cleanups.forEach(fn => fn && fn());
    };
  }, []);

  return (
    <div className="cur" id="cur" aria-hidden="true">
      <div className="ring"><b id="curLbl">View</b></div>
      <div className="dot" />
    </div>
  );
}

function initCursor() {
  const root = document.documentElement;
  const cur = document.getElementById('cur');
  const lbl = document.getElementById('curLbl');
  if (!cur) return null;
  let x = -100, y = -100, rx = -100, ry = -100, raf;
  const ring = cur.querySelector('.ring');
  const dot = cur.querySelector('.dot');

  let idle = true;
  const move = e => { x = e.clientX; y = e.clientY; root.classList.add('cur-on'); if (idle) { idle = false; raf = requestAnimationFrame(loop); } };
  const leave = () => root.classList.remove('cur-on');
  const over = e => {
    const t = e.target.closest?.('[data-cur], a, button, select, [role="button"]');
    root.classList.remove('cur-hov', 'cur-lbl');
    if (!t) return;
    if (t.dataset.cur) { lbl.textContent = t.dataset.cur; root.classList.add('cur-lbl'); }
    else root.classList.add('cur-hov');
  };
  const loop = () => {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    // Sleep once the ring has caught up with the pointer; the next move wakes it
    if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) { idle = true; return; }
    raf = requestAnimationFrame(loop);
  };
  window.addEventListener('mousemove', move, { passive: true });
  document.addEventListener('mouseleave', leave);
  document.addEventListener('mouseover', over);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', move);
    document.removeEventListener('mouseleave', leave);
    document.removeEventListener('mouseover', over);
    root.classList.remove('cur-on', 'cur-hov', 'cur-lbl');
  };
}
