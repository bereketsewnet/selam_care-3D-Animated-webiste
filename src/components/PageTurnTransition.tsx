import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * PageTurnTransition
 * ──────────────────
 * Places Section 2 and Section 3 side-by-side inside a 200vw horizontal
 * container that is pinned for one viewport height while the whole stage
 * slides left, giving the "book page turn" effect.
 *
 * When the user finishes scrolling Section 2 and keeps scrolling, the
 * entire viewport translates from x:0 → x:-100vw, revealing Section 3
 * exactly like flipping a page from right to left.
 *
 * The scroll budget for the slide is 150% of the viewport height, which
 * keeps it feeling snappy but not too abrupt.
 */

interface Props {
    section2: React.ReactNode;
    section3: React.ReactNode;
}

export function PageTurnTransition({ section2, section3 }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const section2Ref = useRef<HTMLDivElement>(null);
    const section3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const stage = stageRef.current;

        // ── SHADOW PANEL THAT SWEEPS ACROSS ─────────────────────────
        // A dark vertical strip grows from the right edge of Section 2
        // toward the left, simulating the fold/shadow of a turning page.
        const shadowEl = document.createElement('div');
        shadowEl.style.cssText = `
            position: absolute;
            top: 0; right: 0;
            width: 0; height: 100%;
            background: linear-gradient(to left,
                rgba(0,0,0,0.0) 0%,
                rgba(0,0,0,0.6) 40%,
                rgba(0,0,0,0.0) 100%
            );
            z-index: 999;
            pointer-events: none;
        `;
        section2Ref.current?.appendChild(shadowEl);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: 'top top',
                end: '+=150%',
                scrub: 1.5,
                pin: true,
                anticipatePin: 1,
            }
        });

        // 1. Shadow wipes from width:0 → width:60% → back to 0 (fold effect)
        tl.fromTo(shadowEl,
            { width: '0%', left: '100%', right: 'auto' },
            { width: '80%', left: '20%', ease: 'power2.inOut', duration: 0.5 },
            0
        );
        tl.to(shadowEl,
            { width: '0%', left: '-20%', ease: 'power2.inOut', duration: 0.5 },
            0.5
        );

        // 2. Stage slides left: shows Section 3
        tl.to(stage, {
            x: '-100vw',
            ease: 'power2.inOut',
            duration: 1.0,
        }, 0);

        return () => {
            tl.scrollTrigger?.kill();
            shadowEl.remove();
        };
    }, []);

    return (
        /**
         * The outer wrapper is what ScrollTrigger pins.
         * It takes up 100vh in the normal flow so it can be pinned.
         * The EXTRA scroll space (150%) is added via padding-bottom on the
         * non-sticky parent in App.tsx — we add pinSpacing automatically
         * via GSAP's pin: true option.
         */
        <div ref={wrapperRef} className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
            {/* Stage is 200vw wide — Section2 | Section3 side by side */}
            <div
                ref={stageRef}
                className="flex will-change-transform"
                style={{ width: '200vw', height: '100%' }}
            >
                {/* Left page = Section 2 */}
                <div
                    ref={section2Ref}
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: '100vw', height: '100%' }}
                >
                    {section2}
                </div>

                {/* Right page = Section 3 */}
                <div
                    ref={section3Ref}
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: '100vw', height: '100%' }}
                >
                    {section3}
                </div>
            </div>
        </div>
    );
}
