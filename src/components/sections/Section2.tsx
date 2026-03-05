import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CanvasSequence } from '../CanvasSequence';

export function Section2() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                }
            });

            gsap.set(".tooltip", { opacity: 0, y: 20 });
            gsap.set(".section-title", { opacity: 0, x: -50, filter: 'blur(10px)' });

            // Blur to clear transition for title
            tl.to(".section-title", {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'power3.out'
            }, 0.2)

                // Floating tooltips
                .to(".tooltip-server", {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "back.out(2)"
                }, 1.2) // At 1.2s in GSAP timeline
                .to(".tooltip-doctors", {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "back.out(2)"
                }, 1.8);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full">
            <CanvasSequence folder="section 2" frameCount={120} id="section-2">
                <div className="w-full h-full relative pointer-events-none">

                    <div className="absolute top-32 left-8 md:left-24 section-title z-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                            The Infrastructure
                        </h2>
                        <p className="text-xl text-selam-cyan font-light tracking-wide">The backbone of modern clinics.</p>
                    </div>

                    {/* Floating Tooltips */}
                    <div className="absolute top-[50%] left-[10%] md:left-[25%] tooltip tooltip-server z-20">
                        <div className="glass-panel px-6 py-4 flex items-center gap-4 relative isolate overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-selam-cyan/10 to-transparent -z-10" />
                            <div className="w-3 h-3 rounded-full bg-selam-cyan animate-[ping_2s_ease-in-out_infinite]" />
                            <div className="w-3 h-3 rounded-full bg-selam-cyan absolute left-6" />
                            <div>
                                <p className="text-xs text-selam-cyan font-bold uppercase tracking-widest">Node Alpha</p>
                                <p className="text-white font-medium text-lg">Secure Core Servers</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-[35%] right-[5%] md:right-[20%] tooltip tooltip-doctors z-20">
                        <div className="glass-panel px-6 py-4 flex flex-col items-end gap-1 relative isolate overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-l from-blue-500/10 to-transparent -z-10" />
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Staff</p>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400 font-bold text-2xl">14+</span>
                                <span className="text-white font-medium">Specialists</span>
                            </div>
                        </div>
                    </div>

                </div>
            </CanvasSequence>
        </section>
    );
}
