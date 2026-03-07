import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Header() {
    const headerRef = useRef<HTMLElement>(null);

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

        return () => ctx.revert();
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
                {['Product', 'Infrastructure', 'Features', 'About'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="nav-link text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300 relative group"
                    >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-selam-cyan transition-all duration-300 group-hover:w-full" />
                    </a>
                ))}
            </nav>
        </header>
    );
}
