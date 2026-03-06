import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CanvasSequence } from '../CanvasSequence';
import { ArrowRight } from 'lucide-react';
import { Starfield } from '../Starfield';

export function Section1() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // --- 1. INITIAL UI STATE & ENTRANCE (ON LOAD) ---
            // Set initial states for dashboard layout (sphere on right, text on left)
            gsap.set("#section-1 canvas:not(.starfield-canvas)", {
                opacity: 0,
                filter: 'blur(10px)',
                xPercent: 25 // Shift globe to the right to create space for text
            });

            // Set text initial state (hidden)
            gsap.set(".genesis-text > *", { y: 20, opacity: 0, filter: 'blur(5px)' });
            gsap.set(".start-button", { opacity: 0, scale: 0.9, y: 10 });
            gsap.set(".cross-reveal-content > *", { opacity: 0 }); // Ensure hidden on load

            // Animate globe in — no scale change so it always fills 100% height
            gsap.to(
                "#section-1 canvas:not(.starfield-canvas)",
                { opacity: 1, filter: 'blur(0px)', duration: 2.5, ease: 'expo.out' }
            );

            // Animate text in IMMEDIATELY on load (dashboard feel)
            gsap.to(".genesis-text > *", {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                stagger: 0.1,
                ease: "power3.out",
                duration: 1.5,
                delay: 0.3
            });

            gsap.to(".start-button", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                delay: 0.8,
                ease: "back.out(2)"
            });

            gsap.fromTo(
                scrollIndicatorRef.current,
                { opacity: 0, y: -20 },
                {
                    opacity: 1, y: 0, duration: 1.5, delay: 1.5, ease: 'power2.out',
                    onComplete: () => {
                        gsap.to(scrollIndicatorRef.current, {
                            y: 10, repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut'
                        });
                    }
                }
            );

            // --- 2. SCROLL-TRIGGERED ANIMATION (UNEXPECTED REMOVAL & RE-CENTER) ---
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=150%',
                    scrub: 2,
                }
            });

            // Hide scroll indicator
            tl.to(scrollIndicatorRef.current, {
                opacity: 0,
                y: -30,
                duration: 0.2,
            }, 0);

            // Fade out the starfield
            tl.to(".starfield-wrapper", {
                opacity: 0,
                duration: 0.5,
                ease: "power1.inOut"
            }, 0);

            // Slide canvas to the LEFT — no scale so it fills 100% height top-to-bottom, mirroring the first frame
            tl.to("#section-1 canvas:not(.starfield-canvas)", {
                xPercent: -25, // Mirror the +25 from the start — same proportion, opposite side
                duration: 1,
                ease: "power2.inOut"
            }, 0);

            // Start text animation early, spreading it out
            tl.to(".genesis-text > *", {
                x: -50,
                opacity: 0,
                filter: 'blur(10px)',
                stagger: 0.05,
                duration: 0.6,
                ease: "power3.in"
            }, 0);

            tl.to(".start-button", {
                scale: 0.8,
                opacity: 0,
                duration: 0.4,
                ease: "back.in(2)"
            }, 0);

            // Animate END frame content IN
            tl.fromTo(".cross-reveal-content > *", {
                x: 50,
                opacity: 0,
                filter: 'blur(10px)'
            }, {
                x: 0,
                opacity: 1,
                filter: 'blur(0px)',
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out"
            }, 0.5); // Starts halfway through the scrub

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full relative overflow-hidden">
            <CanvasSequence
                folder="section 1"
                frameCount={120}
                id="section-1"
                end="+=150%"
                scrub={2.5}
                sequenceEndRatio={1}
            >
                {/* Background Starfield */}
                <div className="absolute inset-0 z-[-1] starfield-wrapper pointer-events-none">
                    <Starfield className="starfield-canvas opacity-70" />
                </div>

                {/* END FRAME UI - Initially hidden, fades in at the end of scroll on the right side */}
                <div className="absolute inset-0 flex flex-col justify-center items-end px-8 md:px-24 pt-20 pointer-events-none z-30">
                    <div className="cross-reveal-content text-left max-w-lg lg:max-w-xl w-full">
                        <p className="text-selam-cyan uppercase tracking-[0.2em] text-sm md:text-base font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                            The Next Evolution
                        </p>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-[1.1] tracking-tight">
                            The Center of<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-selam-cyan to-white">Modern Healthcare.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-200 mt-4 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] font-light leading-relaxed mb-10">
                            Unifying patient records, real-time telehealth, and intelligent diagnostics securely in one trusted nucleus. Discover the future of clinic operations and seamless care experiences.
                        </p>

                        {/* Adding subtle decorative element to end frame */}
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                            <span className="w-12 h-px bg-slate-500"></span>
                            Scroll to proceed
                        </div>
                    </div>
                </div>

                <div className="w-full h-full flex flex-col justify-center px-8 md:px-24 pt-20 relative z-20">

                    {/* Removed vignette bg, natural contrast utilized by globe shifting right */}
                    <div className="max-w-xl genesis-text pointer-events-none mt-10 lg:mt-0">

                        <p className="text-selam-cyan uppercase tracking-[0.2em] text-sm md:text-base font-bold mb-4">
                            Introducing the new standard in care.
                        </p>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tighter mb-8">
                            Intelligent Care.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-selam-cyan to-white">Real-time Connection.</span>
                        </h1>

                        <p className="text-lg text-slate-300 md:text-xl leading-relaxed mb-12 max-w-lg font-light">
                            A completely reimagined ecosystem for doctors and patients. Experience seamless clinic management, integrated video conferencing, and instant chat—all in one beautiful platform.
                        </p>

                        <div className="pointer-events-auto start-button">
                            <button className="glass-button flex items-center gap-3 text-white group outline-none overflow-hidden relative shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-selam-cyan/30">
                                <span className="relative z-10 font-bold tracking-wide">Get Started</span>
                                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />

                                <div className="absolute inset-0 bg-gradient-to-r from-selam-cyan/0 via-selam-cyan/40 to-selam-cyan/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Scroll Indicator */}
                <div
                    ref={scrollIndicatorRef}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-20 mix-blend-screen"
                >
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" />
                    <span className="text-sm uppercase tracking-[0.4em] font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                        Scroll to explore
                    </span>
                </div>
            </CanvasSequence>
        </section>
    );
}
