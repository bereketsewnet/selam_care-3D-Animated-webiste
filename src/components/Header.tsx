import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function Header() {
    const headerRef = useRef<HTMLElement>(null);
    const [activeSection, setActiveSection] = useState('product');

    useEffect(() => {
        // Entrance animation — drop down from above
        gsap.fromTo(
            headerRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out', delay: 0.2 }
        );

        const ctx = gsap.context(() => {
            // Initially hide the "SelamCare" wordmark — it lives between logo and nav
            gsap.set(".logo-text-reveal", { width: 0, opacity: 0 });

            // On scroll: only widen the text container — logo+nav stay centered,
            // text slides out between them. NO spacer animation → no corner spreading.
            gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "+=400",
                    scrub: 2,
                }
            })
                .to(".logo-text-reveal", { width: 130, opacity: 1, ease: "power2.inOut" }, 0);

        }, headerRef);

        // Active Section Scroll Tracking
        const updateActiveSection = () => {
            const scrollY = window.scrollY;
            const triggers = ScrollTrigger.getAll();
            
            let current = 'product'; // default fallback
            
            for (const st of triggers) {
                if (st.vars.trigger) {
                    const el = st.vars.trigger as HTMLElement;
                    let id = el.id;
                    
                    // Map generic canvas IDs to their section names
                    if (id === 'section-2' || id === 'infrastructure') id = 'infrastructure';
                    if (id === 'section-3' || id === 'features') id = 'features';
                    if (id === 'section-4' || id === 'about') id = 'about';

                    // If we cross the start 'tripwire' of a main section container
                    if (id && ['product', 'infrastructure', 'features', 'about'].includes(id)) {
                        if (scrollY >= st.start - 50) { 
                            current = id; // the deepest section on page wins
                        }
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', updateActiveSection, { passive: true });

        return () => {
            ctx.revert();
            window.removeEventListener('scroll', updateActiveSection);
        };
    }, []);

    return (
        <header
            ref={headerRef}
            /* justify-center + gap keeps the group centered — no spacers to corners */
            className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-center gap-4 pointer-events-none"
        >
            {/* Logo icon + sliding wordmark (text starts at width:0) */}
            <div className="flex flex-shrink-0 items-center pointer-events-auto cursor-pointer group">
                <div className="header-ui-box w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-300 shadow-md shrink-0">
                    <Activity className="text-selam-cyan" size={20} />
                </div>
                {/* Width animates from 0 → 130px on scroll */}
                <div className="logo-text-reveal overflow-hidden whitespace-nowrap">
                    <span className="logo-text font-display text-white font-bold text-xl tracking-wide pl-3 inline-block transition-colors duration-300">
                        Selam<span className="text-selam-cyan">Care</span>
                    </span>
                </div>
            </div>

            {/* Nav pill — stays next to logo, no spacer spreading to edges */}
            <nav className="header-ui-box hidden md:flex flex-shrink-0 items-center gap-6 pointer-events-auto bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full shadow-lg transition-all duration-300">
                {['Product', 'Infrastructure', 'Features', 'About'].map((item) => {
                    const targetId = `#${item.toLowerCase()}`;
                    return (
                        <a
                            key={item}
                            href={targetId}
                            onClick={(e) => {
                                e.preventDefault();
                                
                                if (item === 'Product') {
                                    gsap.to(window, { duration: 1.5, scrollTo: { y: 0, offsetY: 0 }, ease: "power3.inOut" });
                                    return;
                                }

                                // Find the ScrollTrigger that belongs to the target section
                                const triggers = ScrollTrigger.getAll();
                                const sectionTriggers = triggers.filter(st => {
                                    if (st.vars.trigger) {
                                        const el = st.vars.trigger as HTMLElement;
                                        const id = el.id;
                                        if (item === 'Infrastructure' && (id === 'section-2' || id === 'infrastructure')) return true;
                                        if (item === 'Features' && (id === 'section-3' || id === 'features')) return true;
                                        if (item === 'About' && (id === 'section-4' || id === 'about')) return true;
                                    }
                                    return false;
                                });

                                // Some sections have multiple triggers (e.g. CanvasSequence pinning VS standard trigger).
                                // The first one attached to the section container is usually the main pin.
                                if (sectionTriggers.length > 0) {
                                    const st = sectionTriggers[0];
                                    let scrollTarget = st.start;
                                    
                                    // Add the transition offsets to leap over the cinematic transitions
                                    // And also scroll ~95% through the section's pin to show full content
                                    // Both Features and About use a +=400% budget.
                                    if (item === 'Features') {
                                        scrollTarget += (window.innerHeight * 3.8); 
                                    } else if (item === 'About') {
                                        scrollTarget += (window.innerHeight * 3.8); 
                                    }

                                    gsap.to(window, { duration: 1.5, scrollTo: { y: scrollTarget, offsetY: 0 }, ease: "power3.inOut" });
                                } else {
                                    // Fallback if ScrollTrigger isn't found
                                    gsap.to(window, { duration: 1.5, scrollTo: { y: targetId, offsetY: 0 }, ease: "power3.inOut" });
                                }
                            }}
                            className={`nav-link flex flex-col items-center justify-center text-sm font-medium transition-colors duration-300 relative group ${
                                activeSection === item.toLowerCase() ? 'text-white' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            {item}
                            {/* Persistent dot if active */}
                            <span 
                                className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-selam-cyan transition-all duration-300 ${
                                    activeSection === item.toLowerCase() ? 'opacity-100 scale-100 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-50'
                                }`} 
                            />
                        </a>
                    );
                })}
            </nav>
        </header>
    );
}
