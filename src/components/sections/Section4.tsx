import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CanvasSequence } from '../CanvasSequence';

gsap.registerPlugin(ScrollTrigger);

const PIN_BUDGET = '+=400%';

/* ── Keyframe animations injected once ── */
const STYLE = `
@keyframes s4-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
}
@keyframes s4-float-left {
    0%, 100% { transform: perspective(600px) rotateY(20deg) translateY(0px); }
    50%       { transform: perspective(600px) rotateY(20deg) translateY(-8px); }
}
@keyframes s4-float-right {
    0%, 100% { transform: perspective(600px) rotateY(-20deg) translateY(0px); }
    50%       { transform: perspective(600px) rotateY(-20deg) translateY(-8px); }
}
@keyframes s4-scanline {
    0%   { transform: translateX(-100%); opacity: 0; }
    20%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translateX(200%); opacity: 0; }
}
@keyframes s4-glow-pulse {
    0%, 100% { box-shadow: 0 0 40px rgba(6,182,212,0.15), inset 0 0 40px rgba(6,182,212,0.04); }
    50%       { box-shadow: 0 0 80px rgba(6,182,212,0.30), inset 0 0 60px rgba(6,182,212,0.08); }
}
@keyframes s4-border-flow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.s4-scanline-track { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.s4-scanline-track::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(6,182,212,0.12), transparent);
    animation: s4-scanline 4s ease-in-out infinite;
}
`;

