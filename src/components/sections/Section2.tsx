import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CanvasSequence } from '../CanvasSequence';
import { Starfield } from '../Starfield';
import '../../prelude.css';

gsap.registerPlugin(ScrollTrigger);

// Node positions for the animated background grid
const NODES = [
    { left: '12%', top: '22%', delay: '0s' },
    { left: '28%', top: '68%', delay: '0.4s' },
    { left: '45%', top: '18%', delay: '0.7s' },
    { left: '62%', top: '75%', delay: '0.2s' },
    { left: '78%', top: '35%', delay: '1.1s' },
    { left: '88%', top: '60%', delay: '0.6s' },
    { left: '20%', top: '48%', delay: '1.4s' },
    { left: '55%', top: '52%', delay: '0.9s' },
    { left: '70%', top: '20%', delay: '0.3s' },
    { left: '35%', top: '85%', delay: '1.2s' },
];

export function Section2() {
    const overlayRef = useRef<HTMLDivElement>(null);
    const preludeRef = useRef<HTMLDivElement>(null);
    const scanRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── INITIAL STATES ───────────────────────────────────────
            gsap.set(overlayRef.current, { clipPath: 'inset(0% 0px 0px 0px)', background: '#030c18' });
            gsap.set(preludeRef.current, { opacity: 1 });
            gsap.set(scanRef.current, { top: '-10px', opacity: 0 });
            gsap.set('.section-title', { opacity: 1, y: 0 }); // starts visible
            gsap.set('.tooltip', { opacity: 0, y: 20 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#section-2',
                    start: 'top top',
                    end: '+=400%',
                    scrub: 2.5,
                }
            });

            // 1. Prelude fades OUT right before beam appears
            tl.to(preludeRef.current, {
                opacity: 0,
                ease: 'power2.in',
                duration: 0.03,
            }, 0.04);

            // 2. Cyan beam fades in at the TOP
            tl.to(scanRef.current, { opacity: 1, ease: 'none', duration: 0.01 }, 0.05);

            // 3. Beam sweeps + overlay clips in perfect sync
            tl.to(scanRef.current, {
                top: '102%',
                ease: 'power1.inOut',
                duration: 0.12,
            }, 0.06);
            tl.to(overlayRef.current, {
                clipPath: 'inset(102% 0px 0px 0px)',
                ease: 'power1.inOut',
                duration: 0.12,
            }, 0.06);

            // 4. Beam fades out
            tl.to(scanRef.current, { opacity: 0, ease: 'none', duration: 0.01 }, 0.185);

            // ── FIX TIMELINE DURATION TO 1.0 (represents 100% scroll) ──
            tl.to({}, { duration: 0 }, 1.0);

            // ── SECTION CONTENT TEXT REVEAL ─────────────────────────
            // Dark prelude → no box behind text (already dark bg, text is clear).
            // White building appears → animate black blur box in behind the text.
            // Inside blue building → animate box back out.

            // As the beam sweeps (0.06): fade in the black glass box behind text
            tl.to('.headline-box', {
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(16px)',
                ease: 'power1.inOut',
                duration: 0.12,
            }, 0.06);

            // 30% to 70% Scroll: Main Headline fades out.
            tl.to('.section-title', {
                opacity: 0, y: -40, filter: 'blur(10px)',
                duration: 0.4, ease: 'power2.inOut'
            }, 0.30);

            // 70% to 100% Scroll: Floating Feature points fade in next to glowing parts
            tl.to('.tooltip-server', { opacity: 1, y: 0, duration: 0.10, ease: 'back.out(2)' }, 0.70);
            tl.to('.tooltip-doctors', { opacity: 1, y: 0, duration: 0.10, ease: 'back.out(2)' }, 0.75);
            tl.to('.tooltip-storage', { opacity: 1, y: 0, duration: 0.10, ease: 'back.out(2)' }, 0.80);
            tl.to('.tooltip-ai', { opacity: 1, y: 0, duration: 0.10, ease: 'back.out(2)' }, 0.85);

        }, sectionRef);

        // ── HEADER UNIFIED TIMELINE ────────────────────────────
        // One timeline spanning the full Section 2 scroll (400% viewport).
        // Timeline total duration = 4 units → each unit = 100% of viewport scroll.
        // Phase 1 (0–0.5): black glass, logo hides   ← white building visible
        // Phase 2 (2.4–3.2): white glass, logo shows ← inside building visible
        const headerTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#section-2',
                start: 'top top',
                end: '+=400%',
                scrub: 1.5,
            }
        });

        // ── Phase 1: black glass appears as beam sweeps (first ~12% of scroll)
        headerTl
            .to('.header-ui-box', {
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                ease: 'power1.inOut',
                duration: 0.5,
            }, 0)
            .to('.logo-text-reveal', { width: 0, opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0)

            // ── Hold black glass from 0.5 → 2.4 (nothing changes during building footage)
            .to({}, { duration: 1.9 }, 0.5)   // empty tween = hold

            // ── Phase 2: white glass when inside building appears (~45% through scroll)
            .to('.header-ui-box', {
                backgroundColor: 'rgba(255, 255, 255, 0.10)',
                borderColor: 'rgba(255, 255, 255, 0.20)',
                ease: 'power1.inOut',
                duration: 0.8,
            }, 1.8)
            .to('.logo-text-reveal', { width: 130, opacity: 1, ease: 'power2.inOut', duration: 0.8 }, 1.8);

        return () => {
            ctx.revert();
            headerTl.scrollTrigger?.kill();
            gsap.set('.header-ui-box', { clearProps: 'backgroundColor,borderColor' });
            gsap.set('.logo-text-reveal', { clearProps: 'width,opacity' });
        };
    }, []);

    return (
        <div id="infrastructure" ref={sectionRef}>
            <CanvasSequence
                folder="section 2"
                frameCount={120}
                id="section-2"
                end="+=400%"
                scrub={2.5}
                sequenceStartRatio={0.20}
                sequenceEndRatio={0.80}
                renderInitialFrame={true}
            >
                {/* ── SECTION CONTENT ─────────────────────────────── */}
                <div className="w-full h-full relative pointer-events-none z-50">

                    {/* Main Headline Container — no background on dark screen, black blur box added via GSAP on white building */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-24 section-title z-50 w-[90%] max-w-xl pointer-events-none">
                        <div className="headline-box px-8 py-10 rounded-2xl relative" style={{ backgroundColor: 'transparent', backdropFilter: 'none' }}>

                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-selam-cyan mb-4">
                                Enterprise-Grade Architecture.
                            </p>

                            <h2 className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] text-white mb-8">
                                See inside your practice.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-selam-cyan to-white">
                                    Built to scale.
                                </span>
                            </h2>

                            <p className="text-lg md:text-xl font-normal leading-relaxed text-slate-300 max-w-xl">
                                Move beyond basic records. Our robust system handles everything from patient flow to secure data management—giving you total transparency over your clinic's operations.
                            </p>

                        </div>
                    </div>

                    {/* Feature 1: End-to-End Encryption — center-left (doctors room) */}
                    <div className="absolute top-[50%] left-[10%] md:left-[25%] tooltip tooltip-server z-40">
                        <div className="glass-panel px-6 py-4 flex items-center gap-4 relative isolate overflow-hidden bg-slate-900/60 backdrop-blur-lg border border-selam-cyan/30 rounded-xl shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-selam-cyan/10 to-transparent -z-10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-selam-cyan animate-pulse shadow-[0_0_10px_rgba(0,220,255,0.8)]" />
                            <p className="text-white font-medium whitespace-nowrap tracking-wide">End-to-End Encryption</p>
                        </div>
                    </div>

                    {/* Feature 2: Live Resource Tracking — upper-right */}
                    <div className="absolute top-[20%] right-[5%] md:right-[20%] tooltip tooltip-doctors z-40">
                        <div className="glass-panel px-6 py-4 flex items-center gap-4 relative isolate overflow-hidden bg-slate-900/60 backdrop-blur-lg border border-selam-cyan/30 rounded-xl shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-l from-selam-cyan/10 to-transparent -z-10" />
                            <p className="text-white font-medium whitespace-nowrap tracking-wide">Live Resource Tracking</p>
                            <div className="w-2.5 h-2.5 rounded-full bg-selam-cyan animate-pulse shadow-[0_0_10px_rgba(0,220,255,0.8)]" />
                        </div>
                    </div>

                    {/* Feature 3: HIPAA-Compliant Storage — bottom-right, near server racks */}
                    <div className="absolute bottom-[12%] right-[4%] md:right-[12%] tooltip tooltip-storage z-40">
                        <div className="glass-panel px-6 py-4 flex items-center gap-4 relative isolate overflow-hidden bg-slate-900/60 backdrop-blur-lg border border-selam-cyan/30 rounded-xl shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-l from-selam-cyan/10 to-transparent -z-10" />
                            <div className="flex flex-col gap-0.5">
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-3 rounded-sm bg-selam-cyan/70" style={{ animationDelay: `${i * 0.3}s`, animation: 'node-blink 1.5s ease-in-out infinite' }} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-white font-medium whitespace-nowrap tracking-wide">HIPAA-Compliant Storage</p>
                        </div>
                    </div>

                    {/* Feature 4: AI Diagnostics Engine — top-left near roof/cross */}
                    <div className="absolute top-[10%] left-[4%] md:left-[8%] tooltip tooltip-ai z-40">
                        <div className="glass-panel px-6 py-4 flex items-center gap-4 relative isolate overflow-hidden bg-slate-900/60 backdrop-blur-lg border border-selam-cyan/30 rounded-xl shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-selam-cyan/10 to-transparent -z-10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-selam-cyan shadow-[0_0_10px_rgba(0,220,255,0.8)]" style={{ animation: 'node-blink 0.8s ease-in-out infinite' }} />
                            <p className="text-white font-medium whitespace-nowrap tracking-wide">AI Diagnostics Engine</p>
                        </div>
                    </div>
                </div>

                {/* ── TRANSITION OVERLAY ───────────────────────────── */}

                {/* ── PRELUDE CONTENT (rich visuals on the dark screen) */}
                <div
                    ref={preludeRef}
                    className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden"
                    style={{ zIndex: 42 }}
                >
                    {/* TOP-RIGHT STARFIELD RECTANGLE — continues Section 1's right black panel */}
                    <div
                        className="absolute top-0 right-0 overflow-hidden"
                        style={{
                            width: '18.5%',
                            height: '40vh',
                            background: '#0a0a0a',
                            borderBottomLeftRadius: '50px',
                            zIndex: 20, /* Keeps the blue radar and grid lines UNDER the black window */
                        }}
                    >
                        <Starfield className="opacity-75" numStars={12} maxStarSize={1.0} />

                        {/* Top-right diagonal pure black shadow (shard/ray) */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(circle at top right, #000000 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.3) 45%, transparent 75%)' }}
                        />

                        {/* "Live Feed" label — subtle bottom-left */}
                        <div className="absolute bottom-4 left-5 flex items-center gap-2">
                            <div
                                className="w-1.5 h-1.5 rounded-full bg-selam-cyan"
                                style={{ boxShadow: '0 0 5px rgba(0,220,255,0.8)', animation: 'node-blink 1.5s ease-in-out infinite' }}
                            />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-selam-cyan/50">
                                Live Feed
                            </span>
                        </div>
                    </div>

                    {/* Radial glow at center */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(0,80,160,0.35) 0%, rgba(0,20,50,0.2) 50%, transparent 100%)'
                        }}
                    />

                    {/* Radar pulsing rings */}
                    <div className="radar-ring" />
                    <div className="radar-ring" />
                    <div className="radar-ring" />

                    {/* Center dot */}
                    <div
                        className="absolute rounded-full z-10"
                        style={{
                            width: 10, height: 10,
                            left: '50%', top: '50%',
                            marginLeft: -5, marginTop: -5,
                            background: 'rgba(0,220,255,0.9)',
                            boxShadow: '0 0 16px 6px rgba(0,220,255,0.5)',
                        }}
                    />

                    {/* Animated grid connection nodes */}
                    {NODES.map((n, i) => (
                        <div
                            key={i}
                            className="prelude-node"
                            style={{
                                left: n.left,
                                top: n.top,
                                animationDelay: n.delay,
                                animationDuration: `${1.8 + (i % 3) * 0.5}s`,
                            }}
                        />
                    ))}

                    {/* Connection lines SVG */}
                    <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
                        <line x1="12%" y1="22%" x2="45%" y2="18%" stroke="rgba(0,220,255,0.6)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="45%" y1="18%" x2="78%" y2="35%" stroke="rgba(0,220,255,0.6)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="28%" y1="68%" x2="55%" y2="52%" stroke="rgba(0,220,255,0.6)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="55%" y1="52%" x2="88%" y2="60%" stroke="rgba(0,220,255,0.6)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="20%" y1="48%" x2="55%" y2="52%" stroke="rgba(0,220,255,0.6)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="62%" y1="75%" x2="55%" y2="52%" stroke="rgba(0,220,255,0.6)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="70%" y1="20%" x2="78%" y2="35%" stroke="rgba(0,220,255,0.6)" strokeWidth="0.5" strokeDasharray="4 4" />
                    </svg>

                    {/* Status text + pulsing dot */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
                        {/* ECG line SVG */}
                        <svg width="200" height="40" viewBox="0 0 200 40" style={{ opacity: 0.7 }}>
                            <polyline
                                points="0,20 30,20 40,5 50,35 60,5 70,20 100,20 120,20 130,8 140,32 150,8 160,20 200,20"
                                fill="none"
                                stroke="rgba(0,220,255,0.9)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full bg-selam-cyan"
                                style={{ boxShadow: '0 0 6px 2px rgba(0,220,255,0.6)', animation: 'node-blink 1.2s ease-in-out infinite' }}
                            />
                            <span
                                className="text-xs font-mono font-bold uppercase tracking-[0.3em]"
                                style={{ color: 'rgba(0,220,255,0.7)', animation: 'node-blink 2s ease-in-out infinite' }}
                            >
                                Scanning Infrastructure...
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cyan scan beam */}
                <div
                    ref={scanRef}
                    className="absolute left-0 w-full pointer-events-none"
                    style={{
                        zIndex: 50,
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(0,220,255,0.1) 5%, rgba(0,220,255,1) 50%, rgba(0,220,255,0.1) 95%, transparent 100%)',
                        boxShadow: '0 0 25px 8px rgba(0,220,255,0.5), 0 0 80px 20px rgba(0,220,255,0.2)',
                        filter: 'blur(0.3px)',
                    }}
                />

                {/* Dark overlay — clips away as beam sweeps */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 40 }}
                />

            </CanvasSequence>
        </div>
    );
}
