import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CanvasSequence } from '../CanvasSequence';
import { ArrowRight, Users } from 'lucide-react';
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
            gsap.set(".stats-widget", { y: 30, opacity: 0, scale: 0.95 }); // Floating stats widget initial state

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

            gsap.to(".stats-widget", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                delay: 1.2,
                ease: "back.out(1.5)",
                onComplete: () => {
                    // Float up and down forever after appearing
                    gsap.to(".stats-widget", {
                        y: -12,
                        duration: 2.2,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                    });
                }
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

            tl.to(".stats-widget", {
                opacity: 0,
                y: 20,
                scale: 0.9,
                duration: 0.4,
                ease: "power2.in"
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
                            <button className="cta-button group">
                                {/* Orbiting glow dot */}
                                <span className="orbit-dot" />

                                {/* Button label */}
                                <span className="relative z-10 font-bold tracking-widest text-sm uppercase">
                                    Get Started
                                </span>

                                {/* Arrow with animated slide-right on hover */}
                                <span className="relative z-10 flex items-center overflow-hidden w-5">
                                    <ArrowRight
                                        size={18}
                                        className="shrink-0 transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-0"
                                    />
                                    <ArrowRight
                                        size={18}
                                        className="shrink-0 absolute -left-5 transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-100 opacity-0 text-selam-cyan"
                                    />
                                </span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* GLOBE AREA MINI BADGE — top of globe, where green box was drawn */}
                <div className="stats-widget absolute top-[18%] right-[28%] z-30 pointer-events-none">
                    <div className="stats-card-border">
                        <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)', borderRadius: 'calc(1rem - 1px)' }}>
                            <div className="relative w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                                <span className="text-selam-cyan font-bold text-xs">+</span>
                                <div className="icon-pulse absolute inset-0 rounded-full" />
                            </div>
                            <div>
                                <div className="text-white text-[10px] font-bold leading-tight">Real-time Care</div>
                                <div className="text-slate-400 text-[9px] uppercase tracking-widest">SelamCare Platform</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FLOATING STATS WIDGET — bottom-right, under globe — premium animated card */}
                <div className="stats-widget absolute bottom-16 right-10 z-30 pointer-events-none w-52 lg:w-56">
                    <div className="stats-card-border">
                        <div className="stats-card-inner">
                            {/* Snow particles */}
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className="snow-particle"
                                    style={{
                                        left: `${15 + i * 18}%`,
                                        bottom: '10%',
                                        animationDuration: `${2.5 + i * 0.6}s`,
                                        animationDelay: `${i * 0.4}s`,
                                        width: i % 2 === 0 ? '3px' : '2px',
                                        height: i % 2 === 0 ? '3px' : '2px',
                                    }}
                                />
                            ))}

                            {/* Icon bubble — white/transparent, no solid blue */}
                            <div className="absolute -top-5 left-4 w-11 h-11 shrink-0">
                                <div className="relative w-full h-full rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                    <Users size={18} className="text-white" />
                                    {/* Pulsing ring */}
                                    <div className="icon-pulse absolute inset-0 rounded-full" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="text-left">
                                <div className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-1 leading-none">
                                    10k<span className="text-selam-cyan">+</span>
                                </div>
                                <div className="text-[10px] lg:text-xs font-semibold text-slate-300 uppercase tracking-widest leading-relaxed">
                                    Active Patients<br />&amp; Doctors
                                </div>
                            </div>
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
