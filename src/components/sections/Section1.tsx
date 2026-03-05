import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CanvasSequence } from '../CanvasSequence';
import { ArrowRight } from 'lucide-react';

export function Section1() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Fade in animations trigger organically based on the scroll progress wrapper
            // since the section itself is pinned.

            // Initially hide elements
            gsap.set(".genesis-text > *", { y: +20, opacity: 0 });
            gsap.set(".start-button", { opacity: 0, scale: 0.9 });

            // Setup text appearance timeline (tied to scroll of this section)
            // The canvas is pinned for +400%, so we trigger inside that viewport scroll
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=200%',
                    scrub: 1,
                }
            });

            // Animate text elements sequentially over the first part of scroll
            tl.to(".genesis-text > *", {
                y: 0,
                opacity: 1,
                stagger: 0.2,
                duration: 1,
                ease: "power2.out"
            })
                .to(".start-button", {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                }, "+=0.5"); // Wait a bit until the 3D cross forms (at the end of seq 1)

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full">
            <CanvasSequence folder="section 1" frameCount={120} id="section-1">
                <div className="w-full h-full flex items-center justify-start px-8 md:px-24">

                    <div className="max-w-xl z-20 genesis-text pointer-events-none">

                        <p className="text-selam-cyan uppercase tracking-[0.2em] text-sm md:text-base font-semibold mb-4">
                            Introducing the new standard in care.
                        </p>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
                            Intelligent Care.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Real-time Connection.</span>
                        </h1>

                        <p className="text-lg text-slate-300 md:text-xl leading-relaxed mb-12 max-w-lg font-light">
                            A completely reimagined ecosystem for doctors and patients. Experience seamless clinic management, integrated video conferencing, and instant chat—all in one beautiful platform.
                        </p>

                        <div className="pointer-events-auto start-button">
                            {/* This button places itself "over the top" of the 3D rendered button at the end */}
                            <button className="glass-button flex items-center gap-3 text-white group outline-none overflow-hidden relative">
                                <span className="relative z-10 font-semibold tracking-wide">Get Started</span>
                                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />

                                {/* Subtle highlight effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-selam-cyan/0 via-selam-cyan/20 to-selam-cyan/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </button>
                        </div>

                    </div>
                </div>
            </CanvasSequence>
        </section>
    );
}
