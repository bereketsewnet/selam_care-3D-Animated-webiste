import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * IrisTransition — Cinematic camera-shutter iris.
 *
 * The overlay is full-screen dark ALWAYS. A CSS mask with a radial gradient
 * cuts a transparent "hole" at the center — the hole SHRINKS (iris closes)
 * then GROWS (iris opens), revealing Section 3 beneath.
 *
 * mask: radial-gradient(circle R at center, transparent 0%, black R)
 * When R = large → big transparent hole (screen is visible)
 * When R = 0     → no hole (screen is fully covered = iris fully closed)
 */
export function IrisTransition() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const crossRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const overlay = overlayRef.current;
        const ring = ringRef.current;
        const cross = crossRef.current;

        if (!overlay || !ring || !cross) return;

        // Start:  iris fully OPEN  (huge transparent hole = content is visible)
        const maxRadius = 200; // vmin — large enough to cover any screen ratio
        const setMask = (r: number) => {
            // r = 0: fully closed (solid dark).  r = maxRadius: fully open (transparent hole)
            const edge = r + 2; // tiny hard edge for clean ring
            overlay.style.webkitMaskImage =
                `radial-gradient(circle ${r}vmin at 50% 50%, transparent 0%, transparent ${r}vmin, black ${edge}vmin, black 100%)`;
            overlay.style.maskImage =
                `radial-gradient(circle ${r}vmin at 50% 50%, transparent 0%, transparent ${r}vmin, black ${edge}vmin, black 100%)`;
        };

        // Initially fully open (visible) but hidden from sight
        setMask(maxRadius);
        gsap.set(overlay, { visibility: 'hidden' });
        gsap.set(ring, { opacity: 0, scale: 1 });
        gsap.set(cross, { opacity: 0, scale: 0.5 });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();

            const section2ST = ScrollTrigger.getAll().find(st =>
                st.vars?.trigger && (st.vars.trigger as Element).id === 'section-2'
            );

            if (!section2ST) {
                console.warn('[IrisTransition] Could not locate Section 2 ScrollTrigger.');
                return;
            }

            const start = section2ST.end;
            const budget = window.innerHeight * 2; // 2 viewport heights (faster)

            const st = ScrollTrigger.create({
                start,
                end: start + budget,
                scrub: 1.2,
                onUpdate: (self) => {
                    const p = self.progress;

                    if (p > 0.01 && p < 0.99) {
                        gsap.set(overlay, { visibility: 'visible' });
                    } else {
                        gsap.set(overlay, { visibility: 'hidden' });
                    }

                    // ── Phase 1: iris CLOSES (0→45%) ─────────────────────────
                    if (p <= 0.45) {
                        const t = p / 0.45;                      // 0→1
                        const r = maxRadius * (1 - t);           // maxRadius → 0
                        setMask(r);
                        gsap.set(ring, { opacity: t * 0.7, scale: 1 + t * 0.3 });
                        gsap.set(cross, { opacity: 0 });

                        // ── Phase 2: hold black center (45→55%) ──────────────────
                    } else if (p <= 0.55) {
                        const t = (p - 0.45) / 0.10;            // 0→1
                        setMask(0);                              // fully closed
                        const peak = Math.sin(t * Math.PI);     // 0→1→0
                        gsap.set(ring, { opacity: 0.8 + peak * 0.2, scale: 1.3 + peak * 0.4 });
                        gsap.set(cross, { opacity: peak, scale: 0.5 + peak * 0.5 });

                        // ── Phase 3: iris OPENS (55→100%) ────────────────────────
                    } else {
                        const t = (p - 0.55) / 0.45;            // 0→1
                        const r = maxRadius * t;                 // 0 → maxRadius
                        setMask(r);
                        gsap.set(ring, { opacity: (1 - t) * 0.7, scale: 1.3 - t * 0.3 });
                        gsap.set(cross, { opacity: 0 });
                    }
                },
            });

            return () => st.kill();
        }, 350);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0"
            style={{
                zIndex: 200,
                pointerEvents: 'none',
                visibility: 'hidden',
                background: 'radial-gradient(circle at 50% 50%, #061828 0%, #020810 80%)',
            }}
        >
            {/* Cyan glow ring at the iris edge */}
            <div
                ref={ringRef}
                style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    background: 'transparent',
                    boxShadow: [
                        '0 0 0 2px rgba(6,182,212,1)',
                        '0 0 60px 30px rgba(6,182,212,0.6)',
                        '0 0 180px 90px rgba(6,182,212,0.25)',
                    ].join(', '),
                    opacity: 0,
                }}
            />

            {/* Brand cross */}
            <div
                ref={crossRef}
                style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0,
                }}
            >
                {/* Vertical bar */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '8px', height: '56px',
                    background: 'linear-gradient(to bottom, transparent, rgba(6,182,212,1) 50%, transparent)',
                    borderRadius: '4px',
                    boxShadow: '0 0 20px 4px rgba(6,182,212,0.8)',
                }} />
                {/* Horizontal bar */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '56px', height: '8px',
                    background: 'linear-gradient(to right, transparent, rgba(6,182,212,1) 50%, transparent)',
                    borderRadius: '4px',
                    boxShadow: '0 0 20px 4px rgba(6,182,212,0.8)',
                }} />
            </div>
        </div>
    );
}
