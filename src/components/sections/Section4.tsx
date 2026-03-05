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
            }, 3.0); // At 3/4 progress through the section's pin

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full">
            <CanvasSequence folder="section 4" frameCount={120} id="section-4">
                <div className="w-full h-full relative pointer-events-none flex items-center justify-center p-4">

                    <div className="dashboard-ui absolute inset-0 z-20 flex items-center justify-center">

                        {/* We recreate a mock 'glass wrapper' around where the dashboard video lands */}
                        <div className="w-full max-w-7xl h-[80vh] rounded-3xl border border-white/20 bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col justify-end p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

                            <div className="relative z-30 grid grid-cols-1 md:grid-cols-4 gap-6 pointer-events-auto">

                                <div className="glass-panel p-6 rounded-2xl border-white/10 hover:border-selam-cyan transition-colors cursor-pointer group">
                                    <Activity className="text-selam-cyan mb-4 group-hover:scale-110 transition-transform" size={24} />
                                    <h4 className="text-white font-bold mb-1">Live Vitals</h4>
                                    <p className="text-sm text-slate-400">Real-time patient monitoring</p>
                                </div>

                                <div className="glass-panel p-6 rounded-2xl border-white/10 hover:border-selam-cyan transition-colors cursor-pointer group">
                                    <Database className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                    <h4 className="text-white font-bold mb-1">Central Records</h4>
                                    <p className="text-sm text-slate-400">Unified patient history</p>
                                </div>

                                <div className="glass-panel p-6 rounded-2xl border-white/10 hover:border-selam-cyan transition-colors cursor-pointer group">
                                    <Users className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                    <h4 className="text-white font-bold mb-1">Care Teams</h4>
                                    <p className="text-sm text-slate-400">Collaborative diagnostics</p>
                                </div>

                                <div className="glass-panel p-6 rounded-2xl border-white/10 hover:border-selam-cyan transition-colors cursor-pointer group">
                                    <Lock className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                    <h4 className="text-white font-bold mb-1">HIPAA Secure</h4>
                                    <p className="text-sm text-slate-400">End-to-end encryption</p>
                                </div>

                            </div>

                            {/* Title appearing above the metrics */}
                            <div className="absolute top-12 left-12 z-30 pointer-events-auto">
                                <h3 className="text-4xl font-bold tracking-tight text-white mb-2">Selam Workspace</h3>
                                <p className="text-selam-cyan/80 font-medium tracking-wider uppercase text-sm">Full System Access</p>
                            </div>

                        </div>
                    </div>

                </div>
            </CanvasSequence>
        </section>
    );
}
