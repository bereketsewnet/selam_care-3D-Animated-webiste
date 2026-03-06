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
            gsap.set(".get-started-overlay", { autoAlpha: 0 }); // Hide clickable overlay on load

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

            // (Starfield stays visible throughout)

            // Keep canvas centered on the end frame — no shift so nothing gets clipped
            tl.to("#section-1 canvas:not(.starfield-canvas)", {
                xPercent: -20,  // Center — text on the right floats over the dark portion naturally
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

            // Enable the baked Get Started button link
            tl.set(".get-started-overlay", { autoAlpha: 1 }, 0.8); // Enable clicking near the end

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

                {/* INVISIBLE CLICKABLE OVERLAY FOR "GET STARTED" BAKED BUTTON */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                    <a
                        href="https://selamcare.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="get-started-overlay pointer-events-auto w-[65vw] max-w-[450px] h-[15vh] max-h-[120px] rounded-[3rem] cursor-pointer"
                        title="Get Started on SelamCare"
                        aria-label="Get Started with SelamCare"
                    />
                </div>

                {/* END FRAME UI — full-height right column, pure typographic layout, no card */}
                {/* Right-edge dark gradient for text readability — mirrors the natural dark space on the left in frame 1 */}
                <div className="absolute inset-0 pointer-events-none z-30">
                    {/* Subtle dark gradient on the right 45% to create a natural reading zone */}
                    <div className="absolute top-0 right-0 w-[30%] h-full bg-gradient-to-l from-black/70 via-black/30 to-transparent" />
                </div>

                <div className="absolute top-0 right-0 w-[30%] h-full flex flex-col justify-center items-center px-6 lg:px-12 pointer-events-none z-30">
                    <div className="cross-reveal-content text-left w-full max-w-sm xl:max-w-md space-y-6">
                        {/* Kicker */}
                        <p className="text-selam-cyan uppercase tracking-[0.25em] text-xs font-bold">
                            The Next Evolution in Care
                        </p>

                        {/* Main headline — large, bold, edge-to-edge of the right column */}
                        <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tighter mb-8">
                            The Center<br />
                            of Modern<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-selam-cyan to-white">Healthcare.</span>
                        </h2>

                        {/* Thin horizontal rule — editorial style separator */}
                        <div className="w-12 h-px bg-selam-cyan/60" />

                        {/* Body text */}
                        <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed max-w-xs">
                            Unifying patient records, real-time telehealth, and intelligent diagnostics — all in one trusted, beautiful platform.
                        </p>

                        {/* Bottom label */}
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 uppercase tracking-widest pt-2">
                            <span className="w-6 h-px bg-slate-600" />
                            Scroll to continue
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
