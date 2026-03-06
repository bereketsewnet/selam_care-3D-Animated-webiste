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
            gsap.set('.section-title', { opacity: 0, x: -50, filter: 'blur(10px)' });
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

            // ── SECTION CONTENT ─────────────────────────────────────
            tl.to('.section-title', {
                opacity: 1, x: 0, filter: 'blur(0px)',
                duration: 0.12, ease: 'power3.out'
            }, 0.30);
            tl.to('.tooltip-server', { opacity: 1, y: 0, duration: 0.10, ease: 'back.out(2)' }, 0.50);
            tl.to('.tooltip-doctors', { opacity: 1, y: 0, duration: 0.10, ease: 'back.out(2)' }, 0.65);

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
                {/* ── SECTION CONTENT ─────────────────────────────── */}
                <div className="w-full h-full relative pointer-events-none">
                    <div className="absolute top-32 left-8 md:left-24 section-title z-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">The Infrastructure</h2>
                        <p className="text-xl text-selam-cyan font-light tracking-wide">The backbone of modern clinics.</p>
                    </div>
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
