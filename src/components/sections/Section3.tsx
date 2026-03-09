import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CanvasSequence } from '../CanvasSequence';
import { Video, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Section3() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.set(".connect-text > *", { opacity: 0, y: -30 });
            gsap.set(".feature-card-left", { opacity: 0, scale: 0.8, x: -150, rotationY: -45 });
            gsap.set(".feature-card-right", { opacity: 0, scale: 0.8, x: 150, rotationY: 45 });

            // Text & card animations on Section 3's own scroll
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                }
            });

            tl.to(".connect-text > *", {
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 1,
                ease: 'power2.out'
            }, 0.1)
                .to([".feature-card-left", ".feature-card-right"], {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    rotationY: 0,
                    duration: 1.8,
                    ease: "back.out(1.2)"
                }, 2.4);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="features" ref={containerRef} className="w-full">
            <CanvasSequence
                folder="section 3"
                frameCount={120}
                id="section-3"
                end="+=400%"
                scrub={2.5}
            >
                <div className="w-full h-full relative pointer-events-none flex flex-col items-center justify-between py-12 z-20">

                    {/* Text container gets a dark radial gradient and blur to stand out against bright background lines */}
                    <div className="connect-text text-center px-6 py-4 max-w-4xl relative rounded-[2rem] overflow-hidden border border-white/5 bg-slate-950/40 backdrop-blur-xl shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                        {/* Inner subtle glow for the text box */}
                        <div className="absolute inset-0 bg-selam-cyan/5 -z-10 rounded-[2rem]"></div>

                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-selam-cyan/30 bg-selam-cyan/10 backdrop-blur-md mb-3">
                            <span className="w-2 h-2 rounded-full bg-selam-cyan animate-pulse shadow-[0_0_10px_2px_rgba(6,182,212,0.8)]"></span>
                            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-selam-cyan drop-shadow-md">
                                Zero Latency. Total Connection.
                            </span>
                        </div>

                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 mb-4 drop-shadow-2xl">
                            Care without boundaries.
                        </h2>

                        <p className="text-sm md:text-base lg:text-lg font-light leading-relaxed text-slate-200 mx-auto max-w-2xl">
                            Crystal-clear video conferencing and <span className="font-medium text-white">secure, instant chat</span> built natively into your workflow. No third-party apps required.
                        </p>
                    </div>

                    {/* Bottom UI features replacing the video stream edges */}
                    {/* Added heavy perspective to the wrapper for the 3D card swing animation */}
                    <div className="w-full max-w-4xl px-4 flex flex-col md:flex-row justify-center mb-12 lg:mb-24 gap-4 [perspective:1500px]">

                        <div className="feature-card-left flex-1 max-w-[400px] p-8 md:p-10 rounded-[2rem] bg-slate-950/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-15px_rgba(6,182,212,0.4)] relative overflow-hidden group origin-right">
                            {/* Hover gradient effect inside card */}
                            <div className="absolute inset-0 bg-gradient-to-br from-selam-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-selam-cyan/20 to-selam-cyan/5 flex items-center justify-center mb-8 border border-selam-cyan/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                                <Video className="text-selam-cyan" size={32} />
                            </div>
                            <h3 className="font-display text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">HD Virtual Consultations</h3>
                            <p className="text-slate-300 text-lg font-normal leading-relaxed">
                                Meet patients face-to-face in stunning high definition. Completely integrated telemedicine endpoints.
                            </p>
                        </div>

                        <div className="feature-card-right flex-1 max-w-[400px] p-8 md:p-10 rounded-[2rem] bg-slate-950/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-15px_rgba(59,130,246,0.4)] relative overflow-hidden group origin-left">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-8 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                                <MessageSquare className="text-blue-400" size={32} />
                            </div>
                            <h3 className="font-display text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">Secure Messaging</h3>
                            <p className="text-slate-300 text-lg font-normal leading-relaxed">
                                Encrypted chatting for rapid follow-ups, prescriptions, and health check-ins seamlessly delivered.
                            </p>
                        </div>

                    </div>

                </div>
            </CanvasSequence>
        </section>
    );
}
