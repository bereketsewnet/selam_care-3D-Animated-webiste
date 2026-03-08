import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * VaultTransition — 3D Glass Vault Doors.
 *
 * Exactly mirrors IrisTransition's architecture:
 * - Fixed overlay, visibility: hidden initially
 * - 350ms timer to read Section 3's end position
 * - ScrollTrigger.create with onUpdate drives visibility + animation progress
 * - Bidirectional: works correctly in both forward and reverse scroll
 *
 * Visual flow (0→100% progress):
 *   0→25%  : Laser drops down the center
 *   25→35% : Laser flares (cracks the glass)
 *   35→100%: Left door swings left in 3D, right door swings right in 3D
 *            Laser fades out as doors open
 */
export function VaultTransition() {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        // Hide initially
        overlay.style.visibility = 'hidden';

        const laserEl = overlay.querySelector('.vault-laser') as HTMLElement;
        const leftDoor = overlay.querySelector('.vault-door-left') as HTMLElement;
        const rightDoor = overlay.querySelector('.vault-door-right') as HTMLElement;

        if (!laserEl || !leftDoor || !rightDoor) return;

        // Hard reset door states
        gsap.set(laserEl, { height: '0%', opacity: 0, width: '2px', boxShadow: '0 0 30px 5px rgba(6,182,212,0.8)' });
        gsap.set(leftDoor,  { rotationY: 0, scale: 1, transformOrigin: 'left center' });
        gsap.set(rightDoor, { rotationY: 0, scale: 1, transformOrigin: 'right center' });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();

            // Section 3's CanvasSequence creates the ScrollTrigger with trigger id = 'section-3'
            // IrisTransition finds section2 the same way, using vars.trigger.id
            const section3ST = ScrollTrigger.getAll().find(st =>
                st.vars?.trigger && (st.vars.trigger as Element).id === 'section-3'
            );

            if (!section3ST) {
                console.warn('[VaultTransition] Could not locate Section 3 ScrollTrigger.');
                return;
            }

            const start  = section3ST.end;
            const budget = window.innerHeight * 2.5; // 2.5 viewport heights

            const st = ScrollTrigger.create({
                start,
                end: start + budget,
                scrub: 1.2,
                onUpdate: (self) => {
                    const p = self.progress;

                    // Show/hide with strict bounds — this is the key bidirectional fix
                    if (p > 0.005 && p < 0.995) {
                        overlay.style.visibility = 'visible';
                    } else {
                        overlay.style.visibility = 'hidden';
                        return; // Don't animate when invisible
                    }

                    // --- Phase 1: Laser drops (0 → 25%) ---
                    if (p <= 0.25) {
                        const t = p / 0.25; // 0→1
                        gsap.set(laserEl, {
                            height: `${t * 100}%`,
                            opacity: t,
                            width: '2px',
                            boxShadow: `0 0 ${30 + t * 20}px ${5 + t * 5}px rgba(6,182,212,${0.5 + t * 0.4})`
                        });
                        gsap.set(leftDoor,  { rotationY: 0, scale: 1 });
                        gsap.set(rightDoor, { rotationY: 0, scale: 1 });

                    // --- Phase 2: Laser flares (25% → 35%) ---
                    } else if (p <= 0.35) {
                        const t = (p - 0.25) / 0.10; // 0→1
                        gsap.set(laserEl, {
                            height: '100%',
                            opacity: 1,
                            width:  `${2 + t * 2}px`,
                            boxShadow: `0 0 ${50 + t * 80}px ${10 + t * 25}px rgba(6,182,212,${0.8 + t * 0.2})`
                        });
                        gsap.set(leftDoor,  { rotationY: 0, scale: 1 });
                        gsap.set(rightDoor, { rotationY: 0, scale: 1 });

                    // --- Phase 3: Doors swing open (35% → 100%) ---
                    } else {
                        const t = (p - 0.35) / 0.65; // 0→1
                        const angle = t * 95; // 0 → 95 degrees
                        const sc    = 1 - t * 0.1; // 1 → 0.9
                        const laserOpacity = Math.max(0, 1 - t * 2); // Fades out fast

                        gsap.set(laserEl, { opacity: laserOpacity });
                        gsap.set(leftDoor,  { rotationY: -angle, scale: sc });
                        gsap.set(rightDoor, { rotationY:  angle, scale: sc });
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
                {/* Edge glow strip */}
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
                {/* Edge glow strip */}
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
