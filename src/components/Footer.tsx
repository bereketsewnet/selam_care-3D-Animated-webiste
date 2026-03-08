import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_STYLES = `
@keyframes pulse-slow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.05); }
}
@keyframes float-particle {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
}
@keyframes border-trace {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.footer-glass {
    background: rgba(4, 12, 28, 0.4);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.05);
    border-top: 1px solid rgba(6,182,212,0.2);
}
.footer-link {
    position: relative;
    color: #94a3b8;
    transition: all 0.3s ease;
}
.footer-link:hover {
    color: #fff;
    text-shadow: 0 0 10px rgba(6,182,212,0.5);
    transform: translateX(4px);
}
.footer-link::after {
    content: '';
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #06b6d4;
    box-shadow: 0 0 8px #06b6d4;
    transition: all 0.3s ease;
}
.footer-link:hover::after {
    transform: translateY(-50%) scale(1);
}
.cta-button {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.1));
    border: 1px solid rgba(6,182,212,0.5);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.cta-button:hover {
    box-shadow: 0 0 40px rgba(6,182,212,0.3), inset 0 0 20px rgba(6,182,212,0.2);
    transform: translateY(-2px);
    border-color: rgba(6,182,212,0.8);
}
.cta-button::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 200%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s ease;
}
.cta-button:hover::before {
    left: 100%;
}
`;

export function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const spacerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Measure footer height for the curtain reveal spacer
        const updateHeight = () => {
            if (footerRef.current && spacerRef.current) {
                spacerRef.current.style.height = `${footerRef.current.offsetHeight}px`;
            }
        };

        // Initial measurement + attach resize listener
        updateHeight();
        window.addEventListener('resize', updateHeight);

        const ctx = gsap.context(() => {
            gsap.from('.footer-animate-up', {
                scrollTrigger: {
                    trigger: spacerRef.current, // Use spacer as trigger for the reveal
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out'
            });
            
            gsap.from('.footer-line', {
                scrollTrigger: {
                    trigger: spacerRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scaleX: 0,
                transformOrigin: 'center',
                duration: 1.5,
                ease: 'power3.inOut'
            });
        }, footerRef);

        return () => {
            ctx.revert();
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    return (
        <>
            {/* The invisible spacer that sits in normal flow, giving the document enough height to scroll past main content */}
            <div ref={spacerRef} className="w-full pointer-events-none bg-transparent" style={{ zIndex: 0 }} />

            {/* The actual footer sits fixed at the bottom, behind the main content — revealing as main content slides up */}
            <footer ref={footerRef} className="fixed bottom-0 left-0 w-full pt-16 pb-12 overflow-hidden bg-slate-950 z-0 border-t border-white/5">
            <style>{ANIMATION_STYLES}</style>

            {/* Ambient Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-[100%]"
                    style={{
                        background: 'radial-gradient(ellipse at bottom, rgba(6,182,212,0.15) 0%, transparent 60%)',
                        filter: 'blur(60px)',
                        animation: 'pulse-slow 8s infinite alternate'
                    }}
                />
                
                {/* Floating Tech Particles */}
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute bottom-0 w-1 h-1 rounded-full bg-selam-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animation: `float-particle ${5 + Math.random() * 5}s linear infinite`,
                            animationDelay: `-${Math.random() * 10}s`,
                            opacity: 0
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* The CTA has been removed as per user request */}

                {/* ── FOOTER GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 footer-animate-up">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-selam-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                <svg className="w-6 h-6 text-selam-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-display font-bold text-white tracking-wide">
                                Selam<span className="text-selam-cyan">Care</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                            Next-generation medical infrastructure. Powering the world's most advanced and responsive clinical environments through glassmorphic intelligence.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-sm">Platform</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="footer-link">Unified Dashboard</a></li>
                            <li><a href="#" className="footer-link">Patient Telemetry</a></li>
                            <li><a href="#" className="footer-link">Auto-Sync Billing</a></li>
                            <li><a href="#" className="footer-link">AI Scheduling</a></li>
                        </ul>
                    </div>

                    {/* Infrastructure Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-sm">Infrastructure</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="footer-link">Security Center</a></li>
                            <li><a href="#" className="footer-link">API Documentation</a></li>
                            <li><a href="#" className="footer-link">System Status</a></li>
                            <li><a href="#" className="footer-link">Integration Hub</a></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-sm">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="footer-link">About Us</a></li>
                            <li><a href="#" className="footer-link">Careers</a></li>
                            <li><a href="#" className="footer-link">Contact</a></li>
                            <li><a href="#" className="footer-link">Legal & Privacy</a></li>
                        </ul>
                    </div>
                </div>

                {/* ── BOTTOM DIVIDER & COPYRIGHT ── */}
                <div className="relative pt-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="footer-line absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <p className="text-slate-500 text-sm mb-4 md:mb-0 footer-animate-up">
                        &copy; 2026 Selam Care Inc. All rights reserved.
                    </p>
                    
                    <div className="flex gap-6 footer-animate-up">
                        <a href="#" className="text-slate-500 hover:text-selam-cyan transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        </a>
                        <a href="#" className="text-slate-500 hover:text-selam-cyan transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                        <a href="#" className="text-slate-500 hover:text-selam-cyan transition-colors">
                            <span className="sr-only">GitHub</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                    </div>
                </div>

            </div>
            </footer>
        </>
    );
}
