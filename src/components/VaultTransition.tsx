import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * VaultTransition — 3-Phase 3D Glass Vault Doors.
 *
 * Phase 1 (0→40%): Left door slides in from left, right door from right → meet at center.
 * Phase 2 (40→55%): Doors closed. Laser drops down & flares at the seam.
 * Phase 3 (55→100%): Doors swing backward in 3D (rotateY) to reveal Section 4.
 *
 * Fully bidirectional — each phase reverses perfectly when scrolling back up.
 */
export function VaultTransition() {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        // Hidden by default
        overlay.style.visibility = 'hidden';

        const laserEl   = overlay.querySelector('.vault-laser')     as HTMLElement;
        const leftDoor  = overlay.querySelector('.vault-door-left') as HTMLElement;
        const rightDoor = overlay.querySelector('.vault-door-right') as HTMLElement;

        if (!laserEl || !leftDoor || !rightDoor) return;

        /* ----- Hard reset to start-of-phase-1 position ----- */
        gsap.set(laserEl,   { height: '0%', opacity: 0, width: '2px' });
        // Doors begin fully off-screen; transform-origin for 3D swing phase is set here
        gsap.set(leftDoor,  { xPercent: -100, rotationY: 0, scale: 1, transformOrigin: 'left center' });
        gsap.set(rightDoor, { xPercent:  100, rotationY: 0, scale: 1, transformOrigin: 'right center' });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();

            const section3ST = ScrollTrigger.getAll().find(st =>
                st.vars?.trigger && (st.vars.trigger as Element).id === 'section-3'
            );

            if (!section3ST) {
                console.warn('[VaultTransition] Could not find Section 3 ScrollTrigger.');
                return;
            }

            const start  = section3ST.end;
            const budget = window.innerHeight * 3; // 3 viewport-heights for 3-phase

            const st = ScrollTrigger.create({
                start,
                end: start + budget,
                scrub: 1.2,
                onUpdate: (self) => {
                    const p = self.progress;

                    /* --- Visibility gate (strict bounds = bidirectional safety) --- */
                    if (p > 0.005 && p < 0.995) {
                        overlay.style.visibility = 'visible';
                    } else {
                        overlay.style.visibility = 'hidden';
                        return;
                    }

                    /* ═══ PHASE 1 (0 → 40%): Doors slide in from sides ═══════════ */
                    if (p <= 0.40) {
                        const t = p / 0.40; // normalised 0→1
                        // Smooth ease-in-out deceleration as they meet
                        const eased = t < 0.5
                            ? 2 * t * t
                            : 1 - Math.pow(-2 * t + 2, 2) / 2;

                        const xL = -100 + eased * 100; // -100% → 0%
                        const xR =  100 - eased * 100; //  100% → 0%

                        gsap.set(leftDoor,  { xPercent: xL, rotationY: 0, scale: 1 });
                        gsap.set(rightDoor, { xPercent: xR, rotationY: 0, scale: 1 });
                        gsap.set(laserEl,   { height: '0%', opacity: 0, width: '2px',
                            boxShadow: '0 0 30px 5px rgba(6,182,212,0.8)' });

                    /* ═══ PHASE 2 (40% → 55%): Laser drops & flares ══════════════ */
                    } else if (p <= 0.55) {
                        const t = (p - 0.40) / 0.15; // 0→1

                        gsap.set(leftDoor,  { xPercent: 0, rotationY: 0, scale: 1 });
                        gsap.set(rightDoor, { xPercent: 0, rotationY: 0, scale: 1 });

                        const dropT  = Math.min(1, t * 2);      // 0→1 in first 50% of phase
                        const flareT = Math.max(0, t * 2 - 1);  // 0→1 in second 50% of phase
                        gsap.set(laserEl, {
                            height:    `${dropT * 100}%`,
                            opacity:   dropT,
                            width:     `${2 + flareT * 3}px`,
                            boxShadow: `0 0 ${30 + flareT * 100}px ${5 + flareT * 30}px rgba(6,182,212,${0.6 + flareT * 0.4})`
                        });

                    /* ═══ PHASE 3 (55% → 100%): Doors swing backward in 3D ═══════ */
                    } else {
                        const t = (p - 0.55) / 0.45; // 0→1
                        const angle = t * 95;          // 0° → 95°
                        const sc    = 1 - t * 0.1;    // 1 → 0.9 (subtle depth)
                        const laserOpacity = Math.max(0, 1 - t * 3); // fades quickly

                        gsap.set(leftDoor,  { xPercent: 0, rotationY: -angle, scale: sc });
                        gsap.set(rightDoor, { xPercent: 0, rotationY:  angle, scale: sc });
                        gsap.set(laserEl,   { opacity: laserOpacity });
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
            className="fixed inset-0 z-[150] pointer-events-none flex"
            style={{ perspective: '2500px', visibility: 'hidden' }}
        >
            {/* Left Door */}
            <div
                className="vault-door-left relative w-1/2 h-full flex items-center justify-end overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #030c18 0%, #061828 100%)',
                    transformOrigin: 'left center',
                    borderRight: '1px solid rgba(6,182,212,0.3)',
                    boxShadow: 'inset -20px 0 60px rgba(6,182,212,0.05)',
                }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-selam-cyan to-transparent opacity-60" />
            </div>

            {/* Right Door */}
            <div
                className="vault-door-right relative w-1/2 h-full flex items-center justify-start overflow-hidden"
                style={{
                    background: 'linear-gradient(225deg, #030c18 0%, #061828 100%)',
                    transformOrigin: 'right center',
                    borderLeft: '1px solid rgba(6,182,212,0.3)',
                    boxShadow: 'inset 20px 0 60px rgba(6,182,212,0.05)',
                }}
            >
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-selam-cyan to-transparent opacity-60" />
            </div>

            {/* Central cutting laser */}
            <div
                className="vault-laser absolute left-1/2 top-0 -translate-x-1/2 w-[2px] bg-selam-cyan z-10"
                style={{ boxShadow: '0 0 30px 5px rgba(6,182,212,0.8)' }}
            />
        </div>
    );
}
