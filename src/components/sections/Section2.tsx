import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CanvasSequence } from '../CanvasSequence';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section2 — "Curtain Wipe" transition.
 *
 * 1. Overlay starts deep blue-black.
 * 2. Overlay fades to deep purple.
 * 3. Cyan horizontal beam appears at top edge.
 * 4. Beam sweeps top → bottom. The overlay clip-path tracks the beam:
 *    as beam passes Y%, the overlay is clipped from the top (inset Y% from top),
 *    revealing Section 2's canvas (frozen at frame 0 = white building exterior) above the beam.
 * 5. Beam reaches bottom → overlay fully clipped → Section 2 fully visible.
 * 6. Canvas starts animating normally.
 */
export function Section2() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const scanRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── INITIAL STATES ───────────────────────────────────────
            // Overlay covers everything. Beam hidden above viewport.
            gsap.set(overlayRef.current, {
                clipPath: 'inset(0% 0px 0px 0px)',   // full overlay
                background: '#030c18',                // deep blue-black
            });
            gsap.set(scanRef.current, { top: '-10px', opacity: 0 });

            // Section content starts hidden
            gsap.set('.section-title', { opacity: 0, x: -50, filter: 'blur(10px)' });
            gsap.set('.tooltip', { opacity: 0, y: 20 });

            // ── TRANSITION TIMELINE ──────────────────────────────────
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#section-2',
                    start: 'top top',
                    end: '+=400%',
                    scrub: 2.5,
                }
            });

            // 1. Background shifts from deep blue-black → deep purple
            //    (overlay color changes without revealing anything yet)
            tl.to(overlayRef.current, {
                background: '#180530',   // deep purple
                ease: 'power1.inOut',
                duration: 0.06,
            }, 0.00);

            // 2. Cyan beam fades in at the TOP of the overlay
            tl.to(scanRef.current, {
                opacity: 1,
                ease: 'none',
                duration: 0.01,
            }, 0.05);

            // 3a. Beam sweeps downward — from top: -10px → bottom: 100%
            // 3b. Overlay clip-path wipes in SYNC with beam:
            //     inset(0% → 100% from top) — removes overlay above the beam,
            //     revealing the building canvas exactly where the beam has passed.
            tl.to(scanRef.current, {
                top: '102%',
                ease: 'power1.inOut',
                duration: 0.12,
            }, 0.06);

            tl.to(overlayRef.current, {
                clipPath: 'inset(102% 0px 0px 0px)',
                ease: 'power1.inOut',
                duration: 0.12,
            }, 0.06);   // ← starts at SAME time as beam sweep, exact sync

            // 4. Beam fades out once it's off screen
            tl.to(scanRef.current, {
                opacity: 0,
                ease: 'none',
                duration: 0.01,
            }, 0.185);

            // ── SECTION CONTENT (after transition) ───────────────────
            tl.to('.section-title', {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
                duration: 0.12,
                ease: 'power3.out'
            }, 0.30);

            tl.to('.tooltip-server', {
                opacity: 1,
                y: 0,
                duration: 0.10,
                ease: 'back.out(2)'
            }, 0.50);

            tl.to('.tooltip-doctors', {
                opacity: 1,
                y: 0,
                duration: 0.10,
                ease: 'back.out(2)'
            }, 0.65);

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef}>
            <CanvasSequence
                folder="section 2"
                frameCount={120}
                id="section-2"
                end="+=400%"
                scrub={2.5}
                sequenceStartRatio={0.20}
                sequenceEndRatio={0.80}
            >
                {/* ── SECTION CONTENT ─────────────────────────────────── */}
                <div className="w-full h-full relative pointer-events-none">

                    <div className="absolute top-32 left-8 md:left-24 section-title z-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                            The Infrastructure
                        </h2>
                        <p className="text-xl text-selam-cyan font-light tracking-wide">
                            The backbone of modern clinics.
                        </p>
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

                {/* ── TRANSITION OVERLAY ────────────────────────────────── */}

                {/* Cyan scan beam — the "curtain rod" */}
                <div
                    ref={scanRef}
                    className="absolute left-0 w-full pointer-events-none"
                    style={{
                        zIndex: 50,
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(0,220,255,0.1) 5%, rgba(0,220,255,1) 50%, rgba(0,220,255,0.1) 95%, transparent 100%)',
                        boxShadow: '0 0 25px 8px rgba(0,220,255,0.5), 0 0 80px 20px rgba(0,220,255,0.2), 0 -20px 60px 0px rgba(0,220,255,0.08)',
                        filter: 'blur(0.3px)',
                    }}
                />

                {/* Color overlay — clips away as beam sweeps */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 40 }}
                />

            </CanvasSequence>
        </div>
    );
}
