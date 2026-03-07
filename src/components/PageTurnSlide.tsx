import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * PageTurnSlide
 * ─────────────
 * A FIXED overlay that appears ON TOP of the screen and slides left.
 * 
 * There are 3 phases driven by a single pinned scroll:
 *   0% → 10%:  Overlay fades in (Section 2's last frame appears as a fixed layer)
 *  10% → 90%:  Stage slides x:0 → x:-100vw (the actual page-turn)
 *  90% → 100%: Overlay fades out (reveals Section 3 underneath)
 *
 * Because this is position:fixed, it never causes vertical scrolling of images.
 */
export function PageTurnSlide() {
    const triggerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                start: 'top top',
                end: '+=150%',
                scrub: 1.2,
                pin: true,
            }
        });

        // Phase 1: Overlay becomes visible (covers the screen)
        tl.set(overlayRef.current, { visibility: 'visible' }, 0);
        tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'power1.in' }, 0);

        // Phase 2: Slide left (the actual book page-turn)
        tl.to(stageRef.current, {
            x: '-100vw',
            ease: 'power2.inOut',
            duration: 0.8,
        }, 0.10);

        // Shadow sweeps across during the slide
        tl.fromTo(shadowRef.current,
            { x: '50vw', opacity: 1 },
            { x: '-100vw', opacity: 0, ease: 'power1.inOut', duration: 0.8 },
            0.10
        );

        // Phase 3: Overlay fades out (reveals Section 3 that's now scrolled underneath)
        tl.to(overlayRef.current, {
            opacity: 0,
            duration: 0.08,
            ease: 'power1.out',
        }, 0.92);
        tl.set(overlayRef.current, { visibility: 'hidden' }, 1.0);

        return () => {
            tl.scrollTrigger?.kill();
        };
    }, []);

    return (
        <>
            {/* Scroll budget trigger — this tiny div gets pinned */}
            <div ref={triggerRef} style={{ height: '10px', position: 'relative' }} />

            {/* Fixed overlay — sits ON TOP of everything, never scrolls vertically */}
            <div
                ref={overlayRef}
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 150,
                    visibility: 'hidden',
                    willChange: 'opacity',
                }}
            >
                {/* Stage: 200vw wide, slides left */}
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

                {/* Book-spine shadow */}
                <div
                    ref={shadowRef}
                    className="absolute top-0 pointer-events-none"
                    style={{
                        left: 0,
                        width: '150px',
                        height: '100%',
                        background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                        zIndex: 50,
                    }}
                />
            </div>
        </>
    );
}
