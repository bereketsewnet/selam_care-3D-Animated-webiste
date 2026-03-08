import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CanvasSequence } from '../CanvasSequence';

gsap.registerPlugin(ScrollTrigger);

const PIN_BUDGET = '+=400%'; // Must match CanvasSequence end prop

export function Section4() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Scrub timeline matching the CanvasSequence pin budget ── */
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: PIN_BUDGET,
                    scrub: 1,
                }
            });

            /* ── Text already starts invisible via CSS (opacity-0 / translate-y-10) ──
               Fade in during the final 25% of the pin (after video finishes) */
            tl.to('.s4-text-block', {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: 'power3.out',
            }, 3.0);

            tl.to('.s4-tooltip', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.2,
            }, 3.2);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full">
            {/* NOTE: end prop must match PIN_BUDGET above so canvas + overlay stay in sync */}
            <CanvasSequence folder="section 4" frameCount={120} id="section-4" end={PIN_BUDGET}>
                {/* Overlay sits above z-10 canvas */}
                <div className="absolute inset-0 z-20 pointer-events-none">

                    {/* ══════════ TOOLTIP 1 — Live Patient Analytics (left panel) ══════════ */}
                    <div
                        className="s4-tooltip absolute flex items-center gap-3 opacity-0 translate-y-10"
                        style={{ top: '26%', left: '7%' }}
                    >
                        <div className="relative flex-shrink-0">
                            <span className="block w-3 h-3 rounded-full bg-selam-cyan shadow-[0_0_12px_4px_rgba(6,182,212,0.9)]" />
                            <span className="absolute inset-0 rounded-full border-2 border-selam-cyan/60 animate-ping" />
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-selam-cyan/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] pointer-events-auto">
                            <p className="text-xs font-mono font-bold uppercase tracking-widest text-selam-cyan whitespace-nowrap">
                                Live Patient Analytics
                            </p>
                        </div>
                    </div>

                    {/* ══════════ TOOLTIP 2 — Unified Scheduling (center) ══════════ */}
                    <div
                        className="s4-tooltip absolute flex items-center gap-3 opacity-0 translate-y-10"
                        style={{ top: '16%', left: '50%', transform: 'translateX(-50%) translateY(2.5rem)' }}
                    >
                        <div className="relative flex-shrink-0">
                            <span className="block w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_4px_rgba(96,165,250,0.9)]" />
                            <span className="absolute inset-0 rounded-full border-2 border-blue-400/60 animate-ping" />
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-blue-400/40 shadow-[0_0_20px_rgba(96,165,250,0.2)] pointer-events-auto">
                            <p className="text-xs font-mono font-bold uppercase tracking-widest text-blue-300 whitespace-nowrap">
                                Unified Scheduling
                            </p>
                        </div>
                    </div>

                    {/* ══════════ TOOLTIP 3 — Billing & Coding Auto-Sync (right panel) ══════════ */}
                    <div
                        className="s4-tooltip absolute flex items-center gap-3 opacity-0 translate-y-10"
                        style={{ top: '26%', right: '7%' }}
                    >
                        <div className="px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-emerald-400/40 shadow-[0_0_20px_rgba(52,211,153,0.2)] pointer-events-auto">
                            <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-300 whitespace-nowrap">
                                Billing &amp; Coding Auto-Sync
                            </p>
                        </div>
                        <div className="relative flex-shrink-0">
                            <span className="block w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_4px_rgba(52,211,153,0.9)]" />
                            <span className="absolute inset-0 rounded-full border-2 border-emerald-400/60 animate-ping" />
                        </div>
                    </div>

                    {/* ══════════ MAIN TEXT BLOCK — bottom center frosted glass ══════════ */}
                    <div
                        className="s4-text-block absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 opacity-0 translate-y-10 pointer-events-auto"
                    >
                        <div className="rounded-[2rem] bg-slate-950/75 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] px-8 py-7 text-center relative overflow-hidden">
                            {/* Top glow border line */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-selam-cyan/40 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-selam-cyan/[0.04] rounded-[2rem] pointer-events-none" />

                            {/* Kicker */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-selam-cyan/30 bg-selam-cyan/10 backdrop-blur-md mb-4">
                                <span className="w-2 h-2 rounded-full bg-selam-cyan animate-pulse shadow-[0_0_8px_2px_rgba(6,182,212,0.8)]" />
                                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.3em] text-selam-cyan">
                                    Unprecedented Visibility.
                                </span>
                            </div>

                            {/* Headline */}
                            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-white mb-4 drop-shadow-2xl">
                                Command your clinic.
                            </h2>

                            {/* Sub-headline */}
                            <p className="text-sm md:text-base font-light leading-relaxed text-slate-300 mx-auto max-w-xl">
                                Say goodbye to fragmented tools. We completely overhauled the clinic experience into{' '}
                                <span className="font-medium text-white">one unified, glassmorphic dashboard</span>.
                                {' '}Patient vitals, scheduling, and billing—all in a single, lightning-fast interface.
                            </p>
                        </div>
                    </div>

                </div>
            </CanvasSequence>
        </section>
    );
}
