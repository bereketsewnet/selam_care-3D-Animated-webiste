import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CanvasSequence } from '../CanvasSequence';
import { Database, Activity, Lock, Users } from 'lucide-react';

export function Section4() {
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

            gsap.set(".dashboard-ui", { opacity: 0, scale: 0.95 });

            // Elements fade in at the very end of the animation (when camera is fully pulled back)
            tl.to(".dashboard-ui", {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: "power2.out"
            }, 3.0);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full">
            <CanvasSequence folder="section 4" frameCount={120} id="section-4">
                <div className="w-full h-full relative pointer-events-none flex items-center justify-center p-4">

                    <div className="dashboard-ui absolute inset-0 z-20 flex items-center justify-center">

                        {/* We recreate a mock 'glass wrapper' around where the dashboard video lands */}
                        <div className="w-full max-w-7xl h-[80vh] rounded-[2.5rem] border border-white/10 bg-slate-950/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.6)] flex flex-col justify-end p-8 md:p-14 relative overflow-hidden">

                            {/* Inner subtle glow and gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                            {/* Title appearing above the metrics */}
                            <div className="absolute top-10 left-10 md:top-14 md:left-14 z-30 pointer-events-auto">
                                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-selam-cyan/30 bg-selam-cyan/10 backdrop-blur-md mb-4">
                                    <span className="w-2 h-2 rounded-full bg-selam-cyan animate-pulse shadow-[0_0_10px_2px_rgba(6,182,212,0.8)]"></span>
                                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-selam-cyan drop-shadow-md">
                                        Full System Access
                                    </span>
                                </div>
                                <h3 className="font-display text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-[1.1] drop-shadow-2xl">
                                    Selam Workspace
                                </h3>
                            </div>

                            <div className="relative z-30 grid grid-cols-1 md:grid-cols-4 gap-6 pointer-events-auto">

                                <div className="group p-8 rounded-[2rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:bg-slate-800/60 hover:border-selam-cyan/40 transition-all duration-500 shadow-xl cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-selam-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-selam-cyan/20 border border-transparent group-hover:border-selam-cyan/30 transition-colors duration-500 shadow-[0_0_20px_rgba(6,182,212,0)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                        <Activity className="text-slate-400 group-hover:text-selam-cyan transition-colors" size={26} />
                                    </div>
                                    <h4 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">Live Vitals</h4>
                                    <p className="text-base text-slate-400 font-normal leading-relaxed group-hover:text-slate-300 transition-colors">Real-time patient monitoring</p>
                                </div>

                                <div className="group p-8 rounded-[2rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:bg-slate-800/60 hover:border-blue-500/40 transition-all duration-500 shadow-xl cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 border border-transparent group-hover:border-blue-500/30 transition-colors duration-500 shadow-[0_0_20px_rgba(59,130,246,0)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                        <Database className="text-slate-400 group-hover:text-blue-400 transition-colors" size={26} />
                                    </div>
                                    <h4 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">Central Records</h4>
                                    <p className="text-base text-slate-400 font-normal leading-relaxed group-hover:text-slate-300 transition-colors">Unified patient history</p>
                                </div>

                                <div className="group p-8 rounded-[2rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:bg-slate-800/60 hover:border-purple-500/40 transition-all duration-500 shadow-xl cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 border border-transparent group-hover:border-purple-500/30 transition-colors duration-500 shadow-[0_0_20px_rgba(168,85,247,0)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                        <Users className="text-slate-400 group-hover:text-purple-400 transition-colors" size={26} />
                                    </div>
                                    <h4 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">Care Teams</h4>
                                    <p className="text-base text-slate-400 font-normal leading-relaxed group-hover:text-slate-300 transition-colors">Collaborative diagnostics</p>
                                </div>

                                <div className="group p-8 rounded-[2rem] bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:bg-slate-800/60 hover:border-emerald-500/40 transition-all duration-500 shadow-xl cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 border border-transparent group-hover:border-emerald-500/30 transition-colors duration-500 shadow-[0_0_20px_rgba(16,185,129,0)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                        <Lock className="text-slate-400 group-hover:text-emerald-400 transition-colors" size={26} />
                                    </div>
                                    <h4 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">HIPAA Secure</h4>
                                    <p className="text-base text-slate-400 font-normal leading-relaxed group-hover:text-slate-300 transition-colors">End-to-end encryption</p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </CanvasSequence>
        </section>
    );
}
