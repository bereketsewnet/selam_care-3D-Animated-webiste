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
                .to(".logo-text-reveal", { width: 150, opacity: 1, ease: "power2.inOut" }, 0);

        }, headerRef);

        return () => ctx.revert();
    }, []);

    return (
        <header
            ref={headerRef}
            /* justify-center + gap keeps the group centered — no spacers to corners */
            className="fixed top-0 left-0 w-full z-50 px-8 py-5 flex items-center justify-center gap-5 pointer-events-none"
        >
            {/* Logo icon + sliding wordmark (text starts at width:0) */}
            <div className="flex flex-shrink-0 items-center pointer-events-auto cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-md shrink-0">
                    <Activity className="text-selam-cyan" size={24} />
                </div>
                {/* Width animates from 0 → 150px on scroll */}
                <div className="logo-text-reveal overflow-hidden whitespace-nowrap">
                    <span className="text-white font-bold text-2xl tracking-wide pl-3 inline-block">
                        Selam<span className="text-selam-cyan">Care</span>
                    </span>
                </div>
            </div>

            {/* Nav pill — stays next to logo, no spacer spreading to edges */}
            <nav className="hidden md:flex flex-shrink-0 items-center gap-8 pointer-events-auto glass-panel px-8 py-4 rounded-full shadow-lg">
                {['Product', 'Infrastructure', 'Features', 'About'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="text-base font-medium text-slate-300 hover:text-white transition-colors relative group"
                    >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-selam-cyan transition-all duration-300 group-hover:w-full" />
                    </a>
                ))}
            </nav>
        </header>
    );
}
