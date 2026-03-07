import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * PageTurnSlide — right-to-left full-screen page slide.
 *
 * Key insight: Instead of using a DOM trigger element (which fights with
 * Section 2's GSAP pin-spacer), this component uses ScrollTrigger with a
 * specific pixel range calculated AFTER all other ScrollTriggers have been set up.
 *
 * It waits for GSAP's refreshAll() then calculates where Section 2's pin ends
 * and uses that as the start position for the slide animation.
 */
export function PageTurnSlide() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const overlay = overlayRef.current;
        const stage = stageRef.current;
        const shadow = shadowRef.current;

        if (!overlay || !stage || !shadow) return;

        // Wait for all other ScrollTriggers (Section 2's pin) to initialize first
        const timer = setTimeout(() => {
            // Refresh all triggers so we get accurate positions
            ScrollTrigger.refresh();

            // Find Section 2's ScrollTrigger to know where it ends
            const section2ST = ScrollTrigger.getAll().find(st =>
                st.vars?.trigger && (st.vars.trigger as Element).id === 'section-2'
            );

            if (!section2ST) {
                console.warn('[PageTurnSlide] Could not find Section 2 ScrollTrigger');
                return;
            }

            // Section 2 ends at this scroll position
            const s2End = section2ST.end;
            // Our transition occupies 3 viewport heights after Section 2
            const transitionLength = window.innerHeight * 3;

            // Reset positions
            gsap.set(stage, { x: 0 });
            gsap.set(shadow, { x: '50vw', opacity: 0 });
            gsap.set(overlay, { visibility: 'hidden', opacity: 0 });

            const st = ScrollTrigger.create({
                start: s2End,
                end: s2End + transitionLength,
                scrub: 1.5,
                onUpdate: (self) => {
                    const p = self.progress;

                    // Only show overlay between 2% and 98% progress
                    // This hides the stage before the slide starts (prevents right-edge sliver)
                    if (p > 0.02 && p < 0.98) {
                        gsap.set(overlay, { visibility: 'visible', opacity: 1 });
                    } else {
                        gsap.set(overlay, { visibility: 'hidden', opacity: 0 });
                        if (p <= 0.02) {
                            // Reset stage to off-screen left so right half never peeks
                            gsap.set(stage, { x: 0 });
                        }
                    }

                    // Slide: map progress 0→1 to x: 0 → -100vw
                    const slideProgress = Math.max(0, Math.min(1, (p - 0.05) / 0.85));
                    const xVw = -slideProgress * 100;
                    gsap.set(stage, { x: `${xVw}vw` });

                    // Shadow sweeps across centre
                    const shadowOpacity = slideProgress < 0.5
                        ? slideProgress * 1.7
                        : (1 - slideProgress) * 1.7;
                    const shadowX = 50 + slideProgress * -110;
                    gsap.set(shadow, { x: `${shadowX}vw`, opacity: Math.min(0.85, shadowOpacity) });
                },
            });

            return () => st.kill();
        }, 300); // wait 300ms for all other ScrollTriggers to mount

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        // No trigger div needed — we use absolute scroll positions
        <>
            {/* Fixed overlay — pointer-events:none always so it never blocks site */}
            <div
                ref={overlayRef}
                className="fixed inset-0"
                style={{
                    zIndex: 150,
                    visibility: 'hidden',
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            >
                {/* Stage: 200vw wide flex row, slides left */}
                <div
                    ref={stageRef}
                    className="flex will-change-transform"
                    style={{ width: '200vw', height: '100%' }}
                >
                    {/* LEFT: Section 2's last frame */}
                    <div className="flex-shrink-0 overflow-hidden" style={{ width: '100vw', height: '100%' }}>
                        <img
                            src="/section 2/ezgif-frame-120.webp"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* RIGHT: Section 3's first frame */}
                    <div className="flex-shrink-0 overflow-hidden" style={{ width: '100vw', height: '100%' }}>
                        <img
                            src="/section 3/ezgif-frame-001.webp"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Book-spine shadow sweeps across during the slide */}
                <div
                    ref={shadowRef}
                    className="absolute top-0 pointer-events-none"
                    style={{
                        left: 0,
                        width: '120px',
                        height: '100%',
                        background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.65) 55%, transparent 100%)',
                        zIndex: 50,
                    }}
                />
            </div>
        </>
    );
}