// Tooltip pill with curved monitor-panel perspective + floating animation
function TooltipPill({
    label,
    color,
    animation,
    style,
    dot,
    dotGlow,
    borderColor,
    scanColor,
}: {
    label: string;
    color: string;
    animation: string;
    style?: React.CSSProperties;
    dot: string;
    dotGlow: string;
    borderColor: string;
    scanColor: string;
}) {
    return (
        <div
            className="s4-tooltip absolute opacity-0"
            style={style}
        >
            {/* Curved pill inspired by the angled monitor panels */}
            <div
                className="relative px-5 py-3 backdrop-blur-2xl overflow-hidden"
                style={{
                    background: 'rgba(2, 8, 20, 0.85)',
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: '12px 12px 6px 6px',
                    boxShadow: `0 0 25px ${borderColor.replace(')', ', 0.3)').replace('rgb', 'rgba')}, 0 4px 30px rgba(0,0,0,0.5)`,
                    animation,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                }}
            >
                {/* Top glowing edge — thicker for the "screen bezel" feel */}
                <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
                    }}
                />
                {/* Sweeping scanline */}
                <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{}}
                >
                    <div
                        style={{
                            position: 'absolute', top: 0, left: 0,
                            width: '60%', height: '100%',
                            background: `linear-gradient(90deg, transparent, ${scanColor}, transparent)`,
                            animation: 's4-scanline 3.5s ease-in-out infinite',
                        }}
                    />
                </div>
                {/* Dot + label */}
                <div className="relative flex items-center gap-2.5">
                    <div className="relative flex-shrink-0">
                        <span
                            className="block w-3 h-3 rounded-full"
                            style={{ background: dot, boxShadow: dotGlow }}
                        />
                        <span
                            className="absolute inset-0 rounded-full border border-current animate-ping"
                            style={{ color: dot, opacity: 0.5 }}
                        />
                    </div>
                    <p className={`text-xs font-mono font-bold uppercase tracking-widest whitespace-nowrap ${color}`}>
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function Section4() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: PIN_BUDGET,
                    scrub: 1,
                }
            });

            tl.to('.s4-text-block', {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: 'power3.out',
            }, 3.0);

            tl.to('.s4-tooltip', {
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.2,
            }, 3.2);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full">
            {/* Inject keyframes */}
            <style>{STYLE}</style>

            <CanvasSequence folder="section 4" frameCount={120} id="section-4" end={PIN_BUDGET}>
                <div className="absolute inset-0 z-20 pointer-events-none">

                    {/* ══════════ LEFT TOOLTIP — tilted like left monitor panel ══════════ */}
                    <TooltipPill
                        label="Live Patient Analytics"
                        color="text-cyan-400"
                        dot="rgb(6,182,212)"
                        dotGlow="0 0 12px 4px rgba(6,182,212,0.8)"
                        borderColor="rgba(6,182,212,0.5)"
                        scanColor="rgba(6,182,212,0.15)"
                        animation="s4-float-left 4s"
                        style={{
                            top: '28%',
                            left: '5%',
                            transform: 'perspective(600px) rotateY(20deg)',
                            transformOrigin: 'left center',
                            pointerEvents: 'auto',
                        }}
                    />

                    {/* ══════════ CENTER TOOLTIP — straight on, floating ══════════ */}
                    <TooltipPill
                        label="Unified Scheduling"
                        color="text-blue-300"
                        dot="rgb(96,165,250)"
                        dotGlow="0 0 12px 4px rgba(96,165,250,0.8)"
                        borderColor="rgba(96,165,250,0.5)"
                        scanColor="rgba(96,165,250,0.15)"
                        animation="s4-float 4s"
                        style={{
                            top: '10%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            pointerEvents: 'auto',
                        }}
                    />

                    {/* ══════════ RIGHT TOOLTIP — tilted like right monitor panel ══════════ */}
                    <TooltipPill
                        label="Billing & Coding Auto-Sync"
                        color="text-emerald-300"
                        dot="rgb(52,211,153)"
                        dotGlow="0 0 12px 4px rgba(52,211,153,0.8)"
                        borderColor="rgba(52,211,153,0.5)"
                        scanColor="rgba(52,211,153,0.15)"
                        animation="s4-float-right 4s"
                        style={{
                            top: '28%',
                            right: '5%',
                            transform: 'perspective(600px) rotateY(-20deg)',
                            transformOrigin: 'right center',
                            pointerEvents: 'auto',
                        }}
                    />

                    {/* ══════════ MAIN TEXT BLOCK — curved bottom panel ══════════ */}
                    <div
                        className="s4-text-block absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 opacity-0 translate-y-10 pointer-events-auto"
                    >
                        {/* Curved card — concave dome shape matching background curved screen */}
                        <div
                            className="relative text-center overflow-hidden"
                            style={{
                                background: 'rgba(2, 8, 20, 0.4)',  /* Much more transparent */
                                backdropFilter: 'blur(20px)',       /* Less blur to see through it more */
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderTop: '2px solid rgba(6,182,212,0.4)',
                                borderRadius: '120px 120px 24px 24px / 40px 40px 24px 24px', /* Gentler curve */
                                padding: '2.5rem 2rem 1.75rem',
                                boxShadow: '0 20px 60px -10px rgba(6,182,212,0.2)', /* Add cyan drop shadow */
                                animation: 's4-glow-pulse 4s ease-in-out infinite',
                            }}
                        >
                            {/* Top glow arc */}
                            <div
                                className="absolute top-0 left-0 w-full pointer-events-none"
                                style={{
                                    height: '3px',
                                    background: 'linear-gradient(90deg, transparent 5%, rgba(6,182,212,0.8) 50%, transparent 95%)',
                                }}
                            />
                            {/* Sweeping cyan scanline across the card */}
                            <div className="s4-scanline-track" />

                            {/* Kicker badge */}
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-5">
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_2px_rgba(6,182,212,0.8)]" />
                                <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
                                    Unprecedented Visibility.
                                </span>
                            </div>

                            {/* Headline */}
                            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] text-white mb-5 drop-shadow-2xl">
                                Command your clinic.
                            </h2>

                            {/* Sub-headline */}
                            <p className="text-base md:text-lg font-light leading-relaxed text-slate-300 mx-auto max-w-2xl">
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
