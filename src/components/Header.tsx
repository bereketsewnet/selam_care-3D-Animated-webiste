import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Activity } from 'lucide-react';

export function Header() {
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Entrance animation for header
        gsap.fromTo(
            headerRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out', delay: 0.2 }
        );
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between pointer-events-none"
        >
            <div className="flex items-center gap-3 pointer-events-auto cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Activity className="text-selam-cyan" size={20} />
                </div>
                <span className="text-white font-bold text-xl tracking-wide">Selam<span className="text-selam-cyan">Care</span></span>
            </div>

            <nav className="hidden md:flex items-center gap-8 pointer-events-auto glass-panel px-8 py-3 rounded-full">
                {['Product', 'Infrastructure', 'Features', 'About'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
                    >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-selam-cyan transition-all duration-300 group-hover:w-full" />
                    </a>
                ))}
            </nav>

            <div className="pointer-events-auto">
                <button className="text-sm font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full transition-all">
                    Log In
                </button>
            </div>
        </header>
    );
}
