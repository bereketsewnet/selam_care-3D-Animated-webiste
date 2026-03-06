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
            // 1. Initial UI Entrance Animation (On Load)
            // The canvas image scale-in creates the high-end "static image" premium opening feel.
            gsap.fromTo(
                "#section-1 canvas:not(.starfield-canvas)", // Select the CanvasSequence specifically
                { scale: 1.1, opacity: 0, filter: 'blur(10px)' },
                { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 3, ease: 'expo.out' }
            );

            gsap.fromTo(
                scrollIndicatorRef.current,
                { opacity: 0, y: -20 },
                {
                    opacity: 1, y: 0, duration: 1.5, delay: 1.5, ease: 'power2.out',
                    onComplete: () => {
                        // Pulse the indicator slowly
                        gsap.to(scrollIndicatorRef.current, {
                            y: 10, repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut'
                        });
                    }
                }
            );

            // 2. Scroll-Triggered Text & Button Entrance
            // Text appears as user scrolls down and the sphere transforms into a cross.
            gsap.set(".genesis-text > *", { y: 40, opacity: 0, filter: 'blur(5px)' });
            gsap.set(".start-button", { opacity: 0, scale: 0.9, y: 20 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=150%', // Fast scroll completion
                    scrub: 2, // Keeps text follow buttery smooth but fast
                }
            });

            // Hide scroll indicator as soon as user starts scrolling
            tl.to(scrollIndicatorRef.current, {
                opacity: 0,
                y: -30,
                duration: 0.2,
            }, 0);

            // Fade out the starfield exactly when scrolling starts
            tl.to(".starfield-wrapper", {
                opacity: 0,
                duration: 0.5,
                ease: "power1.inOut"
            }, 0);

            // Start text animation early, spreading it out
            tl.to(".genesis-text > *", {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                stagger: 0.15,
                ease: "power3.out",
                duration: 1.0
            }, 0.1)
                .to(".start-button", {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "back.out(2)"
                }, "-=0.2");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full relative">
            <CanvasSequence
                folder="section 1"
                frameCount={120}
                id="section-1"
                end="+=150%" // The pin finishes quickly in about 1-1.5 scrolls
                scrub={2.5}  // Very high smoothing so one flick coasts to the end beautifully and smoothly
                sequenceEndRatio={1}
            >
                {/* Background Starfield */}
                <div className="absolute inset-0 z-[-1] starfield-wrapper pointer-events-none">
                    <Starfield className="starfield-canvas opacity-70" />
                </div>

                <div className="w-full h-full flex flex-col justify-center px-8 md:px-24 pt-20 relative">
                    {/* Subtle vignette behind text for legibility without a harsh box */}
                    <div className="absolute top-0 left-0 w-full md:w-[60%] h-full bg-[radial-gradient(ellipse_at_left_center,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-10" />

                    <div className="max-w-xl z-20 genesis-text pointer-events-none mt-10 lg:mt-0">

                        <p className="text-selam-cyan uppercase tracking-[0.2em] text-sm md:text-base font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                            Introducing the new standard in care.
                        </p>

                        <h1
                            className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tighter mb-8"
                            style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.7)) drop-shadow(0px 4px 10px rgba(0,0,0,0.9))" }}
                        >
                            Intelligent Care.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-selam-cyan to-white">Real-time Connection.</span>
                        </h1>

                        <p className="text-lg text-slate-100 md:text-xl leading-relaxed mb-12 max-w-lg font-medium drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
                            A completely reimagined ecosystem for doctors and patients. Experience seamless clinic management, integrated video conferencing, and instant chat—all in one beautiful platform.
                        </p>

                        <div className="pointer-events-auto start-button">
                            {/* This button places itself "over the top" of the 3D rendered button at the end */}
                            <button className="glass-button flex items-center gap-3 text-white group outline-none overflow-hidden relative shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-selam-cyan/30 bg-white/5 backdrop-blur-md border border-white/20">
                                <span className="relative z-10 font-bold tracking-wide">Get Started</span>
                                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />

                                {/* Subtle highlight effect on hover */}
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
