import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CanvasSequence } from '../CanvasSequence';
import { Video, MessageSquare } from 'lucide-react';

export function Section3() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animate Center Text first (coming down)─────────────────────────────────────
            // Removed curtain wiping. Handled natively in App.tsx by moving DOM.

            gsap.set(".connect-text > *", { opacity: 0, y: -30 });
            gsap.set(".feature-card", { opacity: 0, scale: 0.5, y: 50 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // This callback is called from CanvasSequence with the main timeline
    // so we can inject our custom page-turn transition at the very beginning!
    const handleMainTimeline = (tl: gsap.core.Timeline) => {
        // ── TRUE PAGE TURN ENTRANCE ─────────────────────────────────────
        // Section 3 starts totally clipped out (inset from the right 100%).
        // In the first 15% of the scroll timeline, it wipes in to inset 0%.
        // Because Section 3 is already pinned natively by CanvasSequence,
        // this clipPath wipe happens over Section 2's final resting position.
        gsap.set(containerRef.current, { clipPath: 'inset(0 100% 0 0)' });

        tl.to(containerRef.current, {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'power2.inOut',
            duration: 0.15,
        }, 0);

        // Text animations start right after the wipe (at 0.15)
        tl.to(".connect-text > *", {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 1,
            ease: 'power2.out'
        }, 0.15)
            // Feature cards spring up
            .to(".feature-card", {
                opacity: 1,
                scale: 1,
                y: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'back.out(1.5)'
            }, 0.50);
    };

    return (
        // -mt-[100vh] pulls Section 3 up so it physically sits EXACTLY on top of Section 2's end state
        // This is what allows the clipPath wipe to reveal Section 2 underneath!
        <section ref={containerRef} className="w-full relative z-[100] -mt-[100vh]">
            <CanvasSequence
                folder="section 3"
                frameCount={120}
                id="section-3"
                additionalTlCallback={handleMainTimeline}
            >
                <div className="w-full h-full relative pointer-events-none flex flex-col items-center justify-between py-24 z-20">

                    <div className="connect-text text-center px-4 max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-selam-cyan mb-4">
                            Zero Latency. Total Connection.
                        </p>
                        <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-none text-white mb-6 drop-shadow-lg">
                            Care without boundaries.
                        </h2>
                        <p className="text-lg md:text-xl font-normal leading-relaxed text-slate-300 mx-auto max-w-xl mb-10">
                            Crystal-clear video conferencing and secure, instant chat built natively into your workflow. No third-party apps required—just seamless doctor-patient communication.
                        </p>
                    </div>

                    {/* Bottom UI features replacing the video stream edges */}
                    <div className="w-full max-w-6xl px-8 flex flex-col md:flex-row justify-between mb-12 lg:mb-24 gap-8">

                        <div className="feature-card glass-panel flex-1 max-w-sm p-8 shadow-[0_0_40px_-15px_rgba(6,182,212,0.5)] border-selam-cyan/30">
                            <div className="w-14 h-14 rounded-full bg-selam-cyan/20 flex items-center justify-center mb-6 border border-selam-cyan/50">
                                <Video className="text-selam-cyan" size={28} />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-tight">HD Virtual Consultations</h3>
                            <p className="text-slate-400 font-normal leading-relaxed">
                                Meet patients face-to-face in high definition with completely integrated telemedicine endpoints.
                            </p>
                        </div>

                        <div className="feature-card glass-panel flex-1 max-w-sm p-8 shadow-[0_0_40px_-15px_rgba(59,130,246,0.5)] border-blue-500/30 md:self-end">
                            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/50">
                                <MessageSquare className="text-blue-400" size={28} />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-tight">Secure Instant Messaging</h3>
                            <p className="text-slate-400 font-normal leading-relaxed">
                                Encrypted chatting for rapid follow-ups, prescriptions, and health check-ins seamlessly delivered.
                            </p>
                        </div>

                    </div>

                </div>
            </CanvasSequence>
        </section>
    );
}
