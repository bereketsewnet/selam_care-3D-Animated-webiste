import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SectionTransition: A pinned GSAP-driven "Medical Scanner Portal" transition.
 *
 * Timeline (scrubbed over 150vh of scroll):
 *   0%   → Section 1 visible normally
 *  15%   → Glitch/RGB-split appears on screen (chromatic aberration effect)
 *  25%   → Cyan scan beam sweeps top → bottom
 *  40%   → Section 1 clips away (clip-path circle collapses to 0)
 *  55%   → White flash burst peaks
 *  65%   → Section 2 is revealed via expanding clip-path circle from center
 *  80%   → Section 2 perspective tilt snaps flat
 * 100%   → Transition complete, normal scrolling resumes
 */
export function SectionTransition() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const scanRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);
    const glitchRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // --- SCAN LINE ---
            gsap.set(scanRef.current, { top: '-6px', opacity: 0 });

            // --- FLASH ---
            gsap.set(flashRef.current, { opacity: 0 });

            // --- GLITCH LAYERS ---
            gsap.set('.glitch-r', { xPercent: 0, opacity: 0 });
            gsap.set('.glitch-b', { xPercent: 0, opacity: 0 });

            // --- PARTICLES ---
            const particles = gsap.utils.toArray<HTMLElement>('.scan-particle');
            gsap.set(particles, { xPercent: 0, yPercent: 0, opacity: 0, scale: 0 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: 'top top',
                    end: '+=120%',
                    pin: true,
                    scrub: 2.5,
                    anticipatePin: 1,
                }
            });

            // Beat 1: glitch distortion starts
            tl.to('.glitch-r', { xPercent: -1.5, opacity: 0.6, ease: 'none', duration: 0.15 }, 0.05);
            tl.to('.glitch-b', { xPercent: 1.5, opacity: 0.5, ease: 'none', duration: 0.15 }, 0.05);

            // Beat 2: scan line sweeps
            tl.to(scanRef.current, { opacity: 1, ease: 'none', duration: 0.05 }, 0.1);
            tl.to(scanRef.current, {
                top: '105%',
                ease: 'power1.inOut',
                duration: 0.4,
            }, 0.15);

            // Beat 3: particles burst at scan midpoint
            tl.to(particles, {
                opacity: 1,
                scale: 1,
                duration: 0.05
            }, 0.3);
            tl.to(particles, {
                xPercent: (i) => (i % 2 === 0 ? -120 : 120) * (0.5 + Math.random()),
                yPercent: () => -60 - Math.random() * 120,
                opacity: 0,
                scale: 0.3,
                stagger: 0.01,
                ease: 'power2.out',
                duration: 0.4,
            }, 0.35);

            // Beat 4: clip the main content out (circle collapses)
            tl.to('.transition-clip-out', {
                clipPath: 'circle(0% at 50% 50%)',
                ease: 'power3.inOut',
                duration: 0.3,
            }, 0.4);

            // Beat 5: Flash burst
            tl.to(flashRef.current, {
                opacity: 1,
                ease: 'power2.out',
                duration: 0.1,
            }, 0.55);
            tl.to(flashRef.current, {
                opacity: 0,
                ease: 'power2.in',
                duration: 0.15,
            }, 0.65);

            // Beat 6: glitch fades 
            tl.to(['.glitch-r', '.glitch-b'], { opacity: 0, duration: 0.1 }, 0.6);

            // Beat 7: Section 2 clip-in (expands from center)
            tl.fromTo('.transition-clip-in', {
                clipPath: 'circle(0% at 50% 50%)',
                opacity: 1,
            }, {
                clipPath: 'circle(75% at 50% 50%)',
                ease: 'expo.out',
                duration: 0.5,
            }, 0.58);

            // Beat 8: perspective snap of section 2
            tl.fromTo('.transition-clip-in', {
                rotateX: '15deg',
                scale: 1.05,
            }, {
                rotateX: '0deg',
                scale: 1,
                ease: 'power3.out',
                duration: 0.35,
            }, 0.62);

            // Beat 9: fully open (remove clip-path)
            tl.to('.transition-clip-in', {
                clipPath: 'circle(150% at 50% 50%)',
                ease: 'none',
                duration: 0.2,
            }, 0.85);

        }, wrapRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapRef} className="relative w-full h-screen overflow-hidden bg-black">

            {/* Particle shards emitted at scan midpoint */}
            <div ref={particlesRef} className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                {[...Array(14)].map((_item, i) => (
                    <div
                        key={i}
                        className="scan-particle absolute rounded-sm"
                        style={{
                            left: `${5 + i * 6.5}%`,
                            top: '48%',
                            width: `${8 + (i % 3) * 12}px`,
                            height: `${2 + (i % 2) * 3}px`,
                            background: i % 3 === 0
                                ? 'rgba(0,220,255,0.9)'
                                : i % 3 === 1
                                    ? 'rgba(255,255,255,0.7)'
                                    : 'rgba(100,200,255,0.5)',
                            boxShadow: '0 0 8px rgba(0,220,255,0.8)',
                        }}
                    />
                ))}
            </div>

            {/* RGB split glitch layers (clone of visible content, color-shifted) */}
            <div ref={glitchRef} className="absolute inset-0 z-20 pointer-events-none mix-blend-screen">
                <div className="glitch-r absolute inset-0" style={{ background: 'rgba(255,20,20,0.15)', mixBlendMode: 'screen' }} />
                <div className="glitch-b absolute inset-0" style={{ background: 'rgba(20,20,255,0.15)', mixBlendMode: 'screen' }} />
            </div>

            {/* Cyan scan beam */}
            <div
                ref={scanRef}
                className="absolute left-0 w-full z-25 pointer-events-none"
                style={{
                    height: '6px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,220,255,0.1) 10%, rgba(0,220,255,0.9) 50%, rgba(0,220,255,0.1) 90%, transparent 100%)',
                    boxShadow: '0 0 30px 10px rgba(0,220,255,0.4), 0 0 80px 20px rgba(0,220,255,0.15)',
                    filter: 'blur(0.5px)',
                }}
            />

            {/* White flash burst */}
            <div
                ref={flashRef}
                className="absolute inset-0 z-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(200,240,255,0.8) 30%, rgba(0,220,255,0.2) 70%, transparent 100%)' }}
            />
        </div>
    );
}
